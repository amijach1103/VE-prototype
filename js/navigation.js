/**
 * Vibe V3 - Navigation Manager
 * Handles moment-to-moment navigation and progress tracking
 */

const Navigation = {
    /**
     * Get URL with preserved query parameters (for demo mode)
     */
    getUrlWithParams(baseUrl) {
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.toString()) {
            return `${baseUrl}?${currentParams.toString()}`;
        }
        return baseUrl;
    },

    /**
     * Moment definitions
     */
    moments: [
        { id: 1, name: 'Your Idea', file: 'moment-1.html', duration: '3-5 min' },
        { id: 2, name: 'Your Mission', file: 'moment-2.html', duration: '5-7 min' },
        { id: 3, name: 'Your Goals', file: 'moment-3.html', duration: '5-7 min' },
        { id: 4, name: 'Your Actions', file: 'moment-4.html', duration: '7-10 min' },
        { id: 5, name: 'Your Plan', file: 'moment-5.html', duration: '3-5 min' }
    ],

    /**
     * Navigate to a specific moment
     */
    goToMoment(momentId) {
        if (!Session.isMomentAccessible(momentId)) {
            console.warn(`Moment ${momentId} is not accessible yet`);
            return false;
        }

        const moment = this.moments.find(m => m.id === momentId);
        if (moment) {
            window.location.href = this.getUrlWithParams(moment.file);
            return true;
        }
        return false;
    },

    /**
     * Go to next moment
     */
    next() {
        const current = Session.getCurrentMoment();
        if (current < 5) {
            Session.completeMoment(current);
            this.goToMoment(current + 1);
        } else {
            // Already at last moment, mark complete
            Session.completeMoment(5);
            this.showCompletion();
        }
    },

    /**
     * Go to previous moment
     */
    previous() {
        const current = this.getCurrentMomentFromUrl();
        if (current > 1) {
            this.goToMoment(current - 1);
        } else {
            window.location.href = this.getUrlWithParams('index.html');
        }
    },

    /**
     * Get current moment from URL
     */
    getCurrentMomentFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/moment-(\d)/);
        return match ? parseInt(match[1]) : 0;
    },

    /**
     * Go to landing/index page
     */
    goHome() {
        window.location.href = 'index.html';
    },

    /**
     * Show completion screen
     */
    showCompletion() {
        // Could redirect to a completion page or show modal
        alert('Congratulations! You\'ve completed your business plan.');
    },

    /**
     * Render progress indicator
     */
    renderProgress(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentMoment = this.getCurrentMomentFromUrl();
        const session = Session.load();

        let html = '<div class="progress-bar">';

        this.moments.forEach(moment => {
            const isCompleted = session.completedMoments.includes(moment.id);
            const isCurrent = moment.id === currentMoment;
            const isAccessible = Session.isMomentAccessible(moment.id);

            let statusClass = '';
            if (isCompleted) statusClass = 'completed';
            else if (isCurrent) statusClass = 'active';

            const clickable = isAccessible ? `onclick="Navigation.goToMoment(${moment.id})"` : '';
            const cursorStyle = isAccessible ? 'cursor: pointer;' : 'cursor: not-allowed; opacity: 0.5;';

            html += `
                <div class="progress-step ${statusClass}" ${clickable} style="${cursorStyle}">
                    <div class="progress-dot">${isCompleted ? '✓' : moment.id}</div>
                    <div class="progress-label">${moment.name}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Render moment header
     */
    renderHeader(containerId, momentId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const moment = this.moments.find(m => m.id === momentId);
        if (!moment) return;

        container.innerHTML = `
            <div class="moment-header">
                <div class="moment-badge">Moment ${momentId} of 5</div>
                <h1>${moment.name}</h1>
                <p class="moment-duration">${moment.duration}</p>
            </div>
        `;
    },

    /**
     * Render navigation buttons
     */
    renderNavButtons(containerId, momentId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            nextLabel = 'Save & Continue',
            backLabel = 'Back',
            onNext = null,
            showBack = momentId > 1,
            nextDisabled = false
        } = options;

        let html = '<div class="btn-group">';

        if (showBack) {
            html += `<button class="btn btn-secondary" onclick="Navigation.previous()">${backLabel}</button>`;
        }

        const nextOnClick = onNext
            ? `onclick="${onNext}"`
            : `onclick="Navigation.next()"`;

        const disabledAttr = nextDisabled ? 'disabled' : '';

        html += `<button class="btn btn-primary" ${nextOnClick} ${disabledAttr} id="nextBtn">${nextLabel}</button>`;
        html += '</div>';

        container.innerHTML = html;
    },

    /**
     * Enable/disable next button
     */
    setNextEnabled(enabled) {
        const btn = document.getElementById('nextBtn');
        if (btn) {
            btn.disabled = !enabled;
        }
    },

    /**
     * Initialize navigation for a moment page
     */
    init(momentId) {
        // Render progress bar
        this.renderProgress('progress-container');

        // Render header
        this.renderHeader('header-container', momentId);

        // Load any saved data for this moment
        this.loadSavedData(momentId);

        // Set up auto-save
        this.setupAutoSave();
    },

    /**
     * Load saved data into form fields
     */
    loadSavedData(momentId) {
        const session = Session.load();

        // Map moment IDs to their data fields
        const fieldMappings = {
            1: ['idea'],
            2: ['mission'],
            3: ['objectives.0', 'objectives.1', 'objectives.2'],
            4: ['keyResults.0.0', 'keyResults.0.1', 'keyResults.1.0', 'keyResults.1.1', 'keyResults.2.0', 'keyResults.2.1'],
            5: ['firstStep']
        };

        const fields = fieldMappings[momentId] || [];

        fields.forEach(field => {
            const value = Session.getField(field);
            const inputId = field.replace(/\./g, '_');
            const input = document.getElementById(inputId);
            if (input && value) {
                input.value = value;
            }
        });
    },

    /**
     * Set up auto-save on input changes
     */
    setupAutoSave() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                if (field) {
                    Session.saveField(field, e.target.value);
                }
            });
        });
    },

    /**
     * Save all form fields before navigation
     */
    saveAllFields() {
        document.querySelectorAll('input[data-field], textarea[data-field]').forEach(input => {
            const field = input.dataset.field;
            if (field) {
                Session.saveField(field, input.value);
            }
        });
    },

    /**
     * Validate required fields for a moment
     */
    validateMoment(momentId, requiredFields) {
        let isValid = true;
        const errors = [];

        requiredFields.forEach(field => {
            const value = Session.getField(field);
            if (!value || value.trim() === '') {
                isValid = false;
                errors.push(field);
            }
        });

        return { isValid, errors };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
