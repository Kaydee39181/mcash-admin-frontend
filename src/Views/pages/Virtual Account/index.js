import React, { useMemo, useState, useEffect } from "react";
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
import ViewReceipts from "../../../Components/viewReceipt";
import { AgentConstant } from "../../../constants/constants";
import { FetchVirtualAccountTransactions } from "../../../Redux/requests/virtualAccountRequest";

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

const resolveAccountNumber = (token) => {
  if (!token?.user) return "";

  return (
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

const resolveStatusStyle = (statusValue) => {
  const normalized = String(statusValue || "").trim().toUpperCase();

  // Explicitly exclude non-transaction success markers like "CHARGE DEDUCTED".
  if (normalized.includes("CHARGE") && normalized.includes("DEDUCT")) {
    return "failure";
  }

  const successMarkers = ["00", "SUCCESS", "SUCCESSFUL", "APPROVED", "APPROVE"];
  if (successMarkers.some((m) => normalized === m || normalized.includes(m))) {
    return "successful";
  }
  if (normalized === "PP" || normalized === "09" || normalized === "PENDING") {
    return "pending";
  }
  return "failure";
};

const VirtualAccount = (props) => {
  const {
    FetchVirtualAccountTransactions: FetchVirtualTransactions,
    virtualTransactions,
    virtualLoading,
    virtualError,
    virtualTotal,
  } = props;
  const token = safeParseToken();
  const accountNumber = resolveAccountNumber(token);
  const [resolvedAccountNumber, setResolvedAccountNumber] = useState(accountNumber);
  const roleName = token?.user?.roleGroup?.name || "";
  const showAccountNumberBadge = roleName.trim().toUpperCase() === "AGENT";
  const isRestrictedRole =
    roleName.trim().toLowerCase() === "agent relationship officer";
  const [copied, setCopied] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [receiptview, showReceiptView] = useState(false);

  const [exportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);

  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const initialState = {
    startDate: "",
    endDate: "",
    status: "",
    transactionId: "",
  };

  const [filterValues, setFilterValues] = useState(initialState);

  useEffect(() => {
    if (isRestrictedRole) return;
    FetchVirtualTransactions(filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestrictedRole]);

  // Token-only: do not call identity-scoped endpoints like `agent?username=...`.

  useEffect(() => {
    if (!showAccountNumberBadge) return;
    if (resolvedAccountNumber) return;
    const derived = deriveAccountNumberFromTransactions(virtualTransactions);
    if (derived) {
      setResolvedAccountNumber(derived);
    }
  }, [virtualTransactions, resolvedAccountNumber, showAccountNumberBadge]);

  const _handleFilterValue = (event) => {
    const { name, value } = event.target;

    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    setActivePage(1);
    FetchVirtualTransactions(filterValues);
    showFilterModal(false);
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
      const message =
        (innerOk ? data?.data?.responseMessage : data?.data?.responseMessage) ||
        data?.responseMessage ||
        (topOk ? "Success" : "Query failed");

      toast.update(loadings, {
        render: message,
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
    const nextLength = Math.max(1, Number(value));
    setLength(nextLength);
    setActivePage(1);
  };

  const closeExport = () => showExportModal(false);
  const closeFilter = () => showFilterModal(false);

  const OpenFilter = () => {
    showFilterModal(true);
  };

  const transactionsToRender = Array.isArray(virtualTransactions)
    ? virtualTransactions
    : [];

  const allProducts = useMemo(() => {
    return transactionsToRender.map((transact, index) => {
      const rawDate =
        transact?.transactionDate ||
        transact?.createdAt ||
        transact?.systemTime ||
        transact?.date ||
        transact?.timestamp;

      const statusRaw = pickFirst(
        transact?.statusMessage,
        transact?.status,
        transact?.statusCode,
        transact?.responseMessage
      );

      const normalizedStatus = String(statusRaw || "").trim().toUpperCase();
       let typeRaw = "Virtual transaction";
       if (normalizedStatus) {
         if (normalizedStatus.includes("CHARGE") && normalizedStatus.includes("DEDUCT")) {
          typeRaw = "Transaction charge";
        } else if (
          normalizedStatus === "00" ||
          normalizedStatus.includes("SUCCESS") ||
          normalizedStatus.includes("APPROV")
        ) {
          typeRaw = "Successful virtual transaction";
        } else if (normalizedStatus.includes("FAIL")) {
          typeRaw = "Failed virtual transaction";
        } else if (normalizedStatus.includes("PENDING")) {
          typeRaw = "Pending virtual transaction";
        } else {
          typeRaw = `Virtual transaction (${statusRaw})`;
        }
      }

      const rrnRaw = pickFirst(transact?.rrn, transact?.RRN);
      const stanRaw = pickFirst(transact?.stan, transact?.STAN);

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

      const accountNumberRaw = pickFirst(
        transact?.accountNumber,
        transact?.virtualAccountNumber,
        transact?.destinationAccountNumber
      );
      const accountNameRaw = pickFirst(
        transact?.accountName,
        transact?.beneficiaryName,
        transact?.customerName
      );
      const bankNameRaw = pickFirst(
        transact?.bankName,
        transact?.destinationBank,
        transact?.bank?.name,
        transact?.bank
      );

      const beneficiaryNameRaw = pickFirst(
        transact?.beneficiaryAccountName,
        transact?.beneficiaryName,
        accountNameRaw
      );
      const beneficiaryAccountNoRaw = pickFirst(
        transact?.beneficiaryAccountNumber,
        transact?.beneficiaryAccountNo,
        transact?.beneficiaryAccount,
        accountNumberRaw
      );
      const beneficiaryBankRaw = pickFirst(
        transact?.beneficiaryBankName,
        transact?.beneficiaryBank,
        bankNameRaw
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
          "",
        Type: typeRaw,
        RRN: rrnRaw,
        STAN: stanRaw,
        PreBalance: preBalanceRaw,
        PostBalance: postBalanceRaw,
        AccountNumber: accountNumberRaw,
        AccountName: accountNameRaw,
        BankName: bankNameRaw,
        Amount: formatAmount(transact?.amount ?? transact?.transactionAmount),
        Status: statusRaw,
        Narration: transact?.narration || transact?.description || "",
        BeneficiaryAccountName: beneficiaryNameRaw,
        BeneficiaryAccountNo: beneficiaryAccountNoRaw,
        BeneficiaryBank: beneficiaryBankRaw,
      };
    });
  }, [transactionsToRender]);

  const pagedProducts = useMemo(() => {
    const start = (activePage - 1) * length;
    const end = start + length;
    return allProducts.slice(start, end);
  }, [allProducts, activePage, length]);

  const noDataIndication = () => {
    if (virtualLoading) return "Loading virtual account transactions...";
    return "No virtual account transactions were found. Try adjusting the filters.";
  };

  const headers = [
    [
      "Date",
      "Transaction Type",
      "Transaction ID",
      "Reference",
      "Pre-Balance",
      "Post-Balance",
      "Beneficiary A/C Name",
      "Beneficiary A/C No",
      "Beneficiary Bank",
      "Account Number",
      "Account Name",
      "Bank Name",
      "Amount",
      "Status",
      "Narration",
    ],
  ];

  const item = allProducts.map((row) => [
    row.Date || "",
    row.Type || "",
    row.TransactionID || "",
    row.Reference || "",
    row.PreBalance || "",
    row.PostBalance || "",
    row.BeneficiaryAccountName || "",
    row.BeneficiaryAccountNo || "",
    row.BeneficiaryBank || "",
    row.AccountNumber || "",
    row.AccountName || "",
    row.BankName || "",
    row.Amount || "",
    row.Status || "",
    row.Narration || "",
  ]);

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
    { dataField: "BeneficiaryAccountName", text: "Beneficiary A/C Name" },
    { dataField: "BeneficiaryAccountNo", text: "Beneficiary A/C No" },
    { dataField: "BeneficiaryBank", text: "Beneficiary Bank" },
    { dataField: "AccountNumber", text: "Account Number" },
    { dataField: "AccountName", text: "Account Name" },
    { dataField: "BankName", text: "Bank Name" },
    { dataField: "Amount", text: "Amount (N)" },
    {
      dataField: "Status",
      text: "Status",
      style: { width: "12em", whiteSpace: "normal", wordWrap: "normal" },
      headerStyle: () => ({ width: "240px", textAlign: "center" }),
      bodyStyle: () => ({ width: "240px", textAlign: "center", wordWrap: "normal" }),
      formatter: (cellContent, row) => {
        const statusMessage = row?.Status || "";
        const statusColor = resolveStatusStyle(row?.Status);

        return (
          <h5>
            <span className={`${statusColor}`}>{statusMessage}</span>
          </h5>
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
          Agent: token?.user?.username || token?.user?.name || FALLBACK_TEXT,
          totalAmount: row?.Amount || FALLBACK_TEXT,
          Type: row?.Type || FALLBACK_TEXT,
          TransactionID: row?.TransactionID || FALLBACK_TEXT,
          TerminalID: row?.transact?.terminalId || row?.transact?.terminalID || FALLBACK_TEXT,
          RRN: row?.RRN || row?.transact?.rrn || FALLBACK_TEXT,
          STAN: row?.STAN || row?.transact?.stan || FALLBACK_TEXT,
          transact: {
            statusMessage: row?.Status || FALLBACK_TEXT,
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
        const canQuery = Boolean(row?.TransactionID);
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

  const defaultSorted = [
    {
      dataField: "Date",
      order: "desc",
    },
  ];

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const statusOptions = [
    { statusCode: "SUCCESS", statusMessage: "Success" },
    { statusCode: "FAILED", statusMessage: "Failed" },
    { statusCode: "PENDING", statusMessage: "Pending" },
  ];

  const startRange = virtualTotal === 0 ? 0 : (activePage - 1) * length + 1;
  const endRange = Math.min(activePage * length, virtualTotal);

  const isNoAccessResponse =
    virtualError?.response?.data?.responseCode === "99";
  const showNoAccess = isRestrictedRole || isNoAccessResponse;

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

  const handleCopyAccount = async () => {
    if (!resolvedAccountNumber) return;
    try {
      await navigator.clipboard.writeText(String(resolvedAccountNumber));
      setCopied(true);
      toast.success("Account number copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy account number");
    }
  };

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

                <button
                  type="button"
                  className="va-action"
                  onClick={() => showExportModal(true)}
                >
                  <img src={Upload} alt="export" />
                  <span>Export</span>
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
          <>
            <div className="table-wrapper">
              <h4>All Virtual Account Transactions</h4>

              <BootstrapTable
                bootstrap4
                keyField="id"
                data={pagedProducts}
                columns={columns}
                noDataIndication={noDataIndication}
                defaultSorted={defaultSorted}
                bordered={false}
                hover
                condensed
              />
            </div>
          </>
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
            name={"virtualAccount"}
            transactionsType={[]}
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
          />

          <div className="pagination_wrap">
            <DropdownButton
              menuAlign="right"
              title={length}
              id="dropdown-menu-align-right"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
              <Dropdown.Item eventKey="20">20</Dropdown.Item>
              <Dropdown.Item eventKey="30">30</Dropdown.Item>
              <Dropdown.Item eventKey="50">50</Dropdown.Item>
              <Dropdown.Item eventKey="100">100</Dropdown.Item>
              <Dropdown.Item eventKey={String(virtualTotal || 0)}>
                All
              </Dropdown.Item>
            </DropdownButton>

            <p>
              Showing {startRange} to {endRange} of {virtualTotal}
            </p>

            <div className="pagination">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={length}
                totalItemsCount={virtualTotal}
                pageRangeDisplayed={5}
                onChange={_handlePageChange}
              />
            </div>
          </div>
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
  virtualLoading: state.virtualaccount?.loading,
  virtualError: state.virtualaccount?.error,
  virtualTotal: state.virtualaccount?.transactionTotal ?? 0,
});

export default connect(mapStateToProps, {
  FetchVirtualAccountTransactions,
})(VirtualAccount);
