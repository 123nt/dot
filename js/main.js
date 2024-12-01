// Main page functionality

// Import auth utilities
import { checkAuth } from './auth.js';

// Function to get all users except current user
function getOtherUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return users.filter(user => user.username !== currentUser.username);
}

// Function to get chat history between two users
function getChatHistory(user1, user2) {
    const chats = JSON.parse(localStorage.getItem('chats') || '[]');
    return chats.filter(chat => 
        (chat.from === user1 && chat.to === user2) ||
        (chat.from === user2 && chat.to === user1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Function to get the last message between two users
function getLastMessage(currentUser, otherUser) {
    const chatHistory = getChatHistory(currentUser.username, otherUser.username);
    return chatHistory[chatHistory.length - 1] || null;
}

// Function to format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Function to create user list item
function createUserListItem(user) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const lastMessage = getLastMessage(currentUser, user);
    
    const div = document.createElement('div');
    div.className = 'user-item';
    div.setAttribute('data-username', user.username);
    
    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.textContent = user.username[0].toUpperCase();
    
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    
    const userHeader = document.createElement('div');
    userHeader.className = 'user-header';
    
    const userName = document.createElement('h3');
    userName.className = 'user-name';
    userName.textContent = user.username;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    if (lastMessage) {
        messageTime.textContent = formatTime(lastMessage.timestamp);
    }
    
    const lastMessageText = document.createElement('p');
    lastMessageText.className = 'last-message';
    if (lastMessage) {
        lastMessageText.textContent = lastMessage.message;
        if (lastMessage.to === currentUser.username && !lastMessage.read) {
            div.classList.add('unread');
        }
    } else {
        lastMessageText.textContent = 'No messages yet';
    }
    
    userHeader.appendChild(userName);
    userHeader.appendChild(messageTime);
    userInfo.appendChild(userHeader);
    userInfo.appendChild(lastMessageText);
    
    div.appendChild(avatar);
    div.appendChild(userInfo);
    
    return div;
}

// Function to display users list
function displayUsers() {
    const usersList = document.getElementById('users-list');
    const otherUsers = getOtherUsers();
    
    usersList.innerHTML = '';
    otherUsers.forEach(user => {
        const userItem = createUserListItem(user);
        usersList.appendChild(userItem);
    });
}

// Function to handle user selection
function handleUserSelection() {
    const usersList = document.getElementById('users-list');
    
    usersList.addEventListener('click', (e) => {
        const userItem = e.target.closest('.user-item');
        if (userItem) {
            const username = userItem.getAttribute('data-username');
            localStorage.setItem('selectedUser', username);
            window.location.href = 'chat.html';
        }
    });
}

// Function to display current user's username
function displayUsername() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const userAccountElement = document.getElementById('user-account');
            if (userAccountElement) {
                userAccountElement.textContent = `My Account: ${currentUser.username}`;
            }
        }
    } catch (error) {
        console.error('Error displaying username:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    let pressTimer;
    let currentOptions = null;

    function createMessageOptions() {
        const options = document.createElement('div');
        options.className = 'message-options';
        options.innerHTML = `
            <button class="option-btn save">
                <i class="fas fa-bookmark"></i>
            </button>
            <button class="option-btn delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        return options;
    }

    function createUserItem(user) {
        const lastMessage = getLastMessage(user.id);
        const div = document.createElement('div');
        div.className = 'user-item';
        div.innerHTML = `
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-info">
                <div class="user-header">
                    <span class="user-name">${user.name}</span>
                    ${lastMessage ? `<span class="message-time">${formatTime(lastMessage.timestamp)}</span>` : ''}
                </div>
                ${lastMessage ? `<div class="last-message">${lastMessage.text}</div>` : ''}
            </div>
        `;

        const options = createMessageOptions();
        div.appendChild(options);

        // Handle hold gesture
        div.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                if (currentOptions) {
                    currentOptions.classList.remove('show');
                }
                options.classList.add('show');
                currentOptions = options;
                e.preventDefault();
            }, 500);
        });

        div.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });

        div.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });

        // Handle regular click
        div.addEventListener('click', function(e) {
            if (!options.contains(e.target)) {  
                localStorage.setItem('selectedUser', JSON.stringify(user));
                window.location.href = 'chat.html';
            }
        });

        // Handle save button
        options.querySelector('.save').addEventListener('click', function(e) {
            e.stopPropagation();
            let savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
            
            // Check if user is already saved
            if (!savedUsers.some(saved => saved.id === user.id)) {
                savedUsers.push({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    timestamp: new Date().getTime(),
                    message: lastMessage ? lastMessage.text : ''
                });
                localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
            }
            
            options.classList.remove('show');
            // Show feedback
            const feedback = document.createElement('div');
            feedback.className = 'save-feedback';
            feedback.textContent = 'User saved!';
            div.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
        });

        // Handle delete button
        options.querySelector('.delete').addEventListener('click', function(e) {
            e.stopPropagation();
            const messages = JSON.parse(localStorage.getItem('messages') || '{}');
            const chatId = [currentUser, user.id].sort().join('-');
            
            if (messages[chatId]) {
                // Remove all messages for this chat
                delete messages[chatId];
                localStorage.setItem('messages', JSON.stringify(messages));
                
                // Show feedback
                const feedback = document.createElement('div');
                feedback.className = 'delete-feedback';
                feedback.textContent = 'Messages deleted';
                div.appendChild(feedback);
                setTimeout(() => feedback.remove(), 2000);
                
                // Update the UI
                updateUsersList();
            }
            
            options.classList.remove('show');
        });

        return div;
    }

    // Close options when clicking outside
    document.addEventListener('click', function(e) {
        if (currentOptions && !e.target.closest('.message-options') && !e.target.closest('.user-item')) {
            currentOptions.classList.remove('show');
            currentOptions = null;
        }
    });

    // Initialize messages if not exists
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify({}));
    }

    // Sample users (replace with your user management system)
    const users = [
        { id: '1', name: 'Alice', avatar: 'A' },
        { id: '2', name: 'Bob', avatar: 'B' },
        { id: '3', name: 'Charlie', avatar: 'C' }
    ];

    function getLastMessage(userId) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const chatId = [currentUser, userId].sort().join('-');
        const userMessages = messages[chatId] || [];
        return userMessages[userMessages.length - 1] || null;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function updateUsersList() {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '';
        users.forEach(user => {
            if (user.name !== currentUser) {
                usersList.appendChild(createUserItem(user));
            }
        });
    }

    // Initial render
    updateUsersList();

    // Check for new messages every few seconds
    setInterval(updateUsersList, 3000);

    // Dropdown functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const logoutBtn = document.querySelector('.dropdown-item:last-child');
    const accountBtn = document.querySelector('.dropdown-item:first-child');

    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    document.addEventListener('click', function() {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    });

    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('hasVisited'); // Reset welcome page view
        window.location.href = 'welcome.html'; // Redirect to welcome instead of login
    });

    accountBtn.addEventListener('click', function() {
        window.location.href = 'account.html';
    });
});
