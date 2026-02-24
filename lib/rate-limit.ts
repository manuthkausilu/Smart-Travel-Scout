type RateLimitInfo = {
    count: number;
    lastRequest: number;
};

const rateLimitMap = new Map<string, RateLimitInfo>();

// Simple in-memory rate limit: 5 requests per 60 seconds
const LIMIT = 5;
const WINDOW_MS = 60 * 1000;

export function isRateLimited(ip: string): { limited: boolean; retryAfter?: number } {
    const now = Date.now();
    const info = rateLimitMap.get(ip);

    if (!info) {
        rateLimitMap.set(ip, { count: 1, lastRequest: now });
        return { limited: false };
    }

    // Reset if window has passed
    if (now - info.lastRequest > WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, lastRequest: now });
        return { limited: false };
    }

    if (info.count >= LIMIT) {
        const retryAfter = Math.ceil((WINDOW_MS - (now - info.lastRequest)) / 1000);
        return { limited: true, retryAfter };
    }

    info.count += 1;
    return { limited: false };
}
