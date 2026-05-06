# Adobe Analytics Plugins for App Measurement

A comprehensive collection of SME-grade tracking utilities, data connectors, and behavioral analyzers designed to optimize Adobe Analytics and Google ecosystem implementations.

## At a Glance
> **Key Decision Point:** These plugins are designed for Adobe Launch (Data Collection) and technical account integrations. Ensure your SDR (Solution Design Reference) is updated to match the eVars and events specified in each plugin.

---

## Core Tracking & Behavioral Analytics

*   **[aemAssetTracker](https://drive.google.com/open?id=116js6_GRCg-7HoSeQ7fMkWrMjrSqSdcB)**: Scans and tracks AEM Assets and Components. It captures asset impressions and clicks, correlating component interactions with overall performance.
*   **[FormObserverPro](https://drive.google.com/open?id=1765ni2LqbEQbq1yhUD1SRhYf1H-yke8a)**: A pure JavaScript observer that monitors form interactions. It broadcasts start, step-by-step progress, completion, and abandonment events for TMS consumption.
*   **[rageClickDetector](https://drive.google.com/open?id=1AMei_nyKnI0o1wRehaLj_uGFBhKGZYTP)**: Identifies user frustration by monitoring for high-frequency, localized clicks. It automatically captures the element identifier and inner text for debugging.
*   **[getEngagementMetrics](https://drive.google.com/open?id=1T9XYj4gxW62IuZNG7d-pweYAF8Yhft2t)**: Utilizes the Page Visibility API to differentiate between active (visible/focused) and passive browsing time.
*   **[getClipboardTracker](https://drive.google.com/open?id=1u47Tknor3x5ppUziZIJVIkWBqs782TGa)**: SME-grade tracker for Copy/Cut actions with PII safety using a decoupled detection system.
*   **[getActivityMapContext](https://drive.google.com/open?id=1_eK9Na12xjdlq_ZHA-eEiX8qfh4fdBFb)**: Click-stream interceptor with race-condition guards and cross-domain logic to capture link hierarchy and region data.

---

## Performance & Environment Audits

*   **[getCoreWebVitals](https://drive.google.com/open?id=11jfUdZExKl_7p_X8y53BKE7qzOwOqv2J)**: A Performance Observer that grades individual LCP, CLS, and INP metrics (A, B, or F) based on Google’s thresholds.
*   **[HardwareContextAuditor](https://drive.google.com/open?id=1GR1kc98rU8yBdOcELTCdcxa2mQejy_Vw)**: Audits hardware capabilities including CPU cores, RAM, network type, and 2026 privacy signals like Global Privacy Control (GPC).
*   **[getClientSideIssues](https://drive.google.com/open?id=1-4pOu8YiPyE59bTKniP2U1WD8OMP39ic)**: An SME-grade interceptor for console warnings, global JavaScript errors, and unhandled promise rejections.
*   **[audioEnvironmentAuditor](https://drive.google.com/open?id=1EfZja9lzpUZlqKPC9TrPAyj4o8IrzDQ9)**: Detects audio availability, mute status, and autoplay restrictions to analyze user environment.

---

## Marketing & Attribution Connectors

| Plugin | Description | Key Features |
| :--- | :--- | :--- |
| **[GSC-to-Adobe](https://drive.google.com/open?id=17qgMTm-C9CKbK7Rrh5uTqeWaexaWippf)** | Syncs Google Search Console data to Adobe. | Brand intent detection, URL/Keyword modes, and multidimensional search types. |
| **[Google Ads-to-Adobe](https://drive.google.com/open?id=1Fu9FN51Cl7cDTM3FlXNTKpAZ3UpGAUh-)** | Advanced ingestion of Google Ads performance. | Captures Quality Score components, Search Impression Share, and SERP dominance. |
| **[Meta Ads-to-Adobe](https://drive.google.com/open?id=1ftWejcMRvA_E8EAkuT05j7y6JD9lA0ts)** | Pulls insights from Meta (FB/IG). | Standardizes objective and placement data to maintain parity with search reports. |
| **[TikTok Ads-to-Adobe](https://drive.google.com/open?id=1P3BXjvWPbdbDJo_YBl87BKyb6IcYdVgH)** | Integrated report fetcher for TikTok. | Tracks Auction AdGroup data including spend, reach, and video play actions. |
| **[Amazon Ads-to-Adobe](https://drive.google.com/open?id=1F6g0UjutUdcnDtXB3FpilOdjw-TQ-QwM)** | Keyword-level Amazon Ads performance. | Tracks cost, clicks, and attributed sales from Sponsored Products. |
| **[Bing-to-Adobe](https://drive.google.com/open?id=1rPAc3zJ8jkFHNg49zKDEr7eMjtg50x0a)** | Syncs Bing Webmaster stats. | Parity with GSC reporting for keyword-level clicks and impressions. |

---

## E-commerce & Conversion Intelligence

*   **[ProductDiscoveryAuditor](https://drive.google.com/open?id=1GaTHTRtnK_yL4aGlSsq-jJNc_6UoK1AC)**: Categorizes how users arrive at Product Detail Pages (PDPs), prioritizing signals like internal search, merchandising, or external campaigns.
*   **[returnPropensityPredictor](https://drive.google.com/open?id=1i_hNaRjXaTRHxxCinbdejlCEn-Vob4pQ)**: Detects "size-bracketing" behavior (purchasing multiple sizes of the same product) to predict high return probabilities.
*   **[scarcityLogicTracker](https://drive.google.com/open?id=1vrKjYY8OqBEektacfwbjDMxtPjwjkIlR)**: Scrapes PDP stock levels to bucket inventory into scarcity tiers (Low, Medium, High) for psychological trigger analysis.
*   **[CartIntentAuditor](https://drive.google.com/open?id=1Zr-0AV76ijUqulGEvZjcZkLdTTDpdx_h)**: Tracks items removed from cart vs. items purchased to quantify dropouts.

---

## Data Hygiene & Privacy

*   **[getPIIScrubber](https://drive.google.com/open?id=1qJXFgsyGP8DtxRhmLTvtBPmLp8BRU2Vo)**: Decoupled utility to mask sensitive data like emails, SSNs, and credit card numbers before tracking.
*   **[getDataLayerWatchdog](https://drive.google.com/open?id=1sPTZ0-R_ha8nM5Kpx0TAB4HgmAWSanR2)**: Validates the Data Layer against a "Golden Schema" to identify missing or mistyped requirements.
*   **[consentChangeAuditor](https://drive.google.com/open?id=1dIC126wzmQTmmA-6r2ZfpAhEuR7QdeQM)**: Tracks mid-session transitions in user privacy states (e.g., opting out while on a specific page).
*   **[getQueryParamCleaner]([link removed]
```Q3wEE)**: Filters and sorts URL parameters to remove PII and junk while maintaining reporting consistency.
