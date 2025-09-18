// Voting functionality for i-Voting Platform
// Handles candidate selection, vote casting, and related features

// Candidate data
const CANDIDATES = {
    candidate1: {
        id: 'candidate1',
        name: 'John Anderson',
        party: 'Democratic Party',
        experience: 'Former Governor • 15 years experience',
        platforms: ['Healthcare Reform', 'Education', 'Climate Action'],
        photo: 'https://via.placeholder.com/150x150/4F46E5/white?text=JA',
        description: 'Experienced leader with a focus on progressive policies and social reform.'
    },
    candidate2: {
        id: 'candidate2',
        name: 'Sarah Mitchell',
        party: 'Republican Party',
        experience: 'Business Leader • Former Senator',
        platforms: ['Economic Growth', 'Tax Reform', 'Infrastructure'],
        photo: 'https://via.placeholder.com/150x150/DC2626/white?text=SM',
        description: 'Proven business leader with expertise in economic policy and fiscal responsibility.'
    },
    candidate3: {
        id: 'candidate3',
        name: 'Michael Rodriguez',
        party: 'Independent',
        experience: 'Tech Entrepreneur • City Mayor',
        platforms: ['Innovation', 'Digital Rights', 'Youth Employment'],
        photo: 'https://via.placeholder.com/150x150/059669/white?text=MR',
        description: 'Forward-thinking innovator focused on technology and modernization.'
    }
};

// Voting class
class VotingSystem {
    constructor() {
        this.selectedCandidate = null;
        this.voteId = null;
        this.currentUser = null;
        this.countdownTimer = null;
        
        this.init();
    }

    // Initialize voting system
    init() {
        this.currentUser = Session.getCurrentUser();
        
        if (!this.currentUser) {
            Utils.showNotification('Please log in to access the voting page', 'error');
            window.location.href = 'index.html';
            return;
        }

        // Check if user has already voted
        if (this.currentUser.hasVoted) {
            Utils.showNotification('You have already cast your vote', 'error');
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
            return;
        }

        this.setupUI();
        this.initializeEventListeners();
        this.startCountdown();
        this.generateVoteId();
    }

    // Setup UI elements
    setupUI() {
        // Display user name
        const voterNameElement = document.getElementById('voterName');
        if (voterNameElement) {
            voterNameElement.textContent = `Welcome, ${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }

        // Display vote ID
        this.displayVoteId();
    }

    // Generate and display vote ID
    generateVoteId() {
        this.voteId = Utils.generateVoteId();
        const voteIdElement = document.getElementById('voteId');
        if (voteIdElement) {
            voteIdElement.textContent = this.voteId;
        }
    }

    // Display vote ID
    displayVoteId() {
        const voteIdElement = document.getElementById('voteId');
        if (voteIdElement && this.voteId) {
            voteIdElement.textContent = this.voteId;
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Candidate selection
        const candidateInputs = document.querySelectorAll('input[name="vote"]');
        candidateInputs.forEach(input => {
            input.addEventListener('change', this.handleCandidateSelection.bind(this));
        });

        // Review vote button
        const reviewButton = document.getElementById('reviewVote');
        if (reviewButton) {
            reviewButton.addEventListener('click', this.showVoteSummary.bind(this));
        }

        // Cast vote button
        const castVoteButton = document.getElementById('castVote');
        if (castVoteButton) {
            castVoteButton.addEventListener('click', this.showConfirmationModal.bind(this));
        }

        // Voting form submission
        const votingForm = document.getElementById('votingForm');
        if (votingForm) {
            votingForm.addEventListener('submit', this.handleVoteSubmission.bind(this));
        }
    }

    // Handle candidate selection
    handleCandidateSelection(event) {
        this.selectedCandidate = event.target.value;
        
        // Update UI
        this.updateSelectionUI();
        this.enableVotingButtons();
        
        // Show selection feedback
        const candidate = CANDIDATES[this.selectedCandidate];
        if (candidate) {
            Utils.showNotification(`Selected: ${candidate.name}`, 'success');
        }
    }

    // Update selection UI
    updateSelectionUI() {
        // Update candidate cards
        const candidateCards = document.querySelectorAll('.candidate-card');
        candidateCards.forEach(card => {
            const input = card.querySelector('input[name="vote"]');
            const voteIndicator = card.querySelector('.vote-indicator');
            
            if (input.value === this.selectedCandidate) {
                card.classList.add('selected');
                if (voteIndicator) {
                    voteIndicator.style.opacity = '1';
                }
            } else {
                card.classList.remove('selected');
                if (voteIndicator) {
                    voteIndicator.style.opacity = '0';
                }
            }
        });
    }

    // Enable voting buttons
    enableVotingButtons() {
        const reviewButton = document.getElementById('reviewVote');
        const castVoteButton = document.getElementById('castVote');
        
        if (reviewButton) {
            reviewButton.disabled = false;
        }
        
        if (castVoteButton) {
            castVoteButton.disabled = false;
        }
    }

    // Show vote summary
    showVoteSummary() {
        const voteSummary = document.getElementById('voteSummary');
        const selectedCandidateElement = document.getElementById('selectedCandidate');
        
        if (voteSummary && selectedCandidateElement && this.selectedCandidate) {
            const candidate = CANDIDATES[this.selectedCandidate];
            selectedCandidateElement.textContent = candidate.name;
            voteSummary.style.display = 'block';
            
            // Scroll to summary
            voteSummary.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Show confirmation modal
    showConfirmationModal() {
        if (!this.selectedCandidate) {
            Utils.showNotification('Please select a candidate first', 'error');
            return;
        }

        const modal = document.getElementById('confirmationModal');
        const finalCandidateElement = document.getElementById('finalCandidate');
        
        if (modal && finalCandidateElement) {
            const candidate = CANDIDATES[this.selectedCandidate];
            finalCandidateElement.textContent = candidate.name;
            modal.style.display = 'block';
            
            // Focus on modal for accessibility
            modal.focus();
        }
    }

    // Handle vote submission
    handleVoteSubmission(event) {
        event.preventDefault();
        this.showConfirmationModal();
    }

    // Confirm and cast vote
    async confirmVote() {
        if (!this.selectedCandidate) {
            Utils.showNotification('No candidate selected', 'error');
            return;
        }

        try {
            // Show loading state
            const confirmButton = document.querySelector('.modal-actions .btn-primary');
            const originalText = Utils.showLoading(confirmButton);

            // Simulate vote processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create vote record
            const voteData = {
                voteId: this.voteId,
                candidateId: this.selectedCandidate,
                candidate: CANDIDATES[this.selectedCandidate],
                voter: {
                    id: this.currentUser.id,
                    name: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
                    voterId: this.currentUser.voterId
                },
                timestamp: new Date().toISOString(),
                verificationHash: Utils.generateHash(),
                status: 'confirmed'
            };

            // Store vote data
            Utils.storeData(STORAGE_KEYS.VOTE_DATA, voteData);

            // Mark user as voted
            this.markUserAsVoted();

            // Hide modal
            this.closeConfirmationModal();

            // Show success message
            Utils.showNotification('Vote cast successfully!', 'success');

            // Redirect to success page
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 1500);

        } catch (error) {
            Utils.showNotification('Error casting vote. Please try again.', 'error');
            console.error('Vote casting error:', error);
        }
    }

    // Mark user as voted
    markUserAsVoted() {
        // Update user in session
        const session = Session.get();
        if (session) {
            session.user.hasVoted = true;
            Utils.storeData(STORAGE_KEYS.SESSION, session);
        }

        // Update user in database
        const users = Utils.getData('ivoting_users') || [];
        const userIndex = users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].hasVoted = true;
            Utils.storeData('ivoting_users', users);
        }
    }

    // Close confirmation modal
    closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Start countdown timer
    startCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        // Set voting end time (for demo, let's set it to 24 hours from now)
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);

        this.countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime.getTime() - now;

            if (distance < 0) {
                clearInterval(this.countdownTimer);
                countdownElement.textContent = 'Voting has ended';
                this.disableVoting();
                return;
            }

            // Calculate time units
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display countdown
            countdownElement.textContent = `Voting ends in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Disable voting when time expires
    disableVoting() {
        const votingForm = document.getElementById('votingForm');
        const candidateInputs = document.querySelectorAll('input[name="vote"]');
        const actionButtons = document.querySelectorAll('.action-buttons button');

        // Disable form elements
        if (votingForm) {
            votingForm.style.opacity = '0.5';
            votingForm.style.pointerEvents = 'none';
        }

        candidateInputs.forEach(input => {
            input.disabled = true;
        });

        actionButtons.forEach(button => {
            button.disabled = true;
        });

        Utils.showNotification('Voting period has ended', 'error');
    }

    // Update session time
    updateSessionTime() {
        const sessionTimeElement = document.getElementById('sessionTime');
        if (sessionTimeElement) {
            const session = Session.get();
            if (session) {
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const duration = Math.floor((now - loginTime) / 1000 / 60); // minutes
                sessionTimeElement.textContent = `Active (${duration} min)`;
            }
        }
    }

    // Cleanup on page unload
    cleanup() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    }
}

// Global functions for modal interactions
function closeConfirmationModal() {
    const votingSystem = window.votingSystemInstance;
    if (votingSystem) {
        votingSystem.closeConfirmationModal();
    }
}

function confirmVote() {
    const votingSystem = window.votingSystemInstance;
    if (votingSystem) {
        votingSystem.confirmVote();
    }
}

// Initialize voting system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on voting page
    if (window.location.pathname.includes('voting.html')) {
        window.votingSystemInstance = new VotingSystem();
        
        // Update session time every minute
        setInterval(() => {
            if (window.votingSystemInstance) {
                window.votingSystemInstance.updateSessionTime();
            }
        }, 60000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (window.votingSystemInstance) {
                window.votingSystemInstance.cleanup();
            }
        });

        // Handle modal close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = document.getElementById('confirmationModal');
                if (modal && modal.style.display === 'block') {
                    closeConfirmationModal();
                }
            }
        });

        // Handle modal close on backdrop click
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeConfirmationModal();
                }
            });
        }
    }
});