// Enhanced Student Portal - Main JavaScript
// GitHub Pages Optimized Version

class EnhancedPortal {
    constructor(accountsData, schoolConfig) {
        this.accounts = accountsData || {};
        this.schoolConfig = schoolConfig || {};
        this.currentUser = null;
        this.currentSchool = {
            id: 'default',
            name: 'Scholastic Academy'
        };
        this.stream = null;
        this.currentReportUrl = null;
        
        // DOM Elements
        this.elements = {
            schoolSelectionPage: document.getElementById('schoolSelectionPage'),
            loginPage: document.getElementById('loginPage'),
            dashboard: document.getElementById('dashboard'),
            loginForm: document.getElementById('loginForm'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            qrScannerBtn: document.getElementById('qrScannerBtn'),
            cameraContainer: document.getElementById('cameraContainer'),
            qrVideo: document.getElementById('qrVideo'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            switchSchoolBtn: document.getElementById('switchSchoolBtn'),
            switchSchoolDashboardBtn: document.getElementById('switchSchoolDashboardBtn'),
            
            // Dashboard elements
            welcomeName: document.getElementById('welcomeName'),
            welcomeSchool: document.getElementById('welcomeSchool'),
            studentStatus: document.getElementById('studentStatus'),
            profileGrid: document.getElementById('profileGrid'),
            studentQR: document.getElementById('studentQR'),
            dynamicQR: document.getElementById('dynamicQR'),
            currentSchoolName: document.getElementById('currentSchoolName'),
            currentSchoolId: document.getElementById('currentSchoolId'),
            currentSchoolBadge: document.getElementById('currentSchoolBadge'),
            dashboardSchoolBadge: document.getElementById('dashboardSchoolBadge'),
            selectedSchoolName: document.getElementById('selectedSchoolName'),
            
            // Report elements
            reportSection: document.getElementById('reportSection'),
            reportImage: document.getElementById('reportImage'),
            reportLoading: document.getElementById('reportLoading'),
            noReportMessage: document.getElementById('noReportMessage'),
            downloadReportBtn: document.getElementById('downloadReportBtn'),
            viewReportBtn: document.getElementById('viewReportBtn'),
            
            // Sections
            welcomeSection: document.getElementById('welcomeSection'),
            profileSection: document.getElementById('profileSection'),
            
            // Buttons
            logoutBtn: document.getElementById('logoutBtn'),
            refreshBtn: document.getElementById('refreshBtn'),
            printBtn: document.getElementById('printBtn')
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSidebarNavigation();
        this.loadAvailableSchools();
        this.handleAutoLogin();
        
        // Force light theme
        this.forceLightTheme();
    }
    
    forceLightTheme() {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.add('light-theme');
        
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = '#f8fafc';
        }
    }
    
    setupEventListeners() {
        const { loginForm, qrScannerBtn, stopCameraBtn, switchSchoolBtn, 
                switchSchoolDashboardBtn, logoutBtn, refreshBtn, printBtn, 
                downloadReportBtn } = this.elements;
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (qrScannerBtn) {
            qrScannerBtn.addEventListener('click', () => this.toggleQRScanner());
        }
        
        if (stopCameraBtn) {
            stopCameraBtn.addEventListener('click', () => this.stopQRScanner());
        }
        
        if (switchSchoolBtn) {
            switchSchoolBtn.addEventListener('click', () => this.showSchoolSelection());
        }
        
        if (switchSchoolDashboardBtn) {
            switchSchoolDashboardBtn.addEventListener('click', () => this.showSchoolSelection());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printDashboard());
        }
        
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', () => this.downloadReport());
        }
        
        // View report button
        if (this.elements.viewReportBtn) {
            this.elements.viewReportBtn.addEventListener('click', () => this.showSection('report'));
        }
    }
    
    setupSidebarNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show selected section
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }
    
    loadAvailableSchools() {
        const schoolList = document.getElementById('schoolList');
        if (!schoolList) return;
        
        // Extract unique schools from accounts data
        const schools = new Set();
        Object.values(this.accounts).forEach(account => {
            if (account.school_id) {
                schools.add(account.school_id);
            }
        });
        
        schoolList.innerHTML = '';
        
        // Add default school option
        const defaultSchoolOption = this.createSchoolOption(
            this.currentSchool.id,
            this.currentSchool.name,
            'fas fa-graduation-cap'
        );
        schoolList.appendChild(defaultSchoolOption);
        
        // Add other schools
        schools.forEach(schoolId => {
            if (schoolId !== this.currentSchool.id) {
                const schoolOption = this.createSchoolOption(
                    schoolId,
                    `School ${schoolId}`,
                    'fas fa-school'
                );
                schoolList.appendChild(schoolOption);
            }
        });
    }
    
    createSchoolOption(schoolId, schoolName, iconClass) {
        const div = document.createElement('div');
        div.className = 'school-option';
        div.onclick = () => this.selectSchool(schoolId, schoolName);
        div.innerHTML = `
            <i class="${iconClass}"></i>
            <div class="school-info">
                <div class="school-name">${schoolName}</div>
                <div class="school-id">School ID: ${schoolId}</div>
            </div>
            <i class="fas fa-chevron-right"></i>
        `;
        return div;
    }
    
    selectSchool(schoolId, schoolName) {
        this.currentSchool = {
            id: schoolId,
            name: schoolName
        };
        
        // Update UI
        const { selectedSchoolName, currentSchoolName, currentSchoolId, 
                currentSchoolBadge, dashboardSchoolBadge, welcomeSchool } = this.elements;
        
        if (selectedSchoolName) selectedSchoolName.textContent = schoolName;
        if (currentSchoolName) currentSchoolName.textContent = schoolName;
        if (currentSchoolId) currentSchoolId.textContent = schoolId;
        if (currentSchoolBadge) {
            currentSchoolBadge.innerHTML = `<i class="fas fa-school"></i> School ID: <span>${schoolId}</span>`;
        }
        if (dashboardSchoolBadge) {
            dashboardSchoolBadge.innerHTML = `<i class="fas fa-school"></i> <span>${schoolId}</span>`;
        }
        if (welcomeSchool) welcomeSchool.textContent = schoolId;
        
        // Show login page
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'flex';
    }
    
    showSchoolSelection() {
        // Clear any current session
        this.currentUser = null;
        sessionStorage.removeItem('enhancedPortalUser');
        sessionStorage.removeItem('currentSchool');
        
        // Show school selection
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'none';
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'flex';
        
        // Clear login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }
    
    handleAutoLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const portalId = urlParams.get('portalId');
        const password = urlParams.get('password');
        const schoolId = urlParams.get('schoolId');
        const autoLogin = urlParams.get('autoLogin');
        
        if (schoolId) {
            this.selectSchool(schoolId, `School ${schoolId}`);
        }
        
        if (autoLogin === 'true' && portalId && password) {
            if (this.authenticateUser(portalId, password)) {
                window.history.replaceState(null, null, window.location.pathname);
            }
        }
        
        // Check session storage
        const sessionUser = sessionStorage.getItem('enhancedPortalUser');
        const sessionSchool = sessionStorage.getItem('currentSchool');
        
        if (sessionUser && sessionSchool) {
            this.currentUser = JSON.parse(sessionUser);
            this.currentSchool = JSON.parse(sessionSchool);
            this.showDashboard();
        }
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const portalId = document.getElementById('portalId')?.value.trim().toUpperCase();
        const password = document.getElementById('password')?.value;
        
        if (!portalId || !password) {
            this.showError('Please enter both Portal ID and password');
            return;
        }
        
        if (this.authenticateUser(portalId, password)) {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.reset();
            this.hideError();
        } else {
            this.showError('Invalid Portal ID or password. Please try again.');
        }
    }
    
    authenticateUser(portalId, password) {
        const account = this.accounts[portalId];
        
        if (account && account.password === password && account.school_id === this.currentSchool.id) {
            // Create user object without password for session storage
            const safeUserData = {
                portalId: portalId,
                student_id: account.student_id,
                name: account.name,
                class: account.class,
                stream: account.stream,
                gender: account.gender,
                email: account.email,
                school_id: account.school_id,
                qr_code: account.qr_code
            };
            
            this.currentUser = safeUserData;
            
            // Store in session (without password)
            sessionStorage.setItem('enhancedPortalUser', JSON.stringify(safeUserData));
            sessionStorage.setItem('currentSchool', JSON.stringify(this.currentSchool));
            
            // Show dashboard
            this.showDashboard();
            
            return true;
        }
        
        return false;
    }
    
    showError(message) {
        const { errorMessage, errorText } = this.elements;
        if (errorText) errorText.textContent = message;
        if (errorMessage) {
            errorMessage.style.display = 'flex';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.hideError();
            }, 5000);
        }
    }
    
    hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.style.display = 'none';
        }
    }
    
    showDashboard() {
        // Update welcome message
        const { welcomeName, welcomeSchool, studentStatus } = this.elements;
        if (welcomeName) welcomeName.textContent = this.currentUser.name;
        if (welcomeSchool) welcomeSchool.textContent = this.currentSchool.id;
        if (studentStatus) studentStatus.textContent = 'Active';
        
        // Load profile data
        this.loadProfileData();
        
        // Load QR code
        this.loadQRCode();
        
        // Check report availability
        this.checkReportAvailability();
        
        // Show dashboard
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'none';
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'block';
        
        // Show profile section by default
        this.showSection('profile');
    }
    
    showSection(section) {
        const { welcomeSection, profileSection, reportSection, viewReportBtn } = this.elements;
        
        // Hide all sections
        if (welcomeSection) welcomeSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'none';
        if (reportSection) reportSection.style.display = 'none';
        
        // Show selected section
        switch(section) {
            case 'profile':
                if (profileSection) profileSection.style.display = 'block';
                if (viewReportBtn) viewReportBtn.style.display = 'none';
                break;
            case 'report':
                if (reportSection) reportSection.style.display = 'block';
                if (viewReportBtn) viewReportBtn.style.display = 'none';
                this.loadReportImage();
                break;
            default:
                if (welcomeSection) welcomeSection.style.display = 'block';
                if (viewReportBtn) viewReportBtn.style.display = 'none';
        }
    }
    
    loadProfileData() {
        const user = this.currentUser;
        const account = this.accounts[user.portalId];
        
        if (!account) return;
        
        const profileGrid = document.getElementById('profileGrid');
        if (!profileGrid) return;
        
        // Format dates
        const formatDate = (dateStr) => {
            if (!dateStr) return 'N/A';
            try {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-GB');
            } catch {
                return dateStr;
            }
        };
        
        const personalInfo = `
            <div class="profile-card">
                <h3><i class="fas fa-user-circle"></i> Personal Information</h3>
                <div class="info-item">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">${account.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Student ID:</span>
                    <span class="info-value">${account.student_id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">School ID:</span>
                    <span class="info-value">${account.school_id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date of Birth:</span>
                    <span class="info-value">${formatDate(account.date_of_birth)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Gender:</span>
                    <span class="info-value">${account.gender || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${account.email || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${account.phone || 'N/A'}</span>
                </div>
            </div>
        `;
        
        const academicInfo = `
            <div class="profile-card">
                <h3><i class="fas fa-graduation-cap"></i> Academic Information</h3>
                <div class="info-item">
                    <span class="info-label">Class:</span>
                    <span class="info-value">${account.class}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Stream:</span>
                    <span class="info-value">${account.stream || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Enrollment Date:</span>
                    <span class="info-value">${formatDate(account.enrollment_date)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Sports:</span>
                    <span class="info-value">${account.sports || 'None'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Previous School:</span>
                    <span class="info-value">${account.previous_school || 'N/A'}</span>
                </div>
            </div>
        `;
        
        const contactInfo = `
            <div class="profile-card">
                <h3><i class="fas fa-address-book"></i> Contact & Medical</h3>
                <div class="info-item">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${account.address || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Emergency Contact:</span>
                    <span class="info-value">${account.emergency_contact || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Medical Information:</span>
                    <span class="info-value">${account.medical_info || 'None'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Notes:</span>
                    <span class="info-value">${account.notes || 'None'}</span>
                </div>
            </div>
        `;
        
        const portalInfo = `
            <div class="profile-card">
                <h3><i class="fas fa-key"></i> Portal Access</h3>
                <div class="info-item">
                    <span class="info-label">Portal ID:</span>
                    <span class="info-value">${user.portalId}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Password:</span>
                    <span class="info-value">••••••••</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Login URL:</span>
                    <span class="info-value">${window.location.origin}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">School:</span>
                    <span class="info-value">${this.schoolConfig.school_name || 'Scholastic Academy'}</span>
                </div>
                <button class="btn" onclick="portal.showCredentials()" style="margin-top: 15px; width: 100%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white;">
                    <i class="fas fa-eye"></i> Show Credentials
                </button>
            </div>
        `;
        
        profileGrid.innerHTML = personalInfo + academicInfo + contactInfo + portalInfo;
    }
    
    loadQRCode() {
        const user = this.currentUser;
        const account = this.accounts[user.portalId];
        
        if (!account) return;
        
        // Generate QR data for current URL
        const qrData = `${window.location.origin}${window.location.pathname}?portalId=${user.portalId}&schoolId=${user.school_id}&autoLogin=true`;
        
        // Generate QR code for sidebar
        const dynamicQR = document.getElementById('dynamicQR');
        if (dynamicQR && typeof QRCode !== 'undefined') {
            QRCode.toCanvas(dynamicQR, qrData, {
                width: 150,
                height: 150,
                margin: 1,
                color: {
                    dark: '#374151',
                    light: '#ffffff'
                }
            }, function(error) {
                if (error) console.error('QR Code generation error:', error);
            });
        }
        
        // Set main QR code if available
        const studentQR = document.getElementById('studentQR');
        if (studentQR && account.qr_code) {
            studentQR.src = `data:image/png;base64,${account.qr_code}`;
            studentQR.style.display = 'block';
        }
    }
    
    checkReportAvailability() {
        const user = this.currentUser;
        if (!user || !user.student_id) return;
        
        // Report image URLs to try (relative paths for GitHub Pages)
        const reportUrls = [
            `./reports/${user.student_id}.png`,
            `../reports/${user.student_id}.png`,
            `https://hvstechzw.github.io/Scholastic-Services-Web-Portal/reports/${user.student_id}.png`
        ];
        
        // Check if any report exists
        const checkImage = (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => resolve(null);
                img.src = url;
            });
        };
        
        // Try all URLs
        Promise.all(reportUrls.map(checkImage)).then(results => {
            const availableUrl = results.find(url => url !== null);
            if (availableUrl) {
                this.currentReportUrl = availableUrl;
                const viewReportBtn = document.getElementById('viewReportBtn');
                if (viewReportBtn) viewReportBtn.style.display = 'inline-flex';
            }
        });
    }
    
    loadReportImage() {
        const { reportImage, reportLoading, noReportMessage, downloadReportBtn } = this.elements;
        
        if (!this.currentReportUrl) {
            if (reportLoading) reportLoading.style.display = 'none';
            if (noReportMessage) noReportMessage.style.display = 'block';
            if (downloadReportBtn) downloadReportBtn.style.display = 'none';
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            if (reportImage) {
                reportImage.src = this.currentReportUrl;
                reportImage.style.display = 'block';
                reportImage.onclick = () => this.downloadReport();
            }
            if (reportLoading) reportLoading.style.display = 'none';
            if (downloadReportBtn) downloadReportBtn.style.display = 'inline-flex';
        };
        img.onerror = () => {
            if (reportLoading) reportLoading.style.display = 'none';
            if (noReportMessage) noReportMessage.style.display = 'block';
            if (downloadReportBtn) downloadReportBtn.style.display = 'none';
        };
        img.src = this.currentReportUrl;
    }
    
    downloadReport() {
        if (!this.currentReportUrl) return;
        
        const link = document.createElement('a');
        link.href = this.currentReportUrl;
        const date = new Date().toISOString().split('T')[0];
        link.download = `academic_report_${this.currentUser.student_id}_${date}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showSuccess('Report downloaded successfully!');
    }
    
    // QR Scanner Functions
    toggleQRScanner() {
        if (this.elements.cameraContainer.style.display === 'block') {
            this.stopQRScanner();
        } else {
            this.startQRScanner();
        }
    }
    
    async startQRScanner() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            
            const { qrVideo, cameraContainer, qrScannerBtn } = this.elements;
            if (qrVideo) {
                qrVideo.srcObject = this.stream;
                qrVideo.play();
            }
            if (cameraContainer) cameraContainer.style.display = 'block';
            if (qrScannerBtn) qrScannerBtn.style.display = 'none';
            
            // Start QR code detection
            this.startQRDetection();
        } catch (err) {
            this.showError('Camera access denied: ' + err.message);
        }
    }
    
    startQRDetection() {
        const { qrVideo } = this.elements;
        if (!qrVideo || !this.stream) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const tick = () => {
            if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
                canvas.height = qrVideo.videoHeight;
                canvas.width = qrVideo.videoWidth;
                ctx.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let code = null;
                
                try {
                    code = jsQR(imageData.data, imageData.width, imageData.height);
                } catch (e) {
                    console.error('QR detection error:', e);
                }
                
                if (code) {
                    const qrData = code.data;
                    const params = new URLSearchParams(qrData.split('?')[1]);
                    const portalId = params.get('portalId');
                    const password = params.get('password');
                    const schoolId = params.get('schoolId');
                    
                    if (schoolId) {
                        this.selectSchool(schoolId, `School ${schoolId}`);
                    }
                    
                    if (portalId) {
                        this.stopQRScanner();
                        
                        // Auto-login if password is in QR code
                        if (password) {
                            if (this.authenticateUser(portalId, password)) {
                                this.showSuccess('QR code scanned successfully!');
                            }
                        } else {
                            // Just populate the form
                            const portalIdInput = document.getElementById('portalId');
                            if (portalIdInput) portalIdInput.value = portalId;
                        }
                    }
                }
            }
            
            if (this.stream) {
                requestAnimationFrame(tick);
            }
        };
        
        tick();
    }
    
    stopQRScanner() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        const { cameraContainer, qrScannerBtn, qrVideo } = this.elements;
        if (cameraContainer) cameraContainer.style.display = 'none';
        if (qrScannerBtn) qrScannerBtn.style.display = 'inline-flex';
        if (qrVideo) {
            qrVideo.srcObject = null;
            qrVideo.pause();
        }
    }
    
    // Dashboard Functions
    logout() {
        this.currentUser = null;
        this.currentReportUrl = null;
        sessionStorage.removeItem('enhancedPortalUser');
        sessionStorage.removeItem('currentSchool');
        
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'none';
        this.showSchoolSelection();
    }
    
    refreshDashboard() {
        if (this.currentUser) {
            this.loadProfileData();
            this.checkReportAvailability();
            this.showSuccess('Dashboard refreshed!');
        }
    }
    
    printDashboard() {
        window.print();
    }
    
    showCredentials() {
        if (this.currentUser) {
            const account = this.accounts[this.currentUser.portalId];
            if (account) {
                alert(`Portal Credentials:

School ID: ${account.school_id}
Portal ID: ${this.currentUser.portalId}
Password: ${account.password}

Keep these credentials secure!`);
            }
        }
    }
    
    showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .success-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #059669, #047857);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize portal when DOM is loaded
function initPortal(accountsData, schoolConfig) {
    window.portal = new EnhancedPortal(accountsData, schoolConfig);
}

// Make functions available globally
window.showCredentials = () => {
    if (window.portal) window.portal.showCredentials();
};

window.selectSchool = (schoolId, schoolName) => {
    if (window.portal) window.portal.selectSchool(schoolId, schoolName);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof ENHANCED_PORTAL_ACCOUNTS !== 'undefined') {
            initPortal(ENHANCED_PORTAL_ACCOUNTS, SCHOOL_CONFIG);
        }
    });
} else {
    if (typeof ENHANCED_PORTAL_ACCOUNTS !== 'undefined') {
        initPortal(ENHANCED_PORTAL_ACCOUNTS, SCHOOL_CONFIG);
    }
}