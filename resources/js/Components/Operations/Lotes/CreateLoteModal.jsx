import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import InputGroup from '@/Components/UI/InputGroup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslate } from '@/Hooks/useTranslate';

export default function CreateLoteModal({ show, onClose, proyecto, processes = [], members = [] }) {
    const { t } = useTranslate();

    const { data, setData, post, processing, errors, reset } = useForm({
        production_process_id: processes.length > 0 ? processes[0].id : '',
        code: '',
        initial_quantity: '',
        start_date: new Date().toISOString().split('T')[0],
        assigned_user_id: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('operations.lotes.store', { proyecto: proyecto.id }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                    Crear Nuevo Lote
                </h2>

                <div className="space-y-6">
                    {/* Process Selection */}
                    <div>
                        <InputLabel htmlFor="production_process_id" value="Proceso Productivo" />
                        <SelectInput
                            id="production_process_id"
                            value={data.production_process_id}
                            onChange={(e) => setData('production_process_id', e.target.value)}
                            className="mt-1 block w-full"
                        >
                            <option value="" disabled>Seleccionar Proceso</option>
                            {processes.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.production_process_id} className="mt-2" />
                        {processes.length === 0 && (
                            <p className="text-sm text-red-500 mt-1">
                                Debes crear un proceso productivo antes de crear lotes.
                            </p>
                        )}
                    </div>

                    {/* Code */}
                    <div>
                        <InputGroup
                            id="code"
                            label="Código de Lote / Identificador"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="Ej: CAFE-2024-001"
                        />
                        <InputError message={errors.code} className="mt-1" />
                    </div>

                    {/* Initial Quantity */}
                    <div>
                        <InputGroup
                            id="initial_quantity"
                            type="number"
                            label="Cantidad Inicial"
                            value={data.initial_quantity}
                            onChange={(e) => setData('initial_quantity', e.target.value)}
                            placeholder="0.00"
                            suffix="Und/Kg"
                        />
                        <InputError message={errors.initial_quantity} className="mt-1" />
                    </div>

                    {/* Start Date */}
                    <div>
                        <InputGroup
                            id="start_date"
                            type="date"
                            label="Fecha de Inicio"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        <InputError message={errors.start_date} className="mt-1" />
                    </div>

                    {/* Assigned User */}
                    <div>
                        <InputLabel htmlFor="assigned_user_id" value="Responsable (Opcional)" />
                        <SelectInput
                            id="assigned_user_id"
                            value={data.assigned_user_id}
                            onChange={(e) => setData('assigned_user_id', e.target.value)}
                            className="mt-1 block w-full"
                        >
                            <option value="">Seleccionar Responsable</option>
                            {members.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.assigned_user_id} className="mt-2" />
                    </div>

                    {/* Notes */}
                    <div>
                        <InputLabel htmlFor="notes" value="Notas Adicionales" />
                        <TextArea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full"
                            rows="3"
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing || processes.length === 0}>
                        {processing ? 'Creando...' : 'Crear Lote'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
