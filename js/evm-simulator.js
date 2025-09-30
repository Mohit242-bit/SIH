// EVM Simulator JavaScript
class EVMSimulator {
    constructor() {
        this.votes = {
            A: 0,
            B: 0,
            C: 0,
            NOTA: 0
        };
        this.isSealed = false;
        this.startTime = new Date();
        this.votingHistory = [];
        this.machineId = 'EVM-001-MH-MUM';
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.loadPreviousData();
        setInterval(() => this.updateTime(), 1000);
        
        // Add event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.updateDisplay();
        });
    }
    
    updateTime() {
        const now = new Date();
        document.getElementById('current-time').textContent = now.toLocaleTimeString();
    }
    
    loadPreviousData() {
        const savedData = localStorage.getItem('evmVotes');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.votes = data.votes || this.votes;
            this.isSealed = data.isSealed || false;
            this.votingHistory = data.votingHistory || [];
            
            if (this.isSealed) {
                this.updateSealedState();
            }
            this.updateDisplay();
        }
    }
    
    saveData() {
        const data = {
            votes: this.votes,
            isSealed: this.isSealed,
            votingHistory: this.votingHistory,
            machineId: this.machineId,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('evmVotes', JSON.stringify(data));
    }
    
    castVote(candidate) {
        if (this.isSealed) {
            this.showAlert('Voting has been sealed! No more votes can be cast.', 'error');
            return;
        }
        
        // Record vote
        this.votes[candidate]++;
        
        // Add to voting history
        this.votingHistory.push({
            candidate: candidate,
            timestamp: new Date().toISOString(),
            voteNumber: this.getTotalVotes()
        });
        
        // Update display
        this.updateDisplay();
        
        // Visual feedback
        this.animateVoteButton(candidate);
        
        // Show confirmation
        this.showVoteConfirmation(candidate);
        
        // Save data
        this.saveData();
        
        // Auto-generate QR and blockchain data for demo
        this.updateBlockchainPreview();
    }
    
    animateVoteButton(candidate) {
        const button = document.getElementById(`candidate-${candidate}`);
        if (button) {
            button.classList.add('voted');
            setTimeout(() => {
                button.classList.remove('voted');
            }, 600);
        }
    }
    
    showVoteConfirmation(candidate) {
        const candidateNames = {
            A: 'Candidate A (BJP)',
            B: 'Candidate B (INC)',
            C: 'Candidate C (AAP)',
            NOTA: 'NOTA (None of the Above)'
        };
        
        const message = `Your vote for ${candidateNames[candidate]} has been securely recorded.`;
        document.getElementById('vote-message').textContent = message;
        document.getElementById('vote-confirmation').style.display = 'flex';
        
        // Auto-close after 2 seconds
        setTimeout(() => {
            this.closeVoteConfirmation();
        }, 2000);
    }
    
    closeVoteConfirmation() {
        document.getElementById('vote-confirmation').style.display = 'none';
    }
    
    updateDisplay() {
        // Update vote counts
        Object.keys(this.votes).forEach(candidate => {
            const element = document.getElementById(`votes-${candidate}`);
            if (element) {
                element.textContent = this.votes[candidate];
            }
        });
        
        // Update total votes
        document.getElementById('total-votes').textContent = this.getTotalVotes();
    }
    
    getTotalVotes() {
        return Object.values(this.votes).reduce((sum, count) => sum + count, 0);
    }
    
    sealVoting() {
        if (this.getTotalVotes() === 0) {
            this.showAlert('Cannot seal machine with zero votes!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to seal the voting machine? This action cannot be undone.')) {
            this.isSealed = true;
            this.updateSealedState();
            this.saveData();
            this.showAlert('Voting machine has been successfully sealed!', 'success');
        }
    }
    
    updateSealedState() {
        // Update status
        document.getElementById('status').innerHTML = '🔒 VOTING SEALED';
        document.getElementById('status').style.color = '#dc3545';
        
        // Disable voting buttons
        const candidateButtons = document.querySelectorAll('.candidate-button');
        candidateButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.6';
        });
        
        // Enable export button
        const exportButton = document.getElementById('export-button');
        exportButton.disabled = false;
        
        // Disable seal button
        const sealButton = document.getElementById('seal-button');
        sealButton.disabled = true;
        sealButton.textContent = '🔒 MACHINE SEALED';
    }
    
    exportData() {
        if (!this.isSealed) {
            this.showAlert('Please seal voting first before exporting data!', 'error');
            return;
        }
        
        // Generate cryptographic hash (mock)
        const dataString = JSON.stringify({
            votes: this.votes,
            machineId: this.machineId,
            timestamp: new Date().toISOString(),
            totalVotes: this.getTotalVotes()
        });
        
        const mockHash = this.generateMockHash(dataString);
        document.getElementById('data-hash').textContent = mockHash;
        
        // Show export section with animation
        const exportSection = document.getElementById('export-section');
        exportSection.style.display = 'block';
        
        // Animate QR code generation
        this.animateQRGeneration();
        
        this.showAlert('Data exported successfully! Ready for blockchain transfer.', 'success');
    }
    
    generateMockHash(data) {
        // Simple mock hash generation for demo
        const hash = btoa(data + Date.now()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
        return `0x${hash}...${hash.substring(0, 8)}`;
    }
    
    animateQRGeneration() {
        const qrElement = document.getElementById('qr-placeholder');
        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            qrElement.querySelector('span').textContent = 'GENERATING' + '.'.repeat(dots);
        }, 300);
        
        setTimeout(() => {
            clearInterval(interval);
            qrElement.querySelector('span').textContent = 'QR CODE';
        }, 2000);
    }
    
    copyHash() {
        const hashElement = document.getElementById('data-hash');
        const hash = hashElement.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(hash).then(() => {
                const copyBtn = document.getElementById('copy-hash-btn');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = hash;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showAlert('Hash copied to clipboard!', 'success');
        }
    }
    
    transferToBlockchain() {
        if (!this.isSealed) {
            this.showAlert('Machine must be sealed before blockchain transfer!', 'error');
            return;
        }
        
        // Simulate blockchain transaction
        const loadingBtn = document.getElementById('blockchain-transfer-btn');
        const originalText = loadingBtn.textContent;
        
        loadingBtn.textContent = '🔄 SUBMITTING TO BLOCKCHAIN...';
        loadingBtn.disabled = true;
        
        // Simulate network delay
        setTimeout(() => {
            this.simulateBlockchainSuccess();
            loadingBtn.textContent = originalText;
            loadingBtn.disabled = false;
        }, 3000);
    }
    
    simulateBlockchainSuccess() {
        // Generate mock blockchain data
        const txHash = this.generateMockHash('transaction' + Date.now());
        const blockNumber = Math.floor(Math.random() * 1000000) + 18800000;
        const gasUsed = (Math.random() * 0.001 + 0.001).toFixed(6);
        
        document.getElementById('tx-hash').textContent = txHash;
        document.getElementById('block-number').textContent = blockNumber;
        document.getElementById('gas-used').textContent = gasUsed;
        
        // Show success popup
        document.getElementById('blockchain-success').style.display = 'flex';
        
        // Update localStorage for results page
        const blockchainData = {
            ...JSON.parse(localStorage.getItem('evmVotes')),
            blockchainSubmitted: true,
            transactionHash: txHash,
            blockNumber: blockNumber,
            gasUsed: gasUsed,
            submissionTime: new Date().toISOString()
        };
        localStorage.setItem('evmVotes', JSON.stringify(blockchainData));
    }
    
    closeBlockchainSuccess() {
        document.getElementById('blockchain-success').style.display = 'none';
    }
    
    viewResults() {
        // Open results page
        window.open('results.html', '_blank');
        this.closeBlockchainSuccess();
    }
    
    updateBlockchainPreview() {
        // Update any blockchain-related previews in real-time
        const totalVotes = this.getTotalVotes();
        if (totalVotes > 0) {
            // Could add real-time blockchain simulation here
        }
    }
    
    showAlert(message, type = 'info') {
        // Create a simple alert system
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        switch(type) {
            case 'success':
                alertDiv.style.background = '#28a745';
                break;
            case 'error':
                alertDiv.style.background = '#dc3545';
                break;
            case 'warning':
                alertDiv.style.background = '#ffc107';
                alertDiv.style.color = '#000';
                break;
            default:
                alertDiv.style.background = '#007bff';
        }
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(alertDiv);
                }, 300);
            }
        }, 3000);
    }
    
    // Admin functions for testing/demo
    resetMachine() {
        if (confirm('Reset the entire machine? This will clear all votes and unlock the machine.')) {
            this.votes = { A: 0, B: 0, C: 0, NOTA: 0 };
            this.isSealed = false;
            this.votingHistory = [];
            localStorage.removeItem('evmVotes');
            
            // Reset UI
            document.getElementById('status').innerHTML = '🟢 VOTING IN PROGRESS';
            document.getElementById('status').style.color = '';
            
            const candidateButtons = document.querySelectorAll('.candidate-button');
            candidateButtons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '';
            });
            
            document.getElementById('export-button').disabled = true;
            document.getElementById('seal-button').disabled = false;
            document.getElementById('seal-button').textContent = '🔒 END VOTING & SEAL MACHINE';
            document.getElementById('export-section').style.display = 'none';
            
            this.updateDisplay();
            this.showAlert('Machine reset successfully!', 'success');
        }
    }
    
    // Simulate random votes for demo
    simulateVoting() {
        if (this.isSealed) {
            this.showAlert('Cannot simulate votes - machine is sealed!', 'error');
            return;
        }
        
        const candidates = ['A', 'B', 'C', 'NOTA'];
        const numVotes = Math.floor(Math.random() * 10) + 5;
        
        let interval = setInterval(() => {
            if (this.getTotalVotes() < numVotes) {
                const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
                this.castVote(randomCandidate);
            } else {
                clearInterval(interval);
                this.showAlert(`Simulated ${numVotes} votes successfully!`, 'success');
            }
        }, 500);
    }
}

// Global functions for HTML onclick events
let evmSimulator;

function castVote(candidate) {
    evmSimulator.castVote(candidate);
}

function sealVoting() {
    evmSimulator.sealVoting();
}

function exportData() {
    evmSimulator.exportData();
}

function copyHash() {
    evmSimulator.copyHash();
}

function transferToBlockchain() {
    evmSimulator.transferToBlockchain();
}

function closeVoteConfirmation() {
    evmSimulator.closeVoteConfirmation();
}

function closeBlockchainSuccess() {
    evmSimulator.closeBlockchainSuccess();
}

function viewResults() {
    evmSimulator.viewResults();
}

// Admin functions (can be called from console for demo)
function resetMachine() {
    evmSimulator.resetMachine();
}

function simulateVoting() {
    evmSimulator.simulateVoting();
}

// Initialize the simulator when page loads
document.addEventListener('DOMContentLoaded', function() {
    evmSimulator = new EVMSimulator();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .alert {
            animation: slideInRight 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🗳️ EVM Simulator Initialized');
    console.log('📝 Available admin commands:');
    console.log('   resetMachine() - Reset all votes and unlock machine');
    console.log('   simulateVoting() - Add random votes for demo');
});

// Keyboard shortcuts for demo
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                castVote('A');
                break;
            case '2':
                e.preventDefault();
                castVote('B');
                break;
            case '3':
                e.preventDefault();
                castVote('C');
                break;
            case '4':
                e.preventDefault();
                castVote('NOTA');
                break;
            case 's':
                e.preventDefault();
                sealVoting();
                break;
            case 'e':
                e.preventDefault();
                exportData();
                break;
            case 'r':
                if (e.shiftKey) {
                    e.preventDefault();
                    resetMachine();
                }
                break;
        }
    }
});