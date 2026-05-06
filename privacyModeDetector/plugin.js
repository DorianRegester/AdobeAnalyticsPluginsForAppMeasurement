/**
 * @name privacyModeDetector
 * @version 1.0.0 (2026 Edition)
 * @description Best-effort detection of Incognito/Private browsing modes.
 */
window.privacyModeDetector = (function() {
    var result = { isPrivate: false, method: 'none' };

    return new Promise(function(resolve) {
        // 1. Chrome/Edge/Chromium: Storage Quota Check
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(function(estimate) {
                // In Incognito, Chromium typically restricts the quota significantly 
                // compared to the device's actual disk space.
                if (estimate.quota < 120000000) { // ~120MB threshold
                    result = { isPrivate: true, method: 'quota_limit' };
                }
                finish();
            });
        } 
        // 2. Firefox: Service Worker Check
        else if ('serviceWorker' in navigator && (navigator.userAgent.indexOf("Firefox") > -1)) {
            // Firefox disables Service Workers in Private Mode
            navigator.serviceWorker.getRegistration().then(function() {
                result = { isPrivate: false, method: 'firefox_sw' };
                finish();
            }).catch(function() {
                result = { isPrivate: true, method: 'firefox_sw' };
                finish();
            });
        }
        // 3. Safari: IndexedDB Persistence Check
        else if (window.indexedDB && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            try {
                // Safari Private mode has historically restricted certain DB operations
                var db = indexedDB.open("test");
                db.onerror = function() {
                    result = { isPrivate: true, method: 'safari_idb' };
                    finish();
                };
                db.onsuccess = function() {
                    result = { isPrivate: false, method: 'safari_idb' };
                    finish();
                };
            } catch (e) {
                result = { isPrivate: true, method: 'safari_idb' };
                finish();
            }
        } else {
            finish();
        }

        function finish() {
            window._adobe_privacy_mode = result.isPrivate ? "Private" : "Normal";
            resolve(result);
        }
    });
})();
