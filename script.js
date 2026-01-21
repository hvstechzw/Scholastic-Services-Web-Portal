// Enhanced Student Portal - Mobile First JavaScript

class MobilePortal {
    constructor(accountsData, schoolsData) {
        this.accounts = accountsData || {};
        this.schools = schoolsData || {};
        this.currentUser = null;
        this.currentSchool = {
            id: 'default',
            name: 'Select School'
        };
        this.stream = null;
        this.currentReportUrl = null;
        
        // DOM Elements
        this.elements = {
            schoolSelectionPage: document.getElementById('schoolSelectionPage'),
            loginPage: document.getElementById('loginPage'),
            dashboard: document.getElementById('dashboard'),
            mobileSidebar: document.getElementById('mobileSidebar'),
            menuBtn: document.getElementById('menuBtn'),
            closeSidebar: document.getElementById('closeSidebar'),
            sidebarOverlay: document.createElement('div'),
            loginForm: document.getElementById('loginForm'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            qrScannerBtn: document.getElementById('qrScannerBtn'),
            cameraContainer: document.getElementById('cameraContainer'),
            qrVideo: document.getElementById('qrVideo'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            switchSchoolBtn: document.getElementById('switchSchoolBtn'),
            switchSchoolMobileBtn: document.getElementById('switchSchoolMobileBtn'),
            switchSchoolDashboardBtn: document.getElementById('switchSchoolDashboardBtn'),
            
            // Dashboard elements
            welcomeName: document.getElementById('welcomeName'),
            sidebarUserName: document.getElementById('sidebarUserName'),
            sidebarUserSchool: document.getElementById('sidebarUserSchool'),
            quickClass: document.getElementById('quickClass'),
            quickStatus: document.getElementById('quickStatus'),
            currentSchoolName: document.getElementById('currentSchoolName'),
            currentSchoolId: document.getElementById('currentSchoolId'),
            currentSchoolBadge: document.getElementById('currentSchoolBadge'),
            dashboardSchoolBadge: document.getElementById('dashboardSchoolBadge'),
            dashboardSchoolId: document.getElementById('dashboardSchoolId'),
            
            // Profile elements
            profileStudentName: document.getElementById('profileStudentName'),
            profileStudentId: document.getElementById('profileStudentId'),
            profileSchool: document.getElementById('profileSchool'),
            studentPhotoContainer: document.getElementById('studentPhotoContainer'),
            detailDob: document.getElementById('detailDob'),
            detailGender: document.getElementById('detailGender'),
            detailEmail: document.getElementById('detailEmail'),
            detailPhone: document.getElementById('detailPhone'),
            detailClass: document.getElementById('detailClass'),
            detailStream: document.getElementById('detailStream'),
            detailEnrollment: document.getElementById('detailEnrollment'),
            detailSports: document.getElementById('detailSports'),
            
            // Report elements
            reportSection: document.getElementById('reportSection'),
            reportImage: document.getElementById('reportImage'),
            reportLoading: document.getElementById('reportLoading'),
            noReportMessage: document.getElementById('noReportMessage'),
            downloadReportBtn: document.getElementById('downloadReportBtn'),
            viewReportBtn: document.getElementById('viewReportBtn'),
            
            // QR elements
            qrSection: document.getElementById('qrSection'),
            dynamicQR: document.getElementById('dynamicQR'),
            qrPortalId: document.getElementById('qrPortalId'),
            qrSchool: document.getElementById('qrSchool'),
            saveQRBtn: document.getElementById('saveQRBtn'),
            
            // Buttons
            logoutBtn: document.getElementById('logoutBtn'),
            refreshBtn: document.getElementById('refreshBtn')
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMobileNavigation();
        this.loadAvailableSchools();
        this.handleAutoLogin();
        this.setupSidebarOverlay();
        
        // Prevent zoom on mobile
        this.preventZoom();
    }
    
    preventZoom() {
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    setupSidebarOverlay() {
        const overlay = this.elements.sidebarOverlay;
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', () => this.closeMobileSidebar());
        document.body.appendChild(overlay);
    }
    
    setupEventListeners() {
        const { loginForm, qrScannerBtn, stopCameraBtn, switchSchoolBtn, 
                switchSchoolMobileBtn, logoutBtn, refreshBtn, menuBtn, 
                closeSidebar, saveQRBtn } = this.elements;
        
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
        
        if (switchSchoolMobileBtn) {
            switchSchoolMobileBtn.addEventListener('click', () => this.showSchoolSelection());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        }
        
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.closeMobileSidebar());
        }
        
        if (saveQRBtn) {
            saveQRBtn.addEventListener('click', () => this.saveQRCode());
        }
        
        // View report button
        if (this.elements.viewReportBtn) {
            this.elements.viewReportBtn.addEventListener('click', () => this.showSection('report'));
        }
        
        // Download report button
        if (this.elements.downloadReportBtn) {
            this.elements.downloadReportBtn.addEventListener('click', () => this.downloadReport());
        }
    }
    
    setupMobileNavigation() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Show selected section
                const section = item.getAttribute('data-section');
                this.showSection(section);
                
                // Close sidebar on mobile
                this.closeMobileSidebar();
            });
        });
    }
    
    toggleMobileSidebar() {
        const { mobileSidebar, sidebarOverlay } = this.elements;
        mobileSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = mobileSidebar.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMobileSidebar() {
        const { mobileSidebar, sidebarOverlay } = this.elements;
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    loadAvailableSchools() {
        const schoolList = document.getElementById('schoolList');
        if (!schoolList) return;
        
        schoolList.innerHTML = '';
        
        // Add schools from schools data
        Object.entries(this.schools).forEach(([schoolId, schoolData]) => {
            if (schoolData.name) {
                const schoolOption = this.createSchoolOption(schoolId, schoolData.name, 'fas fa-school');
                schoolList.appendChild(schoolOption);
            }
        });
        
        // Add default option if no schools
        if (schoolList.children.length === 0) {
            const defaultOption = this.createSchoolOption('default', 'Default School', 'fas fa-graduation-cap');
            schoolList.appendChild(defaultOption);
        }
    }
    
    createSchoolOption(schoolId, schoolName, iconClass) {
        const div = document.createElement('div');
        div.className = 'school-option';
        div.onclick = () => this.selectSchool(schoolId, schoolName);
        div.innerHTML = `
            <i class="${iconClass}"></i>
            <div class="school-info">
                <div class="school-name">${schoolName}</div>
                <div class="school-id">ID: ${schoolId}</div>
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
        const { currentSchoolName, currentSchoolId, currentSchoolBadge, 
                dashboardSchoolBadge, dashboardSchoolId } = this.elements;
        
        if (currentSchoolName) currentSchoolName.textContent = schoolName;
        if (currentSchoolId) currentSchoolId.textContent = schoolId;
        if (currentSchoolBadge) {
            currentSchoolBadge.innerHTML = `<i class="fas fa-school"></i> <span>${schoolId}</span>`;
        }
        if (dashboardSchoolBadge) {
            dashboardSchoolBadge.innerHTML = `<i class="fas fa-school"></i> <span>${schoolId}</span>`;
        }
        if (dashboardSchoolId) dashboardSchoolId.textContent = schoolId;
        
        // Show login page
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) {
            this.elements.loginPage.style.display = 'block';
            this.elements.loginPage.classList.add('container');
        }
    }
    
    showSchoolSelection() {
        // Clear any current session
        this.currentUser = null;
        sessionStorage.removeItem('mobilePortalUser');
        sessionStorage.removeItem('currentSchool');
        
        // Close sidebar if open
        this.closeMobileSidebar();
        
        // Show school selection
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'none';
        if (this.elements.schoolSelectionPage) {
            this.elements.schoolSelectionPage.style.display = 'block';
            this.elements.schoolSelectionPage.classList.add('container');
        }
        
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
        
        if (schoolId && this.schools[schoolId]) {
            this.selectSchool(schoolId, this.schools[schoolId].name || `School ${schoolId}`);
        }
        
        if (autoLogin === 'true' && portalId && password) {
            if (this.authenticateUser(portalId, password)) {
                window.history.replaceState(null, null, window.location.pathname);
            }
        }
        
        // Check session storage
        const sessionUser = sessionStorage.getItem('mobilePortalUser');
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
                school_name: account.school_name,
                qr_code: account.qr_code,
                date_of_birth: account.date_of_birth,
                phone: account.phone,
                enrollment_date: account.enrollment_date,
                sports: account.sports
            };
            
            this.currentUser = safeUserData;
            
            // Store in session (without password)
            sessionStorage.setItem('mobilePortalUser', JSON.stringify(safeUserData));
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
        const { welcomeName, sidebarUserName, sidebarUserSchool, quickClass, quickStatus } = this.elements;
        if (welcomeName) welcomeName.textContent = this.currentUser.name;
        if (sidebarUserName) sidebarUserName.textContent = this.currentUser.name;
        if (sidebarUserSchool) sidebarUserSchool.textContent = this.currentUser.school_name;
        if (quickClass) quickClass.textContent = this.currentUser.class;
        if (quickStatus) quickStatus.textContent = 'Active';
        
        // Load profile data
        this.loadProfileData();
        
        // Load QR code
        this.loadQRCode();
        
        // Check report availability
        this.checkReportAvailability();
        
        // Show dashboard
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'none';
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'grid';
        
        // Show welcome section by default
        this.showSection('welcome');
    }
    
    showSection(section) {
        // Hide all sections
        const sections = ['welcome', 'profile', 'report', 'qr', 'settings', 'help'];
        sections.forEach(sec => {
            const el = document.getElementById(`${sec}Section`);
            if (el) el.style.display = 'none';
        });
        
        // Show selected section
        const sectionEl = document.getElementById(`${section}Section`);
        if (sectionEl) {
            sectionEl.style.display = 'block';
            
            // Special handling for report section
            if (section === 'report') {
                this.loadReportImage();
            }
            
            // Special handling for QR section
            if (section === 'qr') {
                this.updateQRInfo();
            }
        }
    }
    
    updateQRInfo() {
        const { qrPortalId, qrSchool } = this.elements;
        if (qrPortalId) qrPortalId.textContent = this.currentUser.portalId;
        if (qrSchool) qrSchool.textContent = this.currentUser.school_name;
    }
    
    loadProfileData() {
        const user = this.currentUser;
        
        // Update profile elements
        const { profileStudentName, profileStudentId, profileSchool, 
                detailDob, detailGender, detailEmail, detailPhone,
                detailClass, detailStream, detailEnrollment, detailSports } = this.elements;
        
        if (profileStudentName) profileStudentName.textContent = user.name;
        if (profileStudentId) profileStudentId.textContent = `Student ID: ${user.student_id}`;
        if (profileSchool) profileSchool.textContent = `School: ${user.school_name}`;
        
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
        
        if (detailDob) detailDob.textContent = formatDate(user.date_of_birth);
        if (detailGender) detailGender.textContent = user.gender || 'N/A';
        if (detailEmail) detailEmail.textContent = user.email || 'N/A';
        if (detailPhone) detailPhone.textContent = user.phone || 'N/A';
        if (detailClass) detailClass.textContent = user.class;
        if (detailStream) detailStream.textContent = user.stream || 'N/A';
        if (detailEnrollment) detailEnrollment.textContent = formatDate(user.enrollment_date);
        if (detailSports) detailSports.textContent = user.sports || 'None';
        
        // Load student photo if available
        this.loadStudentPhoto();
    }
    
    loadStudentPhoto() {
        // This would be implemented to load the photo from the database
        // For now, we'll use a placeholder
        const photoContainer = this.elements.studentPhotoContainer;
        if (photoContainer) {
            // Clear existing content
            photoContainer.innerHTML = '<i class="fas fa-user-circle"></i>';
        }
    }
    
    loadQRCode() {
        const user = this.currentUser;
        
        if (!user) return;
        
        // Generate QR data for current URL
        const qrData = `${window.location.origin}${window.location.pathname}?portalId=${user.portalId}&schoolId=${user.school_id}&autoLogin=true&schoolName=${encodeURIComponent(user.school_name)}`;
        
        // Generate QR code
        const dynamicQR = document.getElementById('dynamicQR');
        if (dynamicQR && typeof QRCode !== 'undefined') {
            QRCode.toCanvas(dynamicQR, qrData, {
                width: 200,
                height: 200,
                margin: 1,
                color: {
                    dark: '#374151',
                    light: '#ffffff'
                }
            }, function(error) {
                if (error) console.error('QR Code generation error:', error);
            });
        }
    }
    
    saveQRCode() {
        const canvas = document.getElementById('dynamicQR');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `portal_qr_${this.currentUser.portalId}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showSuccess('QR code saved successfully!');
    }
    
    checkReportAvailability() {
        const user = this.currentUser;
        if (!user || !user.student_id) return;
        
        // Report image URLs to try
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
                    
                    if (schoolId && this.schools[schoolId]) {
                        this.selectSchool(schoolId, this.schools[schoolId].name || `School ${schoolId}`);
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
        sessionStorage.removeItem('mobilePortalUser');
        sessionStorage.removeItem('currentSchool');
        
        // Close sidebar if open
        this.closeMobileSidebar();
        
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
                    left: 20px;
                    background: linear-gradient(135deg, #059669, #047857);
                    color: white;
                    padding: 14px 18px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100%); opacity: 0; }
                }
                
                @media (min-width: 640px) {
                    .success-notification {
                        left: auto;
                        max-width: 300px;
                    }
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
function initPortal(accountsData, schoolsData) {
    window.portal = new MobilePortal(accountsData, schoolsData);
}

// Make functions available globally
window.selectSchool = (schoolId, schoolName) => {
    if (window.portal) window.portal.selectSchool(schoolId, schoolName);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof ENHANCED_PORTAL_ACCOUNTS !== 'undefined') {
            initPortal(ENHANCED_PORTAL_ACCOUNTS, SCHOOLS_DATA);
        }
    });
} else {
    if (typeof ENHANCED_PORTAL_ACCOUNTS !== 'undefined') {
        initPortal(ENHANCED_PORTAL_ACCOUNTS, SCHOOLS_DATA);
    }
}