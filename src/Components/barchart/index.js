import React, { Component } from "react";
import {Bar} from 'react-chartjs-2';
import './style.css';

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

const options={
  legend: {
    display: false
},

  tooltips: {
    callbacks: {
       label: function(tooltipItem) {
              return tooltipItem.yLabel;
       }
    }
  },
    scales: {
        xAxes: [{
            barPercentage: 0.2
        }]
    },
        maintainAspectRatio: false
}

class BarChart extends Component {
    state = {
  
    };
  
    
    render() {
    return (
      <div className="bar-wrap">
        <div
          className="label-wrap"
          style={{
            borderBottom: "1px solid #E2E2E2",
            paddingBottom: "5px",
            marginBottom: "10px",
          }}
        >
          Transaction Success per Month(volume)
          <div className="success-green"></div>
          <span>Successful </span>
          <div className="failure-red"></div>
          <span>Failed </span>
        </div>
        <Bar data={data} width={80} height={100} options={options} />
      </div>
    );
}
};


export default BarChart