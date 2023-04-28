import React, { Component } from "react";
import {Line} from 'react-chartjs-2';
import './style.css';


const data = {
  labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
  datasets: [
    {
      label: '',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgb(55, 81, 255)',
      borderColor: 'rgb(26, 183, 89,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgb(26, 183, 89,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgb(26, 183, 89,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [7000, 10000, 15000, 20000, 25000]
    },
    {
        
        fill: false,
        // lineTension: 0.1,
        backgroundColor: 'rgb(72 94 175 / 40%)',
        borderColor: 'rgb(233, 60, 60,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        // borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(233, 60, 60,1)',
        pointBackgroundColor: '#fff',
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(233, 60, 60,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        // pointHitRadius: 10,
        data: [ 25000,20000,15000,1000,7000]
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
}

class LineChart extends Component {
    state = {
  
    };
  
    
    render() {
    return (
      <div className='line-wrap'>
        <div className='label-wrap' style={{marginBottom:"20px"}}>Showing transaction Volume for : Today <div className='success-green'></div><span>Successful </span> <div className='failure-red'></div><span>Failed </span></div>
        <Line data={data} options={options} height={100} />
      </div>
    );
  }
};




export default LineChart