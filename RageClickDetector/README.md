# rageClickDetector

**rageClickDetector** is a high-precision JavaScript utility designed to identify and measure UX friction in real-time. By monitoring for high-frequency, localized clicks—commonly known as "Rage Clicks"—this plugin enables analytics teams to pinpoint non-responsive elements, broken links, or confusing UI components that cause user frustration.

## Key Features

*   **Spatial Intelligence:** Uses a **Radius Threshold (50px)** to ensure clicks are localized to a specific element rather than accidental rapid clicks across different areas of the page.
*   **Temporal Filtering:** Distinguishes genuine frustration from rapid intentional navigation by requiring a specific cluster of clicks (default: 3) within a 1000ms window.
*   **Automated Attribution:** Automatically captures element IDs, CSS Classes, or Tag Names, and appends the first 20 characters of `innerText` to provide instant context in your reports.
*   **Zero Dependencies:** Pure Vanilla JavaScript requiring no external libraries, ensuring minimal impact on site performance.

## Configuration & Data Schema

Sensitivity and reporting can be customized via the `config` object within the script:

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `clickThreshold` | `3` | Number of clicks required to trigger a "Rage" signal. |
| `timeThreshold` | `1000` | Maximum timeframe in milliseconds for the click cluster. |
| `radiusThreshold` | `50` | Maximum distance in pixels allowed between clicks. |
| `eVar` | `'eVar77'` | The Adobe Analytics eVar used to store the element identifier. |
| `event` | `'event77'`| The Adobe Analytics Success Event triggered upon detection. |

**Output Example Captured in Analytics:** `#cart-checkout-btn [Place Order Now]`

## Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Rule:** Create a rule triggered at **Library Loaded (Page Top)**.
*   **Action:** Add a **Core - Custom Code** action and reference the `rageClickDetector.js` file.
*   **Tracking:** Ensure the global `s` object is initialized prior to script execution.

### 2. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension.
*   **Scope:** Set to **All Tags** or **Pre-Loader**.
*   **Integration:** Bind the final output to a UDO variable: `utag_data['rage_click_element'] = finalValue;`.

### 3. Ensighten (Manage)
*   **Tag:** Create a new **Custom Javascript** tag.
*   **Timing:** Set to **Immediate** or **DOM Ready**.
*   **Data Layer:** Use `Bootstrapper.data.set('rage_click_target', finalValue);` for downstream consumption.

### 4. Signal
*   **Tag:** Create a **Custom HTML/JS** tag.
*   **Injection:** Execute the script during **Page Load**.
*   **Optimization:** Use the `config` object to dynamically swap eVar IDs based on environment (Staging vs. Production).

## Technical Details

*   **Efficiency:** Employs a rolling `clickBuffer` that shifts automatically, ensuring virtually zero memory consumption.
*   **Capture Phase Detection:** The event listener is set to the **capture phase** (`true`) to ensure detections are recorded even if other elements on the page use `e.stopPropagation()`.
*   **QA Ready:** Includes built-in console warnings to simplify debugging and implementation verification.

## License
MIT License - Developed by Dorian D. Regester
