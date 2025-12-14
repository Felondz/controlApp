import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import InputGroup from '@/Components/UI/InputGroup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
export default function CreateProcessModal({ show, onClose, proyecto }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        stages: [
            { name: 'Inicio', description: '' },
            { name: 'Proceso', description: '' },
            { name: 'Finalizado', description: '' }
        ]
    });

    const addStage = () => {
        setData('stages', [...data.stages, { name: '', description: '' }]);
    };

    const removeStage = (index) => {
        if (data.stages.length <= 1) return; // Prevent deleting all stages
        const newStages = data.stages.filter((_, i) => i !== index);
        setData('stages', newStages);
    };

    const updateStage = (index, field, value) => {
        const newStages = [...data.stages];
        newStages[index][field] = value;
        setData('stages', newStages);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('operations.processes.store', { proyecto: proyecto.id }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Crear Nuevo Proceso Productivo
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="name" value="Nombre del Proceso" />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full"
                        isFocused
                        placeholder="Ej: Cultivo de Orellanas"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Descripción (Opcional)" />
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        rows="3"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <InputLabel value="O configure las etapas del proceso (en orden):" className="text-lg" />
                        <SecondaryButton type="button" onClick={addStage} className="px-2 py-1 text-xs">
                            + Agregar Etapa
                        </SecondaryButton>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {data.stages.map((stage, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="mt-2 text-xs text-gray-500 w-6 font-bold">{index + 1}.</div>
                                <div className="flex-1">
                                    <TextInput
                                        value={stage.name}
                                        onChange={(e) => updateStage(index, 'name', e.target.value)}
                                        className="block w-full text-sm py-1"
                                        placeholder={`Nombre de etapa ${index + 1}`}
                                        required
                                    />
                                </div>
                                <div className="w-1/3">
                                    <TextInput
                                        value={stage.description}
                                        onChange={(e) => updateStage(index, 'description', e.target.value)}
                                        className="block w-full text-sm py-1 font-light text-gray-400"
                                        placeholder="Desc. (opcional)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStage(index)}
                                    className="mt-1 text-red-500 hover:text-red-700"
                                    title="Eliminar etapa"
                                    disabled={data.stages.length <= 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                    <InputError message={errors.stages} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Guardando...' : 'Crear Proceso'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
