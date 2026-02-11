// STAR FIT — МЕНЕДЖЕР ЗАГРУЗКИ ФОТОГРАФИЙ
// Версия 2.0 — Поддержка фото тренеров и логотипа

class StarFitPhotoManager {
    constructor() {
        this.trainers = ['vladimir', 'yana', 'tatiana'];
        this.init();
    }
    
    init() {
        this.initLogoUploader();
        this.initTrainerPhotoManager();
        this.setupKeyboardShortcut();
        this.setupMobileSupport();
        this.loadSavedLogo();
        this.loadSavedTrainerPhotos();
        this.addConsoleCommands();
    }
    
    // ===== ЗАГРУЗКА ЛОГОТИПА =====
    initLogoUploader() {
        const logo = document.querySelector('.logo');
        
        if (logo) {
            // Двойной клик
            logo.addEventListener('dblclick', () => {
                this.openLogoUploader();
            });
            
            // Долгое нажатие для мобильных
            let touchTimer;
            logo.addEventListener('touchstart', (e) => {
                touchTimer = setTimeout(() => {
                    this.openLogoUploader();
                }, 500);
            });
            
            logo.addEventListener('touchend', () => {
                clearTimeout(touchTimer);
            });
        }
        
        // Обработчики модального окна логотипа
        const modal = document.getElementById('logoUploadModal');
        const closeBtn = modal?.querySelector('.modal-close');
        
        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Drag & drop для логотипа
        const uploadArea = document.getElementById('uploadArea');
        const logoInput = document.getElementById('logoInput');
        
        if (uploadArea && logoInput) {
            uploadArea.addEventListener('click', () => {
                logoInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.background = 'var(--primary-light)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.background = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.background = '';
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.previewLogo(file);
                }
            });
            
            document.getElementById('selectLogoBtn')?.addEventListener('click', () => {
                logoInput.click();
            });
            
            logoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewLogo(file);
                }
            });
            
            document.getElementById('saveLogo')?.addEventListener('click', () => {
                this.saveLogo();
            });
        }
    }
    
    openLogoUploader() {
        const modal = document.getElementById('logoUploadModal');
        modal.classList.add('active');
    }
    
    previewLogo(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('previewImage');
            preview.src = e.target.result;
            
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('logoPreview').style.display = 'block';
            
            window.previewLogoData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    saveLogo() {
        if (window.previewLogoData) {
            localStorage.setItem('starfit_logo', window.previewLogoData);
            this.updateLogoDisplay(window.previewLogoData);
            
            const modal = document.getElementById('logoUploadModal');
            modal.classList.remove('active');
            
            showNotification('Логотип успешно сохранен!', 'success');
            
            document.getElementById('uploadArea').style.display = 'block';
            document.getElementById('logoPreview').style.display = 'none';
            window.previewLogoData = null;
        }
    }
    
    loadSavedLogo() {
        const savedLogo = localStorage.getItem('starfit_logo');
        if (savedLogo) {
            this.updateLogoDisplay(savedLogo);
        }
    }
    
    updateLogoDisplay(imageData) {
        const logoElements = document.querySelectorAll('.logo-star');
        logoElements.forEach(el => {
            if (!el.closest('.trainer-placeholder')) {
                el.style.background = `url(${imageData}) no-repeat center/contain`;
                el.style.color = 'transparent';
                el.style.width = '40px';
                el.style.height = '40px';
                el.innerHTML = '';
            }
        });
    }
    
    // ===== ЗАГРУЗКА ФОТО ТРЕНЕРОВ =====
    initTrainerPhotoManager() {
        // Секретный код для админ-панели тренеров
        this.setupAdminPanel();
    }
    
    setupAdminPanel() {
        // Создаем кнопку для админ-панели (будет доступна по secret key)
        console.log('%c🏆 STAR FIT PHOTO MANAGER', 'font-size: 20px; color: #4CAF50; font-weight: bold;');
        console.log('%cСекретный код: starfitadmin', 'font-size: 14px; color: #FF9800;');
        console.log('%cДоступные команды в консоли:', 'font-size: 14px; color: #2196F3;');
        console.log('  • trainerPhotoManager.exportAllPhotos() — экспорт всех фото');
        console.log('  • trainerPhotoManager.importPhotos() — импорт фото');
        console.log('  • trainerPhotoManager.resetAllTrainerPhotos() — сброс всех фото тренеров');
        console.log('  • trainerPhotoManager.resetLogo() — сброс логотипа');
    }
    
    loadSavedTrainerPhotos() {
        this.trainers.forEach(trainerId => {
            const savedPhoto = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (savedPhoto) {
                this.displayTrainerPhoto(trainerId, savedPhoto);
            }
        });
    }
    
    displayTrainerPhoto(trainerId, imageData) {
        const imgElement = document.getElementById(`trainer-img-${trainerId}`);
        const placeholder = document.getElementById(`placeholder-${trainerId}`);
        
        if (imgElement && placeholder) {
            imgElement.src = imageData;
            imgElement.style.display = 'block';
            placeholder.style.display = 'none';
        }
    }
    
    // ===== ЭКСПОРТ/ИМПОРТ ФОТО =====
    exportAllPhotos() {
        const data = {
            logo: localStorage.getItem('starfit_logo') || '',
            trainers: {}
        };
        
        this.trainers.forEach(trainerId => {
            const photo = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (photo) {
                data.trainers[trainerId] = photo;
            }
        });
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileName = `starfit_backup_${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
        
        showNotification('✅ Резервная копия создана!', 'success');
    }
    
    importPhotos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Импорт логотипа
                    if (data.logo) {
                        localStorage.setItem('starfit_logo', data.logo);
                        this.updateLogoDisplay(data.logo);
                    }
                    
                    // Импорт фото тренеров
                    if (data.trainers) {
                        Object.entries(data.trainers).forEach(([trainerId, imageData]) => {
                            if (this.trainers.includes(trainerId)) {
                                localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
                                this.displayTrainerPhoto(trainerId, imageData);
                            }
                        });
                    }
                    
                    showNotification('✅ Фото успешно импортированы!', 'success');
                } catch (error) {
                    showNotification('❌ Ошибка при импорте файла', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    resetAllTrainerPhotos() {
        if (confirm('Вы уверены, что хотите удалить все фотографии тренеров?')) {
            this.trainers.forEach(trainerId => {
                localStorage.removeItem(`trainer_photo_${trainerId}`);
                
                const imgElement = document.getElementById(`trainer-img-${trainerId}`);
                const placeholder = document.getElementById(`placeholder-${trainerId}`);
                
                if (imgElement && placeholder) {
                    imgElement.style.display = 'none';
                    imgElement.src = '';
                    placeholder.style.display = 'flex';
                }
            });
            
            showNotification('🔄 Фото тренеров сброшены', 'warning');
        }
    }
    
    resetLogo() {
        if (confirm('Вы уверены, что хотите удалить логотип?')) {
            localStorage.removeItem('starfit_logo');
            
            const logoElements = document.querySelectorAll('.logo-star');
            logoElements.forEach(el => {
                if (!el.closest('.trainer-placeholder')) {
                    el.style.background = '';
                    el.style.color = '';
                    el.style.width = '';
                    el.style.height = '';
                    el.innerHTML = '⭐';
                }
            });
            
            showNotification('🔄 Логотип сброшен', 'warning');
        }
    }
    
    // ===== ПОДДЕРЖКА МОБИЛЬНЫХ УСТРОЙСТВ =====
    setupMobileSupport() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Добавляем долгое нажатие для загрузки фото тренеров
            document.querySelectorAll('.trainer-image-frame').forEach(frame => {
                let pressTimer;
                
                frame.addEventListener('touchstart', (e) => {
                    pressTimer = setTimeout(() => {
                        const uploadOverlay = frame.querySelector('.trainer-upload-overlay');
                        if (uploadOverlay) {
                            const input = uploadOverlay.querySelector('input[type="file"]');
                            if (input) {
                                input.click();
                            }
                        }
                    }, 500);
                });
                
                frame.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });
                
                frame.addEventListener('touchmove', () => {
                    clearTimeout(pressTimer);
                });
            });
        }
    }
    
    // ===== СЕКРЕТНАЯ КОМБИНАЦИЯ =====
    setupKeyboardShortcut() {
        let keySequence = '';
        const secretCode = 'starfitadmin';
        
        document.addEventListener('keydown', (e) => {
            keySequence += e.key.toLowerCase();
            
            if (keySequence.includes(secretCode)) {
                this.openAdminConsole();
                keySequence = '';
            }
            
            clearTimeout(this.keyTimer);
            this.keyTimer = setTimeout(() => {
                keySequence = '';
            }, 3000);
        });
    }
    
    openAdminConsole() {
        const commands = [
            '%c🌟 STAR FIT ADMIN PANEL 🌟',
            'font-size: 24px; color: #4CAF50; font-weight: bold; text-shadow: 0 0 10px #4CAF50;',
            '',
            '%c📸 УПРАВЛЕНИЕ ФОТОГРАФИЯМИ:',
            'font-size: 16px; color: #2196F3; font-weight: bold;',
            '  • trainerPhotoManager.exportAllPhotos() — экспорт всех фото',
            '  • trainerPhotoManager.importPhotos() — импорт фото',
            '  • trainerPhotoManager.resetAllTrainerPhotos() — сброс фото тренеров',
            '  • trainerPhotoManager.resetLogo() — сброс логотипа',
            '',
            '%c📊 ПРОСМОТР ЗАЯВОК:',
            'font-size: 16px; color: #FF9800; font-weight: bold;',
            '  • console.table(JSON.parse(localStorage.getItem(\'starfit_bookings\') || \'[]\'))',
            '',
            '%c💾 ОЧИСТКА ДАННЫХ:',
            'font-size: 16px; color: #F44336; font-weight: bold;',
            '  • localStorage.removeItem(\'starfit_bookings\') — очистить заявки',
            '  • localStorage.clear() — ОЧИСТИТЬ ВСЁ (осторожно!)'
        ];
        
        commands.forEach(cmd => {
            if (Array.isArray(cmd)) {
                console.log(cmd[0], cmd[1]);
            } else {
                console.log(cmd);
            }
        });
        
        showNotification('🔐 Админ-панель активирована! Смотрите в консоли (F12)', 'info');
    }
    
    addConsoleCommands() {
        window.trainerPhotoManager = this;
    }
}

// Инициализация менеджера
const trainerPhotoManager = new StarFitPhotoManager();

// Экспорт для глобального доступа
window.StarFitPhotoManager = StarFitPhotoManager;
window.trainerPhotoManager = trainerPhotoManager;
