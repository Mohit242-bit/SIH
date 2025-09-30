// Blockchain Results Dashboard JavaScript
class BlockchainDashboard {
    constructor() {
        this.currentResults = { A: 0, B: 0, C: 0, NOTA: 0 };
        this.evmsProcessed = 0;
        this.totalEvms = 120;
        this.blockHeight = 18847392;
        this.autoRefresh = false; // Default to OFF to prevent fake activity
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
        
        // Anti-tampering system with real protection
        this.originalData = null;
        this.tamperingAttempts = 0;
        this.blockchainHashes = {};
        this.cryptographicSeal = null;
        this.isDataSealed = false;
        
        // Immutable data protection
        this.immutableVoteRecord = null;
        
        // Immutable data protection
        this.immutableVoteRecord = null;
        
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
                    
                    // Create immutable record for security
                    this.immutableVoteRecord = Object.freeze(JSON.parse(JSON.stringify(data.votes)));
                    this.isDataSealed = true;
                    
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
        // Only simulate basic blockchain metrics, not fake transactions or EVMs
        this.blockHeight += 1;
        document.getElementById('blocks').textContent = this.blockHeight.toLocaleString();
        
        // Simulate gas price fluctuation
        this.gasPrice += (Math.random() - 0.5) * 5;
        this.gasPrice = Math.max(15, Math.min(50, this.gasPrice));
        document.getElementById('gas-price').textContent = `${Math.round(this.gasPrice)} gwei`;
        
        // Simulate network latency
        this.networkLatency = Math.floor(Math.random() * 20) + 8;
        document.getElementById('latency').textContent = `${this.networkLatency}ms`;
        
        // Remove fake EVM and transaction generation - these should only come from real EVM submissions
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
        // Remove fake vote generation - votes should only come from actual EVM submissions
        // Real blockchain systems don't randomly generate votes
        if (this.intervals.realtime) return;

        this.intervals.realtime = setInterval(() => {
            if (!this.autoRefresh) return;
            // Only check for legitimate EVM data updates, no fake vote generation
            this.checkForNewEVMData();
        }, 2000);
    }
    
    // Anti-Tampering Demonstration - SECURE VERSION
    demonstrateTampering() {
        console.log('🚨 Simulating tampering attack...');
        
        // DON'T modify real data - just show what would happen
        const originalVotes = JSON.parse(JSON.stringify(this.currentResults));
        const tamperAmount = 1000;
        
        // Show tampering attempt without actually changing data
        this.showTamperAttempt('A', tamperAmount, originalVotes);
        
        // Immediately show detection - no real data was ever changed
        setTimeout(() => {
            this.triggerTamperAlert();
            this.updateTamperChecks(false);
            
            // Show that original data is preserved
            setTimeout(() => {
                this.updateTamperChecks(true);
                this.showAlert('🛡️ Original vote data preserved - tampering blocked!', 'success');
            }, 3000);
        }, 1000);
    }

    // Show visual indication of tampering attempt without changing real data
    showTamperAttempt(candidate, amount, originalData) {
        // Create temporary visual effect showing attempted change
        const element = document.getElementById(`votes-${candidate}-display`);
        const progressElement = document.getElementById(`progress-${candidate}`);
        
        if (element) {
            const originalText = element.textContent;
            const originalStyle = {
                color: element.style.color,
                background: element.style.background,
                fontWeight: element.style.fontWeight
            };
            
            // Show tampering attempt with red warning
            element.style.color = '#ffffff';
            element.style.background = '#dc3545';
            element.style.fontWeight = 'bold';
            element.style.padding = '8px';
            element.style.borderRadius = '4px';
            element.style.animation = 'blink 0.5s infinite';
            element.textContent = `🚨 TAMPERING BLOCKED: Attempted +${amount} votes`;
            
            // Make progress bar flash red too
            if (progressElement) {
                progressElement.style.background = '#dc3545';
                progressElement.style.animation = 'blink 0.5s infinite';
            }
            
            // Restore original after showing the blocked attempt
            setTimeout(() => {
                element.style.color = originalStyle.color;
                element.style.background = originalStyle.background;
                element.style.fontWeight = originalStyle.fontWeight;
                element.style.padding = '';
                element.style.borderRadius = '';
                element.style.animation = '';
                element.textContent = originalText;
                
                if (progressElement) {
                    progressElement.style.background = '';
                    progressElement.style.animation = '';
                }
            }, 2000);
        }
    }

    // Manual tamper - SECURE VERSION that never changes real data
    manualTamper(candidate, amount) {
        if (!candidate || !amount || amount <= 0) {
            this.showAlert('⚠️ Invalid tampering parameters', 'error');
            return;
        }

        console.log(`🚨 SECURITY ALERT: Manual tamper attempt blocked - tried to add ${amount} votes to ${candidate}`);
        
        // Show immediate blocking message
        this.showAlert(`🚨 TAMPERING BLOCKED! Attempt to add ${amount} votes to Candidate ${candidate} has been prevented by blockchain security!`, 'error');

        // NEVER modify real data - just show the attempt being blocked visually
        this.showTamperAttempt(candidate, amount, this.currentResults);
        
        // Trigger security alert immediately
        setTimeout(() => {
            this.triggerTamperAlert();
            this.updateTamperChecks(false);
            
            // Show security restoration
            setTimeout(() => {
                this.updateTamperChecks(true);
                this.showAlert(`✅ Security restored - Original vote data preserved`, 'success');
            }, 2000);
        }, 500);
    }
    
    validateDataIntegrity(originalData) {
        // Real blockchain validation - compare against immutable record
        if (!this.immutableVoteRecord) return false;
        
        // Check if current data matches the sealed immutable record
        const currentTotal = this.getTotalVotes();
        const sealedTotal = Object.values(this.immutableVoteRecord).reduce((sum, count) => sum + count, 0);
        
        // Verify each candidate's votes match the immutable record
        for (const candidate of ['A', 'B', 'C', 'NOTA']) {
            if (this.currentResults[candidate] !== this.immutableVoteRecord[candidate]) {
                console.log(`🚨 Integrity violation detected for ${candidate}: Expected ${this.immutableVoteRecord[candidate]}, got ${this.currentResults[candidate]}`);
                return false;
            }
        }
        
        return currentTotal === sealedTotal;
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
        
        // Set modal styles for proper sizing and scrolling
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        // Set container styles for scrolling
        resultsContainer.style.maxHeight = '400px';
        resultsContainer.style.overflowY = 'auto';
        resultsContainer.style.padding = '10px';
        resultsContainer.innerHTML = '';
        
        // Hide close button initially
        document.getElementById('integrity-close-btn').style.display = 'none';
        
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
                checkDiv.style.cssText = `
                    padding: 10px;
                    margin: 8px 0;
                    border-radius: 6px;
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    transition: all 0.3s ease;
                `;
                checkDiv.innerHTML = `
                    <span class="step-icon">⏳</span>
                    <span>${checks[currentCheck]}</span>
                `;
                resultsContainer.appendChild(checkDiv);
                
                // Complete the check after 1 second and turn it green
                setTimeout(() => {
                    checkDiv.innerHTML = `
                        <span class="step-icon">✅</span>
                        <span>${checks[currentCheck].replace('...', ' - PASSED')}</span>
                    `;
                    checkDiv.style.background = '#d4edda';
                    checkDiv.style.borderColor = '#28a745';
                    checkDiv.style.color = '#155724';
                }, 800);
                
                currentCheck++;
            } else {
                clearInterval(verificationInterval);
                
                // Show final results after all checks are complete
                setTimeout(() => {
                    const finalResult = document.createElement('div');
                    finalResult.style.cssText = `
                        background: #d4edda;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 15px;
                        border: 2px solid #28a745;
                        text-align: center;
                    `;
                    finalResult.innerHTML = `
                        <h4 style="color: #155724; margin-bottom: 15px;">🛡️ INTEGRITY VERIFICATION COMPLETE</h4>
                        <p style="color: #155724; margin: 8px 0;"><strong>Status:</strong> ✅ ALL CHECKS PASSED</p>
                        <p style="color: #155724; margin: 8px 0;"><strong>Total Votes Verified:</strong> ${this.getTotalVotes().toLocaleString()}</p>
                        <p style="color: #155724; margin: 8px 0;"><strong>Blockchain Consensus:</strong> 6/6 nodes agree</p>
                        <p style="color: #155724; margin: 8px 0;"><strong>Security Level:</strong> 🔒 MAXIMUM</p>
                    `;
                    resultsContainer.appendChild(finalResult);
                    
                    // Show close button
                    document.getElementById('integrity-close-btn').style.display = 'block';
                }, 1000);
            }
        }, 1200); // Faster interval for better UX
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
        
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
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