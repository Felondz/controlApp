import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { PlusIcon, MinusIcon, EllipsisVerticalIcon, CurrencyDollarIcon, CheckListIcon, FolderIcon, PuzzleIcon, CalendarIcon, CalculatorIcon, UserCircleIcon, PersonalFinanceIcon, ChatIcon, ChartBarIcon, BellIcon, FactoryIcon, PackageIcon, UsersIcon, LockClosedIcon } from '@/Components/Icons';
import { FinanceWidget } from '@/Modules/Finance/Widgets';
import { TasksWidget } from '@/Modules/Tasks/Widgets';
import QuickTransactionModal from '@/Components/Finance/Modals/QuickTransactionModal';
import { getThemeStyle } from '@/Utils/themeStyles';
import axios from 'axios';

export default function ProjectCard(props) {
    const { proyecto } = props;
    const { t } = useTranslate();
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState(null); // 'ingreso' o 'gasto'
    const [cuentas, setCuentas] = useState([]);
    const [categorias, setCategorias] = useState([]);

    // Determine primary module (default to finance if none or multiple)
    let modules = proyecto.modules || ['finance'];
    // Defensive check: Ensure modules is an array. If string, try to parse.
    if (typeof modules === 'string') {
        try {
            modules = JSON.parse(modules);
        } catch (e) {
            modules = ['finance'];
        }
    }
    if (!Array.isArray(modules)) modules = ['finance'];
    // Filter out deprecated modules like 'analytics'
    modules = modules.filter(m => m !== 'analytics');
    const primaryModule = modules[0];

    const getModuleIcon = (moduleName) => {
        switch (moduleName) {
            case 'finance': return <CurrencyDollarIcon className="h-4 w-4" />;
            case 'tasks': return <CheckListIcon className="h-4 w-4" />;
            case 'chat': return <ChatIcon className="h-4 w-4" />;
            case 'marketplace': return <PuzzleIcon className="h-4 w-4" />;
            case 'inventory': return <PackageIcon className="h-4 w-4" />;
            case 'operations': return <FactoryIcon className="h-4 w-4" />;
            case 'crm': return <UsersIcon className="h-4 w-4" />;
            // Analytics is deprecated
            default: return null;
        }
    };

    const renderWidget = () => {
        // Security Check: If finance module is active but user is NOT admin, show restricted state
        if (modules.includes('finance') && !proyecto.isAdmin) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-6 px-4">
                    <LockClosedIcon className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-[10px] text-center italic">
                        {t('finance.restricted_friendly', 'Not all information is available for you')}
                    </span>
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
                axios.get(`/api/proyectos/${proyecto.uuid}/cuentas`),
                axios.get(`/api/proyectos/${proyecto.uuid}/categorias`),
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
        setTransactionType('income');
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
        setTransactionType('expense');
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

    if (!proyecto || !proyecto.uuid) {
        console.error('ProjectCard received invalid project:', proyecto);
        return null; // Prevent rendering invalid cards
    }

    return (
        <>
            <div
                className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[200px] relative group border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-800"
                style={proyecto.es_personal ? {} : getThemeStyle(proyecto.theme)}
            >
                {/* Color Accent Line */}
                <div
                    className="h-1 w-full absolute top-0 left-0"
                    style={{ backgroundColor: getCardColor() }}
                ></div>

                {/* Drag Handle */}
                {props.dragHandleProps && (
                    <div
                        {...props.dragHandleProps}
                        className="absolute top-2 right-2 p-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10 bg-white/50 dark:bg-black/20 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                <Link
                    href={route('mis-proyectos.show', { proyecto: proyecto.uuid })}
                    className="p-4 sm:p-6 flex-1 flex flex-col cursor-pointer"
                >
                    {/* Header */}
                    <div className="flex flex-row items-start gap-3 mb-4">
                        <div className="flex-shrink-0">
                            {(() => {
                                // Robust Image Detection
                                const imageUrl = proyecto.image_url
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
                            <h3 className="text-xl font-bold text-primary-700 dark:text-primary-300 leading-tight group-hover:text-primary-800 dark:group-hover:text-primary-200 transition-colors line-clamp-2 flex items-center gap-2">
                                {proyecto.nombre}
                                {proyecto.unread_messages_count > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                                        {proyecto.unread_messages_count > 99 ? '99+' : proyecto.unread_messages_count}
                                    </span>
                                )}
                            </h3>
                            {proyecto.descripcion && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {proyecto.descripcion}
                                </p>
                            )}
                            {proyecto.role && (
                                <div className="mt-2 flex">
                                    <span className={`text-[8px] tracking-wider uppercase font-extrabold px-2 py-0.5 rounded-md border shadow-sm ${proyecto.role === 'owner'
                                            ? 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                                            : proyecto.role === 'admin' || proyecto.role === 'administrador'
                                                ? 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800'
                                                : 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                                        }`}>
                                        {t(`roles.${proyecto.role}`)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Module Icons - Centered Below Header */}
                    <div className="flex items-center justify-center gap-2 mb-4 text-primary-500 dark:text-primary-400">
                        {modules.map(mod => (
                            <div key={mod} className="relative">
                                <span title={t(`modules.${mod === 'chat' ? 'chat.title' : mod}`, mod)} className="flex items-center">
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

                    {/* Widget Body */}
                    <div className="flex-1">
                        {renderWidget()}
                    </div>
                </Link>

                {/* Footer - ACTIONS OUTSIDE LINK */}
                <div className="mx-4 sm:mx-6 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-center items-center">
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

            {/* Transaction Modal */}
            {showTransactionModal && (
                <QuickTransactionModal
                    show={showTransactionModal}
                    onClose={() => {
                        setShowTransactionModal(false);
                        setTransactionType(null);
                    }}
                    transaction={null}
                    proyectoId={proyecto.uuid}
                    proyectos={[]}
                    cuentas={cuentas}
                    categorias={categorias}
                    onSuccess={handleTransactionSuccess}
                    initialType={transactionType || 'expense'}
                />
            )}
        </>
    );
}