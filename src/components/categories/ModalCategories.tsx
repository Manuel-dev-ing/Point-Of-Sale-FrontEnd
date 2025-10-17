import type { Category, CategoryFormData } from "../../types"
import { useForm } from 'react-hook-form'
import ErrorMessage from "../ErrorMessage"
import { useMutation } from "@tanstack/react-query"
import { createCategory, updateCategory } from "../../services/CategoryAPI"
import { toast } from "react-toastify"
import { usePosNetStore } from "../../store"
import { useEffect } from "react"
import { data } from "react-router-dom"

type modalEditCategoriesProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const initialValues : CategoryFormData = {
  nombre: '',
  descripcion: ''
}

export default function ModalCategories({isOpen, setIsOpen} : modalEditCategoriesProps) {
  const resetCaategory = usePosNetStore((state) => state.reset)
  const activeId = usePosNetStore((state) => state.activeId)
  const dataCategory = usePosNetStore((state) => state.data as Category)
  
  const { register, handleSubmit, formState: {errors}, reset } = useForm({defaultValues: initialValues})

  const mutation = useMutation({
    mutationFn: createCategory,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Categoria creada")
      reset()
      setIsOpen(false)
    }

  })

  const mutationEdit = useMutation({
    mutationFn: updateCategory,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Categoria creada")
      reset()
      setIsOpen(false)
    }
  })

  useEffect(() => {

    if (activeId) {
   
      reset({
        nombre: dataCategory.nombre,
        descripcion: dataCategory.descripcion
      })

    }
    
  }, [activeId])

  const handleForm = (data : CategoryFormData) => {
    
    if (activeId) {
      console.log("Editando");
      dataCategory.nombre = data.nombre
      dataCategory.descripcion = data.descripcion
      console.log(dataCategory);
      
      mutationEdit.mutate(dataCategory)
      
      return;
    }
    
    console.log("guardando...");
    console.log(data);
    mutation.mutate(data)
  }

  const handleClickCerrar = () => {
    reset()
    setIsOpen(false)
    resetCaategory()
  }

  const handleClickBackdrop = () => {
    setIsOpen(false)
    resetCaategory()

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
                <h3 className="text-lg font-medium text-gray-600 mb-4">Nueva Categoria</h3>
                <form onSubmit={handleSubmit(handleForm)} className="p-2 mb-2">
                  <div className="mb-4 flex flex-col">
                    <label htmlFor="nombre" className="text-gray-700 font-medium text-sm">Nombre *</label>
                    <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="nombre" placeholder="Ej. Bebidas"
                      {...register("nombre", {
                        required: "El nombre de la categoria es requerido"
                      })}
                    />
                    {errors.nombre && (
                      <ErrorMessage>{errors.nombre.message}</ErrorMessage>
                    )}


                  </div>
                  <div className="mb-3 flex flex-col">
                    <label htmlFor="descripcion" className="text-gray-700 font-medium text-sm">Descripcion</label>
                    <input type="text" className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500" id="descripcion" placeholder="Descripcion de la categoria"
                      {...register("descripcion")}
                    />
                    
                  </div>

                  <div className="flex justify-start gap-2">
                    <button
                      // onClick={() => setIsOpen(false)}
                      type="submit"
                      className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs"
                    >
                      { activeId ? 'Guaradar Cambios' : 'Crear Categoria' }
                    </button>
                    <button
                      onClick={handleClickCerrar}
                      
                      className="px-4 py-2 text-gray-800 font-medium text-sm bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                    >
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
