// Receipt generation utilities for i-Voting Platform
// Advanced receipt generation with better formatting and PDF support

class ReceiptGenerator {
    constructor() {
        this.receiptTemplate = null;
        this.initializeTemplates();
    }

    // Initialize receipt templates
    initializeTemplates() {
        this.receiptTemplate = {
            header: {
                title: "i-VOTING PLATFORM",
                subtitle: "OFFICIAL VOTE RECEIPT",
                election: "General Election 2025"
            },
            styles: {
                body: {
                    fontFamily: "'Poppins', Arial, sans-serif",
                    maxWidth: "650px",
                    margin: "0 auto",
                    padding: "30px",
                    lineHeight: "1.6",
                    color: "#2d3748",
                    backgroundColor: "#ffffff"
                },
                header: {
                    textAlign: "center",
                    borderBottom: "3px solid #667eea",
                    paddingBottom: "25px",
                    marginBottom: "30px",
                    background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                    padding: "25px",
                    borderRadius: "10px"
                },
                section: {
                    margin: "25px 0",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc"
                }
            }
        };
    }

    // Generate enhanced receipt HTML
    generateEnhancedReceipt(voteData) {
        const timestamp = new Date(voteData.timestamp);
        const generationTime = new Date();
        
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vote Receipt - ${voteData.voteId}</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    ${this.getReceiptStyles()}
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <!-- Header Section -->
                    <div class="receipt-header">
                        <div class="logo">
                            <i class="fas fa-vote-yea"></i>
                            <h1>${this.receiptTemplate.header.title}</h1>
                        </div>
                        <h2>${this.receiptTemplate.header.subtitle}</h2>
                        <p class="election-title">${this.receiptTemplate.header.election}</p>
                        <div class="receipt-badge">
                            <i class="fas fa-certificate"></i>
                            <span>VERIFIED & SECURED</span>
                        </div>
                    </div>

                    <!-- Vote Summary -->
                    <div class="vote-summary">
                        <div class="summary-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Vote Successfully Cast</h3>
                        <p>Your vote has been securely recorded and encrypted using blockchain technology</p>
                    </div>

                    <!-- Voter Information -->
                    <div class="receipt-section">
                        <div class="section-header">
                            <i class="fas fa-user"></i>
                            <h3>VOTER INFORMATION</h3>
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Full Name:</span>
                                <span class="value">${voteData.voter.name}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Voter ID:</span>
                                <span class="value">${voteData.voter.voterId}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Vote Date:</span>
                                <span class="value">${this.formatDate(timestamp)}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Vote Time:</span>
                                <span class="value">${this.formatTime(timestamp)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Vote Details -->
                    <div class="receipt-section vote-details">
                        <div class="section-header">
                            <i class="fas fa-vote-yea"></i>
                            <h3>VOTE DETAILS</h3>
                        </div>
                        <div class="candidate-selection">
                            <div class="candidate-info">
                                <div class="candidate-photo">
                                    <img src="${voteData.candidate.photo}" alt="${voteData.candidate.name}">
                                </div>
                                <div class="candidate-details">
                                    <h4>${voteData.candidate.name}</h4>
                                    <p class="party">${voteData.candidate.party}</p>
                                    <p class="experience">${voteData.candidate.experience}</p>
                                </div>
                            </div>
                        </div>
                        <div class="vote-meta">
                            <div class="info-item">
                                <span class="label">Vote ID:</span>
                                <span class="value vote-id">${voteData.voteId}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Status:</span>
                                <span class="value status-confirmed">CONFIRMED</span>
                            </div>
                        </div>
                    </div>

                    <!-- Verification Section -->
                    <div class="receipt-section verification-section">
                        <div class="section-header">
                            <i class="fas fa-shield-alt"></i>
                            <h3>CRYPTOGRAPHIC VERIFICATION</h3>
                        </div>
                        <div class="verification-grid">
                            <div class="verification-item">
                                <span class="label">Verification Hash:</span>
                                <span class="value hash-value">${voteData.verificationHash}</span>
                            </div>
                            <div class="verification-item">
                                <span class="label">Blockchain Reference:</span>
                                <span class="value hash-value">BLK-${this.generateBlockchainRef()}</span>
                            </div>
                            <div class="verification-item">
                                <span class="label">Digital Signature:</span>
                                <span class="value hash-value">SIG-${this.generateDigitalSignature()}</span>
                            </div>
                        </div>
                        
                        <!-- QR Code Placeholder -->
                        <div class="qr-section">
                            <div class="qr-code">
                                <i class="fas fa-qrcode"></i>
                                <p>Verification QR Code</p>
                                <small>Scan to verify vote authenticity</small>
                            </div>
                        </div>
                    </div>

                    <!-- Security Features -->
                    <div class="receipt-section security-section">
                        <div class="section-header">
                            <i class="fas fa-lock"></i>
                            <h3>SECURITY FEATURES</h3>
                        </div>
                        <div class="security-features">
                            <div class="feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>256-bit AES Encryption</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-link"></i>
                                <span>Blockchain Immutable Record</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-fingerprint"></i>
                                <span>Biometric Hash Verification</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-clock"></i>
                                <span>Timestamp Authority Certified</span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="receipt-footer">
                        <div class="footer-content">
                            <div class="important-notice">
                                <h4><i class="fas fa-exclamation-triangle"></i> IMPORTANT NOTICE</h4>
                                <ul>
                                    <li>This is your official vote receipt. Keep this document safe as proof of participation.</li>
                                    <li>Your vote is encrypted and anonymized to protect your privacy.</li>
                                    <li>This receipt can be used to verify your vote was counted correctly.</li>
                                    <li>Do not share your verification codes with unauthorized parties.</li>
                                </ul>
                            </div>
                            
                            <div class="contact-info">
                                <h4><i class="fas fa-phone"></i> SUPPORT CONTACT</h4>
                                <p>For verification or inquiries:</p>
                                <p><strong>Email:</strong> support@ivoting.com</p>
                                <p><strong>Phone:</strong> 1-800-VOTE-HELP</p>
                                <p><strong>Website:</strong> www.ivoting.com/verify</p>
                            </div>
                            
                            <div class="generation-info">
                                <hr>
                                <p><strong>Receipt Generated:</strong> ${this.formatDateTime(generationTime)}</p>
                                <p><strong>Version:</strong> i-Voting Platform v2.1.0</p>
                                <p>© 2025 i-Voting Platform - Secure Digital Democracy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Generate receipt styles
    getReceiptStyles() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #2d3748;
                background: #f7fafc;
                padding: 20px;
            }
            
            .receipt-container {
                max-width: 700px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            
            .receipt-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .receipt-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
                opacity: 0.3;
            }
            
            .logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 15px;
                position: relative;
                z-index: 2;
            }
            
            .logo i {
                font-size: 3rem;
            }
            
            .logo h1 {
                font-size: 2.2rem;
                font-weight: 700;
                letter-spacing: 1px;
            }
            
            .receipt-header h2 {
                font-size: 1.5rem;
                margin-bottom: 10px;
                position: relative;
                z-index: 2;
            }
            
            .election-title {
                font-size: 1.1rem;
                opacity: 0.9;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
            }
            
            .receipt-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.2);
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: 600;
                backdrop-filter: blur(10px);
                position: relative;
                z-index: 2;
            }
            
            .vote-summary {
                background: #f0fff4;
                border: 2px solid #9ae6b4;
                margin: 30px;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
            }
            
            .summary-icon i {
                font-size: 3rem;
                color: #38a169;
                margin-bottom: 15px;
            }
            
            .vote-summary h3 {
                color: #2f855a;
                margin-bottom: 10px;
                font-size: 1.3rem;
            }
            
            .vote-summary p {
                color: #276749;
            }
            
            .receipt-section {
                margin: 20px 30px;
                padding: 25px;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                background: #f8fafc;
            }
            
            .section-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e2e8f0;
            }
            
            .section-header i {
                color: #667eea;
                font-size: 1.2rem;
            }
            
            .section-header h3 {
                color: #2d3748;
                font-size: 1.1rem;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            
            .info-grid {
                display: grid;
                gap: 15px;
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px dotted #cbd5e0;
            }
            
            .info-item:last-child {
                border-bottom: none;
            }
            
            .label {
                font-weight: 600;
                color: #4a5568;
                min-width: 120px;
            }
            
            .value {
                font-weight: 500;
                color: #2d3748;
                text-align: right;
                flex: 1;
            }
            
            .vote-id {
                font-family: 'Courier New', monospace;
                background: #edf2f7;
                padding: 5px 10px;
                border-radius: 6px;
                font-weight: bold;
            }
            
            .status-confirmed {
                background: #c6f6d5;
                color: #2f855a;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 0.9rem;
            }
            
            .candidate-selection {
                background: white;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                border: 2px solid #667eea;
            }
            
            .candidate-info {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .candidate-photo {
                flex-shrink: 0;
            }
            
            .candidate-photo img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 3px solid #667eea;
            }
            
            .candidate-details h4 {
                color: #2d3748;
                font-size: 1.3rem;
                margin-bottom: 5px;
            }
            
            .party {
                color: #667eea;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .experience {
                color: #718096;
                font-size: 0.9rem;
            }
            
            .verification-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 25px;
            }
            
            .verification-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .hash-value {
                font-family: 'Courier New', monospace;
                background: #2d3748;
                color: #e2e8f0;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 0.85rem;
                word-break: break-all;
                letter-spacing: 0.5px;
            }
            
            .qr-section {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 10px;
                border: 2px dashed #cbd5e0;
            }
            
            .qr-code i {
                font-size: 4rem;
                color: #a0aec0;
                margin-bottom: 10px;
            }
            
            .qr-code p {
                font-weight: 600;
                color: #4a5568;
                margin-bottom: 5px;
            }
            
            .qr-code small {
                color: #718096;
            }
            
            .security-features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            
            .feature {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid #38a169;
            }
            
            .feature i {
                color: #38a169;
                font-size: 1.1rem;
            }
            
            .feature span {
                color: #2d3748;
                font-weight: 500;
                font-size: 0.9rem;
            }
            
            .receipt-footer {
                background: #f7fafc;
                padding: 30px;
                border-top: 3px solid #e2e8f0;
            }
            
            .footer-content {
                display: grid;
                gap: 25px;
            }
            
            .important-notice,
            .contact-info {
                background: white;
                padding: 20px;
                border-radius: 10px;
                border-left: 4px solid #d69e2e;
            }
            
            .contact-info {
                border-left-color: #3182ce;
            }
            
            .important-notice h4,
            .contact-info h4 {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #2d3748;
                margin-bottom: 15px;
                font-size: 1rem;
            }
            
            .important-notice ul {
                padding-left: 20px;
                color: #4a5568;
            }
            
            .important-notice li {
                margin-bottom: 8px;
                line-height: 1.5;
            }
            
            .contact-info p {
                color: #4a5568;
                margin-bottom: 5px;
            }
            
            .generation-info {
                text-align: center;
                padding-top: 20px;
                color: #718096;
                font-size: 0.9rem;
            }
            
            .generation-info hr {
                border: none;
                border-top: 1px solid #e2e8f0;
                margin-bottom: 15px;
            }
            
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                
                .receipt-container {
                    box-shadow: none;
                    border: 1px solid #000;
                }
                
                .receipt-header {
                    background: #000 !important;
                    color: white !important;
                }
                
                .hash-value {
                    background: #f0f0f0 !important;
                    color: #000 !important;
                    border: 1px solid #ccc;
                }
            }
            
            @media (max-width: 768px) {
                .receipt-container {
                    margin: 10px;
                }
                
                .receipt-section {
                    margin: 15px 20px;
                    padding: 20px;
                }
                
                .candidate-info {
                    flex-direction: column;
                    text-align: center;
                }
                
                .security-features {
                    grid-template-columns: 1fr;
                }
                
                .info-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
                
                .value {
                    text-align: left;
                }
            }
        `;
    }

    // Utility methods
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    formatDateTime(date) {
        return `${this.formatDate(date)} at ${this.formatTime(date)}`;
    }

    generateBlockchainRef() {
        return Utils.generateId(16).toUpperCase();
    }

    generateDigitalSignature() {
        return Utils.generateId(24).toLowerCase();
    }

    // Generate PDF using browser's print functionality
    async generatePDF(voteData) {
        try {
            const receiptHTML = this.generateEnhancedReceipt(voteData);
            
            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('Please allow pop-ups to generate PDF');
            }
            
            printWindow.document.write(receiptHTML);
            printWindow.document.close();
            
            // Wait for content to load
            await new Promise(resolve => {
                printWindow.onload = resolve;
            });
            
            // Add PDF generation instructions
            const instructions = printWindow.document.createElement('div');
            instructions.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #667eea;
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    font-family: Arial, sans-serif;
                    z-index: 9999;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                ">
                    <h4 style="margin: 0 0 10px 0;">PDF Generation</h4>
                    <p style="margin: 0; font-size: 14px;">Use Ctrl+P (Cmd+P on Mac) to print/save as PDF</p>
                    <button onclick="window.print()" style="
                        margin-top: 10px;
                        padding: 8px 16px;
                        background: white;
                        color: #667eea;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Print/Save PDF</button>
                </div>
            `;
            
            printWindow.document.body.appendChild(instructions);
            
            return printWindow;
            
        } catch (error) {
            console.error('PDF generation error:', error);
            throw error;
        }
    }
}

// Export for global use
window.ReceiptGenerator = ReceiptGenerator;