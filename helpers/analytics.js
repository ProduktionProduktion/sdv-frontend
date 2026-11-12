/**
 * Pirsch analytics. Page views, outbound links and downloads are tracked
 * automatically by pa.js (loaded in _app.js); use this for custom events.
 *
 * trackEvent('Newsletter signup', { source: 'footer' });
 */
export function trackEvent(name, meta = {}, duration) {
    if (typeof window !== 'undefined' && typeof window.pirsch === 'function') {
        window.pirsch(name, { meta, duration });
    }
}
