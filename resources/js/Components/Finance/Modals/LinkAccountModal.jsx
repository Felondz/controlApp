import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { useTranslate } from '@/Hooks/useTranslate';
import { router } from '@inertiajs/react';

export default function LinkAccountModal({ show, onClose, project }) {
    const { t } = useTranslate();
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && project) {
            fetchAvailableAccounts();
        } else {
            setAvailableAccounts([]);
            setSelectedAccount('');
            setError(null);
        }
    }, [show, project]);

    const fetchAvailableAccounts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/proyectos/${project.uuid}/cuentas/available`);
            setAvailableAccounts(response.data);
        } catch (err) {
            setError(t('common.error_loading_data', 'Error al cargar los datos'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAccount) return;

        setLoading(true);
        try {
            await axios.post(`/api/proyectos/${project.uuid}/cuentas/link`, {
                cuenta_id: selectedAccount
            });
            onClose();
            router.reload({ only: ['proyecto'] });
        } catch (err) {
            setError(t('common.error_saving', 'Error al guardar'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex-none">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {t('finance.link_account', 'Vincular Cuenta Personal')}
                    </h2>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('finance.link_account_description', 'Selecciona una de tus cuentas personales para usarla en este proyecto. Seguirás siendo el propietario de la cuenta.')}
                        </p>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="account" value={t('finance.select_account', 'Seleccionar Cuenta')} />

                            {loading && availableAccounts.length === 0 ? (
                                <div className="mt-2 text-sm text-gray-500">{t('common.loading', 'Cargando...')}</div>
                            ) : availableAccounts.length > 0 ? (
                                <select
                                    id="account"
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                    required
                                >
                                    <option value="">{t('common.select_option', 'Seleccione una opción')}</option>
                                    {availableAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.nombre} ({account.banco || account.tipo})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                                    {t('finance.no_accounts_available', 'No tienes cuentas personales disponibles para vincular.')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 flex-none">
                        <SecondaryButton onClick={onClose} disabled={loading} type="button">
                            {t('common.cancel', 'Cancelar')}
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={loading || !selectedAccount}>
                            {t('common.link', 'Vincular')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
