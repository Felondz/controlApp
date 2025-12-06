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
    finance_balance: {
        id: 'finance_balance',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'widgets.finance_balance',
        icon: 'CurrencyDollarIcon',
        defaultSize: 'small',
    },
    finance_upcoming: {
        id: 'finance_upcoming',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'widgets.finance_upcoming',
        icon: 'CalendarIcon',
        defaultSize: 'medium',
    },
    finance_transactions: {
        id: 'finance_transactions',
        module: 'finance',
        requiresAdmin: true,
        titleKey: 'widgets.finance_transactions',
        icon: 'ArrowsRightLeftIcon',
        defaultSize: 'medium',
    },

    // Tasks Module Widgets
    tasks_summary: {
        id: 'tasks_summary',
        module: 'tasks',
        requiresAdmin: false,
        titleKey: 'widgets.tasks_summary',
        icon: 'CheckListIcon',
        defaultSize: 'small',
    },
    tasks_overdue: {
        id: 'tasks_overdue',
        module: 'tasks',
        requiresAdmin: false,
        titleKey: 'widgets.tasks_overdue',
        icon: 'ExclamationTriangleIcon',
        defaultSize: 'small',
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

    // Analytics Module Widgets
    // (Deprecated)

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
export const DEFAULT_LAYOUT = [
    'project_info',
    'finance_balance',
    'tasks_summary',
    'members_summary',
    'finance_upcoming',
    'chat_recent',
    'analytics_overview',
];

/**
 * Get widgets available for a project based on modules and user role
 * 
 * @param {string[]} modules - Array of enabled module names
 * @param {boolean} isAdmin - Whether the user is an admin
 * @param {boolean} isPersonal - Whether this is a personal project
 * @returns {Object[]} Array of available widget definitions
 */
export function getAvailableWidgets(modules = [], isAdmin = false, isPersonal = false) {
    return Object.values(WIDGET_DEFINITIONS).filter(widget => {
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
