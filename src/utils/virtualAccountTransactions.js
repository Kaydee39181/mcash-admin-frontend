const AGENT_BANK_NAME = "Globus Bank";
const PENDING_STATUS_MARKERS = ["PENDING", "PROCESSING", "IN PROGRESS", "INITIATED", "QUEUED", "AWAITING"];
const FAILURE_STATUS_MARKERS = [
  "FAIL",
  "FAILED",
  "ERROR",
  "DECLINED",
  "REVERSED",
  "UNSUCCESSFUL",
  "NOT SUCCESSFUL",
  "TIMEOUT",
];

const toText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const pickFirst = (...values) => {
  for (const value of values) {
    const normalizedValue = toText(value);

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return "";
};

const combineName = (...values) => {
  const filteredValues = values.map((value) => toText(value)).filter(Boolean);
  return filteredValues.join(" ").trim();
};

const combineFirstAndLastName = (firstname, lastname) =>
  combineName(firstname, lastname);

const normalizeSearchValue = (value) => toText(value).toLowerCase();

const parseAmount = (value) => {
  const normalizedValue = toText(value).replace(/,/g, "");

  if (!normalizedValue) {
    return null;
  }

  const amount = Number(normalizedValue);
  return Number.isNaN(amount) ? null : amount;
};

const getPreBalance = (transaction) =>
  parseAmount(
    pickFirst(
      transaction?.preBalance,
      transaction?.preWalletBalance,
      transaction?.prePurseBalance,
      transaction?.preTransactionBalance,
      transaction?.previousBalance
    )
  );

const getPostBalance = (transaction) =>
  parseAmount(
    pickFirst(
      transaction?.postBalance,
      transaction?.postWalletBalance,
      transaction?.postPurseBalance,
      transaction?.postTransactionBalance,
      transaction?.currentBalance
    )
  );

const parseMetaPayload = (meta) => {
  if (!meta) {
    return null;
  }

  if (typeof meta === "object") {
    return meta;
  }

  const normalizedMeta = toText(meta);
  if (!normalizedMeta) {
    return null;
  }

  try {
    return JSON.parse(normalizedMeta);
  } catch {
    return null;
  }
};

const getTransactionTimestamp = (transaction) => {
  const rawValue = pickFirst(
    transaction?.transactionDate,
    transaction?.createdAt,
    transaction?.systemTime,
    transaction?.appTime,
    transaction?.date,
    transaction?.timestamp
  );

  if (!rawValue) {
    return null;
  }

  const parsedTimestamp = new Date(rawValue).getTime();
  return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp;
};

const createParty = (name = "", bankName = "", accountNumber = "") => ({
  name: toText(name),
  bankName: toText(bankName),
  accountNumber: toText(accountNumber),
});

const hasPartyData = (party) =>
  Boolean(party?.name || party?.bankName || party?.accountNumber);

const withFallbackParty = (party) => {
  if (!hasPartyData(party)) {
    return createParty("N/A", "N/A", "N/A");
  }

  return createParty(
    party.name || "N/A",
    party.bankName || "N/A",
    party.accountNumber || "N/A"
  );
};

const createEmptyParty = () => createParty("", "", "");

const readNameFromEntity = (entity) => {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  return pickFirst(
    combineFirstAndLastName(entity.firstname, entity.lastname),
    combineFirstAndLastName(entity.user?.firstname, entity.user?.lastname),
    entity.accountName,
    entity.name,
    entity.fullName,
    entity.user?.fullName,
    entity.businessName,
    entity.customerName,
    entity.beneficiaryName,
    entity.receiverName,
    entity.senderName,
    entity.user?.accountName,
    entity.user?.name
  );
};

const readAccountNumberFromEntity = (entity) => {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  return pickFirst(
    entity.globusVirtualAccount,
    entity.accountNumber,
    entity.virtualAccount,
    entity.virtualAccountNumber,
    entity.beneficiaryAccountNumber,
    entity.destinationAccountNumber,
    entity.number,
    entity.account?.accountNumber,
    entity.account?.number
  );
};

const readBankNameFromEntity = (entity) => {
  if (!entity || typeof entity !== "object") {
    return "";
  }

  return pickFirst(
    entity.bankName,
    entity.destinationBank,
    entity.beneficiaryBankName,
    entity.institutionName,
    entity.bank?.name,
    typeof entity.bank === "string" ? entity.bank : "",
    entity.account?.bankName
  );
};

const getCounterpartyParty = (transaction) => {
  const meta = parseMetaPayload(transaction?.meta);

  return createParty(
    pickFirst(
      transaction?.accountName,
      meta?.sourceAccountName,
      transaction?.beneficiaryAccountName,
      transaction?.beneficiaryName,
      transaction?.destinationAccountName,
      transaction?.receiverName,
      transaction?.customerName,
      readNameFromEntity(transaction?.receiver),
      readNameFromEntity(transaction?.destinationAccount),
      readNameFromEntity(transaction?.beneficiary),
      readNameFromEntity(transaction?.account)
    ),
    pickFirst(
      transaction?.bankName,
      meta?.sourceBankName,
      transaction?.beneficiaryBankName,
      transaction?.beneficiaryBank,
      transaction?.destinationBank,
      transaction?.receiverBankName,
      readBankNameFromEntity(transaction?.receiver),
      readBankNameFromEntity(transaction?.destinationAccount),
      readBankNameFromEntity(transaction?.beneficiary),
      readBankNameFromEntity(transaction?.account)
    ),
    pickFirst(
      transaction?.accountNumber,
      meta?.sourceAccount,
      transaction?.beneficiaryAccountNumber,
      transaction?.beneficiaryAccountNo,
      transaction?.destinationAccountNumber,
      transaction?.receiverAccountNumber,
      readAccountNumberFromEntity(transaction?.receiver),
      readAccountNumberFromEntity(transaction?.destinationAccount),
      readAccountNumberFromEntity(transaction?.beneficiary),
      readAccountNumberFromEntity(transaction?.beneficiaryAccount),
      readAccountNumberFromEntity(transaction?.account)
    )
  );
};

const getAdminAgentParty = (transaction) =>
  createParty(
    pickFirst(
      transaction?.agent?.user?.fullName,
      combineFirstAndLastName(
        transaction?.agent?.user?.firstname,
        transaction?.agent?.user?.lastname
      ),
      readNameFromEntity(transaction?.agent?.user),
      readNameFromEntity(transaction?.agent)
    ),
    AGENT_BANK_NAME,
    pickFirst(
      transaction?.agent?.globusVirtualAccount,
      transaction?.globusVirtualAccount
    )
  );

const getAdminCustomerParty = (transaction) => {
  const meta = parseMetaPayload(transaction?.meta);

  return createParty(
    pickFirst(transaction?.accountName, meta?.sourceAccountName),
    pickFirst(transaction?.bankName, meta?.sourceBankName),
    pickFirst(transaction?.accountNumber, meta?.sourceAccount)
  );
};

const getAdminParticipantDetails = (transaction) => ({
  agent: getAdminAgentParty(transaction),
  customer: getAdminCustomerParty(transaction),
});

const getTransactionTypeLabel = (transaction) =>
  pickFirst(transaction?.transactionType?.type, transaction?.type, "Virtual transaction");

const isChargeType = (transaction) =>
  getTransactionTypeLabel(transaction).toUpperCase() === "CHARGE";

const hasStatusMarker = (statusMessage, markers) => {
  const normalizedStatusMessage = toText(statusMessage).toUpperCase();

  if (!normalizedStatusMessage) {
    return false;
  }

  return markers.some((marker) => normalizedStatusMessage.includes(marker));
};

export const getTransactionStatusCategory = (transaction) => {
  const preBalance = getPreBalance(transaction);
  const postBalance = getPostBalance(transaction);
  const statusCode = toText(transaction?.statusCode).toUpperCase();
  const statusMessage = pickFirst(
    transaction?.statusMessage,
    transaction?.responseMessage,
    transaction?.message,
    transaction?.errorMessage
  );

  if (isChargeType(transaction)) {
    return "CHARGE";
  }

  if (preBalance !== null && postBalance !== null && preBalance === postBalance) {
    if (hasStatusMarker(statusMessage, PENDING_STATUS_MARKERS)) {
      return "PENDING";
    }

    return "FAILED";
  }

  if (hasStatusMarker(statusMessage, PENDING_STATUS_MARKERS)) {
    return "PENDING";
  }

  if (hasStatusMarker(statusMessage, FAILURE_STATUS_MARKERS)) {
    return "FAILED";
  }

  if (preBalance !== null && postBalance !== null && preBalance !== postBalance) {
    if (statusCode === "00" || !statusCode) {
      return "SUCCESS";
    }

    return "FAILED";
  }

  return "PENDING";
};

const matchesSearch = (needle, values) => {
  const normalizedNeedle = normalizeSearchValue(needle);

  if (!normalizedNeedle) {
    return true;
  }

  return values.some((value) =>
    normalizeSearchValue(value).includes(normalizedNeedle)
  );
};

const matchesExactType = (selectedType, transactionTypes) => {
  const normalizedSelectedType = normalizeSearchValue(selectedType);

  if (!normalizedSelectedType) {
    return true;
  }

  const candidates = Array.isArray(transactionTypes)
    ? transactionTypes
    : [transactionTypes];

  return candidates.some(
    (transactionType) =>
      normalizeSearchValue(transactionType) === normalizedSelectedType
  );
};

const matchesDateRange = (transaction, startDate, endDate) => {
  if (!toText(startDate) && !toText(endDate)) {
    return true;
  }

  const transactionTimestamp = getTransactionTimestamp(transaction);
  if (transactionTimestamp === null) {
    return false;
  }

  const startTimestamp = toText(startDate)
    ? new Date(`${startDate}T00:00:00`).getTime()
    : null;
  const endTimestamp = toText(endDate)
    ? new Date(`${endDate}T23:59:59.999`).getTime()
    : null;

  if (startTimestamp !== null && !Number.isNaN(startTimestamp) && transactionTimestamp < startTimestamp) {
    return false;
  }

  if (endTimestamp !== null && !Number.isNaN(endTimestamp) && transactionTimestamp > endTimestamp) {
    return false;
  }

  return true;
};

export const filterTransactions = (transactions, filters = {}) => {
  const transactionsToFilter = Array.isArray(transactions) ? transactions : [];
  const normalizedFilters = {
    startDate: toText(filters?.startDate),
    endDate: toText(filters?.endDate),
    transactionId: toText(filters?.transactionId),
    status: toText(filters?.status).toUpperCase(),
    accountNumber: toText(filters?.accountNumber),
    accountName: toText(filters?.accountName),
    bankName: toText(filters?.bankName),
    type: toText(filters?.type),
    reference: toText(filters?.reference),
  };

  return transactionsToFilter.filter((transaction) => {
    const { agent, customer } = getAdminParticipantDetails(transaction);
    const transactionType = getTransactionTypeLabel(transaction);
    const formattedTransactionType = pickFirst(
      formatTransactionForAdmin(transaction)?.type,
      transactionType
    );
    const transactionStatus = getTransactionStatusCategory(transaction);

    if (!matchesDateRange(transaction, normalizedFilters.startDate, normalizedFilters.endDate)) {
      return false;
    }

    if (
      !matchesSearch(normalizedFilters.transactionId, [
        transaction?.transactionId,
      ])
    ) {
      return false;
    }

    if (
      normalizedFilters.status &&
      transactionStatus !== normalizedFilters.status
    ) {
      return false;
    }

    if (
      !matchesSearch(normalizedFilters.accountNumber, [
        agent.accountNumber,
        customer.accountNumber,
      ])
    ) {
      return false;
    }

    if (
      !matchesSearch(normalizedFilters.accountName, [
        agent.name,
        customer.name,
      ])
    ) {
      return false;
    }

    if (
      !matchesSearch(normalizedFilters.bankName, [
        agent.bankName,
        customer.bankName,
      ])
    ) {
      return false;
    }

    if (
      !matchesExactType(normalizedFilters.type, [
        formattedTransactionType,
        transactionType,
      ])
    ) {
      return false;
    }

    if (
      !matchesSearch(normalizedFilters.reference, [
        transaction?.transactionId,
        transaction?.rrn,
        transaction?.stan,
      ])
    ) {
      return false;
    }

    return true;
  });
};

const getTransactionProvidedSender = (transaction) =>
  createParty(
    pickFirst(
      transaction?.senderAccountName,
      transaction?.senderName,
      transaction?.sourceAccountName,
      transaction?.originatorName,
      transaction?.payerName,
      transaction?.debitAccountName,
      readNameFromEntity(transaction?.sender),
      readNameFromEntity(transaction?.sourceAccount),
      readNameFromEntity(transaction?.originator),
      readNameFromEntity(transaction?.payer),
      readNameFromEntity(transaction?.debitAccount)
    ),
    pickFirst(
      transaction?.senderBankName,
      transaction?.sourceBankName,
      transaction?.originatorBankName,
      transaction?.payerBankName,
      transaction?.debitBankName,
      readBankNameFromEntity(transaction?.sender),
      readBankNameFromEntity(transaction?.sourceAccount),
      readBankNameFromEntity(transaction?.originator),
      readBankNameFromEntity(transaction?.payer),
      readBankNameFromEntity(transaction?.debitAccount)
    ),
    pickFirst(
      transaction?.senderAccountNumber,
      transaction?.sourceAccountNumber,
      transaction?.originatorAccountNumber,
      transaction?.payerAccountNumber,
      transaction?.debitAccountNumber,
      readAccountNumberFromEntity(transaction?.sender),
      readAccountNumberFromEntity(transaction?.sourceAccount),
      readAccountNumberFromEntity(transaction?.originator),
      readAccountNumberFromEntity(transaction?.payer),
      readAccountNumberFromEntity(transaction?.debitAccount)
    )
  );

const getTransactionProvidedReceiver = (transaction) => {
  const preferredReceiver = createParty(
    pickFirst(
      transaction?.receiverAccountName,
      transaction?.receiverName,
      transaction?.beneficiaryAccountName,
      transaction?.beneficiaryName,
      transaction?.destinationAccountName,
      transaction?.creditAccountName,
      readNameFromEntity(transaction?.receiver),
      readNameFromEntity(transaction?.destinationAccount),
      readNameFromEntity(transaction?.beneficiary),
      readNameFromEntity(transaction?.creditAccount)
    ),
    pickFirst(
      transaction?.receiverBankName,
      transaction?.beneficiaryBankName,
      transaction?.beneficiaryBank,
      transaction?.destinationBank,
      transaction?.creditBankName,
      readBankNameFromEntity(transaction?.receiver),
      readBankNameFromEntity(transaction?.destinationAccount),
      readBankNameFromEntity(transaction?.beneficiary),
      readBankNameFromEntity(transaction?.creditAccount)
    ),
    pickFirst(
      transaction?.receiverAccountNumber,
      transaction?.beneficiaryAccountNumber,
      transaction?.beneficiaryAccountNo,
      transaction?.destinationAccountNumber,
      transaction?.creditAccountNumber,
      readAccountNumberFromEntity(transaction?.receiver),
      readAccountNumberFromEntity(transaction?.destinationAccount),
      readAccountNumberFromEntity(transaction?.beneficiary),
      readAccountNumberFromEntity(transaction?.beneficiaryAccount),
      readAccountNumberFromEntity(transaction?.creditAccount)
    )
  );

  if (hasPartyData(preferredReceiver)) {
    return preferredReceiver;
  }

  return getCounterpartyParty(transaction);
};

const getAgentParty = (transaction, currentUser) =>
  createParty(
    pickFirst(
      combineFirstAndLastName(
        transaction?.agent?.user?.firstname,
        transaction?.agent?.user?.lastname
      ),
      combineFirstAndLastName(
        transaction?.user?.firstname,
        transaction?.user?.lastname
      ),
      currentUser?.accountName,
      currentUser?.name,
      currentUser?.fullName,
      transaction?.agent?.accountName,
      transaction?.agent?.businessName,
      readNameFromEntity(transaction?.agent)
    ),
    pickFirst(
      currentUser?.bankName,
      AGENT_BANK_NAME
    ),
    pickFirst(
      transaction?.agent?.globusVirtualAccount,
      transaction?.globusVirtualAccount,
      currentUser?.accountNumber,
      currentUser?.virtualAccount,
      currentUser?.virtualAccountNumber,
      transaction?.agent?.virtualAccount,
      transaction?.agent?.virtualAccountNumber,
      transaction?.agent?.accountNumber
    )
  );

const isVirtualAccountTransaction = (transaction) =>
  pickFirst(transaction?.transactionType?.type, transaction?.type)
    .toUpperCase()
    .includes("VIRTUAL ACCOUNT");

const detectChargeTransaction = (transaction) => {
  const fingerprint = [
    transaction?.transactionType?.type,
    transaction?.status,
    transaction?.statusCode,
    transaction?.statusMessage,
    transaction?.responseMessage,
    transaction?.message,
    transaction?.narration,
    transaction?.description,
    transaction?.reference,
  ]
    .map((value) => toText(value).toUpperCase())
    .filter(Boolean)
    .join(" ");

  return (
    fingerprint.includes("CHARGE") ||
    fingerprint.includes("FEE") ||
    fingerprint.includes("STAMP DUTY") ||
    fingerprint.includes("CONVENIENCE")
  );
};

const getFailedMessage = (transaction) =>
  pickFirst(
    transaction?.errorMessage,
    transaction?.error?.message,
    transaction?.responseMessage,
    transaction?.message,
    transaction?.statusMessage
  ) || "Transaction failed";

export const formatPartyForExport = (party) => {
  const normalizedParty = withFallbackParty(party);

  return [
    normalizedParty.name,
    normalizedParty.bankName,
    normalizedParty.accountNumber,
  ].join(" | ");
};

export const formatTransactionForAdmin = (transaction) => {
  const transactionType = getTransactionTypeLabel(transaction);
  const statusMessage = pickFirst(transaction?.statusMessage, transaction?.responseMessage);
  const { agent: agentParty, customer: customerParty } = getAdminParticipantDetails(transaction);
  const preBalance = getPreBalance(transaction);
  const postBalance = getPostBalance(transaction);
  const statusCategory = getTransactionStatusCategory(transaction);
  const isCharge = statusCategory === "CHARGE";

  if (isCharge) {
    return {
      sender: createEmptyParty(),
      receiver: createEmptyParty(),
      type: transactionType,
      status: "CHARGE",
      statusMessage,
    };
  }

  if (statusCategory === "PENDING") {
    return {
      sender: agentParty,
      receiver: customerParty,
      type: transactionType,
      status: "PENDING",
      statusMessage: statusMessage || "PENDING",
    };
  }

  if (preBalance !== null && postBalance !== null && preBalance === postBalance) {
    return {
      sender: agentParty,
      receiver: customerParty,
      type: transactionType,
      status: "FAILED",
      statusMessage: statusMessage || "FAILED",
    };
  }

  if (preBalance !== null && postBalance !== null && postBalance > preBalance) {
    return {
      sender: customerParty,
      receiver: agentParty,
      type: `${transactionType} Credit`,
      status: "SUCCESS",
      statusMessage: statusMessage || "TRANSACTION SUCCESSFUL",
    };
  }

  if (preBalance !== null && postBalance !== null && preBalance > postBalance) {
    return {
      sender: agentParty,
      receiver: customerParty,
      type: `${transactionType} Debit`,
      status: "SUCCESS",
      statusMessage: statusMessage || "TRANSACTION SUCCESSFUL",
    };
  }

  return {
    sender: agentParty,
    receiver: customerParty,
    type: transactionType,
    status: "SUCCESS",
    statusMessage: statusMessage || "TRANSACTION SUCCESSFUL",
  };
};

export const getTransactionPartiesAndStatus = (transaction, currentUser = {}) => {
  const preBalance = getPreBalance(transaction);
  const postBalance = getPostBalance(transaction);
  const transactionStatusCategory = getTransactionStatusCategory(transaction);

  const isCharge =
    transactionStatusCategory === "CHARGE" ||
    (preBalance !== null &&
      postBalance !== null &&
      postBalance < preBalance &&
      detectChargeTransaction(transaction));
  const isFailed =
    transactionStatusCategory === "FAILED" ||
    (preBalance !== null && postBalance !== null && preBalance === postBalance);
  const isPending = transactionStatusCategory === "PENDING";
  const isIncoming =
    preBalance !== null && postBalance !== null && postBalance > preBalance;
  const isOutgoing =
    preBalance !== null && postBalance !== null && postBalance < preBalance;

  if (isCharge) {
    return {
      sender: createEmptyParty(),
      receiver: createEmptyParty(),
      status: "CHARGE",
      errorMessage: "",
    };
  }

  const hasAgentContext = currentUser?.isAgentContext === true;
  const apiSender = getTransactionProvidedSender(transaction);
  const apiReceiver = getTransactionProvidedReceiver(transaction);
  const agentParty = getAgentParty(transaction, currentUser);
  const counterpartyParty = getCounterpartyParty(transaction);

  if (hasAgentContext) {
    if (isIncoming) {
      return {
        sender: withFallbackParty(
          hasPartyData(apiSender) ? apiSender : getCounterpartyParty(transaction)
        ),
        receiver: withFallbackParty(agentParty),
        status: "SUCCESS",
        errorMessage: "",
      };
    }

    if (isOutgoing) {
      return {
        sender: withFallbackParty(agentParty),
        receiver: withFallbackParty(apiReceiver),
        status: "SUCCESS",
        errorMessage: "",
      };
    }

    if (isFailed) {
      return {
        sender: withFallbackParty(agentParty),
        receiver: withFallbackParty(apiReceiver),
        status: "FAILED",
        errorMessage: getFailedMessage(transaction),
      };
    }

    if (isPending) {
      return {
        sender: withFallbackParty(agentParty),
        receiver: withFallbackParty(apiReceiver),
        status: "PENDING",
        errorMessage: "",
      };
    }
  }

  if (isVirtualAccountTransaction(transaction)) {
    const adminFormatted = formatTransactionForAdmin(transaction);

    return {
      sender: withFallbackParty(adminFormatted.sender),
      receiver: withFallbackParty(adminFormatted.receiver),
      status: adminFormatted.status,
      errorMessage:
        adminFormatted.status === "FAILED"
          ? adminFormatted.statusMessage || getFailedMessage(transaction)
          : "",
    };
  }

  const senderParty = hasPartyData(apiSender)
    ? apiSender
    : createEmptyParty();
  const receiverParty = hasPartyData(apiReceiver)
    ? apiReceiver
    : hasPartyData(counterpartyParty)
      ? counterpartyParty
      : createEmptyParty();

  return {
    sender: withFallbackParty(senderParty),
    receiver: withFallbackParty(receiverParty),
    status: isFailed ? "FAILED" : "SUCCESS",
    errorMessage: isFailed ? getFailedMessage(transaction) : "",
  };
};
