import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const { t } = useTranslate();

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title={t('auth.email_verification')}>
            <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm">
                {t('auth.verify_email_description')}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md">
                    {t('auth.verification_link_sent')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="mt-6 flex items-center space-x-4">
                    <PrimaryButton
                        className="flex-1 justify-center"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('auth.sending')}
                            </div>
                        ) : (
                            t('auth.resend_verification')
                        )}
                    </PrimaryButton>
                    <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-200">
                        {t('auth.cancel')}
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <Link
                        href={route('login')}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                    >
                        {t('auth.back_to_login')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
