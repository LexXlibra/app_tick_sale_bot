document.addEventListener('DOMContentLoaded', () => {
    class MobileApp {
        constructor(config) {
            this.config = config;
            this.activeCard = null;
            this.hideTimeout = null;
            this.lastScrollPosition = window.scrollY;
            this.initializeApp();
            this.setupScrollListener();
            this.setupClickOutsideListener();
        }

        initializeApp() {
            this.renderHeader();
            this.renderNavigation();
            this.renderCards();
            this.setupCardInteractions();
        }

        renderHeader() {
            const header = document.querySelector('header');
            header.innerHTML = `
                <div class="title-container">
                    <h1>${this.config.app.title} <span class="time">${this.config.app.timeIndicator}</span></h1>
                </div>
                <div></div>
            `;
        }

        renderNavigation() {
            const navContainer = document.querySelector('.bottom-nav');
            navContainer.innerHTML = this.config.navigation.map(item =>
                `<a href="#" class="nav-item ${item.active ? 'active' : ''}">
                    <i class="fas fa-${item.icon}"></i>
                    <span>${item.label}</span>
                </a>`
            ).join('');
        }

        renderCards() {
            const section = document.querySelector('.section');
            section.innerHTML = '<div class="card-grid"></div>';
            const cardGrid = section.querySelector('.card-grid');

            this.config.cardData.forEach((card, index) => {
                cardGrid.innerHTML += this.createCardHTML(card, index);
            });
        }

        createCardHTML(cardData, index) {
            const convertedTime = this.formatDate(cardData.badge);

            return `
                <div class="card">
                    <div class="card-image" style="background-image: ${cardData.background}">
                        <span class="badge time-badge"><i class="far fa-calendar-alt"></i>${convertedTime}</span>
                        ${this.renderBadges(cardData)}
                        <div class="card-popup-overlay">
                            <div class="popup-sphere">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-title text-truncate">${cardData.title}</div>
                    <div class="card-subtitle">${cardData.subtitle}</div>
                </div>
            `;
        }

        setupCardInteractions() {
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                card.addEventListener('click', () => this.handleCardClick(card, index));
            });
        }

        handleCardClick(card, index) {
            if (this.activeCard === card) return;

            // Clear any existing hide timeout
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }

            // Reset previous active card
            if (this.activeCard) {
                this.hideCardDetails();
            }

            // Activate new card
            card.classList.add('active');
            this.activeCard = card;

            // Calculate which side to show details
            const isRightSide = index % 2 === 0;
            let targetCard = isRightSide ? 
                card.nextElementSibling : 
                card.previousElementSibling;

            // If there's no adjacent card, create a temporary one
            if (!targetCard) {
                targetCard = this.createTemporaryCard(card, isRightSide);
            }

            this.showCardDetails(targetCard, this.config.cardData[index]);

            // Set auto-hide timeout
            /* @tweakable Time in milliseconds before details auto-hide */
            const AUTO_HIDE_DELAY = 5000;
            this.hideTimeout = setTimeout(() => {
                this.hideCardDetails();
            }, AUTO_HIDE_DELAY);
        }

        createTemporaryCard(sourceCard, isRightSide) {
            const tempCard = document.createElement('div');
            tempCard.className = 'card temporary-card';
            /* @tweakable Width of temporary card */
            tempCard.style.width = '100%';
            /* @tweakable Height of temporary card */
            tempCard.style.height = sourceCard.offsetHeight + 'px';
            
            if (isRightSide) {
                sourceCard.insertAdjacentElement('afterend', tempCard);
            } else {
                sourceCard.insertAdjacentElement('beforebegin', tempCard);
            }
            
            return tempCard;
        }

        setupScrollListener() {
            /* @tweakable Scroll threshold in pixels before hiding details */
            const SCROLL_THRESHOLD = 50;
            /* @tweakable Scroll check delay in milliseconds */
            const SCROLL_CHECK_DELAY = 150;
            
            let scrollTimeout;
            let touchStartY = 0;

            // Handle scroll events
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                
                scrollTimeout = setTimeout(() => {
                    const currentScroll = window.scrollY;
                    if (Math.abs(currentScroll - this.lastScrollPosition) > SCROLL_THRESHOLD) {
                        this.hideCardDetails();
                    }
                    this.lastScrollPosition = currentScroll;
                }, SCROLL_CHECK_DELAY);
            });

            // Handle touch events for mobile
            document.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            });

            document.addEventListener('touchmove', (e) => {
                const touchCurrentY = e.touches[0].clientY;
                /* @tweakable Touch movement threshold for hiding details */
                const TOUCH_THRESHOLD = 30;
                
                if (Math.abs(touchCurrentY - touchStartY) > TOUCH_THRESHOLD) {
                    this.hideCardDetails();
                }
            });
        }

        setupClickOutsideListener() {
            document.addEventListener('click', (event) => {
                if (this.activeCard && !event.target.closest('.card')) {
                    this.hideCardDetails();
                }
            });
        }

        hideCardDetails() {
            if (this.activeCard) {
                this.activeCard.classList.remove('active');
                const details = document.querySelector('.card-details.active');
                if (details) {
                    details.classList.remove('active');
                    /* @tweakable Animation duration for hiding details */
                    const ANIMATION_DURATION = 300;
                    
                    setTimeout(() => {
                        const parentCard = details.closest('.card');
                        if (parentCard) {
                            // Remove temporary card if it exists
                            if (parentCard.classList.contains('temporary-card')) {
                                parentCard.remove();
                            } else {
                                this.restoreOriginalContent(parentCard);
                            }
                        }
                    }, ANIMATION_DURATION);
                }
                this.activeCard = null;
            }
        }

        showCardDetails(targetCard, cardData) {
            // Remove existing content
            const originalContent = targetCard.innerHTML;
        
            // Create details panel
            const details = document.createElement('div');
            details.className = 'card-details';
            details.innerHTML = `
                <div class="card-details-title">${cardData.title}</div>
                <div class="card-details-description">
                    ${cardData.details || 'Подробная информация о мероприятии будет доступна позже.'}
                </div>
            `;

            // Replace content
            targetCard.innerHTML = '';
            targetCard.appendChild(details);
        
            // Animate in
            requestAnimationFrame(() => {
                details.classList.add('active');
            });
        }

        convertTo24HourFormat(timeString) {
            return timeString;
        }

        formatDate(dateString) {
            if (!dateString) return '';

            // Проверяем, является ли dateString датой в формате "dd.mm.yyyy"
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
                const parts = dateString.split('.');
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);

                const monthNames = [
                    "января", "февраля", "марта", "апреля", "мая", "июня",
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"
                ];

                if (month >= 1 && month <= 12) {
                    return `${day} ${monthNames[month - 1]}`;
                } else {
                    return dateString; // Возвращаем исходную строку, если месяц некорректный
                }
            } else {
                return dateString; // Возвращаем исходную строку, если это не дата в нужном формате
            }
        }

        renderBadges(cardData) {
            return `
                ${cardData.price ? `<span class="badge price-badge"><i class="fas fa-tag"></i>${cardData.price}</span>` : ''}
            `;
        }

        restoreOriginalContent(card) {
            const cardData = this.config.cardData[Array.from(card.parentElement.children).indexOf(card)];
            if (cardData) {
                card.innerHTML = this.createCardHTML(cardData, Array.from(card.parentElement.children).indexOf(card));
            }
        }
    }

    new MobileApp(config);
});
