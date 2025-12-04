import { Package, type LucideIcon } from 'lucide-react'
import React from 'react'

type CardStatisticsProps = {
    label: string
    value: number | string | undefined
    Icon?: LucideIcon
    iconColor?: string
    variant?: string 
}   

export default function CardStatistics({label, value, Icon, iconColor, variant = "w-80"} : CardStatisticsProps) {

    const baseStyles = "flex items-center gap-2 border border-gray-300 p-3 bg-white mt-4 rounded"
 
    return (
        <>
            <div className={`${baseStyles} ${variant}`}>
                {/* <Package size={20} color='#4573a1' /> */}
                {Icon && (
                    <Icon size={20} color={iconColor} />
                )}
                
                <div className='flex flex-col'>
                    <p className='text-gray-500 text-sm font-normal'>{label}</p>
                    <span className='font-bold text-2xl text-gray-800'>{ value }</span>
                </div>

            </div>

        </>
    )
}




