import { Eye, EyeOff, ShoppingCart } from "lucide-react";
import { use, useState } from "react";
import { useForm } from "react-hook-form"
import { Link, useNavigate, useNavigation } from "react-router-dom";
import type { LoginFormData } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { usePosNetStore } from "../store";
import { toast } from "react-toastify";
import LoadingModal from "../components/LoadingModal";

const initialData: LoginFormData = {
    email: "",
    password: ""
}

export default function Login() {
    const [isLogginIn, setIsLogginIn] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const fetchLogin = usePosNetStore((state) => state.fetchLogin)    
  

    const { handleSubmit, register, formState: {errors} } = useForm({defaultValues: initialData})

    const navigate = useNavigate();

    const handleLogin = async (data : LoginFormData) => {
        setIsLogginIn(true)
        const resultado = await fetchLogin(data);
        if (resultado.isSuccess) {
            setIsLogginIn(false)
            navigate('/')
            console.log("authenticado")
        }else{
            console.log("error");

        }

    }
    
    


    return (
        <>
            <main className='min-h-screen flex items-center justify-center h-screen p-10 bg-[#f6f7f7]'>
                <div className="w-full max-w-md">
                    <div className=" mb-4 flex flex-col justify-center items-center">
                        <div className="w-20 h-20 bg-[#4573a1] rounded-2xl shadow-lg text-center flex justify-center items-center mb-2">
                            <ShoppingCart size={40} color="#ffffff" />

                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">TiendaPOS</h1>
                            <p className="text-gray-500 text-lg">Sistema de Punto de Venta</p>
                        </div>
                    
                    </div>

                    <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="w-[449px] h-96 border px-5 py-4  justify-center bg-white rounded-md border-gray-300 shadow ">
                        <div className="text-center mb-5">
                            <h2 className="capitalize font-medium text-2xl text-gray-800">iniciar sesion</h2>
                            <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder</p>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="text-sm font-medium text-gray-800 capitalize mb-2">
                                Correo Electronico
                            </label>
                            <input className="text-sm border border-gray-300 rounded-md py-2.5 pl-3 focus:border-[#4573a1] focus:border-2 outline-none" type="text" placeholder="usuario@tienda.com"
                            {...register("email", {
                                required: "El correo electronico es requerido"
                            })}
                            />
                            {errors.email && (
                                <ErrorMessage>{errors.email.message}</ErrorMessage>
                            )}

                        </div>
                        <div className="flex flex-col mb-5">
                            <label className="text-sm font-medium text-gray-800 capitalize mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input 
                                className="text-sm border w-full border-gray-300 rounded-md py-2.5 pl-3 focus:border-[#4573a1] focus:border-2 outline-none" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="********"
                                {...register("password", {
                                    required: "La contraseña es requerida"
                                })}
                                />
                                <button type="button" className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={16} color="#6c7c93" />
                                        
                                    ) : (
                                        <Eye size={16} color="#6c7c93" />
                                        
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <ErrorMessage>{errors.password.message}</ErrorMessage>
                            )}
                                    
                        </div>
                        
                        <button 
                        className="capitalize w-full bg-[#4573a1] text-white font-medium py-2.5 rounded hover:bg-[#517ca8] transition-colors cursor-pointer">
                            iniciar sesion
                        </button>

                    </form>

                </div>


            </main>   
            <LoadingModal loading={isLogginIn} />                
        </>
    )
}
