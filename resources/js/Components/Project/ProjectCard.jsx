import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { PlusIcon, MinusIcon, EllipsisVerticalIcon, CurrencyDollarIcon, CheckListIcon, FolderIcon, PuzzleIcon, CalendarIcon, CalculatorIcon, UserCircleIcon, PersonalFinanceIcon, ChatIcon } from '@/Components/Icons';
import FinanceWidget from '@/Components/Widgets/FinanceWidget';
import TasksWidget from '@/Components/Widgets/TasksWidget';
import TransactionModal from '@/Components/Finance/Modals/TransactionModal';
import { getThemeStyle } from '@/Utils/themeStyles';
import axios from 'axios';

export default function ProjectCard({ proyecto }) {
    const { t } = useTranslate();
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState(null); // 'ingreso' o 'gasto'
    const [cuentas, setCuentas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Determine primary module (default to finance if none or multiple)
    const modules = proyecto.modules || ['finance'];
    const primaryModule = modules[0];

    const getModuleIcon = (moduleName) => {
        switch (moduleName) {
            case 'finance': return <CurrencyDollarIcon className="h-4 w-4" />;
            case 'tasks': return <CheckListIcon className="h-4 w-4" />;
            case 'chat': return <ChatIcon className="h-4 w-4" />;
            default: return null;
        }
    };

    const renderWidget = () => {
        // Security Check: If finance module is active but user is NOT admin, show restricted state
        if (modules.includes('finance') && !proyecto.isAdmin) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-6">
                    <span className="text-4xl mb-2">🔒</span>
                    <span className="text-xs text-center">{t('finance.restricted', 'Acceso Restringido')}</span>
                </div>
            );
        }

        if (modules.includes('finance')) return <FinanceWidget project={proyecto} />;
        if (modules.includes('tasks')) return <TasksWidget project={proyecto} />;
        return <FinanceWidget project={proyecto} />; // Fallback
    };

    const getCardColor = () => {
        // If user defined a color, use it. Otherwise use CSS variable for primary color
        return proyecto.color || 'var(--color-primary-600)';
    };

    const loadFinanceData = async (tipo) => {
        try {
            const [cuentasRes, categoriasRes] = await Promise.all([
                axios.get(`/api/proyectos/${proyecto.id}/cuentas`),
                axios.get(`/api/proyectos/${proyecto.id}/categorias`),
            ]);
            setCuentas(cuentasRes.data);
            // Filtrar categorías por tipo (ingreso o gasto)
            setCategorias(categoriasRes.data.filter(c => c.tipo === tipo));
            return cuentasRes.data;
        } catch (error) {
            console.error('Error loading finance data:', error);
            return [];
        }
    };

    const handleAddIncome = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTransactionType('ingreso');
        const loadedCuentas = await loadFinanceData('ingreso');

        if (loadedCuentas && loadedCuentas.length === 0) {
            alert(t('finance.no_accounts_alert', 'No tienes cuentas asociadas a este proyecto. Debes crear una cuenta primero para registrar transacciones.'));
            return;
        }

        setShowTransactionModal(true);
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTransactionType('gasto');
        const loadedCuentas = await loadFinanceData('gasto');

        if (loadedCuentas && loadedCuentas.length === 0) {
            alert(t('finance.no_accounts_alert', 'No tienes cuentas asociadas a este proyecto. Debes crear una cuenta primero para registrar transacciones.'));
            return;
        }

        setShowTransactionModal(true);
    };

    const handleTransactionSuccess = () => {
        setShowTransactionModal(false);
        setTransactionType(null);
        // Recargar la página para actualizar datos
        router.reload({ only: ['proyectos'] });
    };

    return (
        <>
            <Link
                href={route('mis-proyectos.show', { mis_proyecto: proyecto.id })}
                className="block bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[200px] relative group border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-800"
                style={proyecto.es_personal ? {} : getThemeStyle(proyecto.theme)}
            >
                {/* Color Accent Line */}
                <div
                    className="h-1 w-full absolute top-0 left-0"
                    style={{ backgroundColor: getCardColor() }}
                ></div>

                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex flex-row items-start gap-3 mb-4 relative">
                        {/* Options Menu - Absolute Positioned */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="absolute top-0 right-0 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>

                        <div className="flex-shrink-0">
                            {(() => {
                                // Robust Image Detection
                                const imageUrl = proyecto.image_url
                                    || proyecto.imagen
                                    || (proyecto.image_path ? `/storage/${proyecto.image_path}` : null)
                                    || (proyecto.icon && (proyecto.icon.startsWith('http') || proyecto.icon.startsWith('/')) ? proyecto.icon : null);

                                if (imageUrl) {
                                    return (
                                        <img
                                            src={imageUrl}
                                            alt={proyecto.nombre}
                                            className="h-12 w-12 rounded-md object-cover"
                                        />
                                    );
                                }

                                // Personal Finance Exception: Always use PersonalFinanceIcon
                                if (proyecto.es_personal) {
                                    return (
                                        <span className="text-4xl text-primary-600 dark:text-primary-400">
                                            <PersonalFinanceIcon className="h-12 w-12" />
                                        </span>
                                    );
                                }

                                // Fallback to Icon from Gallery
                                const IconComponent = {
                                    'folder': FolderIcon,
                                    'puzzle': PuzzleIcon,
                                    'calendar': CalendarIcon,
                                    'calculator': CalculatorIcon,
                                    'finance': CurrencyDollarIcon,
                                    'tasks': CheckListIcon,
                                }[proyecto.icon] || FolderIcon;

                                return (
                                    <span className="text-4xl text-primary-600 dark:text-primary-400">
                                        <IconComponent className="h-12 w-12" />
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-xl font-bold text-primary-700 dark:text-primary-300 leading-tight group-hover:text-primary-800 dark:group-hover:text-primary-200 transition-colors line-clamp-2">
                                {proyecto.nombre}
                            </h3>
                            {proyecto.descripcion && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {proyecto.descripcion}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-2 mt-2 text-primary-500 dark:text-primary-400">
                                {modules.map(mod => (
                                    <div key={mod} className="relative group/icon">
                                        <span title={mod === 'chat' ? t('modules.chat.title', 'Chat') : t(`modules.${mod}`, mod)} className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            {getModuleIcon(mod)}
                                        </span>
                                        {mod === 'chat' && proyecto.unread_messages_count > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] text-white justify-center items-center">
                                                    {proyecto.unread_messages_count > 9 ? '9+' : proyecto.unread_messages_count}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Widget Body */}
                    <div className="flex-1">
                        {renderWidget()}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-center items-center">
                        {/* Quick Actions - Only for Admins if Finance */}
                        {modules.includes('finance') && proyecto.isAdmin && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddIncome}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors"
                                    aria-label={t('finance.add_income', 'Agregar Ingreso')}
                                >
                                    <PlusIcon className="h-3 w-3" />
                                    <span className="hidden sm:inline">{t('finance.income', 'Ingreso')}</span>
                                </button>
                                <button
                                    onClick={handleAddExpense}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
                                    aria-label={t('finance.add_expense', 'Agregar Gasto')}
                                >
                                    <MinusIcon className="h-3 w-3" />
                                    <span className="hidden sm:inline">{t('finance.expense', 'Gasto')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Transaction Modal */}
            {showTransactionModal && (
                <TransactionModal
                    show={showTransactionModal}
                    onClose={() => {
                        setShowTransactionModal(false);
                        setTransactionType(null);
                    }}
                    transaction={null}
                    proyectoId={proyecto.id}
                    proyectos={[]}
                    cuentas={cuentas}
                    categorias={categorias}
                    onSuccess={handleTransactionSuccess}
                />
            )}
        </>
    );
}