/**
 * Card Interactions System
 * Handles card clicks, details display, and click outside events
 */
class CardInteractions {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        
        /* @tweakable Duration for animation transition overlap in ms */
        this.animationOverlap = 50;
        
        /* @tweakable Auto-hide delay for card details in minutes */
        this.autoHideDelayMinutes = 2;
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.card:not(.load-more-card):not(.loading-card)');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleCardClick(card, index));
        });

        // Setup load more button click
        const loadMoreBtn = document.getElementById('loadMoreButton');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Check if we need to load more or refresh
                if (this.app.cardLoader.hasMoreCards()) {
                    // Load more cards
                    this.app.cardLoader.loadMoreCards((cards, isInitial, isLoading, isRefreshing) => {
                        this.app.renderCards(cards, isInitial, isLoading, isRefreshing);
                    });
                } else {
                    // Refresh all cards
                    this.app.cardLoader.refreshCards((cards, isInitial, isLoading, isRefreshing) => {
                        this.app.renderCards(cards, isInitial, isLoading, isRefreshing);
                    });
                }
            });
        }
    }

    handleCardClick(card, index) {
        // Clear any existing hide timeout
        if (this.app.hideTimeout) {
            clearTimeout(this.app.hideTimeout);
            this.app.hideTimeout = null;
        }

        // If the same card is clicked twice, do nothing
        if (this.app.activeCard === card) return;

        // If another card is already active
        if (this.app.activeCard) {
            const previousCard = this.app.activeCard;
            const previousDetails = document.querySelector('.card-details.active');

            // Start hiding the current active card's details
            if (previousDetails) {
                previousDetails.classList.remove('active');
                previousDetails.classList.add('hiding');
            }

            previousCard.classList.remove('active');

            // Set this.activeCard to the new card immediately to prevent race conditions
            this.app.activeCard = card;

            // Activate new card after a short delay to allow the hiding animation to start
            setTimeout(() => {
                // Continue with showing the new card details
                this.showNewCardDetails(card, index);

                // Clean up the previous card after its animation completes
                setTimeout(() => {
                    if (previousDetails) {
                        previousDetails.classList.remove('hiding');
                        const parentCard = previousDetails.closest('.card');
                        if (parentCard) {
                            // Remove temporary card if it exists
                            if (parentCard.classList.contains('temporary-card')) {
                                parentCard.remove();
                            } else {
                                this.app.restoreOriginalContent(parentCard);
                            }
                        }
                    }
                }, this.config.animations.detailsDisappearDuration - this.animationOverlap);
            }, this.animationOverlap);
        } else {
            // No active card, just activate the new one
            this.app.activeCard = card;
            this.showNewCardDetails(card, index);
        }
    }

    showNewCardDetails(card, index) {
        // Activate the card
        card.classList.add('active');

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
            arrow.className = isRightSide ? 'fas fa-arrow-right' : 'fas fa-arrow-left';
        }

        this.showCardDetails(targetCard, this.config.cardData[index]);

        // Clear any existing hide timeout
        if (this.app.hideTimeout) {
            clearTimeout(this.app.hideTimeout);
        }

        // Set auto-hide timeout
        const AUTO_HIDE_DELAY = this.autoHideDelayMinutes * 60 * 1000;
        this.app.hideTimeout = setTimeout(() => {
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

    hideCardDetails() {
        if (this.app.activeCard) {
            this.app.activeCard.classList.remove('active');
            const details = document.querySelector('.card-details.active');
            if (details) {
                details.classList.remove('active');
                details.classList.add('hiding');

                /* @tweakable Animation duration for hiding card details */
                const ANIMATION_DURATION = this.config.animations.detailsDisappearDuration;

                setTimeout(() => {
                    details.classList.remove('hiding');
                    const parentCard = details.closest('.card');
                    if (parentCard) {
                        // Remove temporary card if it exists
                        if (parentCard.classList.contains('temporary-card')) {
                            parentCard.remove();
                        } else {
                            this.app.restoreOriginalContent(parentCard);
                        }
                    }
                }, ANIMATION_DURATION);
            }
            this.app.activeCard = null;
        }
    }

    showCardDetails(targetCard, cardData) {
        // Store original content
        const isLoadMoreButton = targetCard.id === 'loadMoreButton' || targetCard.classList.contains('load-more-card');
        if (!isLoadMoreButton && !targetCard.dataset.originalContent) {
            targetCard.dataset.originalContent = targetCard.innerHTML;
        }

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

        // Animate in with a slight delay for better visual effect
        /* @tweakable Delay before showing details in ms */
        const DETAILS_DELAY = this.config.animations.detailsDelay;

        setTimeout(() => {
            details.classList.add('active');
        }, DETAILS_DELAY);
    }
}

// Export the class for use in app.js
window.CardInteractions = CardInteractions;