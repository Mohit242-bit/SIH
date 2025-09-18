// Success page functionality for i-Voting Platform
// Handles vote confirmation display and receipt generation

class VoteSuccessHandler {
    constructor() {
        this.voteData = null;
        this.currentUser = null;
        
        this.init();
    }

    // Initialize success page
    init() {
        this.currentUser = Session.getCurrentUser();
        this.voteData = Utils.getData(STORAGE_KEYS.VOTE_DATA);

        if (!this.currentUser || !this.voteData) {
            Utils.showNotification('No vote data found. Redirecting to login.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        this.displayVoteDetails();
        this.initializeEventListeners();
    }

    // Display vote details on the page
    displayVoteDetails() {
        // Update voter name
        const voterNameElement = document.getElementById('voterName');
        if (voterNameElement) {
            voterNameElement.textContent = this.voteData.voter.name;
        }

        // Update vote date and time
        const voteDateTimeElement = document.getElementById('voteDateTime');
        if (voteDateTimeElement) {
            const voteDate = new Date(this.voteData.timestamp);
            voteDateTimeElement.textContent = Utils.formatDateTime(voteDate);
        }

        // Update selected candidate
        const selectedCandidateElement = document.getElementById('selectedCandidate');
        if (selectedCandidateElement) {
            selectedCandidateElement.textContent = this.voteData.candidate.name;
        }

        // Update vote ID
        const voteIdElement = document.getElementById('voteId');
        if (voteIdElement) {
            voteIdElement.textContent = this.voteData.voteId;
        }

        // Update verification hash
        const verificationHashElement = document.getElementById('verificationHash');
        if (verificationHashElement) {
            verificationHashElement.textContent = this.voteData.verificationHash;
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Download receipt button
        const downloadButton = document.querySelector('button[onclick="downloadReceipt()"]');
        if (downloadButton) {
            downloadButton.addEventListener('click', this.downloadReceipt.bind(this));
        }

        // Print receipt button
        const printButton = document.querySelector('button[onclick="printReceipt()"]');
        if (printButton) {
            printButton.addEventListener('click', this.printReceipt.bind(this));
        }

        // View results button
        const resultsButton = document.querySelector('button[onclick="viewResults()"]');
        if (resultsButton) {
            resultsButton.addEventListener('click', this.viewResults.bind(this));
        }

        // Return home button
        const homeButton = document.querySelector('button[onclick="goHome()"]');
        if (homeButton) {
            homeButton.addEventListener('click', this.goHome.bind(this));
        }
    }

    // Generate receipt content
    generateReceiptContent() {
        const receiptDate = new Date(this.voteData.timestamp);
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vote Receipt - ${this.voteData.voteId}</title>
                <style>
                    body { 
                        font-family: 'Courier New', monospace; 
                        max-width: 600px; 
                        margin: 0 auto; 
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header { 
                        text-align: center; 
                        border-bottom: 2px solid #000; 
                        padding-bottom: 20px; 
                        margin-bottom: 20px;
                    }
                    .logo { 
                        font-size: 24px; 
                        font-weight: bold; 
                        margin-bottom: 10px;
                    }
                    .section { 
                        margin: 20px 0; 
                        padding: 15px; 
                        border: 1px solid #ccc; 
                        background: #f9f9f9;
                    }
                    .row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 10px 0; 
                        border-bottom: 1px dotted #ccc;
                        padding-bottom: 5px;
                    }
                    .label { 
                        font-weight: bold; 
                    }
                    .value { 
                        text-align: right; 
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 30px; 
                        padding-top: 20px; 
                        border-top: 2px solid #000;
                        font-size: 12px;
                    }
                    .qr-placeholder {
                        width: 100px;
                        height: 100px;
                        border: 2px solid #000;
                        margin: 20px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f0f0f0;
                    }
                    @media print {
                        body { margin: 0; padding: 10px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🗳️ i-VOTING PLATFORM</div>
                    <h2>OFFICIAL VOTE RECEIPT</h2>
                    <p>General Election 2025</p>
                </div>

                <div class="section">
                    <h3>VOTER INFORMATION</h3>
                    <div class="row">
                        <span class="label">Voter Name:</span>
                        <span class="value">${this.voteData.voter.name}</span>
                    </div>
                    <div class="row">
                        <span class="label">Voter ID:</span>
                        <span class="value">${this.voteData.voter.voterId}</span>
                    </div>
                    <div class="row">
                        <span class="label">Vote Date:</span>
                        <span class="value">${receiptDate.toLocaleDateString()}</span>
                    </div>
                    <div class="row">
                        <span class="label">Vote Time:</span>
                        <span class="value">${receiptDate.toLocaleTimeString()}</span>
                    </div>
                </div>

                <div class="section">
                    <h3>VOTE DETAILS</h3>
                    <div class="row">
                        <span class="label">Vote ID:</span>
                        <span class="value">${this.voteData.voteId}</span>
                    </div>
                    <div class="row">
                        <span class="label">Selected Candidate:</span>
                        <span class="value">${this.voteData.candidate.name}</span>
                    </div>
                    <div class="row">
                        <span class="label">Party:</span>
                        <span class="value">${this.voteData.candidate.party}</span>
                    </div>
                    <div class="row">
                        <span class="label">Vote Status:</span>
                        <span class="value">CONFIRMED</span>
                    </div>
                </div>

                <div class="section">
                    <h3>VERIFICATION</h3>
                    <div class="row">
                        <span class="label">Verification Hash:</span>
                        <span class="value">${this.voteData.verificationHash}</span>
                    </div>
                    <div class="row">
                        <span class="label">Blockchain Reference:</span>
                        <span class="value">BLK-${Utils.generateId(12)}</span>
                    </div>
                    <div class="qr-placeholder">
                        <small>QR Code<br>Placeholder</small>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>IMPORTANT NOTICE</strong></p>
                    <p>This is your official vote receipt. Keep this document safe as proof of your participation in the election.</p>
                    <p>Your vote is encrypted and secured using blockchain technology.</p>
                    <p>For verification or inquiries, contact: support@ivoting.com</p>
                    <hr>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>i-Voting Platform © 2025 - Secure Digital Democracy</p>
                </div>
            </body>
            </html>
        `;
    }

    // Download receipt as PDF (simplified version)
    async downloadReceipt() {
        try {
            Utils.showNotification('Generating receipt...', 'success');
            
            // Create receipt content
            const receiptContent = this.generateReceiptContent();
            
            // Create a blob with the HTML content
            const blob = new Blob([receiptContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `Vote_Receipt_${this.voteData.voteId}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            Utils.showNotification('Receipt downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            Utils.showNotification('Error downloading receipt. Please try again.', 'error');
        }
    }

    // Print receipt
    printReceipt() {
        try {
            // Create a new window with the receipt content
            const receiptContent = this.generateReceiptContent();
            const printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                Utils.showNotification('Please allow pop-ups to print the receipt', 'error');
                return;
            }
            
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            
            // Wait for content to load, then print
            printWindow.onload = () => {
                printWindow.print();
                
                // Close window after printing
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            };
            
            Utils.showNotification('Opening print dialog...', 'success');
            
        } catch (error) {
            console.error('Print error:', error);
            Utils.showNotification('Error printing receipt. Please try again.', 'error');
        }
    }

    // View live results (mock functionality)
    viewResults() {
        Utils.showNotification('Live results will be available after voting closes', 'success');
        
        // In a real application, this would redirect to a results page
        // For demo purposes, we'll show a mock results modal
        this.showMockResults();
    }

    // Show mock results
    showMockResults() {
        const mockResults = {
            'John Anderson': 45.2,
            'Sarah Mitchell': 38.7,
            'Michael Rodriguez': 16.1
        };

        let resultsHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 1000;
                min-width: 400px;
            ">
                <h3 style="text-align: center; margin-bottom: 20px; color: #2d3748;">
                    <i class="fas fa-chart-bar"></i> Preliminary Results
                </h3>
        `;

        Object.entries(mockResults).forEach(([candidate, percentage]) => {
            resultsHTML += `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-weight: 500;">${candidate}</span>
                        <span style="color: #667eea; font-weight: 600;">${percentage}%</span>
                    </div>
                    <div style="background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            height: 100%;
                            width: ${percentage}%;
                            transition: width 1s ease;
                        "></div>
                    </div>
                </div>
            `;
        });

        resultsHTML += `
                <p style="text-align: center; color: #718096; font-size: 0.9rem; margin-top: 20px;">
                    <i class="fas fa-info-circle"></i> Results are preliminary and subject to change
                </p>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    padding: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 15px;
                    font-weight: 500;
                ">Close</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999;
            " onclick="this.nextElementSibling.remove(); this.remove();"></div>
        `;

        const resultsModal = document.createElement('div');
        resultsModal.innerHTML = resultsHTML;
        document.body.appendChild(resultsModal);
    }

    // Return to home page
    goHome() {
        if (confirm('Are you sure you want to return to the home page?')) {
            window.location.href = 'index.html';
        }
    }

    // Show receipt modal
    showReceiptModal() {
        const modal = document.getElementById('receiptModal');
        const receiptContent = document.getElementById('receiptContent');
        
        if (modal && receiptContent) {
            receiptContent.innerHTML = this.generateReceiptContent();
            modal.style.display = 'block';
        }
    }

    // Close receipt modal
    closeReceiptModal() {
        const modal = document.getElementById('receiptModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Global functions
function downloadReceipt() {
    if (window.voteSuccessHandler) {
        window.voteSuccessHandler.downloadReceipt();
    }
}

function printReceipt() {
    if (window.voteSuccessHandler) {
        window.voteSuccessHandler.printReceipt();
    }
}

function viewResults() {
    if (window.voteSuccessHandler) {
        window.voteSuccessHandler.viewResults();
    }
}

function goHome() {
    if (window.voteSuccessHandler) {
        window.voteSuccessHandler.goHome();
    }
}

function closeReceiptModal() {
    if (window.voteSuccessHandler) {
        window.voteSuccessHandler.closeReceiptModal();
    }
}

// Initialize success handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on success page
    if (window.location.pathname.includes('success.html')) {
        window.voteSuccessHandler = new VoteSuccessHandler();
        
        // Handle modal interactions
        const modal = document.getElementById('receiptModal');
        if (modal) {
            // Close modal on escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && modal.style.display === 'block') {
                    closeReceiptModal();
                }
            });

            // Close modal on backdrop click
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeReceiptModal();
                }
            });
        }

        // Add celebration animation
        setTimeout(() => {
            const checkmarkCircle = document.querySelector('.checkmark-circle');
            if (checkmarkCircle) {
                checkmarkCircle.style.animation = 'successPulse 2s ease infinite';
            }
        }, 500);
    }
});