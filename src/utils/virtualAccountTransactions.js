const AGENT_BANK_NAME = "Globus Bank";

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

const parseAmount = (value) => {
  const normalizedValue = toText(value).replace(/,/g, "");

  if (!normalizedValue) {
    return null;
  }

  const amount = Number(normalizedValue);
  return Number.isNaN(amount) ? null : amount;
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

const getCounterpartyParty = (transaction) =>
  createParty(
    pickFirst(
      transaction?.accountName,
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
      transaction?.beneficiaryAccountNumber,
      transaction?.beneficiaryAccountNo,
      transaction?.destinationAccountNumber,
      transaction?.receiverAccountNumber,
      transaction?.virtualAccountNumber,
      readAccountNumberFromEntity(transaction?.receiver),
      readAccountNumberFromEntity(transaction?.destinationAccount),
      readAccountNumberFromEntity(transaction?.beneficiary),
      readAccountNumberFromEntity(transaction?.beneficiaryAccount),
      readAccountNumberFromEntity(transaction?.account)
    )
  );

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

export const getTransactionPartiesAndStatus = (transaction, currentUser = {}) => {
  const preBalance = parseAmount(
    pickFirst(
      transaction?.preBalance,
      transaction?.preWalletBalance,
      transaction?.prePurseBalance,
      transaction?.preTransactionBalance,
      transaction?.previousBalance
    )
  );
  const postBalance = parseAmount(
    pickFirst(
      transaction?.postBalance,
      transaction?.postWalletBalance,
      transaction?.postPurseBalance,
      transaction?.postTransactionBalance,
      transaction?.currentBalance
    )
  );

  const isCharge = preBalance !== null && postBalance !== null &&
    postBalance < preBalance &&
    detectChargeTransaction(transaction);
  const isFailed =
    preBalance !== null && postBalance !== null && preBalance === postBalance;
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
  }

  const senderParty = hasPartyData(apiSender)
    ? apiSender
    : createEmptyParty();
  const receiverParty = hasPartyData(apiReceiver)
    ? apiReceiver
    : hasPartyData(getCounterpartyParty(transaction))
      ? getCounterpartyParty(transaction)
      : createEmptyParty();

  return {
    sender: withFallbackParty(senderParty),
    receiver: withFallbackParty(receiverParty),
    status: isFailed ? "FAILED" : "SUCCESS",
    errorMessage: isFailed ? getFailedMessage(transaction) : "",
  };
};
