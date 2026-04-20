const normalizeRoleName = (roleName) => {
  if (typeof roleName !== "string") return "";

  return roleName.trim();
};

export const isAgentRelationshipOfficerRole = (roleName) =>
  normalizeRoleName(roleName).toLowerCase() === "agent relationship officer";

export const isAgentManagerRole = (roleName) => {
  const normalizedRoleName = normalizeRoleName(roleName).toUpperCase();

  return (
    normalizedRoleName === "AMBASSADOR" ||
    normalizedRoleName === "AGENT MANAGER"
  );
};

export const getDisplayRoleName = (roleName) => {
  const normalizedRoleName = normalizeRoleName(roleName);

  if (isAgentManagerRole(normalizedRoleName)) {
    return "Agent Manager";
  }

  return normalizedRoleName;
};

export const isVirtualAccountRestrictedRole = (roleName) =>
  isAgentManagerRole(roleName) || isAgentRelationshipOfficerRole(roleName);
