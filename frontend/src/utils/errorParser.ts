/**
 * Recursively parses backend error objects/arrays into a flat list of human-readable strings.
 * Handles:
 * - Simple strings: "Error message"
 * - Arrays of strings: ["Error 1", "Error 2"]
 * - Nested objects: { "field": ["Error"], "nested": { "subfield": "Error" } }
 */
export const parseBackendError = (errorData: any): string[] => {
    const messages: string[] = [];

    const recurse = (data: any, prefix = '') => {
        if (!data) return;

        if (typeof data === 'string') {
            // Check if it's an HTML response (likely a 404 from Vercel)
            if (data.trim().toLowerCase().startsWith('<!doctype html') || data.includes('<html')) {
                messages.push('Error: Received an HTML response. The API might be misconfigured.');
                return;
            }
            messages.push(prefix ? `${prefix}: ${data}` : data);
        } else if (Array.isArray(data)) {
            data.forEach((item) => recurse(item, prefix));
        } else if (typeof data === 'object') {
            Object.keys(data).forEach((key) => {
                const value = data[key];
                const newPrefix = prefix ? `${prefix} -> ${key}` : key;
                recurse(value, newPrefix);
            });
        }
    };

    recurse(errorData);

    if (messages.length === 0) {
        // Handle standard DRF 404 data shape or generic empty responses
        if (errorData?.detail === 'Not found.') {
            return ['Error 404: The requested resource was not found. Please check the URL or ID.'];
        }
        return ['An unknown error occurred.'];
    }

    return messages;
};
