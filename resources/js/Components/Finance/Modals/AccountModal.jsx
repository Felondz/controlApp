import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useTranslate } from '@/Hooks/useTranslate';
import { XMarkIcon, InfoIcon } from '@/Components/Icons';
import CreditCardExpiryInput from '@/Components/CreditCardExpiryInput';
import Alert from '@/Components/Alert';

export default function AccountModal({
    show = false,
    onClose,
    account = null,
    proyectoId = null, // ID del proyecto (puede ser proyecto personal o regular)
    proyecto = null, // Proyecto completo (para acceder a moneda_default)
    onSuccess
}) {
    const { t } = useTranslate();
    const { data, setData, processing, errors, reset } = useForm({
        nombre: account?.nombre || '',
        banco: account?.banco || '',
        tipo: account?.tipo || 'banco',
        saldo_inicial: account?.saldo_inicial ? (account.saldo_inicial / 100).toFixed(2) : '',
        estado: account?.estado || 'activa',
        limite_credito: account?.limite_credito ? (account.limite_credito / 100).toFixed(2) : '',
        dia_corte: account?.dia_corte || '',
        dia_pago: account?.dia_pago || '',
        tasa_interes_anual: account?.tasa_interes_anual || '',
        fecha_vencimiento: account?.fecha_vencimiento || '',
        moneda: account?.moneda || proyecto?.moneda_default || 'COP',
        plazo: account?.plazo || '',
        valor_cuota: account?.valor_cuota ? (account.valor_cuota / 100).toFixed(2) : '',
        cuotas_pagadas: account?.cuotas_pagadas || '',
        // Loan disbursement
        monto_desembolsado: account?.monto_desembolsado ? (account.monto_desembolsado / 100).toFixed(2) : '',
        cuenta_destino_id: account?.cuenta_destino_id || '',
        // Payroll
        es_nomina: account?.es_nomina || false,
        dia_nomina: account?.dia_nomina || [],
        valor_nomina: account?.valor_nomina ? (account.valor_nomina / 100).toFixed(2) : '',
    });

    useEffect(() => {
        if (show && account) {
            setData({
                nombre: account.nombre || '',
                banco: account.banco || '',
                tipo: account.tipo || 'banco',
                saldo_inicial: account?.saldo_inicial ? (account.saldo_inicial / 100).toFixed(2) : '0.00',
                estado: account.estado || 'activa',
                limite_credito: account?.limite_credito ? (account.limite_credito / 100).toFixed(2) : '0.00',
                dia_corte: account?.dia_corte || '',
                dia_pago: account?.dia_pago || '',
                tasa_interes_anual: account?.tasa_interes_anual || '',
                fecha_vencimiento: account?.fecha_vencimiento
                    ? (account.tipo === 'credito' ? account.fecha_vencimiento.substring(0, 7) : account.fecha_vencimiento)
                    : '',
                plazo: account.plazo || '',
                valor_cuota: account?.valor_cuota ? (account.valor_cuota / 100).toFixed(2) : '',
                cuotas_pagadas: account.cuotas_pagadas || '',
            });
        } else if (show && !account) {
            reset();
        }
    }, [show, account]);

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
            limite_credito: parseFloat(data.limite_credito || 0) * 100,
            valor_cuota: parseFloat(data.valor_cuota || 0) * 100,
            valor_nomina: parseFloat(data.valor_nomina || 0) * 100,
        };

        try {
            if (account) {
                // Actualizar cuenta existente
                await axios.put(`/api/proyectos/${proyectoId}/cuentas/${account.id}`, submitData);
            } else {
                // Crear nueva cuenta
                await axios.post(`/api/proyectos/${proyectoId}/cuentas`, submitData);
            }
            reset();
            onSuccess?.();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || t('common.error_saving', 'Error al guardar'));
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const accountTypes = [
        { value: 'efectivo', label: t('accounts.account_types.cash', 'Efectivo') },
        { value: 'banco', label: t('accounts.account_types.bank', 'Cuenta de Ahorros') },
        { value: 'credito', label: t('accounts.account_types.credit_card', 'Tarjeta de Crédito') },
        { value: 'prestamo', label: t('finance.account_type.loan', 'Préstamo / Crédito Libre') },
        { value: 'inversion', label: t('finance.account_type.investment', 'Inversión') },
        { value: 'otro', label: t('finance.account_type.other', 'Otro') },
    ];

    return (
        <Modal show={show} onClose={handleClose} maxWidth="lg">
            <div className="p-6 flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {account
                            ? t('finance.edit_account', 'Editar Cuenta')
                            : t('finance.create_account', 'Crear Cuenta')
                        }
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        aria-label={t('common.close', 'Cerrar')}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin space-y-4 pb-4 px-2">
                        {/* Nombre */}
                        <div>
                            <div className="flex items-center gap-2">
                                <InputLabel htmlFor="nombre" value={t('finance.account_name', 'Nombre de la Cuenta')} />
                                <div className="group relative flex items-center">
                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('finance.account_name_hint', 'A descriptive name to identify this account (e.g., Nequi, Bancolombia Savings, etc.)')}
                                    </div>
                                </div>
                            </div>
                            <TextInput
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="mt-1 block w-full"
                                required
                                autoFocus
                            />
                            <InputError message={errors.nombre} className="mt-2" />
                        </div>

                        {/* Banco (opcional) */}
                        <div>
                            <div className="flex items-center gap-2">
                                <InputLabel htmlFor="banco" value={t('finance.bank', 'Banco')} optional />
                                <div className="group relative flex items-center">
                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('finance.bank_hint', 'Name of the bank or financial institution (e.g., Bancolombia, BBVA, Nequi)')}
                                    </div>
                                </div>
                            </div>
                            <TextInput
                                id="banco"
                                type="text"
                                value={data.banco}
                                onChange={(e) => setData('banco', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.banco} className="mt-2" />
                        </div>

                        {/* Tipo */}
                        <div>
                            <div className="flex items-center gap-2">
                                <InputLabel htmlFor="tipo" value={t('finance.account_type.label', 'Tipo de Cuenta')} />
                                <div className="group relative flex items-center">
                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('finance.account_type_hint', 'Select the account type: Bank (savings/checking), Credit Card, Loan, Investment, or Cash')}
                                    </div>
                                </div>
                            </div>
                            <select
                                id="tipo"
                                value={data.tipo}
                                onChange={(e) => {
                                    setData(prev => ({
                                        ...prev,
                                        tipo: e.target.value,
                                        fecha_vencimiento: ''
                                    }));
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                required
                            >
                                {accountTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.tipo} className="mt-2" />
                        </div>

                        {data.tipo === 'efectivo' && (
                            <Alert
                                type="info"
                                className="mt-4"
                                message={t('finance.cash_account_hint', 'Consejo: Para mayor orden, te recomendamos manejar el efectivo como un gasto directo desde tus cuentas bancarias en lugar de crear una cuenta de efectivo separada.')}
                            />
                        )}

                        {/* Moneda */}
                        <div>
                            <div className="flex items-center gap-2">
                                <InputLabel htmlFor="moneda" value={t('finance.currency', 'Moneda')} />
                                <div className="group relative flex items-center">
                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {t('finance.currency_hint', 'Select the currency this account is denominated in')}
                                    </div>
                                </div>
                            </div>
                            <select
                                id="moneda"
                                value={data.moneda}
                                onChange={(e) => setData('moneda', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                required
                            >
                                <option value="COP">{t('currency.cop')}</option>
                                <option value="USD">{t('currency.usd')}</option>
                                <option value="EUR">{t('currency.eur')}</option>
                                <option value="MXN">{t('currency.mxn')}</option>
                                <option value="PEN">{t('currency.pen')}</option>
                                <option value="CLP">{t('currency.clp')}</option>
                                <option value="ARS">{t('currency.ars')}</option>
                                <option value="BRL">{t('currency.brl')}</option>
                            </select>
                            <InputError message={errors.moneda} className="mt-2" />
                        </div>

                        {/* Campos Dinámicos para Crédito y Préstamo */}
                        {(data.tipo === 'credito' || data.tipo === 'prestamo') && (
                            <>
                                {data.tipo === 'prestamo' && (<>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <InputLabel htmlFor="plazo" value={t('finance.term_months', 'Plazo (Meses)')} />
                                                <div className="group relative flex items-center">
                                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {t('finance.term_hint', 'Total number of installments/months for the loan (e.g., 12, 24, 36)')}
                                                    </div>
                                                </div>
                                            </div>
                                            <TextInput
                                                id="plazo"
                                                type="number"
                                                min="1"
                                                value={data.plazo}
                                                onChange={(e) => setData('plazo', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder={t('placeholders.example_12', 'Ej: 12')}
                                            />
                                            <InputError message={errors.plazo} className="mt-2" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <InputLabel htmlFor="valor_cuota" value={t('finance.installment_value', 'Valor Cuota')} />
                                                <div className="group relative flex items-center">
                                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {t('finance.installment_hint', 'Fixed amount you pay monthly for this loan')}
                                                    </div>
                                                </div>
                                            </div>
                                            <TextInput
                                                id="valor_cuota"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.valor_cuota}
                                                onChange={(e) => setData('valor_cuota', e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.valor_cuota} className="mt-2" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <InputLabel htmlFor="cuotas_pagadas" value={t('finance.paid_installments', 'Cuotas Pagadas')} optional />
                                                <div className="group relative flex items-center">
                                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {t('finance.paid_installments_hint', 'Number of installments you have already paid (to calculate progress)')}
                                                    </div>
                                                </div>
                                            </div>
                                            <TextInput
                                                id="cuotas_pagadas"
                                                type="number"
                                                min="0"
                                                value={data.cuotas_pagadas}
                                                onChange={(e) => setData('cuotas_pagadas', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder={t('placeholders.example_0', 'Ej: 0')}
                                            />
                                            <InputError message={errors.cuotas_pagadas} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Loan Disbursement Section - Only for NEW loans */}
                                    {!account && (
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">
                                                {t('finance.loan_disbursement', 'Desembolso de Crédito')}
                                            </h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                                                {t('finance.loan_disbursement_desc', '¿A qué cuenta fue consignado el dinero del préstamo?')}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="monto_desembolsado" value={t('finance.amount_to_deposit', 'Monto a consignar')} optional />
                                                    <TextInput
                                                        id="monto_desembolsado"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={data.monto_desembolsado}
                                                        onChange={(e) => setData('monto_desembolsado', e.target.value)}
                                                        className="mt-1 block w-full"
                                                        placeholder={t('placeholders.example_amount', 'Ej: 5000000')}
                                                    />
                                                    <InputError message={errors.monto_desembolsado} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="cuenta_destino_id" value={t('finance.destination_account', 'Cuenta destino')} optional />
                                                    <select
                                                        id="cuenta_destino_id"
                                                        value={data.cuenta_destino_id}
                                                        onChange={(e) => setData('cuenta_destino_id', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                                    >
                                                        <option value="">{t('finance.cash_disbursement', 'Efectivo (sin seguimiento)')}</option>
                                                        {(proyecto?.cuentas || [])
                                                            .filter(c => c.tipo === 'banco' && c.estado === 'activa')
                                                            .map(c => (
                                                                <option key={c.id} value={c.id}>
                                                                    {c.nombre} {c.banco ? `(${c.banco})` : ''}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                    <InputError message={errors.cuenta_destino_id} className="mt-2" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>)}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.tipo === 'credito' && (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <InputLabel htmlFor="dia_corte" value={t('finance.cutoff_day', 'Día de Corte')} />
                                                <div className="group relative flex items-center">
                                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {t('finance.cutoff_day_hint', 'Day of the month when your card statement is generated (e.g., if cutoff is on the 5th, that day the monthly summary is generated)')}
                                                    </div>
                                                </div>
                                            </div>
                                            <TextInput
                                                id="dia_corte"
                                                type="number"
                                                min="1"
                                                max="31"
                                                value={data.dia_corte}
                                                onChange={(e) => setData('dia_corte', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder={t('placeholders.example_5', 'Ej: 5')}
                                                required={data.tipo === 'credito'}
                                            />
                                            <InputError message={errors.dia_corte} className="mt-2" />
                                        </div>
                                    )}
                                    <div className={data.tipo === 'prestamo' ? 'col-span-2' : ''}>
                                        <div className="flex items-center gap-2">
                                            <InputLabel htmlFor="dia_pago" value={t('finance.payment_day', 'Día de Pago')} />
                                            <div className="group relative flex items-center">
                                                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {t('finance.payment_day_hint', 'Day of the month when you must make the payment (e.g., 20 = every 20th of the month)')}
                                                </div>
                                            </div>
                                        </div>
                                        <TextInput
                                            id="dia_pago"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={data.dia_pago}
                                            onChange={(e) => setData('dia_pago', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder={t('placeholders.example_20', 'Ej: 20')}
                                            required={data.tipo === 'credito' || data.tipo === 'prestamo'}
                                        />
                                        <InputError message={errors.dia_pago} className="mt-2" />
                                    </div>
                                </div>

                                {data.tipo === 'credito' && (
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <InputLabel htmlFor="limite_credito" value={t('finance.credit_limit', 'Cupo / Límite')} />
                                        </div>
                                        <TextInput
                                            id="limite_credito"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.limite_credito}
                                            onChange={(e) => setData('limite_credito', e.target.value)}
                                            className="mt-1 block w-full"
                                            required={data.tipo === 'credito'}
                                        />
                                        <InputError message={errors.limite_credito} className="mt-2" />
                                    </div>
                                )}

                                {data.tipo === 'credito' && (
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <InputLabel htmlFor="fecha_vencimiento" value={t('finance.due_date', 'Fecha de Vencimiento')} />
                                            <div className="group relative flex items-center">
                                                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {t('finance.due_date_hint', 'Expiration month and year of your card (e.g., 12/2028 = December 2028)')}
                                                </div>
                                            </div>
                                        </div>
                                        <CreditCardExpiryInput
                                            id="fecha_vencimiento"
                                            value={data.fecha_vencimiento}
                                            onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                                            className="mt-1 block w-full"
                                            required={data.tipo === 'credito'}
                                        />
                                        <InputError message={errors.fecha_vencimiento} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center gap-2">
                                        <InputLabel htmlFor="tasa_interes_anual" value={t('finance.interest_rate_annual', 'Tasa Interés Anual (%)')} />
                                        {data.tipo === 'credito' && (
                                            <div className="group relative flex items-center">
                                                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {t('finance.usury_rate_hint', 'Tasa de usura aprox: ~29% EA. Consulta tu extracto.')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <TextInput
                                        id="tasa_interes_anual"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.tasa_interes_anual}
                                        onChange={(e) => setData('tasa_interes_anual', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder={t('placeholders.example_rate', 'Ej: 28.5')}
                                        required={data.tipo === 'credito' || data.tipo === 'prestamo'}
                                    />
                                    <InputError message={errors.tasa_interes_anual} className="mt-2" />
                                </div>
                            </>
                        )}

                        {/* Campos Dinámicos para Ahorros/Inversión */}
                        {(data.tipo === 'banco' || data.tipo === 'inversion') && (
                            <div>
                                <div className="flex items-center gap-2">
                                    <InputLabel htmlFor="tasa_interes_anual" value={t('finance.yield_rate_annual', 'Rendimiento Anual (%)')} optional />
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {t('finance.yield_rate_hint', 'Cuentas de alto rendimiento: ~8-12% EA. Tradicionales: ~0.1% EA.')}
                                        </div>
                                    </div>
                                </div>
                                <TextInput
                                    id="tasa_interes_anual"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.tasa_interes_anual}
                                    onChange={(e) => setData('tasa_interes_anual', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder={t('placeholders.example_yield', 'Ej: 10.0')}
                                />
                                <InputError message={errors.tasa_interes_anual} className="mt-2" />
                            </div>
                        )}

                        {/* Campos de Nómina (Solo para Banco) */}
                        {data.tipo === 'banco' && (
                            <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                                <div className="flex items-center">
                                    <input
                                        id="es_nomina"
                                        type="checkbox"
                                        checked={data.es_nomina}
                                        onChange={(e) => setData('es_nomina', e.target.checked)}
                                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-900 dark:border-gray-700"
                                    />
                                    <label htmlFor="es_nomina" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                        {t('finance.is_payroll_account', 'Es cuenta de nómina')}
                                    </label>
                                </div>

                                {data.es_nomina && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                                        <div className="sm:col-span-2">
                                            <InputLabel value={t('finance.payroll_days', 'Días de Pago')} />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                                                {t('finance.select_payroll_days_hint', 'Selecciona uno o más días del mes')}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {[...Array(31)].map((_, i) => {
                                                    const day = i + 1;
                                                    const isSelected = Array.isArray(data.dia_nomina) && data.dia_nomina.includes(day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentDays = Array.isArray(data.dia_nomina) ? data.dia_nomina : [];
                                                                if (isSelected) {
                                                                    setData('dia_nomina', currentDays.filter(d => d !== day));
                                                                } else {
                                                                    setData('dia_nomina', [...currentDays, day].sort((a, b) => a - b));
                                                                }
                                                            }}
                                                            className={`
                                                                w-9 h-9 flex items-center justify-center text-sm font-medium rounded transition-colors
                                                                ${isSelected
                                                                    ? 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                                }
                                                            `}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={errors.dia_nomina || errors['dia_nomina.0']} className="mt-2" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <InputLabel htmlFor="valor_nomina" value={t('finance.estimated_value', 'Valor Estimado')} />
                                                <div className="group relative flex items-center">
                                                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full mb-2 right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                        {t('finance.payroll_value_hint', 'Average amount of your monthly payroll (will be used for income projections)')}
                                                    </div>
                                                </div>
                                            </div>
                                            <TextInput
                                                id="valor_nomina"
                                                type="number"
                                                min="0"
                                                value={data.valor_nomina}
                                                onChange={(e) => setData('valor_nomina', e.target.value)}
                                                className="mt-1 block w-full"
                                                required={data.es_nomina}
                                            />
                                            <InputError message={errors.valor_nomina} className="mt-2" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Estado (Solo al editar) */}
                        {account && (
                            <div>
                                <InputLabel htmlFor="estado" value={t('finance.status', 'Estado')} />
                                <select
                                    id="estado"
                                    value={data.estado || 'activa'}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                >
                                    <option value="activa">{t('finance.active', 'Activa')}</option>
                                    <option value="inactiva">{t('finance.inactive', 'Inactiva')}</option>
                                </select>
                                <InputError message={errors.estado} className="mt-2" />
                            </div>
                        )}

                        {/* Saldo Inicial */}
                        <div>
                            <div className="flex items-center gap-2">
                                <InputLabel htmlFor="saldo_inicial" value={t('finance.initial_balance', 'Saldo Inicial')} />
                                {data.tipo === 'credito' && (
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {t('finance.credit_balance_hint', 'For credit cards, enter the amount you currently OWE (debt). If it\'s at zero, leave it at 0.')}
                                        </div>
                                    </div>
                                )}
                                {data.tipo === 'prestamo' && (
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {t('finance.loan_balance_hint', 'Enter the total loan amount received (initial debt).')}
                                        </div>
                                    </div>
                                )}
                                {(data.tipo === 'banco' || data.tipo === 'efectivo') && (
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {t('finance.bank_balance_hint', 'Enter the current balance of this account (the amount you have available).')}
                                        </div>
                                    </div>
                                )}
                                {data.tipo === 'inversion' && (
                                    <div className="group relative flex items-center">
                                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            {t('finance.investment_balance_hint', 'Enter the current value of your investment (principal + returns).')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <TextInput
                                id="saldo_inicial"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.saldo_inicial}
                                onChange={(e) => setData('saldo_inicial', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.saldo_inicial} className="mt-2" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 flex-none">
                        <SecondaryButton
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? t('common.saving', 'Guardando...')
                                : account
                                    ? t('common.update', 'Actualizar')
                                    : t('common.create', 'Crear')
                            }
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

                     : t('common.create', 'Crear')
                            }
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

