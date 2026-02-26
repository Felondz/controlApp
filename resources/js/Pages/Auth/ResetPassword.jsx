import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryLink from '@/Components/SecondaryLink';
import PasswordRequirements from '@/Components/PasswordRequirements';

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
                <div className="p-4 text-danger-600 bg-danger-50 dark:bg-danger-900/20 dark:text-danger-400 rounded-lg">
                    {validationError}
                </div>
                <div className="mt-4 text-center">
                    <Link
                        href={route('password.request')}
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm font-medium"
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
                <div className="mb-6 p-4 text-sm font-medium text-success-600 bg-success-50 dark:bg-success-900/20 dark:text-success-400 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value={t('auth.email')} />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        disabled
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('auth.new_password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                    <InputError message={errors.password} className="mt-1" />
                    <PasswordRequirements password={data.password} />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_password')} />
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="flex items-center justify-end mt-4 space-x-4">
                    <SecondaryLink href="/">
                        {t('auth.cancel')}
                    </SecondaryLink>
                    <PrimaryButton className="ml-4" disabled={processing}>
                        {processing ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {t('auth.reset_password_submit')}
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
