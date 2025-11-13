// Get user token
var userToken = localStorage.getItem('token');
if (!userToken) {
    window.location.href = 'login.html';
}

var categoryChart, monthlyChart;

// Get chart colors from CSS variables
function getChartColors() {
    var root = getComputedStyle(document.documentElement);
    return {
        palette: [
            root.getPropertyValue('--chart-color-1').trim(),
            root.getPropertyValue('--chart-color-2').trim(),
            root.getPropertyValue('--chart-color-3').trim(),
            root.getPropertyValue('--chart-color-4').trim(),
            root.getPropertyValue('--chart-color-5').trim(),
            root.getPropertyValue('--chart-color-6').trim(),
            root.getPropertyValue('--chart-color-7').trim(),
            root.getPropertyValue('--chart-color-8').trim()
        ],
        primary: root.getPropertyValue('--chart-primary').trim(),
        secondary: root.getPropertyValue('--chart-secondary').trim()
    };
}

// Load analytics data
function loadAnalytics() {
    fetch('/api/expenses', {
        headers: { 'Authorization': userToken }
    })
    .then(response => response.json())
    .then(expenses => {
        createCategoryChart(expenses);
        createMonthlyChart(expenses);
        updateSummaryStats(expenses);
    })
    .catch(error => {
        alert('Failed to load analytics data');
    });
}

// Create category pie chart
function createCategoryChart(expenses) {
    var categoryData = {};
    
    // Count spending by category
    for (var i = 0; i < expenses.length; i++) {
        var category = expenses[i].category;
        var amount = parseFloat(expenses[i].amount);
        
        if (categoryData[category]) {
            categoryData[category] = categoryData[category] + amount;
        } else {
            categoryData[category] = amount;
        }
    }
    
    var categories = Object.keys(categoryData);
    var amounts = Object.values(categoryData);
    
    var ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: getChartColors().palette
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create monthly bar chart
function createMonthlyChart(expenses) {
    var monthlyData = {};
    var currentYear = new Date().getFullYear();
    
    // Initialize all months with 0
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (var i = 0; i < months.length; i++) {
        monthlyData[months[i]] = 0;
    }
    
    // Calculate monthly totals
    for (var i = 0; i < expenses.length; i++) {
        var expenseDate = new Date(expenses[i].date);
        if (expenseDate.getFullYear() === currentYear) {
            var monthName = months[expenseDate.getMonth()];
            monthlyData[monthName] = monthlyData[monthName] + parseFloat(expenses[i].amount);
        }
    }
    
    var monthNames = Object.keys(monthlyData);
    var monthAmounts = Object.values(monthlyData);
    
    var ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Monthly Spending',
                data: monthAmounts,
                backgroundColor: getChartColors().primary,
                borderColor: getChartColors().secondary,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// Update summary statistics
function updateSummaryStats(expenses) {
    if (expenses.length === 0) return;
    
    // Calculate category totals
    var categoryTotals = {};
    var totalAmount = 0;
    
    for (var i = 0; i < expenses.length; i++) {
        var category = expenses[i].category;
        var amount = parseFloat(expenses[i].amount);
        
        totalAmount = totalAmount + amount;
        
        if (categoryTotals[category]) {
            categoryTotals[category] = categoryTotals[category] + amount;
        } else {
            categoryTotals[category] = amount;
        }
    }
    
    // Find highest spending category
    var highestCategory = '';
    var highestAmount = 0;
    
    for (var category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
            highestAmount = categoryTotals[category];
            highestCategory = category;
        }
    }
    
    // Calculate average daily spending
    var oldestExpense = new Date(expenses[0].date);
    for (var i = 1; i < expenses.length; i++) {
        var expenseDate = new Date(expenses[i].date);
        if (expenseDate < oldestExpense) {
            oldestExpense = expenseDate;
        }
    }
    
    var today = new Date();
    var daysDiff = Math.ceil((today - oldestExpense) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) daysDiff = 1;
    
    var averageDaily = totalAmount / daysDiff;
    
    // Update display
    document.getElementById('highestCategory').textContent = highestCategory + ' (₹' + highestAmount.toFixed(2) + ')';
    document.getElementById('averageDaily').textContent = '₹' + averageDaily.toFixed(2);
    document.getElementById('totalTransactions').textContent = expenses.length;
}

// Load analytics when page opens
loadAnalytics();