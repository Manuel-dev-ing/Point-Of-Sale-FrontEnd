import React from 'react'

type LoadingModalProps = {
    loading: boolean
}

export default function LoadingModal({loading} : LoadingModalProps) {
    
    if (!loading) return null;
        
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] select-none pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-[280px] flex flex-col items-center animate-fadeIn scale-95">
                
                {/* Spinner Moderno */}
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow"></div>
                </div>

                {/* Mensaje */}
                <p className="mt-5 text-gray-700 font-semibold text-center text-sm">{"Iniciando Sesion..."}</p>
            </div>
        </div>
    )
}
