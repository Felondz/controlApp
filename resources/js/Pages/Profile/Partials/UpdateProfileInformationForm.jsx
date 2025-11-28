import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { UserCircleIcon } from '@/Components/Icons';
import { useTranslate } from '@/Hooks/useTranslate';
import { useRef, useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { t } = useTranslate();
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_photo: null,
        });

    const submit = (e) => {
        e.preventDefault();

        // Use POST with multipart for file upload
        if (data.profile_photo) {
            router.post(route('profile.update'), {
                _method: 'patch',
                ...data,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setData('profile_photo', null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            });
        } else {
            patch(route('profile.update'));
        }
    };

    const selectNewPhoto = () => {
        fileInputRef.current?.click();
    };

    const updatePhotoPreview = (e) => {
        const file = e.target.files[0];

        if (!file) return;

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
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
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
                <div>
                    <InputLabel value={t('profile.photo', 'Foto de Perfil')} />

                    <div className="mt-2 flex items-center gap-4">
                        {/* Photo Preview */}
                        <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <SecondaryButton type="button" onClick={selectNewPhoto}>
                                {t('profile.select_photo', 'Seleccionar Nueva Foto')}
                            </SecondaryButton>

                            {photoPreview && (
                                <SecondaryButton type="button" onClick={deletePhoto}>
                                    {t('profile.remove_photo', 'Quitar Foto')}
                                </SecondaryButton>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={updatePhotoPreview}
                            className="hidden"
                        />
                    </div>

                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {t('profile.photo_hint', 'JPG, PNG, GIF o WebP. Máximo 3MB. Mínimo 100x100px.')}
                    </p>

                    <InputError className="mt-2" message={errors.profile_photo} />
                </div>

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
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
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
