import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../services/CategoryAPI";
import { useForm, useWatch } from "react-hook-form";
import type { Categories, Category, Product, ProductData, ProductFormData } from "../types";
import { useEffect, useState } from "react";
import { GenerarCodigoBarras } from "../helpers/GenerarCodigoBarras";
import ErrorMessage from "../components/ErrorMessage";
import { da } from "zod/v4/locales";
import { toast } from "react-toastify";
import { createProduct, getProductId, updateProduct } from "../services/ProductsAPI";
import { usePosNetStore } from "../store";

const initialData: ProductFormData = {
    nombre: '',
    idCategoria: 0,
    precio: 0,
    stockInicial: 0,
    stockMinimo: 0,
    codigoBarras: '',
    descripcion: ''
}

export default function ProducrsCreateView() {
    const [codigo, setCodigo] = useState<number>(0)

    const { register, reset, handleSubmit, formState: {errors}, control, setValue } = useForm({defaultValues: initialData})

    const activeId = usePosNetStore((state) => state.activeId)
    const data_product = usePosNetStore((state) => state.data as Product)
    const reset_data = usePosNetStore((state) => state.reset)

    const { data, isLoading, isError } = useQuery({
        queryFn: getCategories,
        queryKey: ['categories']
    })

    const { data: dataProduct, isLoading: isLoadingProdct } = useQuery({
        queryFn: () => getProductId(activeId),
        queryKey: ['products']
    })
    

    const [nombre, idCategoria, precio, stockInicial] = useWatch<ProductFormData>({
        control,
        name: ["nombre", "idCategoria", "precio", "stockInicial"],
        defaultValue: ["", 0, 0, 0],

    });

    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: createProduct,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Producto agregado correctamente")
            reset(initialData)
            setCodigo(0)
        }
    })

    const mutationEdit = useMutation({
        mutationFn: updateProduct,
          onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Producto agregado correctamente")
            reset(initialData)
            setCodigo(0)
            reset_data();
            navigate('/products')
        }

    })

    useEffect(() => {
        console.log("use effect");
        
        if (activeId) {
            reset({
                idCategoria: dataProduct?.idCategoria,
                nombre: dataProduct?.nombre,
                precio: dataProduct?.precio,
                stockInicial: dataProduct?.stockInicial,
                stockMinimo: dataProduct?.stockMinimo,
                codigoBarras: dataProduct?.codigoBarras,
                descripcion: dataProduct?.descripcion
            })

            // const categoria = data?.find(x => x.nombre === data_product.categoria)
            setCodigo(Number(dataProduct!.codigoBarras))
            // setValue("codigoBarras", dataProduct!.codigoBarras);
        }


    }, [activeId, dataProduct])

    const categoria = data?.find(x => x.id === Number(idCategoria))

    const handleClickGenerar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const codigo = GenerarCodigoBarras();
        setValue("codigoBarras", codigo.toString())
        setCodigo(codigo)

    }
    
    const handleClickLimpiar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        reset(initialData)

    }
    const handleClickRegresar = () => {
        reset(initialData)
        reset_data()
        navigate('/products')
    }

    const handleSubmitData = (data : ProductFormData) => {
        
        if (activeId) {
            console.log("editando...");
            dataProduct!.nombre = data.nombre
            dataProduct!.precio = data.precio
            dataProduct!.stockInicial = data.stockInicial
            dataProduct!.stockMinimo = data.stockMinimo
            dataProduct!.codigoBarras = data.codigoBarras
            dataProduct!.descripcion = data.descripcion

            mutationEdit.mutate(dataProduct as ProductData)
            return;
        }
        console.log("guardando...");
        console.log(data);
        mutation.mutate(data)
    }

  return (
    <>
        <div className="flex items-center gap-7">
                <a className="border border-gray-300 py-2 px-2.5 rounded hover:bg-gray-200 flex items-center gap-3 text-gray-700 font-medium text-sm cursor-pointer" onClick={handleClickRegresar}>
                    <ArrowLeft size={18} color="#4a5666" />

                    Volver a Productos
                </a>

            <h1 className="text-gray-700 font-bold text-2xl">Agregar Nuevo Producto</h1>
        </div>

        <div className="mt-5 p-3 flex justify-between">
            <div className="bg-white border border-gray-300 p-3 rounded w-2xl">
                <h2 className="flex items-center gap-3 text-gray-700 font-medium text-2xl">
                    <Package size={22} color="#4a5666" />
                    Informacion del Producto
                </h2>
                <form className="mt-5" onSubmit={handleSubmit(handleSubmitData)}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-700">
                                Nombre del Producto *
                            </label>
                            <input type="text" id="nombre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Ej. Coca cola 600 ml"
                                {...register('nombre', {
                                    required: "El nombre del producto es requerido"
                                })}
                            />

                            {errors.nombre && (
                                <ErrorMessage>{errors.nombre.message}</ErrorMessage>
                            )}
                                
                        </div>
                        <div>
                            <label htmlFor="idCategoria" className="block mb-2 text-sm font-medium text-gray-700">
                                Categoria *
                            </label>
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                            id="idCategoria" 
                                {...register("idCategoria", {
                                    required: "La categoria es requerida"
                                })}>
                               
                                {data?.map((category) => (
                                        <option key={category.id} value={category.id}>{category.nombre}</option>
                                    ))}
                            </select>
                            {errors.idCategoria && (
                                <ErrorMessage>{errors.idCategoria.message}</ErrorMessage>
                            )}
                        </div>
                        
                    </div>    
                    <div className="grid gap-4 mb-6 md:grid-cols-3">
                        <div>
                            <label htmlFor="precio" className="block mb-2 text-sm font-medium text-gray-700">
                                Precio *
                            </label>
                            <input type="number" id="precio" min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.00" 
                                {...register("precio", {
                                    required: "El precio es requerido"
                                })}
                            />
                            {errors.precio && (
                                <ErrorMessage>{errors.precio.message}</ErrorMessage>
                            )}


                        </div>
                        <div>
                            <label htmlFor="stockInicial" className="block mb-2 text-sm font-medium text-gray-700">
                                Stock Inicial *
                            </label>
                            <input type="number" id="stockInicial" min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0" 
                                {...register("stockInicial", {
                                    required: "El stock inicial es requerido"
                                })}
                            />

                            {errors.stockInicial && (
                                <ErrorMessage>{errors.stockInicial.message}</ErrorMessage>
                            )}        

                        </div>
                        <div>
                            <label htmlFor="stockMinimo" className="block mb-2 text-sm font-medium text-gray-700">
                                Stock Minimo *
                            </label>
                            <input type="number" id="stockMinimo" min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="5" 
                                {...register("stockMinimo", {
                                    required: "El stock minino es requerido"
                                })}
                            />
                            {errors.stockMinimo && (
                                <ErrorMessage>{errors.stockMinimo.message}</ErrorMessage>
                            )}

                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <div className="w-full">
                            <label htmlFor="codigoBarras" className="block mb-2 text-sm font-medium text-gray-700">
                                Codigo de Barras
                            </label>
                            <input type="text" id="codigoBarras" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={codigo} placeholder="Escanear o ingresar manualmente" 
                                {...register("codigoBarras", {
                                    required: "El codigo de barras es requerido"
                                })}
                            />
                            {errors.codigoBarras && (
                                <ErrorMessage>{errors.codigoBarras.message}</ErrorMessage>
                            )}
                        </div>

                        <button className="border border-gray-300 py-2.5 px-2.5 rounded hover:bg-gray-200 text-gray-700 font-medium text-sm self-end cursor-pointer" 
                        onClick={handleClickGenerar}>Generar</button>

                    </div>
                    <div className="mb-6">
                        <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-700">
                            Descripcion
                        </label>
                        <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Escanear o ingresar manualmente" id="descripcion" rows={3} 
                            {...register("descripcion", {
                                required: "La descripcion es requerida"
                            })}
                        >

                        </textarea>
                        {errors.descripcion && (
                            <ErrorMessage>{errors.descripcion.message}</ErrorMessage>
                        )}    
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="w-full justify-center flex items-center gap-4 text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5">
                            <Save size={17} />
                            Guardar Producto
                        </button>
                        <button className="w-full border border-gray-300 py-2.5 px-2.5 rounded hover:bg-gray-200 text-gray-700 font-medium text-sm self-end cursor-pointer"
                        onClick={handleClickLimpiar}>
                            Limpiar Formulario
                        </button>
                    </div>
                </form>

            </div>
            <div>
                <div className="bg-white border border-gray-300 p-4 rounded w-xs">
                    <h2 className="text-gray-700 font-medium text-2xl">Vista Previa</h2>
                
                    <div className="border mt-4 border-gray-300 p-3 rounded">
                        <p className="text-gray-700 font-medium text-sm">{nombre ? nombre : 'Nombre del Producto'}</p>
                        <p className="text-gray-500 text-sm">{categoria ? categoria.nombre : 'Categoria'}</p>   

                        <div className="flex justify-between items-center mt-2">
                            <p className="font-bold text-lg text-blue">${precio ? precio + '.00' : '0.00'}</p>
                            <p className="text-sm text-gray-800">Stock: <span>{stockInicial ? stockInicial : '0'}</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-300 p-4 rounded w-xs mt-5">
                    <h2 className="text-gray-700 font-medium text-2xl">Consejos</h2>
                    <ul className="list-disc p-4 text-sm text-gray-600">
                        {/* list-outside */}
                        <li className="mb-1">Use nombres descriptivos y específicos</li>
                        <li className="mb-1">Establezca un stock mínimo para alertas automáticas</li>
                        <li className="mb-1">El código de barras debe ser único</li>
                        <li className="mb-1">Verifique el precio antes de guardar</li>
                    </ul>
                    
                </div>

            </div>

        </div>
    
    </>
  )
}
