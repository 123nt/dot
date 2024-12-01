// Saved contacts functionality

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    function createSavedUserItem(savedUser) {
        const div = document.createElement('div');
        div.className = 'user-item';
        div.innerHTML = `
            <div class="user-avatar">${savedUser.avatar || '👤'}</div>
            <div class="user-info">
                <div class="user-header">
                    <span class="user-name">${savedUser.name}</span>
                    <span class="message-time">${formatTime(savedUser.timestamp)}</span>
                </div>
                <div class="last-message">${savedUser.message || ''}</div>
            </div>
        `;

        div.addEventListener('click', () => {
            localStorage.setItem('selectedUser', JSON.stringify({
                id: savedUser.id,
                name: savedUser.name,
                avatar: savedUser.avatar || '👤'
            }));
            window.location.href = 'chat.html';
        });

        return div;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function loadSavedUsers() {
        const savedUsersList = document.getElementById('saved-users-list');
        const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');
        
        savedUsersList.innerHTML = '';
        
        if (savedUsers.length === 0) {
            savedUsersList.innerHTML = '<div class="no-saved-users">No saved users yet</div>';
            return;
        }

        savedUsers.forEach(user => {
            savedUsersList.appendChild(createSavedUserItem(user));
        });
    }

    loadSavedUsers();
});
