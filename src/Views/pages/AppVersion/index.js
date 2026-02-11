import React, { useState, useEffect } from "react";
import DashboardTemplate from "../../template/dashboardtemplate";
import {
  AllApiVersion,
  CreateApiVersion,
  DeleteApiVersions,
} from "../../../Redux/requests/apiVersionRequest";
import { connect } from "react-redux";
import Loader from "../../../Components/secondLoader";
import { useForm } from "react-hook-form";

import "./style.css";

const AppVersion = ({
  AllApiVersion: FetchAllApiVersion,
  CreateApiVersion: AddApiVersion,
  DeleteApiVersions: DeleteApiVersion,
  apiVersions,
  loading,
  success,
  deleteApiSuccess
}) => {
  const [version, setVersions] = useState("");
  // const [register, setDeleteVersions] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    FetchAllApiVersion();
  }, []);

  useEffect(() => {
console.log(success,deleteApiSuccess)
    if(success || deleteApiSuccess){
      window.location.reload();
    }
  }, [success,deleteApiSuccess]);


  const onSubmit = (event) => {
    event.preventDefault();
    AddApiVersion(version);
    FetchAllApiVersion();
    console.log(version);
  };

  const onDelete = (data) => {
    console.log(data)
    DeleteApiVersion(data);
  };

  return (
    <DashboardTemplate>
      {loading && (
        <Loader
          type="TailSpin"
          height={60}
          width={60}
          color="#1E4A86"
        />
      )}
      <div className="transact-wrapper">
        <div className="header-title">
          <h3>App Version</h3>
        </div>
        <div className="agent-transact-header">
          <div>Add App Version</div>
        </div>
        <div className="app-version">
          <div>ADD APP VERSION</div>
          <form onSubmit={onSubmit}>
            <div className="inputs">
              {apiVersions.map((apiver, index) => {
                console.log(apiver.id);
                return (
                  <div>
                    <input
                      type="checkbox"
                      name="version"
                      ref={register}
                      value={apiver.id}
                    />
                    <label htmlFor="tick">{apiver.version}</label>
                  </div>
                );
              })}

              <div>
                <p>App Version</p>
                <input
                  className="input-text"
                  type="text"
                  name="version"
                  onChange={(e) => setVersions(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="butons">
              <input type="submit" value="Add" />
              <input
                type="button"
                value="Delete"
                onClick={handleSubmit(onDelete)}
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    apiVersions: state.apiversions.apiVersions,
    loading: state.apiversions.loading,
    success: state.apiversions.createApiSuccess,
    deleteApiSuccess: state.apiversions.deleteApiSuccess
  };
};

export default connect(mapStateToProps, {
  AllApiVersion,
  CreateApiVersion,
  DeleteApiVersions,
})(AppVersion);
