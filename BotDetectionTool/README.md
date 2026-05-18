# getBotDetection plugin

**getBotDetection** is a high-performance, hybrid behavioral and static detection utility designed for enterprise-grade digital analytics implementations. It goes beyond simple pattern matching by combining traditional User Agent/Referrer analysis with real-time behavioral monitoring to identify "Silent Bots"—crawlers that pass static checks but fail to interact with the UI.

This plugin is optimized for analytics professionals managing high-volume traffic where data integrity is paramount for conversion and engagement reporting.

---

## Key Features

*   **Hybrid Detection:** Uses static regex patterns and real-time interaction listeners.
*   **Behavioral Verification:** Monitors `mousemove`, `keydown`, `scroll`, and `touch` events to verify human presence.
*   **Session-Based Persistence:** Results are cached in `sessionStorage` to minimize processing overhead across page views.
*   **8-Second "Silent Bot" Timeout:** Automatically flags sessions as `Bot:No_Interaction` if no human activity is detected within the first 8 seconds.
*   **Event-Driven Architecture:** Dispatches a `adobe_human_verified` custom event to allow for mid-session re-classification in your Tag Management System.

---

## Data Schema (eVar/Dimension Mapping)

The plugin returns a single string value. It is recommended to map this to an **Adobe Analytics eVar** or **GA4 Custom Dimension**.

| Value | Category | Description |
| :--- | :--- | :--- |
| `Bot:UA_Match` | Static | The User Agent matched a known crawler or spider pattern. |
| `Bot:Referrer_Match` | Static | The document referrer matched a known bot/spider pattern. |
| `Bot:No_Interaction` | Behavioral | No human interaction recorded within the 8-second window. |
| `Evaluating` | Pending | The script is currently listening for human interaction. |
| `Human` | Verified | A human interaction event was successfully detected. |

---

## Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Data Element:** Create a Custom Code Data Element named `da_bot_status`. Paste the plugin code into the editor.
*   **Rule:** Trigger at **Library Loaded (Page Top)**.
*   **Mapping:** Set your desired eVar to `%da_bot_status%`.

### 2. Adobe Launch (WebSDK / Alloy.js)
*   **Setup:** Use the script within a **Library Loaded** rule.
*   **XDM Mapping:** Map your bot detection schema field to the Data Element returning this script.
*   **Real-time Update:** Create a rule triggered by the `adobe_human_verified` custom event to send an `interact` call updating the status from `Evaluating` to `Human`.

### 3. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Execution:**
    ```javascript
    utag_data['bot_detection_status'] = (function(){ /* Plugin Code */ })();

### 4. Ensighten (Manage)
*  **Tag Type:** Create a Custom Javascript tag.
*  **Timing:** Set to Immediate or Page Top.

**Data Layer Binding:**

var botStatus = (function(){ /* Plugin Code */ })();
Bootstrapper.data.set('bot_type', botStatus);

### 5. Signal
*   **Tag Type:** **Custom HTML/JS** tag.
*   **Trigger:** **Page Load**.
*   **Integration:** Use the `adobe_human_verified` listener to conditionally fire or suppress downstream marketing pixels based on the verified human status.

---

## Technical Details

*   **File Size:** < 1.5KB (Minified).
*   **Dependencies:** None (Vanilla JavaScript).
*   **Performance:** Uses passive event listeners with `{ once: true }` to ensure zero impact on page scrolling or main-thread CPU usage.
*   **Persistence:** Scoped to `sessionStorage` (Browser Tab).

## License
MIT License - Developed by Dorian D. Regester.
