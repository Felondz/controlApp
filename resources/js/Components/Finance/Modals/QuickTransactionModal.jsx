import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useTranslate } from '@/Hooks/useTranslate';
import {
    XMarkIcon,
    BanknotesIcon,
    ShoppingBagIcon,
    TruckIcon,
    HomeIcon,
    BoltIcon,
    CreditCardIcon,
    EllipsisVerticalIcon
} from '@/Components/Icons';
import axios from 'axios';

export default function QuickTransactionModal({
    show = false,
    onClose,
    transaction = null,
    proyectoId = null,
    proyectos = [],
    cuentas = [],
    categorias = [],

    onSuccess,
    initialType = 'expense', // 'income', 'expense', or 'bill'
    initialAccountId = null
}) {
    const { t } = useTranslate();
    const [selectedProyectoId, setSelectedProyectoId] = useState(proyectoId);
    const [availableCuentas, setAvailableCuentas] = useState(cuentas);
    const [availableCategorias, setAvailableCategorias] = useState(categorias);
    const [loadingCategorias, setLoadingCategorias] = useState(false);

    const [activeTab, setActiveTab] = useState(initialType);
    const [showBillSelector, setShowBillSelector] = useState(false);
    const [availableBills, setAvailableBills] = useState([]);
    const [loadingBills, setLoadingBills] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors, reset } = useForm({
        proyecto_id: proyectoId || (transaction?.proyecto_id || null),
        cuenta_id: transaction?.cuenta_id || initialAccountId || '',
        categoria_id: transaction?.categoria_id || '', // We will map this to our static categories or handle in backend
        monto: transaction?.monto ? (Math.abs(transaction.monto) / 100).toFixed(2) : '',
        descripcion: transaction?.descripcion || '',
        notas: transaction?.notas || '',
        tipo: transaction?.monto > 0 ? 'income' : (initialType || 'expense'),
        task_id: null,
        custom_category: '' // For 'other' selection
    });

    // Quick Actions Configuration (Now the ONLY way to select category for expenses)
    const expenseCategories = [
        { id: 'transport', label: t('finance.transport', 'Transporte'), icon: TruckIcon },
        { id: 'food', label: t('finance.food', 'Alimentación'), icon: ShoppingBagIcon },
        { id: 'bills', label: t('finance.bills', 'Facturas'), icon: BoltIcon },
        { id: 'home', label: t('finance.home', 'Hogar'), icon: HomeIcon },
        { id: 'other', label: t('finance.other', 'Otro'), icon: EllipsisVerticalIcon },
    ];

    // Load data effects (similar to original modal but optimized)
    useEffect(() => {
        if (show) {
            if (transaction) {
                // Edit mode
                setActiveTab(transaction.monto > 0 ? 'income' : 'expense');
                setSelectedProyectoId(transaction.proyecto_id);
                // Ensure date is in YYYY-MM-DD format
                if (transaction.fecha) {
                    setData('fecha', transaction.fecha.split('T')[0]);
                }
            } else {
                // Create mode
                setActiveTab(initialType);
                if (!data.fecha) setData('fecha', new Date().toISOString().split('T')[0]);
                if (initialAccountId) setData('cuenta_id', initialAccountId);
                if (proyectoId) setSelectedProyectoId(proyectoId);
            }
        }
    }, [show, transaction, proyectoId, initialType, initialAccountId]);

    useEffect(() => {
        if (selectedProyectoId) {
            // loadCategorias(selectedProyectoId); // Removed
            if (!proyectoId) loadCuentas(selectedProyectoId);
        }
    }, [selectedProyectoId]);

    // Fetch dependent data
    useEffect(() => {
        if (selectedProyectoId) {
            loadCategorias(selectedProyectoId);
            if (!proyectoId) loadCuentas(selectedProyectoId);
        }
    }, [selectedProyectoId]);

    const loadCategorias = async (pid) => {
        setLoadingCategorias(true);
        try {
            // If we have categories prop and it matches the project context, use it
            if (categorias.length > 0 && proyectoId === pid) {
                setAvailableCategorias(categorias);
            } else {
                // Fix: Use direct URL or correct route name. Assuming standard resource route.
                const response = await axios.get(`/api/proyectos/${pid}/categorias`);
                setAvailableCategorias(response.data);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategorias(false);
        }
    };

    const loadCuentas = async (pid) => {
        try {
            const response = await axios.get(`/api/proyectos/${pid}/cuentas`);
            setAvailableCuentas(response.data);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    const loadPendingBills = async (pid) => {
        if (!pid) return;
        setLoadingBills(true);
        try {
            // Fetch pending transactions (Bills)
            const response = await axios.get(`/api/proyectos/${pid}/transacciones?status=pending`);
            setAvailableBills(response.data);
        } catch (error) {
            console.error('Error loading bills:', error);
        } finally {
            setLoadingBills(false);
        }
    };

    const handleCategorySelect = (category) => {
        const newDescription = category.id === 'other' ? '' : category.label;

        // Special logic for Bills
        if (category.id === 'bills') {
            setShowBillSelector(true);
            if (selectedProyectoId) {
                loadPendingBills(selectedProyectoId);
            }
        } else {
            setShowBillSelector(false);
            setSelectedBill(null);
        }

        setData({
            ...data,
            custom_category: category.id,
            descripcion: newDescription
        });
    };

    const handleBillSelect = (billId) => {
        if (!billId) {
            setSelectedBill(null);
            reset('monto', 'descripcion', 'categoria_id');
            return;
        }
        const bill = availableBills.find(b => b.id === parseInt(billId));
        if (bill) {
            setSelectedBill(bill);
            setData({
                ...data,
                monto: (Math.abs(bill.monto) / 100).toFixed(2),
                descripcion: bill.descripcion,
                categoria_id: bill.categoria_id,
                custom_category: 'bills'
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Determine Category ID
        let finalCategoryId = data.categoria_id;

        if (activeTab === 'income') {
            // Find a default income category
            const incomeCat = availableCategorias.find(c => c.tipo === 'ingreso' && (c.nombre.toLowerCase().includes('general') || c.nombre.toLowerCase().includes('ingreso') || c.nombre.toLowerCase().includes('otros')));
            finalCategoryId = incomeCat ? incomeCat.id : availableCategorias.find(c => c.tipo === 'ingreso')?.id;
        } else if (activeTab === 'expense') {
            if (data.custom_category === 'other') {
                // Find 'Otros' category
                const otherCat = availableCategorias.find(c => c.tipo === 'gasto' && c.nombre.toLowerCase().includes('otro'));
                finalCategoryId = otherCat ? otherCat.id : availableCategorias.find(c => c.tipo === 'gasto')?.id;
            } else {
                // Map SVG ID to Category Name
                const map = {
                    'transport': ['transporte', 'viaje', 'gasolina'],
                    'food': ['alimentación', 'comida', 'restaurante'],
                    'bills': ['facturas', 'servicios', 'publicos'],
                    'home': ['hogar', 'casa', 'vivienda']
                };

                const keywords = map[data.custom_category] || [];
                const cat = availableCategorias.find(c => c.tipo === 'gasto' && keywords.some(k => c.nombre.toLowerCase().includes(k)));
                finalCategoryId = cat ? cat.id : (availableCategorias.find(c => c.tipo === 'gasto')?.id || availableCategorias[0]?.id);
            }
        } else if (activeTab === 'bill') {
            // Auto-select 'Bills' category
            const map = { 'bills': ['facturas', 'servicios', 'publicos'] };
            const keywords = map['bills'];
            const cat = availableCategorias.find(c => c.tipo === 'gasto' && keywords.some(k => c.nombre.toLowerCase().includes(k)));
            // Fallback: Any expense category -> Any category -> null
            finalCategoryId = cat ? cat.id : (availableCategorias.find(c => c.tipo === 'gasto')?.id || availableCategorias[0]?.id);
        }

        const amount = parseFloat(data.monto);
        const finalAmount = activeTab === 'expense' ? -Math.abs(amount) : Math.abs(amount);

        // --- Frontend Validation ---
        if (!amount || isNaN(amount) || amount <= 0) {
            alert(t('finance.error_amount', 'Por favor ingresa un monto válido.'));
            return;
        }


        if (activeTab !== 'bill' && !data.cuenta_id) {
            alert(t('finance.error_account', 'Por favor selecciona una cuenta.'));
            return;
        }

        if (activeTab === 'bill' && !data.fecha) {
            alert(t('finance.error_date', 'Por favor ingresa una fecha de vencimiento.'));
            return;
        }

        if (activeTab === 'expense' && !data.custom_category) {
            alert(t('finance.error_select_category', 'Por favor selecciona una categoría.'));
            return;
        }

        if ((activeTab === 'bill' || data.custom_category === 'other') && !data.descripcion) {
            // Description is only mandatory for Bills (need concept) or 'Other' category (need detail)
            alert(t('finance.error_description', 'Por favor ingresa una descripción.'));
            return;
        }

        if (!finalCategoryId) {
            alert(t('finance.error_category', 'No se ha podido asignar una categoría. Verifica la configuración de categorías del proyecto.'));
            return;
        }
        // ---------------------------

        const submitOptions = {
            onSuccess: () => {
                reset();
                onSuccess?.();
                onClose();
            },
            onError: (errors) => {
                console.error('Transaction submission errors:', errors);
                // Alert first error if any
                if (Object.keys(errors).length > 0) {
                    alert(Object.values(errors)[0]);
                }
            }
        };

        const transformData = (data) => ({
            ...data,
            categoria_id: finalCategoryId,
            cuenta_id: (activeTab === 'bill' || !data.cuenta_id) ? null : data.cuenta_id,
            monto: finalAmount * 100, // Convert to cents
            status: activeTab === 'bill' ? 'pending' : 'completed' // Bills are pending, others completed
        });

        // Set the transformed data manually because Inertia useForm transform() runs on every request
        // but here we depend on calcuations. Actually, better to use setData just before submit?
        // Or just pass the data object to post/put?
        // Wait, Inertia useForm post() uses the CURRENT form data.
        // We can use transform() hook, but here we calculate finalCategoryId inside submit.

        // We will create a clean payload and use router.visit IF we want to bypass useForm's data
        // BUT we want useForm error handling.
        // The issue is: post(url, options) sends `data` state. We want to send modified data.
        // useForm's transform((data) => ...) sets a transformer for the form.

        // Let's use the transform() helper immediately before submit
        // Note: transform() returns undefined, it sets the transformer.
        // But we need to use 'data' from closure, not the fresh data arg if we want to capture calculated vars.

        setData('categoria_id', finalCategoryId);
        // We can't await setData because it might be async in React batching but useForm updates are usually immediate proxy updates?
        // No, setData is async-like.

        // Standard way:
        const payload = {
            ...data,
            categoria_id: finalCategoryId,
            cuenta_id: (activeTab === 'bill' || !data.cuenta_id) ? null : data.cuenta_id,
            monto: finalAmount * 100,
            status: activeTab === 'bill' ? 'pending' : 'completed'
        };

        const isUpdate = transaction || (selectedBill && activeTab !== 'bill');
        const targetId = transaction ? transaction.id : (selectedBill ? selectedBill.id : null);
        const routeName = isUpdate ? 'finance.transactions.update' : 'finance.transactions.store';
        const routeParams = isUpdate ? [data.proyecto_id, targetId] : [data.proyecto_id];

        router.visit(route(routeName, routeParams), {
            method: isUpdate ? 'put' : 'post',
            data: payload,
            preserveScroll: true,
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => {
                reset();
                onSuccess?.();
                onClose();
            },
            onError: (errors) => {
                console.error('Transaction errors:', errors);
                if (Object.keys(errors).length > 0) {
                    alert(t('finance.error_saving', 'Error al guardar: ') + Object.values(errors)[0]);
                }
            }
        });
    };



    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Header with Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'expense'
                            ? 'text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/10'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        onClick={() => setActiveTab('expense')}
                    >
                        {t('finance.expense', 'Gasto')}
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'income'
                            ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/10'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        onClick={() => setActiveTab('income')}
                    >
                        {t('finance.income', 'Ingreso')}
                    </button>

                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Amount Input - Large & Center */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-2xl">$</span>
                        </div>
                        <input
                            id="monto"
                            type="number"
                            step="0.01"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            className="block w-full pl-8 pr-12 py-4 text-3xl text-center font-bold text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-transparent"
                            placeholder="0.00"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Account Selector (Hidden for Bills) */}
                    {activeTab !== 'bill' && (
                        <div>
                            <InputLabel htmlFor="cuenta_id" value={t('finance.account', 'Cuenta')} />
                            <select
                                id="cuenta_id"
                                value={data.cuenta_id}
                                onChange={(e) => setData('cuenta_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                required={activeTab !== 'bill'}
                            >
                                <option value="">{t('finance.select_account', 'Seleccionar Cuenta')}</option>
                                {availableCuentas.map((cuenta) => (
                                    <option key={cuenta.id} value={cuenta.id}>
                                        {cuenta.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Bill Selector (Only for Bills category) */}
                    {showBillSelector && (
                        <div className="animate-fade-in-down">
                            <InputLabel value={t('finance.select_bill', 'Seleccionar Factura Pendiente (Opcional)')} />
                            <select
                                onChange={(e) => handleBillSelect(e.target.value)}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            >
                                <option value="">{t('finance.new_bill_payment', 'Registrar Nuevo Pago')}</option>
                                {availableBills.map((bill) => (
                                    <option key={bill.id} value={bill.id}>
                                        {bill.descripcion} ({new Date(bill.fecha).toLocaleDateString()}) - {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Math.abs(bill.monto) / 100)}
                                    </option>
                                ))}
                            </select>
                            {loadingBills && <p className="text-xs text-gray-500 mt-1">{t('common.loading', 'Cargando...')}</p>}
                        </div>
                    )}

                    {/* Expense Categories Grid */}
                    {activeTab === 'expense' && (
                        <div className="space-y-2">
                            <InputLabel value={t('finance.category', 'Categoría')} />
                            <div className="grid grid-cols-5 gap-2">
                                {expenseCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`flex flex-col items-center p-2 rounded-lg transition-colors border ${data.custom_category === cat.id
                                            ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-300'
                                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <cat.icon className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-medium truncate w-full text-center">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description - Required for 'Other', 'Bill', Optional for Income */}
                    {(activeTab === 'income' || activeTab === 'bill' || data.custom_category === 'other') && (
                        <div>
                            <InputLabel
                                value={activeTab === 'bill' ? t('finance.company', 'Empresa / Concepto') : t('finance.description', 'Descripción')}
                                required={data.custom_category === 'other' || activeTab === 'bill'}
                            />
                            <TextInput
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder={
                                    activeTab === 'income' ? t('finance.income_desc', 'Ej: Salario, Venta') :
                                        activeTab === 'bill' ? t('finance.bill_desc', 'Ej: EPM, Claro, Arriendo') :
                                            t('finance.other_desc', 'Especificar gasto...')
                                }
                                required={data.custom_category === 'other' || activeTab === 'bill'}
                            />
                        </div>
                    )}

                    {/* Due Date for Bills */}
                    {activeTab === 'bill' && (
                        <div>
                            <InputLabel value={t('finance.due_date', 'Fecha de Vencimiento')} />
                            <TextInput
                                type="date"
                                value={data.fecha}
                                onChange={(e) => setData('fecha', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton onClick={onClose} disabled={isSubmitting}>
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t('common.saving', 'Guardando...') : t('common.save', 'Guardar')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
