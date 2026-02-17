import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import { FetchSettlement } from "../../../Redux/requests/agentManagerRequest";
import Loader from "../../../Components/secondLoader";
import DashboardTemplate from "../../template/dashboardtemplate";
import { connect } from "react-redux";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import Pagination from "react-js-pagination";

import "./style.css";

const FetchAgentsSettlement = (props) => {
  const {
    FetchSettlement: FetchSettlements,
    agents,
    loading,
    showFilterModals,
    FilterModalActives,
    showExportModals,
    ExportModalActives,
    settlement,
    agentSettleTotal,
  } = props;

  const [nextPage, setNextPage] = useState(1);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);
  console.log(settlement);
  const initialState = {
    username: "",
    month: "",
    year: "",
  };
  const [filterValues, setFilterValues] = useState(initialState);

  useEffect(() => {
    FetchSettlements(nextPage, length, initialState);
  }, []);
  const closeExport = () => {
    showExportModals(false);
  };
  const closeFilter = () => {
    showFilterModals(false);
  };
  function _handleFilterValue(event) {
    console.log(event);
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    showExportModals(false);
  }
  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchSettlements(nextPage, length, filterValues);
    showExportModals(false);
  };

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  const title = "Settlement page";
  const headers = [
    [
      "Agent Manager Name",
      "Account Details",
      "Amount Accured",
      "Month",
      "Year",
    ],
  ];

  const item = settlement.map((settle) => [
    settle.ambassador.user.fullName,
    settle.ambassador.accountName +
      " | " +
      settle.ambassador.accountNumber +
      " | " +
      settle.ambassador.bank.name,
    settle.amountAccrued,
    settle.month,
    settle.year,
  ]);

  const products = settlement.map((settle, index) => {
    console.log(settle.ambassador.accountName, settle.ambassador.accountNumber);
    return {
      id: index,
      AgentManagerName:
        settle.ambassador.user.fullName === null
          ? ""
          : settle.ambassador.user.fullName,
      AccountDetails:
        settle.ambassador === null
          ? ""
          : settle.ambassador.accountName +
            " | " +
            settle.ambassador.accountNumber +
            " | " +
            settle.ambassador.bank.name,
      AmountAccured: settle.amountAccrued === null ? "" : settle.amountAccrued,
      Month: settle.month === null ? "" : settle.month,
      Year: settle.year === null ? "" : settle.year,
    };
  });

  const columns = [
    // { dataField: 'id', text: 'Id'},
    { dataField: "AgentManagerName", text: " Agent Manager Name" },
    { dataField: "AccountDetails", text: "Account Details" },
    { dataField: "AmountAccured", text: "Amount Accured" },
    { dataField: "Month", text: "Month" },
    { dataField: "Year", text: "Year" },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];

  return (
    <div>
      {loading && (
        <Loader
          type="TailSpin"
          type="Oval"
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
      </div>
      <div className="pagination_wrap">
        <p>Showing 1 to 10 of {agentSettleTotal}</p>
        <div className="pagination">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={10}
            totalItemsCount={agentSettleTotal}
            pageRangeDisplayed={5}
            onChange={_handlePageChange}
          />
        </div>
      </div>
      <FilterModal
        type={"Agent Manager "}
        typetext={"Enter Agent Manager Type"}
        idtext={"Enter Agent Manager ID"}
        show={FilterModalActives}
        name={"settlement"}
        close={closeFilter}
        nextPage={nextPage}
        length={length}
        loadPage={FetchSettlements}
        handleFilterValue={_handleFilterValue}
        submitFilter={onFilterSubmit}
      />
      <ExportModal
        show={ExportModalActives}
        close={closeExport}
        filename="Settlement file"
        title={title}
        headers={headers}
        item={item}
        products={products}
        columns={columns}
        filterValues={filterValues}
      />
    </div>
  );
};
const mapStateToProps = (state) => (
  console.log(state),
  {
    settlement: state.agentmanager.settlement,
    loading: state.agentmanager.loading,
    error: state.agentmanager.error,
    agentSettleTotal: state.agentmanager.agentSettleTotal,
  }
);

export default connect(mapStateToProps, {
  FetchSettlement,
})(FetchAgentsSettlement);
