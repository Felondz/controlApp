/**
 * Helper to translate default category names.
 * Maps Spanish category names (as stored in DB) to translation keys.
 */

// Map of default category names to their translation keys
const CATEGORY_KEY_MAP = {
    // Spanish names (as stored in DB by ProyectoObserver)
    'Ingreso General': 'finance.categories.general_income',
    'Salario': 'finance.categories.salary',
    'Facturas y Servicios': 'finance.categories.bills_and_services',
    'Transporte': 'finance.categories.transport',
    'Alimentación': 'finance.categories.food',
    'Salud': 'finance.categories.health',
    'Educación': 'finance.categories.education',
    'Otros Gastos': 'finance.categories.other_expenses',
};

/**
 * Get the translated name for a category.
 * If the category name matches a default category, returns the translation.
 * Otherwise, returns the original name (for user-created categories).
 * 
 * @param {string} categoryName - The category name from the database
 * @param {function} t - The translation function from useTranslate
 * @returns {string} - The translated category name or the original if not a default
 */
export function translateCategoryName(categoryName, t) {
    if (!categoryName) return '';

    const translationKey = CATEGORY_KEY_MAP[categoryName];
    if (translationKey) {
        return t(translationKey, categoryName);
    }

    return categoryName;
}

export default translateCategoryName;
