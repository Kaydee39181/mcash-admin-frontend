import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "../../theme";

const data = {
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    },
  ],
};

const DoughnutChart = () => {
  const { isDark } = useTheme();

  const options = useMemo(
    () => ({
      legend: {
        labels: {
          fontColor: isDark ? "#c7d2e0" : "#5b6573",
        },
      },
    }),
    [isDark]
  );

  return (
    <div className="donut-chart" style={{ margin: "0", alignItems: "center" }}>
      <p
        style={{
          borderBottom: "1px solid var(--theme-border)",
          padding: "10px",
          color: "var(--theme-text)",
        }}
      >
        Transaction Types
      </p>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
