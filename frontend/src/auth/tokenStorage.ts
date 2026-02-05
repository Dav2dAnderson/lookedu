export const TOKEN_KEY = 'auth_tokens';

export interface Tokens {
    access: string;
    refresh: string;
}

export const getTokens = (): Tokens | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

export const setTokens = (tokens: Tokens) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getAccessToken = () => getTokens()?.access;
export const getRefreshToken = () => getTokens()?.refresh;
