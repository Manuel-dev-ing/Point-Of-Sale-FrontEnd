import type { LucideIcon } from 'lucide-react'
import React from 'react'


type CardStatisticsMediumProps = {
    label: string
    value: number | string | undefined
    Icon?: LucideIcon
    iconColor?: string
    variant?: string
    className?: string | undefined 
}

export default function CardStatisticsMedium({label, value, Icon, iconColor, variant = "w-60", className} : CardStatisticsMediumProps) {

    const baseStyles = "bg-white border border-gray-300 p-3 rounded"
    const styles = className ? className : baseStyles

    return (
        <>
            <div className={`${styles} ${variant}`}>
                <div className='flex items-center justify-between px-2 mb-2'>
                    <p className='capitalize text-sm text-gray-700 font-medium'>{label}</p>
                    {Icon && (
                        <Icon size={15} color={iconColor} />
                    )}
                </div>
                <span className='font-bold px-2 text-2xl text-gray-800'>{value}</span>
            </div>


        </>   
    )
}



