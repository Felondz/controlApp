# Frontend Documentation

## Reusable Components

### PasswordInput
A wrapper around the native `input` element that adds a visibility toggle button.
- **Path**: `resources/js/Components/PasswordInput.jsx`
- **Props**: Accepts all standard input props plus `error` (string) for validation styling.
- **Features**:
  - Toggles between `password` and `text` types.
  - Theme-aware styling (light/dark mode).
  - Integrated `EyeIcon` and `EyeOffIcon`.
  - Error state styling support.

### Alert
Component for displaying status messages (info, warning, success, error) with standardized styles.

**Usage:**
```jsx
import Alert from '@/Components/Alert';

<Alert type="info" title="Note">
    This is an informational message.
</Alert>
```

**Props:**
- `type`: 'info' (blue), 'warning' (amber), 'success' (green), 'error' (red). Default: 'info'.
- `title`: Optional bold title.
- `children`: Message content.
- `className`: Additional CSS classes.

**Location:** `resources/js/Components/Alert.jsx`

## Icons
A hybrid strategy of reusable SVG icons and Heroicons is used.
- **Location:** `resources/js/Components/Icons.jsx`
- **New Icons:** `InfoIcon`, `BookOpenIcon`, `CodeIcon`.

## Theme and Colors
The system uses Tailwind CSS with CSS variables for dynamic theme support.
- **Primary**: Defined by the selected theme (purple, blue, green, etc.).
- **Secondary**: `colors.gray` to maintain an elegant and neutral dark mode.
- **Info**: `colors.blue` for informational and technical elements (e.g., developer card).

## UI Components

### QuantityInput
Component for numeric input with increment/decrement buttons, using theme colors.

**Usage:**
```jsx
import QuantityInput from '@/Components/UI/QuantityInput';

<QuantityInput
    value={term}
    onChange={setTerm}
    min={1}
    max={360}
    label="Term"
/>
```

**Props:**
- `value`: Current numeric value.
- `onChange`: Function to handle value changes.
- `min`: Minimum allowed value (default: 0).
- `max`: Maximum allowed value (default: Infinity).
- `step`: Increment/decrement step (default: 1).
- `label`: Optional label text.
- `className`: Additional CSS classes.

**Styling**: Uses `text-primary-600 dark:text-primary-400` for buttons to match the active theme.

**Location:** `resources/js/Components/UI/QuantityInput.jsx`

### InputGroup
Component for labeled text/number inputs with optional suffix and tooltip.

**Usage:**
```jsx
import InputGroup from '@/Components/UI/InputGroup';

<InputGroup
    label="Interest Rate"
    tooltip="Annual Effective Rate"
    type="number"
    value={rate}
    onChange={(e) => setRate(Number(e.target.value))}
    suffix="%"
/>
```

**Props:**
- `label`: Label text.
- `value`: Input value.
- `onChange`: Change handler function.
- `type`: Input type (default: 'text').
- `placeholder`: Placeholder text.
- `suffix`: Optional suffix text (e.g., '%', 'USD').
- `tooltip`: Optional tooltip text.
- `className`: Additional CSS classes.

**Styling**: Suffix uses `text-primary-600 dark:text-primary-400` with bold font weight.

**Location:** `resources/js/Components/UI/InputGroup.jsx`

---

## Responsive Design

### Breakpoint Strategy

The application uses a mobile-first responsive design approach with the following breakpoints:

- **Mobile**: `< 768px` - Bottom navigation, single column layouts, reduced spacing
- **Tablet**: `768px - 1024px` - Sidebar (collapsible), 2-column grids
- **Desktop**: `> 1024px` - Sidebar (expanded), multi-column grids, full spacing

### Tailwind Breakpoints

Consistent use of Tailwind CSS breakpoints across all views:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Specific Mobile Optimizations

#### Kanban Board
- **Horizontal Scrolling**: Container with `overflow-x-auto` and `snap-x` for smooth column navigation.
- **Compact Cards**: Reduced padding and font size for better information density.
- **Responsive Search**: Search bar and filters stack vertically on small screens.
- **Hidden Scrollbar**: Uses `scrollbar-hide` for a cleaner look.

#### Main Dashboard
- **Adaptive Grid**: `DraggableWidgetGrid` switches to a single column on mobile.
- **Touch Interactions**:
  - Drag handles on `WidgetCard` are always visible on mobile (no hover required).
  - Increased touch targets for easier dragging.

### Navigation Components

#### Sidebar (Desktop & Tablet)
- **Visibility**: Hidden on mobile (`hidden md:flex`), visible on tablet and desktop
- **Location**: `resources/js/Components/Sidebar.jsx`
- **Features**:
  - Collapsible on desktop
  - Theme-aware with CSS variables
  - Project-aware navigation
  - Shows global tools when enabled

#### BottomNavigation (Mobile)
- **Visibility**: Visible on mobile (`md:hidden`), hidden on tablet and desktop
- **Location**: `resources/js/Components/BottomNavigation.jsx`
- **Strategy**: "Smart Slot + Menu"
  - **Slots 1-2**: Fixed global items (Dashboard, Marketplace) or Project items (Dashboard, Overview).
  - **Smart Slot (3)**: Dynamically shows the most relevant module (Chat > Finance).
  - **Menu Slot (4)**: Opens `NavigationSheet` for access to all other modules and tools.
- **Features**:
  - Fixed at bottom of screen (`fixed bottom-0`)
  - Context-aware navigation (global vs project)
  - Icon-only design for cleaner look
  - Theme-aware using CSS variables
  - Unread message badges on Chat icon

**Usage:**
```jsx
import BottomNavigation from '@/Components/BottomNavigation';

<BottomNavigation user={user} project={project} />
```

**Props:**
- `user`: Authenticated user object (required)
- `project`: Current project object (optional, for project-aware navigation)

**Navigation Items:**
- **Global Context**: Dashboard, Marketplace, Menu
- **Project Context**: Dashboard, Overview, Smart Slot (Chat/Finance), Menu

**Styling:**
- Active state: `text-primary-600 dark:text-primary-400`
- Inactive state: `text-gray-500 dark:text-gray-400`
- Hover: `hover:text-primary-600 dark:hover:text-primary-400`

#### NavigationSheet (Mobile)
- **Purpose**: A unified bottom sheet menu for accessing all modules and tools that don't fit in the bottom bar.
- **Location**: `resources/js/Components/NavigationSheet.jsx`
- **Features**:
  - Grouped by "Project Modules" and "Global Tools"
  - Theme-aware styling
  - Accessible via the "Menu" item in BottomNavigation

### Layout Considerations

#### Main Content Padding
The `AuthenticatedLayout` adds bottom padding to prevent content overlap with bottom navigation:
```jsx
<div className="py-6 pb-20 md:pb-6">
```
- `pb-20` (80px) on mobile to clear bottom navigation
- `md:pb-6` (24px) on tablet and desktop

#### Floating Action Buttons (FAB)
FABs should be positioned above the bottom navigation on mobile:
```jsx
className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40"
```
- `bottom-20` on mobile (above bottom nav)
- `md:bottom-8` on desktop (normal position)
- `z-40` (bottom nav is `z-50`)

### Responsive Patterns

#### Grid Layouts
```jsx
// Dashboard projects grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">

// Project summary cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Theme selector
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
```

#### Spacing
```jsx
// Padding: smaller on mobile, larger on desktop
<div className="p-4 sm:p-6">

// Gap: tighter on mobile, wider on desktop
<div className="gap-4 md:gap-6">

// Margin: reduced on mobile
<div className="pt-4 sm:pt-8 pb-4 sm:pb-6">
```

#### Typography
```jsx
// Headings: smaller on mobile
<h1 className="text-xl sm:text-2xl">

// Body text: smaller on mobile
<p className="text-xs sm:text-sm">
```

#### Flex Direction
```jsx
// Stack vertically on mobile, horizontal on desktop
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
```

### Testing Responsive Design

Use browser DevTools device emulation to test:
1. **Mobile**: iPhone 12 Pro (390x844)
2. **Tablet**: iPad (768x1024)
3. **Desktop**: 1920x1080

**Checklist:**
- [ ] Bottom navigation visible and functional on mobile
- [ ] Sidebar visible and functional on tablet/desktop
- [ ] No horizontal scrolling on any breakpoint
- [ ] All interactive elements accessible
- [ ] Forms usable on mobile
- [ ] Charts responsive
- [ ] Images scale properly


### Finance Module
- **Dashboard**: `resources/js/Pages/Projects/Finance/ProjectDashboard.jsx`
  - Main panel with account charts and transaction list.
  - **Filtering**: Shows active accounts by default, with "Show Inactive" option.
  - **Management**: Create/edit/delete accounts and transactions.
  - **Integration**: Uses AccountAdminModal for editing existing accounts, AccountModal for creating new ones.

- **AccountChart**: `resources/js/Components/Finance/AccountChart.jsx`
  - Account visualization with balance, income, and expenses.
  - **Status**: Visual distinction (opacity/badge) for inactive accounts.
  - **Detailed Info**: Displays account-type-specific fields:
    - **Credit Cards**: Limit, available credit, payment date, interest rate
    - **Loans**: Total amount, monthly payment, remaining installments, interest rate
    - **Investments**: Maturity date, expected return rate
    - **Payroll**: Payment days (comma-separated), estimated amount
  - **Badges**: Visual account type indicators with appropriate icons.
  - **Color Coding**: Green balance (positive) or red (negative).
  - **Action**: Single "Manage" button opens AccountAdminModal.
  - **Currency Handling**: Automatically divides backend values (cents) by 100 for correct display.

- **AccountAdminModal**: `resources/js/Components/Finance/Modals/AccountAdminModal.jsx` (✨ NEW)
  - Professional account management modal with **3 tabs**:
  
  **Tab 1 - Basic Information**:
    - Name, bank, account type
    - Currency (8 options: COP, USD, EUR, MXN, PEN, CLP, ARS, BRL)
    - Initial balance
    - Status (Active/Inactive)
  
  **Tab 2 - Advanced Settings** (conditional by type):
    - **Credit Cards**: Credit limit, annual rate, cutoff day, payment day, expiration date
    - **Loans**: Term (months), monthly payment, paid installments, annual rate, payment day
    - **Investments**: Expected return rate (%), maturity date
    - **Payroll** (bank): Toggle `is_payroll_account`, interactive 7x5 grid for 1-4 payment days, estimated value
  
  **Tab 3 - Danger Zone**:
    - Clear warning about irreversible actions
    - Red "Delete Account" button that opens DeleteAccountModal for final confirmation
    - Information about associated transactions
  
  - **Props**:
    - `show`: Boolean to show/hide modal
    - `account`: Account object to edit
    - `proyecto`: Project object for context
    - `onClose`: Callback when closing
    - `onSuccess`: Callback when saving changes

- **AccountModal**: `resources/js/Components/Finance/Modals/AccountModal.jsx` (Legacy)
  - Modal for creating new accounts.
  - Maintains compatibility with quick creation flow.
  - **Note**: For editing existing accounts, use AccountAdminModal instead.
  - **Account Types** (6 types):
    - `efectivo`: Cash
    - `banco`: Bank account
    - `credito`: Credit card (requires additional fields)
    - `inversion`: Investment
    - `prestamo`: Loan
    - `otro`: Other
  - **Conditional Fields**:
    - **Credit**: `limite_credito`, `tasa_interes_anual`, `dia_corte`, `dia_pago`, `fecha_vencimiento`
    - **Loan**: `tasa_interes_anual`, `dia_pago`, `fecha_vencimiento` (optional)
    - **Investment**: `tasa_interes_anual` (optional)
  - **Currency Selector**: Supports 8 currencies (COP, USD, EUR, MXN, PEN, CLP, ARS, BRL)
  - **Defaults**: Currency defaults to `proyecto.moneda_default`, but each account can have its own currency
  - Support for changing account status (Active/Inactive).

- **DeleteAccountModal**: `resources/js/Components/Finance/Modals/DeleteAccountModal.jsx`
  - Safe confirmation modal for account deletion.
  - **Security**: Requires typing the exact account name to confirm.
  - **Warnings**: Shows count of associated transactions.
  - **Validation**: Delete button disabled until correct confirmation.
  - **Errors**: Displays backend errors (constraints, permissions, etc.).
  - **Integration**: Opened from the "Danger Zone" tab in AccountAdminModal.

- **PaymentConfirmationModal**: `resources/js/Components/Finance/Modals/PaymentConfirmationModal.jsx`
  - Modal for confirming payment of financial tasks.
  - Pre-fills form with task data (title, amount, category).
  - Allows editing before confirming.
  - Automatically marks task as "done" when creating the transaction.

- **UpcomingObligationsWidget**: `resources/js/Components/Finance/Widgets/UpcomingObligationsWidget.jsx`
  - Displays upcoming payments and financial obligations.
  - **Task Integration**: Combines future transactions and pending financial tasks.
  - **Differentiation**: Income (green) vs Expenses (red).
  - **Payroll**: Generates separate events for each configured payment day (e.g., 15th and 30th of month).
  - **Visual**: "Task" badge to distinguish tasks from transactions.
  - **Visual**: "Task" badge to distinguish tasks from transactions.
  - **Action**: "Mark as Paid" button (checkmark) on hover for admin users.
  - **Obligations**: Automatically includes credit card cut-offs and loan payments based on `dia_pago`.
  - **Currency Handling**: Automatically divides backend values (cents) by 100 for correct display.

### ChatWidget
- **Path**: `resources/js/Components/Project/ChatWidget.jsx`
- **Purpose**: Provides a real-time (polled) chat interface for project members.
- **Props**:
  - `project`: Project object (must include `id`).
  - `user`: Current authenticated user.
- **Features**:
  - **Private Messaging**: Support for 1-on-1 chats with project members.
  - **General Chat**: Group chat for all project members.
  - **Auto-scroll**: Automatically scrolls to the newest message.
  - **Polling**: Updates every 5 seconds.
  - **Theme-aware**: Uses `ChatIcon` and theme colors.

### InboxDropdown
- **Path**: `resources/js/Components/InboxDropdown.jsx` (Integrated in `AuthenticatedLayout`)
- **Purpose**: Displays a dropdown list of projects with unread messages.
- **Features**:
  - Real-time unread count badge.
  - Links directly to project chat.
  - "View All" link to `/inbox` page.

## Testing

The frontend codebase is fully covered by automated tests using **Vitest** and **React Testing Library**.

- **Coverage**: 100% Component Coverage (217 tests in 39 test files).
- **Location**: `tests/Frontend/Components`.
- **Command**: `npm run test`.
- **Note**: All tests use translation keys instead of hardcoded text, following the i18n system.

For detailed testing architecture and guidelines, refer to [TESTING_ARCHITECTURE.md](../04-testing/TESTING_ARCHITECTURE.md).


## Currency Standardization System

The application implements a **centralized multi-currency system** designed for future currency conversion features.

### Core Utilities

**Location**: `resources/js/Utils/currencyHelpers.js`

**Functions**:
- `getCurrencySymbol(currencyCode)` - Returns proper symbol ($, €, £, ¥, etc.)
- `getCurrencyLocale(currencyCode)` - Returns locale string (es-CO, en-US, de-DE, etc.)
- `shouldShowDecimals(currencyCode)` - Determines if currency uses decimals
- `formatCurrency(amount, currencyCode, divideByCents)` - Formats amount with correct symbol and structure

**Supported Currencies (19+)**:
- **Americas**: USD, COP, MXN, BRL, ARS, CLP, PEN, CAD
- **Europe**: EUR, GBP, CHF, RUB, TRY
- **Asia**: JPY, CNY, KRW, INR
- **Others**: AUD, ZAR

### Formatting Rules

1. **Symbol Display**: Each currency shows its proper symbol
   - USD/COP/MXN/ARS/CLP: `$`
   - EUR: `€`
   - GBP: `£`
   - JPY/CNY: `¥`
   - BRL: `R$`

2. **Locale-Aware Formatting**:
   - COP (Colombia): `$1.500.000` (dots for thousands, no decimals)
   - USD (US): `$1,500.00` (commas for thousands, 2 decimals)
   - EUR (Germany): `€1.500,00` (dots for thousands, comma for decimals)

3. **Decimal Handling**:
   - **No decimals**: COP, JPY, KRW, CLP (whole numbers only)
   - **2 decimals**: USD, EUR, GBP, and most others

4. **Color Coding**:
   - **Green** (`text-green-600 dark:text-green-400`): Positive balances
   - **Red** (`text-red-600 dark:text-red-400`): Negative balances

### Backend Storage Strategy

1. **Storage (Backend)**: All monetary values stored as **integers (cents)**
   - Example: $103.00 stored as `10300`
2. **Input (Frontend)**: User enters values in **units** (e.g., 103.00)
   - Frontend multiplies by 100 before sending to backend
   - `AccountAdminModal`: `parseFloat(value) * 100`
3. **Display (Frontend)**: Frontend receives **cents** from backend
   - `formatCurrency` automatically divides by 100 when `divideByCents = true`
   - Components pass backend values directly to helper

> [!IMPORTANT]
> If you observe incorrect values (e.g., 1,030,000 instead of 10,300), verify that `formatCurrency` is being called with `divideByCents = true` or values are being divided by 100.

### Components Using Currency Helpers

All 13 financial widgets use centralized formatting:

1. **AnalyticsWidget** - Trend charts with formatted amounts
2. **FinanceWidget** - Balance display with color coding, no module icon
3. **UpcomingObligationsWidget** - Future obligations
4. **BalanceSummaryWidget** - Assets/liabilities/net worth
5. **SavingsGoalWidget** - Goal progress tracking
6. **CreditSimulationWidget** - Loan calculations
7. **TransactionsWidget** - Transaction listings
8. **AccountChart** - Account visualization
9. **FinancialChartsWidget** - All chart types
10. **PersonalDashboard** - Overview display

### Usage Example

```jsx
import { formatCurrency } from '@/Utils/currencyHelpers';

// Format balance with proper symbol and structure
const balanceInCents = 150000; // from backend
const currency = 'COP';
const formatted = formatCurrency(balanceInCents, currency, true); // "$1.500.000"

// Different currencies
formatCurrency(150000, 'USD', true); // "$1,500.00"
formatCurrency(150000, 'EUR', true); // "€1.500,00"
formatCurrency(150000, 'JPY', true); // "¥1,500"
```

### Future Migration Path

System is prepared for:
- Real-time exchange rates
- Multi-currency accounts
- Cross-currency transactions
- Currency conversion history


## Scheduled Transactions (Bills) - **🆕 v2.6.4**

The application supports **scheduled/pending transactions** (bills) with recurrence and automation capabilities:

### Database Schema
- **status**: `enum('completed', 'pending', 'cancelled')` - Transaction state
- **is_recurring**: `boolean` - Whether the transaction repeats
- **recurrence_interval**: `enum('daily', 'weekly', 'biweekly', 'monthly', 'yearly')` - Frequency
- **recurrence_day**: `integer` - Day of month/week for recurrence
- **next_occurrence**: `date` - Next scheduled date
- **cuenta_predeterminada_id**: `integer` - Default payment account
- **debito_automatico**: `boolean` - Auto-debit enabled
- **fecha_autopago**: `date` - Scheduled auto-payment date

### Frontend Components

1. **BillModal** - **v2.6.4**:
   - **Auto-category**: Automatically assigns "Bills and Services" category
   - **Payment Account**: Select account for quick payment
   - **Auto-debit**: Enable automatic payment 3 days before due (credit cards only)
   - **Recurring Bills**: Monthly recurring option with day selector (1-30)
   - **Props**: `cuentas`, `categorias`, `proyectoId`, `bill`, `onSuccess`

2. **UpcomingObligationsWidget** - **v2.6.4**:
   - Displays pending transactions with payment button
   - **3 Payment Flows**:
     - No account: Opens TransactionModal
     - With account: Balance check → Confirmation → Direct payment
     - Auto-debit: Shows schedule → Early payment option
   - Color-coded indicators (Green = Income, Red = Expense)
   - Alert indicators based on due date proximity
   - Scrollable list showing all upcoming obligations

### Backend Jobs - **v2.6.4**

- **ProcessAutoBills** (6:00 AM daily): Processes auto-debit bills
- **ProcessRecurringBills** (6:30 AM daily): Generates monthly bill instances
- **Anti-duplication**: Prevents duplicate bills in same month
- **February Handling**: Adjusts days 29-30 to last day of February

### Automatic Categories - **v2.6.4**

- **ProyectoObserver**: Automatically creates 10 default categories for new projects
- **Default Categories**: Bills and Services, Food, Transport, Health, etc.
- **Trigger**: Executes automatically when creating a new project
- **No manual action required**: No seeders or manual commands needed

### Alert System
Visual indicators based on due date:
- **Red** (Overdue): Past due date
- **Orange** (Urgent): Due within 3 days
- **Yellow** (Soon): Due within 7 days
- **Default**: Due beyond 7 days

### Workflow
1. User creates a "Pending" bill via `BillModal` (auto-assigns Bills category)
2. Bill appears in `UpcomingObligationsWidget`
3. User clicks "Pay Bill" button
4. System processes payment based on account configuration
5. If recurring, next occurrence is scheduled automatically

