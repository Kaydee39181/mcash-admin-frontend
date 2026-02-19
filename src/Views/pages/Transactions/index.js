import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";

import DashboardTemplate from "../../template/dashboardtemplate";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
} from "../../../Redux/requests/transactionRequest";

import Loader from "../../../Components/secondLoader";
import ExportModal from "../../../Components/Exports";
import FilterModal from "../../../Components/Filter";

import { DropdownButton, Dropdown } from "react-bootstrap";
import Pagination from "react-js-pagination";
import ViewReceipts from "../../../Components/viewReceipt";

import { connect } from "react-redux";
import moment from "moment";

import "./style.css";

const Transactions = (props) => {
  const {
    FetchTransaction: FetchTransactions,
    FetchTransactionTypes: FetchTransactionType,
    FetchTransactionStatus: FetchTransactionStatuses,
    transaction,
    loading,
    transactionTotal,
    transactionsType,
    transactionStatus,
  } = props;

  const [exportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);

  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  const [viewReceipt, setViewReceipt] = useState(null);
  const [receiptview, showReceiptView] = useState(false);

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

  const QueryTransaction = (transactId) => {
    const token = JSON.parse(localStorage.getItem("data"));
    const loadings = toast.loading("Please wait...");

    const apiUrl = `https://api.mcashpoint.com/api/v1/transfer/query?transactionId=${transactId}`;

    fetch(apiUrl, {
      headers: {
        Authorization: `bearer ${token?.access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.responseCode === "00") {
          if (data?.data?.responseCode === "00") {
            toast.update(loadings, {
              render: data?.data?.responseMessage || "Success",
              type: "success",
              isLoading: false,
              autoClose: 8000,
            });
          } else {
            toast.update(loadings, {
              render: data?.data?.responseMessage || "Query failed",
              type: "error",
              isLoading: false,
              autoClose: 8000,
            });
          }
        } else {
          toast.update(loadings, {
            render: data?.responseMessage || "Query failed",
            type: "error",
            isLoading: false,
            autoClose: 8000,
          });
        }
      })
      .catch((error) => {
        toast.update(loadings, {
          render: error?.message || "Network error",
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
      });
  };

  const _handleFilterValue = (event) => {
    const { name, value } = event.target;

    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setNextPage(0);
    showExportModal(false);
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchTransactions(0, length, filterValues);
    setNextPage(0);
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

  useEffect(() => {
    FetchTransactions(nextPage, length, filterValues);
    FetchTransactionType();
    FetchTransactionStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage, length]);

  const handleSelect = (e) => {
    setLength(Number(e));
    setNextPage(0);
    setActivePage(1);
  };

  const closeExport = () => showExportModal(false);
  const closeFilter = () => showFilterModal(false);

  const OpenFilter = () => {
    showFilterModal(true);
    setFilterValues(initialState);
  };

  
  // EXPORT DATA (PDF/CSV/XLSX)
  
  const title = "Transactions page";

  const transactions = Array.isArray(transaction) ? transaction : [];

  const getManagerName = (transact) =>
    transact?.agent?.agentManager?.accountName ||
    transact?.agent?.agentManager?.user?.fullName ||
    transact?.agentManager?.accountName ||
    transact?.agentManager?.user?.fullName ||
    transact?.agentManagerName ||
    "";

  const getManagerId = (transact) =>
    transact?.agent?.agentManager?.id ??
    transact?.agent?.agentManager?.user?.id ??
    transact?.agent?.agentManagerId ??
    transact?.agentManager?.id ??
    transact?.agentManager?.user?.id ??
    transact?.agentManagerId ??
    "";

  const managerByAgentId = transactions.reduce((acc, transact) => {
    const agentId = transact?.agent?.id;
    const managerName = getManagerName(transact);

    if (agentId != null && managerName && !acc.has(String(agentId))) {
      acc.set(String(agentId), managerName);
    }

    return acc;
  }, new Map());

  const resolveManagerName = (transact) => {
    const managerName = getManagerName(transact);
    if (managerName) return managerName;

    const agentId = transact?.agent?.id;
    if (agentId != null) {
      return managerByAgentId.get(String(agentId)) || "—";
    }

    return "—";
  };

  const managerIdByAgentId = transactions.reduce((acc, transact) => {
    const agentId = transact?.agent?.id;
    const managerId = getManagerId(transact);

    if (agentId != null && managerId !== "" && !acc.has(String(agentId))) {
      acc.set(String(agentId), String(managerId));
    }

    return acc;
  }, new Map());

  const resolveManagerId = (transact) => {
    const managerId = getManagerId(transact);
    if (managerId !== "") return String(managerId);

    const agentId = transact?.agent?.id;
    if (agentId != null) {
      return managerIdByAgentId.get(String(agentId)) || "";
    }

    return "";
  };

  const normalizedManagerIdFilter = String(
    filterValues?.agentManagerId || ""
  ).trim().toLowerCase();

  const transactionsToRender = normalizedManagerIdFilter
    ? transactions.filter((transact) =>
        resolveManagerId(transact).toLowerCase().includes(normalizedManagerIdFilter)
      )
    : transactions;

  const noDataIndication = () => {
    if (loading) return "Loading transactions...";
    return "No transactions are available for the selected request. Try changing the filters or date range.";
  };

  
  const headers = [
    [
      "Date",
      "Agent",
      "Agent Manager",
      "Transaction ID",
      "Type",
      "Terminal ID",
      "Amount",
      "Status",
      "Agent Fee",
      "Stamp Duty",
      "RRN",
      "Pre Balance",
      "Post Balance",
    ],
  ];

  const item = transactionsToRender.map((transact) => [
    transact?.systemTime || "",
    transact?.agent?.businessName || "",
    resolveManagerName(transact),
    transact?.transactionId || "",
    transact?.transactionType?.type || "",
    transact?.agent?.bankTerminal?.terminalId || "",
    transact?.amount ?? "",
    transact?.statusCode || "",
    transact?.agentFee ?? "",
    transact?.stampDuty ?? "",
    transact?.rrn || "",
    Number(transact?.postPurseBalance ?? 0).toFixed(2),
    Number(transact?.prePurseBalance ?? 0).toFixed(2),
  ]);


  const products = transactionsToRender.map((transact) => {

    const time = new Date(transact?.systemTime);
    const ntime = moment(time).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");

    return {
      transact,
      id: transact?.id ?? "",
      Date: transact?.systemTime ? ntime : "",
      Agent: transact?.agent?.businessName || "",
      AgentManager: resolveManagerName(transact),
      TransactionID: transact?.transactionId || "",
      Type: transact?.transactionType?.type || "",
      TerminalID: transact?.agent?.bankTerminal?.terminalId || "",
      Amount: transact?.amount ?? "",
      Status: transact?.statusCode || "",
      accountNumber: transact?.accountNumber || "-----",
      accountName: transact?.accountName || "----",
      bankName: transact?.bankName || "-----",
      ConvenienceFee: transact?.convenienceFee ?? "",
      AgentFee: transact?.agentFee ?? "",
      StampDuty: transact?.stampDuty ?? "",
      RRN: transact?.rrn || "",
      STAN: transact?.stan || "",

      PreBalance: Number(transact?.prePurseBalance ?? 0).toFixed(2),
      PostBalance: Number(transact?.postPurseBalance ?? 0).toFixed(2),


      AppVersion: transact?.appVersion || "",
      totalAmount:
        transact?.totalAmount != null
          ? Number(transact.totalAmount).toLocaleString()
          : "",
    };
  });

  // TABLE COLUMNS

  const columns = [
    { dataField: "Date", text: "Date" },
    {
      dataField: "Agent",
      text: "Agent",
      headerStyle: () => ({ width: "150px", textAlign: "center", padding: "10px" }),
      bodyStyle: () => ({ width: "150px", textAlign: "center", color: "#00249C" }),
    },
    {
    dataField: "AgentManager",
    text: "Agent Manager",
    headerStyle: () => ({ width: "200px", textAlign: "center" }),
    bodyStyle: () => ({ width: "200px", textAlign: "center", color: "#555" }),
    },
    {
      dataField: "TransactionID",
      text: "Transaction ID",
      style: { width: "15em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => ({ width: "150px", textAlign: "center" }),
    },
    { dataField: "Type", text: "Type" },
    { dataField: "TerminalID", text: "Terminal ID" },
    { dataField: "Amount", text: "Amount (N)" },
    {
      dataField: "Status",
      text: "Status",
      style: { width: "20em", whiteSpace: "normal", wordWrap: "normal" },
      headerStyle: () => ({ width: "550px", textAlign: "center" }),
      bodyStyle: () => ({ width: "550px", textAlign: "center", wordWrap: "normal" }),
      formatter: (cellContent, row) => {
        let statusMessage = row?.transact?.statusMessage || row?.Status || "";
        let statusColor = "failure";

        switch (row?.Status) {
          case "00":
            statusColor = "successful";
            break;
          case "PP":
          case "09":
            statusColor = "pending";
            break;
          default:
            statusColor = "failure";
            break;
        }

        return (
          <h5>
            <span className={`${statusColor}`}> {statusMessage}</span>
          </h5>
        );
      },
    },
    { dataField: "ConvenienceFee", text: "Convenience Fee" },
    { dataField: "AgentFee", text: "Agent Fee" },
    { dataField: "StampDuty", text: "Stamp Duty" },
    {
      dataField: "RRN",
      text: "RRN",
      style: { width: "10em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => ({ width: "100px", textAlign: "center" }),
    },
    {
      dataField: "STAN",
      text: "STAN",
      style: { width: "10em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: () => ({ width: "100px", textAlign: "center" }),
    },

    // SWAPPED DISPLAY TEXT (and order)
    { dataField: "PreBalance", text: "Pre-Balance" },
    { dataField: "PostBalance", text: "Post-Balance" },

    { dataField: "accountName", text: "Beneficiary A/C Name" },
    { dataField: "accountNumber", text: "Beneficiary A/C No" },
    { dataField: "bankName", text: "Beneficiary Bank" },
    { dataField: "AppVersion", text: "App Version" },

    {
      dataField: "ViewReceipt",
      text: "View Receipt",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button type="button" onClick={() => ViewReceipt(row)} className="viewTransac">
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
        const t = row?.transact?.transactionType?.type;
        const canQuery = t === "Funds Transfer" || t === "Agent Transfer";

        return (
          <h5>
            {canQuery ? (
              <button
                type="button"
                onClick={() => QueryTransaction(row.TransactionID)}
                className="viewTransac"
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
    setNextPage(pageNumber - 1);
  };

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        {loading && <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />}

        <div className="header-title">
          <h3>Transactions</h3>
        </div>

        <div className="agent-transact-header">
          <div>An overview of all transactions on mCashPoint</div>

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
          <h4>All Transactions</h4>

          <BootstrapTable
            bootstrap4
            keyField="id"
            data={products}
            columns={columns}
            noDataIndication={noDataIndication}
            defaultSorted={defaultSorted}
            bordered={false}
            hover
            condensed
          />
        </div>
      </div>

      {/* render receipt modal ONLY when we actually have details  */}
      {receiptview && viewReceipt && (
        <ViewReceipts details={viewReceipt} show={receiptview} close={closeViewReceipt} />
      )}

      <FilterModal
        type={"Transaction"}
        typetext={"Enter Transaction Type"}
        idtext={"Enter Transaction ID"}
        show={FilterModalActive}
        close={closeFilter}
        nextPage={nextPage}
        length={length}
        loadPage={FetchTransaction}
        handleFilterValue={_handleFilterValue}
        submitFilter={onFilterSubmit}
        name={"transaction"}
        transactionsType={transactionsType}
        transactionStatus={transactionStatus}
      />

      <ExportModal
        show={exportModalActive}
        close={closeExport}
        filename="transaction file"
        title={title}
        headers={headers}
        item={item}
        products={products}
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
          <Dropdown.Item eventKey={transactionTotal ? String(transactionTotal) : "0"}>
            All
          </Dropdown.Item>
        </DropdownButton>

        <p>
          Showing 1 to {length} of {transactionTotal}
        </p>

        <div className="pagination">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={length}
            totalItemsCount={transactionTotal}
            pageRangeDisplayed={5}
            onChange={_handlePageChange}
          />
        </div>
      </div>

      <ToastContainer autoClose={8000} />
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => ({
  transaction: state.transactions.transactions,
  transactionsType: state.transactions.transactionsType,
  transactionStatus: state.transactions.transactionStatus,
  loading: state.transactions.loading,
  error: state.transactions.error,
  transactionTotal: state.transactions.transactionTotal,
  successTransaction: state.transactions.successTransaction,
});

export default connect(mapStateToProps, {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
})(Transactions);
