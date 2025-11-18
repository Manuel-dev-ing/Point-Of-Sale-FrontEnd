import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Search, Shield, SquarePen, Trash2, UserPlus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { deleteUser, getRols, getUsers } from "../services/UsersAPI";
import ModalUsers from "../components/users/ModalUsers";
import { toast } from "react-toastify";
import type { User } from "../types";
import { usePosNetStore } from "../store";


export default function UsersView() {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers ] = useState<User[]>()
    
    const set = usePosNetStore((state) => state.set)

    const mutation = useMutation({
        mutationFn: deleteUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Usuario elimanado correctamente.")
        }
    })

    const { data, isError, isLoading } = useQuery({
        queryFn: getUsers,
        queryKey: ['users']
    })

    const { data: dataRols, isLoading: isLoadingRols } = useQuery({
        queryFn: getRols,
        queryKey: ['rols']
    })

    useEffect(() => {
        if (!data?.length) return;
        setUsers([...data])

    }, [data])

    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {

        const valor = e.target.value
        const resultado = [...data].filter(x => x.nombre.includes(valor))
        setUsers(resultado)

    }

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        
        const valor = e.target.value
        if (Number(valor) != 0) {
            const resultado = [...data].filter(x => x.idRol === Number(valor))
            setUsers(resultado)
            return
        }
    
        setUsers(data)
    }

    const handleClickEditar = (user : User) => {
        setIsOpen(true)
        set(user)
    }

    const handleClickEliminar = (id : number) => {
        console.log("Eliminando...");
        console.log(id);
        mutation.mutate(id)
    }

    const getRolName = (id : number) => {
        const resultado = dataRols?.find(x => x.id === id)
        return resultado?.nombre
    }

    const getTotalRolUsers = (idRol : number) => {
        const result = data?.filter(x => x.idRol === idRol)

        return result?.length
    }

  return (
    <>
        <div className='flex items-center justify-between'>
            <div>
                <h1 className='text-2xl font-bold text-gray-700'>Gestion de Usuarios</h1>
                <p className="text-gray-400">Administra los usuarios del sistema</p>
            </div>

            <button type="button" className="flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 " onClick={() => setIsOpen(true)}>
                <UserPlus size={17} />
                Nuevo Usuario
            </button>
        
        </div>
        <div className="mt-5 flex gap-4">
            <div className="bg-white rounded-md border border-gray-300 p-5 w-64">
                <div className="flex justify-between items-center mb-2">
                    <p className="capitalize text-sm font-semibold text-gray-700">Total usuarios</p>
                    <Users size={16} color="#5a6779" />
                </div>
                <span className="text-2xl font-bold text-gray-700">{data?.length}</span>
            </div>

            <div className="bg-white rounded-md border border-gray-300 p-5 w-64">
                <div className="flex justify-between items-center mb-2">
                    <p className="capitalize text-sm font-semibold text-gray-700">Administradores</p>
                    <Shield size={16} color="#5a6779" />
                </div>
                <span className="text-2xl font-bold text-gray-700">{getTotalRolUsers(1)}</span>
            </div>

            <div className="bg-white rounded-md border border-gray-300 p-5 w-64">
                <div className="flex justify-between items-center mb-2">
                    <p className="capitalize text-sm font-semibold text-gray-700">Cajeros</p>
                    <Shield size={16} color="#5a6779" />
                </div>
                <span className="text-2xl font-bold text-gray-700">{getTotalRolUsers(2)}</span>
            </div>

        </div>

        <div className='border border-gray-300 mt-5 p-4 rounded bg-white '>
            <div className="mb-5">
                <p className="text-xl font-bold text-gray-700">Usuarios del Sistema</p>
                <p className="text-sm text-gray-500 ">Lista de todos los usuarios registrados en el sistema</p>
            </div>

            <div className="flex gap-5 mb-6">   
                
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Search size={16} color='#6c7c93' />
                    </div>
                    <input type="search" id="default-search" className="block w-[680px] p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 " placeholder="Buscar por nombre" onChange={handleChangeBuscar} />
                    
                </div>
                <select id="countries" className="bg-gray-50 border border-gray-300
                text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-56 " 
                onChange={handleChangeSelect} >
                    <option value={0}>Todas los roles</option>
                    {dataRols?.map((item, index) => (
                        <option key={index} value={item.id}>{item.nombre}</option>

                    ))}
                </select>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-sm text-gray-600 capitalize  ">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Usuario
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Rol
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                               Estado
                            </th>
                           
                            <th scope="col" className="px-6 py-3 font-medium">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((item, index) => (
                            <tr key={index} className="bg-white border-b border-gray-200">
                                <td className="py-4 flex items-center gap-2">
                                    <div className=" px-2.5 py-1.5 rounded-full bg-[#e1e6ea] text-gray-700 text-sm capitalize">
                                        {item.nombre[0] + item.primerApellido[0] }
                                    </div>
                                    <p className="font-medium text-gray-800">
                                        {item.nombre + ' ' + item.primerApellido}

                                    </p>
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {item.correo}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    <span className={`${item.idRol != 1 ? 'bg-gray-100 text-gray-700' : 'bg-indigo-100 text-indigo-800'}  text-xs font-medium px-1.5 py-0.5 rounded-full`}>
                                        {getRolName(item.idRol)}
                                    </span>
                                    
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${item.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}  text-xs font-medium px-2 py-0.5 rounded-full`}>
                                        {item.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                    
                                </td>
                                <td className="px-6 py-4">
                                    <div className='flex gap-4'>
                                        <button className='border border-gray-400 rounded py-2 px-2.5 cursor-pointer btn-edit-hover bg-gray-100' 
                                        onClick={() => handleClickEditar(item)}>
                                            <SquarePen
                                                size={18}
                                                color='#343d49'
                                            />
                                        </button>
                                        <button className='rounded py-2 px-3 bg-red bg-red-hover cursor-pointer' onClick={() => handleClickEliminar(item.id)}>
                                            <Trash2
                                                size={18}
                                                color='#ffffff'
                                            />
                                        </button>

                                    </div>    
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

        </div>

        <ModalUsers
            rols={dataRols}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />                

    </>
  )
}
