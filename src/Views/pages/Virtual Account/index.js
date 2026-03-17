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

const normalizeTransactions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return [];
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

const resolveStatusStyle = (statusValue) => {
  const normalized = String(statusValue || "").trim().toUpperCase();
  if (normalized === "00" || normalized === "SUCCESS" || normalized === "SUCCESSFUL") {
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
  const isRestrictedRole =
    roleName.trim().toLowerCase() === "agent relationship officer";
  const [copied, setCopied] = useState(false);

  const [exportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);

  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const initialState = {
    startDate: "",
    endDate: "",
    terminalId: "",
    status: "",
    transactionType: "",
    transactionId: "",
    rrn: "",
    pan: "",
    stan: "",
    agentId: "",
    agentManagerId: "",
    agentManagerName: "",
    draw: "",
  };

  const [filterValues, setFilterValues] = useState(initialState);

  useEffect(() => {
    if (isRestrictedRole) return;
    FetchVirtualTransactions(filterValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestrictedRole]);

  useEffect(() => {
    let isMounted = true;
    const fetchAccountNumber = async () => {
      if (accountNumber || !token?.user?.username || !token?.access_token) {
        if (isMounted) setResolvedAccountNumber(accountNumber || "");
        return;
      }

      try {
        const url = `${AgentConstant.FETCH_AGENT_URL}username=${encodeURIComponent(
          token.user.username
        )}`;
        const response = await virtualAxios.get(url, {
          headers: {
            Authorization: `bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        const agents = normalizeTransactions(response?.data);
        const fallbackAccount =
          agents?.[0]?.accountNumber ||
          agents?.[0]?.account?.accountNumber ||
          agents?.[0]?.virtualAccountNumber ||
          "";

        if (isMounted) {
          setResolvedAccountNumber(fallbackAccount || "");
        }
      } catch (error) {
        if (isMounted) setResolvedAccountNumber("");
      }
    };

    fetchAccountNumber();
    return () => {
      isMounted = false;
    };
  }, [accountNumber, token]);

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

      const statusRaw =
        transact?.statusMessage ||
        transact?.status ||
        transact?.statusCode ||
        transact?.responseMessage ||
        "";

      return {
        transact,
        id: transact?.id ?? transact?.transactionId ?? index,
        Date: formatDateTime(rawDate),
        TransactionID: transact?.transactionId || transact?.transactionID || "",
        Reference:
          transact?.reference ||
          transact?.transactionReference ||
          transact?.externalReference ||
          "",
        AccountNumber:
          transact?.accountNumber ||
          transact?.virtualAccountNumber ||
          transact?.destinationAccountNumber ||
          "",
        AccountName:
          transact?.accountName ||
          transact?.beneficiaryName ||
          transact?.customerName ||
          "",
        BankName:
          transact?.bankName ||
          transact?.destinationBank ||
          transact?.bank ||
          "",
        Amount: formatAmount(transact?.amount ?? transact?.transactionAmount),
        Status: statusRaw,
        Narration: transact?.narration || transact?.description || "",
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
      "Transaction ID",
      "Reference",
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
    row.TransactionID || "",
    row.Reference || "",
    row.AccountNumber || "",
    row.AccountName || "",
    row.BankName || "",
    row.Amount || "",
    row.Status || "",
    row.Narration || "",
  ]);

  const columns = [
    { dataField: "Date", text: "Date" },
    {
      dataField: "TransactionID",
      text: "Transaction ID",
      style: { width: "15em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => ({ width: "150px", textAlign: "center" }),
    },
    {
      dataField: "Reference",
      text: "Reference",
      style: { width: "12em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => ({ width: "140px", textAlign: "center" }),
    },
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
      style: { width: "15em", whiteSpace: "normal", wordWrap: "break-word" },
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
      <div className="transact-wrapper">
        {virtualLoading && (
          <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
        )}

        <div className="header-title virtual-account-header">
          <h3>Virtual Account</h3>
          <div className="virtual-account-number">
            <span className="account-label">Account No:</span>
            <span className="account-value">{resolvedAccountNumber || "—"}</span>
            <button
              type="button"
              className={`account-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopyAccount}
              disabled={!resolvedAccountNumber}
              aria-label="Copy account number"
            >
              {copied ? "Copied" : "Copy"}
            </button>
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
            <div className="agent-transact-header">
              <div>An overview of virtual account transactions</div>

              <div className="actions">
                <span onClick={() => window.print()}>
                  <img src={Print} alt="print" />
                  Print
                </span>

                <span onClick={OpenFilter}>
                  <img src={Filter} alt="filter" />
                  Filter
                </span>

                <span onClick={() => showExportModal(true)}>
                  <img src={Upload} alt="export" />
                  Export
                </span>
              </div>
            </div>

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
            type={"Transaction"}
            typetext={"Enter Transaction Type"}
            idtext={"Enter Transaction ID"}
            show={FilterModalActive}
            close={closeFilter}
            handleFilterValue={_handleFilterValue}
            submitFilter={onFilterSubmit}
            name={"transaction"}
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
