class LightningRAGFrontend {
    constructor() {
        this.currentFile = null;
        this.isProcessing = false;

        
        this.backendUrl = 'https://Krishna2908-rag-query-retrival.hf.space';

        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.createCursorGlow();
        this.initNeuralNetwork();
        this.setupScrollAnimations();
        this.checkBackendConnection();
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.backendUrl}/`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });
            
            if (response.ok) {
                console.log('Connected to HF Space backend successfully');
                this.showToast('Connected to Backend!', 'success');
            } else {
                throw new Error('Backend not responding correctly');
            }
        } catch (error) {
            console.error('Failed to connect to backend:', error);
            this.showToast('Backend connection failed. Check if HF Space is running.', 'error');
        }
    }

    setupElements() {
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.removeFileBtn = document.getElementById('removeFile');
        this.questionInput = document.getElementById('questionInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.responseSection = document.getElementById('responseSection');
        this.responseContent = document.getElementById('responseContent');
        this.answerText = document.getElementById('answerText');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.uploadCard = document.getElementById('uploadCard');
        this.suggestedQuestions = document.getElementById('suggestedQuestions');
        this.toastContainer = document.getElementById('toastContainer');
    }

    setupEventListeners() {
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', e => this.handleFileUpload(e));
        this.removeFileBtn.addEventListener('click', () => this.removeFile());
        this.sendBtn.addEventListener('click', () => this.submitQuery());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearResponse());
        
        this.questionInput.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitQuery();
            }
        });

        this.questionInput.addEventListener('input', () => this.updateSendButtonState());

        // Suggested questions
        document.querySelectorAll('.question-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                this.questionInput.value = pill.textContent;
                this.updateSendButtonState();
            });
        });

        // Drag and drop support
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const uploadCard = this.uploadCard;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadCard.addEventListener(eventName, e => e.preventDefault());
        });

        uploadCard.addEventListener('dragover', () => {
            uploadCard.classList.add('drag-over');
        });

        uploadCard.addEventListener('dragleave', () => {
            uploadCard.classList.remove('drag-over');
        });

        uploadCard.addEventListener('drop', e => {
            uploadCard.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        this.handleFile(file);
    }

    handleFile(file) {
        if (!file) return;

        const allowedTypes = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.txt', '.csv'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            this.showToast('Unsupported file type. Please upload PDF, DOCX, XLSX, TXT, or CSV files.', 'error');
            return;
        }

        this.currentFile = file;
        this.fileName.textContent = file.name;
        this.fileInfo.style.display = 'block';
        this.uploadCard.classList.add('has-file');
        this.updateSendButtonState();
        this.showToast('File uploaded successfully!', 'success');
    }

    removeFile() {
        this.currentFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadCard.classList.remove('has-file');
        this.updateSendButtonState();
    }

    async submitQuery() {
        if (!this.currentFile || !this.questionInput.value.trim() || this.isProcessing) {
            if (!this.currentFile) this.showToast('Please upload a document first', 'error');
            if (!this.questionInput.value.trim()) this.showToast('Please enter a question', 'error');
            return;
        }

        const question = this.questionInput.value.trim();
        this.isProcessing = true;

        this.showLoadingOverlay();
        this.showResponseSection();
        this.showTypingIndicator();
        this.updateStatus('Processing your query...', 'processing');
        this.updateSendButtonState();

        try {
            const formData = new FormData();
            formData.append('file', this.currentFile);
            formData.append('question', question);

            const response = await fetch(`${this.backendUrl}/api/query`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status === 'success') {
                this.hideLoadingOverlay();
                this.hideTypingIndicator();
                this.showAnswer(result.answer);
                this.updateStatus('Query completed successfully', 'success');
                this.showToast('Answer generated successfully!', 'success');
            } else {
                throw new Error(result.detail || 'Unknown error occurred');
            }

        } catch (error) {
            console.error('Query error:', error);
            this.hideLoadingOverlay();
            this.hideTypingIndicator();
            
            let errorMessage = 'Sorry, there was an error processing your query. ';
            
            if (error.message.includes('fetch')) {
                errorMessage += 'Please make sure the backend server is running on port 7860.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            this.showAnswer(errorMessage);
            this.updateStatus('Error occurred', 'error');
            this.showToast('Query failed. Check console for details.', 'error');
        } finally {
            this.isProcessing = false;
            this.updateSendButtonState();
        }
    }

    // UI Helper Methods
    showLoadingOverlay() {
        this.loadingOverlay.style.display = 'flex';
        this.loadingOverlay.classList.add('show');
    }

    hideLoadingOverlay() {
        this.loadingOverlay.style.display = 'none';
        this.loadingOverlay.classList.remove('show');
    }

    showResponseSection() {
        this.responseSection.style.display = 'block';
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        if (this.answerText) {
            this.answerText.style.display = 'none';
        }
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
        if (this.answerText) {
            this.answerText.style.display = 'block';
            this.answerText.classList.add('show');
        }
    }

    showAnswer(answer) {
        this.answerText.textContent = answer;
    }

    updateStatus(text, status) {
        const statusSpan = this.statusIndicator.querySelector('span');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        if (statusSpan) statusSpan.textContent = text;
        
        if (statusDot) {
            statusDot.style.background = status === 'success' ? 'var(--success)' : 
                                       status === 'error' ? 'var(--error)' : 
                                       status === 'processing' ? 'var(--warning)' : 'var(--success)';
        }
    }

    updateSendButtonState() {
        const canSend = this.currentFile && this.questionInput.value.trim() && !this.isProcessing;
        this.sendBtn.disabled = !canSend;
        
        if (this.isProcessing) {
            this.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            this.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }

    copyToClipboard() {
        if (this.answerText.textContent) {
            navigator.clipboard.writeText(this.answerText.textContent).then(() => {
                this.showToast('Answer copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Failed to copy to clipboard', 'error');
            });
        }
    }

    clearResponse() {
        this.answerText.textContent = '';
        this.responseSection.style.display = 'none';
        this.updateStatus('Ready', 'success');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Visual Effects Methods
    createCursorGlow() {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        document.body.appendChild(cursorGlow);

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    initNeuralNetwork() {
        const canvas = document.getElementById('neural-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const nodes = [];
        const nodeCount = 50;

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off walls
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
                ctx.fill();
            });

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LightningRAGFrontend();
});

// Global function for suggested question pills (if needed)
function setQuestion(question) {
    const questionInput = document.getElementById('questionInput');
    if (questionInput) {
        questionInput.value = question;
        questionInput.focus();
        // Trigger input event to update send button state
        questionInput.dispatchEvent(new Event('input'));
    }
}
