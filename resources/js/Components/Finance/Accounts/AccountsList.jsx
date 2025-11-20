// resources/js/Components/Finance/Accounts/AccountsList.jsx

import React from 'react';
import { useTranslate } from '@/hooks/useTranslate';
import { Link } from '@inertiajs/react';

export default function AccountsList({ cuentas = [], proyectoId }) {
    const t = useTranslate();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('finance.accounts_list')}
                </h4>
                <Link
                    href={route('mis-proyectos.cuentas.create', { mis_proyecto: proyectoId })} // 💡 Usamos la ruta anidada
                    className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm"
                >
                    + {t('common.add_account')}
                </Link>
            </div>

            {cuentas.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 p-4 border border-dashed rounded-lg">
                    {t('finance.no_accounts')}
                </div>
            ) : (
                // Aquí se mapearán las cuentas cuando las tengamos
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cuentas.map(cuenta => (
                        <li key={cuenta.id} className="py-3 flex justify-between items-center">
                            <span>{cuenta.nombre}</span>
                            <span className="font-medium">{cuenta.saldo} {cuenta.moneda_default}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}