import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useTranslate } from '@/Hooks/useTranslate';
import { XMarkIcon } from '@/Components/Icons';

export default function TransactionModal({
     show = false,
     onClose,
     transaction = null,
     proyectoId = null, // ID del proyecto (si es null, estamos en finanzas personales)
     proyectos = [], // Lista de proyectos disponibles (para finanzas personales)
     cuentas = [], // Cuentas disponibles
     categorias = [], // Categorías disponibles
     onSuccess
}) {
     const { t } = useTranslate();
     const [selectedProyectoId, setSelectedProyectoId] = useState(proyectoId);
     const [availableCuentas, setAvailableCuentas] = useState(cuentas);
     const [availableCategorias, setAvailableCategorias] = useState(categorias);
     const [loadingCategorias, setLoadingCategorias] = useState(false);

     const { data, setData, post, put, processing, errors, reset } = useForm({
          proyecto_id: proyectoId || (transaction?.proyecto_id || null),
          cuenta_id: transaction?.cuenta_id || '',
          categoria_id: transaction?.categoria_id || '',
          monto: transaction?.monto ? (Math.abs(transaction.monto) / 100).toFixed(2) : '',
          fecha: transaction?.fecha || new Date().toISOString().split('T')[0],
          descripcion: transaction?.descripcion || '',
          notas: transaction?.notas || '',
     });

     // Cargar categorías cuando cambia el proyecto seleccionado
     useEffect(() => {
          if (show && selectedProyectoId && !proyectoId) {
               // Solo cargar si estamos en finanzas personales y se seleccionó un proyecto
               loadCategorias(selectedProyectoId);
          } else if (show && proyectoId && categorias.length > 0) {
               // Si ya tenemos categorías filtradas (desde ProjectCard), usarlas
               setAvailableCategorias(categorias);
          }
     }, [selectedProyectoId, show, proyectoId, categorias]);

     // Cargar cuentas cuando cambia el proyecto seleccionado
     useEffect(() => {
          if (show && selectedProyectoId && !proyectoId) {
               // Cargar cuentas del proyecto seleccionado
               loadCuentas(selectedProyectoId);
          } else if (show && proyectoId) {
               // Usar las cuentas proporcionadas
               setAvailableCuentas(cuentas);
          }
     }, [selectedProyectoId, show, proyectoId, cuentas]);

     const loadCategorias = async (proyectoId) => {
          setLoadingCategorias(true);
          try {
               const response = await axios.get(route('api.proyectos.categorias.index', proyectoId));
               // Si categorias ya están filtradas (viene de ProjectCard), usarlas directamente
               if (categorias.length > 0 && categorias.every(c => c.tipo === categorias[0].tipo)) {
                    setAvailableCategorias(categorias);
               } else {
                    setAvailableCategorias(response.data);
               }
          } catch (error) {
               console.error('Error loading categorias:', error);
          } finally {
               setLoadingCategorias(false);
          }
     };

     const loadCuentas = async (proyectoId) => {
          try {
               const response = await axios.get(`/api/proyectos/${proyectoId}/cuentas`);
               setAvailableCuentas(response.data);
          } catch (error) {
               console.error('Error loading cuentas:', error);
          }
     };

     useEffect(() => {
          if (show && transaction) {
               setData({
                    proyecto_id: transaction.proyecto_id || proyectoId,
                    cuenta_id: transaction.cuenta_id || '',
                    categoria_id: transaction.categoria_id || '',
                    monto: transaction.monto ? (Math.abs(transaction.monto) / 100).toFixed(2) : '',
                    fecha: transaction.fecha || new Date().toISOString().split('T')[0],
                    descripcion: transaction.descripcion || '',
                    notas: transaction.notas || '',
               });
               setSelectedProyectoId(transaction.proyecto_id || proyectoId);
          } else if (show && !transaction) {
               reset();
               setData('proyecto_id', proyectoId || null);
               setData('fecha', new Date().toISOString().split('T')[0]);
               setSelectedProyectoId(proyectoId || null);
          }
     }, [show, transaction, proyectoId]);

     const handleProyectoChange = (proyectoId) => {
          setSelectedProyectoId(proyectoId);
          setData('proyecto_id', proyectoId);
          setData('cuenta_id', '');
          setData('categoria_id', '');
          if (proyectoId) {
               loadCategorias(proyectoId);
               loadCuentas(proyectoId);
          }
     };

     const handleSubmit = (e) => {
          e.preventDefault();

          const submitData = {
               ...data,
               monto: parseFloat(data.monto) * 100, // Convertir a centavos
          };

          if (transaction) {
               // Actualizar transacción existente
               put(route('api.proyectos.transacciones.update', [data.proyecto_id, transaction.id]), {
                    data: submitData,
                    preserveScroll: true,
                    onSuccess: () => {
                         reset();
                         onSuccess?.();
                         onClose();
                    },
               });
          } else {
               // Crear nueva transacción
               post(route('api.proyectos.transacciones.store', data.proyecto_id), {
                    data: submitData,
                    preserveScroll: true,
                    onSuccess: () => {
                         reset();
                         onSuccess?.();
                         onClose();
                    },
               });
          }
     };

     const handleClose = () => {
          reset();
          setSelectedProyectoId(proyectoId || null);
          setAvailableCuentas(cuentas);
          setAvailableCategorias(categorias);
          onClose();
     };

     return (
          <Modal show={show} onClose={handleClose} maxWidth="lg">
               <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {transaction
                                   ? t('finance.edit_transaction', 'Editar Transacción')
                                   : t('finance.create_transaction', 'Crear Transacción')
                              }
                         </h3>
                         <button
                              onClick={handleClose}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              aria-label={t('common.close', 'Cerrar')}
                         >
                              <XMarkIcon className="h-6 w-6" />
                         </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                         {/* Proyecto (solo si estamos en finanzas personales) */}
                         {!proyectoId && (
                              <div>
                                   <InputLabel htmlFor="proyecto_id" value={t('finance.project', 'Proyecto')} />
                                   <select
                                        id="proyecto_id"
                                        value={selectedProyectoId || ''}
                                        onChange={(e) => handleProyectoChange(e.target.value ? parseInt(e.target.value) : null)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                        required
                                   >
                                        <option value="">{t('finance.personal', 'Personal')}</option>
                                        {proyectos.map((proyecto) => (
                                             <option key={proyecto.id} value={proyecto.id}>
                                                  {proyecto.nombre}
                                             </option>
                                        ))}
                                   </select>
                                   <InputError message={errors.proyecto_id} className="mt-2" />
                              </div>
                         )}

                         {/* Cuenta */}
                         <div>
                              <InputLabel htmlFor="cuenta_id" value={t('finance.account', 'Cuenta')} />
                              <select
                                   id="cuenta_id"
                                   value={data.cuenta_id}
                                   onChange={(e) => setData('cuenta_id', e.target.value ? parseInt(e.target.value) : '')}
                                   className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                   required
                                   disabled={!selectedProyectoId && !proyectoId}
                              >
                                   <option value="">{t('common.select', 'Seleccionar...')}</option>
                                   {availableCuentas.map((cuenta) => (
                                        <option key={cuenta.id} value={cuenta.id}>
                                             {cuenta.nombre} {cuenta.banco ? `(${cuenta.banco})` : ''}
                                        </option>
                                   ))}
                              </select>
                              <InputError message={errors.cuenta_id} className="mt-2" />
                         </div>

                         {/* Categoría */}
                         <div>
                              <InputLabel htmlFor="categoria_id" value={t('finance.category', 'Categoría')} />
                              <select
                                   id="categoria_id"
                                   value={data.categoria_id}
                                   onChange={(e) => setData('categoria_id', e.target.value ? parseInt(e.target.value) : '')}
                                   className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                                   required
                                   disabled={loadingCategorias || (!selectedProyectoId && !proyectoId)}
                              >
                                   <option value="">{loadingCategorias ? t('common.loading', 'Cargando...') : t('common.select', 'Seleccionar...')}</option>
                                   {availableCategorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                             {categoria.nombre} ({categoria.tipo === 'ingreso' ? t('finance.income', 'Ingreso') : t('finance.expense', 'Gasto')})
                                        </option>
                                   ))}
                              </select>
                              <InputError message={errors.categoria_id} className="mt-2" />
                         </div>

                         {/* Monto */}
                         <div>
                              <InputLabel htmlFor="monto" value={t('finance.amount', 'Monto')} />
                              <TextInput
                                   id="monto"
                                   type="number"
                                   step="0.01"
                                   min="0"
                                   value={data.monto}
                                   onChange={(e) => setData('monto', e.target.value)}
                                   className="mt-1 block w-full"
                                   required
                                   autoFocus
                              />
                              <InputError message={errors.monto} className="mt-2" />
                         </div>

                         {/* Fecha */}
                         <div>
                              <InputLabel htmlFor="fecha" value={t('finance.date', 'Fecha')} />
                              <TextInput
                                   id="fecha"
                                   type="date"
                                   value={data.fecha}
                                   onChange={(e) => setData('fecha', e.target.value)}
                                   className="mt-1 block w-full"
                                   required
                              />
                              <InputError message={errors.fecha} className="mt-2" />
                         </div>

                         {/* Descripción */}
                         <div>
                              <InputLabel htmlFor="descripcion" value={t('finance.description', 'Descripción')} optional />
                              <TextInput
                                   id="descripcion"
                                   type="text"
                                   value={data.descripcion}
                                   onChange={(e) => setData('descripcion', e.target.value)}
                                   className="mt-1 block w-full"
                              />
                              <InputError message={errors.descripcion} className="mt-2" />
                         </div>

                         {/* Notas */}
                         <div>
                              <InputLabel htmlFor="notas" value={t('finance.notes', 'Notas')} optional />
                              <textarea
                                   id="notas"
                                   value={data.notas}
                                   onChange={(e) => setData('notas', e.target.value)}
                                   rows={3}
                                   className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 shadow-sm"
                              />
                              <InputError message={errors.notas} className="mt-2" />
                         </div>

                         {/* Actions */}
                         <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <SecondaryButton
                                   type="button"
                                   onClick={handleClose}
                                   disabled={processing}
                              >
                                   {t('common.cancel', 'Cancelar')}
                              </SecondaryButton>
                              <PrimaryButton
                                   type="submit"
                                   disabled={processing || !data.cuenta_id || !data.categoria_id}
                              >
                                   {processing
                                        ? t('common.saving', 'Guardando...')
                                        : transaction
                                             ? t('common.update', 'Actualizar')
                                             : t('common.create', 'Crear')
                                   }
                              </PrimaryButton>
                         </div>
                    </form>
               </div>
          </Modal>
     );
}

