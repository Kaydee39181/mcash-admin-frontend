import React, { useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import useNotificationPreferences from "../../../hooks/useNotificationPreferences";

const TOAST_CONTAINER_ID = "transaction-alerts";

const NotificationSettings = () => {
  const { preferences, updatePreferences } = useNotificationPreferences();

  const browserSupport = typeof window !== "undefined" && "Notification" in window;
  const permissionState = browserSupport ? window.Notification.permission : "unsupported";

  const permissionLabel = useMemo(() => {
    switch (permissionState) {
      case "granted":
        return "Allowed";
      case "denied":
        return "Blocked";
      case "default":
        return "Not requested";
      default:
        return "Unsupported";
    }
  }, [permissionState]);

  const handleMasterToggle = (event) => {
    const enabled = event.target.checked;
    updatePreferences((current) => ({
      ...current,
      enabled,
    }));
  };

  const handleSummaryToggle = (event) => {
    const summaryNotifications = event.target.checked;
    updatePreferences((current) => ({
      ...current,
      summaryNotifications,
    }));
  };

  const handleBrowserToggle = async (event) => {
    const browserNotifications = event.target.checked;

    if (!browserSupport) {
      toast.error("This device does not support browser notifications.", {
        containerId: TOAST_CONTAINER_ID,
      });
      updatePreferences((current) => ({
        ...current,
        browserNotifications: false,
      }));
      return;
    }

    if (!browserNotifications) {
      updatePreferences((current) => ({
        ...current,
        browserNotifications: false,
      }));
      return;
    }

    const permission =
      permissionState === "granted"
        ? "granted"
        : await window.Notification.requestPermission();

    if (permission !== "granted") {
      toast.info("Notification permission was not granted on this device.", {
        containerId: TOAST_CONTAINER_ID,
      });
      updatePreferences((current) => ({
        ...current,
        browserNotifications: false,
      }));
      return;
    }

    updatePreferences((current) => ({
      ...current,
      enabled: true,
      browserNotifications: true,
    }));
    toast.success("Browser notifications enabled.", {
      containerId: TOAST_CONTAINER_ID,
    });
  };

  const requestPermission = async () => {
    if (!browserSupport) {
      toast.error("This device does not support browser notifications.", {
        containerId: TOAST_CONTAINER_ID,
      });
      return;
    }

    const permission = await window.Notification.requestPermission();

    if (permission === "granted") {
      toast.success("Notification permission granted.", {
        containerId: TOAST_CONTAINER_ID,
      });
    } else {
      toast.info("Notification permission is still unavailable.", {
        containerId: TOAST_CONTAINER_ID,
      });
    }
  };

  return (
    <div className="main-tabs notification-settings-panel">
      <Form>
        <div className="notification-settings-header">
          <div>
            <h4>Transaction Notifications</h4>
            <p>
              Receive polling-based alerts for new transactions while the app is
              open or recently active on this device.
            </p>
          </div>
          <div className="notification-permission-pill">
            Permission: {permissionLabel}
          </div>
        </div>

        <div className="notification-settings-note">
          Without backend push support, notifications are frontend-only. They work
          best when the PWA is installed and the app is open, visible again, or
          still active in the background.
        </div>

        <div className="notification-settings-group">
          <Form.Check
            label="Enable transaction alerts"
            type="switch"
            id="transaction-alerts-switch"
            checked={preferences.enabled}
            onChange={handleMasterToggle}
          />
          <div className="notification-settings-help">
            Polls recent transactions and shows in-app alerts with short summaries.
          </div>
        </div>

        <div className="notification-settings-group">
          <Form.Check
            label="Enable device notifications"
            type="switch"
            id="browser-alerts-switch"
            checked={preferences.browserNotifications}
            onChange={handleBrowserToggle}
            disabled={!preferences.enabled || !browserSupport}
          />
          <div className="notification-settings-help">
            Uses your browser notification permission for mobile or desktop alerts
            when the app is not in the foreground.
          </div>
        </div>

        <div className="notification-settings-group">
          <Form.Check
            label="Show summary digest"
            type="switch"
            id="summary-alerts-switch"
            checked={preferences.summaryNotifications}
            onChange={handleSummaryToggle}
            disabled={!preferences.enabled}
          />
          <div className="notification-settings-help">
            Adds a compact summary when multiple new transactions arrive together.
          </div>
        </div>

        <div className="notification-settings-actions">
          <Button
            variant="outline-primary"
            type="button"
            onClick={requestPermission}
            disabled={!browserSupport}
          >
            Request Permission
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NotificationSettings;
