import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryLink from '@/Components/SecondaryLink';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const { t } = useTranslate();

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title={t('auth.confirm_password_title')}>
            <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm">
                {t('auth.confirm_password_description')}
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="password" value={t('auth.password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                        autoComplete="current-password"
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-end mt-6 space-x-4">
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
                                {t('auth.confirming')}
                            </div>
                        ) : (
                            t('auth.confirm_password_submit')
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
