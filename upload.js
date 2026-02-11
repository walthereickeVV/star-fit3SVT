// STAR FIT — ЗАГРУЗКА ФОТОГРАФИЙ ТРЕНЕРОВ
// Простая и надёжная система

class TrainerPhotoManager {
    constructor() {
        this.trainers = ['vladimir', 'yana', 'tatiana'];
        this.init();
    }
    
    init() {
        this.loadAllPhotos();
        this.setupKeyboardShortcut();
    }
    
    // Загрузка всех сохранённых фото
    loadAllPhotos() {
        this.trainers.forEach(trainerId => {
            const savedPhoto = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (savedPhoto) {
                this.displayPhoto(trainerId, savedPhoto);
            }
        });
    }
    
    // Отображение фото
    displayPhoto(trainerId, imageData) {
        const imgElement = document.getElementById(`trainer-img-${trainerId}`);
        const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
        
        if (imgElement && placeholder) {
            imgElement.src = imageData;
            imgElement.style.display = 'block';
            placeholder.style.display = 'none';
        }
    }
    
    // Экспорт всех фото (резервная копия)
    exportAllPhotos() {
        const data = {};
        
        this.trainers.forEach(trainerId => {
            const photo = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (photo) {
                data[trainerId] = photo;
            }
        });
        
        const dataStr = JSON.stringify(data);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `starfit_trainers_${new Date().toISOString().slice(0,10)}.json`);
        link.click();
        
        showNotification('✅ Резервная копия создана', 'success');
    }
    
    // Импорт фото
    importPhotos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    Object.entries(data).forEach(([trainerId, imageData]) => {
                        if (this.trainers.includes(trainerId)) {
                            localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
                            this.displayPhoto(trainerId, imageData);
                        }
                    });
                    
                    showNotification('✅ Фото импортированы', 'success');
                } catch (error) {
                    showNotification('❌ Ошибка импорта', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Сброс всех фото
    resetAllPhotos() {
        if (confirm('Удалить все фотографии тренеров?')) {
            this.trainers.forEach(trainerId => {
                localStorage.removeItem(`trainer_photo_${trainerId}`);
                
                const img = document.getElementById(`trainer-img-${trainerId}`);
                const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
                
                if (img && placeholder) {
                    img.style.display = 'none';
                    img.src = '';
                    placeholder.style.display = 'flex';
                }
            });
            
            showNotification('🔄 Фото сброшены', 'warning');
        }
    }
    
    // Секретная комбинация
    setupKeyboardShortcut() {
        let keySequence = '';
        const secretCode = 'starfitadmin';
        
        document.addEventListener('keydown', (e) => {
            keySequence += e.key.toLowerCase();
            
            if (keySequence.includes(secretCode)) {
                this.showAdminCommands();
                keySequence = '';
            }
            
            clearTimeout(this.keyTimer);
            this.keyTimer = setTimeout(() => {
                keySequence = '';
            }, 3000);
        });
    }
    
    showAdminCommands() {
        console.log('%c🌟 STAR FIT ADMIN', 'font-size: 24px; color: #4CAF50; font-weight: bold;');
        console.log('%cДоступные команды:', 'font-size: 16px; color: #2196F3;');
        console.log('  trainerPhotoManager.exportAllPhotos() — экспорт фото');
        console.log('  trainerPhotoManager.importPhotos() — импорт фото');
        console.log('  trainerPhotoManager.resetAllPhotos() — сброс фото');
        
        showNotification('🔐 Админ-режим активирован (смотри консоль F12)', 'info');
    }
}

// Инициализация
const trainerPhotoManager = new TrainerPhotoManager();
window.trainerPhotoManager = trainerPhotoManager;
