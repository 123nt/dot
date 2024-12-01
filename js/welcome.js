document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    // Check if first time visit or logged out
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited || !currentUser) {
        // First time visit or logged out, show welcome page
        sessionStorage.setItem('hasVisited', 'true');
    } else {
        // Not first time and logged in, redirect to main
        window.location.href = 'login.html';
    }
});

// Handle section transitions
function showSection2() {
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    
    // Fade out section 1
    section1.style.opacity = '0';
    section1.style.transform = 'translateX(-10px)';
    
    // After animation, hide section 1 and show section 2
    setTimeout(() => {
        section1.style.display = 'none';
        section2.style.display = 'block';
        
        // Trigger reflow
        section2.offsetHeight;
        
        // Fade in section 2
        section2.style.opacity = '1';
        section2.style.transform = 'translateX(0)';
    }, 300);
}

// Handle get started button click
function startApp() {
    const section2 = document.getElementById('section2');
    
    // Add fade out effect
    section2.style.opacity = '0';
    section2.style.transform = 'translateY(10px)';
    
    // Redirect after animation
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 200);
}