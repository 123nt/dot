// Main page functionality

// Import auth utilities
import { checkAuth } from './auth.js';

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

// Check authentication and setup page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on page load
    if (checkAuth()) {
        displayUsername();
    }

    // Dropdown menu functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        });
    }
});
