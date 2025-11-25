import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ForgotPassword({ status }) {
    const { t } = useTranslate();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title={t('auth.forgot_password_title')}>
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                {t('auth.forgot_password_description')}
            </div>

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
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
                </div>

                <div className="flex items-center justify-center mt-4 space-x-4">
                    <PrimaryButton className="justify-center !px-2 !py-1" disabled={processing}>
                        {processing ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {t('auth.email_password_reset_link')}
                    </PrimaryButton>
                    <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-200">
                        {t('auth.cancel')}
                    </Link>
                </div>
            </form>

            <div className="mt-4 text-center">
                <Link
                    href={route('login')}
                    className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {t('auth.back_to_login')}
                </Link>
            </div>
        </AuthLayout >
    );
}
