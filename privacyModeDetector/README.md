# privacyModeDetector

**privacyModeDetector** is a high-sophistication utility designed for best-effort detection of Incognito and Private browsing modes across all major evergreen browsers. By identifying when a user is browsing in a restricted privacy state, analytics teams can better interpret missing persistent identifiers—such as the Experience Cloud ID (ECID)—and audit the impact of privacy-shielding behavior on session-stitching and conversion attribution.

## Key Features

*   **Multi-Engine Detection:** Implements distinct, browser-specific detection logic for Chromium (Chrome/Edge), Firefox, and Safari.
*   **Chromium Quota Auditing:** Utilizes the `navigator.storage.estimate` API to detect the significant storage quota restrictions typical of Incognito mode.
*   **Firefox Service Worker Check:** Identifies Firefox Private Mode by auditing Service Worker registration availability, which is natively disabled in private windows.
*   **Safari IndexedDB Verification:** Detects Safari's historical and modern restrictions on IndexedDB operations to flag private sessions.
*   **Asynchronous Promise Architecture:** Built on a Promise-based structure to ensure detection is completed before firing critical analytics pings.

## Data Schema & Metrics

The auditor populates a global variable `window._adobe_privacy_mode` and returns a result object for use in data elements:

| Metric | Type | Description |
| :--- | :--- | :--- |
| `isPrivate` | Boolean | `true` if a private/incognito state is detected. |
| `method` | String | The specific detection logic used (`quota_limit`, `firefox_sw`, `safari_idb`). |
| `_adobe_privacy_mode`| String | Global string value: `"Private"` or `"Normal"`. |

**Example Result Object:**
`{ isPrivate: true, method: 'quota_limit' }`

## Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Rule:** Trigger at **Library Loaded (Page Top)**.
*   **Action:** Add a **Core - Custom Code** action referencing the `privacyModeDetector.js` file.
*   **Data Element:** Create a Custom Code data element that returns `window._adobe_privacy_mode`.
*   **Mapping:** Map the data element to a dedicated eVar to segment traffic by privacy state.

### 2. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension scoped to **All Tags**.
*   **Integration:** 
    ```javascript
    window.privacyModeDetector.then(function(result) {
        utag_data['browser_privacy_mode'] = result.isPrivate ? "Private" : "Normal";
    });

### 3. Ensighten (Manage)
* **Tag Type**: **Custom Javascript**.
* **Timing**: Set to **Immediate**.
* **Logic**: Utilize the Promise resolution to push the detection status into the `EnsTag_Data` layer for real-time orchestration or to trigger alternative identifier logic.
    ```javascript
    window.privacyModeDetector.then(function(result) {
        EnsTag_Data.set('privacy_mode', result.isPrivate ? "Private" : "Normal");
    });

### Technical Details
*   **Browser Support:** Optimized for Evergreen versions of Chrome, Edge, Firefox, and Safari.
*   **Asynchronous Architecture:** Because certain detection methods (like the Storage Quota API) are asynchronous, the script returns a Promise. This ensures your analytics tags receive accurate data rather than a default "Normal" value before the audit is complete.
*   **Privacy-First Approach:** This script is designed for transparency. It does not perform invasive fingerprinting; instead, it audits the native capabilities and restriction sets of the current browser environment.
*   **Performance:** The script has a negligible footprint and uses standard browser APIs with no external library dependencies.

### License
MIT License - Developed by Dorian D. Regester
