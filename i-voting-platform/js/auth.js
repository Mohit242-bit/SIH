// Authentication JavaScript for i-Voting Platform
// Handles login, signup, and user management

// Dummy user database (in a real application, this would be handled server-side)
const DEMO_USERS = [
    {
        id: 'user_001',
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        voterId: 'VID123456789',
        dateOfBirth: '1990-01-15',
        phone: '+1-555-0123',
        hasVoted: false
    },
    {
        id: 'user_002',
        email: 'jane.smith@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        voterId: 'VID987654321',
        dateOfBirth: '1985-06-20',
        phone: '+1-555-0456',
        hasVoted: false
    },
    {
        id: 'user_003',
        email: 'demo@ivoting.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        voterId: 'VID111222333',
        dateOfBirth: '1992-03-10',
        phone: '+1-555-0789',
        hasVoted: false
    }
];

// Authentication class
class Auth {
    constructor() {
        this.initializeEventListeners();
        this.loadStoredUsers();
    }

    // Load users from localStorage or use demo users
    loadStoredUsers() {
        const storedUsers = Utils.getData('ivoting_users');
        if (!storedUsers || storedUsers.length === 0) {
            Utils.storeData('ivoting_users', DEMO_USERS);
        }
    }

    // Get all users
    getUsers() {
        return Utils.getData('ivoting_users') || DEMO_USERS;
    }

    // Add new user
    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: `user_${Date.now()}`,
            ...userData,
            hasVoted: false
        };
        users.push(newUser);
        Utils.storeData('ivoting_users', users);
        return newUser;
    }

    // Find user by email
    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Validate login credentials
    validateLogin(email, password) {
        const user = this.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        return { success: true, user };
    }

    // Validate signup data
    validateSignup(formData) {
        const errors = [];

        // Check if email already exists
        if (this.findUserByEmail(formData.email)) {
            errors.push('Email already registered');
        }

        // Validate password strength
        const passwordStrength = Utils.getPasswordStrength(formData.password);
        if (passwordStrength.score < 3) {
            errors.push('Password is too weak. Include uppercase, lowercase, numbers, and special characters');
        }

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            errors.push('Passwords do not match');
        }

        // Validate age (must be 18+)
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18 || (age === 18 && today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()))) {
            errors.push('You must be at least 18 years old to register');
        }

        // Validate Voter ID format
        if (!/^VID\d{9}$/.test(formData.voterId)) {
            errors.push('Voter ID must be in format VIDxxxxxxxxx (VID followed by 9 digits)');
        }

        return errors;
    }

    // Handle login
    async handleLogin(formData) {
        const validation = this.validateLogin(formData.email, formData.password);
        
        if (!validation.success) {
            throw new Error(validation.message);
        }

        // Create session
        const session = Session.create(validation.user);
        
        // Store user preferences
        if (formData.rememberMe) {
            Utils.storeData('ivoting_remember_user', formData.email);
        }

        return validation.user;
    }

    // Handle signup
    async handleSignup(formData) {
        const errors = this.validateSignup(formData);
        
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Remove confirm password from user data
        const { confirmPassword, agreeTerms, emailNotifications, ...userData } = formData;
        
        // Add user to database
        const newUser = this.addUser(userData);
        
        // Create session
        const session = Session.create(newUser);
        
        return newUser;
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));
            
            // Password strength indicator
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.addEventListener('input', this.updatePasswordStrength.bind(this));
            }
        }

        // Load remembered user
        this.loadRememberedUser();
    }

    // Handle login form submission
    async handleLoginSubmit(e) {
        e.preventDefault();
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = Utils.showLoading(submitButton);
        
        try {
            const formData = new FormData(e.target);
            const loginData = {
                email: formData.get('email'),
                password: formData.get('password'),
                rememberMe: formData.get('rememberMe') === 'on'
            };

            // Validate required fields
            const errors = FormValidator.validateRequired(e.target);
            if (errors.length > 0) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            const emailError = FormValidator.validateEmail(loginData.email);
            if (emailError) {
                throw new Error(emailError);
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Handle login
            const user = await this.handleLogin(loginData);
            
            Utils.showNotification(`Welcome back, ${user.firstName}!`);
            
            // Redirect to voting page
            setTimeout(() => {
                window.location.href = 'voting.html';
            }, 1000);

        } catch (error) {
            Utils.showNotification(error.message, 'error');
            Utils.hideLoading(submitButton, originalButtonText);
        }
    }

    // Handle signup form submission
    async handleSignupSubmit(e) {
        e.preventDefault();
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = Utils.showLoading(submitButton);
        
        try {
            const formData = new FormData(e.target);
            const signupData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                voterId: formData.get('voterId'),
                dateOfBirth: formData.get('dateOfBirth'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                agreeTerms: formData.get('agreeTerms') === 'on',
                emailNotifications: formData.get('emailNotifications') === 'on'
            };

            // Validate required fields
            const errors = FormValidator.validateRequired(e.target);
            if (errors.length > 0) {
                throw new Error('Please fill in all required fields');
            }

            // Check terms agreement
            if (!signupData.agreeTerms) {
                throw new Error('You must agree to the Terms of Service and Privacy Policy');
            }

            // Validate email format
            const emailError = FormValidator.validateEmail(signupData.email);
            if (emailError) {
                throw new Error(emailError);
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Handle signup
            const user = await this.handleSignup(signupData);
            
            Utils.showNotification(`Account created successfully! Welcome, ${user.firstName}!`);
            
            // Redirect to voting page
            setTimeout(() => {
                window.location.href = 'voting.html';
            }, 1500);

        } catch (error) {
            Utils.showNotification(error.message, 'error');
            Utils.hideLoading(submitButton, originalButtonText);
        }
    }

    // Update password strength indicator
    updatePasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (!passwordInput || !strengthBar || !strengthText) return;

        const password = passwordInput.value;
        const strength = Utils.getPasswordStrength(password);
        
        // Update strength bar
        const percentage = (strength.score / 5) * 100;
        strengthBar.style.setProperty('--strength-width', `${percentage}%`);
        
        // Update strength bar color and text
        let color, text;
        switch (strength.level) {
            case 'weak':
                color = '#e53e3e';
                text = 'Weak password';
                break;
            case 'medium':
                color = '#d69e2e';
                text = 'Medium password';
                break;
            case 'strong':
                color = '#38a169';
                text = 'Strong password';
                break;
            default:
                color = '#e2e8f0';
                text = 'Password strength';
        }
        
        strengthBar.style.setProperty('--strength-color', color);
        strengthText.textContent = text;
        strengthText.style.color = color;

        // Add CSS custom properties if not exists
        if (!document.querySelector('#password-strength-styles')) {
            const style = document.createElement('style');
            style.id = 'password-strength-styles';
            style.textContent = `
                .strength-bar::after {
                    width: var(--strength-width, 0%);
                    background: var(--strength-color, #e2e8f0);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Load remembered user
    loadRememberedUser() {
        const rememberedEmail = Utils.getData('ivoting_remember_user');
        const emailInput = document.getElementById('email');
        
        if (rememberedEmail && emailInput) {
            emailInput.value = rememberedEmail;
            
            // Check remember me checkbox
            const rememberCheckbox = document.getElementById('rememberMe');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }

    // Logout function
    logout() {
        Session.destroy();
        Utils.removeData('ivoting_remember_user');
        Utils.showNotification('Logged out successfully');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Logout function (global)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        const auth = new Auth();
        auth.logout();
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Auth();
    
    // Display demo credentials on login page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        addDemoCredentials();
    }
});

// Add demo credentials helper
function addDemoCredentials() {
    const loginContainer = document.querySelector('.login-container');
    if (!loginContainer) return;

    const demoInfo = document.createElement('div');
    demoInfo.className = 'demo-credentials';
    demoInfo.innerHTML = `
        <div style="
            background: #e6fffa;
            border: 1px solid #81e6d9;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        ">
            <h4 style="color: #234e52; margin-bottom: 10px;">
                <i class="fas fa-info-circle"></i> Demo Credentials
            </h4>
            <p style="color: #285e61; font-size: 0.9rem; margin-bottom: 10px;">
                Use these credentials to test the platform:
            </p>
            <div style="
                background: white;
                padding: 10px;
                border-radius: 6px;
                font-family: monospace;
                color: #2d3748;
                font-size: 0.85rem;
            ">
                <strong>Email:</strong> demo@ivoting.com<br>
                <strong>Password:</strong> demo123
            </div>
            <p style="color: #285e61; font-size: 0.8rem; margin-top: 10px;">
                Or create a new account with the signup form
            </p>
        </div>
    `;

    // Insert before the form
    const form = loginContainer.querySelector('.login-form');
    if (form) {
        loginContainer.insertBefore(demoInfo, form);
    }
}