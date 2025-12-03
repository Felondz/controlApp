import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useTranslate } from '@/Hooks/useTranslate';
import { XMarkIcon, InfoIcon } from '@/Components/Icons';

export default function AccountModal({
    show = false,
    onClose,
    account = null,
    proyectoId = null, // ID del proyecto (puede ser proyecto personal o regular)
    onSuccess
}) {
    const { t } = useTranslate();
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: account?.nombre || '',
        banco: account?.banco || '',
        tipo: account?.tipo || 'efectivo',
        saldo_inicial: account?.saldo_inicial ? (account.saldo_inicial / 100).toFixed(2) : '0.00',
        estado: account?.estado || 'activa',
        limite_credito: account?.limite_credito ? (account.limite_credito / 100).toFixed(2) : '0.00',
        dia_corte: account?.dia_corte || '',
        dia_pago: account?.dia_pago || '',
        tasa_interes_anual: account?.tasa_interes_anual || '',
    });

    useEffect(() => {
        if (show && account) {
            setData({
                nombre: account.nombre || '',
                banco: account.banco || '',
                tipo: account.tipo || 'efectivo',
                saldo_inicial: account?.saldo_inicial ? (account.saldo_inicial / 100).toFixed(2) : '0.00',
                estado: account.estado || 'activa',
                limite_credito: account?.limite_credito ? (account.limite_credito / 100).toFixed(2) : '0.00',
                dia_corte: account?.dia_corte || '',
                dia_pago: account?.dia_pago || '',
                tasa_interes_anual: account?.tasa_interes_anual || '',
            });
        } else if (show && !account) {
            reset();
        }
    }, [show, account]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...data,
            saldo_inicial: parseFloat(data.saldo_inicial) * 100, // Convertir a centavos
            limite_credito: parseFloat(data.limite_credito) * 100, // Convertir a centavos
        };

        // Las cuentas siempre se manejan a través de proyectos (incluso las personales)
        // ownerId debe ser siempre un proyecto_id
        if (account) {
            // Actualizar cuenta existente
            put(route('api.proyectos.cuentas.update', [proyectoId, account.id]), {
                data: submitData,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                    onClose();
                },
            });
        } else {
            // Crear nueva cuenta
            post(route('api.proyectos.cuentas.store', proyectoId), {
                data: submitData,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                    onClose();
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const accountTypes = [
        { value: 'efectivo', label: t('finance.account_type.cash', 'Efectivo') },
        { value: 'banco', label: t('finance.account_type.bank', 'Banco') },
        { value: 'credito', label: t('finance.account_type.credit', 'Tarjeta de Crédito') },
        { value: 'prestamo', label: t('finance.account_type.loan', 'Préstamo / Crédito Libre') },
        { value: 'inversion', label: t('finance.account_type.investment', 'Inversión') },
        { value: 'otro', label: t('finance.account_type.other', 'Otro') },
    ];

    return (
        <Modal show={show} onClose={handleClose} maxWidth="lg">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <InputLabel htmlFor="nombre" value={t('finance.account_name', 'Nombre de la Cuenta')} />
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
                        <InputLabel htmlFor="banco" value={t('finance.bank', 'Banco')} optional />
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
                        <InputLabel htmlFor="tipo" value={t('finance.account_type.label', 'Tipo de Cuenta')} />
                        <select
                            id="tipo"
                            value={data.tipo}
                            onChange={(e) => setData('tipo', e.target.value)}
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

                    {/* Campos Dinámicos para Crédito y Préstamo */}
                    {(data.tipo === 'credito' || data.tipo === 'prestamo') && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                {data.tipo === 'credito' && (
                                    <div>
                                        <InputLabel htmlFor="dia_corte" value={t('finance.cutoff_day', 'Día de Corte')} />
                                        <TextInput
                                            id="dia_corte"
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={data.dia_corte}
                                            onChange={(e) => setData('dia_corte', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Ej: 5"
                                        />
                                        <InputError message={errors.dia_corte} className="mt-2" />
                                    </div>
                                )}
                                <div className={data.tipo === 'prestamo' ? 'col-span-2' : ''}>
                                    <InputLabel htmlFor="dia_pago" value={t('finance.payment_day', 'Día de Pago')} />
                                    <TextInput
                                        id="dia_pago"
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={data.dia_pago}
                                        onChange={(e) => setData('dia_pago', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Ej: 20"
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
                                    />
                                    <InputError message={errors.limite_credito} className="mt-2" />
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2">
                                    <InputLabel htmlFor="tasa_interes_anual" value={t('finance.interest_rate_annual', 'Tasa Interés Anual (%)')} />
                                    {data.tipo === 'credito' && (
                                        <div className="group relative flex items-center">
                                            <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                            <div className="absolute left-full ml-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
                                    placeholder="Ej: 28.5"
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
                                    <div className="absolute left-full ml-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
                                placeholder="Ej: 10.0"
                            />
                            <InputError message={errors.tasa_interes_anual} className="mt-2" />
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
                                        {t('finance.credit_balance_hint', 'Para tarjetas de crédito, ingresa el monto que DEBES actualmente (deuda). Si está en cero, déjalo en 0.')}
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

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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

