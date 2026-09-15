// Small helper around the browser Geolocation API + OpenStreetMap's free
// Nominatim reverse-geocoding endpoint (no API key required) so the address
// form can auto-fill city/state/pincode/country/full address from the
// user's current GPS position with a single "Use current location" tap.

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Location isn't supported on this device/browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        let message = "Unable to fetch your location.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Your location is currently unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Fetching your location timed out. Please try again.";
        }

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
        ...options,
      },
    );
  });
}

export async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Couldn't resolve an address for this location.");
  }

  const data = await response.json();
  const address = data?.address || {};

  return {
    fullAddress: data?.display_name || "",
    houseName: address.house_number
      ? `${address.house_number} ${address.road || ""}`.trim()
      : address.building || "",
    streetName: address.road || address.neighbourhood || "",
    landmark: address.suburb || address.neighbourhood || "",
    city:
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      "",
    state: address.state || "",
    pincode: address.postcode || "",
    country: address.country_code
      ? address.country_code.toUpperCase()
      : address.country || "",
  };
}

// Convenience wrapper: get the current position and resolve it straight to
// address fields the form can spread onto its state in one call.
export async function detectCurrentAddress() {
  const coords = await getCurrentPosition();
  const geo = await reverseGeocode(coords.latitude, coords.longitude);

  return {
    ...geo,
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
  };
}
