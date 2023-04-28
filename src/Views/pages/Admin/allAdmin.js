import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { FetchAdmin } from "../../../Redux/requests/adminRequest";
import Loader from "../../../Components/secondLoader";
import { connect } from "react-redux";
import ExportModal from "../../../Components/Exports/index";
import FilterModal from "../../../Components/Filter/index";
import Pagination from "react-js-pagination";
import EditUser from "./editAdmin";
// import {history} from '../../../utils/history'
import { Link } from "react-router-dom";

import "./style.css";

const AdminFetch = (props) => {
  console.log(props);
  const {
    FetchAdmin: FetchAdmins,
    allAdmin,
    allAdminTotal,
    loading,
    showFilterModal,
    FilterModalActive,
    showExportModal,
    ExportModalActive,
    agentManagerTotal,
    initialState,
    filterValues,
    setFilterValues,
    history,
  } = props;
  const [nextPage, setNextPage] = useState(0);
  const [length, setLength] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [adminDetails, setAdminDetails] = useState([]);

  const [editadmin, showEditAdminModal] = useState(false);

  console.log(adminDetails);
  // const [filterValues, setFilterValues] = useState(initialState);

  useEffect(() => {
    FetchAdmins(nextPage, length, filterValues);
  }, [nextPage, length, filterValues]);

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
    FetchAdmins(nextPage, length, filterValues);
    showExportModal(false);
  };

  const _handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setNextPage(pageNumber - 1);
  };

  const EditAdmin = (details) => {
    showEditAdminModal(true);
    setAdminDetails(details)
  };
  const closeAdminModal = () => {
    showEditAdminModal(false);
    window.location.reload();

  };

  const products = allAdmin.map((admin, index) => {
    console.log(admin);
    return {
      //   id: index,
      memberid: admin.user.memberId === null ? "" : admin.user.memberId,
      id: admin.id === null ? "" : admin.id,
      firstname: admin.user.firstname === null ? "" : admin.user.firstname,
      lastname: admin.user.lastname === null ? "" : admin.user.lastname,
      username: admin.user.username === null ? "" : admin.user.username,
      DateCreated: admin.user.createdAt === null ? "" : admin.user.createdAt,
      roleGroupName: admin.user === null ? "" : admin.user.roleGroup.name,
      Active: admin.user.enabled === null ? "" : admin.user.enabled,
      email: admin.user.email === null ? "" : admin.user.email,

    };
  });

  const columns = [
    // { dataField: 'id', text: 'Id'},
    {
      dataField: "memberid",
      text: "ID",
      formatter: (cellContent, row) => {
        console.log(row);
        return (
          <button
            type="button"
            onClick={() => EditAdmin(row)}
            className=" editadmin"
          >
            {row.memberid}
          </button>
        );
      },
    },
    {
      dataField: "firstname",
      text: "First Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "lastname",
      text: "Last Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "username",
      text: "User Name",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "DateCreated",
      text: "Created Date",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "roleGroupName",
      text: "Role Group",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
    {
      dataField: "Active",
      text: "Active",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
    },
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
        <h4>All Admins</h4>
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
        <p>Showing 1 to 10 of {agentManagerTotal}</p>
        <div className="pagination">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={10}
            totalItemsCount={allAdminTotal}
            pageRangeDisplayed={5}
            onChange={_handlePageChange}
          />
        </div>
      </div>
      <FilterModal
        type={"Agent Manager "}
        typetext={"Enter Agent Manager Type"}
        idtext={"Enter Agent Manager ID"}
        show={FilterModalActive}
        name={"agentmanager"}
        close={closeFilter}
        nextPage={nextPage}
        length={length}
        loadPage={FetchAdmin}
        handleFilterValue={_handleFilterValue}
        submitFilter={onFilterSubmit}
      />
      <EditUser
        load={loading}
        show={editadmin}
        close={closeAdminModal}
        adminDetails={adminDetails}
      />
      <ExportModal show={ExportModalActive} close={closeExport} />
    </div>
  );
};
const mapStateToProps = (state) => (
  console.log(state),
  {
    allAdmin: state.admins.allAdmin,
    loading: state.admins.loading,
    error: state.admins.error,
    allAdminTotal: state.admins.allAdminTotal,
  }
);

export default connect(mapStateToProps, {
  FetchAdmin,
})(AdminFetch);
