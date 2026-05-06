/**
 * @name rageClickDetector
 * @version 1.0.0
 * @description Monitors for high-frequency, localized clicks (Rage Clicks).
 */
window.rageClickDetector = (function() {
  var config = {
    clickThreshold: 3,      // Number of clicks
    timeThreshold: 1000,    // Timeframe in ms
    radiusThreshold: 50,    // Distance in pixels
    eVar: 'eVar77',         // Element name/selector
    event: 'event77'        // Rage Click Success Event
  };

  var clickBuffer = [];

  document.addEventListener('click', function(e) {
    var now = Date.now();
    var clickCoord = { x: e.clientX, y: e.clientY, time: now, target: e.target };

    clickBuffer.push(clickCoord);

    // Keep only the last N clicks based on threshold
    if (clickBuffer.length > config.clickThreshold) {
      clickBuffer.shift();
    }

    if (clickBuffer.length === config.clickThreshold) {
      var firstClick = clickBuffer[0];
      var lastClick = clickBuffer[clickBuffer.length - 1];

      // Check Time Constraint
      var timeDiff = lastClick.time - firstClick.time;
      
      // Check Spatial Constraint (Distance)
      var dist = Math.sqrt(
        Math.pow(lastClick.x - firstClick.x, 2) + 
        Math.pow(lastClick.y - firstClick.y, 2)
      );

      if (timeDiff <= config.timeThreshold && dist <= config.radiusThreshold) {
        triggerRageClick(lastClick.target);
        clickBuffer = []; // Reset buffer after trigger
      }
    }
  }, true);

  function triggerRageClick(target) {
    if (typeof s !== "undefined") {
      // Clean up the element identifier (ID > Class > Tag)
      var identifier = target.id ? '#' + target.id : 
                       (target.className ? '.' + target.className.split(' ').join('.') : 
                       target.tagName.toLowerCase());
      
      // Add innerText for context (e.g., button labels)
      var label = target.innerText ? ' [' + target.innerText.substring(0, 20).trim() + ']' : '';
      var finalValue = identifier + label;

      s.linkTrackVars = config.eVar + ",events";
      s.linkTrackEvents = config.event;
      s[config.eVar] = finalValue;
      s.events = config.event;
      
      s.tl(target, 'o', 'Rage Click Detected');
      
      // Console log for QA/Debugging
      console.warn("Rage Click Detected on: " + finalValue);
    }
  }

  return { config: config };
})();
