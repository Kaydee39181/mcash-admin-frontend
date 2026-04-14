export const NOTIFICATION_PREFERENCES_EVENT = "mcash-notification-preferences-changed";

const NOTIFICATION_STORAGE_PREFIX = "mcash_notifications";
const DEFAULT_OWNER = "guest";
const MAX_TRACKED_TRANSACTION_KEYS = 120;

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  enabled: false,
  browserNotifications: false,
  summaryNotifications: true,
};

const safeParseToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("data");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const toText = (value) => String(value || "").trim();

const resolveNotificationOwner = (user) => {
  if (!user || typeof user !== "object") {
    return DEFAULT_OWNER;
  }

  const candidates = [
    user.id,
    user.userId,
    user.username,
    user.userName,
    user.email,
    user.agent?.id,
    user.agentId,
  ];

  const owner = candidates.find((candidate) => toText(candidate));
  return owner ? toText(owner).toLowerCase() : DEFAULT_OWNER;
};

const getNotificationOwner = () => resolveNotificationOwner(safeParseToken()?.user);

const getPreferenceStorageKey = () =>
  `${NOTIFICATION_STORAGE_PREFIX}:${getNotificationOwner()}:preferences`;

const getSeenTransactionsStorageKey = () =>
  `${NOTIFICATION_STORAGE_PREFIX}:${getNotificationOwner()}:seen`;

const dispatchPreferencesChanged = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(NOTIFICATION_PREFERENCES_EVENT));
};

export const readNotificationPreferences = () => {
  if (typeof window === "undefined") {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  const raw = window.localStorage.getItem(getPreferenceStorageKey());
  if (!raw) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const saveNotificationPreferences = (preferences) => {
  if (typeof window === "undefined") {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  const nextPreferences = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...preferences,
  };

  window.localStorage.setItem(
    getPreferenceStorageKey(),
    JSON.stringify(nextPreferences)
  );
  dispatchPreferencesChanged();
  return nextPreferences;
};

export const readSeenTransactionKeys = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(getSeenTransactionsStorageKey());
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const saveSeenTransactionKeys = (keys) => {
  if (typeof window === "undefined") {
    return [];
  }

  const uniqueKeys = Array.from(
    new Set((Array.isArray(keys) ? keys : []).map((key) => toText(key)).filter(Boolean))
  ).slice(0, MAX_TRACKED_TRANSACTION_KEYS);

  window.localStorage.setItem(
    getSeenTransactionsStorageKey(),
    JSON.stringify(uniqueKeys)
  );
  return uniqueKeys;
};

export const mergeSeenTransactionKeys = (keys) => {
  const nextKeys = [
    ...(Array.isArray(keys) ? keys : []),
    ...readSeenTransactionKeys(),
  ];

  return saveSeenTransactionKeys(nextKeys);
};

export const clearSeenTransactionKeys = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getSeenTransactionsStorageKey());
};
