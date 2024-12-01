// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get current user and selected user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
    
    // Debug logs
    console.log('Current user:', currentUser);
    console.log('Selected user:', selectedUser);
    
    if (!currentUser || !selectedUser) {
        window.location.href = 'main.html';
        return;
    }

    // Initialize UI elements
    const chatUserName = document.querySelector('.chat-user-name');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Debug log for DOM elements
    console.log('Message input:', messageInput);
    console.log('Send button:', sendButton);

    // Set chat header name
    chatUserName.textContent = selectedUser.name;

    // Initialize messages if not exists
    let messages = JSON.parse(localStorage.getItem('messages') || '{}');

    function saveMessages() {
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    function getChatId() {
        return [currentUser, selectedUser.id].sort().join('-');
    }

    function saveMessage(text) {
        const chatId = getChatId();
        
        if (!messages[chatId]) {
            messages[chatId] = [];
        }

        const newMessage = {
            sender: currentUser,
            receiver: selectedUser.id,
            text: text,
            timestamp: new Date().getTime()
        };

        messages[chatId].push(newMessage);
        saveMessages();
        return newMessage;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.sender === currentUser ? 'sent' : 'received'}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message.text;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        div.appendChild(content);
        div.appendChild(time);
        return div;
    }

    function displayMessages() {
        const chatId = getChatId();
        const chatMessages = messages[chatId] || [];
        
        messagesContainer.innerHTML = '';
        chatMessages.forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        console.log('Sending message:', text); // Debug log

        if (text) {
            const message = saveMessage(text);
            messagesContainer.appendChild(createMessageElement(message));
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Event listeners
    sendButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Send button clicked'); // Debug log
        sendMessage();
    });

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Back button functionality
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', function() {
        window.location.href = 'main.html';
    });

    // Initial display
    displayMessages();

    // Check for new messages periodically
    setInterval(displayMessages, 3000);
});
