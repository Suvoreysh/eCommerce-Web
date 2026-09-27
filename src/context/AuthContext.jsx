import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { BASE_URL } from "../api/config";
import { cacheClear } from "../utils/apiCache";

const AuthContext = createContext(null);

function getToken() {
  return localStorage.getItem("authToken");
}

async function apiFetchProfile(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Profile fetch failed");
  const json = await res.json();
  return json?.data ?? json;
}

/**
 * GET /profile/image response shape:
 * { success: true, message: "...", data: { image: "<full url>", thumbnail_image: "<url>" } }
 */
async function apiFetchProfileImage(token) {
  try {
    const res = await fetch(`${BASE_URL}/profile/image`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Primary: data.image | fallback chain for any other shape
    return (
      json?.data?.image ??
      json?.data?.url ??
      json?.data?.profile_image ??
      json?.image ??
      json?.url ??
      null
    );
  } catch {
    return null;
  }
}

function normaliseProfile(raw, profileImageUrl = undefined) {
  if (!raw) return null;
  const nameParts = [raw.first_name, raw.middle_name, raw.last_name]
    .filter(Boolean)
    .join(" ");

  const image =
    profileImageUrl !== undefined
      ? profileImageUrl
      : raw.profile_image || raw.image || null;

  return {
    ...raw,
    name: nameParts || raw.user_name || raw.name || "User",
    email: raw.email_id || raw.email || "",
    phone: raw.phone_number || raw.phone || "",
    image,
    memberSince: raw.created_at
      ? new Date(raw.created_at).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileReady, setProfileReady] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setProfileReady(true);
      return null;
    }
    try {
      const [raw, imageUrl] = await Promise.all([
        apiFetchProfile(token),
        apiFetchProfileImage(token),
      ]);
      // imageUrl from /profile/image takes priority; fall back to /me fields
      const resolvedImage = imageUrl || raw?.profile_image || raw?.image || null;
      const normalised = normaliseProfile(raw, resolvedImage);
      setUser(normalised);
      setProfileReady(true);
      return normalised;
    } catch (err) {
      console.error("fetchProfile failed:", err);
      setUser(null);
      setProfileReady(true);
      return null;
    }
  }, []);

  // On mount: token exists → fetch profile from API only
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setProfileReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [raw, imageUrl] = await Promise.all([
          apiFetchProfile(token),
          apiFetchProfileImage(token),
        ]);
        if (cancelled) return;
        const resolvedImage = imageUrl || raw?.profile_image || raw?.image || null;
        const normalised = normaliseProfile(raw, resolvedImage);
        setUser(normalised);
      } catch {
        if (!cancelled) {
          localStorage.removeItem("authToken");
          setUser(null);
        }
      } finally {
        if (!cancelled) setProfileReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (_userData, token) => {
    localStorage.removeItem("authUser");
    cacheClear();
    if (token) localStorage.setItem("authToken", token);
    await fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    cacheClear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchProfile, profileReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
