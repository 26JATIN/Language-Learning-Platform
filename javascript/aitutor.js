// Replace with your Gemini API key
const API_KEY = 'AIzaSyA2FxsZq02THrXK2nJ75MPVdlY85JKW4UM';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

let conversationHistory = [];

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
let isDarkTheme = false;

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
});

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = userInput.value.trim();
    const selectedLanguage = document.getElementById('languageSelect').value;
    
    if (!message) return;

    // Add user message to chat
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.textContent = message;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    userInput.value = '';

    try {
        // Update conversation history
        conversationHistory.push({ role: "user", content: message });
        
        // Prepare the prompt
        const prompt = `You are a friendly and helpful ${selectedLanguage} language tutor. 
                      The student's level is intermediate. Use English language to teach students.
                      Previous messages: ${JSON.stringify(conversationHistory.slice(-4))}
                      Student message: ${message}
                      
                      Respond naturally and helpfully, focusing on teaching ${selectedLanguage}.
                      If the student writes in English, encourage them to try in ${selectedLanguage}.
                      Correct any language mistakes gently.`;

        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message';
        loadingDiv.textContent = 'Typing...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Call Gemini API
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();

        // Remove loading indicator
        chatMessages.removeChild(loadingDiv);

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Add bot response to chat
        const botResponse = data.candidates[0].content.parts[0].text;
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.textContent = botResponse;
        chatMessages.appendChild(botMessageDiv);

        // Update conversation history
        conversationHistory.push({ role: "assistant", content: botResponse });

        // Keep history manageable
        if (conversationHistory.length > 8) {
            conversationHistory = conversationHistory.slice(-8);
        }

    } catch (error) {
        console.error('Error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
        errorDiv.textContent = "Sorry, I encountered an error. Please try again.";
        chatMessages.appendChild(errorDiv);
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add Enter key support
document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Language change handler
document.getElementById('languageSelect').addEventListener('change', function() {
    const language = this.value;
    conversationHistory = [];
    document.getElementById('chatMessages').innerHTML = '';
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot-message';
    initialMessage.textContent = `Hello! I'm your ${language} language tutor. How can I help you practice today?`;
    document.getElementById('chatMessages').appendChild(initialMessage);
});