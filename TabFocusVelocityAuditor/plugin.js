/**
 * @name tabFocusVelocityAuditor
 * @version 1.0.0
 * @description Measures tab switching frequency and total background time.
 */
window.tabFocusVelocityAuditor = (function() {
    const state = {
        switchCount: 0,
        totalBackgroundTime: 0,
        lastHiddenTime: null,
        startTime: new Date(),
        isCurrentlyVisible: document.visibilityState === 'visible'
    };

    const broadcast = () => {
        const totalSessionTime = (new Date() - state.startTime) / 1000;
        
        // Focus Velocity: Switches per Minute
        const velocity = ((state.switchCount / (totalSessionTime / 60)) || 0).toFixed(2);
        
        // Attention Share: % of time the tab was actually in the foreground
        const attentionShare = (((totalSessionTime - state.totalBackgroundTime) / totalSessionTime) * 100).toFixed(1);

        const detail = {
            action: 'attention_audit',
            switchCount: state.switchCount,
            velocity: velocity,
            attentionShare: attentionShare + '%',
            totalBackgroundSeconds: Math.floor(state.totalBackgroundTime)
        };

        window.dispatchEvent(new CustomEvent('attention_context_event', { detail }));
        
        console.log(`[AttentionAudit] Share: ${attentionShare}% | Velocity: ${velocity} switches/min`);
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            state.switchCount++;
            state.lastHiddenTime = new Date();
            state.isCurrentlyVisible = false;
        } else {
            if (state.lastHiddenTime) {
                const backgroundDuration = (new Date() - state.lastHiddenTime) / 1000;
                state.totalBackgroundTime += backgroundDuration;
            }
            state.isCurrentlyVisible = true;
            // Broadcast every time they return to the tab to update the state
            broadcast();
        }
    };

    // Initialize
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Final broadcast on exit attempt
    window.addEventListener('pagehide', broadcast);

    return { 
        getState: () => state,
        getMetrics: broadcast 
    };
})();
