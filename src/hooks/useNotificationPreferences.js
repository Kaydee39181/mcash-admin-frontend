import { useCallback, useEffect, useState } from "react";

import { AUTH_STORAGE_EVENT } from "../theme";
import {
  NOTIFICATION_PREFERENCES_EVENT,
  readNotificationPreferences,
  saveNotificationPreferences,
} from "../utils/notificationPreferences";

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState(readNotificationPreferences);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncPreferences = () => {
      setPreferences(readNotificationPreferences());
    };

    window.addEventListener(NOTIFICATION_PREFERENCES_EVENT, syncPreferences);
    window.addEventListener(AUTH_STORAGE_EVENT, syncPreferences);

    return () => {
      window.removeEventListener(NOTIFICATION_PREFERENCES_EVENT, syncPreferences);
      window.removeEventListener(AUTH_STORAGE_EVENT, syncPreferences);
    };
  }, []);

  const updatePreferences = useCallback((updater) => {
    const currentPreferences = readNotificationPreferences();
    const nextPreferences =
      typeof updater === "function"
        ? updater(currentPreferences)
        : {
            ...currentPreferences,
            ...updater,
          };

    const savedPreferences = saveNotificationPreferences(nextPreferences);
    setPreferences(savedPreferences);
    return savedPreferences;
  }, []);

  return {
    preferences,
    updatePreferences,
  };
};

export default useNotificationPreferences;
