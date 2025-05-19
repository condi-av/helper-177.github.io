// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    try {
        initTheme();
        initRatingSystem();
        animateOnScroll();
        setupServiceCards();
        setupModal();
        
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

// ====================== ТЕМА ====================== //
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else if (!localStorage.getItem('themeShown')) {
        setTimeout(showThemeModal, 3000);
    }
}

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
    updateThemeIcon();
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(isDark ? 'light' : 'dark');
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-switcher i');
    if (icon) {
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// Обработчик для кнопки смены темы
document.querySelector('.theme-switcher')?.addEventListener('click', toggleTheme);

// ====================== МОДАЛЬНОЕ ОКНО ====================== //
function setupModal() {
    const modal = document.getElementById('themeModal');
    if (!modal) return;

    document.getElementById('closeThemeModal')?.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.classList.contains('light-btn') ? 'light' : 'dark';
            setTheme(theme);
            modal.classList.remove('active');
            localStorage.setItem('themeShown', 'true');
        });
    });
}

function showThemeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.add('active');
    }
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

// ====================== ПРЕЛОАДЕР ====================== //
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// ====================== ЧАТ-КНОПКА ====================== //
document.querySelector('.chat-button')?.addEventListener('click', function() {
    // Дополнительные действия при клике на чат
    console.log('Чат открыт');
});
