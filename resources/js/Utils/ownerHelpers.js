/**
 * Owner Color Helpers
 * Provides consistent color coding for account owners in collaborative projects
 */

// Color palette for owner differentiation (supports up to 8 owners)
const OWNER_COLORS = [
    {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500 dark:border-blue-600',
        chartColor: '#3b82f6' // blue-500
    },
    {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-500 dark:border-purple-600',
        chartColor: '#a855f7' // purple-500
    },
    {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500 dark:border-green-600',
        chartColor: '#22c55e' // green-500
    },
    {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500 dark:border-orange-600',
        chartColor: '#f97316' // orange-500
    },
    {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        text: 'text-pink-700 dark:text-pink-400',
        border: 'border-pink-500 dark:border-pink-600',
        chartColor: '#ec4899' // pink-500
    },
    {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        text: 'text-cyan-700 dark:text-cyan-400',
        border: 'border-cyan-500 dark:border-cyan-600',
        chartColor: '#06b6d4' // cyan-500
    },
    {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500 dark:border-amber-600',
        chartColor: '#f59e0b' // amber-500
    },
    {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-500 dark:border-indigo-600',
        chartColor: '#6366f1' // indigo-500
    },
];

/**
 * Get color scheme for an owner
 * @param {number|string} ownerId - The owner's ID
 * @returns {object} Color scheme object with bg, text, border, and chartColor
 */
export const getOwnerColor = (ownerId) => {
    if (!ownerId) return OWNER_COLORS[0]; // Default to first color for project accounts
    const index = parseInt(ownerId) % OWNER_COLORS.length;
    return OWNER_COLORS[index];
};

/**
 * Get owner name from account
 * @param {object} account - Account object with propietario relationship
 * @returns {string} Owner name or default label
 */
export const getOwnerName = (account) => {
    if (!account?.propietario) return 'Proyecto';
    return account.propietario.name || account.propietario.nombre || 'Desconocido';
};

/**
 * Get owner initials for badge display
 * @param {string} name - Owner's full name
 * @returns {string} Initials (up to 2 characters)
 */
export const getOwnerInitials = (name) => {
    if (!name || name === 'Proyecto') return '📁';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Check if account belongs to current user
 * @param {object} account - Account object
 * @param {number} currentUserId - Current user's ID
 * @returns {boolean}
 */
export const isMyAccount = (account, currentUserId) => {
    if (!account?.propietario_id || !currentUserId) return false;
    return account.propietario_type === 'App\\Models\\User' &&
        parseInt(account.propietario_id) === parseInt(currentUserId);
};

/**
 * Group accounts by owner
 * @param {Array} accounts - Array of accounts
 * @returns {object} Accounts grouped by owner ID
 */
export const groupAccountsByOwner = (accounts) => {
    const grouped = {};
    accounts.forEach(account => {
        const ownerId = account.propietario_id || 'project';
        if (!grouped[ownerId]) {
            grouped[ownerId] = {
                ownerId,
                ownerName: getOwnerName(account),
                ownerType: account.propietario_type,
                accounts: [],
                totalBalance: 0
            };
        }
        grouped[ownerId].accounts.push(account);
        grouped[ownerId].totalBalance += account.saldo_actual || 0;
    });
    return grouped;
};

/**
 * Calculate owner contributions from transactions
 * @param {Array} transactions - Array of transactions
 * @param {Array} accounts - Array of accounts with owner info
 * @returns {object} Contributions by owner
 */
export const calculateOwnerContributions = (transactions, accounts) => {
    const contributions = {};

    transactions.forEach(transaction => {
        const account = accounts.find(a => a.id === transaction.cuenta_id);
        if (!account) return;

        const ownerId = account.propietario_id || 'project';
        if (!contributions[ownerId]) {
            contributions[ownerId] = {
                ownerId,
                ownerName: getOwnerName(account),
                income: 0,
                expense: 0,
                net: 0
            };
        }

        const amount = transaction.monto || 0;
        if (amount > 0) {
            contributions[ownerId].income += amount;
        } else {
            contributions[ownerId].expense += Math.abs(amount);
        }
        contributions[ownerId].net += amount;
    });

    return contributions;
};
