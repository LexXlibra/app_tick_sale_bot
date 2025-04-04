document.addEventListener('DOMContentLoaded', () => {
    class EventDetailsPage {
        constructor() {
            this.indicatorsSystem = new EventIndicatorsSystem();
            
            /* @tweakable Delay before animations start in ms */
            this.animationStartDelay = 100;
            
            /* @tweakable Duration of share tooltip visibility in ms */
            this.shareTooltipDuration = 2000;
            
            /* @tweakable Duration of toast notifications in ms */
            this.toastDuration = 3000;
            
            /* @tweakable Map zoom level (higher number = closer zoom) */
            this.mapZoomLevel = 15;
            
            /* @tweakable Latitude for event location */
            this.eventLat = 55.753215;
            
            /* @tweakable Longitude for event location */
            this.eventLng = 37.622504;
            
            this.initPage();
        }
        
        initPage() {
            // Get event data from URL or use default
            const eventId = this.getEventIdFromUrl() || 1;
            const eventData = this.getEventData(eventId);
            
            this.renderEventDetails(eventData);
            this.initMap();
            this.setupEventListeners();
            
            // Add indicators
            this.addEventIndicators(eventData);
            
            // Start animations after a small delay
            setTimeout(() => {
                this.triggerAnimations();
            }, this.animationStartDelay);
        }
        
        getEventIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }
        
        getEventData(eventId) {
            // In a real app, this would fetch data from an API
            // For now, we'll use one of the events from config
            return config.cardData[1]; // Using the second event as a demo
        }
        
        renderEventDetails(eventData) {
            // Update page title
            document.title = `${eventData.title} - Детали мероприятия`;
            
            // Update event banner content
            const eventTitle = document.querySelector('.event-title');
            const eventDate = document.querySelector('.event-date');
            const eventPrice = document.querySelector('.event-price');
            const eventBanner = document.querySelector('.event-banner');
            const eventDescription = document.querySelector('.event-description p');
            
            if (eventTitle) eventTitle.textContent = eventData.title;
            
            if (eventDate) {
                const timeElement = eventDate.querySelector('.event-time');
                if (timeElement && eventData.time) {
                    timeElement.textContent = `В ${eventData.time}`;
                }
            }
            
            if (eventPrice) {
                const priceText = eventData.price === "Бесплатно" ? 
                    "Бесплатно" : 
                    `от ${eventData.price}₽`;
                eventPrice.innerHTML = `<i class="fas fa-tag"></i> ${priceText}`;
            }
            
            if (eventBanner && eventData.background) {
                eventBanner.style.backgroundImage = eventData.background;
            }
            
            if (eventDescription && eventData.details) {
                eventDescription.textContent = eventData.details;
            }
        }
        
        addEventIndicators(eventData) {
            if (!eventData.indicators || !eventData.indicators.length) return;
            
            const indicatorsContainer = document.getElementById('eventIndicators');
            if (!indicatorsContainer) return;
            
            const indicatorsHTML = this.indicatorsSystem.createIndicators(eventData);
            indicatorsContainer.innerHTML = indicatorsHTML;
        }
        
        initMap() {
            // Initialize map (using Yandex Maps in this example)
            const mapElement = document.getElementById('eventMap');
            if (!mapElement) return;
            
            // Check if Yandex Maps API is loaded
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(() => {
                    const map = new ymaps.Map('eventMap', {
                        center: [this.eventLat, this.eventLng],
                        zoom: this.mapZoomLevel,
                        controls: ['zoomControl']
                    });
                    
                    const placemark = new ymaps.Placemark([this.eventLat, this.eventLng], {
                        hintContent: 'Место проведения'
                    }, {
                        preset: 'islands#redDotIcon'
                    });
                    
                    map.geoObjects.add(placemark);
                });
            } else {
                // Fallback for when maps API is not available
                mapElement.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%; text-align: center; color: var(--secondary-color);">
                        <div>
                            <i class="fas fa-map-marker-alt" style="font-size: 24px; margin-bottom: 10px;"></i>
                            <p>Карта временно недоступна</p>
                        </div>
                    </div>
                `;
            }
        }
        
        setupEventListeners() {
            // Buy ticket button
            const buyTicketBtn = document.getElementById('buyTicketBtn');
            if (buyTicketBtn) {
                buyTicketBtn.addEventListener('click', () => {
                    this.showToast('Покупка билета будет доступна позже');
                });
            }
            
            // Share button
            const shareButton = document.querySelector('.share-button');
            if (shareButton) {
                shareButton.addEventListener('click', () => {
                    // Try to use native sharing if available
                    if (navigator.share) {
                        navigator.share({
                            title: document.title,
                            url: window.location.href
                        }).catch(err => {
                            console.error('Share failed:', err);
                            this.showToast('Поделиться не удалось');
                        });
                    } else {
                        // Fallback for browsers without native sharing
                        this.showToast('Ссылка скопирована в буфер обмена');
                        this.copyToClipboard(window.location.href);
                    }
                });
            }
            
            // Profile cards
            const profileCards = document.querySelectorAll('.profile-card');
            profileCards.forEach(card => {
                card.addEventListener('click', () => {
                    const name = card.querySelector('.profile-name').textContent;
                    this.showToast(`Профиль: ${name}`);
                });
            });
        }
        
        showToast(message) {
            // Create and show a toast notification
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            
            // Apply styles
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                zIndex: '1000',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.opacity = '1';
            }, 10);
            
            // Remove after duration
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, this.toastDuration);
        }
        
        copyToClipboard(text) {
            // Create temporary input element
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = '0';
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
        
        triggerAnimations() {
            // This method is called after a short delay to ensure all elements are ready
            // The animations are defined in CSS with delays, so we just need to ensure
            // they are visible and ready to animate
            const animatedElements = document.querySelectorAll(
                '.event-title, .event-meta, .ticket-button, ' +
                '.event-description, .participants-section, .map-section, ' +
                '.profile-card'
            );
            
            animatedElements.forEach(el => {
                el.style.visibility = 'visible';
            });
        }
    }
    
    // Initialize the page
    new EventDetailsPage();
});