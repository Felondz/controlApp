import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import ImageUploader from '@/Components/ImageUploader';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { useTranslate } from '@/Hooks/useTranslate';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { t } = useTranslate();
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_photo: null,
        });

    const submit = (e) => {
        e.preventDefault();

        router.post(route('profile.update'), {
            _method: 'patch',
            ...data,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('profile_photo', null);
                setPhotoPreview(user.profile_photo_url);
            },
        });
    };

    const handlePhotoChange = (file) => {
        setData('profile_photo', file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const deletePhoto = () => {
        router.delete(route('profile.photo.delete'), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);
                setData('profile_photo', null);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-primary-800 dark:text-primary-200">
                    {t('profile.information', 'Información del Perfil')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t('profile.information_hint', 'Actualiza la información de perfil y dirección de correo electrónico de tu cuenta.')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Profile Photo Section */}
                <ImageUploader
                    value={data.profile_photo}
                    preview={photoPreview}
                    onChange={handlePhotoChange}
                    onDelete={deletePhoto}
                    shape="square"
                    size="lg"
                    maxSizeMB={3}
                    showDeleteButton={true}
                    label={t('profile.photo', 'Foto de Perfil')}
                    hint={t('profile.photo_hint', 'JPG, PNG, GIF o WebP. Máximo 3MB. Mínimo 100x100px.')}
                    error={errors.profile_photo}
                    className="items-center"
                />

                <div>
                    <InputLabel htmlFor="name" value={t('profile.name', 'Nombre')} />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('profile.email', 'Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70"
                        value={data.email}
                        disabled={true}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            {t('profile.unverified', 'Tu dirección de correo electrónico no está verificada.')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {t('profile.resend_verification', 'Haz clic aquí para reenviar el correo electrónico de verificación.')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                {t('profile.verification_sent', 'Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {t('common.save', 'Guardar')}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('common.saved', 'Guardado.')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
