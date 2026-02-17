import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  Nav,
  NavItem,
  NavLink,
  DropdownButton,
  Dropdown,
} from "react-bootstrap"
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { FetchAudit } from "../../../Redux/requests/auditRequest";
import Loader from "../../../Components/secondLoader";
import Upload from "../../../Assets/img/upload.png";
import Filter from "../../../Assets/img/filter.png";
import Print from "../../../Assets/img/printer.png";
import ExportModal from "../../../Components/Exports";
import FilterModal from "../../../Components/Filter";
import DashboardTemplate from "../../template/dashboardtemplate";
import Pagination from "react-js-pagination";
import { connect } from "react-redux";
import "./style.css";

const Audit = (props) => {
  const { FetchAudit: FetchAudits, audits, loading, auditTotal } = props;
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [exportModalActive, showExportModal] = useState(false);
  const [FilterModalActive, showFilterModal] = useState(false);
  const [viewReceipt, setViewReceipt] = useState("");
  const [receiptview, showReceiptView] = useState(false);
  console.log(audits);
  useEffect(() => {
    FetchAudits(nextPage, length, filterValues);
  }, [nextPage, length]);

  const initialState = {
    startDate: "",
    endDate: "",

  };
  const [filterValues, setFilterValues] = useState(initialState);

  const products = audits.map((aud, index) => {
    return {
      id: index,
      AgentID: aud.user.memberId === "undefined" ? "" : aud.user.memberId,
      UserName: aud.user.username === "undefined" ? "" : aud.user.username,
      Actions: aud.action === "undefined" ? "" : aud.action,
      IpAdress: aud.ip === "undefined" ? "" : aud.ip,
      RequestMethod: aud.requestMethod === "undefined" ? "" : aud.requestMethod,
      pageAccessed: aud.url === 'undefined' ? '' : aud.url,
      DataAccessed: aud.time === 'undefined' ? '' : aud.time,
    };
  });

  const item = audits.map((aud) => [
    aud.user.memberId,
    aud.user.username,
    aud.action,
    aud.ip,
    aud.url,
    aud.requestMethod,
    aud.time
  ]);
  const title = "Audit page";
  const headers = [
    [
      "Agent ID",
      "User Name",
      "Actions",
      "IP Address",
      "Page Accessed",
      "Request Method",
      "Date Accessed",
    ],
  ];


  const columns = [
    // { dataField: 'id', text: 'Id'},
    { dataField: "AgentID", text: "Agent ID" },
    {
      dataField: "UserName",
      text: "User Name",
      style: { width: "20em", whiteSpace: "normal", wordWrap: "break-word" },
      headerStyle: (colum, colIndex) => {
        return { width: "200px", textAlign: "center" };
      },
    },
    { dataField: "Actions", text: "Actions" },

    { dataField: "IpAdress", text: "IP Address" },

    { dataField: "pageAccessed", text: "Page Accessed" },

    { dataField: "RequestMethod", text: "Request Method" },

    { dataField: "DataAccessed", text: "Date Accessed" },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const _handleFilterValue = (event) => {
    console.log(event);
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
    setNextPage(0);
    showExportModal(false);
  };

  const resetFilter = (event) => {
    event.preventDefault();

    setFilterValues({ ...initialState });
  };
  const handleSelect = (e) => {
    setLength(e);
  };
  const onFilterSubmit = (event) => {
    event.preventDefault();
    FetchAudits(nextPage, length, filterValues);
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
          <Loader
            type="TailSpin"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}
        <div className="header-title">
          <h3>Audit</h3>
        </div>
        <div className="agent-transact-header">
          <div>Overview of agent activities on mCashPoint</div>
          <div className="manage-agent">
            <span>
              <img src={Print} />
              Print
            </span>

            <span onClick={() => OpenFilter()}>
              <img src={Filter} />
              Filter
            </span>

            <span>
              <img src={Upload} onClick={() => showExportModal(true)} />
              Export
            </span>
          </div>
        </div>
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
          <FilterModal
            type={"Audit"}
            typetext={"Enter Transaction Type"}
            idtext={"Enter Transaction ID"}
            show={FilterModalActive}
            close={closeFilter}
            nextPage={nextPage}
            length={length}
            loadPage={FetchAudits}
            handleFilterValue={_handleFilterValue}
            submitFilter={onFilterSubmit}
            name={"audits"}

          />
          <ExportModal
            show={exportModalActive}
            close={closeExport}
            filename="audits file"
            title={title}
            headers={headers}
            item={item}
            products={products}
            columns={columns}
            filterValues={filterValues}
          />
          <div className="pagination_wrap">
            <p>Showing 1 to {length} of {auditTotal}</p>
            <div className="pagination">
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
                  eventKey={auditTotal ? String(auditTotal) : "0"}
                >
                  All
                </Dropdown.Item>
              </DropdownButton>
              <Pagination
                activePage={activePage}
                itemsCountPerPage={length}
                totalItemsCount={auditTotal}
                pageRangeDisplayed={5}
                onChange={_handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    audits: state.audit.audit,
    auditTotal: state.audit.auditTotal,
    loading: state.audit.loading,
    error: state.audit.error,
  }
);

export default connect(mapStateToProps, {
  FetchAudit,
})(Audit);
