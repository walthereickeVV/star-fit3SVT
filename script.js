// STAR FIT — ПОЛНАЯ ЛОГИКА САЙТА
// Версия 2.0 — Чемпионы мира в Светлогорске

// Основные данные
const APP_DATA = {
    clubName: 'Star Fit',
    address: 'г. Светлогорск, ул. 50 лет Октября, 2Б',
    phone1: '+375 (29) 634-46-64',
    phone2: '+375 (29) 616-74-45',
    email: 'info@star-fit.by',
    instagram: 'https://www.instagram.com/starfit_svt',
    
    workingHours: {
        weekday: '09:00-12:00 / 17:00-21:00',
        saturday: '10:00-13:00 / 17:00-21:00',
        sunday: 'Выходной'
    },
    
    bookings: JSON.parse(localStorage.getItem('starfit_bookings')) || [],
    logo: localStorage.getItem('starfit_logo') || '',
    trainerPhotos: {
        vladimir: localStorage.getItem('trainer_photo_vladimir') || '',
        yana: localStorage.getItem('trainer_photo_yana') || '',
        tatiana: localStorage.getItem('trainer_photo_tatiana') || ''
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initEventListeners();
    initTheme();
    initSmoothScroll();
    initAnimations();
    initFormMask();
    initClientCount();
    loadSavedTrainerPhotos();
    initPricingNavigation();
});

// Прелоадер
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1500);
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Меню
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('#menuBtn')) {
            sidebar?.classList.remove('active');
        }
    });

    // Прокрутка наверх
    const scrollTop = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Форма записи
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Карта
    document.getElementById('openMap')?.addEventListener('click', (e) => {
        e.preventDefault();
        const address = encodeURIComponent('Светлогорск, 50 лет Октября 2Б');
        window.open(`https://yandex.ru/maps/?text=${address}`, '_blank');
    });

    // Кнопки записи к тренерам
    document.querySelectorAll('.btn-trainer').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const trainer = this.dataset.trainer;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            const trainerSelect = document.getElementById('trainer');
            if (trainerSelect) {
                trainerSelect.value = trainer;
                showNotification(`Вы выбрали: ${getTrainerName(trainer)}`, 'success');
            }
        });
    });

    // Загрузка фото тренеров
    initTrainerPhotoUploads();
}

// Загрузка фото тренеров
function initTrainerPhotoUploads() {
    document.querySelectorAll('.trainer-upload-overlay').forEach(overlay => {
        const input = overlay.querySelector('input[type="file"]');
        const trainerId = overlay.dataset.trainer;
        
        if (input && trainerId) {
            overlay.addEventListener('click', () => {
                input.click();
            });
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handleTrainerPhoto(file, trainerId);
                }
            });
            
            // Drag & Drop
            overlay.addEventListener('dragover', (e) => {
                e.preventDefault();
                overlay.style.background = 'rgba(76, 175, 80, 0.3)';
            });
            
            overlay.addEventListener('dragleave', () => {
                overlay.style.background = '';
            });
            
            overlay.addEventListener('drop', (e) => {
                e.preventDefault();
                overlay.style.background = '';
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    handleTrainerPhoto(file, trainerId);
                }
            });
        }
    });
}

// Обработка фото тренера
function handleTrainerPhoto(file, trainerId) {
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Размер файла не должен превышать 5 МБ', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        
        // Сохраняем в localStorage
        localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
        APP_DATA.trainerPhotos[trainerId] = imageData;
        
        // Отображаем фото
        displayTrainerPhoto(trainerId, imageData);
        
        showNotification(`Фото ${getTrainerName(trainerId)} загружено!`, 'success');
    };
    reader.readAsDataURL(file);
}

// Отображение фото тренера
function displayTrainerPhoto(trainerId, imageData) {
    const imgElement = document.getElementById(`trainer-img-${trainerId}`);
    const placeholder = document.getElementById(`placeholder-${trainerId}`);
    
    if (imgElement && placeholder) {
        imgElement.src = imageData;
        imgElement.style.display = 'block';
        placeholder.style.display = 'none';
    }
}

// Загрузка сохраненных фото
function loadSavedTrainerPhotos() {
    if (APP_DATA.trainerPhotos.vladimir) {
        displayTrainerPhoto('vladimir', APP_DATA.trainerPhotos.vladimir);
    }
    if (APP_DATA.trainerPhotos.yana) {
        displayTrainerPhoto('yana', APP_DATA.trainerPhotos.yana);
    }
    if (APP_DATA.trainerPhotos.tatiana) {
        displayTrainerPhoto('tatiana', APP_DATA.trainerPhotos.tatiana);
    }
}

// Получение имени тренера
function getTrainerName(trainerId) {
    const names = {
        'vladimir': 'Владимира Лукьянова',
        'yana': 'Яны Лукьяновой',
        'tatiana': 'Татьяны Лукьяновой'
    };
    return names[trainerId] || 'тренера';
}

// Навигация по ценам
function initPricingNavigation() {
    document.querySelectorAll('.pricing-nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Подсветка секции
                targetSection.style.transition = 'all 0.3s ease';
                targetSection.style.backgroundColor = 'var(--primary-light)';
                
                setTimeout(() => {
                    targetSection.style.backgroundColor = '';
                }, 1000);
            }
        });
    });
}

// Обработка отправки формы
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const booking = {
        id: Date.now(),
        name: formData.get('name'),
        phone: formData.get('phone'),
        trainer: formData.get('trainer'),
        time: formData.get('time'),
        comment: formData.get('comment'),
        date: new Date().toLocaleString('ru-RU'),
        status: 'Новая'
    };
    
    // Сохраняем в локальное хранилище
    APP_DATA.bookings.push(booking);
    localStorage.setItem('starfit_bookings', JSON.stringify(APP_DATA.bookings));
    
    // Показываем успех
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('bookingSuccess');
    form.style.display = 'none';
    success.style.display = 'block';
    
    // Отправляем в Telegram
    sendToTelegram(booking);
    
    // Сбрасываем форму через 3 секунды
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        success.style.display = 'none';
    }, 3000);
    
    showNotification('Заявка отправлена! Мы свяжемся с вами.', 'success');
}

// Отправка в Telegram
function sendToTelegram(booking) {
    // Замените на свои данные
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    
    const trainerNames = {
        'vladimir': 'Владимир Лукьянов',
        'yana': 'Яна Лукьянова',
        'tatiana': 'Татьяна Лукьянова'
    };
    
    const message = `
⭐ НОВАЯ ЗАПИСЬ STAR FIT ⭐
────────────────
👤 Имя: ${booking.name}
📱 Телефон: ${booking.phone}
🏆 Тренер: ${trainerNames[booking.trainer] || 'Не выбран'}
⏰ Время: ${booking.time === '9-12' ? '09:00-12:00' : booking.time === '17-21' ? '17:00-21:00' : 'Не указано'}
💬 Комментарий: ${booking.comment || 'Нет'}
📅 Дата: ${booking.date}
────────────────
    `;
    
    // Раскомментируйте для отправки в Telegram
    /*
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => console.log('Отправлено в Telegram:', data))
    .catch(error => console.error('Ошибка:', error));
    */
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Анимации
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.trainer-card, .pricing-category, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// Маска для телефона
function initFormMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.startsWith('375')) {
                    value = '+375 ' + value.slice(3);
                } else if (value.startsWith('8')) {
                    value = '8 ' + value.slice(1);
                } else {
                    value = '+375 ' + value;
                }
                
                if (value.length > 6) {
                    value = value.slice(0, 6) + ' ' + value.slice(6);
                }
                if (value.length > 10) {
                    value = value.slice(0, 10) + ' ' + value.slice(10);
                }
                if (value.length > 13) {
                    value = value.slice(0, 13) + ' ' + value.slice(13);
                }
                if (value.length > 16) {
                    value = value.slice(0, 16);
                }
            }
            
            e.target.value = value;
        });
    }
}

// Количество клиентов в клубе
function initClientCount() {
    const countElement = document.querySelector('.clients-count');
    if (countElement) {
        updateClientCount();
        setInterval(updateClientCount, 60000);
    }
}

function updateClientCount() {
    const countElement = document.querySelector('.clients-count');
    if (countElement) {
        const hour = new Date().getHours();
        let baseCount = 0;
        
        if (hour >= 9 && hour < 12) baseCount = 18;
        else if (hour >= 17 && hour < 21) baseCount = 28;
        else if (hour >= 12 && hour < 17) baseCount = 8;
        else baseCount = 5;
        
        const random = Math.floor(Math.random() * 5) - 2;
        const total = Math.max(0, baseCount + random);
        countElement.textContent = total;
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}" style="color: var(--${type});"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: var(--gray); cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Экспорт для глобального доступа
window.showNotification = showNotification;
window.handleTrainerPhoto = handleTrainerPhoto;
