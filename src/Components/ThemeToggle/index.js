import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../theme";
import "./style.css";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className={`theme-toggle${isDark ? " is-dark" : ""}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextThemeLabel} mode`}
      title={`Switch to ${nextThemeLabel} mode`}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
          <FiSun />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
          <FiMoon />
        </span>
        <span className="theme-toggle__thumb" aria-hidden="true">
          {isDark ? <FiMoon /> : <FiSun />}
        </span>
      </span>
    </button>
  );
}
