// Get user token
var userToken = localStorage.getItem('token');
if (!userToken) {
    window.location.href = 'login.html';
}

// Load user profile data
function loadProfile() {
    // Get user info from server
    fetch('/api/user/profile', {
        headers: { 'Authorization': userToken }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
    })
    .catch(error => {
        alert('Failed to load profile');
    });
    
    // Load budget from browser storage
    var savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
        document.getElementById('monthlyBudget').value = savedBudget;
    } else {
        document.getElementById('monthlyBudget').value = '1000';
    }
}

// Update budget function
function updateBudget() {
    var budget = document.getElementById('monthlyBudget').value;
    var budgetNumber = parseFloat(budget);
    
    if (budgetNumber > 0) {
        localStorage.setItem('monthlyBudget', budget);
        alert('Budget updated successfully!');
    } else {
        alert('Please enter a valid budget amount');
    }
}

// Logout function
function logout() {
    var confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('token');
        localStorage.removeItem('monthlyBudget');
        localStorage.removeItem('justLoggedIn');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    }
}

// Load profile when page opens
loadProfile();