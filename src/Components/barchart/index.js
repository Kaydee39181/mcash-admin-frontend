import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../../theme";
import "./style.css";

const data = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      pointHoverRadius: 5,
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [5000, 10000, 150000, 20000,25000]
    },
    {
        label: 'My First dataset',
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 1,
        hoverBackgroundColor: 'green',
        pointHoverRadius: 5,
        hoverBorderColor: 'grren',
        data: [5000, 10000, 150000, 20000,25000]
      }
  ]
};

const BarChart = () => {
  const { isDark } = useTheme();

  const options = useMemo(
    () => ({
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            return tooltipItem.yLabel;
          },
        },
      },
      scales: {
        xAxes: [
          {
            barPercentage: 0.2,
            gridLines: {
              color: isDark ? "rgba(148, 163, 184, 0.14)" : "rgba(15, 23, 42, 0.08)",
            },
            ticks: {
              fontColor: isDark ? "#c7d2e0" : "#5b6573",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: isDark ? "rgba(148, 163, 184, 0.14)" : "rgba(15, 23, 42, 0.08)",
            },
            ticks: {
              fontColor: isDark ? "#c7d2e0" : "#5b6573",
            },
          },
        ],
      },
      maintainAspectRatio: false,
    }),
    [isDark]
  );

  return (
    <div className="bar-wrap">
      <div className="label-wrap bar-wrap__label">
        Transaction Success per Month(volume)
        <div className="success-green"></div>
        <span>Successful </span>
        <div className="failure-red"></div>
        <span>Failed </span>
      </div>
      <Bar data={data} width={80} height={100} options={options} />
    </div>
  );
};

export default BarChart;
