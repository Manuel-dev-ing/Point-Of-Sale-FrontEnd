import React, { useEffect, useState } from 'react'

type AlertProps = {
    alert : string

}

export default function Alert({alert} : AlertProps) {
    const [vissible, setVissible] = useState<boolean>(true)

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            setVissible(false)
        }, 20000)

        
        return () => clearTimeout(timeoutId)
    
    }, []) 

    return (
        <>
            {vissible && (
                <div 
                className="flex items-start sm:items-center p-4 mb-4 text-sm text-red-800 rounded-md bg-[#fff1f2]" 
                role="alert">
                                        
                    <p><span className="font-medium me-1">{alert}</span> </p>
                </div>
            )}
        </>
    )
}
