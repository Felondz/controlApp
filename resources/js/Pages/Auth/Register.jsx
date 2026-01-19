import { Head, useForm, Link } from '@inertiajs/react';
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

export default function Register() {
    const { t } = useTranslate();
    const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });
    const submittingRef = useRef(false);

    const submit = (e) => {
        e.preventDefault();

        // Prevent double submission (iOS Safari issue)
        if (submittingRef.current || processing) return;
        submittingRef.current = true;

        console.log('Frontend: Registration form submitted', data);
        post(route('register'), {
            preserveState: true,
            onStart: () => console.log('Frontend: Request started to', route('register')),
            onFinish: () => {
                console.log('Frontend: Request finished');
                submittingRef.current = false;
            },
            onSuccess: () => console.log('Frontend: Request successful'),
            onError: (errors) => {
                console.error('Frontend: Request failed with errors', errors);
                submittingRef.current = false;
            },
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
                        onChange={(e) => setData('email', e.target.value)}
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
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
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
                                required
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
