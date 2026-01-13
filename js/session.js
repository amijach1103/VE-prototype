/**
 * Vibe V3 - Session Manager
 * Handles localStorage persistence for micro-moments flow
 */

const Session = {
    STORAGE_KEY: 'vibe-session',

    /**
     * Save session data to localStorage
     */
    save(data) {
        const session = this.load();
        const updated = { ...session, ...data, lastUpdated: new Date().toISOString() };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    /**
     * Load session data from localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultSession();
        } catch (e) {
            console.error('Error loading session:', e);
            return this.getDefaultSession();
        }
    },

    /**
     * Get default session structure
     */
    getDefaultSession() {
        return {
            currentMoment: 1,
            completedMoments: [],
            startedAt: null,
            lastUpdated: null,
            data: {
                idea: '',
                mission: '',
                objectives: ['', '', ''],
                keyResults: [['', ''], ['', ''], ['', '']],
                reflections: ['', ''],
                firstStep: ''
            },
            chatHistory: {
                1: [],
                2: [],
                3: [],
                4: [],
                5: []
            }
        };
    },

    /**
     * Get current moment number
     */
    getCurrentMoment() {
        return this.load().currentMoment || 1;
    },

    /**
     * Check if a moment is completed
     */
    isMomentCompleted(moment) {
        const session = this.load();
        return session.completedMoments.includes(moment);
    },

    /**
     * Check if a moment is accessible (current or completed)
     */
    isMomentAccessible(moment) {
        const session = this.load();
        return moment <= session.currentMoment || session.completedMoments.includes(moment);
    },

    /**
     * Mark a moment as complete and advance
     */
    completeMoment(moment) {
        const session = this.load();

        if (!session.completedMoments.includes(moment)) {
            session.completedMoments.push(moment);
        }

        // Advance to next moment if this was the current one
        if (moment === session.currentMoment && moment < 5) {
            session.currentMoment = moment + 1;
        }

        this.save(session);
        return session;
    },

    /**
     * Start a new session
     */
    start() {
        const session = this.getDefaultSession();
        session.startedAt = new Date().toISOString();
        session.currentMoment = 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        return session;
    },

    /**
     * Check if there's an existing session to resume
     */
    hasExistingSession() {
        const session = this.load();
        return session.startedAt !== null && session.currentMoment > 0;
    },

    /**
     * Get session progress as percentage
     */
    getProgress() {
        const session = this.load();
        return Math.round((session.completedMoments.length / 5) * 100);
    },

    /**
     * Clear session and start fresh
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        return this.getDefaultSession();
    },

    /**
     * Save data for a specific field
     */
    saveField(field, value) {
        const session = this.load();

        // Handle nested fields like 'objectives.0' or 'keyResults.1.0'
        const parts = field.split('.');
        let target = session.data;

        for (let i = 0; i < parts.length - 1; i++) {
            const key = isNaN(parts[i]) ? parts[i] : parseInt(parts[i]);
            target = target[key];
        }

        const lastKey = isNaN(parts[parts.length - 1])
            ? parts[parts.length - 1]
            : parseInt(parts[parts.length - 1]);
        target[lastKey] = value;

        this.save(session);
        return session;
    },

    /**
     * Get data for a specific field
     */
    getField(field) {
        const session = this.load();
        const parts = field.split('.');
        let value = session.data;

        for (const part of parts) {
            const key = isNaN(part) ? part : parseInt(part);
            value = value[key];
            if (value === undefined) return '';
        }

        return value || '';
    },

    /**
     * Save chat message for a moment
     */
    saveChatMessage(moment, role, content) {
        const session = this.load();
        if (!session.chatHistory[moment]) {
            session.chatHistory[moment] = [];
        }
        session.chatHistory[moment].push({
            role,
            content,
            timestamp: new Date().toISOString()
        });
        this.save(session);
        return session;
    },

    /**
     * Get chat history for a moment
     */
    getChatHistory(moment) {
        const session = this.load();
        return session.chatHistory[moment] || [];
    },

    /**
     * Generate export text for completed plan
     */
    generateExport() {
        const session = this.load();
        const data = session.data;
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let text = `MY BUSINESS PLAN\nCreated: ${date}\n`;
        text += `${'='.repeat(40)}\n\n`;

        text += `MISSION\n${'-'.repeat(20)}\n`;
        text += `${data.mission || 'Not entered'}\n\n`;

        text += `GOALS & ACTIONS\n${'-'.repeat(20)}\n`;

        data.objectives.forEach((obj, i) => {
            if (obj) {
                text += `\nGoal ${i + 1}: ${obj}\n`;
                const krs = data.keyResults[i].filter(kr => kr);
                if (krs.length > 0) {
                    krs.forEach(kr => {
                        text += `  - ${kr}\n`;
                    });
                }
            }
        });

        if (data.firstStep) {
            text += `\nFIRST STEP\n${'-'.repeat(20)}\n`;
            text += `${data.firstStep}\n`;
        }

        text += `\n${'='.repeat(40)}\n`;
        text += `Created with Vibe Business Idea Builder\n`;

        return text;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Session;
}
