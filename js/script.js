// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Сначала инициализируем тему (она должна быть первой)
        initThemeModal();
        initRatingSystem();
        animateOnScroll();
        setupServiceCards();
        
        // Проверка, если страница уже загружена
        if (document.readyState === 'complete') {
            hideLoader();
        }
    } catch (e) {
        console.error("Initialization error:", e);
        hideLoader();
    }
});

// Функция скрытия прелоадера
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Обработчик полной загрузки страницы
window.addEventListener('load', hideLoader);

// ====================== МОДАЛЬНОЕ ОКНО ТЕМЫ ====================== //
function initThemeModal() {
    // Проверяем, есть ли сохраненная тема
    const savedTheme = localStorage.getItem('theme');
    
    // Если тема уже выбрана ранее, применяем ее и не показываем модальное окно
    if (savedTheme) {
        setTheme(savedTheme);
        setupThemeEventListeners();
        return; // Выходим из функции, не показывая модальное окно
    }
    
    // Показываем модальное окно только если тема еще не выбрана
    showThemeModal();
    setupThemeEventListeners();
}

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
}

function showThemeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideThemeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function setupThemeEventListeners() {
    // Обработчики для кнопок выбора темы
    document.querySelector('.light-btn')?.addEventListener('click', function() {
        setTheme('light');
        hideThemeModal();
    });
    
    document.querySelector('.dark-btn')?.addEventListener('click', function() {
        setTheme('dark');
        hideThemeModal();
    });
    
    // Также можно добавить обработчик для закрытия по клику вне окна
    document.getElementById('themeModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideThemeModal();
        }
    });
}

// ====================== СИСТЕМА ОЦЕНОК ====================== //
function initRatingSystem() {
    // Загрузка сохраненных оценок
    document.querySelectorAll('.rating-stars').forEach(container => {
        const service = container.dataset.service;
        const savedRating = localStorage.getItem(`rating_${service}`);
        
        if (savedRating) {
            updateStars(container, savedRating);
        }
    });

    // Обработка кликов по звездам
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            const container = this.closest('.rating-stars');
            const service = container.dataset.service;
            
            localStorage.setItem(`rating_${service}`, rating);
            updateStars(container, rating);
            animateStar(this);
        });
    });
}

function updateStars(container, rating) {
    container.querySelectorAll('.star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function animateStar(star) {
    star.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.3)', opacity: 0.7 },
        { transform: 'scale(1.1)', opacity: 1 }
    ], {
        duration: 300,
        easing: 'ease-out'
    });
}

// ====================== АНИМАЦИИ ====================== //
function setupServiceCards() {
    // Устанавливаем индекс для анимации
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
}

function animateOnScroll() {
    const cards = document.querySelectorAll('.service-card');
    const windowHeight = window.innerHeight;
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;
        
        if (cardTop < windowHeight * 0.8) {
            card.style.animationPlayState = 'running';
        }
    });
}

// Оптимизированный обработчик скролла
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        animateOnScroll();
    }, 50);
}, { passive: true });
