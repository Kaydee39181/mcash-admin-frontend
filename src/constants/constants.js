//  Normalize the base URL (remove trailing slash)
const normalizeBaseUrl = (url) => {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

//  Use .env if provided (must be REACT_APP_BASE_URL)
const BASE_URL = normalizeBaseUrl(
  process.env.REACT_APP_BASE_URL || "https://api.mcashpoint.com"
);

export const AgentConstant = {
  // Auth
  LOGIN_AGENT_URL: `${BASE_URL}/api/v1/login`,

  // Agents & Transactions
  FETCH_TRANSACTIONS_URL: `${BASE_URL}/api/v1/transaction?`,
  FETCH_AGENT_URL: `${BASE_URL}/api/v1/agent?`,
  FETCH_AGENT_MANAGER_URL: `${BASE_URL}/api/v1/agent/manager?`,
  FETCH_ALL_AGENT_MANAGERS: `${BASE_URL}/api/v1/agent/manager`,

  // Dashboard
  DASHBOARD_BREAKDOWN_URL: `${BASE_URL}/api/v1/dashboard/daily/breakdown`,
  DASHBOARD_TRANSACTION_DETAILS_URL: `${BASE_URL}/api/v1/dashboard`,

  // Audit
  FETCH_AUDIT_URL: `${BASE_URL}/api/v1/audit?`,

  // Purse
  FETCH_AGENT_PURSE_URL: `${BASE_URL}/api/v1/purse/agent?`,
  FETCH_CENTRAL_PURSE_URL: `${BASE_URL}/api/v1/purse/central?`,
  CREDIT_DEBIT_PURSE_URL: `${BASE_URL}/api/v1/purse/creditordebit`,
  PURSE_BALANCE_SUMMARY_URL: `${BASE_URL}/api/v1/purse/balance/general`,

  // Terminal / Activation
  ACTIVATION_CODE_URL: `${BASE_URL}/api/v1/terminal/activation/generate?agentId=`,
  FETCH_BANK_TERMINAAL_URL: `${BASE_URL}/api/v1/terminal/banks?agentId=`,
  ACTIVATE_ASSIGN_TERMINAL_URL: `${BASE_URL}/api/v1/terminal/assign?agentId=`,
  UNACTIVATE_ASSIGN_TERMINAL_URL: `${BASE_URL}/api/v1/terminal/unassign?agentId=`,

  // User / Password / Status
  CHANGE_PASSWORD_URL: `${BASE_URL}/api/v1/user/password`,
  ACTIVATE_DEACTIVATE_USER_URL: `${BASE_URL}/api/v1/user/activate-deactivate`,
  RESET_AGENT_PASSWORD_URL: `${BASE_URL}/api/v1/user/password/reset?userId=`,

  // Location / Banks
  FETCH_STATE_URL: `${BASE_URL}/api/v1/state`,
  FETCH_LGA_URL: `${BASE_URL}/api/v1/lga?stateCode=`,
  FETCH_BANK_URL: `${BASE_URL}/api/v1/bank`,

  // Agent manager + Roles
  CREATE_AGENT_MANAGER_URL: `${BASE_URL}/api/v1/agent/manager`,
  CREATE_AGENT_URL: `${BASE_URL}/api/v1/agent`,
  AGENT_MANAGER_SETTLEMENT_URL: `${BASE_URL}/api/v1/agent/manager/settlement?`,
  FETCH_ROLE_URL: `${BASE_URL}/api/v1/rolegroup/roles`,
  FETCH_ROLE_GROUPS_URL: `${BASE_URL}/api/v1/rolegroup/`,
  CREATE_ROLE_GROUP_URL: `${BASE_URL}/api/v1/rolegroup`,

  // App version
  API_VERSION_URL: `${BASE_URL}/api/v1/app/version`,

  // Transactions meta
  FETCH_TRANSACTIONS_TYPES_URL: `${BASE_URL}/api/v1/transaction/types`,
  FETCH_TRANSACTIONS_STATUS_URL: `${BASE_URL}/api/v1/transaction/status`,

  // Admin
  ADMIN_USERS_URL: `${BASE_URL}/api/v1/admin?`,

  // Convenience
  MAXIMUM_RANGE_URL: `${BASE_URL}/api/v1/convenience/maximum/range?`,
  CONVIENIENCE_FEE_URL: `${BASE_URL}/api/v1/convenience`,

  // Pin
  CREATE_PIN: `${BASE_URL}/api/v1/agent/transaction/pin/create`,
  RESET_PIN: `${BASE_URL}/api/v1/agent/transaction/pin/reset`,

  // External integrations (unchanged)
  OPEN_GTB_ACCOUNT: `https://collection.gtbank.com/SANEF/AccountOpening/Api/AccountOpening3`,
  FETCH_BVN: `https://collection.gtbank.com/AppServices/GTBRequestService/Api/GetSingleBVN`,
  GET_NDPRCODE: `https://collection.gtbank.com/SANEF/AccountOpening/Api/AccountOpeningConsent`,
  CARD_LINKING: `http://gtweb.gtbank.com/Imamat/AccountOpeningTestSanef2/sanef/api/v1/agencybanking/cardrequest/linkCard`,
};
