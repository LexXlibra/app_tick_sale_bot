document.addEventListener('DOMContentLoaded', () => {
    class MobileApp {
        constructor(config) {
            this.config = config;
            this.initializeApp();
            this.setupEventListeners();
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
                    <h1>Sale Ticket <span class="time">${this.config.app.timeIndicator}</span></h1>
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
            // Card rendering logic with more dynamic approach
            const cardGrids = document.querySelectorAll('.card-grid');
            cardGrids.forEach((grid, gridIndex) => {
                const cardsToRender = this.config.cardData.slice(
                    gridIndex * 3, 
                    gridIndex * 3 + 3
                );
                
                grid.innerHTML = cardsToRender.map(card => 
                    this.createCardHTML(card)
                ).join('');
            });
        }
        
        convertTo24HourFormat(timeString) {
            return timeString;
        }

        createCardHTML(cardData) {
            const convertedTime = this.convertTo24HourFormat(cardData.badge);
            
            return `
                <div class="card">
                    <div class="card-image ${cardData.background}">
                        <span class="badge time-badge"><i class="far fa-calendar-alt"></i>${convertedTime}</span>
                        ${this.renderBadges(cardData)}
                        ${this.renderProfile(cardData)}
                    </div>
                    <div class="card-title text-truncate">${cardData.title}</div>
                    <div class="card-subtitle">${cardData.subtitle}</div>
                </div>
            `;
        }
        
        renderBadges(cardData) {
            return `
                ${cardData.price ? `<span class="badge price-badge"><i class="fas fa-tag"></i>${cardData.price}</span>` : ''}
            `;
        }
        
        renderProfile(cardData) {
            // Profile rendering logic
            return `
                <div class="profile-circle">
                    ${cardData.profileInitial ? 
                        `<span class="profile-initial">${cardData.profileInitial}</span>` : 
                        `<img src="/a/88a326e8-d1b0-4c20-878c-c63b5b0d22f8" class="profile-image" alt="Profile">`
                    }
                </div>
            `;
        }
        
        setupCardInteractions() {
            // Remove scroll and interaction logic for card grids
            // This method is no longer needed with the grid layout
            console.log('Card grid interaction removed');
        }
        
        setupEventListeners() {
            // Tab and navigation event listeners
            // const tabs = document.querySelectorAll('.tab');
            // tabs.forEach(tab => {
            //     tab.addEventListener('click', () => {
            //         // Remove active class from all tabs
            //         tabs.forEach(t => t.classList.remove('active'));
                    
            //         // Add active class to clicked tab
            //         tab.classList.add('active');
                    
            //         // Subtle animation on tab change
            //         const section = document.querySelector('.section');
            //         section.style.opacity = '0.8';
            //         setTimeout(() => {
            //             section.style.opacity = '1';
            //         }, 150);
                    
            //         console.log(`Switched to ${tab.textContent} tab`);
            //     });
            // });
        }
    }
    
    // Initialize the app
    new MobileApp(config);
});