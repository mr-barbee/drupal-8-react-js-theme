 import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export default class GoogleAnalytics {
  constructor() {
    this.analytics = Analytics({
      app: drupalSettings.logo.name.src,
      plugins: [
        googleAnalytics({
          trackingId: drupalSettings.gaTrackingCode
        })
      ],
      // enable debug mode
      debug: drupalSettings.gaDebug
    })
  }

  trackPageView() {
    /* Track a page view */
    this.analytics.page()
  }

  trackEvent(type, params) {
    const { category, label, value } = params
    // Track custom event
    this.analytics.track(type, {
      category,
      label,
      value
    })
  }

  identifyUser(userID, params) {
    // Identify the visitor 'user-123'
    this.analytics.identify(userID, {params})
  }
}
