import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ResetPassword({ token, email, status }) {
    const [validationError, setValidationError] = useState(null);
    const { t } = useTranslate();

    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        // Validar que tenemos token y email antes de renderizar el formulario
        if (!token || !email) {
            setValidationError(t('auth.reset_password_invalid_link'));
        }
    }, [token, email, t]);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    if (validationError) {
        return (
            <AuthLayout title={t('auth.reset_password_title')}>
                <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                    {validationError}
                </div>
                <div className="mt-4 text-center">
                    <Link
                        href={route('password.request')}
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 text-sm font-medium"
                    >
                        {t('auth.request_new_password')}
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title={t('auth.reset_password_title')}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('auth.reset_password_instructions')}
            </p>

            {status && (
                <div className="mb-6 p-4 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('auth.email')}
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('auth.new_password')}
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('auth.confirm_password')}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center mt-4 space-x-4">
                    <PrimaryButton className="flex-1 justify-center" disabled={processing}>
                        {processing ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {t('auth.reset_password_submit')}
                    </PrimaryButton>
                    <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-200">
                        {t('auth.cancel')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
