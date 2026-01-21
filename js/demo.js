/**
 * Demo Mode for Vibe V3
 * Activated via URL parameter: ?demo=true
 *
 * Features:
 * - Pre-filled inputs matching the demo script
 * - Scripted AI responses (not random)
 * - Visual cues for what to click next
 */

const Demo = {
    // Check if demo mode is active
    isActive: function() {
        const params = new URLSearchParams(window.location.search);
        return params.get('demo') === 'true';
    },

    // Demo data - pre-filled content for each moment
    data: {
        // Moment 1: Idea
        idea: "I want to start a meal prep business for working parents who get home late and don't have time to cook",

        // Moment 2: Mission
        mission: "I help working parents who get home after 6pm eat healthy dinners by delivering ready-to-heat meals weekly — because families deserve good food without the stress of cooking every night.",

        // Moment 3: Goals
        objectives: [
            "Get my first 5 paying customers",
            "Perfect 10 recipes I can make reliably",
            "Set up kitchen and delivery system"
        ],

        // Moment 4: Actions
        keyResults: [
            ["Talk to 10 neighbors this week about meal prep", "Get 5 people to commit to trying one week"],
            ["Test each recipe 3 times with family feedback", "Document costs and prep time for each"],
            ["Get food handler certification by end of month", "Do 3 test deliveries to friends"]
        ]
    },

    // Scripted AI responses for demo - keyed by moment and trigger
    responses: {
        1: {
            // Initial response after typing idea
            initial: `That's a solid start — meal prep is a real need. But let me push you a bit.<br><br>` +
                `<strong>"Working parents" is still broad.</strong> A meal prep service for parents of toddlers looks different from one for parents of teenagers. Single parents vs. two-income households have different needs.<br><br>` +
                `<strong>Here's your challenge:</strong> Can you describe ONE specific person? Give them a name. What's their day like? When do they get home? What do they currently do for dinner?<br><br>` +
                `The more specific you get, the easier everything else becomes.`,

            // Response to "Push back on my idea" quick reply
            pushback: `Let me be direct: <strong>Have you actually talked to any working parents about this?</strong><br><br>` +
                `Not "would you like healthy meals?" — that's a leading question. Everyone says yes to that.<br><br>` +
                `The real question: <strong>"What do you currently do for dinner on busy nights? What's frustrating about it?"</strong><br><br>` +
                `If you haven't had these conversations yet, that's your first action. Find 5 working parents this week. Don't pitch — just listen.<br><br>` +
                `What you learn might change your entire approach. Are you willing to do that before building anything?`,

            // Response to "Give me an example"
            example: `Here's how another meal prep entrepreneur started:<br><br>` +
                `<strong>Maria</strong> thought she'd serve "busy families." Too vague. After talking to people, she narrowed to: "Working moms in my zip code with kids under 10 who get home after 6pm."<br><br>` +
                `Why that specific? Because:<br>` +
                `• She could actually FIND them (school pickup, neighborhood Facebook groups)<br>` +
                `• They had a specific pain point (dinner crunch between 6-8pm)<br>` +
                `• They could afford $50-80/week for convenience<br><br>` +
                `<strong>Your turn:</strong> Who's YOUR Maria? One specific person you could go find this week.`
        },

        2: {
            // Review mission
            review: `Let me be honest about your mission:<br><br>` +
                `<strong>"I help working parents who get home after 6pm eat healthy dinners by delivering ready-to-heat meals weekly"</strong><br><br>` +
                `✓ <strong>WHO:</strong> Specific — "working parents who get home after 6pm"<br>` +
                `✓ <strong>WHAT:</strong> Clear outcome — "eat healthy dinners"<br>` +
                `✓ <strong>HOW:</strong> Concrete — "ready-to-heat meals weekly"<br><br>` +
                `This is solid. I can picture the person and understand what they get.<br><br>` +
                `<strong>One push:</strong> "Weekly" delivery — is that based on what customers want, or what's convenient for you? Have you asked them?`
        },

        3: {
            // Challenge goals
            challenge: `Let me look at your goals:<br><br>` +
                `<strong>Goal 1: "Get my first 5 paying customers"</strong><br>` +
                `→ <strong>Good.</strong> Specific number. This is what matters most — without customers, nothing else matters.<br><br>` +
                `<strong>Goal 2: "Perfect 10 recipes I can make reliably"</strong><br>` +
                `→ <strong>Watch out.</strong> Don't perfect recipes BEFORE you have customers. You might make 10 recipes nobody wants. Can you test with real customers instead?<br><br>` +
                `<strong>Goal 3: "Set up kitchen and delivery system"</strong><br>` +
                `→ <strong>Too vague.</strong> What specifically needs to be set up? By when?<br><br>` +
                `<strong>My challenge:</strong> Goal 1 should happen FIRST. Get 5 paying customers before you perfect anything else. What's stopping you from starting this week?`,

            // Cross-domain insight
            crossdomain: `Here's what worked for a <strong>house cleaner</strong> I know — and it applies to meal prep too:<br><br>` +
                `She didn't start by buying equipment or making flyers. She cleaned 3 friends' houses for free to get before/after photos. Then she asked each friend to introduce her to 2 people who needed cleaning.<br><br>` +
                `Within a month, she had 6 paying clients — all from referrals, zero advertising spend.<br><br>` +
                `<strong>Your version:</strong> Could you make meals for 3 families for free (or cheap) to get testimonials and photos? Then ask each to introduce you to 2 other busy parents?<br><br>` +
                `The pattern: <strong>Start with people you know, deliver value, ask for introductions.</strong> What do you think?`
        },

        4: {
            // Challenge actions
            challenge: `Let me check your actions:<br><br>` +
                `<strong>"Talk to 10 neighbors this week"</strong><br>` +
                `→ <strong>Excellent.</strong> Specific number, specific timeframe. This is exactly right.<br><br>` +
                `<strong>"Get 5 people to commit to trying one week"</strong><br>` +
                `→ <strong>Good goal.</strong> But "commit" how? Verbal yes? Deposit? The more concrete the commitment, the more real it is.<br><br>` +
                `<strong>"Test each recipe 3 times"</strong><br>` +
                `→ <strong>Question:</strong> Are you testing with YOUR family or with CUSTOMERS? Testing with customers is more valuable.<br><br>` +
                `<strong>Overall:</strong> These are measurable. Now the question is — will you actually do them this week?`
        },

        5: {
            // Final review
            review: `You've built a real plan. Let me give you my honest take:<br><br>` +
                `<strong>What's strong:</strong><br>` +
                `• Specific customer: working parents, home after 6pm<br>` +
                `• Clear first goal: 5 paying customers<br>` +
                `• Measurable actions: 10 conversations this week<br><br>` +
                `<strong>What to watch:</strong><br>` +
                `• Don't perfect recipes before you have customers<br>` +
                `• "Commit" needs to mean something concrete (deposit?)<br><br>` +
                `<strong>Your one thing this week:</strong> Have those 10 conversations. Don't pitch — ask "What do you do for dinner on busy nights? What's frustrating?"<br><br>` +
                `Everything else can wait until you've done that. Will you do it?`
        }
    },

    // Initialize demo mode for a specific moment
    init: function(momentId) {
        if (!this.isActive()) return false;

        console.log('Demo mode active for Moment ' + momentId);

        // Add demo mode indicator
        this.addDemoIndicator();

        // Pre-fill data based on moment
        this.prefillData(momentId);

        // Add visual cues
        this.addVisualCues(momentId);

        return true;
    },

    // Add demo mode indicator banner
    addDemoIndicator: function() {
        const banner = document.createElement('div');
        banner.id = 'demo-banner';
        banner.innerHTML = `
            <div style="background: #7c3aed; color: white; padding: 8px 16px; text-align: center; font-size: 14px; position: fixed; top: 0; left: 0; right: 0; z-index: 1000;">
                <strong>DEMO MODE</strong> — Scripted responses active. <a href="${window.location.pathname}" style="color: #fef3c7;">Exit demo</a>
            </div>
        `;
        document.body.prepend(banner);
        document.body.style.paddingTop = '40px';
    },

    // Pre-fill form data
    prefillData: function(momentId) {
        switch(momentId) {
            case 1:
                // Pre-fill idea
                const ideaInput = document.getElementById('idea');
                if (ideaInput) {
                    ideaInput.value = this.data.idea;
                    Session.saveField('idea', this.data.idea);
                }
                break;

            case 2:
                // Pre-fill mission
                const missionInput = document.getElementById('mission');
                if (missionInput) {
                    missionInput.value = this.data.mission;
                    Session.saveField('mission', this.data.mission);
                }
                break;

            case 3:
                // Pre-fill objectives
                this.data.objectives.forEach((obj, i) => {
                    const input = document.getElementById(`objectives_${i}`);
                    if (input) {
                        input.value = obj;
                        Session.saveField(`objectives.${i}`, obj);
                    }
                });
                break;

            case 4:
                // Pre-fill key results
                this.data.keyResults.forEach((krs, i) => {
                    krs.forEach((kr, j) => {
                        const input = document.getElementById(`keyResults_${i}_${j}`);
                        if (input) {
                            input.value = kr;
                            Session.saveField(`keyResults.${i}.${j}`, kr);
                        }
                    });
                });
                break;
        }
    },

    // Add visual cues for demo navigation
    addVisualCues: function(momentId) {
        // Add pulsing effect to quick reply buttons
        const quickReplies = document.querySelectorAll('.quick-reply-btn');
        if (quickReplies.length > 0) {
            quickReplies[0].classList.add('demo-highlight');
        }

        // Add CSS for demo highlights
        const style = document.createElement('style');
        style.textContent = `
            .demo-highlight {
                animation: pulse 2s infinite;
                box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7);
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(124, 58, 237, 0); }
                100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
            }
            .demo-next-cue {
                background: #7c3aed !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    },

    // Get scripted response for demo
    getResponse: function(momentId, trigger) {
        const momentResponses = this.responses[momentId];
        if (!momentResponses) return null;

        // Try to match trigger to a scripted response
        const triggerLower = trigger.toLowerCase();

        if (triggerLower.includes('push back') || triggerLower.includes('challenge')) {
            return momentResponses.pushback || momentResponses.challenge;
        }
        if (triggerLower.includes('example')) {
            return momentResponses.example;
        }
        if (triggerLower.includes('review')) {
            return momentResponses.review;
        }
        if (triggerLower.includes('missing') || triggerLower.includes('cross') || triggerLower.includes('other')) {
            return momentResponses.crossdomain;
        }

        // Default to initial response
        return momentResponses.initial || momentResponses.review || null;
    }
};

// Export for use in moment files
window.Demo = Demo;
