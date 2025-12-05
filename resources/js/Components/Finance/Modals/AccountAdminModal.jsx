import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useTranslate } from '@/Hooks/useTranslate';
import { XMarkIcon, ExclamationTriangleIcon } from '@/Components/Icons';
import CreditCardExpiryInput from '@/Components/CreditCardExpiryInput';
import Alert from '@/Components/Alert';

export default function AccountAdminModal({
    show = false,
    onClose,
    account = null,
    proyectoId = null,
    proyecto = null,
    onSuccess,
    onDelete // New prop to trigger delete modal in parent
}) {
    const { t } = useTranslate();
    const [activeTab, setActiveTab] = useState('basic');

    const { data, setData, processing, errors, reset } = useForm({
        nombre: account?.nombre || '',
        banco: account?.banco || '',
        tipo: account?.tipo || 'banco',
        saldo_inicial: account?.saldo_inicial ? (account.saldo_inicial / 100).toFixed(2) : '',
        estado: account?.estado || 'activa',
        // Credit card fields
        limite_credito: account?.limite_credito ? (account.limite_credito / 100).toFixed(2) : '',
        dia_corte: account?.dia_corte || '',
        dia_pago: account?.dia_pago || '',
        tasa_interes_anual: account?.tasa_interes_anual || '',
        fecha_vencimiento: account?.fecha_vencimiento || '',
        // Loan fields
        plazo: account?.plazo || '',
        valor_cuota: account?.valor_cuota ? (account.valor_cuota / 100).toFixed(2) : '',
        cuotas_pagadas: account?.cuotas_pagadas || '',
        // Investment fields
        tasa_interes: account?.tasa_interes || '',
        // Payroll fields
        es_nomina: account?.es_nomina || false,
        dia_nomina: account?.dia_nomina || [],
        valor_nomina: account?.valor_nomina ? (account.valor_nomina / 100).toFixed(2) : '',
        moneda: account?.moneda || proyecto?.moneda_default || 'COP',
    });

    useEffect(() => {
        if (show && account) {
            console.log('Loading account data into form:', account);
            setData({
                nombre: account.nombre || '',
                banco: account.banco || '',
                tipo: account.tipo || 'banco',
                saldo_inicial: account.saldo_inicial ? (Number(account.saldo_inicial) / 100).toFixed(2) : '0.00',
                estado: account.estado || 'activa',
                limite_credito: account.limite_credito ? (Number(account.limite_credito) / 100).toFixed(2) : '0.00',
                dia_corte: account.dia_corte || '',
                dia_pago: account.dia_pago || '',
                tasa_interes_anual: account.tasa_interes_anual || '',
                tasa_interes: account.tasa_interes || '',
                fecha_vencimiento: account.fecha_vencimiento
                    ? (account.tipo === 'credito' ? account.fecha_vencimiento.substring(0, 7) : account.fecha_vencimiento)
                    : '',
                plazo: account.plazo || '',
                valor_cuota: account.valor_cuota ? (Number(account.valor_cuota) / 100).toFixed(2) : '',
                cuotas_pagadas: account.cuotas_pagadas || '',
                es_nomina: Boolean(account.es_nomina),
                dia_nomina: Array.isArray(account.dia_nomina) ? account.dia_nomina : [],
                valor_nomina: account.valor_nomina ? (Number(account.valor_nomina) / 100).toFixed(2) : '',
                moneda: account.moneda || proyecto?.moneda_default || 'COP',
            });
            setActiveTab('basic');
        }
    }, [show, account?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let fechaVencimientoFinal = data.fecha_vencimiento;
        if (data.tipo === 'credito' && data.fecha_vencimiento && data.fecha_vencimiento.length === 7) {
            const [year, month] = data.fecha_vencimiento.split('-');
            const lastDay = new Date(year, month, 0).getDate();
            fechaVencimientoFinal = `${year}-${month}-${lastDay}`;
        }

        const submitData = {
            ...data,
            fecha_vencimiento: fechaVencimientoFinal,
            saldo_inicial: parseFloat(data.saldo_inicial || 0) * 100,
            limite_credito: data.tipo === 'credito' ? parseFloat(data.limite_credito || 0) * 100 : null,
            valor_cuota: data.tipo === 'prestamo' ? parseFloat(data.valor_cuota || 0) * 100 : null,
            valor_nomina: data.es_nomina ? parseFloat(data.valor_nomina || 0) * 100 : null,
            dia_nomina: data.es_nomina ? data.dia_nomina : [],
            _method: account ? 'PUT' : 'POST',
            _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                document.querySelector('input[name="_token"]')?.value ||
                window.csrfToken || ''
        };

        // Debug: Log the data being sent
        console.log('Submitting account data:', {
            ...submitData,
            // Don't log sensitive data
            _token: submitData._token ? '***' : 'missing',
            // Show the raw account type value
            rawTipoValue: data.tipo,
            // Show the type of the account type value
            tipoType: typeof data.tipo,
            // Show if the value is in the allowed types
            isValidTipo: ['efectivo', 'banco', 'credito', 'inversion', 'otro'].includes(data.tipo)
        });

        try {
            const url = account
                ? `/api/proyectos/${proyectoId}/cuentas/${account.id}`
                : `/api/proyectos/${proyectoId}/cuentas`;

            const response = await axios({
                method: account ? 'post' : 'post', // Always use POST with _method for Laravel
                url,
                data: submitData,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': submitData._token
                }
            });

            if (response.status >= 200 && response.status < 300) {
                reset();
                onSuccess?.();
                onClose();
                // Use Inertia's reload to refresh the page data
                router.reload({
                    only: ['proyecto'],
                    onSuccess: () => {
                        // Optional: Show success message
                        alert(t('common.saved_successfully', '¡Guardado exitosamente!'));
                    }
                });
            }
        } catch (error) {
            console.error('Error saving account:', error);

            // Show detailed error message
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]]?.[0] ||
                error.message ||
                t('common.error_saving', 'Error al guardar');

            alert(errorMessage);

            // Log the full error for debugging
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            }
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Fix: Use loose equality or Number() to ensure correct comparison between string/number types
    // Also ensure we don't show unlink for personal projects
    // We check propietario_id (owner) vs proyectoId (current project)
    const isLinkedAccount = account && Number(account.propietario_id) !== Number(proyectoId) && !proyecto?.es_personal;

    const handleUnlinkAccount = async () => {
        if (confirm(t('finance.confirm_unlink_account', '¿Estás seguro de que quieres desvincular esta cuenta?'))) {
            try {
                await axios.delete(`/api/proyectos/${proyectoId}/cuentas/${account.id}/unlink`);
                onSuccess?.();
                onClose();
                router.reload({ only: ['proyecto'] });
            } catch (error) {
                console.error('Error unlinking account:', error);
                alert(t('finance.unlink_error', 'Error al desvincular la cuenta.'));
            }
        }
    };

    const accountTypes = [
        { value: 'efectivo', label: t('accounts.account_types.cash', 'Efectivo') },
        { value: 'banco', label: t('accounts.account_types.bank', 'Cuenta Bancaria') },
        { value: 'credito', label: t('accounts.account_types.credit', 'Tarjeta de Crédito') },
        { value: 'prestamo', label: t('accounts.account_types.loan', 'Préstamo') },
        { value: 'inversion', label: t('accounts.account_types.investment', 'Inversión') },
        { value: 'otro', label: t('accounts.account_types.other', 'Otro') }
    ];

    // Payroll multi-select: 1-4 days
    const payrollDays = Array.from({ length: 31 }, (_, i) => i + 1);

    const togglePayrollDay = (day) => {
        setData('dia_nomina',
            data.dia_nomina.includes(day)
                ? data.dia_nomina.filter(d => d !== day)
                : [...data.dia_nomina, day].slice(0, 4) // Max 4 days
        );
    };



    const tabClasses = (isActive) =>
        `px-4 py-2 font-medium text-sm rounded-lg transition-colors ${isActive
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;

    return (
        <Modal show={show} onClose={handleClose} maxWidth="2xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {account ? t('finance.edit_account', 'Editar Cuenta') : t('finance.create_account', 'Crear Nueva Cuenta')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {account?.nombre || t('finance.enter_account_details', 'Ingrese los detalles de la cuenta')}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        aria-label={t('common.close', 'Cerrar')}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={tabClasses(activeTab === 'basic')}
                    >
                        {t('finance.basic_info', 'Información Básica')}
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={tabClasses(activeTab === 'advanced')}
                    >
                        {t('finance.advanced_settings', 'Configuración Avanzada')}
                    </button>
                    {account && (
                        <button
                            onClick={() => setActiveTab('danger')}
                            className={tabClasses(activeTab === 'danger')}
                        >
                            {t('finance.danger_zone', 'Zona de Riesgo')}
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* === BASIC TAB === */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <InputLabel htmlFor="nombre" value={t('finance.account_name', 'Nombre de la Cuenta')} />
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Mi Cuenta Bancaria"
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.nombre} className="mt-2" />
                            </div>

                            {/* Tipo */}
                            <div>
                                <InputLabel htmlFor="tipo" value={t('finance.account_type.label', 'Tipo de Cuenta')} />
                                <select
                                    id="tipo"
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    disabled={!!account}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white ${account ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {accountTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.tipo} className="mt-2" />
                            </div>

                            {/* Banco */}
                            <div>
                                <InputLabel htmlFor="banco" value={t('finance.bank_name', 'Banco / Institución')} />
                                <TextInput
                                    id="banco"
                                    type="text"
                                    value={data.banco}
                                    onChange={(e) => setData('banco', e.target.value)}
                                    placeholder="Banco Ejemplo"
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.banco} className="mt-2" />
                            </div>

                            {/* Moneda */}
                            <div>
                                <InputLabel htmlFor="moneda" value={t('finance.currency', 'Moneda')} />
                                <select
                                    id="moneda"
                                    value={data.moneda}
                                    onChange={(e) => setData('moneda', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="COP">COP (Peso Colombiano)</option>
                                    <option value="USD">USD (Dólar Americano)</option>
                                    <option value="EUR">EUR (Euro)</option>
                                    <option value="MXN">MXN (Peso Mexicano)</option>
                                    <option value="PEN">PEN (Sol Peruano)</option>
                                    <option value="CLP">CLP (Peso Chileno)</option>
                                    <option value="ARS">ARS (Peso Argentino)</option>
                                    <option value="BRL">BRL (Real Brasileño)</option>
                                </select>
                                <InputError message={errors.moneda} className="mt-2" />
                            </div>

                            {/* Saldo Inicial */}
                            <div>
                                <InputLabel htmlFor="saldo_inicial" value={t('finance.initial_balance', 'Saldo Inicial')} />
                                <TextInput
                                    id="saldo_inicial"
                                    type="number"
                                    step="0.01"
                                    value={data.saldo_inicial}
                                    onChange={(e) => setData('saldo_inicial', e.target.value)}
                                    placeholder="0.00"
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.saldo_inicial} className="mt-2" />
                            </div>

                            {/* Estado */}
                            <div>
                                <InputLabel htmlFor="estado" value={t('finance.status', 'Estado')} />
                                <select
                                    id="estado"
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="activa">{t('finance.active', 'Activa')}</option>
                                    <option value="inactiva">{t('finance.inactive', 'Inactiva')}</option>
                                </select>
                                <InputError message={errors.estado} className="mt-2" />
                            </div>
                        </div>
                    )}

                    {/* === ADVANCED TAB === */}
                    {activeTab === 'advanced' && (
                        <div className="space-y-4">
                            {/* Credit Card Fields */}
                            {data.tipo === 'credito' && (
                                <>
                                    <Alert type="info" title={t('finance.credit_card_settings', 'Configuración de Tarjeta de Crédito')} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="limite_credito" value={t('finance.credit_limit', 'Límite de Crédito')} />
                                            <TextInput
                                                id="limite_credito"
                                                type="number"
                                                step="0.01"
                                                value={data.limite_credito}
                                                onChange={(e) => setData('limite_credito', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.limite_credito} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tasa_interes_anual" value={t('finance.annual_rate', 'Tasa Anual (%)')} />
                                            <TextInput
                                                id="tasa_interes_anual"
                                                type="number"
                                                step="0.01"
                                                value={data.tasa_interes_anual}
                                                onChange={(e) => setData('tasa_interes_anual', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.tasa_interes_anual} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="dia_corte" value={t('finance.cutoff_day', 'Día de Corte')} />
                                            <TextInput
                                                id="dia_corte"
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={data.dia_corte}
                                                onChange={(e) => setData('dia_corte', e.target.value)}
                                                placeholder="15"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.dia_corte} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="dia_pago" value={t('finance.payment_day', 'Día de Pago')} />
                                            <TextInput
                                                id="dia_pago"
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={data.dia_pago}
                                                onChange={(e) => setData('dia_pago', e.target.value)}
                                                placeholder="20"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.dia_pago} className="mt-2" />
                                        </div>

                                        <div className="col-span-2">
                                            <InputLabel htmlFor="fecha_vencimiento" value={t('finance.expiration_date', 'Fecha de Vencimiento')} />
                                            <CreditCardExpiryInput
                                                id="fecha_vencimiento"
                                                value={data.fecha_vencimiento}
                                                onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.fecha_vencimiento} className="mt-2" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Loan Fields */}
                            {data.tipo === 'prestamo' && (
                                <>
                                    <Alert type="info" title={t('finance.loan_settings', 'Configuración de Préstamo')} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="plazo" value={t('finance.term_months', 'Plazo (meses)')} />
                                            <TextInput
                                                id="plazo"
                                                type="number"
                                                min="1"
                                                value={data.plazo}
                                                onChange={(e) => setData('plazo', e.target.value)}
                                                placeholder="24"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.plazo} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="valor_cuota" value={t('finance.monthly_payment', 'Cuota Mensual')} />
                                            <TextInput
                                                id="valor_cuota"
                                                type="number"
                                                step="0.01"
                                                value={data.valor_cuota}
                                                onChange={(e) => setData('valor_cuota', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.valor_cuota} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="cuotas_pagadas" value={t('finance.paid_installments', 'Cuotas Pagadas')} />
                                            <TextInput
                                                id="cuotas_pagadas"
                                                type="number"
                                                min="0"
                                                value={data.cuotas_pagadas}
                                                onChange={(e) => setData('cuotas_pagadas', e.target.value)}
                                                placeholder="0"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.cuotas_pagadas} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tasa_interes_anual" value={t('finance.annual_rate', 'Tasa Anual (%)')} />
                                            <TextInput
                                                id="tasa_interes_anual"
                                                type="number"
                                                step="0.01"
                                                value={data.tasa_interes_anual}
                                                onChange={(e) => setData('tasa_interes_anual', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.tasa_interes_anual} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="dia_pago" value={t('finance.payment_day', 'Día de Pago')} />
                                            <TextInput
                                                id="dia_pago"
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={data.dia_pago}
                                                onChange={(e) => setData('dia_pago', e.target.value)}
                                                placeholder="15"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.dia_pago} className="mt-2" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Investment Fields */}
                            {data.tipo === 'inversion' && (
                                <>
                                    <Alert type="info" title={t('finance.investment_settings', 'Configuración de Inversión')} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="tasa_interes" value={t('finance.expected_return', 'Tasa Esperada (%)')} />
                                            <TextInput
                                                id="tasa_interes"
                                                type="number"
                                                step="0.01"
                                                value={data.tasa_interes}
                                                onChange={(e) => setData('tasa_interes', e.target.value)}
                                                placeholder="0.00"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.tasa_interes} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="fecha_vencimiento" value={t('finance.maturity_date', 'Fecha de Vencimiento')} />
                                            <TextInput
                                                id="fecha_vencimiento"
                                                type="date"
                                                value={data.fecha_vencimiento}
                                                onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.fecha_vencimiento} className="mt-2" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Payroll Settings */}
                            {data.tipo === 'banco' && (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <input
                                            type="checkbox"
                                            id="es_nomina"
                                            checked={data.es_nomina}
                                            onChange={(e) => setData('es_nomina', e.target.checked)}
                                            className="w-4 h-4 accent-green-600"
                                        />
                                        <label htmlFor="es_nomina" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1">
                                            {t('finance.is_payroll_account', '¿Es una cuenta de nómina?')}
                                        </label>
                                    </div>

                                    {data.es_nomina && (
                                        <>
                                            <div>
                                                <InputLabel value={t('finance.payroll_payment_days', 'Días de Pago (1-4 días)')} />
                                                <div className="grid grid-cols-7 gap-2 mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                    {payrollDays.map((day) => (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => togglePayrollDay(day)}
                                                            className={`p-2 text-xs font-semibold rounded transition-colors ${data.dia_nomina.includes(day)
                                                                ? 'bg-primary-600 dark:bg-primary-500 text-white'
                                                                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500 hover:border-primary-400'
                                                                } ${data.dia_nomina.length >= 4 && !data.dia_nomina.includes(day) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={data.dia_nomina.length >= 4 && !data.dia_nomina.includes(day)}
                                                        >
                                                            {day}
                                                        </button>
                                                    ))}
                                                </div>
                                                <InputError message={errors.dia_nomina} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="valor_nomina" value={t('finance.estimated_payroll_value', 'Valor Estimado')} />
                                                <TextInput
                                                    id="valor_nomina"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.valor_nomina}
                                                    onChange={(e) => setData('valor_nomina', e.target.value)}
                                                    placeholder="0.00"
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.valor_nomina} className="mt-2" />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* === DANGER ZONE TAB === */}
                    {activeTab === 'danger' && (
                        <div className="space-y-4">
                            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-red-900 dark:text-red-100">
                                            {t('finance.danger_zone_title', 'Zona de Riesgo')}
                                        </h4>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                            {t('finance.danger_zone_description', 'Las acciones en esta sección son irreversibles y pueden causar pérdida permanente de datos.')}
                                        </p>
                                    </div>
                                </div>

                                {/* Unlink Account Section (for linked accounts) */}
                                {isLinkedAccount && (
                                    <div className="pt-6 border-b border-red-200 dark:border-red-900/50 pb-6">
                                        <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">
                                            {t('finance.unlink_account', 'Desvincular Cuenta')}
                                        </h5>
                                        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                            {t('finance.unlink_account_warning', 'Esta acción desvinculará la cuenta de este proyecto. La cuenta seguirá existiendo en Finanzas Personales.')}
                                        </p>
                                        <DangerButton
                                            onClick={handleUnlinkAccount}
                                            type="button"
                                        >
                                            {t('finance.unlink_account_button', 'Desvincular Cuenta')}
                                        </DangerButton>
                                    </div>
                                )}

                                {/* Delete Account Section */}
                                <div className={`${isLinkedAccount ? 'mt-6 pt-6' : ''} border-t border-red-200 dark:border-red-900/50`}>
                                    <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">
                                        {t('finance.delete_account', 'Eliminar Cuenta')}
                                    </h5>
                                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                        {account?.transacciones_count > 0
                                            ? t('finance.delete_account_warning_transactions', 'Esta cuenta tiene :count transacciones asociadas. Se eliminarán todas.', { count: account.transacciones_count })
                                            : t('finance.delete_account_warning', 'Esta acción eliminará la cuenta de forma permanente.')
                                        }
                                    </p>
                                    {/* Delete Button - Only for owned accounts */}
                                    {!isLinkedAccount && (
                                        <DangerButton
                                            onClick={() => onDelete?.(account)}
                                            type="button"
                                        >
                                            {t('common.delete_account', 'Eliminar Cuenta')}
                                        </DangerButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions - Only show on basic and advanced tabs */}
                    {(activeTab === 'basic' || activeTab === 'advanced') && (
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <SecondaryButton onClick={handleClose}>
                                {t('common.cancel', 'Cancelar')}
                            </SecondaryButton>
                            <PrimaryButton disabled={processing} type="submit">
                                {t('common.save', 'Guardar')}
                            </PrimaryButton>
                        </div>
                    )}
                </form>
            </div>
        </Modal>
    );
}
