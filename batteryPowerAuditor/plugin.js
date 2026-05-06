/**
 * @name batteryPowerAuditor
 * @version 1.0.0
 * @description Captures battery level and charging state to analyze user urgency.
 */
window.batteryPowerAuditor = (function() {
    var config = {
        eVar: 'eVar88', // Battery Status (e.g., "Low | Discharging")
        prop: 'prop88', // Raw Level (e.g., "25%")
        event: 'event88' // Critical Battery Warning (<10%)
    };

    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            processBattery(battery);
            
            // Optional: Listen for state changes during the session
            battery.addEventListener('chargingchange', function() {
                processBattery(battery);
            });
        });
    }

    function processBattery(battery) {
        var level = Math.round(battery.level * 100);
        var isCharging = battery.charging;
        var state = isCharging ? "Plugged In" : "On Battery";
        
        // 1. Bucket the levels for easier BA analysis
        var bucket = "";
        if (level <= 10) bucket = "Critical";
        else if (level <= 20) bucket = "Low";
        else if (level <= 50) bucket = "Medium";
        else bucket = "High/Full";

        var finalValue = bucket + " | " + state;

        // 2. Push to Adobe
        if (typeof s !== "undefined") {
            s.linkTrackVars = config.eVar + "," + config.prop + ",events";
            s[config.eVar] = finalValue;
            s[config.prop] = level + "%";
            
            // Trigger event if battery is critical and NOT charging
            if (level <= 10 && !isCharging) {
                s.linkTrackEvents = config.event;
                s.events = config.event;
            }

            // Fire as a background update if s.t() has already passed
            s.tl(true, 'o', 'Battery Status Update');
        }
    }
})();
