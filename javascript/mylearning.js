// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// First, let's modify the user data structure to include lessons
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
    
    
    // Initialize lessons if they don't exist
    if (!userData.languages[userData.activeLanguage].lessons) {
        userData.languages[userData.activeLanguage].lessons = [
            {
                id: 1,
                title: "Describing Your City",
                description: "Learn vocabulary and phrases to describe urban environments.",
                progress: 0,
                completed: false
            },
            {
                id: 2,
                title: "Past Tense - Irregular Verbs",
                description: "Master the tricky irregular verbs in the past tense.",
                progress: 0,
                completed: false
            }
        ];
        users[currentUsername] = userData;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update existing functions
    updateLanguageSelector(userData, userData.activeLanguage);
    updateProgressDisplays(userData, userData.languages[userData.activeLanguage]);
    updateStreakAndGoals(userData);
    renderLessons(userData); // Add this new function call
}

// Add new function to render lessons
function renderLessons(userData) {
    const lessonsContainer = document.querySelector('#pills-lessons');
    if (!lessonsContainer) return;

    const lessons = userData.languages[userData.activeLanguage].lessons;
    lessonsContainer.innerHTML = lessons.map(lesson => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${lesson.title}</h5>
                <p class="card-text">${lesson.description}</p>
                <div class="progress lesson-progress mb-3">
                    <div class="progress-bar ${lesson.completed ? 'bg-success' : 'bg-warning'}" 
                         role="progressbar" 
                         style="width: ${lesson.progress}%" 
                         aria-valuenow="${lesson.progress}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
                <button onclick="handleLesson(${lesson.id})" class="btn ${lesson.completed ? 'btn-success' : 'btn-primary'}">
                    ${lesson.completed ? 'Completed' : 'Continue Lesson'}
                </button>
            </div>
        </div>
    `).join('');
}

// Add function to handle lesson progress
function handleLesson(lessonId) {
    const currentUsername = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUsername];
    const activeLanguage = userData.activeLanguage;

    // Find the lesson
    const lesson = userData.languages[activeLanguage].lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Toggle completion
    lesson.completed = !lesson.completed;
    lesson.progress = lesson.completed ? 100 : 0;

    // Calculate overall language progress
    const totalLessons = userData.languages[activeLanguage].lessons.length;
    const completedLessons = userData.languages[activeLanguage].lessons.filter(l => l.completed).length;
    userData.languages[activeLanguage].progress = Math.round((completedLessons / totalLessons) * 100);

    // Update daily goal progress
    if (lesson.completed) {
        if(userData.dailyGoal.completed>=20){
            userData.dailyGoal.completed=20
        }
        else{
        userData.dailyGoal.completed = (userData.dailyGoal.completed || 0) + 20; // Add 20 minutes for each completed lesson
        }
    }

    // Save changes
    users[currentUsername] = userData;
    localStorage.setItem('users', JSON.stringify(users));

    // Refresh the dashboard
    initializeDashboard();
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
const dailyGoalProgress = document.querySelector('.card .progress-bar'); // Make selector more specific
if (dailyGoalProgress) {
    const completed = userData.dailyGoal.completed || 0; // Default to 0 if undefined
    const target = userData.dailyGoal.minutes || 1; // Default to 1 to avoid division by zero
    const percentage = (completed / target) * 100;

    // Update the progress bar width
    dailyGoalProgress.style.width = `${percentage}%`;
    dailyGoalProgress.setAttribute('aria-valuenow', completed); // Update aria-valuenow for accessibility
    dailyGoalProgress.textContent = `${completed} / ${target} minutes`;

    // Update the message below the progress bar
    const goalProgressText = dailyGoalProgress.closest('.card-body').querySelector('p.mb-0');
    if (goalProgressText) {
        const minutesRemaining = target - completed;
        goalProgressText.textContent = `Study ${minutesRemaining} more minutes to reach your daily goal!`;
    }
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
