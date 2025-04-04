/**
 * Event Indicators System
 * This file handles the display of category indicators on event cards
 */

class EventIndicatorsSystem {
    constructor() {
        /* @tweakable The size of indicator icons on desktop */
        this.desktopIndicatorSize = 20;
        
        /* @tweakable The size of indicator icons on mobile */
        this.mobileIndicatorSize = 16;
        
        /* @tweakable Maximum number of indicators to show at once */
        this.maxVisibleIndicators = 3;
        
        /* @tweakable Gap between indicators in pixels */
        this.indicatorGap = 4;
        
        /* @tweakable Tooltip display delay in ms */
        this.tooltipDelay = 500;
        
        /* @tweakable Indicator shadow intensity */
        this.shadowIntensity = "0 1px 2px rgba(0, 0, 0, 0.2)";
        
        this.indicatorTypes = {
            age: {
                icon: 'user-shield',
                color: '#007aff',
                class: 'indicator-age'
            },
            discount: {
                icon: 'percent',
                color: '#34c759',
                class: 'indicator-discount'
            },
            bonus: {
                icon: 'gift',
                color: '#ff9500',
                class: 'indicator-bonus'
            },
            dressCode: {
                icon: 'glasses',
                color: '#ff4081',
                class: 'indicator-dress-code'
            },
            priceIncrease: {
                icon: 'percent',
                color: '#f44336',
                class: 'indicator-price-increase'
            },
            popular: {
                icon: 'heart',
                color: '#f44336',
                class: 'indicator-popular'
            },
            featured: {
                icon: 'star',
                color: '#ffeb3b',
                class: 'indicator-featured'
            }
        };
    }
    
    /**
     * Create indicators for an event card
     * @param {Object} eventData - The event data containing indicator information
     * @return {String} - HTML string of indicators
     */
    createIndicators(eventData) {
        if (!eventData.indicators || !eventData.indicators.length) {
            return '';
        }
        
        const indicators = eventData.indicators.slice(0, this.maxVisibleIndicators);
        
        const indicatorsHTML = indicators.map(ind => {
            const type = this.indicatorTypes[ind.type];
            if (!type) return '';
            
            return `
                <div class="indicator ${type.class}" style="background-color: ${type.color}; box-shadow: ${this.shadowIntensity};">
                    <i class="fas fa-${type.icon}"></i>
                    <div class="indicator-tooltip">${ind.tooltip}</div>
                </div>
            `;
        }).join('');
        
        return `<div class="category-indicators">${indicatorsHTML}</div>`;
    }
    
    /**
     * Initialize event listeners for indicators
     */
    initializeIndicators() {
        // Apply mobile sizing via CSS media queries
        
        // Add hover/tap functionality for tooltips on mobile
        document.addEventListener('click', (e) => {
            const indicator = e.target.closest('.indicator');
            if (!indicator) return;
            
            const tooltip = indicator.querySelector('.indicator-tooltip');
            if (!tooltip) return;
            
            // Toggle tooltip visibility
            const isVisible = tooltip.style.opacity === '1';
            
            // Hide all other tooltips first
            document.querySelectorAll('.indicator-tooltip').forEach(t => {
                t.style.opacity = '0';
            });
            
            // Toggle current tooltip
            if (!isVisible) {
                tooltip.style.opacity = '1';
                
                // Auto-hide after some time
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                }, 3000);
            }
        });
    }
}

// Export the class for use in app.js
window.EventIndicatorsSystem = EventIndicatorsSystem;