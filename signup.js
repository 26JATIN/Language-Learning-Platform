// Default user data structure
const defaultUserData = {
    streak: 0,
    lastLoginDate: null,
    progress: {
        overall: 0,
        lessons: [],
        vocabulary: [],
        grammar: []
    },
    dailyGoal: {
        minutes: 20,
        completed: 0
    },
    weeklyGoal: {
        daysCompleted: 0,
        target: 5
    },
    achievements: []
};

// Animation for form appearance
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        setTimeout(function() {
            signupForm.style.opacity = '1';
            signupForm.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Signup form handler
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const language = document.getElementById('language').value.trim();

    if (!username || !password || !language) {
        alert('All fields are required. Please fill in all details.');
        return;
    }

    // Get existing users or initialize empty object
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Check if username already exists
    if (users[username]) {
        alert('Username already exists. Please choose another one.');
        return;
    }

    // Create new user with selected language and default progress
    const userData = {
        ...defaultUserData,
        username: username,
        password: password,
        activeLanguage: language,
        languages: {
            [language]: {
                level: 'A1',
                progress: 0,
                lessonsCompleted: 0,
                startDate: new Date().toISOString()
            }
        },
        createdAt: new Date().toISOString(),
        lastLoginDate: new Date().toISOString()
    };

    // Store user data
    users[username] = userData;
    localStorage.setItem('users', JSON.stringify(users));

    // Store current user in session
    localStorage.setItem('currentUser', username);

    // Redirect to mylearning.html
    window.location.href = 'mylearning.html';
});
