// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const userName = document.getElementById('userName');
    const userStatus = document.getElementById('userStatus');
    const userAvatar = document.getElementById('userAvatar');

    // Get selected user from localStorage
    const selectedUser = localStorage.getItem('selectedUser');
    if (!selectedUser) {
        window.location.href = 'saved.html';
        return;
    }

    // Set user info in header
    userName.textContent = selectedUser;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const selectedUserData = users.find(u => u.username === selectedUser);
    const status = selectedUserData ? selectedUserData.status || 'Hey! I am using dot' : 'Hey! I am using dot';
    userStatus.textContent = status;
    userAvatar.textContent = selectedUser.charAt(0).toUpperCase();

    // Load existing messages
    loadMessages();

    // Event listeners
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem(`messages_${selectedUser}`) || '[]');
        chatMessages.innerHTML = '';
        
        messages.forEach(message => {
            const div = document.createElement('div');
            div.className = `message ${message.sent ? 'sent' : 'received'}`;
            div.textContent = message.content;
            chatMessages.appendChild(div);
        });

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const content = messageInput.value.trim();
        if (!content) return;

        // Get existing messages
        const messages = JSON.parse(localStorage.getItem(`messages_${selectedUser}`) || '[]');
        
        // Create new message
        const newMessage = {
            content: content,
            sent: true,
            timestamp: new Date().toISOString()
        };

        // Add message
        messages.push(newMessage);
        
        // Save to localStorage
        localStorage.setItem(`messages_${selectedUser}`, JSON.stringify(messages));
        
        // Clear input
        messageInput.value = '';
        
        // Reload messages
        loadMessages();
    }

    // Simulate received message (for testing)
    window.simulateReceived = function(content) {
        const messages = JSON.parse(localStorage.getItem(`messages_${selectedUser}`) || '[]');
        messages.push({
            content: content,
            sent: false,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`messages_${selectedUser}`, JSON.stringify(messages));
        loadMessages();
    };
});
