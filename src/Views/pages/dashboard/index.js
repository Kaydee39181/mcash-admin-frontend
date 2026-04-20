import React, { useEffect, useCallback, useRef, useState } from "react";
import DashboardTemplate from "../../template/dashboardtemplate";
import "./style.css";
import Barchart from "../../../Components/barchart";
import Doughnut from "../../../Components/dougnut";
import axios from "axios";
import { FiCheck, FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  DashboardBreakdown,
  DashboardDetails,
} from "../../../Redux/requests/dashboardRequest";
import { connect } from "react-redux";
import Loader from "../../../Components/secondLoader";
import { AgentConstant } from "../../../constants/constants";
import useVirtualTransactionsForDashboard from "../../../hooks/useVirtualTransactionsForDashboard";
import { copyTextToClipboard } from "../../../utils/copyToClipboard";
import { isAgentManagerRole } from "../../../utils/roleLabel";

const safeParseToken = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeAgents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return [];
};

const DashBoard = (props) => {
  const {
    DashboardBreakdown: DashboardBreakdowns,
    DashboardDetails: DashboardDetail,
    dashboardDetails,
    dashboardBreakdown,
    mostPerformingAgent,
    transactionTypeBreakdown,
    numberOfAgents,
    loading,
  } = props;
  const { successful_value, failed_volume, successful_volume, failed_value } =
    dashboardBreakdown;
  const { totalTransactionValue, totalTransactionVolume } = dashboardDetails;

  const token = safeParseToken();
  const roleName = token?.user?.roleGroup?.name || "";
  const isAgentRole = roleName.trim().toUpperCase() === "AGENT";
  const [accessToken, setAccessToken] = useState(token?.access_token || "");
  const agentFetchOnceRef = useRef(false);
  const copyTimeoutRef = useRef(null);
  const [, setAgentRecord] = useState(null);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const {
    accountNumber: virtualAccountNumber,
    accountName: virtualAccountName,
    loading: virtualAccountLoading,
  } = useVirtualTransactionsForDashboard({
    enabled: isAgentRole,
  });
  const virtualAccountBankName = "Globus Bank";

  const handleCopyAccountNumber = useCallback(async () => {
    if (!virtualAccountNumber || virtualAccountNumber === "N/A") {
      return;
    }

    try {
      await copyTextToClipboard(virtualAccountNumber);
      setCopiedAccountNumber(true);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedAccountNumber(false);
      }, 2200);
      toast.success("Account number copied.", {
        containerId: "transaction-alerts",
        autoClose: 2200,
      });
    } catch {
      toast.error("Unable to copy account number.", {
        containerId: "transaction-alerts",
        autoClose: 2200,
      });
    }
  }, [virtualAccountNumber]);

  useEffect(() => {
    return () => {
      window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Debug: confirm component mounts
    // eslint-disable-next-line no-console
    console.log("[Dashboard] mounted");
  }, []);

  useEffect(() => {
    // Wait for token to exist before firing protected requests.
    if (accessToken) return;

    let attempts = 0;
    const maxAttempts = 10; // ~3s total at 300ms interval

    const tick = () => {
      const t = safeParseToken();
      const nextToken = t?.access_token || "";

      // Debug: confirm token existence
      // eslint-disable-next-line no-console
      console.log("[Dashboard] token exists?", Boolean(nextToken));

      if (nextToken) {
        setAccessToken(nextToken);
        return true;
      }
      return false;
    };

    if (tick()) return;

    const id = window.setInterval(() => {
      attempts += 1;
      if (tick() || attempts >= maxAttempts) {
        window.clearInterval(id);
      }
    }, 300);

    return () => window.clearInterval(id);
  }, [accessToken]);

  const fetchAgent = useCallback(async (tokenValue) => {
    // Debug: confirm API call is triggered
    // eslint-disable-next-line no-console
    console.log("[Dashboard] /agent API call triggered");

    if (!tokenValue) {
      // eslint-disable-next-line no-console
      console.warn("[Dashboard] missing token; skipping /agent call");
      return;
    }

    const headers = {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    };

    // Token-only attempts (no username identity in URL).
    // Prefer the trailing-slash variant since the non-slash version is returning 403 in this environment.
    // As a last resort, try the paged list endpoint without identity filters.
    const candidateUrls = [
      `${AgentConstant.AGENT_URL}/`,
      `${AgentConstant.FETCH_AGENT_URL}startPage=1&length=10`,
    ];

    try {
      for (const url of candidateUrls) {
        try {
          // eslint-disable-next-line no-console
          console.log("[Dashboard] trying:", url);

          const res = await axios.get(url, { headers });

          // eslint-disable-next-line no-console
          console.log(
            "[Dashboard] /agent response:",
            url,
            res?.status,
            res?.data?.responseCode
          );

          const agents = normalizeAgents(res?.data);
          const selfAgentIdRaw =
            token?.user?.agent?.id ??
            token?.user?.agentId ??
            token?.user?.myId ??
            null;
          const selfAgentId = selfAgentIdRaw === null ? null : Number(selfAgentIdRaw);

          // eslint-disable-next-line no-console
          console.log("[Dashboard] self agent id (token):", selfAgentId);

          const selected =
            selfAgentId !== null
              ? agents.find((a) => Number(a?.id) === selfAgentId) || null
              : agents.length === 1
                ? agents[0]
                : null;

          if (selected) {
            setAgentRecord(selected);
            // eslint-disable-next-line no-console
            console.log("[Dashboard] selected agent record (by id):", selected);
          } else {
            // eslint-disable-next-line no-console
            console.log(
              "[Dashboard] could not uniquely select agent record from response; count=",
              agents.length
            );
          }
          return;
        } catch (error) {
          const status = error?.response?.status;
          // eslint-disable-next-line no-console
          console.error("[Dashboard] /agent failed:", url, status, error?.response?.data || error);

          // Keep trying only for "forbidden/not found" style failures where another route may work.
          if (status === 403 || status === 404) continue;
          return;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[Dashboard] /agent failed:", error);
    }
  }, [token]);

  useEffect(() => {
    // Only fetch agent profile/list on dashboard for AGENT role.
    if (!isAgentRole) return;

    // Debug: confirm token existence (single-shot log at decision point)
    // eslint-disable-next-line no-console
    console.log("[Dashboard] token exists?", Boolean(accessToken));

    if (!accessToken) return;
    if (agentFetchOnceRef.current) return;
    agentFetchOnceRef.current = true;

    fetchAgent(accessToken);
  }, [accessToken, fetchAgent, isAgentRole]);

  useEffect(() => {
    DashboardBreakdowns();
    DashboardDetail();
  }, [DashboardBreakdowns, DashboardDetail]);

  let result = transactionTypeBreakdown.reduce(function (tot, arr) {
    return tot + arr.volume;
  }, 0);

  let transactiondetails = transactionTypeBreakdown.map(
    (typeBreakdown, index) => {
      // console.log(typeBreakdown)
      const { volume } = typeBreakdown;
      let percentValues = (volume / result) * 100;
      return (
        <div className="transaction-types-wrapper">
          <div>
            <div className="cashout-dot"></div>
            {typeBreakdown.type}
          </div>
          {console.log(typeBreakdown.volume)}
          <div>
            {volume}({percentValues.toFixed(2)})
          </div>
        </div>
      );
    }
  );
  const name = roleName;
  console.log(name);
  return (
    <DashboardTemplate
      headerContent={
        isAgentRole ? (
          <section
            className="dashboard-account-spotlight"
            aria-label="Agent virtual account details"
          >
            <div className="dashboard-account-spotlight__grid">
              <div className="dashboard-account-spotlight__item dashboard-account-spotlight__item--number">
                <span className="dashboard-account-spotlight__label">
                  Account Number
                </span>
                <div className="dashboard-account-spotlight__value-row">
                  <span className="dashboard-account-spotlight__value dashboard-account-spotlight__value--mono">
                    {virtualAccountLoading ? "Loading..." : virtualAccountNumber}
                  </span>
                  <button
                    type="button"
                    className="dashboard-account-copy-btn"
                    onClick={handleCopyAccountNumber}
                    disabled={
                      virtualAccountLoading || !virtualAccountNumber || virtualAccountNumber === "N/A"
                    }
                    aria-label="Copy account number"
                    title={copiedAccountNumber ? "Copied" : "Copy account number"}
                  >
                    {copiedAccountNumber ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
              <div className="dashboard-account-spotlight__item dashboard-account-spotlight__item--name">
                <span className="dashboard-account-spotlight__label">
                  Account Name
                </span>
                <span className="dashboard-account-spotlight__value dashboard-account-spotlight__value--name">
                  {virtualAccountLoading ? "Loading..." : virtualAccountName}
                </span>
              </div>
              <div className="dashboard-account-spotlight__item dashboard-account-spotlight__item--bank">
                <span className="dashboard-account-spotlight__label">
                  Bank Name
                </span>
                <span className="dashboard-account-spotlight__value dashboard-account-spotlight__value--bank">
                  {virtualAccountLoading ? "Loading..." : virtualAccountBankName}
                </span>
              </div>
            </div>
          </section>
        ) : null
      }
    >
      <div className="dashboard-wrapper">
        {loading && (
          <Loader
            type="TailSpin"
            height={60}
            width={60}
            color="#1E4A86"
          />
        )}

        <div className="dashboard-hero">
          <div className="header-title">
            <h3>Dashboard</h3>
            <p>An overview of all activities on mCashPoint</p>
          </div>
        </div>

        <div className="graphs-wrapper">
          <div className="Dashboard-overview-wrapper">
            {name === "ADMIN" ||
            name === "Senior Management" ||
            isAgentManagerRole(name) ||
            name === "Product" ? (
              <div className="flex-box ">
                <div className="person-background"></div>
                <div>
                  <div>{numberOfAgents ? numberOfAgents : "00"}</div>
                  <div>Agents </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* <div className="flex-box">
              <div className="mark-background"></div>
              <div>
                <div>0</div>
                <div>Unique Customers</div>
              </div>
            </div> */}
            <div className="flex-box">
              <div className="underperform-background"> </div>
              <div>
                <div>
                  {totalTransactionVolume ? totalTransactionVolume : "#00"}
                </div>
                <div>Total transaction Volume</div>
              </div>
            </div>
            <div className="flex-box ">
              <div className="book-background"> </div>
              <div>
                <div>
                  {totalTransactionValue ? totalTransactionValue : "#00"}
                </div>
                <div>Total transaction Value</div>
              </div>
            </div>
          </div>

          {/* <div className="transaction-graph-wrapper"> */}
          {isAgentManagerRole(name) ? "" : (
          <div className="line-and-details">
           <div className="chart-status">
              <div className="chart-bg">
                <Barchart />
              </div>
              <div className="transaction-graph-inner">
                <div className="transaction-details a">
                  <p>Successful</p>
                  <h6 className="success-text">
                    {successful_value
                      ? successful_value.toLocaleString()
                      : "#0000"}
                    (
                    {successful_volume ? successful_volume.toLocaleString() : "0"}
                    )
                  </h6>
                </div>
                <div className="transaction-details">
                  <p>Failed</p>
                  <h6 className="failure-text ">
                    {failed_value ? failed_value.toLocaleString() : "#000"}(
                    {failed_volume ? failed_volume.toLocaleString() : "0"})
                  </h6>
                </div>
                <div className="transaction-details b">
                  <p>Agent Registered</p>
                  <h6>{numberOfAgents ? numberOfAgents : "00"}</h6>
                </div>
              </div>
            </div>
            <div className="dough-agent">
              <div className="dougnut-wrapper">
                <div className="dougnut-chart">
                  <Doughnut />
                </div>
                <div className="transaction-types">
                  {transactiondetails}
                </div>
              </div>
               <div className="bar-graph-wrapper">
              {/* <div className="barchart-bg">
                <Barchart />
              </div> */}
              {name === "ADMIN" ||
              name === "Senior Management " ||
              name === "Product" ? (
                <div className="daily-per-agent">
                  <div id="daily-header">Daily Top Performing Agents</div>
                  <ul className="daily-per-agent-list">
                    {mostPerformingAgent
                      .slice(0, 5)
                      .map((PerformingAgent, index) => (
                        <li
                          className="daily-per-agent-item"
                          key={`${PerformingAgent.businessName || "agent"}-${index}`}
                        >
                          <span className="daily-per-agent-name">
                            {PerformingAgent.businessName || "Unnamed Agent"}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
          </div>
            </div>

         
          </div>
          )}
        </div>

      </div>
    </DashboardTemplate>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    dashboardBreakdown: state.dashboard.dashboardBreakdown,
    dashboardDetails: state.dashboard.dashboardDetails,
    mostPerformingAgent: state.dashboard.mostPerformingAgent,
    transactionTypeBreakdown: state.dashboard.transactionTypeBreakdown,
    numberOfAgents: state.dashboard.numberOfAgents,
    loading: state.dashboard.loading,
    error: state.dashboard.error,
  };
};

export default connect(mapStateToProps, {
  DashboardBreakdown,
  DashboardDetails,
})(DashBoard);
