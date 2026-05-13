# batteryPowerAuditor (v1.0.0)

**batteryPowerAuditor** is a behavioral analytics utility designed to quantify "User Urgency" by monitoring device power states. By capturing battery levels and charging status, analytics teams can identify sessions where users may be rushing to complete a transaction or task due to low power, providing a unique dimension for conversion rate optimization (CRO) and performance auditing.

Developed by **Dorian D. Regester**, a digital analytics professional and implementation engineer based in Saint Cloud, Florida and owner of **scriptedinsights.com**. This tool is built to integrate seamlessly with enterprise analytics stacks, specifically optimized for **Adobe Analytics**.

---

## 🚀 Key Features

*   **Urgency Mapping:** Automatically buckets battery levels into categories (**Critical**, **Low**, **Medium**, **High**) to simplify high-level reporting and segmentation.
*   **Charging State Context:** Distinguishes between "Plugged In" and "On Battery" to provide context on the user's physical environment.
*   **Critical Threshold Triggering:** Includes logic to fire a specific Success Event (`event88`) when a user's battery hits a critical level (<10%) while discharging.
*   **Asynchronous API Handling:** Leverages the **Battery Status API** to ensure non-blocking execution and real-time updates if the power state changes during a session.
*   **Smart Analytics Dispatch:** Uses `s.tl()` (track link) to send background updates, ensuring battery data is captured even if the initial page view call has already fired.

---

## 📊 Configuration & Data Schema

The reporting variables can be customized via the `config` object within the script to align with your implementation SDR:

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `eVar88` | `finalValue` | The categorized bucket and state (e.g., `Low | On Battery`). |
| `prop88` | `level%` | The raw percentage of battery remaining (e.g., `25%`). |
| `event88` | `Critical` | A success event triggered only when battery is `<10%` and discharging. |

### Bucketing Logic:
*   **Critical:** ≤ 10%
*   **Low:** 11% – 20%
*   **Medium:** 21% – 50%
*   **High/Full:** > 50%

---

## ⚙️ Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Rule:** Create a rule triggered at **Library Loaded (Page Top)**.
*   **Action:** Add a **Core - Custom Code** action and reference the `batteryPowerAuditor.js` file.
*   **Requirement:** Ensure the global `s` object is initialized prior to script execution to allow for `s.tl()` dispatch.

### 2. Adobe Launch (WebSDK / Alloy.js)
*   **Modification:** Update the `processBattery` function to utilize `alloy("sendEvent", ...)` instead of legacy `s.tl()`.
*   **XDM Mapping:** Map the bucketed status and raw level to your custom XDM schema fields (e.g., `_experience.analytics.customDimensions.eVars.eVar88`).

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Integration:** Map the output to your UDO: 
    `utag_data['device_battery_status'] = finalValue;`
    `utag_data['device_battery_level'] = level + "%";`

### 4. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** Set to **Immediate**.
*   **Data Layer:** Use `EnsTag_Data.set('battery_urgency', finalValue);` to make the status available for downstream marketing pixels or UX personalization tools.

### 5. Signal
*   **Tag Type:** **Custom HTML/JS**.
*   **Trigger:** **Page Load**.
*   **Optimization:** Use the `event88` logic to suppress high-load marketing scripts when a user is in a "Critical" battery state to improve the user's experience.

---

## 🛠 Technical Details

*   **API Support:** Utilizes the `navigator.getBattery()` Promise-based API.
*   **Fail-Safe:** Includes a feature check (`'getBattery' in navigator`) to prevent errors in unsupported browsers.
*   **Event Listeners:** Implements a listener for `chargingchange` to maintain data accuracy if a user plugs or unplugs their device during a session.
*   **Performance:** Extremely low footprint; only executes calculations when the battery state changes.

## 📄 License
MIT License - Developed by **Dorian D. Regester** (**scriptedinsights.com**).
