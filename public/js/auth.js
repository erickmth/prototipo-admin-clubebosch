// Authentication and Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loginText = document.getElementById('login-text');
    const loginLoading = document.getElementById('login-loading');

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Show loading state
        loginText.style.display = 'none';
        loginLoading.style.display = 'inline-block';
        loginBtn.disabled = true;
        
        // Simulate login process
        setTimeout(function() {
            // For demo purposes, any valid email/password will work
            // In a real application, this would validate against a backend
            
            // Hide loading state
            loginText.style.display = 'inline-block';
            loginLoading.style.display = 'none';
            loginBtn.disabled = false;
            
            // Store login state
            localStorage.setItem('clubot_logged_in', 'true');
            localStorage.setItem('clubot_user_email', email);
            
            // Redirect to dashboard
            window.location.href = 'hub.html';
        }, 1500);
    });

    // Check if user is already logged in (for hub and lottery pages)
    function checkAuth() {
        if (window.location.pathname.includes('hub.html') || 
            window.location.pathname.includes('lottery.html')) {
            const isLoggedIn = localStorage.getItem('clubot_logged_in');
            if (!isLoggedIn) {
                window.location.href = 'index.html';
            }
        }
    }

    // Initialize auth check
    checkAuth();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);