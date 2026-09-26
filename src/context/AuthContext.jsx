import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { BASE_URL } from "../api/config";

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
 * Normalise the raw /me API payload to the shape the rest of the app uses.
 * API fields: first_name, last_name, email_id, phone_number, profile_image, …
 */
function normaliseProfile(raw) {
  if (!raw) return null;
  const nameParts = [raw.first_name, raw.middle_name, raw.last_name]
    .filter(Boolean)
    .join(" ");
  return {
    ...raw,
    // Convenience aliases used throughout the UI
    name: nameParts || raw.user_name || raw.name || "User",
    email: raw.email_id || raw.email || "",
    phone: raw.phone_number || raw.phone || "",
    image: raw.profile_image || raw.image || null,
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
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? normaliseProfile(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });

  // On mount: if we already have a token, re-fetch the profile to stay fresh
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let cancelled = false;
    apiFetchProfile(token)
      .then((raw) => {
        if (cancelled) return;
        const normalised = normaliseProfile(raw);
        setUser(normalised);
        localStorage.setItem("authUser", JSON.stringify(normalised));
      })
      .catch(() => {
        // Token may have expired — leave the locally cached user in place;
        // the next authenticated API call will surface a 401 naturally.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Fetches the latest profile from the API and updates local state + storage.
   * Call this after any mutation (image upload, profile edit, etc.).
   */
  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const raw = await apiFetchProfile(token);
      const normalised = normaliseProfile(raw);
      setUser(normalised);
      localStorage.setItem("authUser", JSON.stringify(normalised));
      return normalised;
    } catch (err) {
      console.error("fetchProfile failed:", err);
    }
  }, []);

  const login = useCallback(async (userData, token) => {
    if (token) localStorage.setItem("authToken", token);
    // After login always fetch fresh profile rather than trusting login payload
    const storedToken = token || getToken();
    try {
      const raw = await apiFetchProfile(storedToken);
      const normalised = normaliseProfile(raw);
      localStorage.setItem("authUser", JSON.stringify(normalised));
      setUser(normalised);
    } catch {
      // Fallback: use what the login endpoint returned
      const normalised = normaliseProfile(userData);
      localStorage.setItem("authUser", JSON.stringify(normalised));
      setUser(normalised);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
