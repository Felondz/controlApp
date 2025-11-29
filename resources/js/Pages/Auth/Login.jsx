import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SecondaryLink from '@/Components/SecondaryLink';
import { useTranslate } from '@/Hooks/useTranslate';
import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import Checkbox from '@/Components/Checkbox';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const { errors: pageErrors, old } = usePage().props;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: old?.email || '',
        password: '',
        remember: false,
    });

    const { t } = useTranslate();
    const [verificationError, setVerificationError] = useState(null);
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Combine form errors and page errors for maximum reliability
    const activeErrors = Object.keys(errors).length > 0 ? errors : pageErrors;

    useEffect(() => {
        if (activeErrors.email) {
            const errorStr = Array.isArray(activeErrors.email) ? activeErrors.email[0] : activeErrors.email;
            if (typeof errorStr === 'string' && (
                errorStr.toLowerCase().includes('verificar') ||
                errorStr.toLowerCase().includes('verify')
            )) {
                setVerificationError(errorStr);
            }
        } else {
            setVerificationError(null);
        }
    }, [activeErrors]);

    const submit = (e) => {
        e.preventDefault();
        setVerificationError(null);
        setResendSuccess(false);

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleResendVerification = async () => {
        setResending(true);
        setResendSuccess(false);

        try {
            await axios.post('/api/email/resend-verification', {
                email: data.email
            });
            setResendSuccess(true);
            clearErrors('email');
        } catch (error) {
            // console.error('Error resending verification:', error);
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout title={t('auth.login')}>
            {status && (
                <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 text-sm rounded-md">
                    {status}
                </div>
            )}

            {verificationError && (
                <div className="mb-6 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-md">
                    <h3 className="text-sm font-semibold text-warning-800 dark:text-warning-200 mb-2">
                        {t('auth.email_not_verified') || 'Email no verificado'}
                    </h3>
                    <p className="text-sm text-warning-700 dark:text-warning-300 mb-3">
                        {t('auth.check_inbox') || 'Revisa tu bandeja de entrada'}
                    </p>
                    <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resending ? t('auth.sending') : t('auth.resend_verification_email')}
                    </button>
                </div>
            )}

            {resendSuccess && (
                <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 text-sm rounded-md">
                    {t('auth.verification_email_sent')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value={t('auth.email')} />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value={t('auth.password')} />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                            >
                                {t('auth.forgot_password')}
                            </Link>
                        )}
                    </div>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-700 dark:text-gray-300">
                        {t('auth.remember_me')}
                    </span>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-4">
                    <SecondaryLink href="/">
                        {t('auth.cancel')}
                    </SecondaryLink>
                    <PrimaryButton
                        className="ml-4"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('auth.logging_in')}
                            </div>
                        ) : (
                            t('auth.login_button')
                        )}
                    </PrimaryButton>
                </div>

            </form>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('auth.dont_have_account')}{' '}
                <Link href={route('register')} className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium">
                    {t('auth.register')}
                </Link>
            </div>
        </AuthLayout>
    );
}
