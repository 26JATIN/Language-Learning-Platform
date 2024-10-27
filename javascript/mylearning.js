// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

function initializeDashboard() {
    const currentUsername = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!currentUsername || !users[currentUsername]) {
        window.location.href = 'login.html';
        return;
    }

    const userData = users[currentUsername];

    // Update welcome message
    const welcomeMessage = document.querySelector('#welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${userData.username}!`;
    }

    // Update language display
    const activeLanguage = userData.activeLanguage;
    const languageData = userData.languages[activeLanguage];

    // Update language dropdown
    updateLanguageSelector(userData, activeLanguage);

    // Update progress displays
    updateProgressDisplays(userData, languageData);

    // Update streak and goals
    updateStreakAndGoals(userData);
}

function updateLanguageSelector(userData, activeLanguage) {
    const languageSelector = document.querySelector('.dropdown');
    if (languageSelector) {
        languageSelector.innerHTML = `
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <img src="${getLanguageFlag(activeLanguage)}" class="me-2" width="20"> 
                ${capitalizeFirstLetter(activeLanguage)} (${userData.languages[activeLanguage].level})
            </button>
            <ul class="dropdown-menu">
                ${Object.keys(userData.languages).map(lang => `
                    <li>
                        <a class="dropdown-item" href="#" onclick="switchLanguage('${lang}')">
                            <img src="${getLanguageFlag(lang)}" class="me-2" width="20">
                            ${capitalizeFirstLetter(lang)} (${userData.languages[lang].level})
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

function updateProgressDisplays(userData, languageData) {
    // Update overall progress circle
    const progressCircle = document.querySelector('#progress-circle');
    if (progressCircle) {
        const progress = languageData.progress;
        progressCircle.style.setProperty('--progress', `${progress * 3.6}deg`);
        progressCircle.style.setProperty('--data-progress',`${progress}`);
        progressCircle.dataset.progress = progress;
        
        // Update progress message text
        const progressMessage = document.querySelector('#progress-message');
        if (progressMessage) {
            progressMessage.textContent = `You're ${progress}% fluent in ${capitalizeFirstLetter(userData.activeLanguage)}!`;
        }
    }
}


function updateStreakAndGoals(userData) {
    // Update streak display
    const streakDisplay = document.querySelector('.streak-card .display-1');
    if (streakDisplay) {
        streakDisplay.textContent = `🔥 ${userData.streak}`;
    }

    // Update daily goal progress
    const dailyGoalProgress = document.querySelector('.progress-bar');
    if (dailyGoalProgress) {
        const percentage = (userData.dailyGoal.completed / userData.dailyGoal.minutes) * 100;
        dailyGoalProgress.style.width = `${percentage}%`;
        dailyGoalProgress.textContent = 
            `${userData.dailyGoal.completed} / ${userData.dailyGoal.minutes} minutes`;
    }

    // Update weekly goal
    const weeklyGoalProgress = document.querySelector('.weekly-goal .progress-bar');
    if (weeklyGoalProgress) {
        // Calculate the weekly percentage completion
        const daysCompleted = userData.weeklyGoal.daysCompleted || 0; // Default to 0 if undefined
        const target = userData.weeklyGoal.target || 1; // Default to 1 to avoid division by zero
        const weeklyPercentage = (daysCompleted / target) * 100;
    
        // Update the progress bar width
        weeklyGoalProgress.style.width = `${weeklyPercentage}%`;
        weeklyGoalProgress.setAttribute('aria-valuenow', daysCompleted); // Update aria-valuenow for accessibility
        weeklyGoalProgress.textContent = `${daysCompleted} / ${target} days`;
    
        // Update the paragraph to show how many more days to reach the goal
        const goalProgressText = document.querySelector('#goal-progress');
        if (goalProgressText) {
            const daysRemaining = target - daysCompleted;
            goalProgressText.textContent = `Study ${daysRemaining} more days to reach your weekly goal!`;
        }
    }
    
}

function getLanguageFlag(language) {
    const flagMap = {
        'spanish': 'photos/Spain.png',
        'french': 'photos/France.png',
        'german': 'photos/Germany.png'
    };
    return flagMap[language.toLowerCase()] || 'default-flag.png';
}

function switchLanguage(language) {
    const currentUsername = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUsername];

    userData.activeLanguage = language.toLowerCase();
    users[currentUsername] = userData;
    localStorage.setItem('users', JSON.stringify(users));

    // Refresh dashboard
    initializeDashboard();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
