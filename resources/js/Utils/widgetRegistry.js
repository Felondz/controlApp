/**
 * Widget Registry - Central definition of all available dashboard widgets
 * 
 * Each widget definition includes:
 * - id: Unique identifier
 * - module: Which module this widget belongs to (null for core widgets)
 * - requiresAdmin: If true, only admins can see this widget
 * - titleKey: Translation key for widget title
 * - icon: Icon component name from Icons.jsx
 * - defaultSize: 'small' (1 col), 'medium' (2 cols), 'large' (full width)
 */

export const WIDGET_DEFINITIONS = {
    // Finance Module Widgets (Admin Only)
    // Finance Module Widgets (Admin Only)
    finance_balance_summary: {
        id: 'finance_balance_summary',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.balance_summary',
        icon: 'CurrencyDollarIcon',
        defaultSize: 'small',
    },
    finance_accounts: {
        id: 'finance_accounts',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.accounts',
        icon: 'BanknotesIcon',
        defaultSize: 'large',
    },
    finance_savings_goal: {
        id: 'finance_savings_goal',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.savings_goal',
        icon: 'BanknotesIcon',
        defaultSize: 'small',
    },
    finance_credit_simulation: {
        id: 'finance_credit_simulation',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.credit_simulation',
        icon: 'CalculatorIcon',
        defaultSize: 'small',
    },
    finance_upcoming_obligations: {
        id: 'finance_upcoming_obligations',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.upcoming_obligations',
        icon: 'CalendarIcon',
        defaultSize: 'medium',
    },
    finance_charts: {
        id: 'finance_charts',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.cash_flow',
        icon: 'ChartBarIcon',
        defaultSize: 'large',
    },
    finance_account_flow: {
        id: 'finance_account_flow',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.account_flow',
        icon: 'ChartPieIcon',
        defaultSize: 'medium',
    },
    finance_transactions: {
        id: 'finance_transactions',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.recent_transactions',
        icon: 'ArrowsRightLeftIcon',
        defaultSize: 'medium',
    },
    finance_bills: {
        id: 'finance_bills',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'finance.bills',
        icon: 'DocumentTextIcon',
        defaultSize: 'medium',
    },

    // Tasks Module Widgets
    tasks_summary: {
        id: 'tasks_summary',
        module: 'tasks',
        requiresAdmin: false,
        titleKey: 'widgets.tasks_summary',
        icon: 'ClipboardDocumentCheckIcon',
        defaultSize: { w: 1, h: 1 },
    },
    tasks_users_load: {
        id: 'tasks_users_load',
        module: 'tasks',
        requiresAdmin: false, // Maybe true if sensitivity matters? User request didn't specify. Assuming false so members see workload.
        titleKey: 'widgets.tasks_users_load',
        icon: 'UserGroupIcon',
        defaultSize: { w: 1, h: 2 }, // Taller for list
    },

    // Chat Module Widgets
    chat_recent: {
        id: 'chat_recent',
        module: 'chat',
        requiresAdmin: false,
        titleKey: 'widgets.chat_recent',
        icon: 'ChatBubbleLeftRightIcon',
        defaultSize: 'medium',
    },

    // Operations Module Widgets
    operations_lotes_list: {
        id: 'operations_lotes_list',
        module: 'operations',
        requiresAdmin: false,
        titleKey: 'operations.title',
        icon: 'FactoryIcon',
        defaultSize: 'large',
    },

    // Inventory Module Widgets
    inventory_summary: {
        id: 'inventory_summary',
        module: 'inventory',
        requiresAdmin: false,
        titleKey: 'inventory.summary',
        icon: 'ChartBarIcon',
        defaultSize: 'medium',
    },
    inventory_low_stock: {
        id: 'inventory_low_stock',
        module: 'inventory',
        requiresAdmin: false,
        titleKey: 'inventory.low_stock_alert',
        icon: 'ExclamationTriangleIcon',
        defaultSize: 'medium',
    },
    inventory_items_table: {
        id: 'inventory_items_table',
        module: 'inventory',
        requiresAdmin: false,
        titleKey: 'inventory.title',
        icon: 'PackageIcon',
        defaultSize: 'large',
    },

    // Analytics Module Widgets
    // (Deprecated)

    // Global Dashboard Widgets
    projects_list: {
        id: 'projects_list',
        module: null,
        requiresAdmin: false,
        titleKey: 'dashboard.projects',
        icon: 'Squares2X2Icon',
        defaultSize: 'full', // Occupy full width
        globalOnly: true,
    },

    // Core Widgets (No module required)
    members_summary: {
        id: 'members_summary',
        module: null,
        requiresAdmin: false,
        titleKey: 'widgets.members_summary',
        icon: 'UsersIcon',
        defaultSize: 'small',
    },
    project_info: {
        id: 'project_info',
        module: null,
        requiresAdmin: false,
        titleKey: 'widgets.project_info',
        icon: 'InformationCircleIcon',
        defaultSize: 'small',
    },
};

/**
 * Default widget layout order
 */
/**
 * Default Layouts
 */

// Overview Dashboard Default Layout
export const DEFAULT_OVERVIEW_LAYOUT = [
    'project_info',
    'finance_balance_summary',
    'finance_upcoming_obligations',
    'finance_bills',
    'tasks_summary',
    'members_summary',
    'chat_recent',
];

// Widgets hidden by default on Overview
export const OVERVIEW_HIDDEN_DEFAULTS = [
    'finance_charts',
    'finance_account_flow',
    'finance_transactions',
    'finance_savings_goal',
    'finance_credit_simulation',
];

// Finance Dashboard Default Layout (All finance widgets active)
export const FINANCE_DEFAULT_LAYOUT = [
    'finance_balance_summary',
    'finance_accounts',
    'finance_upcoming_obligations',
    'finance_bills',
    'finance_charts',
    'finance_account_flow',
    'finance_transactions',
    'finance_savings_goal',
    'finance_credit_simulation',
];

// Operations Dashboard Default Layout
export const OPERATIONS_DEFAULT_LAYOUT = [
    'operations_lotes_list',
];

// Inventory Dashboard Default Layout
export const INVENTORY_DEFAULT_LAYOUT = [
    'inventory_summary',
    'inventory_low_stock',
    'inventory_items_table',
];

// Global Dashboard Default Layout
export const GLOBAL_DASHBOARD_DEFAULT_LAYOUT = [
    'projects_list',
];

// Backward compatibility alias
export const DEFAULT_LAYOUT = DEFAULT_OVERVIEW_LAYOUT;

/**
 * Get widgets available for a project based on modules and user role
 * 
 * @param {string[]} modules - Array of enabled module names
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {boolean} isPersonal - Whether this is a personal project
 * @returns {Object[]} Array of available widget definitions
 */
export function getAvailableWidgets(modules = [], isAdmin = false, isPersonal = false, isProjectContext = false) {
    return Object.values(WIDGET_DEFINITIONS).filter(widget => {
        if (!widget) return false;

        // Check global only widgets (hide in project context)
        if (widget.globalOnly && isProjectContext) {
            return false;
        }

        // Check module requirement
        if (widget.module && !modules.includes(widget.module)) {
            return false;
        }

        // Check admin requirement for finance widgets
        if (widget.requiresAdmin && !isAdmin) {
            return false;
        }

        // Hide members widget for personal projects
        if (widget.id === 'members_summary' && isPersonal) {
            return false;
        }

        return true;
    });
}

/**
 * Get ordered widgets based on user layout preferences
 * 
 * @param {string[]} layout - User's saved layout order (widget IDs)
 * @param {string[]} hidden - User's hidden widget IDs
 * @param {Object[]} availableWidgets - Widgets available to this user
 * @returns {Object[]} Ordered array of visible widgets
 */
export function getOrderedWidgets(layout = [], hidden = [], availableWidgets = []) {
    const availableIds = new Set(availableWidgets.map(w => w.id));
    const hiddenSet = new Set(hidden);

    // Start with layout order, filtering out unavailable/hidden widgets
    const orderedIds = layout.filter(id => availableIds.has(id) && !hiddenSet.has(id));

    // Add any available widgets not in layout (new widgets)
    availableWidgets.forEach(widget => {
        if (!orderedIds.includes(widget.id) && !hiddenSet.has(widget.id)) {
            orderedIds.push(widget.id);
        }
    });

    return orderedIds.map(id => WIDGET_DEFINITIONS[id]).filter(Boolean);
}

/**
 * Get widget definition by ID
 */
export function getWidgetById(id) {
    return WIDGET_DEFINITIONS[id] || null;
}
