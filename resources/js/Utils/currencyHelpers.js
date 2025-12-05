/**
 * Currency formatting utilities
 * Standardized currency display for future multi-currency support
 */

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - ISO 4217 currency code (USD, COP, EUR, etc.)
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
    const symbols = {
        'USD': '$',
        'COP': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CNY': '¥',
        'MXN': '$',
        'BRL': 'R$',
        'ARS': '$',
        'CLP': '$',
        'PEN': 'S/',
        'CAD': 'C$',
        'AUD': 'A$',
        'CHF': 'CHF',
        'INR': '₹',
        'RUB': '₽',
        'KRW': '₩',
        'TRY': '₺',
        'ZAR': 'R',
    };

    return symbols[currencyCode] || currencyCode;
};

/**
 * Get locale string for currency formatting
 * @param {string} currencyCode - ISO 4217 currency code
 * @returns {string} Locale string (e.g., 'es-CO', 'en-US')
 */
export const getCurrencyLocale = (currencyCode) => {
    const locales = {
        'COP': 'es-CO',
        'USD': 'en-US',
        'EUR': 'de-DE',
        'GBP': 'en-GB',
        'JPY': 'ja-JP',
        'CNY': 'zh-CN',
        'MXN': 'es-MX',
        'BRL': 'pt-BR',
        'ARS': 'es-AR',
        'CLP': 'es-CL',
        'PEN': 'es-PE',
        'CAD': 'en-CA',
        'AUD': 'en-AU',
        'CHF': 'de-CH',
        'INR': 'en-IN',
        'RUB': 'ru-RU',
        'KRW': 'ko-KR',
        'TRY': 'tr-TR',
        'ZAR': 'en-ZA',
    };

    return locales[currencyCode] || 'en-US';
};

/**
 * Check if currency should show decimal places
 * @param {string} currencyCode - ISO 4217 currency code
 * @returns {boolean} True if decimals should be shown
 */
export const shouldShowDecimals = (currencyCode) => {
    // Currencies WITHOUT decimals (whole numbers only)
    const noDecimalCurrencies = ['COP', 'JPY', 'KRW', 'CLP'];
    return !noDecimalCurrencies.includes(currencyCode);
};

/**
 * Format currency amount with proper symbol and structure
 * @param {number} amount - Amount to format (in cents/smallest unit)
 * @param {string} currencyCode - ISO 4217 currency code
 * @param {boolean} divideByCents - Whether to divide by 100 (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'COP', divideByCents = true) => {
    const symbol = getCurrencySymbol(currencyCode);
    const locale = getCurrencyLocale(currencyCode);
    const decimals = shouldShowDecimals(currencyCode) ? 2 : 0;
    const value = divideByCents ? (amount / 100) : amount;

    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(Math.abs(value));

    return `${symbol}${formatted}`;
};
