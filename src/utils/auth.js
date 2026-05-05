import {
  isAgentManagerRole,
  isVirtualAccountRestrictedRole,
} from "./roleLabel";

export const safeParseStoredAuth = () => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getEffectiveRoleGroup = (authData = safeParseStoredAuth()) => {
  const roleGroup = authData?.user?.roleGroup;
  if (!roleGroup) {
    return {
      name: "",
      role: [],
    };
  }

  const name = String(roleGroup.name || "");
  const baseRoles = Array.isArray(roleGroup.role) ? roleGroup.role : [];

  if (isAgentManagerRole(name)) {
    return {
      ...roleGroup,
      name,
      role: [{ roleCode: "ROLE_VIEW_ALL_AGENT" }],
    };
  }

  if (name.trim().toUpperCase() === "AGENT") {
    return {
      ...roleGroup,
      name,
      role: [
        { roleCode: "ROLE_VIEW_ALL_AGENT" },
        { roleCode: "ROLE_VIEW_ALL_TRANSACTION" },
      ],
    };
  }

  return {
    ...roleGroup,
    name,
    role: baseRoles,
  };
};

export const getEffectiveRoles = (authData = safeParseStoredAuth()) =>
  getEffectiveRoleGroup(authData).role;

export const getEffectiveRoleName = (authData = safeParseStoredAuth()) =>
  getEffectiveRoleGroup(authData).name;

export const userHasRole = (roleCode, authData = safeParseStoredAuth()) => {
  if (!roleCode) return false;

  return getEffectiveRoles(authData).some((role) => role?.roleCode === roleCode);
};

export const isVirtualAccountAccessRestricted = (
  authData = safeParseStoredAuth()
) => isVirtualAccountRestrictedRole(getEffectiveRoleName(authData));
