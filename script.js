// Enhanced Student Portal - FIXED MOBILE NAVIGATION JavaScript

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
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            menuBtn: document.getElementById('menuBtn'),
            closeSidebar: document.getElementById('closeSidebar'),
            loginForm: document.getElementById('loginForm'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            qrScannerBtn: document.getElementById('qrScannerBtn'),
            cameraContainer: document.getElementById('cameraContainer'),
            qrVideo: document.getElementById('qrVideo'),
            stopCameraBtn: document.getElementById('stopCameraBtn'),
            switchSchoolBtn: document.getElementById('switchSchoolBtn'),
            switchSchoolMobileBtn: document.getElementById('switchSchoolMobileBtn'),
            
            // Dashboard elements
            welcomeName: document.getElementById('welcomeName'),
            sidebarUserName: document.getElementById('sidebarUserName'),
            sidebarUserSchool: document.getElementById('sidebarUserSchool'),
            quickClass: document.getElementById('quickClass'),
            quickStatus: document.getElementById('quickStatus'),
            quickSchool: document.getElementById('quickSchool'),
            quickStream: document.getElementById('quickStream'),
            currentSchoolName: document.getElementById('currentSchoolName'),
            currentSchoolId: document.getElementById('currentSchoolId'),
            currentSchoolBadge: document.getElementById('currentSchoolBadge'),
            dashboardSchoolBadge: document.getElementById('dashboardSchoolBadge'),
            dashboardSchoolId: document.getElementById('dashboardSchoolId'),
            schoolLogoContainer: document.getElementById('schoolLogoContainer'),
            
            // Profile elements
            profileStudentName: document.getElementById('profileStudentName'),
            profileStudentId: document.getElementById('profileStudentId'),
            profileSchool: document.getElementById('profileSchool'),
            studentPhotoContainer: document.getElementById('studentPhotoContainer'),
            detailDob: document.getElementById('detailDob'),
            detailGender: document.getElementById('detailGender'),
            detailEmail: document.getElementById('detailEmail'),
            detailPhone: document.getElementById('detailPhone'),
            detailAddress: document.getElementById('detailAddress'),
            detailClass: document.getElementById('detailClass'),
            detailStream: document.getElementById('detailStream'),
            detailEnrollment: document.getElementById('detailEnrollment'),
            detailSports: document.getElementById('detailSports'),
            detailPreviousSchool: document.getElementById('detailPreviousSchool'),
            detailEmergencyContact: document.getElementById('detailEmergencyContact'),
            detailMedicalInfo: document.getElementById('detailMedicalInfo'),
            detailNotes: document.getElementById('detailNotes'),
            
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
            
            // Settings elements
            settingsPortalId: document.getElementById('settingsPortalId'),
            settingsSchool: document.getElementById('settingsSchool'),
            logoutSettingsBtn: document.getElementById('logoutSettingsBtn'),
            switchSchoolSettingsBtn: document.getElementById('switchSchoolSettingsBtn'),
            
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
        
        // Prevent zoom on mobile
        this.preventZoom();
        
        // Force light theme
        this.forceLightTheme();
    }
    
    forceLightTheme() {
        // Add light theme class to body
        document.body.classList.add('light-theme');
        document.body.setAttribute('data-theme', 'light');
        
        // Set meta tag to force light theme
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'color-scheme';
            meta.content = 'light only';
            document.head.appendChild(meta);
        } else {
            meta.content = 'light only';
        }
        
        // Set CSS variable
        document.documentElement.style.setProperty('color-scheme', 'light only');
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
    
    setupEventListeners() {
        const { loginForm, qrScannerBtn, stopCameraBtn, switchSchoolBtn, 
                switchSchoolMobileBtn, logoutBtn, refreshBtn, menuBtn, 
                closeSidebar, saveQRBtn, logoutSettingsBtn, switchSchoolSettingsBtn,
                sidebarOverlay, viewReportBtn, downloadReportBtn } = this.elements;
        
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
        
        if (switchSchoolSettingsBtn) {
            switchSchoolSettingsBtn.addEventListener('click', () => this.showSchoolSelection());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (logoutSettingsBtn) {
            logoutSettingsBtn.addEventListener('click', () => this.logout());
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
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
        }
        
        if (viewReportBtn) {
            viewReportBtn.addEventListener('click', () => this.showSection('report'));
        }
        
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', () => this.downloadReport());
        }
        
        // Dashboard action buttons
        const actionButtons = document.querySelectorAll('.dashboard-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                this.showSection(section);
            });
        });
        
        // Theme options
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.forceLightTheme(); // Always force light theme
            });
        });
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
                const schoolOption = this.createSchoolOption(schoolId, schoolData.name);
                schoolList.appendChild(schoolOption);
            }
        });
        
        // Add default option if no schools
        if (schoolList.children.length === 0) {
            const defaultOption = this.createSchoolOption('default', 'Default School');
            schoolList.appendChild(defaultOption);
        }
    }
    
    createSchoolOption(schoolId, schoolName) {
        const div = document.createElement('div');
        div.className = 'school-option';
        div.onclick = () => this.selectSchool(schoolId, schoolName);
        
        // Check if school has logo
        const schoolData = this.schools[schoolId];
        const hasLogo = schoolData && schoolData.logo_base64;
        
        div.innerHTML = `
            ${hasLogo ? 
                `<div class="school-logo-small" style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                ">
                    <img src="data:image/png;base64,${schoolData.logo_base64}" 
                         alt="${schoolName}" 
                         style="width: 100%; height: 100%; object-fit: contain;"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas fa-school\'></i>';">
                </div>` :
                `<i class="fas fa-school" style="font-size: 20px; color: #4b5563; min-width: 40px;"></i>`
            }
            <div class="school-info">
                <div class="school-name">${schoolName}</div>
                <div class="school-id">ID: ${schoolId}</div>
            </div>
            <i class="fas fa-chevron-right" style="color: #9ca3af;"></i>
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
                dashboardSchoolBadge, dashboardSchoolId, schoolLogoContainer } = this.elements;
        
        if (currentSchoolName) currentSchoolName.textContent = schoolName;
        if (currentSchoolId) currentSchoolId.textContent = schoolId;
        if (currentSchoolBadge) {
            currentSchoolBadge.innerHTML = `<i class="fas fa-school"></i> <span>${schoolId}</span>`;
        }
        if (dashboardSchoolBadge) {
            dashboardSchoolBadge.innerHTML = `<i class="fas fa-school"></i> <span>${schoolId}</span>`;
        }
        if (dashboardSchoolId) dashboardSchoolId.textContent = schoolId;
        
        // Update school logo
        this.updateSchoolLogo(schoolId);
        
        // Show login page
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) {
            this.elements.loginPage.style.display = 'block';
            this.elements.loginPage.classList.add('container');
        }
    }
    
    updateSchoolLogo(schoolId) {
        const schoolLogoContainer = document.getElementById('schoolLogoContainer');
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        
        if (!schoolLogoContainer && !sidebarAvatar) return;
        
        const schoolData = this.schools[schoolId];
        const hasLogo = schoolData && schoolData.logo_base64;
        
        const updateLogo = (container) => {
            if (hasLogo) {
                container.innerHTML = `
                    <img src="data:image/png;base64,${schoolData.logo_base64}" 
                         alt="${schoolData.name}" 
                         style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas fa-school\'></i>';">
                `;
            } else {
                container.innerHTML = '<i class="fas fa-school"></i>';
            }
        };
        
        if (schoolLogoContainer) updateLogo(schoolLogoContainer);
        if (sidebarAvatar) updateLogo(sidebarAvatar);
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
                phone: account.phone,
                address: account.address,
                school_id: account.school_id,
                school_name: account.school_name,
                school_logo: account.school_logo,
                qr_code: account.qr_code,
                date_of_birth: account.date_of_birth,
                enrollment_date: account.enrollment_date,
                sports: account.sports,
                previous_school: account.previous_school,
                emergency_contact: account.emergency_contact,
                medical_info: account.medical_info,
                notes: account.notes,
                photo_data: account.photo_data,
                mime_type: account.mime_type
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
        // Update welcome message and quick stats
        const { welcomeName, sidebarUserName, sidebarUserSchool, 
                quickClass, quickStatus, quickSchool, quickStream } = this.elements;
        
        if (welcomeName) welcomeName.textContent = this.currentUser.name;
        if (sidebarUserName) sidebarUserName.textContent = this.currentUser.name;
        if (sidebarUserSchool) sidebarUserSchool.textContent = this.currentUser.school_name;
        if (quickClass) quickClass.textContent = this.currentUser.class;
        if (quickStatus) quickStatus.textContent = 'Active';
        if (quickSchool) quickSchool.textContent = this.currentUser.school_name;
        if (quickStream) quickStream.textContent = this.currentUser.stream || 'Not specified';
        
        // Load profile data
        this.loadProfileData();
        
        // Load QR code
        this.loadQRCode();
        
        // Check report availability
        this.checkReportAvailability();
        
        // Load settings
        this.loadSettings();
        
        // Show dashboard
        if (this.elements.schoolSelectionPage) this.elements.schoolSelectionPage.style.display = 'none';
        if (this.elements.loginPage) this.elements.loginPage.style.display = 'none';
        if (this.elements.dashboard) this.elements.dashboard.style.display = 'grid';
        
        // Show welcome section by default
        this.showSection('welcome');
        
        // Update active sidebar item
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => item.classList.remove('active'));
        const welcomeItem = document.querySelector('.sidebar-item[data-section="welcome"]');
        if (welcomeItem) welcomeItem.classList.add('active');
    }
    
    showSection(section) {
        // Hide all sections
        const sections = ['welcome', 'profile', 'report', 'qr', 'settings'];
        sections.forEach(sec => {
            const el = document.getElementById(`${sec}Section`);
            if (el) {
                el.style.display = 'none';
                el.classList.remove('active-section');
            }
        });
        
        // Show selected section
        const sectionEl = document.getElementById(`${section}Section`);
        if (sectionEl) {
            sectionEl.style.display = 'block';
            sectionEl.classList.add('active-section');
            
            // Special handling for report section
            if (section === 'report') {
                this.loadReportImage();
            }
            
            // Special handling for QR section
            if (section === 'qr') {
                this.updateQRInfo();
            }
            
            // Update active sidebar item
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => item.classList.remove('active'));
            const activeItem = document.querySelector(`.sidebar-item[data-section="${section}"]`);
            if (activeItem) activeItem.classList.add('active');
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
                detailDob, detailGender, detailEmail, detailPhone, detailAddress,
                detailClass, detailStream, detailEnrollment, detailSports,
                detailPreviousSchool, detailEmergencyContact, detailMedicalInfo,
                detailNotes, studentPhotoContainer } = this.elements;
        
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
        if (detailAddress) detailAddress.textContent = user.address || 'N/A';
        if (detailClass) detailClass.textContent = user.class;
        if (detailStream) detailStream.textContent = user.stream || 'N/A';
        if (detailEnrollment) detailEnrollment.textContent = formatDate(user.enrollment_date);
        if (detailSports) detailSports.textContent = user.sports || 'None';
        if (detailPreviousSchool) detailPreviousSchool.textContent = user.previous_school || 'None';
        if (detailEmergencyContact) detailEmergencyContact.textContent = user.emergency_contact || 'Not provided';
        if (detailMedicalInfo) detailMedicalInfo.textContent = user.medical_info || 'No special medical information';
        if (detailNotes) detailNotes.textContent = user.notes || 'No additional notes';
        
        // Load student photo if available
        this.loadStudentPhoto(user);
    }
    
    loadStudentPhoto(user) {
        const photoContainer = this.elements.studentPhotoContainer;
        if (photoContainer) {
            photoContainer.innerHTML = '';
            
            if (user.photo_data) {
                try {
                    // Create image element
                    const img = document.createElement('img');
                    img.src = `data:${user.mime_type || 'image/jpeg'};base64,${user.photo_data}`;
                    img.alt = `${user.name}'s photo`;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '50%';
                    
                    photoContainer.appendChild(img);
                } catch (e) {
                    console.error('Error loading student photo:', e);
                    photoContainer.innerHTML = '<i class="fas fa-user-circle"></i>';
                }
            } else {
                photoContainer.innerHTML = '<i class="fas fa-user-circle"></i>';
            }
        }
    }
    
    loadQRCode() {
        const user = this.currentUser;
        
        if (!user) return;
        
        // Generate QR data for current URL - PROPER URL FORMAT
        const qrData = `https://${window.location.hostname}${window.location.pathname}?portalId=${user.portalId}&schoolId=${user.school_id}&autoLogin=true`;
        
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
    
    loadSettings() {
        const { settingsPortalId, settingsSchool } = this.elements;
        if (settingsPortalId) settingsPortalId.value = this.currentUser.portalId;
        if (settingsSchool) settingsSchool.value = this.currentUser.school_name;
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
                // Make image clickable to view full size
                reportImage.onclick = () => {
                    this.viewFullReport(reportImage.src);
                };
                
                // Show image container
                const reportImageContainer = document.querySelector('.report-image-container');
                if (reportImageContainer) reportImageContainer.style.display = 'block';
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
    
    viewFullReport(imageSrc) {
        // Create modal for full report view
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.padding = '20px';
        
        const img = new Image();
        img.src = imageSrc;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '12px';
        img.style.cursor = 'zoom-out';
        
        // Close modal when clicking outside image
        modal.onclick = (e) => {
            if (e.target === modal || e.target === img) {
                document.body.removeChild(modal);
            }
        };
        
        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.style.position = 'absolute';
        downloadBtn.style.top = '20px';
        downloadBtn.style.right = '20px';
        downloadBtn.style.padding = '12px 20px';
        downloadBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        downloadBtn.style.color = 'white';
        downloadBtn.style.border = 'none';
        downloadBtn.style.borderRadius = '12px';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.fontWeight = '600';
        downloadBtn.style.fontSize = '14px';
        downloadBtn.style.display = 'flex';
        downloadBtn.style.alignItems = 'center';
        downloadBtn.style.gap = '8px';
        downloadBtn.style.zIndex = '10001';
        
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = `academic_report_${this.currentUser.student_id}_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        };
        
        modal.appendChild(img);
        modal.appendChild(downloadBtn);
        document.body.appendChild(modal);
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
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
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