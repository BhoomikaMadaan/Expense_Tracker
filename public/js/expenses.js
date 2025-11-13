// Get user token
var userToken = localStorage.getItem('token');
if (!userToken) {
    window.location.href = 'login.html';
}

var allExpenses = [];

// Handle add expense form
if (document.getElementById('expenseForm')) {
    // Set today's date as default
    var today = new Date();
    var todayString = today.getFullYear() + '-' + 
                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(today.getDate()).padStart(2, '0');
    document.getElementById('date').value = todayString;
    
    document.getElementById('expenseForm').onsubmit = function(e) {
        e.preventDefault();
        
        var amount = document.getElementById('amount').value;
        var category = document.getElementById('category').value;
        var date = document.getElementById('date').value;
        var note = document.getElementById('note').value;

        fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken
            },
            body: JSON.stringify({ 
                amount: amount, 
                category: category, 
                date: date, 
                note: note 
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Expense added successfully!');
            document.getElementById('expenseForm').reset();
            document.getElementById('date').value = todayString;
            setTimeout(function() {
                window.location.href = 'expenses.html';
            }, 1000);
        })
        .catch(error => {
            alert('Failed to add expense');
        });
    };
}

// Load and display expenses
function loadExpenses() {
    fetch('/api/expenses', {
        headers: { 'Authorization': userToken }
    })
    .then(response => response.json())
    .then(expenses => {
        allExpenses = expenses;
        displayExpenses(expenses);
    })
    .catch(error => {
        alert('Failed to load expenses');
    });
}

function displayExpenses(expenses) {
    var tbody = document.querySelector('#expensesTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-expenses">No expenses found</td></tr>';
        return;
    }
    
    for (var i = 0; i < expenses.length; i++) {
        var expense = expenses[i];
        var row = tbody.insertRow();
        
        var dateCell = row.insertCell(0);
        var categoryCell = row.insertCell(1);
        var amountCell = row.insertCell(2);
        var noteCell = row.insertCell(3);
        var actionCell = row.insertCell(4);
        
        dateCell.textContent = new Date(expense.date).toLocaleDateString();
        categoryCell.textContent = expense.category;
        amountCell.textContent = '₹' + parseFloat(expense.amount).toFixed(2);
        noteCell.textContent = expense.note || '-';
        actionCell.innerHTML = '<button onclick="editExpense(\'' + expense._id + '\')" class="action-btn edit-btn">Edit</button>' +
                              '<button onclick="deleteExpense(\'' + expense._id + '\')" class="action-btn delete-btn">Delete</button>';
    }
}

// Filter expenses
function filterExpenses() {
    var categoryFilter = document.getElementById('categoryFilter').value;
    var sortBy = document.getElementById('sortBy').value;
    
    var filteredExpenses = allExpenses;
    
    // Filter by category
    if (categoryFilter) {
        filteredExpenses = [];
        for (var i = 0; i < allExpenses.length; i++) {
            if (allExpenses[i].category === categoryFilter) {
                filteredExpenses.push(allExpenses[i]);
            }
        }
    }
    
    // Sort expenses
    if (sortBy === 'amount') {
        filteredExpenses.sort(function(a, b) {
            return parseFloat(b.amount) - parseFloat(a.amount);
        });
    } else if (sortBy === 'category') {
        filteredExpenses.sort(function(a, b) {
            return a.category.localeCompare(b.category);
        });
    } else {
        filteredExpenses.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    }
    
    displayExpenses(filteredExpenses);
}

// Edit expense
function editExpense(id) {
    var expense = null;
    for (var i = 0; i < allExpenses.length; i++) {
        if (allExpenses[i]._id === id) {
            expense = allExpenses[i];
            break;
        }
    }
    
    if (!expense) return;
    
    var newAmount = prompt('New amount:', expense.amount);
    var newCategory = prompt('New category:', expense.category);
    var newNote = prompt('New note:', expense.note || '');
    
    if (newAmount && newCategory) {
        updateExpense(id, {
            amount: newAmount,
            category: newCategory,
            note: newNote,
            date: expense.date
        });
    }
}

// Update expense
function updateExpense(id, data) {
    fetch('/api/expenses/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Expense updated successfully!');
        loadExpenses();
    })
    .catch(error => {
        alert('Failed to update expense');
    });
}

// Delete expense
function deleteExpense(id) {
    var confirmDelete = confirm('Are you sure you want to delete this expense?');
    if (!confirmDelete) return;
    
    fetch('/api/expenses/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': userToken }
    })
    .then(response => response.json())
    .then(result => {
        alert('Expense deleted successfully!');
        loadExpenses();
    })
    .catch(error => {
        alert('Failed to delete expense');
    });
}

// Set up filter listeners
if (document.getElementById('categoryFilter')) {
    document.getElementById('categoryFilter').onchange = filterExpenses;
    document.getElementById('sortBy').onchange = filterExpenses;
}

// Load expenses if on expenses page
if (document.getElementById('expensesTable')) {
    loadExpenses();
}