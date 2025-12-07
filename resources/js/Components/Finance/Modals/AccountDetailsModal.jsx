
import { useTranslate } from '@/Hooks/useTranslate';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TransactionsWidget from '@/Components/Finance/Widgets/TransactionsWidget';
import { formatCurrency } from '@/Utils/currencyHelpers';
import {
    XMarkIcon,
    PlusIcon,
    AccountCreditIcon,
    AccountLoanIcon,
    AccountInvestmentIcon,
    AccountBankIcon,
    AccountCashIcon
} from '@/Components/Icons';

export default function AccountDetailsModal({
    show = false,
    onClose,
    account,
    transactions = [],
    categories = [],
    currency = 'COP',
    onEditTransaction,
    onDeleteTransaction,
    onAddTransaction,
    currentUserId,
    projectId
}) {
    const { t } = useTranslate();

    if (!account) return null;

    // Filter transactions for this account
    const accountTransactions = transactions.filter(t => t.cuenta_id == account.id);

    // Helper to get icon (Reused from AccountChart logic)
    const getAccountIcon = () => {
        switch (account.tipo) {
            case 'credito': return AccountCreditIcon;
            case 'prestamo': return AccountLoanIcon;
            case 'inversion': return AccountInvestmentIcon;
            case 'efectivo': return AccountCashIcon;
            case 'banco':
            default: return AccountBankIcon;
        }
    };

    const AccountIcon = getAccountIcon();

    // Helper for balance color (Reused from AccountChart logic)
    const getBalanceColor = () => {
        const balance = account.saldo_actual || 0;
        if (account.tipo === 'credito' || account.tipo === 'prestamo') {
            return balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
        }
        return balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <AccountIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {account.nombre}
                            </h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {account.banco || t('finance.cash', 'Efectivo')}
                                </span>
                                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                    {t(`finance.account_type_${account.tipo}`, account.tipo)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onAddTransaction && (
                            <button
                                onClick={() => onAddTransaction(account)}
                                className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                title={t('finance.add_transaction', 'Agregar Transacción')}
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Balance Section */}
                <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('finance.current_balance', 'Saldo Actual')}
                    </span>
                    <span className={`text-2xl font-bold ${getBalanceColor()}`}>
                        {formatCurrency(account.saldo_actual, currency)}
                    </span>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/30 scrollbar-thin">
                    <TransactionsWidget
                        transactions={accountTransactions}
                        accounts={[account]} // Only show this account in filters
                        categories={categories}
                        currency={currency}
                        onEdit={onEditTransaction}
                        onDelete={onDeleteTransaction}
                        currentUserId={currentUserId}
                        projectId={projectId}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        {t('common.close', 'Cerrar')}
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
