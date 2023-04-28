import React, { useState, useEffect, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import DashboardTemplate from "../../template/dashboardtemplate";
import "react-toastify/dist/ReactToastify.css";
// import {
//   ToastsContainer,
//   ToastsStore,
//   ToastsContainerPosition,
// } from "react-toasts";
import { ToastContainer, toast } from "react-toastify";
import {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
} from "../../../Redux/requests/transactionRequest";
import Loader from "../../../Components/secondLoader";
import ExportModal from "../../../Components/Exports";
import FilterModal from "../../../Components/Filter";
import {
  Nav,
  NavItem,
  NavLink,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import Pagination from "react-js-pagination";
import ViewReceipts from "../../../Components/viewReceipt";

import { connect } from "react-redux";
import moment from "moment";

import "./style.css";
// import ExportLink from '../Exports/index';

const Transactions = (props) => {
  const {
    FetchTransaction: FetchTransactions,
    FetchTransactionTypes: FetchTransactionType,
    FetchTransactionStatus: FetchTransactionStatuses,
    transaction,
    loading,
    transactionTotal,
    successTransaction,
    transactionsType,
    transactionStatus,
  } = props;
  const [alltransactions, setTransactions] = useState([FetchTransactions]);
  const [totalSize, setTransactionsTotal] = useState(0);
  const [status, setStatus] = useState([FetchTransactions]);
  const [exportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [viewReceipt, setViewReceipt] = useState("");
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
    draw: "",
  };
  const [filterValues, setFilterValues] = useState(initialState);

  const QueryTransaction = (transactId) => {
    const token = JSON.parse(localStorage.getItem("data"));
    const loadings = toast.loading("Please wait...");
    const apiUrl = `https://api.mcashpoint.com/api/v1/transfer/query?transactionId=${transactId}`;
    fetch(apiUrl, {
      headers: {
        Authorization: `bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode == "00") {
          if (data.data.responseCode == "00") {
            toast.update(loadings, {
              render: data.data.responseMessage,
              type: "success",
              isLoading: false,
              autoClose: 8000,
            });
          } else {
            toast.update(loadings, {
              render: data.data.responseMessage,
              type: "error",
              isLoading: false,
              autoClose: 8000,
            });
          }
        } else {
          toast.update(loadings, {
            render: data.responseMessage,
            type: "error",
            isLoading: false,
            autoClose: 8000,
          });

          toast.error();
        }
      })
      .catch((error) => {
        toast.update(loadings, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 8000,
        });
      });
  };

  const _handleFilterValue = (event) => {
    console.log(event);
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    setNextPage(0);
    showExportModal(false);
  };

  // const resetFilter = (event) => {
  //   event.preventDefault();

  //   setFilterValues({...initialState});
  // };
  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchTransactions(nextPage, length, filterValues);
    closeFilter();
    setNextPage(0);
  };
  const ViewReceipt = (details) => {
    console.log(details);
    showReceiptView(true);
    setViewReceipt(details);
  };

  const closeViewReceipt = () => {
    showReceiptView(false);
  };

  useEffect(() => {
    FetchTransactions(nextPage, length, filterValues);
    FetchTransactionType();
    FetchTransactionStatuses();
  }, [nextPage, length, filterValues]);

  const handleSelect = (e) => {
    setLength(e);
  };

  const title = "Transactions page";
  const headers = [
    [
      "Date",
      "Agent",
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

  const item = transaction.map((transact) => [
    transact.systemTime,
    transact.agent.businessName,
    transact.transactionId,
    transact.transactionType.type,
    transact.agent.bankTerminal === null
      ? ""
      : transact.agent.bankTerminal.terminalId,
    transact.amount,
    transact.totalAmount,
    transact.statusCode,
    transact.agentFee,
    transact.stampDuty,
    transact.rrn,
    transact.prePurseBalance.toFixed(2),
    transact.postPurseBalance.toFixed(2),
  ]);
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };
  const products = transaction.map((transact) => {
    //console.log(transact.agent.agentManager);
    let time = new Date(transact.systemTime);
    let ntime = moment(time).add(1, "hour").format("YYYY-MM-DD HH:mm:ss");
    /* console.log(ntime); */
    return {
      transact: transact,
      id: transact.agent.id === "undefined" ? "" : transact.id,
      Date: transact.systemTime === "undefined" ? "" : ntime,
      Agent:
        transact.agent.businessName === "undefined"
          ? ""
          : transact.agent.businessName,
      TransactionID:
        transact.transactionId === "undefined" ? "" : transact.transactionId,
      Type:
        transact.transactionType.type === "undefined"
          ? ""
          : transact.transactionType.type,
      TerminalID:
        transact.agent.bankTerminal === null
          ? ""
          : transact.agent.bankTerminal.terminalId,
      Amount: transact.amount === "undefined" ? "" : transact.amount,
      Status: transact.statusCode,
      accountNumber: transact.accountNumber ? transact.accountNumber : "-----",
      accountName: transact.accountName ? transact.accountName : "----",
      bankName: transact.bankName ? transact.bankName : "-----",
      ConvenienceFee: transact.convenienceFee,
      AgentFee: transact.agentFee === "undefined" ? "" : transact.agentFee,
      StampDuty: transact.stampDuty === "undefined" ? "" : transact.stampDuty,
      RRN: transact.rrn === "undefined" ? "" : transact.rrn,
      STAN: transact.stan === "undefined" ? "" : transact.stan,
      // CardDetails:transact.rrn === 'undefined' ? '':transact.rrn ,
      PreBalance:
        transact.prePurseBalance.toFixed(2) === "undefined"
          ? ""
          : transact.prePurseBalance.toFixed(2),
      PostBalance:
        transact.postPurseBalance.toFixed(2) === "undefined"
          ? ""
          : transact.postPurseBalance.toFixed(2),
      AppVersion:
        transact.appVersion === "undefined" ? "" : transact.appVersion,
      totalAmount:
        transact.totalAmount === "undefined"
          ? ""
          : parseInt(transact.totalAmount).toLocaleString(),
    };
  });

  const columns = [
    { dataField: "Date", text: "Date" },
    {
      dataField: "Agent",
      text: "Agent",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "TransactionID",
      text: "Transaction ID",
      style: { width: "15em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center" };
      },
    },
    { dataField: "Type", text: "Type" },
    { dataField: "TerminalID", text: "Terminal ID" },
    { dataField: "Amount", text: "Amount (N)" },
    {
      dataField: "Status",
      text: "Status",
      style: { width: "20em", whiteSpace: "normal", wordWrap: "normal" },
      headerStyle: (colum, colIndex) => {
        return { width: "550px", textAlign: "center" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "550px", textAlign: "center", wordWrap: "normal" };
      },
      formatter: (cellContent, row) => {
        let statusMessage = "";
        let statusColor = "";
        switch (row.Status) {
          case "00":
            console.log(row);
            statusMessage = row.transact.statusMessage;
            statusColor = "successful";
            break;
          case "PP":
          case "09":
            statusMessage = row.transact.statusMessage;
            statusColor = "pending";
            break;

          default:
            statusMessage = row.transact.statusMessage;
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
      headerStyle: (colum, colIndex) => {
        return { width: "100px", textAlign: "center" };
      },
    },
    {
      dataField: "STAN",
      text: "STAN",
      style: { width: "10em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: (colum, colIndex) => {
        return { width: "100px", textAlign: "center" };
      },
    },
    // { dataField: 'CardDetails', text: 'Card Details'},
    { dataField: "PreBalance", text: "Pre-Balance" },
    { dataField: "PostBalance", text: "Post-Balance" },
    { dataField: "accountName", text: "Beneficiary A/C Name" },
    { dataField: "accountNumber", text: "Beneficiary A/C No" },
    { dataField: "bankName", text: "Beneficiary Bank" },
    { dataField: "App Version", text: "App Version" },
    {
      dataField: "ViewReceipt",
      text: "View Receipt",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => ViewReceipt(row)}
              className="viewTransac"
            >
              View Receipt
            </button>
          </h5>
        );
      },
    },

    {
      dataField: "QueryTrans",
      text: "Query Tansaction",
      formatter: (cellContent, row) => {
        console.log("row", row);
        return (
          <h5>
            {row.transact.transactionType.type == "Funds Transfer" ||
            row.transact.transactionType.type == "Agent Transfer" ? (
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

    // { dataField: 'BeneficiaryDetails', text: 'Beneficiary Details'},
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  // const _handlePageChange = (pageNumber) => {
  //   console.log(pageNumber);
  //   setActivePage(pageNumber);
  //   setNextPage((prev) => prev + 10);
  // };

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  const closeExport = () => {
    showExportModal(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };

  const OpenFilter = () => {
    showFilterModal(true);
    setFilterValues(initialState);
  };

  return (
    <DashboardTemplate>
      <div className="transact-wrapper">
        {loading && (
          <Loader type="TailSpin" height={60} width={60} color="#1E4A86" />
        )}
        <div className="header-title">
          <h3>Transactions</h3>
        </div>
        <div className="agent-transact-header">
          <div>An overview of all transactions on mCashPoint</div>
          <div className="actions">
            <span
            // onclick={()=> window.print()}
            >
              <img src={Print} />
              Print
            </span>

            <span onClick={() => OpenFilter()}>
              <img src={Filter} />
              Filter
            </span>

            <span onClick={() => showExportModal(true)}>
              <img src={Upload} />
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
            defaultSorted={defaultSorted}
            bordered={false}
            // pagination={pagination(length,totalSize)}
            hover
            condensed
          />
        </div>
      </div>
      <ViewReceipts
        details={viewReceipt}
        show={receiptview}
        close={closeViewReceipt}
      />
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
          <Dropdown.Item
            eventKey={transactionTotal ? String(transactionTotal) : "0"}
          >
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
const mapStateToProps = (state) => (
  console.log(state),
  {
    transaction: state.transactions.transactions,
    transactionsType: state.transactions.transactionsType,
    transactionStatus: state.transactions.transactionStatus,
    loading: state.transactions.loading,
    error: state.transactions.error,
    transactionTotal: state.transactions.transactionTotal,
    successTransaction: state.transactions.successTransaction,
  }
);

export default connect(mapStateToProps, {
  FetchTransaction,
  FetchTransactionTypes,
  FetchTransactionStatus,
})(Transactions);
