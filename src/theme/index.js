import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AUTH_STORAGE_EVENT = "mcash-auth-changed";

const THEME_STORAGE_PREFIX = "mcash_theme";
const GUEST_THEME_KEY = `${THEME_STORAGE_PREFIX}:guest`;
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const ThemeContext = createContext({
  theme: LIGHT_THEME,
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

const isValidTheme = (value) => value === LIGHT_THEME || value === DARK_THEME;

const safeParseStoredAuth = () => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const resolveThemeOwner = (user) => {
  if (!user) return "";

  const candidates = [
    user.id,
    user.userId,
    user.username,
    user.userName,
    user.email,
    user.agent?.id,
    user.agentId,
  ];

  const match = candidates.find(
    (candidate) =>
      candidate !== undefined &&
      candidate !== null &&
      String(candidate).trim() !== ""
  );

  return match ? String(match).trim().toLowerCase() : "";
};

export const getThemeStorageKey = () => {
  const auth = safeParseStoredAuth();
  const owner = resolveThemeOwner(auth?.user);

  return owner ? `${THEME_STORAGE_PREFIX}:${owner}` : GUEST_THEME_KEY;
};

export const readStoredTheme = () => {
  if (typeof window === "undefined") return LIGHT_THEME;

  const storedTheme = window.localStorage.getItem(getThemeStorageKey());
  return isValidTheme(storedTheme) ? storedTheme : LIGHT_THEME;
};

const applyThemeToDocument = (theme) => {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
};

const persistTheme = (theme) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getThemeStorageKey(), theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncThemeFromAuth = () => {
      setThemeState(readStoredTheme());
    };

    window.addEventListener(AUTH_STORAGE_EVENT, syncThemeFromAuth);
    return () => {
      window.removeEventListener(AUTH_STORAGE_EVENT, syncThemeFromAuth);
    };
  }, []);

  const setTheme = useCallback((nextTheme) => {
    const resolvedTheme = nextTheme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
    setThemeState(resolvedTheme);
    persistTheme(resolvedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === DARK_THEME,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
