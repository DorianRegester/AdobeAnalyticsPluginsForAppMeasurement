/**
 * @name HardwareContextAuditor
 * @version 1.0.0 (2026 Privacy-Safe Edition)
 * @description Audits hardware capability, network quality, and privacy signals.
 */
window.HardwareContextAuditor = (function() {
    const nav = window.navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};

    const getHardwareData = () => {
        return {
            // Technical Tiering
            bot: nav.webdriver ? 'Y' : 'N',
            net: conn.effectiveType || 'unknown',
            cpu: nav.hardwareConcurrency || 'n/a',
            ram: nav.deviceMemory || 'n/a', // Restricted in some browsers
            touch: nav.maxTouchPoints || 0,
            
            // Capabilities
            pdf: nav.pdfViewerEnabled ? 'Y' : 'N',
            save: conn.saveData ? 'Y' : 'N',
            motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Red' : 'Std',
            
            // Modern Privacy (DNT is deprecated, GPC is the 2026 standard)
            gpc: nav.globalPrivacyControl ? 'Y' : 'N',
            
            // Localization
            lang: nav.languages ? nav.languages.slice(0, 2).join(',') : nav.language
        };
    };

    const audit = () => {
        const data = getHardwareData();
        
        // Construct piped string for an eVar
        const eVarValue = [
            'B:' + data.bot,
            'N:' + data.net,
            'C:' + data.cpu,
            'R:' + data.ram,
            'T:' + data.touch,
            'P:' + data.pdf,
            'S:' + data.save,
            'M:' + data.motion,
            'G:' + data.gpc,
            'L:' + data.lang
        ].join('|');

        // Broadcast for TMS (Adobe Launch)
        window.dispatchEvent(new CustomEvent('hardware_audit_event', { 
            detail: { 
                raw: data,
                formatted: eVarValue 
            } 
        }));

        console.log(`[HardwareAudit] Tier: ${data.cpu}core/${data.ram}GB | Net: ${data.net}`);
        return eVarValue;
    };

    // Auto-run or export
    if (document.readyState === 'complete') audit();
    else window.addEventListener('load', audit);

    return { run: audit };
})();
