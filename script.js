// ДОПОЛНИТЕЛЬНАЯ ЛОГИКА - ДОБАВЬТЕ В КОНЕЦ ВАШЕГО SCRIPT.JS

// ===== МАРКЕТИНГОВАЯ ЛОГИКА =====

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initPricingTabs();
    initTrainerBooking();
    loadSavedTrainerPhotos();
});

// Переключение вкладок цен
function initPricingTabs() {
    const navBtns = document.querySelectorAll('.pricing-nav-btn');
    const categories = document.querySelectorAll('.pricing-category');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            navBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все категории
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Показываем выбранную категорию
            const target = this.dataset.target;
            const targetCat = document.getElementById(`pricing-${target}`);
            if (targetCat) {
                targetCat.classList.add('active');
            }
        });
    });
}

// Запись к тренерам через кнопки
function initTrainerBooking() {
    const trainerBtns = document.querySelectorAll('.btn-trainer');
    const trainerSelect = document.getElementById('trainer-select');
    
    trainerBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const trainer = this.dataset.trainer;
            
            // Прокрутка к форме записи
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Выбор тренера в селекте
            if (trainerSelect) {
                trainerSelect.value = trainer;
                
                // Подсветка выбора
                trainerSelect.style.borderColor = 'var(--primary)';
                trainerSelect.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                
                setTimeout(() => {
                    trainerSelect.style.borderColor = '';
                    trainerSelect.style.boxShadow = '';
                }, 2000);
            }
            
            // Показываем уведомление
            const trainerNames = {
                'vladimir': 'Владимиру Лукьянову',
                'yana': 'Яне Лукьяновой',
                'tatiana': 'Татьяне Лукьяновой'
            };
            showNotification(`Вы выбрали запись к ${trainerNames[trainer]}`, 'success');
        });
    });
}

// Сохранение и загрузка фото тренеров
function loadSavedTrainerPhotos() {
    const trainers = ['vladimir', 'yana', 'tatiana'];
    
    trainers.forEach(trainerId => {
        const savedPhoto = localStorage.getItem(`trainer_photo_${trainerId}`);
        if (savedPhoto) {
            displayTrainerPhoto(trainerId, savedPhoto);
        }
    });
}

function displayTrainerPhoto(trainerId, imageData) {
    const imgElement = document.getElementById(`trainer-img-${trainerId}`);
    const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
    
    if (imgElement && placeholder) {
        imgElement.src = imageData;
        imgElement.style.display = 'block';
        placeholder.style.display = 'none';
    }
}

// Инициализация загрузки фото
document.querySelectorAll('.upload-overlay').forEach(overlay => {
    const input = overlay.querySelector('input[type="file"]');
    const trainerId = overlay.dataset.trainer;
    
    if (input && trainerId) {
        overlay.addEventListener('click', () => {
            input.click();
        });
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
                    displayTrainerPhoto(trainerId, imageData);
                    showNotification(`Фото тренера загружено`, 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Маркетинговый таймер срочности
function createUrgencyTimer() {
    const timerElement = document.createElement('div');
    timerElement.className = 'urgency-timer';
    timerElement.innerHTML = `
        <div class="timer-badge">⏳ СЕГОДНЯ</div>
        <div class="timer-text">Скидка 30% для студентов действует</div>
    `;
    
    const pricingSection = document.querySelector('.pricing');
    if (pricingSection) {
        pricingSection.prepend(timerElement);
    }
}

// Вызов через 1 секунду после загрузки
setTimeout(createUrgencyTimer, 1000);

// Стили для таймера
const timerStyles = document.createElement('style');
timerStyles.textContent = `
    .urgency-timer {
        background: linear-gradient(135deg, #FF416C, #FF4B2B);
        color: white;
        padding: 16px 24px;
        border-radius: var(--border-radius);
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        animation: pulse 2s infinite;
    }
    
    .timer-badge {
        background: rgba(255,255,255,0.2);
        padding: 6px 16px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 14px;
    }
    
    .timer-text {
        font-weight: 600;
        font-size: 16px;
    }
    
    @media (max-width: 768px) {
        .urgency-timer {
            flex-direction: column;
            gap: 10px;
            text-align: center;
        }
    }
`;
document.head.appendChild(timerStyles);
