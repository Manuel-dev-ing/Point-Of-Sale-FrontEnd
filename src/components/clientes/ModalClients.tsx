import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { ClientFormData, Clients } from '../../types'
import ErrorMessage from '../ErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { createClent, editClient } from '../../services/ClientsAPI'
import { toast } from 'react-toastify'
import { usePosNetStore } from '../../store'

type ModalClientsProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>

}

const initialValues: ClientFormData = {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    telefono: ''
}

export default function ModalClients({ isOpen, setIsOpen } : ModalClientsProps) {
    const reset_client = usePosNetStore((state) => state.reset)
    const activeId = usePosNetStore((state) => state.activeId)
    const data_client = usePosNetStore((state) => state.data as Clients)

    const { handleSubmit, register, reset, formState: {errors}  } = useForm({defaultValues: initialValues})

    const mutation = useMutation({
        mutationFn: createClent,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Cliente Creado Correctamente")
            setIsOpen(false)
            reset()
        }

    })

    const mutationEdit = useMutation({
        mutationFn: editClient,
         onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Cliente Actualizado Correctamente")
            setIsOpen(false)
            reset()
        }

    })

    useEffect(() => {
        if (activeId) {
            reset({
                nombre: data_client.nombre,
                primerApellido: data_client.primerApellido,
                segundoApellido: data_client.segundoApellido,
                correo: data_client.correo,
                telefono: data_client.telefono
            })
        }
    }, [activeId])

    const handleFormSubmit = (data : ClientFormData) => {
        if (activeId) {
            console.log("Editando...");
            data_client.nombre = data.nombre
            data_client.primerApellido = data.primerApellido
            data_client.segundoApellido = data.segundoApellido
            data_client.correo = data.correo
            data_client.telefono = data.telefono

            console.log(data_client);
            //editar
            mutationEdit.mutate(data_client)
            return;
        }

        // guardar 
        mutation.mutate(data)
    }

    const handleClickCerrar = () => {
        setIsOpen(false)
        reset(initialValues)
        reset_client()
    }

    const handleClickBackdrop = () => {
        setIsOpen(false)
        reset(initialValues)
        reset_client()
    }

  return (
    <>
        <div className="h-screen flex items-center justify-center">
                    
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop con animación */}
                    <div
                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
                    opacity-20"
                    onClick={handleClickBackdrop}
                    ></div>

                    {/* Contenido del modal con animación */}
                    <div
                    className="relative bg-white rounded-md shadow-lg p-6 w-lg z-10"
                    >
                    <h3 className="text-lg font-medium text-gray-600 mb-4">Nuevo Cliente</h3>
                    <form className="p-2 mb-2" onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="mb-4 flex flex-col">
                            <label htmlFor="nombre" className="text-gray-700 font-medium text-sm capitalize">Nombre *</label>
                            <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="nombre" placeholder="Ej. Pedro"
                                {...register('nombre', {
                                    required: "El Nombre del cliente es requerido"
                                })}
                            />
                            {errors.nombre && (
                                <ErrorMessage>{errors.nombre?.message}</ErrorMessage>
                            )}

                        </div>

                        <div className="mb-4 flex flex-col">
                            <label htmlFor="nombre" className="text-gray-700 font-medium text-sm capitalize">Primer apellido *</label>
                            <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="nombre" placeholder="Ej. Garcia" 
                                {...register("primerApellido", {
                                    required: "El Primer Apellido es requerido"
                                })}    
                            />

                            {errors.primerApellido && (
                                <ErrorMessage>{errors.primerApellido.message}</ErrorMessage>
                            )}
                        
                        </div>

                        <div className="mb-4 flex flex-col">
                            <label htmlFor="nombre" className="text-gray-700 font-medium text-sm capitalize">segundo apellido</label>
                            <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="nombre" placeholder="Ej. Lopes" 
                                {...register("segundoApellido")}
                            />

                        </div>


                        <div className="mb-3 flex flex-col">
                            <label htmlFor="descripcion" className="text-gray-700 font-medium text-sm capitalize">Correo *</label>
                            <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="descripcion" placeholder="cliente@gmail.com" 
                                {...register("correo", {
                                    required: "El Correo es requerido"
                                })}
                            />
                            {errors.correo && (
                                <ErrorMessage>{errors.correo.message}</ErrorMessage>
                            )}

                        </div>
                        <div className="mb-3 flex flex-col">
                            <label htmlFor="descripcion" className="text-gray-700 font-medium text-sm capitalize">telefono *</label>
                            <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="descripcion" placeholder="5555-000" 
                                {...register("telefono", {
                                    required: "El Telefono es requerido"
                                })}
                            />

                            {errors.telefono && (
                                <ErrorMessage>{errors.telefono.message}</ErrorMessage>
                            )}

                        </div>

                        <div className="flex justify-start gap-2">
                            <button
                                // onClick={() => setIsOpen(false)}
                                type="submit"
                                className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                                { activeId ? 'Guaradar Cambios' : 'Registrar Cliente' }
                            </button>
                            <button
                                onClick={handleClickCerrar}
                                className="px-4 py-2 text-gray-800 font-medium text-sm bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer">
                                Cancelar
                            </button>
                        </div>

                    </form>
                    </div>
                </div>
            )}

        </div>

    
    </>
  )
}







