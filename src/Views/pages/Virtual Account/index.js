import React, { useCallback, useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";

import DashboardTemplate from "../../template/dashboardtemplate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Pagination from "react-js-pagination";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";

import Loader from "../../../Components/secondLoader";
import ExportModal from "../../../Components/Exports";
import FilterModal from "../../../Components/Filter";
import VirtualAccountSummary from "../../../Components/VirtualAccountSummary";
import ViewReceipts from "../../../Components/viewReceipt";
import { AgentConstant } from "../../../constants/constants";
import {
  FetchVirtualAccountTransactions,
  buildVirtualAccountUrl,
} from "../../../Redux/requests/virtualAccountRequest";
import useMainTransactionsForBalance from "../../../hooks/useMainTransactionsForBalance";
import { isVirtualAccountRestrictedRole } from "../../../utils/roleLabel";
import {
  filterTransactions,
  formatTransactionForAdmin,
  getTransactionPartiesAndStatus,
} from "../../../utils/virtualAccountTransactions";
import { fetchAllPaginatedData } from "../../../utils/exportRequests";

import "../Transactions/style.css";
import "./style.css";

const virtualAxios = axios.create();

const safeParseToken = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const FALLBACK_TEXT = "-----";

const combineName = (...values) =>
  values
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();

const resolveAccountNumber = (token) => {
  if (!token?.user) return "";

  return (
    token.user.agent?.globusVirtualAccount ||
    token.user.globusVirtualAccount ||
    token.user.accountNumber ||
    token.user.account?.accountNumber ||
    token.user.agent?.accountNumber ||
    token.user.agent?.account?.accountNumber ||
    token.user.virtualAccountNumber ||
    ""
  );
};

const deriveAccountNumberFromTransactions = (transactions) => {
  const rows = Array.isArray(transactions) ? transactions : [];
  const candidates = rows
    .map((t) => {
      return (
        t?.agent?.globusVirtualAccount ||
        t?.globusVirtualAccount ||
        t?.agent?.virtualAccount ||
        t?.agent?.virtualAccountNumber ||
        t?.accountNumber ||
        t?.virtualAccountNumber ||
        t?.destinationAccountNumber ||
        t?.destinationAccount?.accountNumber ||
        t?.beneficiaryAccountNumber ||
        ""
      );
    })
    .map((v) => String(v || "").trim())
    .filter(Boolean);

  const unique = Array.from(new Set(candidates));
  // Only auto-pick when the dataset clearly represents one account.
  return unique.length === 1 ? unique[0] : "";
};

const resolveTransactionTimestamp = (transaction) => {
  const rawDate =
    transaction?.transactionDate ||
    transaction?.createdAt ||
    transaction?.systemTime ||
    transaction?.appTime ||
    transaction?.date ||
    transaction?.timestamp;

  if (!rawDate) return 0;

  const parsedTime = new Date(rawDate).getTime();
  return Number.isNaN(parsedTime) ? 0 : parsedTime;
};

const formatDateTime = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return moment(parsed).format("YYYY-MM-DD HH:mm:ss");
};

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return numeric.toLocaleString();
};

const pickFirst = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const str = String(value).trim();
    if (!str) continue;
    return str;
  }
  return "";
};

const resolveUserFullName = (user) =>
  pickFirst(
    [user?.firstname, user?.lastname].filter(Boolean).join(" "),
    user?.accountName,
    user?.name
  );

const resolveDisplayStatusClass = (statusValue) => {
  switch (String(statusValue || "").trim().toUpperCase()) {
    case "CHARGE":
      return "charge";
    case "FAILED":
      return "failure";
    default:
      return "successful";
  }
};

const isChargeTransaction = (transaction) =>
  pickFirst(transaction?.transactionType?.type, transaction?.type)
    .trim()
    .toUpperCase() === "CHARGE";

const renderDetailCell = (value) => {
  const normalizedValue = pickFirst(value, "N/A");

  return normalizedValue === "N/A" ? (
    <span className="va-cell-empty">N/A</span>
  ) : (
    <span className="va-cell-text">{normalizedValue}</span>
  );
};

const renderStatusCell = (statusLabel, statusVariant, errorMessage) => {
  const statusClassName = resolveDisplayStatusClass(statusVariant);

  return (
    <div className="va-status-cell">
      <span className={statusClassName}>{statusLabel}</span>
      {errorMessage ? <span className="va-status-error">{errorMessage}</span> : null}
    </div>
  );
};

const VirtualAccount = (props) => {
  const {
    FetchVirtualAccountTransactions: FetchVirtualTransactions,
    virtualTransactions,
    virtualLoading,
    virtualError,
    virtualAgentDetails,
    virtualTransactionTotal,
  } = props;
  const token = safeParseToken();
  const roleName = token?.user?.roleGroup?.name || "";
  const showAccountNumberBadge = roleName.trim().toUpperCase() === "AGENT";
  const isRestrictedRole = isVirtualAccountRestrictedRole(roleName);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [receiptview, showReceiptView] = useState(false);

  const [exportModalActive, showExportModal] = useState(false);
  const [downloadAllMode, setDownloadAllMode] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialState = {
    startDate: "",
    endDate: "",
    status: "",
    transactionId: "",
    accountNumber: "",
    accountName: "",
    bankName: "",
    type: "",
    reference: "",
  };

  const [filterValues, setFilterValues] = useState(initialState);
  const [draftFilterValues, setDraftFilterValues] = useState(initialState);
  const hasDerivedTypeFilter = /(?:^|\s)(credit|debit)$/i.test(
    String(filterValues?.type || "").trim()
  );

  const currentUserContext = useMemo(() => {
    return {
      roleName,
      isAgentContext: showAccountNumberBadge,
      accountName: pickFirst(
        virtualAgentDetails?.accountName,
        resolveUserFullName(token?.user),
        token?.user?.agent?.accountName,
        token?.user?.businessName
      ),
      accountNumber: pickFirst(
        virtualAgentDetails?.globusVirtualAccount,
        virtualAgentDetails?.virtualAccount,
        virtualAgentDetails?.virtualAccountNumber,
        virtualAgentDetails?.accountNumber,
        resolveAccountNumber(token)
      ),
      bankName: pickFirst(virtualAgentDetails?.bankName, "Globus Bank"),
    };
  }, [roleName, showAccountNumberBadge, token, virtualAgentDetails]);

  useEffect(() => {
    if (isRestrictedRole || hasDerivedTypeFilter) return;
    FetchVirtualTransactions(page, rowsPerPage, filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    FetchVirtualTransactions,
    filterValues,
    hasDerivedTypeFilter,
    isRestrictedRole,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    if (isRestrictedRole || !hasDerivedTypeFilter) return;
    FetchVirtualTransactions(0, 100, filterValues, { fetchAll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FetchVirtualTransactions, filterValues, hasDerivedTypeFilter, isRestrictedRole]);

  const showNoAccess =
    isRestrictedRole || virtualError?.response?.data?.responseCode === "99";
  const {
    balance: latestMainBalance,
    loading: balanceLoading,
  } = useMainTransactionsForBalance({
    enabled: showAccountNumberBadge && !showNoAccess,
  });

  // Token-only: do not call identity-scoped endpoints like `agent?username=...`.

  const _handleFilterValue = (event) => {
    const { name, value } = event.target;

    setDraftFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    setFilterValues(draftFilterValues);
    setPage(0);
    showFilterModal(false);
  };

  const resetFilters = () => {
    setFilterValues(initialState);
    setDraftFilterValues(initialState);
    setPage(0);
  };

  const ViewReceipt = (details) => {
    if (!details) return;
    setViewReceipt(details);
    showReceiptView(true);
  };

  const closeViewReceipt = () => {
    showReceiptView(false);
    setViewReceipt(null);
  };

  const QueryTransaction = async (transactId) => {
    const authToken = safeParseToken();
    if (!authToken?.access_token) {
      toast.error("Please log in again.");
      return;
    }
    if (!transactId) {
      toast.error("Missing transaction ID.");
      return;
    }

    const loadings = toast.loading("Please wait...");
    try {
      const url = `${AgentConstant.TRANSFER_QUERY_URL}${encodeURIComponent(
        transactId
      )}`;
      const res = await virtualAxios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = res?.data;
      const topOk = data?.responseCode === "00";
      const innerOk = data?.data?.responseCode === "00";
      const successMessage =
        data?.data?.responseMessage ||
        data?.responseMessage ||
        "Transfer query successful.";
      const failureMessage =
        data?.data?.responseMessage ||
        data?.responseMessage ||
        "Transfer query could not resolve this virtual account transaction.";

      toast.update(loadings, {
        render: topOk && innerOk ? successMessage : failureMessage,
        type: topOk && innerOk ? "success" : "error",
        isLoading: false,
        autoClose: 8000,
      });
    } catch (error) {
      toast.update(loadings, {
        render: error?.message || "Network error",
        type: "error",
        isLoading: false,
        autoClose: 8000,
      });
    }
  };

  const handleSelect = (value) => {
    const nextRowsPerPage = Math.max(1, Number(value));
    setRowsPerPage(nextRowsPerPage);
    setPage(0);
  };

  const closeExport = () => {
    showExportModal(false);
    setDownloadAllMode(false);
  };
  const closeFilter = () => {
    setDraftFilterValues(filterValues);
    showFilterModal(false);
  };

  const OpenFilter = () => {
    setDraftFilterValues(filterValues);
    showFilterModal(true);
  };

  const openCurrentExport = () => {
    setDownloadAllMode(false);
    showExportModal(true);
  };

  const openDownloadAll = () => {
    setDownloadAllMode(true);
    showExportModal(true);
  };

  const filteredTransactions = useMemo(() => {
    return filterTransactions(virtualTransactions, filterValues);
  }, [filterValues, virtualTransactions]);

  const buildVirtualExportProducts = useCallback(
    (transactionsToRender = []) =>
      transactionsToRender.map((transact, index) => {
        const rawDate =
          transact?.transactionDate ||
          transact?.createdAt ||
        transact?.systemTime ||
        transact?.appTime ||
        transact?.date ||
        transact?.timestamp;

      const statusRaw = pickFirst(
        transact?.statusMessage,
        transact?.responseMessage,
        transact?.status,
        transact?.statusCode
      );

      const typeRaw = pickFirst(
        transact?.transactionType?.type,
        transact?.type,
        "Virtual transaction"
      );

      const rrnRaw = pickFirst(transact?.rrn, transact?.RRN);
      const stanRaw = pickFirst(transact?.stan, transact?.STAN);
      const normalizedTransaction = formatTransactionForAdmin(transact);
      const adminFormatted = showAccountNumberBadge ? null : normalizedTransaction;
      const transactionParties = showAccountNumberBadge
        ? getTransactionPartiesAndStatus(transact, currentUserContext)
        : adminFormatted;

      const preBalanceRaw = pickFirst(
        transact?.preBalance,
        transact?.preWalletBalance,
        transact?.prePurseBalance,
        transact?.preTransactionBalance,
        transact?.previousBalance
      );
      const postBalanceRaw = pickFirst(
        transact?.postBalance,
        transact?.postWalletBalance,
        transact?.postPurseBalance,
        transact?.postTransactionBalance,
        transact?.currentBalance
      );

        return {
          transact,
          id: transact?.id ?? transact?.transactionId ?? index,
          Date: formatDateTime(rawDate),
          TransactionID: pickFirst(transact?.transactionId, transact?.transactionID),
          Reference:
            transact?.reference ||
            transact?.transactionReference ||
            transact?.externalReference ||
            transact?.transactionId ||
            transact?.rrn ||
            "",
          Type: pickFirst(normalizedTransaction?.type, typeRaw),
          RRN: rrnRaw,
          STAN: stanRaw,
          PreBalance: preBalanceRaw,
          PostBalance: postBalanceRaw,
          SenderAccountName: transactionParties.sender?.name || "",
          SenderBankName: transactionParties.sender?.bankName || "",
          SenderAccountNumber: transactionParties.sender?.accountNumber || "",
          ReceiverAccountName: transactionParties.receiver?.name || "",
          ReceiverBankName: transactionParties.receiver?.bankName || "",
          ReceiverAccountNumber: transactionParties.receiver?.accountNumber || "",
          Amount: formatAmount(transact?.amount ?? transact?.transactionAmount),
          Status: pickFirst(adminFormatted?.statusMessage, statusRaw, transactionParties.status),
          StatusVariant: transactionParties.status,
          ErrorMessage:
            transactionParties.status === "FAILED"
              ? pickFirst(adminFormatted?.statusMessage, transactionParties.errorMessage)
              : transactionParties.errorMessage,
          Narration: transact?.narration || transact?.description || "",
        };
      }),
    [currentUserContext, showAccountNumberBadge]
  );

  const allProducts = useMemo(() => {
    const transactionsToRender = Array.isArray(filteredTransactions)
      ? filteredTransactions
      : [];

    return buildVirtualExportProducts(transactionsToRender);
  }, [buildVirtualExportProducts, filteredTransactions]);

  const visibleProducts = useMemo(() => {
    if (!hasDerivedTypeFilter) {
      return allProducts;
    }

    const startIndex = page * rowsPerPage;
    return allProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [allProducts, hasDerivedTypeFilter, page, rowsPerPage]);

  const virtualAccountSummary = useMemo(() => {
    const transactionsToRender = Array.isArray(virtualTransactions)
      ? [...virtualTransactions]
      : [];

    const latestSnapshot = transactionsToRender
      .sort(
        (left, right) =>
          resolveTransactionTimestamp(right) - resolveTransactionTimestamp(left)
      )
      .find(
        (transaction) =>
          pickFirst(
            transaction?.agent?.globusVirtualAccount,
            transaction?.globusVirtualAccount,
            transaction?.agent?.virtualAccount,
            transaction?.agent?.virtualAccountNumber,
            transaction?.accountNumber,
            transaction?.virtualAccountNumber,
            transaction?.destinationAccountNumber,
            transaction?.accountName,
            transaction?.bankName,
            transaction?.postBalance,
            transaction?.postWalletBalance,
            transaction?.postPurseBalance,
            transaction?.postTransactionBalance,
            transaction?.currentBalance
          ) !== ""
      );

    return {
      accountName: pickFirst(
        virtualAgentDetails?.agent?.user?.fullName,
        combineName(
          virtualAgentDetails?.agent?.user?.firstname,
          virtualAgentDetails?.agent?.user?.lastname
        ),
        virtualAgentDetails?.user?.fullName,
        combineName(
          virtualAgentDetails?.user?.firstname,
          virtualAgentDetails?.user?.lastname
        ),
        latestSnapshot?.agent?.user?.fullName,
        combineName(
          latestSnapshot?.agent?.user?.firstname,
          latestSnapshot?.agent?.user?.lastname
        ),
        virtualAgentDetails?.accountName,
        currentUserContext.accountName
      ),
      accountNumber: pickFirst(
        virtualAgentDetails?.globusVirtualAccount,
        virtualAgentDetails?.virtualAccount,
        virtualAgentDetails?.virtualAccountNumber,
        virtualAgentDetails?.accountNumber,
        resolveAccountNumber(token),
        latestSnapshot?.agent?.globusVirtualAccount,
        latestSnapshot?.globusVirtualAccount,
        latestSnapshot?.agent?.virtualAccount,
        latestSnapshot?.agent?.virtualAccountNumber,
        latestSnapshot?.accountNumber,
        latestSnapshot?.virtualAccountNumber,
        latestSnapshot?.destinationAccountNumber,
        deriveAccountNumberFromTransactions(virtualTransactions)
      ),
      bankName: pickFirst(
        virtualAgentDetails?.bankName,
        latestSnapshot?.bankName,
        latestSnapshot?.destinationBank,
        latestSnapshot?.bank?.name,
        latestSnapshot?.bank
      ),
    };
  }, [currentUserContext.accountName, token, virtualAgentDetails, virtualTransactions]);

  const noDataIndication = () => {
    if (virtualLoading) return "Loading virtual account transactions...";
    return "No virtual account transactions were found. Try adjusting the filters.";
  };

  const headers = useMemo(
    () => [
      [
        "Date",
        "Transaction Type",
        "Transaction ID",
        "Reference",
        "Pre-Balance",
        "Post-Balance",
        "Sender A/C Number",
        "Sender A/C Name",
        "Sender Bank Name",
        "Receiver A/C Number",
        "Receiver A/C Name",
        "Receiver Bank Name",
        "Amount",
        "Status",
        "Error Message",
        "Narration",
      ],
    ],
    []
  );

  const item = allProducts.map((row) => [
    row.Date || "",
    row.Type || "",
    row.TransactionID || "",
    row.Reference || "",
    row.PreBalance || "",
    row.PostBalance || "",
    row.SenderAccountNumber || "",
    row.SenderAccountName || "",
    row.SenderBankName || "",
    row.ReceiverAccountNumber || "",
    row.ReceiverAccountName || "",
    row.ReceiverBankName || "",
    row.Amount || "",
    row.Status || "",
    row.ErrorMessage || "",
    row.Narration || "",
  ]);

  const requestAllVirtualAccountExport = useCallback(async () => {
    const { data } = await fetchAllPaginatedData({
      buildUrl: (pageNumber, chunkSize) =>
        buildVirtualAccountUrl(pageNumber, chunkSize, filterValues),
      extractItems: (payload) => {
        if (Array.isArray(payload?.data?.records)) return payload.data.records;
        if (Array.isArray(payload?.data?.data)) return payload.data.data;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.records)) return payload.records;
        if (Array.isArray(payload)) return payload;
        return [];
      },
      extractTotal: (payload) =>
        payload?.recordsFiltered ??
        payload?.recordsTotal ??
        payload?.total ??
        payload?.data?.recordsFiltered ??
        payload?.data?.recordsTotal ??
        payload?.data?.total ??
        0,
    });

    const filteredData = filterTransactions(data, filterValues);
    const exportProducts = buildVirtualExportProducts(filteredData);

    return {
      title: "Virtual Account Transactions",
      filename: "virtual-account-transactions",
      headers,
      item: exportProducts.map((row) => [
        row.Date || "",
        row.Type || "",
        row.TransactionID || "",
        row.Reference || "",
        row.PreBalance || "",
        row.PostBalance || "",
        row.SenderAccountNumber || "",
        row.SenderAccountName || "",
        row.SenderBankName || "",
        row.ReceiverAccountNumber || "",
        row.ReceiverAccountName || "",
        row.ReceiverBankName || "",
        row.Amount || "",
        row.Status || "",
        row.ErrorMessage || "",
        row.Narration || "",
      ]),
      products: exportProducts,
      filterValues,
    };
  }, [buildVirtualExportProducts, filterValues, headers]);

  const columns = [
    { dataField: "Date", text: "Date" },
    { dataField: "Type", text: "Type" },
    { dataField: "TransactionID", text: "Transaction ID" },
    { dataField: "Reference", text: "Reference" },
    {
      dataField: "PreBalance",
      text: "Pre-Balance",
      formatter: (cellContent, row) => formatAmount(row?.PreBalance) || FALLBACK_TEXT,
    },
    {
      dataField: "PostBalance",
      text: "Post-Balance",
      formatter: (cellContent, row) => formatAmount(row?.PostBalance) || FALLBACK_TEXT,
    },
    {
      dataField: "SenderAccountNumber",
      text: "Sender A/C Number",
      style: { width: "12em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "180px", textAlign: "left" }),
      bodyStyle: () => ({ width: "180px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    {
      dataField: "SenderAccountName",
      text: "Sender A/C Name",
      style: { width: "13em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "200px", textAlign: "left" }),
      bodyStyle: () => ({ width: "200px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    {
      dataField: "SenderBankName",
      text: "Sender Bank Name",
      style: { width: "13em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "190px", textAlign: "left" }),
      bodyStyle: () => ({ width: "190px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    {
      dataField: "ReceiverAccountNumber",
      text: "Receiver A/C Number",
      style: { width: "12em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "180px", textAlign: "left" }),
      bodyStyle: () => ({ width: "180px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    {
      dataField: "ReceiverAccountName",
      text: "Receiver A/C Name",
      style: { width: "13em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "200px", textAlign: "left" }),
      bodyStyle: () => ({ width: "200px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    {
      dataField: "ReceiverBankName",
      text: "Receiver Bank Name",
      style: { width: "13em", whiteSpace: "normal" },
      headerStyle: () => ({ width: "190px", textAlign: "left" }),
      bodyStyle: () => ({ width: "190px", whiteSpace: "normal" }),
      formatter: (cellContent) => renderDetailCell(cellContent),
    },
    { dataField: "Amount", text: "Amount (N)" },
    {
      dataField: "Status",
      text: "Status",
      style: { width: "14em", whiteSpace: "normal", wordWrap: "normal" },
      headerStyle: () => ({ width: "240px", textAlign: "center" }),
      bodyStyle: () => ({ width: "240px", textAlign: "center", wordWrap: "normal" }),
      formatter: (cellContent, row) => {
        return renderStatusCell(
          row?.Status || row?.StatusVariant || "SUCCESS",
          row?.StatusVariant || row?.Status || "SUCCESS",
          row?.ErrorMessage || ""
        );
      },
    },
    {
      dataField: "Narration",
      text: "Narration",
    },
    {
      dataField: "ViewReceipt",
      text: "View Receipt",
      formatter: (cellContent, row) => {
        const receiptDetails = {
          Agent:
            row?.transact?.agent?.user?.fullName ||
            row?.transact?.agent?.user?.username ||
            row?.transact?.agent?.businessName ||
            token?.user?.username ||
            token?.user?.name ||
            FALLBACK_TEXT,
          totalAmount: row?.Amount || FALLBACK_TEXT,
          Type: row?.Type || FALLBACK_TEXT,
          TransactionID: row?.TransactionID || FALLBACK_TEXT,
          TerminalID: row?.transact?.terminalId || row?.transact?.terminalID || FALLBACK_TEXT,
          RRN: row?.RRN || row?.transact?.rrn || FALLBACK_TEXT,
          STAN: row?.STAN || row?.transact?.stan || FALLBACK_TEXT,
          transact: {
            statusMessage:
              row?.ErrorMessage || row?.Status || row?.StatusVariant || FALLBACK_TEXT,
            pan: row?.transact?.pan || "",
            cardHolder: row?.transact?.cardHolder || "",
          },
        };

        return (
          <h5>
            <button
              type="button"
              onClick={() => ViewReceipt(receiptDetails)}
              className="viewTransac va-action-btn va-action-btn--receipt"
            >
              View Receipt
            </button>
          </h5>
        );
      },
    },
    {
      dataField: "QueryTrans",
      text: "Query Transaction",
      formatter: (cellContent, row) => {
        const canQuery = Boolean(row?.TransactionID) && !isChargeTransaction(row?.transact);
        return (
          <h5>
            {canQuery ? (
              <button
                type="button"
                onClick={() => QueryTransaction(row.TransactionID)}
                className="viewTransac va-action-btn va-action-btn--query"
              >
                Query
              </button>
            ) : (
              ""
            )}
          </h5>
        );
      },
    },
  ];

  const typeOptions = useMemo(() => {
    const tableTransactionTypes = Array.isArray(allProducts)
      ? allProducts.map((product) => pickFirst(product?.Type)).filter(Boolean)
      : [];

    const fallbackTransactionTypes = Array.isArray(virtualTransactions)
      ? virtualTransactions
          .map((transaction) =>
            pickFirst(
              formatTransactionForAdmin(transaction)?.type,
              transaction?.transactionType?.type,
              transaction?.type
            )
          )
          .filter(Boolean)
      : [];

    const transactionTypes =
      tableTransactionTypes.length > 0 ? tableTransactionTypes : fallbackTransactionTypes;

    return Array.from(new Set(transactionTypes))
      .sort((left, right) => left.localeCompare(right))
      .map((type) => ({
        id: type,
        type,
      }));
  }, [allProducts, virtualTransactions]);

  const defaultSorted = [
    {
      dataField: "Date",
      order: "desc",
    },
  ];

  const _handlePageChange = (pageNumber) => {
    setPage(Math.max(0, pageNumber - 1));
  };

  const statusOptions = [
    { statusCode: "SUCCESS", statusMessage: "Success" },
    { statusCode: "FAILED", statusMessage: "Failed" },
    { statusCode: "PENDING", statusMessage: "Pending" },
    { statusCode: "CHARGE", statusMessage: "Charge" },
  ];

  const filteredTotal = allProducts.length;
  const totalItemsCount = hasDerivedTypeFilter
    ? filteredTotal
    : virtualTransactionTotal || filteredTotal;
  const startRange = totalItemsCount === 0 ? 0 : page * rowsPerPage + 1;
  const endRange =
    totalItemsCount === 0
      ? 0
      : Math.min(
          totalItemsCount,
          page * rowsPerPage +
            (hasDerivedTypeFilter ? visibleProducts.length : filteredTotal)
        );
  const showAccountSummary = showAccountNumberBadge && !showNoAccess;

  useEffect(() => {
    if (showNoAccess || !virtualError) return;

    const status = virtualError?.response?.status;
    const message =
      virtualError?.response?.data?.responseMessage ||
      virtualError?.message ||
      "Failed to load virtual account transactions.";

    if (status === 401) {
      toast.error("You are not authorized to view virtual account transactions.");
    } else {
      toast.error(message);
    }
  }, [virtualError, showNoAccess]);

  return (
    <DashboardTemplate>
      <div className="transact-wrapper va-wrapper">
        {virtualLoading && (
          <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
        )}

        <div className="va-topbar">
          <div className="header-title va-title">
            <h3>Virtual Account</h3>
            <div className="va-subtitle">
              An overview of virtual account transactions
            </div>
          </div>

          <div className="va-right">
            {!showNoAccess && (
              <div className="va-actions">
                <button type="button" className="va-action" onClick={() => window.print()}>
                  <img src={Print} alt="print" />
                  <span>Print</span>
                </button>

                <button type="button" className="va-action" onClick={OpenFilter}>
                  <img src={Filter} alt="filter" />
                  <span>Filter</span>
                </button>

                <button type="button" className="va-action" onClick={openCurrentExport}>
                  <img src={Upload} alt="export" />
                  <span>Export</span>
                </button>

                <button type="button" className="va-action" onClick={openDownloadAll}>
                  <img src={Upload} alt="export" />
                  <span>Download all</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {showNoAccess ? (
          <div className="table-wrapper">
            <h4>No Access</h4>
            <p>
              You do not have permission to view virtual account transactions.
              Please contact an administrator if you believe this is a mistake.
            </p>
          </div>
        ) : (
          <div className="transaction-page-shell">
            {showAccountSummary ? (
              <VirtualAccountSummary
                accountName={virtualAccountSummary.accountName}
                accountNumber={virtualAccountSummary.accountNumber}
                bankName={virtualAccountSummary.bankName}
                balance={latestMainBalance}
                balanceLoading={balanceLoading}
              />
            ) : null}

            <div className="table-wrapper transaction-table-theme">
              <h4>All Virtual Account Transactions</h4>

              <BootstrapTable
                bootstrap4
                keyField="id"
                data={visibleProducts}
                columns={columns}
                noDataIndication={noDataIndication}
                defaultSorted={defaultSorted}
                bordered={false}
                hover
                condensed
              />
            </div>

            <div className="pagination_wrap">
              <DropdownButton
                menuAlign="right"
                title={rowsPerPage}
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
              >
                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                <Dropdown.Item eventKey="20">20</Dropdown.Item>
                <Dropdown.Item eventKey="30">30</Dropdown.Item>
                <Dropdown.Item eventKey="50">50</Dropdown.Item>
                <Dropdown.Item eventKey="100">100</Dropdown.Item>
                <Dropdown.Item eventKey={String(Math.max(totalItemsCount, 1))}>
                  All
                </Dropdown.Item>
              </DropdownButton>

              <p>
                Showing {startRange} to {endRange} of {totalItemsCount}
              </p>

              <div className="pagination">
                <Pagination
                  activePage={page + 1}
                  itemsCountPerPage={rowsPerPage}
                  totalItemsCount={totalItemsCount}
                  pageRangeDisplayed={5}
                  onChange={_handlePageChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {!showNoAccess && (
        <>
          <FilterModal
            type={"Virtual Account"}
            typetext={""}
            idtext={"Enter Transaction ID"}
            show={FilterModalActive}
            close={closeFilter}
            handleFilterValue={_handleFilterValue}
            submitFilter={onFilterSubmit}
            resetFilter={resetFilters}
            filterValues={draftFilterValues}
            name={"virtualAccount"}
            transactionsType={typeOptions}
            transactionStatus={statusOptions}
          />

          <ExportModal
            show={exportModalActive}
            close={closeExport}
            filename="virtual-account-transactions"
            title="Virtual Account Transactions"
            headers={headers}
            item={item}
            products={allProducts}
            columns={columns}
            filterValues={filterValues}
            requestExportData={
              downloadAllMode ? requestAllVirtualAccountExport : undefined
            }
          />

        </>
      )}

      {/* render receipt modal ONLY when we actually have details */}
      {receiptview && viewReceipt && (
        <ViewReceipts details={viewReceipt} show={receiptview} close={closeViewReceipt} />
      )}

      <ToastContainer autoClose={8000} />
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => ({
  virtualTransactions: state.virtualaccount?.transactions,
  virtualTransactionTotal: state.virtualaccount?.transactionTotal,
  virtualLoading: state.virtualaccount?.loading,
  virtualError: state.virtualaccount?.error,
  virtualAgentDetails: state.virtualaccount?.agentDetails,
});

export default connect(mapStateToProps, {
  FetchVirtualAccountTransactions,
})(VirtualAccount);
