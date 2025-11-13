// Check if user already logged in
if (localStorage.getItem('token')) {
    var currentPage = window.location.pathname;
    if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle login form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        
        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('justLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Invalid credentials');
            }
        })
        .catch(error => {
            alert('Login failed');
        });
    };
}

// Handle signup form
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').onsubmit = function(e) {
        e.preventDefault();
        
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        
        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Registration successful!');
                setTimeout(function() {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                alert(data.error || 'Registration failed');
            }
        })
        .catch(error => {
            alert('Registration failed');
        });
    };
}