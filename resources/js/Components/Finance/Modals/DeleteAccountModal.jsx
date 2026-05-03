import { useState } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { ExclamationTriangleIcon } from '@/Components/Icons';
import axios from 'axios';

export default function DeleteAccountModal({ show, onClose, account, project, onSuccess }) {
    const { t } = useTranslate();
    const [confirmation, setConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Debug logging removed

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!account) {
            return;
        }

        if (confirmation !== account.nombre) {
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            await axios.delete(`/api/proyectos/${project.id}/cuentas/${account.id}`);
        } catch (err) {
            setError(err.response?.data?.message || t('common.error_saving', 'Error al guardar'));
            setProcessing(false);
            return;
        }

        // Success path
        setProcessing(false); // Force UI update immediately
        setConfirmation('');

        if (onSuccess) {
            onSuccess();
        } else {
            router.reload({ only: ['proyecto'] });
            onClose();
        }
    };

    const isConfirmed = account && confirmation === account.nombre;

    // Don't render if account is null
    if (!account || !project) {
        return null;
    }

    const handleClose = () => {
        setConfirmation('');
        setError(null);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <form onSubmit={handleDelete} className="p-6">
                <div className="flex items-center justify-center mb-4 text-red-600">
                    <ExclamationTriangleIcon className="w-12 h-12" />
                </div>

                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center mb-2">
                    {t('finance.delete_account_title', '¿Eliminar Cuenta?')}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {(account?.saldo ?? account?.saldo_actual ?? 0) !== 0 ? (
                        <span className="text-red-600 font-bold">
                            {t('finance.delete_account_balance_error', 'No se puede eliminar la cuenta porque tiene un saldo diferente de 0. Por favor ajusta el saldo antes de continuar.')}
                            <br />
                            <span className="text-sm">Saldo actual: {new Intl.NumberFormat(navigator.language, { style: 'currency', currency: 'USD' }).format(account?.saldo ?? account?.saldo_actual ?? 0)}</span>
                        </span>
                    ) : account?.transacciones_count > 0
                        ? t('finance.delete_account_warning_transactions', 'Esta cuenta tiene :count transacciones asociadas. Será marcada como inactiva.', { count: account.transacciones_count })
                        : t('finance.delete_account_warning', 'Esta acción no se puede deshacer. La cuenta será eliminada permanentemente.')
                    }
                </p>

                <div className="mt-6">
                    <InputLabel htmlFor="confirmation" value={t('finance.type_to_confirm', 'Escribe ":name" para confirmar', { name: account?.nombre })} className="sr-only" />

                    <TextInput
                        id="confirmation"
                        type="text"
                        name="confirmation"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        className="mt-1 block w-full"
                        placeholder={account?.nombre}
                        isFocused
                        disabled={(account?.saldo ?? account?.saldo_actual ?? 0) !== 0}
                    />
                </div>

                {/* Display general backend errors */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose} disabled={processing}>
                        {t('common.cancel', 'Cancelar')}
                    </SecondaryButton>

                    <DangerButton disabled={!isConfirmed || processing || (account?.saldo ?? account?.saldo_actual ?? 0) !== 0}>
                        {processing ? t('common.deleting', 'Eliminando...') : t('common.delete', 'Eliminar')}
                    </DangerButton>
                </div>
            </form>
        </Modal>
    );
}
