import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import { useTranslate } from '@/Hooks/useTranslate';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
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

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
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
            <form onSubmit={submit} className="space-y-6">
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
                        autoComplete="email"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('auth.password')} />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('auth.confirm_password')} />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="terms"
                            checked={data.terms}
                            onChange={(e) => setData('terms', e.target.checked)}
                            required
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.agree_terms_text_1')}
                            <button
                                type="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                                onClick={() => setActiveModal('terms')}
                            >
                                {t('auth.terms_of_service')}
                            </button>
                            {t('auth.agree_terms_text_2')}
                            <button
                                type="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-primary-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                                onClick={() => setActiveModal('privacy')}
                            >
                                {t('auth.privacy_policy')}
                            </button>
                        </span>
                    </label>
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
