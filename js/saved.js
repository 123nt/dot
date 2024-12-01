// Saved contacts functionality

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    loadSavedUsers();
});

function loadSavedUsers() {
    const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const savedUsersContainer = document.getElementById('savedUsers');

    savedUsersContainer.innerHTML = '';

    savedUsers.forEach(userId => {
        const user = users.find(u => u.username === userId);
        const status = user ? user.status || 'Hey! I am using dot' : 'Hey! I am using dot';
        const userElement = createUserElement(userId, status);
        savedUsersContainer.appendChild(userElement);
    });
}

function createUserElement(userId, status) {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.onclick = () => openChat(userId);
    
    const firstLetter = userId.charAt(0).toUpperCase();
    
    div.innerHTML = `
        <div class="user-avatar">
            ${firstLetter}
        </div>
        <div class="user-info">
            <div class="user-name">${userId}</div>
            <div class="user-status">${status}</div>
        </div>
    `;

    return div;
}

function openChat(userId) {
    localStorage.setItem('selectedUser', userId);
    window.location.href = 'chat.html';
}

function updateUserStatus(userId, newStatus) {
    const userStatuses = JSON.parse(localStorage.getItem('userStatuses') || '{}');
    userStatuses[userId] = newStatus;
    localStorage.setItem('userStatuses', JSON.stringify(userStatuses));
    loadSavedUsers();
}
