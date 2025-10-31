import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import type { MovimientoFormData } from "../../types"
import { useMutation } from "@tanstack/react-query"
import { createMovement } from "../../services/InventarioAPI"
import { toast } from "react-toastify"
import { useState } from "react"

type ModalChangeProductProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    idProducto: number
}

type initialStateMovimiento = {
    idProducto: number,
    movimiento: string,
    cantidad: string,
    motivo: string
}


const initialValues : initialStateMovimiento = {
    idProducto: 0,
    movimiento: "entrada",
    cantidad: '',
    motivo: ''
}

type TipoMovimiento = 'entrada' | 'salida';

export default function ModalMovimientos({ isOpen, setIsOpen, idProducto } : ModalChangeProductProps) {
    const [ movimiento, setMovimiento ] = useState<TipoMovimiento>('entrada')

    const { register, reset, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

    const mutation = useMutation({
        mutationFn: createMovement,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Movimiento creado correctamente")
            setIsOpen(false)
            reset()
        }
    })

    const handleClickCerrar = () => {
        setIsOpen(false)
        reset()
    }

    const handleClickBackdrop = () => {
        setIsOpen(false)
        reset()
    
    }

    const handleForm = (data : initialStateMovimiento) => {
        console.log("guardando...");
        
        const movimiento = {
            idUsuario: 1,
            idProducto: idProducto,
            movimiento: data.movimiento,
            cantidad: Number( data.cantidad),
            motivo: data.motivo
        }

        mutation.mutate(movimiento)
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop con animación */}
                    <div
                    className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
                    opacity-20" onClick={handleClickBackdrop}></div>

                    {/* Contenido del modal con animación */}
                    <div className="relative bg-white rounded-md shadow-lg p-6 w-[500px] z-10">
                        <h3 className="text-lg font-medium text-gray-600 mb-4">
                            Movimiento de Inventario - {''}
                        </h3>
                        <form onSubmit={handleSubmit(handleForm)}>
                            <div className='relative overflow-x-auto'>
                                <div className=" flex flex-col mb-4">
                                    <label className="text-gray-700 text-sm font-medium mb-1" 
                                    htmlFor="movimiento">
                                        Tipo Movimiento
                                    </label>
                                    <select  className="border border-gray-300 py-2 px-2 text-gray-700 text-sm focus:outline-none focus:border-[#4573a1] focus:border-2 rounded-lg" 
                                    id="movimiento"
                                    
                                    {...register('movimiento', {
                                        required: "El tipo de movimiento es requerido"
                                    })}
                                    >
                                        <option value="entrada">{"Entrada (+)"}</option>
                                        <option value="salida">{"Salida (-)"}</option>
                                    </select>

                                    {errors.movimiento && (
                                        <ErrorMessage>{errors.movimiento.message}</ErrorMessage>
                                    )}

                                </div>

                                <div className="flex flex-col mb-4">
                                    <label className="text-gray-700 text-sm font-medium mb-1" 
                                    htmlFor="cantidad">
                                        Cantidad *
                                    </label>
                                    <input id="cantidad" className="border border-gray-300 py-2 px-2 text-gray-700 text-sm focus:outline-none focus:border-[#4573a1] focus:border-2 rounded-lg" type="number" min={1} 
                                    {...register("cantidad", {
                                        required: "La cantidad es requerida"
                                    })}
                                    />
                                    {errors.cantidad && (
                                        <ErrorMessage>{errors.cantidad.message}</ErrorMessage>
                                    )}

                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm font-medium mb-1" 
                                    htmlFor="motivo">
                                        Motivo *
                                    </label>
                                    <textarea id="motivo" className="border border-gray-300 py-2 px-2 text-gray-700 text-sm focus:outline-none focus:border-[#4573a1] focus:border-2 rounded-lg placeholder:text-gray-400" rows={3}
                                    placeholder="Ej. Restock de proveedor, Venta, Ajuste inventario..."
                                    {...register("motivo", {
                                        required: "El motivo del movimiento es requerido"
                                    })}
                                    ></textarea>
                                    {errors.motivo && (
                                        <ErrorMessage>{errors.motivo.message}</ErrorMessage>
                                    )}
                                </div>

                            </div>
                            <div className="flex justify-start gap-2 mt-5">
                                <button
                                    type="submit"
                                    className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                                    {'Guaradar Cambios'}
                                </button>
                                <button
                                    className="px-4 py-2 text-gray-800 font-medium text-sm bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                                    onClick={handleClickCerrar}>
                                    Cancelar
                                </button>
                            </div>

                        </form>

                    </div>
                </div>

            )}


        </>
    )
}




