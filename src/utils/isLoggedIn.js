const TAB_SESSION_KEY = "mcash_active_session";

const safeParseStoredAuth = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const hasActiveTabSession = () =>
  typeof window !== "undefined" &&
  window.sessionStorage.getItem(TAB_SESSION_KEY) === "1";

const isJwtExpired = (accessToken) => {
  if (!accessToken || typeof accessToken !== "string") return true;

  const tokenParts = accessToken.split(".");
  // If token is not JWT format, skip expiry decoding and rely on backend 401 handling.
  if (tokenParts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    const exp = Number(payload?.exp);
    if (!exp) return false;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowInSeconds;
  } catch {
    return true;
  }
};

export const isLoggedIn = () => {
  const data = safeParseStoredAuth();
  if (!data?.access_token || !data?.user) return false;
  if (!hasActiveTabSession()) return false;
  if (isJwtExpired(data.access_token)) return false;
  return true;
};
