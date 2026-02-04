/**
 * Approximate exchange rates to INR
 * Note: These should ideally be fetched from a live API
 */
export const CURRENCY_RATES_TO_INR: Record<string, number> = {
    'GBP': 108,
    'USD': 86,
    'EUR': 92,
    'AED': 23,
    'INR': 1,
};

/**
 * Default currency for the application
 */
export const DEFAULT_CURRENCY = 'INR';

/**
 * Convert amount from source currency to INR
 */
export const convertToINR = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === 'INR') return amount;
    const rate = CURRENCY_RATES_TO_INR[fromCurrency];
    return rate ? Math.round(amount * rate) : amount;
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'INR'): string => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(price);
    } catch {
        return `${currency} ${price.toFixed(0)}`;
    }
};
