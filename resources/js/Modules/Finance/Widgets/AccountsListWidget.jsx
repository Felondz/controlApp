import { useTranslate } from '@/Hooks/useTranslate';
import AccountChart from '@/Components/Finance/AccountChart';
import WidgetCard from '@/Modules/Core/Widgets/WidgetCard';
import { LinkIcon } from '@/Components/Icons';

export default function AccountsListWidget({
    accounts = [],
    onEditAccount,
    onCardClick,
    isCollaborative = false,
    widget,
    isDragging,
    dragHandleProps,
    onHide
}) {
    const { t } = useTranslate();

    // Filter accounts by their association type if needed, but for the widget we'll show all
    const projectAccounts = accounts.filter(a => !a.is_linked);
    const linkedAccounts = accounts.filter(a => a.is_linked);

    const getAccountPaymentStatus = (cuenta) => {
        if (cuenta.tipo !== 'credito') return null;
        if (!cuenta.dia_pago) return null;

        const today = new Date();
        const currentDay = today.getDate();
        const daysToPayment = cuenta.dia_pago - currentDay;

        if (daysToPayment < 0) return 'paid'; // Assumption: if day passed, it's paid or overdue but we lack specific data here
        if (daysToPayment <= 3) return 'near';
        return 'ok';
    };

    return (
        <WidgetCard
            widget={widget}
            title={t('finance.project_accounts', 'Cuentas del Proyecto')}
            onHide={onHide}
            isDragging={isDragging}
            dragHandleProps={dragHandleProps}
        >
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {/* Project Accounts */}
                {projectAccounts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectAccounts.map((cuenta) => (
                            <div key={cuenta.id} className="relative group">
                                <AccountChart
                                    cuenta={{ ...cuenta, paymentStatus: getAccountPaymentStatus(cuenta) }}
                                    onEdit={onEditAccount}
                                    onClick={onCardClick}
                                    isCollaborative={isCollaborative}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Linked Accounts */}
                {linkedAccounts.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" />
                            {t('finance.linked_accounts', 'Cuentas Vinculadas')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {linkedAccounts.map((cuenta) => (
                                <div key={cuenta.id} className="relative group">
                                    <AccountChart
                                        cuenta={{ ...cuenta, paymentStatus: getAccountPaymentStatus(cuenta) }}
                                        onEdit={onEditAccount}
                                        onClick={onCardClick}
                                        isCollaborative={isCollaborative}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {accounts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic text-sm">
                        {t('finance.no_accounts_yet', 'No hay cuentas registradas')}
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}
