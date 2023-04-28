import React, { Component, useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import DashboardTemplate from "../../template/dashboardtemplate";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Button, Table } from "react-bootstrap";
import {
  FetchRangeMax,
  FetchConvieneceFee,
  CreateConvenienceFee
} from "../../../Redux/requests/agentFeesRequest";
import { FetchTransactionTypes } from "../../../Redux/requests/transactionRequest";
import { connect } from "react-redux";
import EditAgentFees from "./editAgentfees";
import { useForm } from "react-hook-form";
import SweetAlert from 'react-bootstrap-sweetalert';
import "./style.css";
import AgentFeeInlineForm from "./AgentFeeInlineForm";

const AgentFees = (props) => {
  const {
    loading,
    FetchTransactionTypes: FetchTransactionType,
    transactionsType,
    FetchRangeMax: FetchRangeMaxs,
    maxrange,
    FetchConvieneceFee: FetchConvieneceFees,
    CreateConvenienceFee: CreateConvenienceFees,
    conviencefees,
    successCreatefees
  } = props;
  const [createModalActive, showCreateModal] = React.useState(false);
  const [active, showActive] = React.useState("home");
  const [ExportModalActive, showExportModal] = React.useState(false);
  const [transtype, setTransType] = React.useState("");
  const [rangetype, setRangeType] = React.useState([]);
  const [FilterModalActive, showFilterModal] = React.useState(false);
  const [newfees, setNewFees] = React.useState([]);
  const [editfee, showEditFeeModal] = useState(false);
  const [feeDetails, setFeeDetails] = useState([]);
  const [indexes, setIndexes] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [danger, setDanger] = useState(false);
  const [success, setSucess] = useState(false);
  const [title, setTitle] = useState('');
  const [smShow, setSmShow] = useState(false)


  const { register, handleSubmit, watch, setValue, errors, formState: { isValid } } = useForm({ mode: 'all' });
  console.log('errors', errors)

  const values = watch();
  console.log('values', values)
  const transactionMap = values.fees ? values.fees.reduce((map, data, index) => {
    const transactionData = map[data.transactionTypeId] || []
    const updateMap = data.transactionTypeId ? { [data.transactionTypeId]: [...transactionData, { ...data, index }] } : {}
    return ({ ...map, ...updateMap })
  }, {}) : {}

  function isFirstTransactionTypeOccurence(index, transactionTypeId) {
    const transactionTypeData = transactionMap[transactionTypeId] || [];
    const firstOccurrence = transactionTypeData[0];

    return firstOccurrence ? firstOccurrence.index === index.id : false
  }

  function closemodal() {
    setSmShow(false)
    window.location.reload();

  }


  useEffect(() => {
    Object.keys(transactionMap).map(key => {
      const keyData = transactionMap[key]
      keyData.forEach((data, index) => {
        const prevTransaction = keyData[index - 1] || {}
        if (prevTransaction.max) {
          const minRange = Number(prevTransaction.max) + 1;
          if (minRange !== Number(data.min)) {
            setValue(`fees[${data.index}].min`, `${minRange}`)
          }
        }
      })
    })
  }, [transactionMap])

  useEffect(() => {
    FetchTransactionType();
    FetchRangeMaxs();
    FetchConvieneceFees();
    handleAdd();
    // setIndexes()
  }, []);

  useEffect(() => {
    if (successCreatefees) {
      setSmShow(true)
      setTitle("FEES CREATED SUCCESFULLY")
      setDanger(false)
      setSucess(true)
    }

  }, [successCreatefees]);

  useEffect(() => {
    if (successCreatefees == false) {
      setTitle("FEES CANT BE CREATED")
      setDanger(true)
      setSucess(false)
      setSmShow(true)
    }
  }, [successCreatefees]);

  const modifyIndex = (index, type) => {
    console.log(index, type)
    const otherIndexes = indexes.filter((item) => item.id !== index.id);
    const incrementCount = indexes.filter((item) => item.type === type).length;
    setIndexes([
      ...otherIndexes,
      { ...index, type, increment: incrementCount },
    ]);
  };

  const onSubmit = (data) => {
    console.log('heloo')
    console.log(data)
    CreateConvenienceFees(data)
  };

  const handleAdd = () => {
    const rangeValue = rangetype;
    console.log(rangeValue)
    // return 
    rangeValue.push({
      transactionTypeId: "",
      max: "",
      min: "",
      fee: "",
      ambassadorCut: "",
      rangeType: "",
    });
    setRangeType(rangeValue);
    setIndexes((prevIndexes) => [
      ...prevIndexes,
      {
        id: counter,
        increment: prevIndexes.filter((index) => index.id === counter).length,
      },
    ]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  // const handleSelectTransType = (e) => {
  //   setTransType(e.target.value)
  //   FetchRangeMaxs(e.target.value)
  // }
  const handleSelectRangeType = (e) => {
    setRangeType(e.target.value);
  };

  const EditFees = (details) => {
    showEditFeeModal(true);
    setFeeDetails(details);
  };
  const closeFeesModal = () => {
    showEditFeeModal(false);
    window.location.reload();
  };

  const handleInputRangeType = async (value, index, type) => {
    return new Promise((resolve) => {
      const rangeValue = rangetype.map(async (element, ind) => {
        if (ind === index && type === "transactionTypeId") {
          const rangeMax = await FetchRangeMaxs(value);
          if (rangeMax) {
            resolve(rangeMax.data);
          }
          element.transactionTypeId = value;
          element.min = maxrange;
        }
        if (ind === index && type === "max") {
          element.max = value;
        }

        if (ind === index && type === "fee") {
          element.fee = value;
        }
        if (ind === index && type === "ambassadorCut") {
          element.ambassadorCut = value;
        }

        if (ind === index && type === "rangeType") {
          element.rangeType = value;
        }

        return element;
      });

      setRangeType(rangeValue);
    });
  };


  const products = conviencefees.map((conviencefee) => {
    // console.log(conviencefees);
    return {
      id: conviencefees.id === "undefined" ? "" : conviencefee.id,
      fee: conviencefee.fee === "undefined" ? "" : conviencefee.fee,
      ambassadorCut:
        conviencefees.ambassadorCut === "undefined"
          ? ""
          : conviencefee.ambassadorCut,
      MinLimit: conviencefee.min === "undefined" ? "" : conviencefee.min,
      MaxLimit: conviencefee.max === "undefined" ? "" : conviencefee.max,
      rangeType:
        conviencefee.rangeType === "undefined" ? "" : conviencefee.rangeType,
      TransactionsType:
        conviencefee.transactionType === "undefined"
          ? ""
          : conviencefee.transactionType.type,
      UpdateFees:
        conviencefee.systemTime === "undefined" ? "" : conviencefee.systemTime,
    };
  });

  const columns = [
    {
      dataField: "fee",
      text: "Agent Fee",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "ambassadorCut",
      text: " Agent Managers Cut(%)",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "MinLimit",
      text: "Min Limit",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "MaxLimit",
      text: "Max Limit",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "rangeType",
      text: "Range Type",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "TransactionsType",
      text: "Transactions Type",
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", padding: "10px" };
      },
      bodyStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "center", color: "#00249C" };
      },
    },
    {
      dataField: "UpdateFields",
      text: "Update Fields",
      formatter: (cellContent, row) => {
        return (
          <h5>
            <button
              type="button"
              onClick={() => EditFees(row)}
              className="viewTransac"
            >
              Update
            </button>
          </h5>
        );
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
    <DashboardTemplate>
      <SweetAlert
        show={smShow}
        success={success}
        danger={danger}
        title={title}
        showCancelButton
        onConfirm={() => {
          closemodal(false)
        }}
        onCancel={() => {
          closemodal(false)
        }}
        onEscapeKey={() => closemodal()}
        onOutsideClick={() => closemodal()}
      />
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>Agent Fees</h3>
        </div>

        <div className="agent-transact-header">
          <div>
            <div>
              <div>Manage all agent fees on mCashPoint</div>
            </div>
          </div>
        </div>

        <div className="addbtn">
          <Button variant="success" disabled={!isValid} onClick={() => handleAdd()}>
            ADD
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="transaction-table">
            <Table className="border text-center" responsive>
              <thead className="transaction-table-header">
                <tr>
                  <th className="text-primary">Transaction Type</th>
                  <th className="text-primary">Minimum Limit</th>
                  <th className="text-primary">Maximum Limit</th>
                  <th className="text-primary">Range Type</th>
                  <th className="text-primary">Charge</th>
                  <th className="text-primary">Agent Manager’s Cut</th>
                </tr>
              </thead>

              {indexes.map((index) => {
                const fieldName = `fees[${index.id}]`;
                return (
                  <AgentFeeInlineForm
                    fieldName={fieldName}
                    register={register}
                    transactionsType={transactionsType}
                    rangetype={rangetype}
                    handleInputRangeType={handleInputRangeType}
                    index={index}
                    modifyIndex={modifyIndex}
                    setValue={setValue}
                    watch={watch}
                    getIsFirstOccurrence={isFirstTransactionTypeOccurence}
                    error={errors.fees ? errors.fees[index.id] : {}}
                  />
                );
              })}
            </Table>
          </div>
          <div className="note">
            <p>
              NOTE: For Hybrid Fees use a Semicolon, to seperate the percentage
              and flat fee. Percentage, Flat Fee E,g 0.65:10{" "}
            </p>
            <Button className="notebtn" type="submit" variant="primary">
              SUBMIT
            </Button>
          </div>
        </form>
        <div className="table-wrapper">
          <h4>Agent Fees</h4>
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
        {/* <FetchAgentFees
              ExportModalActive={ExportModalActive}
              FilterModalActive={FilterModalActive}
              showExportModal={showExportModal}
              showFilterModal={showFilterModal}
            /> */}
      </div>
      <EditAgentFees
        load={loading}
        show={editfee}
        close={closeFeesModal}
        feeDetails={feeDetails}
      />
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => (
  console.log(state),
  {
    transactionsType: state.transactions.transactionsType,
    maxrange: state.agentfees.maxrange,
    conviencefees: state.agentfees.conviencefees,
    loading: state.agentfees.loading,
    successCreatefees: state.agentfees.successCreatefees
  }
);

export default connect(mapStateToProps, {
  FetchTransactionTypes,
  FetchRangeMax,
  FetchConvieneceFee,
  CreateConvenienceFee
})(AgentFees);
