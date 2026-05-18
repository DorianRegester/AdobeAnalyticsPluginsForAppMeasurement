# tabFocusVelocityAuditor

**tabFocusVelocityAuditor** is a specialized analytics utility designed to measure "Attention Economics" by tracking how users interact with browser tabs. In an era of multi-tab browsing, simply having a page open does not guarantee user attention. This script quantifies engagement by measuring tab-switching frequency (Velocity) and the percentage of time the page spent in the foreground (Attention Share).

## Key Features

*   **Attention Share Calculation:** Calculates the precise percentage of a session where the tab was active and visible to the user.
*   **Focus Velocity Tracking:** Measures the "switches per minute" to identify erratic browsing behavior or users who are multi-tasking heavily.
*   **Background Time Auditing:** Aggregates total time spent in the background, allowing for more accurate "True Time on Page" reporting.
*   **Event-Driven Context:** Dispatches a `attention_context_event` custom event every time a user returns to the tab, enabling real-time data layer updates.
*   **Exit-Intent Capture:** Utilizes the `pagehide` listener to ensure final session metrics are broadcasted before the user navigates away.

## Data Schema & Metrics

The auditor produces an object containing the following metrics, which can be mapped to custom eVars or Props:

| Metric | Type | Description |
| :--- | :--- | :--- |
| `switchCount` | Integer | Total number of times the tab was hidden (switched away from). |
| `velocity` | Decimal | Frequency of tab switches per minute (e.g., `2.50`). |
| `attentionShare`| Percentage| % of total session time the tab was in the foreground (e.g., `85.5%`). |
| `totalBackgroundSeconds` | Integer | Absolute total of seconds the tab spent in a 'hidden' state. |

**Console Output Example:**  
`[AttentionAudit] Share: 72.4% | Velocity: 1.25 switches/min`

## Implementation by Tag Manager

### 1. Adobe Launch (Legacy appMeasurement)
*   **Rule:** Trigger at **Library Loaded (Page Top)**.
*   **Action:** Add a **Core - Custom Code** action referencing `tabFocusVelocityAuditor.js`.
*   **Data Collection:** Create a rule for the `attention_context_event` to map `event.detail.velocity` to a specific eVar for behavioral segmenting.

### 2. Tealium IQ
*   **Extension:** Add a **Javascript Code** extension.
*   **Scope:** **All Tags**.
*   **Logic:** Use the `getState()` method to pull current metrics into the `utag_data` object prior to firing tracking pixels.

### 3. Ensighten (Manage)
*   **Tag Type:** **Custom Javascript**.
*   **Timing:** **Immediate**.
*   **Integration:** Use the custom event listener to push attention metrics into the `EnsTag_Data` layer for real-time orchestration.

### 4. Signal
*   **Tag Type:** **Custom HTML/JS**.
*   **Trigger:** **Page Load**.
*   **Optimization:** Use the metrics to conditionally suppress high-frequency "heartbeat" pings if the user's `attentionShare` drops below a certain threshold.

## Technical Details

*   **API Usage:** Leverages the **Page Visibility API** (`visibilitychange`) for high-accuracy state tracking.
*   **Performance:** Uses lightweight `Date` object calculations to ensure zero impact on the main thread and battery life.
*   **Reliability:** Implements `pagehide` instead of `unload` for better compatibility with modern browser lifecycle states and mobile "back-forward" caching.

## 📄 License
MIT License - Developed by Dorian D. Regester
