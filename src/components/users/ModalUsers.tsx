import { useForm } from "react-hook-form";
import type { Rol, User, UserFormData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { createUser, updateUser } from "../../services/UsersAPI";
import { toast } from "react-toastify";
import { usePosNetStore } from "../../store";
import { useEffect } from "react";
const initialValues : UserFormData = {
    correo: '',
    idRol: 0,
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
}

type ModalUsersProps = {
    rols: Rol[] | undefined
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalUsers({rols, isOpen, setIsOpen} : ModalUsersProps) {

    const { register, handleSubmit, formState: { errors }, reset } = useForm({defaultValues: initialValues})

    const reset_store = usePosNetStore((state) => state.reset)
    const user_data = usePosNetStore((state) => state.data as User)
    const activeId = usePosNetStore((state) => state.activeId)

    const mutation = useMutation({
        mutationFn: createUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Usuario creado correctamente")
            setIsOpen(false)
            reset_store()
            reset(initialValues)

        }
    })

    const mutationEdit = useMutation({
        mutationFn: updateUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Usuario actualizado correctamente")
            setIsOpen(false)
            reset_store()
            reset(initialValues)
        }
    })

    useEffect(() => {
        if (activeId) {
            reset({
                nombre: user_data.nombre,
                correo: user_data.correo,
                idRol: user_data.idRol,
                primerApellido: user_data.primerApellido,
                segundoApellido: user_data.segundoApellido
            })
        }


    }, [activeId])

    const handleClickBackdrop = () => {
        console.log("cerrando modal...");
        setIsOpen(false)
        reset(initialValues)
        reset_store()
    }

    const handleClickCerrar = () => {
        console.log("cerrando modal...");
        setIsOpen(false)
        reset(initialValues)
        reset_store()

    }

    const handleFormSubmit = (data: UserFormData) => {
        if (activeId) {
            const payload : User = {...data, id: activeId, idRol: Number(data.idRol), estado: user_data.estado}
            console.log("editando...");
         
            mutationEdit.mutate(payload)
            
        }else{
            console.log("guardando...");
            // mutation.mutate(data)
            
        }
    }

    return (
        <>
            {isOpen && (
                <div className="h-screen flex items-center justify-center">
                    
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
                        <div className="mb-3">
                            <h3 className="text-lg font-medium text-gray-600 m-0 capitalize">
                                { activeId ? 'editar usuario' : 'crear nuevo usuario'}
                            </h3>
                            <p className="text-sm text-gray-500">Ingresa los datos del nuevo usuario del sistema</p>

                        </div>

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
                                <label htmlFor="descripcion" className="text-gray-700 font-medium text-sm capitalize">Rol *</label>
                                <select className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:border-2"
                                    {...register("idRol", {
                                        required: "El Rol es obligatorio"
                                    })}
                                >
                                    {rols?.map((item, index) => (
                                        <option key={index} value={item.id}>{item.nombre}</option>
                                    ))}

                                </select>
                                {errors.idRol && (
                                    <ErrorMessage>{errors.idRol.message}</ErrorMessage>
                                )}

                            </div>

                            <div className="flex justify-start gap-2">
                                <button
                                    // onClick={() => setIsOpen(false)}
                                    type="submit"
                                    className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                                    { activeId ? 'Guardar Cambios' : 'Registrar Usuario' }
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

                </div>
            )}
        </>
    )
}

