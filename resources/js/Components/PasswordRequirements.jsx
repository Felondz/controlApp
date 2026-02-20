import React from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { CheckCircleIcon, XCircleIcon } from '@/Components/Icons';

export default function PasswordRequirements({ password = '' }) {
    const { t } = useTranslate();

    const requirements = [
        {
            key: 'min',
            label: t('auth.password_rule_min'),
            isValid: password.length >= 8
        },
        {
            key: 'letters',
            label: t('auth.password_rule_letters'),
            isValid: /[a-zA-Z]/.test(password)
        },
        {
            key: 'numbers',
            label: t('auth.password_rule_numbers'),
            isValid: /[0-9]/.test(password)
        },
        {
            key: 'mixed',
            label: t('auth.password_rule_mixed'),
            isValid: /[a-z]/.test(password) && /[A-Z]/.test(password)
        }
    ];

    return (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('auth.password_requirements_title')}
            </p>
            <ul className="space-y-1">
                {requirements.map((req) => (
                    <li key={req.key} className="flex items-center text-xs">
                        <span className={`mr-2 ${req.isValid ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                            {req.isValid ? (
                                <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-current opacity-60" />
                            )}
                        </span>
                        <span className={req.isValid ? 'text-green-600 dark:text-green-400 font-medium whitespace-nowrap' : 'text-gray-500 dark:text-gray-400 whitespace-nowrap'}>
                            {req.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
