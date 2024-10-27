// Toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const formTitle = document.getElementById('formTitle');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        formTitle.textContent = 'Welcome Back';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        formTitle.textContent = 'Create Your Account';
    }
}

// Simulated login with promise
function login(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users')) || {};
            
            if (users[username] && users[username].password === password) {
                // Update last login date and store current user
                users[username].lastLoginDate = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', username);
                resolve(users[username]);
            } else {
                reject(new Error('Invalid username or password'));
            }
        }, 1000);
    });
}

// Event listeners
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const user = await login(username, password);
        showMessage('loginSuccess', 'Login successful!');
        setTimeout(() => {
            window.location.href = 'mylearning.html';
        }, 1000);
    } catch (error) {
        showMessage('loginError', error.message);
    }
});

// Helper functions
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    element.textContent = message;
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('formTitle').textContent = 'Welcome Back';
});