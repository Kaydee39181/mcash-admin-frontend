import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

const data = {
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

class DoughnutChart extends Component {
  state = {};

  render() {
    return (
      <div
        className="donut-chart"
        style={{ margin: "0", alignItems: "center" }}
      >
        <p style={{ borderBottom: "1px solid #EEF0F7", padding: " 10px" }}>
          Transaction Types
        </p>
        <Doughnut data={data} />
      </div>
    );
  }
}

export default DoughnutChart;
