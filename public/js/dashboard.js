// Get user token from browser storage
var userToken = localStorage.getItem('token');

// If no token, redirect to login
if (!userToken) {
    window.location.href = 'login.html';
}

// Show welcome message if user just logged in
if (localStorage.getItem('justLoggedIn')) {
    alert('Welcome back!');
    localStorage.removeItem('justLoggedIn');
}

// Function to load and display dashboard data
function loadDashboard() {
    // Get expenses from server
    fetch('/api/expenses', {
        headers: { 'Authorization': userToken }
    })
    .then(response => response.json())
    .then(expenses => {
        // Calculate total spent (all expenses)
        var totalSpent = 0;
        for (var i = 0; i < expenses.length; i++) {
            totalSpent = totalSpent + parseFloat(expenses[i].amount);
        }
        
        // Calculate this month spending
        var today = new Date();
        var currentMonth = today.getMonth();
        var currentYear = today.getFullYear();
        
        var monthlySpent = 0;
        for (var i = 0; i < expenses.length; i++) {
            var expenseDate = new Date(expenses[i].date);
            if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
                monthlySpent = monthlySpent + parseFloat(expenses[i].amount);
            }
        }
        
        // Get budget (default 1000 if not set)
        var budget = localStorage.getItem('monthlyBudget');
        if (!budget) {
            budget = 1000;
        } else {
            budget = parseFloat(budget);
        }
        
        // Calculate remaining balance
        var remainingBalance = budget - monthlySpent;
        
        // Update display
        document.getElementById('totalSpent').textContent = '₹' + totalSpent.toFixed(2);
        document.getElementById('monthlySpent').textContent = '₹' + monthlySpent.toFixed(2);
        document.getElementById('remainingBalance').textContent = '₹' + remainingBalance.toFixed(2);
        
        // Change color based on remaining balance
        var balanceElement = document.getElementById('remainingBalance');
        balanceElement.className = balanceElement.className.replace(/balance-\w+/g, '');
        if (remainingBalance < 0) {
            balanceElement.className += ' balance-negative';
        } else if (remainingBalance < budget * 0.2) {
            balanceElement.className += ' balance-warning';
        } else {
            balanceElement.className += ' balance-positive';
        }
    })
    .catch(error => {
        alert('Failed to load dashboard data');
    });
}

// Load dashboard when page opens
loadDashboard();

// Refresh dashboard every 5 seconds
setInterval(loadDashboard, 5000);