// Blockchain Results Dashboard JavaScript
class BlockchainDashboard {
    constructor() {
        this.currentResults = { A: 0, B: 0, C: 0, NOTA: 0 };
        this.evmsProcessed = 0;
        this.totalEvms = 120;
        this.blockHeight = 18847392;
        this.autoRefresh = true;
        this.startTime = new Date();
        this.transactions = [];
        this.lastVoteUpdate = 0;
        this.gasPrice = 25;
        this.networkLatency = 12;
        // Keep track of interval IDs so we can stop/start them when pausing auto-refresh
        this.intervals = {
            network: null,
            newEVM: null,
            realtime: null,
            time: null,
            uptime: null
        };
        
        // Anti-tampering system
        this.originalData = null;
        this.tamperingAttempts = 0;
        this.blockchainHashes = {};
        
        this.init();
    }
    
    init() {
        this.loadEVMData();
        this.generateInitialTransactions();
        this.generateBlockchainHashes();

        // Always run clock and uptime intervals
        this.updateTime();
        this.updateUptime();
        this.intervals.time = setInterval(() => this.updateTime(), 1000);
        this.intervals.uptime = setInterval(() => this.updateUptime(), 1000);

        // Start network/activity intervals only when autoRefresh is enabled
        if (this.autoRefresh) {
            this.startBackgroundIntervals();
        }
    }

    startBackgroundIntervals() {
        // Avoid creating duplicate intervals
        if (!this.intervals.network) {
            this.intervals.network = setInterval(() => this.simulateNetworkActivity(), 2000);
        }

        if (!this.intervals.newEVM) {
            this.intervals.newEVM = setInterval(() => this.checkForNewEVMData(), 1000);
        }

        // Start realtime vote updates interval (if not already running)
        this.startRealTimeUpdates();
    }

    stopBackgroundIntervals() {
        if (this.intervals.network) {
            clearInterval(this.intervals.network);
            this.intervals.network = null;
        }
        if (this.intervals.newEVM) {
            clearInterval(this.intervals.newEVM);
            this.intervals.newEVM = null;
        }
        if (this.intervals.realtime) {
            clearInterval(this.intervals.realtime);
            this.intervals.realtime = null;
        }
    }
    
    loadEVMData() {
        const evmData = localStorage.getItem('evmVotes');
        if (evmData) {
            try {
                const data = JSON.parse(evmData);
                if (data.votes) {
                    this.currentResults = data.votes;
                    this.originalData = JSON.parse(JSON.stringify(data.votes)); // Deep copy
                    this.evmsProcessed = Math.min(this.evmsProcessed + 1, this.totalEvms);
                    
                    // Add transaction for this EVM
                    this.addTransaction(data.machineId || 'EVM-001', this.getTotalVotes());
                }
            } catch (error) {
                console.error('Error parsing EVM data:', error);
            }
        }
        this.updateDisplay();
    }
    
    checkForNewEVMData() {
        // If autoRefresh has been turned off, skip polling for new EVM data
        if (!this.autoRefresh) return;

        const evmData = localStorage.getItem('evmVotes');
        if (evmData) {
            try {
                const data = JSON.parse(evmData);
                if (data.votes && data.timestamp) {
                    const currentTotal = this.getTotalVotes();
                    const newTotal = Object.values(data.votes).reduce((sum, count) => sum + count, 0);

                    if (newTotal > currentTotal) {
                        this.currentResults = data.votes;
                        this.lastVoteUpdate = newTotal - currentTotal;
                        this.updateDisplay();
                        this.generateBlockchainHashes();

                        // Show sync status
                        document.getElementById('sync-status').textContent = '🔄 New votes detected - syncing...';
                        setTimeout(() => {
                            document.getElementById('sync-status').textContent = '✅ Synchronized';
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Error checking EVM data:', error);
            }
        }
    }
    
    getTotalVotes() {
        return Object.values(this.currentResults).reduce((sum, count) => sum + count, 0);
    }
    
    updateDisplay() {
        const total = this.getTotalVotes();
        
        // Update stats
        document.getElementById('total-votes').textContent = total.toLocaleString();
        document.getElementById('vote-trend').textContent = this.lastVoteUpdate;
        document.getElementById('evms-processed').textContent = `${this.evmsProcessed}/${this.totalEvms}`;
        document.getElementById('blocks').textContent = this.blockHeight.toLocaleString();
        
        // Update EVM progress
        const progressPercent = (this.evmsProcessed / this.totalEvms) * 100;
        document.getElementById('evm-progress').style.width = `${progressPercent}%`;
        
        // Update candidate results
        ['A', 'B', 'C', 'NOTA'].forEach(candidate => {
            const voteCount = this.currentResults[candidate];
            const percentage = total > 0 ? Math.round((voteCount / total) * 100) : 0;
            
            const voteDisplay = document.getElementById(`votes-${candidate}-display`);
            const progressBar = document.getElementById(`progress-${candidate}`);
            const percentDisplay = document.getElementById(`percent-${candidate}`);
            
            if (voteDisplay) voteDisplay.textContent = `${voteCount.toLocaleString()} votes`;
            if (progressBar) progressBar.style.width = `${percentage}%`;
            if (percentDisplay) percentDisplay.textContent = `${percentage}%`;
        });
    }
    
    generateBlockchainHashes() {
        ['A', 'B', 'C', 'NOTA'].forEach(candidate => {
            const data = {
                candidate,
                votes: this.currentResults[candidate],
                timestamp: Date.now(),
                blockHeight: this.blockHeight
            };
            const hash = this.generateHash(JSON.stringify(data));
            this.blockchainHashes[candidate] = hash;
            
            const hashElement = document.getElementById(`hash-${candidate}`);
            if (hashElement) {
                hashElement.textContent = `Hash: ${hash}`;
            }
        });
    }
    
    generateHash(data) {
        // Mock cryptographic hash generation
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
        return `0x${hashHex}...${hashHex.substring(0, 8)}`;
    }
    
    generateInitialTransactions() {
        const machineIds = ['EVM-001', 'EVM-002', 'EVM-003', 'EVM-004', 'EVM-005'];
        
        for (let i = 0; i < 5; i++) {
            this.addTransaction(
                machineIds[i],
                Math.floor(Math.random() * 500) + 100,
                Math.random() > 0.3 ? 'confirmed' : 'pending'
            );
        }
    }
    
    addTransaction(machineId, votes, status = 'confirmed') {
        const transaction = {
            blockNumber: this.blockHeight - this.transactions.length,
            evmId: machineId,
            votes: votes,
            hash: this.generateHash(`${machineId}-${votes}-${Date.now()}`),
            status: status,
            timestamp: new Date()
        };
        
        this.transactions.unshift(transaction);
        if (this.transactions.length > 10) {
            this.transactions.pop();
        }
        
        this.updateTransactionsList();
    }
    
    updateTransactionsList() {
        const container = document.getElementById('transactions-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.transactions.forEach(tx => {
            const item = document.createElement('div');
            item.className = `transaction-item ${tx.status}`;
            
            item.innerHTML = `
                <span>#${tx.blockNumber.toLocaleString()}</span>
                <span>${tx.evmId}</span>
                <span>${tx.votes}</span>
                <span class="transaction-hash">${tx.hash}</span>
                <span class="status-${tx.status}">${tx.status.toUpperCase()}</span>
                <span>${tx.timestamp.toLocaleTimeString()}</span>
            `;
            
            container.appendChild(item);
        });
    }
    
    simulateNetworkActivity() {
        // Simulate blockchain activity
        this.blockHeight += 1;
        document.getElementById('blocks').textContent = this.blockHeight.toLocaleString();
        
        // Simulate gas price fluctuation
        this.gasPrice += (Math.random() - 0.5) * 5;
        this.gasPrice = Math.max(15, Math.min(50, this.gasPrice));
        document.getElementById('gas-price').textContent = `${Math.round(this.gasPrice)} gwei`;
        
        // Simulate network latency
        this.networkLatency = Math.floor(Math.random() * 20) + 8;
        document.getElementById('latency').textContent = `${this.networkLatency}ms`;
        
        // Occasionally add new transactions from other EVMs
        if (Math.random() > 0.7 && this.evmsProcessed < this.totalEvms) {
            const machineId = `EVM-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
            const votes = Math.floor(Math.random() * 300) + 50;
            this.addTransaction(machineId, votes, Math.random() > 0.2 ? 'confirmed' : 'pending');
            
            if (Math.random() > 0.5) {
                this.evmsProcessed = Math.min(this.evmsProcessed + 1, this.totalEvms);
            }
        }
    }
    
    updateTime() {
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
    }
    
    updateUptime() {
        const now = new Date();
        const uptime = new Date(now - this.startTime);
        const hours = String(uptime.getUTCHours()).padStart(2, '0');
        const minutes = String(uptime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(uptime.getUTCSeconds()).padStart(2, '0');
        document.getElementById('uptime').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    startRealTimeUpdates() {
        // Only create one realtime interval; will be started/stopped by startBackgroundIntervals/stopBackgroundIntervals
        if (this.intervals.realtime) return;

        this.intervals.realtime = setInterval(() => {
            if (!this.autoRefresh) return;

            if (Math.random() > 0.8 && this.evmsProcessed < this.totalEvms) {
                const candidates = ['A', 'B', 'C', 'NOTA'];
                const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
                const voteIncrease = Math.floor(Math.random() * 3) + 1;

                this.currentResults[randomCandidate] += voteIncrease;
                this.lastVoteUpdate = voteIncrease;

                this.updateDisplay();
                this.generateBlockchainHashes();
            }
        }, 5000);
    }
    
    // Anti-Tampering Demonstration
    demonstrateTampering() {
        console.log('🚨 Simulating tampering attack...');
        
        // Store original data for restoration
        const originalVotes = JSON.parse(JSON.stringify(this.currentResults));
        
        // Simulate tampering - artificially increase votes for Candidate A
        const tamperAmount = 1000;
        this.currentResults.A += tamperAmount;
        
        // Update display with tampered data briefly
        this.updateDisplay();
        
        // Show tampering detection after 2 seconds
        setTimeout(() => {
            // Detect tampering by validating blockchain hashes
            const isValid = this.validateDataIntegrity(originalVotes);
            
            if (!isValid) {
                this.triggerTamperAlert();
                
                // Restore original data from blockchain
                setTimeout(() => {
                    this.currentResults = originalVotes;
                    this.updateDisplay();
                    this.generateBlockchainHashes();
                    
                    // Update tamper check status
                    this.updateTamperChecks(true);
                }, 1000);
            }
        }, 2000);
    }

    // Manual tamper triggered from UI: temporarily add votes to a chosen candidate
    manualTamper(candidate, amount) {
        if (!candidate || !amount || amount <= 0) return;

        console.log(`⚠️ Manual tamper requested: +${amount} to ${candidate}`);

        // Preserve original data
        const originalVotes = JSON.parse(JSON.stringify(this.currentResults));

        // Apply tamper
        this.currentResults[candidate] += amount;
        this.lastVoteUpdate = amount;
        this.updateDisplay();
        this.generateBlockchainHashes();

        // After a short delay run detection similar to the automated demo
        setTimeout(() => {
            const isValid = this.validateDataIntegrity(originalVotes);
            if (!isValid) {
                this.triggerTamperAlert();

                // Restore original data after showing alert
                setTimeout(() => {
                    this.currentResults = originalVotes;
                    this.updateDisplay();
                    this.generateBlockchainHashes();
                    this.updateTamperChecks(true);
                }, 1200);
            } else {
                // If validation passed (small amount), show success briefly
                this.showAlert('No tampering detected (changes within expected range)', 'success');
            }
        }, 1000);
    }
    
    validateDataIntegrity(originalData) {
        // Simulate blockchain consensus validation
        const currentTotal = this.getTotalVotes();
        const originalTotal = Object.values(originalData).reduce((sum, count) => sum + count, 0);
        
        // If vote count increased by more than expected, flag as tampering
        return currentTotal <= originalTotal + 10; // Allow small natural increases
    }
    
    triggerTamperAlert() {
        this.tamperingAttempts++;
        
        // Show tampering modal
        document.getElementById('tamper-time').textContent = new Date().toLocaleString();
        document.getElementById('tamper-modal').style.display = 'flex';
        
        // Update tamper check status to show failed checks
        this.updateTamperChecks(false);
        
        console.log('🛡️ Tampering detected and blocked by blockchain consensus!');
    }
    
    updateTamperChecks(isSecure) {
        const checks = document.querySelectorAll('.check-item');
        
        if (!isSecure) {
            // Show failed checks during tampering attempt
            checks[0].className = 'check-item failed';
            checks[0].innerHTML = '<span class="check-icon">❌</span><span>Invalid cryptographic signature detected</span>';
            
            checks[1].className = 'check-item failed';
            checks[1].innerHTML = '<span class="check-icon">❌</span><span>Hash chain integrity compromised</span>';
            
            checks[2].className = 'check-item failed';
            checks[2].innerHTML = '<span class="check-icon">❌</span><span>Blockchain consensus failure (0/6 nodes)</span>';
        } else {
            // Restore secure status
            setTimeout(() => {
                checks[0].className = 'check-item verified';
                checks[0].innerHTML = '<span class="check-icon">✅</span><span>Cryptographic signatures valid</span>';
                
                checks[1].className = 'check-item verified';
                checks[1].innerHTML = '<span class="check-icon">✅</span><span>Hash chain integrity verified</span>';
                
                checks[2].className = 'check-item verified';
                checks[2].innerHTML = '<span class="check-icon">✅</span><span>No duplicate votes detected</span>';
            }, 3000);
        }
    }
    
    verifyIntegrity() {
        const modal = document.getElementById('integrity-modal');
        const resultsContainer = document.getElementById('verification-results');
        
        modal.style.display = 'flex';
        resultsContainer.innerHTML = '';
        
        // Simulate verification process
        const checks = [
            'Verifying cryptographic signatures...',
            'Checking blockchain hash consistency...',
            'Validating vote count integrity...',
            'Confirming timestamp authenticity...',
            'Cross-referencing with network consensus...'
        ];
        
        let currentCheck = 0;
        
        const verificationInterval = setInterval(() => {
            if (currentCheck < checks.length) {
                const checkDiv = document.createElement('div');
                checkDiv.className = 'verification-step';
                checkDiv.innerHTML = `
                    <span class="step-icon">⏳</span>
                    <span>${checks[currentCheck]}</span>
                `;
                resultsContainer.appendChild(checkDiv);
                
                // Complete the check after 1 second
                setTimeout(() => {
                    checkDiv.innerHTML = `
                        <span class="step-icon">✅</span>
                        <span>${checks[currentCheck].replace('...', ' - PASSED')}</span>
                    `;
                    checkDiv.style.background = '#d4edda';
                }, 1000);
                
                currentCheck++;
            } else {
                clearInterval(verificationInterval);
                
                // Show final results
                setTimeout(() => {
                    const finalResult = document.createElement('div');
                    finalResult.innerHTML = `
                        <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin-top: 15px; border: 2px solid #28a745;">
                            <h4 style="color: #155724; margin-bottom: 10px;">🛡️ INTEGRITY VERIFICATION COMPLETE</h4>
                            <p style="color: #155724; margin: 5px 0;"><strong>Status:</strong> ALL CHECKS PASSED</p>
                            <p style="color: #155724; margin: 5px 0;"><strong>Total Votes Verified:</strong> ${this.getTotalVotes().toLocaleString()}</p>
                            <p style="color: #155724; margin: 5px 0;"><strong>Blockchain Consensus:</strong> 6/6 nodes agree</p>
                            <p style="color: #155724; margin: 5px 0;"><strong>Security Level:</strong> MAXIMUM</p>
                        </div>
                    `;
                    resultsContainer.appendChild(finalResult);
                    
                    document.getElementById('integrity-close-btn').style.display = 'block';
                }, 1500);
            }
        }, 1500);
    }
    
    toggleAutoRefresh() {
        this.autoRefresh = !this.autoRefresh;
        const btn = document.getElementById('auto-refresh-btn');
        btn.textContent = `🔄 Auto-Refresh: ${this.autoRefresh ? 'ON' : 'OFF'}`;
        btn.style.background = this.autoRefresh ? 
            'linear-gradient(135deg, #3498db, #2980b9)' : 
            'linear-gradient(135deg, #95a5a6, #7f8c8d)';

        if (this.autoRefresh) {
            // Restart network and polling intervals
            this.startBackgroundIntervals();
            this.showAlert('▶️ Auto-Refresh resumed', 'success');
        } else {
            // Stop intervals that produce changing results (votes, transactions)
            this.stopBackgroundIntervals();
            this.showAlert('⏸️ Auto-Refresh paused - results will not change', 'warning');
        }
    }
    
    downloadResults() {
        const results = {
            timestamp: new Date().toISOString(),
            totalVotes: this.getTotalVotes(),
            candidates: this.currentResults,
            evmsProcessed: this.evmsProcessed,
            blockchainHashes: this.blockchainHashes,
            blockHeight: this.blockHeight,
            tamperingAttempts: this.tamperingAttempts
        };
        
        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `election-results-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.showAlert('📊 Results exported successfully!', 'success');
    }
    
    copyContract() {
        const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(contractAddress).then(() => {
                this.showAlert('📋 Contract address copied to clipboard!', 'success');
            });
        }
    }
    
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10001;
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
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (alertDiv.parentNode) {
                        document.body.removeChild(alertDiv);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Global functions for HTML onclick events
let dashboard;

function toggleAutoRefresh() {
    dashboard.toggleAutoRefresh();
}

function downloadResults() {
    dashboard.downloadResults();
}

function verifyIntegrity() {
    dashboard.verifyIntegrity();
}

function demonstrateTampering() {
    dashboard.demonstrateTampering();
}

function copyContract() {
    dashboard.copyContract();
}

function closeTamperModal() {
    document.getElementById('tamper-modal').style.display = 'none';
}

function closeIntegrityModal() {
    document.getElementById('integrity-modal').style.display = 'none';
}

// Handler for the manual tamper UI in results.html
function manualTamperFromUI() {
    const candidate = document.getElementById('tamper-candidate').value;
    const amount = parseInt(document.getElementById('tamper-amount').value, 10) || 0;
    if (!dashboard) return;
    dashboard.manualTamper(candidate, amount);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new BlockchainDashboard();
    
    console.log('⛓️ Blockchain Dashboard Initialized');
    console.log('🛡️ Anti-tampering system active');
    console.log('📊 Real-time monitoring enabled');
    
    // Add CSS animations for alerts
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
    `;
    document.head.appendChild(style);
});

// Keyboard shortcuts for demo
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 't':
                e.preventDefault();
                demonstrateTampering();
                break;
            case 'v':
                e.preventDefault();
                verifyIntegrity();
                break;
            case 'd':
                e.preventDefault();
                downloadResults();
                break;
            case 'r':
                if (!e.shiftKey) {
                    e.preventDefault();
                    toggleAutoRefresh();
                }
                break;
        }
    }
});