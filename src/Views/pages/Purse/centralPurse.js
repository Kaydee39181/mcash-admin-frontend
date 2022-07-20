import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import {
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { FetchCentralPurse, FetchPurseBalance } from "../../../Redux/requests/agentPurseRequest";
import Loader from "../../../Components/secondLoader";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import {
  FetchTransactionTypes,
} from "../../../Redux/requests/transactionRequest";

import "./style.css";

const CentralPurse = (props) => {
  const {
    FetchCentralPurse: FetchCentralPurses,
    FetchTransactionTypes: FetchTransactionType,
    centralPurse,
    centralPurseTotal,
    loading,
    showFilterModal,
    FilterModalActive,
    showExportModal,
    ExportModalActive,
    agentManagerTotal,
    initialState,
    filterValues,
    setFilterValues,
    transactionsType
  } = props;
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);

  console.log(transactionsType)

  useEffect(() => {
    FetchTransactionType()
    FetchCentralPurses(length, nextPage, filterValues);
  }, [length, nextPage, filterValues]);



  const closeExport = () => {
    showExportModal(false);
  };
  const closeFilter = () => {
    showFilterModal(false);
  };
  function _handleFilterValue(event) {
    console.log(event);
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    showExportModal(false);
  }

  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchCentralPurses(length, nextPage, filterValues);
    showExportModal(false);
  };


  const title = "Central Purse page";
  const headers = [
    [
      "Transaction Type",
      "Transaction ID",
      "Amount",
      "MCP Cut",
      "ESL Charge",
      "Pre-Balance ",
      "Post-Balance ",
      "Description Name",
    ],
  ];

  const item = centralPurse.map((agent) => [
    agent.transaction.transactionType,
    agent.transaction.transactionID,
    agent.transaction.amount,
    agent.transaction.thirdpartyCut,
    agent.transaction.chargeAmount,
    agent.purseBalancebefore,
    agent.purseBalance,
    agent.reason,
  ]);

  const products = centralPurse.map((agent, index) => {
    console.log(agent);
    return {
      id: index,
      TransactionType:
        agent.transaction.transactionType === undefined
          ? ""
          : agent.transaction.transactionType,
      TransactionID:
        agent.transaction.transactionId === "undefined"
          ? ""
          : agent.transaction.transactionId,
      Amount:
        agent.transaction.amount === "undefined"
          ? ""
          : agent.transaction.amount,
      MCPCut:
        agent.transaction.thirdpartyCut === "undefined"
          ? ""
          : agent.transaction.thirdpartyCut,
      ESLCharge: agent.transaction.chargeAmount === "undefined" ? "" : agent.transaction.chargeAmount.toFixed(2),
      PreBalance: agent.purseBalancebefore === 'undefined' ? '' : agent.purseBalancebefore.toFixed(2),
      PostBalance: agent.purseBalance === 'undefined' ? '' : agent.purseBalance.toFixed(2),
      Description: agent.reason === "undefined" ? "" : agent.reason,
      DateCreated: agent.createdAt === "undefined" ? "" : agent.createdAt,

    };
  });

  const handleSelect = (e) => {
    setLength(e);
  };

  const columns = [
    // { dataField: 'id', text: 'Id'},

    { dataField: "TransactionType", text: " Transaction Type" },
    { dataField: "TransactionID", text: "Transaction ID" },
    { dataField: "Amount", text: "Amount" },
    { dataField: "MCPCut", text: "MCP Cut" },
    { dataField: "ESLCharge", text: "ESL Charge" },

    { dataField: "PreBalance", text: "Pre-Balance " },
    { dataField: "PostBalance", text: "Post-Balance " },
    {
      dataField: "Description",
      text: "Description Name",
      headerStyle: (colum, colIndex) => {
        return { width: "250px", textAlign: "center", padding: "10px" };
      },
    },
    { dataField: "DateCreated", text: "Date Created" },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  const _handlePageChange = (pageNumber) => {
    console.log(pageNumber)
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };
  return (
    <div>
      {loading && (
        <Loader
          type="TailSpin"
          height={60}
          width={60}
          color="#1E4A86"
        />
      )}

      <div className="table-wrapper">
        <h4>All Agents</h4>
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={products}
          columns={columns}
          defaultSorted={defaultSorted}
          bordered={false}
          hover
          condensed
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
              eventKey={centralPurseTotal ? String(centralPurseTotal) : "0"}
            >
              All
            </Dropdown.Item>
          </DropdownButton>
          <p>Showing {length} to 10 of {centralPurseTotal}</p>
          <div className="pagination">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={10}
              totalItemsCount={centralPurseTotal}
              pageRangeDisplayed={5}
              onChange={_handlePageChange}
            />
          </div>
        </div>
        <FilterModal
          type={"Purse"}
          typetext={"Enter Agent Manager Type"}
          idtext={"Enter Agent Manager ID"}
          show={FilterModalActive}
          name={"centralpurse"}
          close={closeFilter}
          nextPage={nextPage}
          length={length}
          loadPage={FetchCentralPurses}
          handleFilterValue={_handleFilterValue}
          submitFilter={onFilterSubmit}
          transactionsType={transactionsType}

        />
        <ExportModal show={ExportModalActive} close={closeExport} filename='centralPurse file' title={title} headers={headers} item={item} products={products} columns={columns} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    centralPurse: state.purse.centralPurse,
    loading: state.purse.loading,
    error: state.purse.error,
    centralPurseTotal: state.purse.centralPurseTotal,
    transactionsType: state.transactions.transactionsType,

  }
);

export default connect(mapStateToProps, {
  FetchCentralPurse,
  FetchTransactionTypes,

})(CentralPurse);
