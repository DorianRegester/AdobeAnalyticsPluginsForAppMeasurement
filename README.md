# AdobeAnalyticsPluginsForAppMeasurement
Plugins for Adobe Analytics (appMeasurement.js version)

# HardwareContextAuditor (v2.0.0)

**HardwareContextAuditor** is a privacy-first JavaScript utility designed for modern digital analytics implementations. It audits a user's hardware capabilities, network quality, and privacy signals (like Global Privacy Control) to provide technical context for performance monitoring and audience segmentation.

This tool is specifically built to work with **Adobe Analytics (eVar ingestion)** and **Tag Management Systems (Adobe Launch/GTM)** via custom event broadcasting.

---

## Key Features

* **2026 Privacy Standards:** Prioritizes **Global Privacy Control (GPC)** over deprecated signals.
* **Technical Tiering:** Identifies device "power" (CPU/RAM) and connection quality to explain conversion drops or high bounce rates on lower-end devices.
* **UX Context:** Captures `prefers-reduced-motion` and `save-data` mode to audit how your site's accessibility features affect user behavior.
* **Bot Detection:** Includes a `navigator.webdriver` check to flag automated traffic at the hardware level.

---

## Data Schema (eVar Mapping)

The script generates a piped string optimized for a single Adobe Analytics eVar. This allows for high-cardinality analysis without consuming multiple variables.

**Example Output:** `B:N|N:4g|C:8|R:8|T:1|P:Y|S:N|M:Std|G:Y|L:en,en-US`

### Breakdown:

| Key | Attribute | Description |
| :--- | :--- | :--- |
| **B** | Bot Status | `Y` if `webdriver` is detected; otherwise `N`. |
| **N** | Network | Effective connection type (e.g., `4g`, `3g`, `slow-2g`). |
| **C** | CPU | Number of logical processors (Hardware Concurrency). |
| **R** | RAM | Approximate device memory in GB. |
| **T** | Touch | Maximum touch points (indicates tablet/mobile/touch-laptop). |
| **P** | PDF | Indicates if the browser natively supports PDF viewing. |
| **S** | Save Data | `Y` if the user has enabled "Data Saver" mode. |
| **M** | Motion | `Red` (Reduced) or `Std` (Standard) motion preference. |
| **G** | GPC | **Global Privacy Control** signal status. |
| **L** | Language | Top two preferred browser languages. |

---

## Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
* **Rule:** Create a rule triggered at **Library Loaded** or **Page Bottom**.
* **Action:** Add a **Core - Custom Code** (Javascript) action and paste the `HardwareContextAuditor` script.
* **Mapping:** To map to an eVar, use a second action (Adobe Analytics - Set Variables):
    * **eVarX:** `%js_hardware_audit_string%` (assuming a Data Element is created to return `window.HardwareContextAuditor.run()`).

### 2. Adobe Launch (WebSDK / Alloy.js)
* **Setup:** Deploy the script via a **Library Loaded** rule.
* **XDM Mapping:** In your WebSDK "Update Variable" action or Data Element, map your schema field to:
    ```javascript
    return window.HardwareContextAuditor.run();
    ```
* **Note:** This ensures the hardware context is sent in the initial `interact` call within the `_experience` or `custom_dimensions` XDM object.

### 3. Tealium IQ
* **Extension:** Add a **Javascript Code** extension.
* **Scope:** Set to **Pre-Loader** if you want the data available for all tags, or **All Tags** for standard timing.
* **Mapping:** Create a UDO variable `hardware_audit`. In the extension, add:
    ```javascript
    utag_data['hardware_audit'] = window.HardwareContextAuditor.run();
    ```

### 4. Ensighten (Manage)
* **Tag:** Create a new **Custom Javascript** tag.
* **Timing:** Set to **Immediate** or **Dom Ready**.
* **Data Layer:** Use the `Bootstrapper` to push the result:
    ```javascript
    EnsTag_Data.set('hardware_context', window.HardwareContextAuditor.run());
    ```

### 5. Signal (formerly BrightTag)
* **Tag:** Create a **Custom HTML/JS** tag.
* **Injection:** Use the "Execute Custom Javascript" option.
* **Binding:** Bind the output to a Signal variable for use in downstream pixels:
    ```javascript
    window.HardwareContextAuditor.run();
    ```
---
```javascript
return window.HardwareContextAuditor.run();
