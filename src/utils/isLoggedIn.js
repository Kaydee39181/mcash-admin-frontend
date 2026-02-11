export const isLoggedIn = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);
    return !!data;
  } catch {
    return false;
  }
};