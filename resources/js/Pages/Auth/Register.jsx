import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import SecondaryLink from '@/Components/SecondaryLink';
import PasswordRequirements from '@/Components/PasswordRequirements';

export default function Register({ status }) {
    const { t } = useTranslate();
    const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        if (!data.terms) {
            setError('terms', t('auth.accept_terms_required'));
            return;
        }

        if (processing) return;

        // Validate Password Requirements Client-side before actual submission attempt
        const password = data.password;
        const requirements = [
            { isValid: password.length >= 8 },
            { isValid: /[a-zA-Z]/.test(password) },
            { isValid: /[0-9]/.test(password) },
            { isValid: /[a-z]/.test(password) && /[A-Z]/.test(password) }
        ];

        if (requirements.some(req => !req.isValid)) {
            setError('password', t('auth.password_requirements_error'));
            return;
        }

        post(route('register'), {
            preserveState: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const getModalContent = () => {
        if (activeModal === 'terms') {
            return {
                title: t('auth.terms_modal_title'),
                content: t('auth.terms_content')
            };
        }
        if (activeModal === 'privacy') {
            return {
                title: t('auth.privacy_modal_title'),
                content: t('auth.privacy_content')
            };
        }
        return { title: '', content: '' };
    };

    const { title: modalTitle, content: modalContent } = getModalContent();

    return (
        <AuthLayout title={t('auth.register')}>
            {status && (
                <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 text-sm rounded-md">
                    {status}
                </div>
            )}

            {(Object.keys(errors).length > 0 || (Object.keys(usePage().props.errors || {}).length > 0)) && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md shadow-sm">
                    <h3 className="text-sm font-bold text-red-800 dark:text-red-200 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {t('auth.registration_errors_title', 'Errores de registro:')}
                    </h3>
                    <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-300 space-y-0.5">
                        {Object.entries({ ...errors, ...(usePage().props.errors || {}) }).map(([key, value]) => (
                            <li key={key}>
                                {Array.isArray(value) ? value[0] : value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6" noValidate>
                <div>
                    <InputLabel htmlFor="name" value={t('auth.name')} />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('auth.email')} />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        inputMode="email"
                        onChange={(e) => {
                            setData('email', e.target.value);
                            if (errors.email) clearErrors('email');
                        }}
                        error={errors.email}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('auth.password')} />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => {
                            setData('password', e.target.value);
                            if (errors.password) clearErrors('password');
                        }}
                        error={errors.password}
                        required
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
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="block mt-4">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <Checkbox
                                name="terms"
                                id="terms"
                                checked={data.terms}
                                onChange={(e) => setData('terms', e.target.checked)}
                            />
                        </div>
                        <div className="ml-2 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                                {t('auth.agree_terms_text_1')}
                            </label>
                            {' '}
                            <button
                                type="button"
                                className="underline text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                                onClick={() => setActiveModal('terms')}
                            >
                                {t('auth.terms_of_service')}
                            </button>
                            {' '}
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('auth.agree_terms_text_2')}
                            </span>
                            {' '}
                            <button
                                type="button"
                                className="underline text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                                onClick={() => setActiveModal('privacy')}
                            >
                                {t('auth.privacy_policy')}
                            </button>
                        </div>
                    </div>
                    <InputError message={errors.terms} className="mt-1" />
                </div>

                <div className="mt-6 flex items-center justify-end space-x-4">
                    <SecondaryLink href="/">
                        {t('auth.cancel')}
                    </SecondaryLink>
                    <PrimaryButton className="ml-4" disabled={processing}>
                        {t('auth.register')}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <Link
                    href={route('login')}
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 hover:underline"
                >
                    {t('auth.already_registered')}
                </Link>
            </div>

            <Modal show={!!activeModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-primary-900 dark:text-gray-100">
                        {modalTitle}
                    </h2>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line max-h-96 overflow-y-auto">
                        {modalContent}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {t('auth.close')}
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthLayout>
    );
}
