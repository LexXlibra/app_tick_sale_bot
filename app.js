document.addEventListener('DOMContentLoaded', () => {
    class MobileApp {
        constructor(config) {
            this.config = config;
            this.activeCard = null;
            this.hideTimeout = null;
            this.lastScrollPosition = window.scrollY;
            this.initializeApp();
            this.setupCardInteractions();
            this.setupClickOutsideListener();
        }

        initializeApp() {
            this.renderHeader();
            this.renderNavigation();
            this.renderCards();
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
            
            // Add load more button
            cardGrid.innerHTML += this.createLoadMoreButton();
        }
        
        createLoadMoreButton() {
            /* @tweakable Load more button background color */
            const LOAD_MORE_BG_COLOR = 'rgba(0, 0, 0, 0.05)';
            /* @tweakable Load more button icon size */
            const LOAD_MORE_ICON_SIZE = '24px';
            /* @tweakable Load more button corner radius */
            const LOAD_MORE_RADIUS = 'var(--card-radius)';
            /* @tweakable Load more button hover effect intensity */
            const LOAD_MORE_HOVER_SCALE = '1.1';
            
            return `
                <div class="card load-more-card" id="loadMoreButton">
                    <div class="load-more-container" style="background-color: ${LOAD_MORE_BG_COLOR}; border-radius: ${LOAD_MORE_RADIUS};">
                        <i class="fas fa-sync-alt" style="font-size: ${LOAD_MORE_ICON_SIZE};"></i>
                    </div>
                    <div class="card-title text-truncate">Загрузить ещё</div>
                    <div class="card-subtitle">Показать больше событий</div>
                </div>
            `;
        }

        createCardHTML(cardData, index) {
            const convertedTime = this.formatDate(cardData.badge);
            /* @tweakable Price prefix */
            const pricePrefix = "от ";
            /* @tweakable Currency symbol */
            const currencySymbol = "₽";
            /* @tweakable Separator between date and time in badge */
            const dateTimeSeparator = " ";
            /* @tweakable Time prefix in card badge */
            const timePrefix = "В ";

            return `
                <div class="card">
                    <div class="card-image" style="background-image: ${cardData.background}">
                        <span class="badge time-badge"><i class="far fa-calendar-alt"></i>${convertedTime}${cardData.time ? dateTimeSeparator + timePrefix + this.convertTo24HourFormat(cardData.time) : ''}</span>
                        ${this.renderBadges(cardData, pricePrefix, currencySymbol)}
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
            const cards = document.querySelectorAll('.card:not(.load-more-card)');
            cards.forEach((card, index) => {
                card.addEventListener('click', () => this.handleCardClick(card, index));
            });

            // Setup load more button click
            const loadMoreBtn = document.getElementById('loadMoreButton');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    /* @tweakable Number of new cards to load */
                    const CARDS_TO_LOAD = 3;
                    alert(`Загрузка дополнительных ${CARDS_TO_LOAD} мероприятий...`);
                    // Actual loading logic would go here
                });
            }
        }

        handleCardClick(card, index) {
            if (this.activeCard === card) return;

            // Check if a card is already active and a different card is clicked
            if (this.activeCard && this.activeCard !== card) {
                this.hideCardDetails();
                this.activeCard = null; // Reset activeCard to prevent immediate details display
                return; // Exit to prevent showing details for this click
            }

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

            // Set arrow direction based on details position
            const arrow = card.querySelector('.popup-sphere i');
            if (arrow) {
                /* @tweakable Arrow direction classes [CSS classes to control the arrow direction in the card popup sphere] */
                arrow.className = isRightSide ? 'fas fa-arrow-right' : 'fas fa-arrow-left';
            }

            this.showCardDetails(targetCard, this.config.cardData[index]);

            // Set auto-hide timeout
            /* @tweakable Time in milliseconds before details auto-hide [Delay in milliseconds before automatically hiding the card details panel after it's shown] */
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


        setupClickOutsideListener() {
            document.addEventListener('click', (event) => {
                if (this.activeCard && !event.target.closest('.card')) {
                    this.hideCardDetails();
                }
            });
        }

        /**
         * Hides the active card's details panel.
         *
         * This function handles the logic for closing the detailed information panel
         * associated with a card. It removes the 'active' class from the card,
         * which triggers the CSS transition to hide the details. It also resets
         * the activeCard property and restores the original content of the card
         * after the animation completes.
         */
        hideCardDetails() {
            if (this.activeCard) {
                this.activeCard.classList.remove('active');
                const details = document.querySelector('.card-details.active');
                if (details) {
                    details.classList.remove('active');
                    /* @tweakable Animation duration for hiding details [Duration of the animation when hiding the card details panel in milliseconds] */
                    const ANIMATION_DURATION = this.config.animations.hideDetailsDuration; // Use config value for animation duration

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
            // Store original content only if it's not the load more button
            const isLoadMoreButton = targetCard.classList.contains('load-more-card');
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
            
            // Store original content for restoration, but only if it's not the load more button
            if (!isLoadMoreButton) {
                targetCard.dataset.originalContent = originalContent;
            }
        
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

        renderBadges(cardData, pricePrefix = "от ", currencySymbol = "₽") {
            return `
                ${cardData.price && cardData.price !== "Бесплатно" ? `<span class="badge price-badge"><i class="fas fa-tag"></i>${pricePrefix}${cardData.price}${currencySymbol}</span>` : (cardData.price === "Бесплатно" ? `<span class="badge price-badge"><i class="fas fa-tag"></i>${cardData.price}</span>` : '')}
            `;
        }

        restoreOriginalContent(card) {
            // Check if it's the load more button card
            if (card.classList.contains('load-more-card')) {
                // Re-generate the load more button
                card.innerHTML = this.createLoadMoreButton();
                
                // Re-attach event listener to the new button
                const loadMoreBtn = document.getElementById('loadMoreButton');
                if (loadMoreBtn) {
                    loadMoreBtn.addEventListener('click', () => {
                        /* @tweakable Number of new cards to load */
                        const CARDS_TO_LOAD = 3;
                        alert(`Загрузка дополнительных ${CARDS_TO_LOAD} мероприятий...`);
                        // Actual loading logic would go here
                    });
                }
                return;
            }
            
            // For regular cards
            const cardData = this.config.cardData[Array.from(card.parentElement.children).indexOf(card)];
            if (cardData) {
                card.innerHTML = this.createCardHTML(cardData, Array.from(card.parentElement.children).indexOf(card));
            }
        }
    }

    new MobileApp(config);
});
