import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTranslate } from '@/Hooks/useTranslate';
import { BeakerIcon, ExclamationTriangleIcon } from '@/Components/Icons';

export default function StageConfirmationModal({ show, onClose, onConfirm, stage, lote }) {
    const { t } = useTranslate();

    if (!stage) return null;

    const inputs = stage.input_templates || [];

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="flex flex-col max-h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex-none">
                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                        <ExclamationTriangleIcon className="h-8 w-8" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('operations.confirm_stage_change', 'Confirmar Cambio de Etapa')}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin space-y-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('operations.confirm_stage_desc', 'Estás moviendo el lote :code a la etapa ":stage". Se consumirán automáticamente los siguientes insumos:', {
                            code: lote?.code,
                            stage: stage.name
                        })}
                    </p>

                    {inputs.length > 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                            <ul className="space-y-3">
                                {inputs.map((template) => (
                                    <li key={template.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <BeakerIcon className="h-4 w-4 text-primary-500" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {template.item?.name}
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            {template.quantity} {template.item?.unit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {t('operations.no_inputs_for_stage', 'Esta etapa no tiene insumos automáticos configurados.')}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 flex-none">
                    <SecondaryButton onClick={onClose} type="button">
                        {t('common.cancel', 'Cancelar')}
                    </SecondaryButton>
                    <PrimaryButton onClick={onConfirm} type="button">
                        {t('operations.confirm_and_move', 'Confirmar y Mover')}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
