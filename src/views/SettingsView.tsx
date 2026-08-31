import { Building2, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { ConfigEmpresa, ConfigEmpresaFormData } from '../types'
import ErrorMessage from '../components/ErrorMessage'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createConfigCompany, editConfigCompany, getConfigCompany } from '../services/ConfiguracionEmpresaAPI'
import { toast } from 'react-toastify'
import { da } from 'zod/v4/locales'


const initialData : ConfigEmpresaFormData = {

    ciudad: '',
    codigoPostal: '',
    email: '',
    direccion: '',
    estado: '',
    nombreEmpresa: '',
    sitioWeb: '',
    telefono: '',
}

export default function SettingsView() {
    const [isUndefined, setIsUndefined] = useState<boolean>(true)
    const [idCompany, setIdCompany] = useState<number>(0)
    /*
    
        1. consultar(GET) la bd, si existe un registro entonces (mostrar los datos en cada input y para el form debe hacer un UPDATE) sino hay registros en la bd entonces POST
    
    */

    const { data, isLoading, isError } = useQuery({
        queryFn: getConfigCompany,
        queryKey: ['configcompany']
    })


    
    const mutate = useMutation({
        mutationFn: createConfigCompany,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Datos guardado correctamente")
        }
    })

    const mutationEdit = useMutation({
        mutationFn: editConfigCompany,
        onError: (error) => {
            toast.error(error.message)
        },   
        onSuccess: () => {
            toast.success("Datos actualizados correctamente")
        }

    })

    const { register, reset, handleSubmit, formState: {errors}, setValue } = useForm({defaultValues: initialData})


    useEffect(() => {
        if (data === undefined) {
            
            console.log("No tiene datos, vacio, null");
            console.log(data);
            setIsUndefined(true)
        }else{
            console.log("tiene datos ");
            console.log(data);
            setIsUndefined(false)
            setIdCompany(data.id)
            reset({
                ciudad: data.ciudad,
                codigoPostal: data.codigoPostal,
                email: data.email,
                direccion: data.direccion,
                estado: data.estado,
                nombreEmpresa: data.nombreEmpresa,
                sitioWeb: data.sitioWeb,
                telefono: data.telefono
            })
            
        }


    }, [data])


    const handleSubmitData = (data: ConfigEmpresaFormData) => {
        if (isUndefined === true) {
            mutate.mutate(data)
            console.log("Realizando un POST");
            
        }else{
            const payload = {...data, id: idCompany};
            console.log("Realizando un UPDATE - payload");
            console.log(payload);
            mutationEdit.mutate(payload)

        }
        
    }   

    return (
        <>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-gray-700'>Configuraciones</h1>
                    <p className="text-sm text-gray-500 font-normal">Administra los datos generales del sistema</p>
                </div>

            </div>
            <div className='bg-white py-4 px-7 border border-gray-300 rounded mt-5'>

                <div className='flex items-center gap-5'>

                    <div className='flex items-center justify-center w-[40px] h-[40px] bg-[#edf0f2] rounded'>
                        
                        <Building2 size={17} color='#6c7c93' />

                    </div>
                    <div>
                        <p className='text-gray-800 font-medium'>Datos de la empresa</p>
                        <p className='text-gray-500 text-sm'>Esta informacion se usara en tickets, facturas y reportes.</p>
                    </div>


                </div>

                <form className='mt-10' onSubmit={handleSubmit(handleSubmitData)}>
                    <div>
                        <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-700">
                            Nombre de la empresa
                        </label>
                        <input type="text" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Mi Tienda SA. de CV."
                        {...register('nombreEmpresa', {
                            required: "El nombre de la empresa es requerido"
                        })}
                        />
                        {errors.nombreEmpresa && (

                            <ErrorMessage>{errors.nombreEmpresa?.message}</ErrorMessage> 
                        )}
                    </div>
                    <div className='my-5'>
                        <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-700">
                           Direccion
                        </label>
                        <input type="text" id="direccion" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Avenida Principal 123. Col. Centro." 
                            {...register('direccion', {
                                required: "La direccion de la empresa es requerida."
                            })}
                        />
                            
                        {errors.direccion && (
                            <ErrorMessage>{errors.direccion.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="ciudad" className="block mb-2 text-sm font-medium text-gray-700">
                                Ciudad
                            </label>
                            <input type="text" id="ciudad" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Monterrey"
                                {...register("ciudad", {
                                    required: "La ciudad de la empresa es requerida"
                                })}
                            />

                            {errors.ciudad && (
                                <ErrorMessage>{errors.ciudad.message}</ErrorMessage>
                            )}

                        </div>
                        <div>
                            <label htmlFor="estado" className="block mb-2 text-sm font-medium text-gray-700">
                                Estado
                            </label>
                            <input type="text" id="estado" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Nuevo Leon"
                                {...register("estado", {
                                    required: "El estado de la empresa es requrido"
                                })}
                            />
                            {errors.estado && (
                                <ErrorMessage>{errors.estado.message}</ErrorMessage>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="postal" className="block mb-2 text-sm font-medium text-gray-700">
                                Codigo Postal
                            </label>
                            <input type="text" id="postal" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="60780"
                                {...register('codigoPostal', {
                                    required: "El codigo postal es requerido"
                                })}
                            />
                            {errors.codigoPostal && (
                                <ErrorMessage>{errors.codigoPostal.message}</ErrorMessage>
                            )}   
                        </div>
                        <div>
                            <label htmlFor="tel" className="block mb-2 text-sm font-medium text-gray-700">
                                Telefono
                            </label>
                            <input type="tel" id="tel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="81 562 2314" 
                                {...register('telefono', {
                                    required: "El telefono es requerido"
                                })}
                            />
                            <ErrorMessage>{errors.telefono?.message}</ErrorMessage>
                        </div>
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                Correo Electronico
                            </label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="contacto@mitienda.com" 
                                {...register('email', {
                                    required: "El correo electronico es requerido"
                                })}
                            />
                            <ErrorMessage>{errors.email?.message}</ErrorMessage>   
                        </div>
                        <div>
                            <label htmlFor="web" className="block mb-2 text-sm font-medium text-gray-700">
                                Sitio Web
                            </label>
                            <input type="url" id="web" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="www.mitienda.com" 
                                {...register('sitioWeb', {
                                    required: "El sitio web es requerido"
                                })}
                            />
                            <ErrorMessage>{errors.sitioWeb?.message}</ErrorMessage>
                        </div>
                    </div>
                    

                    <div className="flex gap-2 justify-start">
                        <button type="submit" className="justify-center flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5">
                            <Save size={17} />
                            Guardar Producto
                        </button>
                        <button className="border border-gray-300 py-2.5 px-2.5 rounded hover:bg-gray-200 text-gray-700 font-medium text-sm self-end cursor-pointer"
                        >
                            Limpiar Formulario
                        </button>
                    </div>
                </form>


            </div>
        </>   
    )
}
