// barChart.js

// Bar chart data for the percentage of the population with disabilities
const chartData = [
    { city: "Vashon", percentage: 35 },
    { city: "Bellevue", percentage: 11 },
    { city: "Shoreline", percentage: 21 },
    { city: "Auburn", percentage: 19 },
    { city: "Tukwila", percentage: 26 }
];

// Create the bar chart
const ctx = document.getElementById('disabilitiesChart').getContext('2d');
const disabilitiesChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: chartData.map(item => item.city),
    datasets: [{
      label: 'Percentage of Population with Disabilities',
      data: chartData.map(item => item.percentage),
      backgroundColor: '#9b59b6', // Purple color for bars
      borderColor: '#8e44ad',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Disability % in The Major Suburbs', // Title for the bar chart
        font: {
          size: 18,
          weight: 'bold',
          family: 'Arial, sans-serif',
        },
        color: '#333' // Title color
      },
      tooltip: {
        callbacks: {
          // Only display the percentage in the tooltip
          label: function(context) {
            return context.raw + "%"; // Show just the percentage
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          max: 50
        }
      }
    }
  }
});
