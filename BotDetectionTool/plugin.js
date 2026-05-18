/**
 * @name getBotDetection
 * @description Behavioral and static bot detection.
 * @returns {string} The identified bot type or "Human"
 */
return (function() {
  var STORAGE_KEY = 'adobe_bot_status';
  var now = Date.now();
  
  // 1. Return existing status if already determined this session
  var cachedStatus = sessionStorage.getItem(STORAGE_KEY);
  if (cachedStatus) return cachedStatus;

  // 2. Static Analysis (UA & Referrer)
  var ua = navigator.userAgent || "";
  var ref = document.referrer || "";
  var botPatterns = "bot|crawler|spider|scrape|facebookexternalhit|googlebot|bingbot|headless|phantomjs|puppeteer|slackbot|applebot|preview|render";
  var botRegex = new RegExp(botPatterns, "i");

  if (ua.indexOf("PHC-Audit-Engine") === -1) {
    if (botRegex.test(ua)) {
      sessionStorage.setItem(STORAGE_KEY, "Bot:UA_Match");
      return "Bot:UA_Match";
    }
    if (botRegex.test(ref)) {
      sessionStorage.setItem(STORAGE_KEY, "Bot:Referrer_Match");
      return "Bot:Referrer_Match";
    }
  }

  // 3. Behavioral Analysis (Async)
  if (!window._botAuditInitialized) {
    window._botAuditInitialized = true;
    
    var interactionEvents = ["mousemove", "keydown", "scroll", "click", "touchstart", "touchend"];
    var markAsHuman = function() {
      sessionStorage.setItem(STORAGE_KEY, "Human");
      interactionEvents.forEach(function(e) { document.removeEventListener(e, markAsHuman); });
      // Trigger a light-weight hit to update the eVar mid-session if needed
      window.dispatchEvent(new CustomEvent('adobe_human_verified'));
    };

    interactionEvents.forEach(function(e) {
      document.addEventListener(e, markAsHuman, { passive: true, once: true });
    });

    // 8-Second "Silent Bot" Timeout
    setTimeout(function() {
      if (sessionStorage.getItem(STORAGE_KEY) !== "Human") {
        sessionStorage.setItem(STORAGE_KEY, "Bot:No_Interaction");
      }
    }, 8000);
  }

  return "Evaluating";
})();
