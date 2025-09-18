// Main JavaScript file for i-Voting Platform
// Contains common utilities and functions used across the application

// Global variables
const STORAGE_KEYS = {
    USER_DATA: 'ivoting_user_data',
    VOTE_DATA: 'ivoting_vote_data',
    SESSION: 'ivoting_session'
};

// Utility functions
const Utils = {
    // Generate a random ID
    generateId: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Generate vote ID
    generateVoteId: () => {
        return `VT-2025-${Utils.generateId(8)}`;
    },

    // Generate verification hash
    generateHash: () => {
        return Utils.generateId(20).toLowerCase();
    },

    // Format date and time
    formatDateTime: (date = new Date()) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    },

    // Show loading spinner
    showLoading: (button) => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        return originalText;
    },

    // Hide loading spinner
    hideLoading: (button, originalText) => {
        button.innerHTML = originalText;
        button.disabled = false;
    },

    // Show notification
    showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Validate email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    getPasswordStrength: (password) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        return {
            score: strength,
            checks,
            level: strength < 3 ? 'weak' : strength < 4 ? 'medium' : 'strong'
        };
    },

    // Store data in localStorage
    storeData: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error storing data:', error);
            return false;
        }
    },

    // Get data from localStorage
    getData: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data:', error);
            return null;
        }
    },

    // Remove data from localStorage
    removeData: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }
};

// Session management
const Session = {
    // Create user session
    create: (userData) => {
        const session = {
            user: userData,
            loginTime: new Date().toISOString(),
            sessionId: Utils.generateId(16),
            isActive: true
        };

        Utils.storeData(STORAGE_KEYS.SESSION, session);
        return session;
    },

    // Get current session
    get: () => {
        return Utils.getData(STORAGE_KEYS.SESSION);
    },

    // Check if user is logged in
    isLoggedIn: () => {
        const session = Session.get();
        return session && session.isActive;
    },

    // Destroy session
    destroy: () => {
        Utils.removeData(STORAGE_KEYS.SESSION);
        Utils.removeData(STORAGE_KEYS.USER_DATA);
    },

    // Get current user
    getCurrentUser: () => {
        const session = Session.get();
        return session ? session.user : null;
    }
};

// Form validation utilities
const FormValidator = {
    // Validate required fields
    validateRequired: (form) => {
        const requiredFields = form.querySelectorAll('[required]');
        const errors = [];

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                errors.push(`${field.name || field.id} is required`);
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return errors;
    },

    // Validate email field
    validateEmail: (email) => {
        if (!Utils.isValidEmail(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    },

    // Validate password match
    validatePasswordMatch: (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    },

    // Show field error
    showFieldError: (field, message) => {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e53e3e;
            font-size: 0.85rem;
            margin-top: 5px;
        `;
        
        field.parentNode.appendChild(errorDiv);
    },

    // Clear field error
    clearFieldError: (field) => {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
};

// Common functions
function togglePassword(inputId = 'password') {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.parentNode.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleButton.className = 'fas fa-eye';
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations for notifications
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error {
            border-color: #e53e3e !important;
            background-color: #fed7d7 !important;
        }
        
        .notification {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);

    // Check authentication on protected pages
    const protectedPages = ['voting.html', 'success.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !Session.isLoggedIn()) {
        Utils.showNotification('Please log in to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Auto-redirect if already logged in
    const publicPages = ['index.html', 'signup.html'];
    if (publicPages.includes(currentPage) && Session.isLoggedIn()) {
        window.location.href = 'voting.html';
    }

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize tooltips and other UI enhancements
    initializeUIEnhancements();
});

// UI enhancements
function initializeUIEnhancements() {
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Initialize form enhancements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                FormValidator.clearFieldError(this);
            });
        });
    });
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    Utils.showNotification('An unexpected error occurred. Please try again.', 'error');
});

// Export utilities for use in other files
window.Utils = Utils;
window.Session = Session;
window.FormValidator = FormValidator;
window.STORAGE_KEYS = STORAGE_KEYS;