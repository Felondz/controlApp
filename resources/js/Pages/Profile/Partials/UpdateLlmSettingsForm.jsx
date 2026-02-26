import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { Transition } from '@headlessui/react';
import { useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslate } from '@/Hooks/useTranslate';
import { SparklesAiIcon, SparklesAiOffIcon } from '@/Components/Icons';
import axios from 'axios';

export default function UpdateLlmSettingsForm({ llmSettings = [], className = '' }) {
    const { t } = useTranslate();
    const { auth } = usePage().props;
    const isAiEnabled = auth?.user?.is_ai_enabled ?? true;
    const [togglingAi, setTogglingAi] = useState(false);

    const handleToggleGlobalAi = () => {
        setTogglingAi(true);
        router.post(route('profile.toggle-ai'), {}, {
            preserveScroll: true,
            onFinish: () => setTogglingAi(false),
        });
    };

    // Providers available
    const providers = [
        { value: 'openai', label: 'OpenAI' },
        { value: 'anthropic', label: 'Anthropic' },
        { value: 'gemini', label: 'Google Gemini' },
        { value: 'test_sprite', label: 'TestSprite' },
        { value: 'custom', label: 'Custom/Local' },
    ];

    const [selectedProvider, setSelectedProvider] = useState('openai');

    // Dynamic models state
    const [fetchedModels, setFetchedModels] = useState([]);
    const [fetchingModels, setFetchingModels] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const {
        data,
        setData,
        errors,
        post,
        delete: destroy,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        provider: 'openai',
        api_key: '',
        default_model: '',
        is_active: true,
    });

    // Update form when provider changes
    useEffect(() => {
        const existingSetting = llmSettings.find(s => s.provider === selectedProvider);
        if (existingSetting) {
            setData({
                provider: selectedProvider,
                api_key: '',
                default_model: existingSetting.default_model || '',
                is_active: existingSetting.is_active,
            });
        } else {
            setData({
                provider: selectedProvider,
                api_key: '',
                default_model: '',
                is_active: true,
            });
        }
    }, [selectedProvider, llmSettings]);

    const updateSettings = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        post(route('profile.llm-settings.store'), {
            preserveScroll: true,
            onSuccess: () => reset('api_key'),
        });
    };

    const handleToggleActive = (e) => {
        const isChecked = e.target.checked;
        setData('is_active', isChecked);

        // If there's an existing setting and we're just toggling it, auto-save to immediately update the global widget state
        if (existingSetting) {
            // Overwrite useForm's default data with the new isChecked value for this specific request
            // Use `router.post` to reliably bypass the form's local state sync queue
            router.post(route('profile.llm-settings.store'), {
                provider: selectedProvider,
                api_key: data.api_key || existingSetting.api_key || '',
                default_model: data.default_model || existingSetting.default_model || '',
                is_active: isChecked,
            }, {
                preserveScroll: true,
            });
        }
    };

    const deleteSettings = (providerKey) => {
        if (confirm(t('profile.confirm_delete_llm', '¿Estás seguro de que deseas eliminar esta configuración de IA?'))) {
            destroy(route('profile.llm-settings.destroy', providerKey), {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedProvider === providerKey) {
                        reset('api_key', 'default_model');
                    }
                },
            });
        }
    };

    const existingSetting = llmSettings.find(s => s.provider === selectedProvider);

    const fetchDynamicModels = async () => {
        if (!data.api_key && !existingSetting) {
            setFetchError(t('profile.llm_fetch_error_missing_key', 'Ingresa una API Key primero para obtener la lista de modelos.'));
            return;
        }

        setFetchingModels(true);
        setFetchError('');
        setFetchedModels([]);

        try {
            const response = await axios.post(route('profile.llm-settings.fetch-models'), {
                provider: selectedProvider,
                api_key: data.api_key, // The controller handles it securely if this is empty but existingSetting exists
            });

            if (response.data.success) {
                setFetchedModels(response.data.models);
                // Auto-select the first one if empty or pre-existing not in list
                if (response.data.models.length > 0 && !data.default_model) {
                    setData('default_model', response.data.models[0].id);
                }
            } else {
                setFetchError(response.data.message || t('profile.llm_fetch_error_generic', 'Error al obtener modelos.'));
            }
        } catch (error) {
            setFetchError(
                error.response?.data?.message ||
                t('profile.llm_fetch_error_network', 'No se pudieron consultar los modelos en este momento. Revisa la consola para más detalles.')
            );
        } finally {
            setFetchingModels(false);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-primary-800 dark:text-primary-200">
                    {t('profile.llm_settingsTitle', 'Configuración de Inteligencia Artificial')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t('profile.llm_settings_hint', 'Proporciona tus propios tokens de API para habilitar asistentes de IA y funciones inteligentes. Si desactivas esta opción, el sistema funcionará en modo manual sin IA.')}
                </p>
            </header>

            {/* Global AI Master Toggle */}
            <div className="mt-6 mb-8">
                <div
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${isAiEnabled
                            ? 'border-primary-500/30 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 dark:border-primary-500/20'
                            : 'border-gray-300/50 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600/30'
                        }`}
                >
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            {isAiEnabled ? (
                                <SparklesAiIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-pulse" />
                            ) : (
                                <SparklesAiOffIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            )}
                            <div>
                                <h3 className={`text-base font-semibold ${isAiEnabled ? 'text-primary-800 dark:text-primary-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {t('profile.ai_master_switch', 'Asistente de IA')}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isAiEnabled
                                        ? t('profile.ai_master_enabled', 'La IA está habilitada globalmente')
                                        : t('profile.ai_master_disabled', 'La IA está deshabilitada completamente')
                                    }
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleGlobalAi}
                            disabled={togglingAi}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isAiEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                                } ${togglingAi ? 'opacity-50 cursor-wait' : ''}`}
                            role="switch"
                            aria-checked={isAiEnabled}
                        >
                            <span
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAiEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* List of connected providers */}
            {llmSettings.length > 0 ? (
                <div className="mt-6 mb-8">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {t('profile.llm_connected_providers', 'Proveedores Conectados')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {llmSettings.map(setting => {
                            const providerInfo = providers.find(p => p.value === setting.provider) || { label: setting.provider };
                            return (
                                <div key={setting.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">{providerInfo.label}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${setting.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {setting.is_active ? t('profile.llm_active_status', 'Activo') : t('profile.llm_inactive_status', 'Inactivo')}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deleteSettings(setting.provider)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition"
                                    >
                                        {t('common.delete', 'Eliminar')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="mt-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.llm_connected_none', 'No tienes proveedores de IA configurados aún.')}
                </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-md font-medium text-primary-800 dark:text-primary-200 mb-4">
                    {t('profile.llm_add_new', 'Nuevo / Editar Proveedor')}
                </h3>
                <form onSubmit={updateSettings} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="provider" value={t('profile.llm_provider', 'Proveedor de IA')} />
                        <select
                            id="provider"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                        >
                            {providers.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                        {existingSetting && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                                ✓ {t('profile.llm_configured', 'Este proveedor ya está configurado (la clave está oculta por seguridad).')}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="api_key" value={t('profile.llm_api_key', 'API Key (Token)')} />
                        <TextInput
                            id="api_key"
                            value={data.api_key}
                            onChange={(e) => setData('api_key', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            placeholder={existingSetting ? t('profile.llm_api_key_placeholder_update', 'Dejar en blanco para mantener la clave actual') : (!data.is_active ? t('profile.llm_api_key_optional', 'Opcional si la IA está deshabilitada') : '')}
                            required={!existingSetting && data.is_active}
                        />
                        <InputError message={errors.api_key} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <InputLabel htmlFor="default_model" value={t('profile.llm_default_model', 'Modelo por Defecto (Opcional)')} />

                            {(selectedProvider !== 'custom' && selectedProvider !== 'test_sprite') && (
                                <button
                                    type="button"
                                    onClick={fetchDynamicModels}
                                    disabled={fetchingModels}
                                    className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                                >
                                    {fetchingModels
                                        ? t('common.loading', 'Cargando...')
                                        : t('profile.llm_fetch_models', '↓ Cargar Modelos Disponibles')}
                                </button>
                            )}
                        </div>

                        {fetchedModels.length > 0 ? (
                            <select
                                id="default_model"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                                value={data.default_model}
                                onChange={(e) => setData('default_model', e.target.value)}
                            >
                                <option value="">{t('profile.llm_select_model', '-- Selecciona un modelo --')}</option>
                                {fetchedModels.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        ) : (
                            <TextInput
                                id="default_model"
                                value={data.default_model}
                                onChange={(e) => setData('default_model', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                placeholder={selectedProvider === 'custom' ? "ej: llama-3, deepseek-coder" : "ej: gpt-4o, claude-3-5-sonnet-20240620"}
                            />
                        )}

                        {fetchError && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fetchError}</p>
                        )}

                        {!fetchError && fetchedModels.length === 0 && selectedProvider !== 'custom' && selectedProvider !== 'test_sprite' && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t('profile.llm_model_manual_hint', 'Ingresa manualmente o carga la lista desde tu proveedor usando el botón de arriba.')}
                            </p>
                        )}

                        <InputError message={errors.default_model} className="mt-2" />
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="is_active"
                                checked={data.is_active}
                                onChange={handleToggleActive}
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                {t('profile.llm_is_active', 'Habilitar asistencia de IA con este proveedor')}
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>{t('common.save', 'Guardar Configuración')}</PrimaryButton>

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
            </div>
        </section>
    );
}
