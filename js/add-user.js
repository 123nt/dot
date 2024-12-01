// Get all registered users (in a real app, this would be from a server)
const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

function searchUsers() {
    const userIdInput = document.getElementById('userId');
    const suggestionList = document.getElementById('suggestionList');
    const query = userIdInput.value.trim().toLowerCase();

    // Clear suggestion list
    suggestionList.innerHTML = '';

    if (!query) {
        suggestionList.innerHTML = `
            <div class="no-suggestions">
                Start typing to search for users
            </div>
        `;
        return;
    }

    // Filter users based on query
    const matchingUsers = allUsers.filter(user => 
        user.toLowerCase().includes(query)
    );

    if (matchingUsers.length === 0) {
        suggestionList.innerHTML = `
            <div class="no-suggestions">
                <i class="fas fa-user-slash"></i>
                No dots found for this user
            </div>
        `;
        return;
    }

    // Display matching users
    matchingUsers.forEach(user => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        const firstLetter = user.charAt(0).toUpperCase();
        
        div.innerHTML = `
            <div class="suggestion-avatar">
                ${firstLetter}
            </div>
            <div class="suggestion-info">
                <div class="suggestion-name">${user}</div>
            </div>
        `;

        div.onclick = () => {
            userIdInput.value = user;
            suggestionList.innerHTML = '';
        };

        suggestionList.appendChild(div);
    });
}

function addUser() {
    const userIdInput = document.getElementById('userId');
    const errorMessage = document.getElementById('errorMessage');
    const userId = userIdInput.value.trim();

    // Clear previous error
    errorMessage.textContent = '';

    // Validate user ID
    if (!userId) {
        errorMessage.textContent = 'Please enter a user ID';
        return;
    }

    // Check if user exists
    if (!allUsers.includes(userId)) {
        errorMessage.textContent = 'User not found';
        return;
    }

    // Get existing saved users
    const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || '[]');

    // Check if user already saved
    if (savedUsers.includes(userId)) {
        errorMessage.textContent = 'User already saved';
        return;
    }

    // Add new user
    savedUsers.push(userId);
    localStorage.setItem('savedUsers', JSON.stringify(savedUsers));

    // Redirect back to saved users page
    window.location.href = 'saved.html';
}

// Handle enter key press
document.getElementById('userId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addUser();
    }
});

// Handle input change for search functionality
document.getElementById('userId').addEventListener('input', searchUsers);
