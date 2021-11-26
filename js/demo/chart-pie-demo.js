// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["白色", "企業綠", "行銀綠(底色)", "中性色", "產品色"],
    datasets: [{
      data: [50, 25, 15, 5, 5],
      backgroundColor: ['#ffffff', '#00a19b', '#F4F8FA', '#acacac', '#D20065'],
      borderColor: "rgba(234, 236, 244, 1)",
      hoverBackgroundColor: ['#ffffff', '#00a19b', '#F4F8FA', '#acacac', '#D20065'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
