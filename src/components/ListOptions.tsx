import { ChevronDown, ChevronUp, ClipboardList, ShoppingCart, ShoppingCartPlus } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { type LucideIcon } from 'lucide-react';
import type { ListOptions } from '../types';

type ListOptionsProps = {
    icon: LucideIcon;
    name: string;
    list: ListOptions[]
}



export default function ListOptions({icon: Icon, name, list} : ListOptionsProps) {
    const [isVissible, setVissible] = useState<boolean>(false)

    const handlerVentas = () => {
    
        setVissible(x => !x)

    }

    return (
        <li className=''>
            <a className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 group cursor-pointer" onClick={handlerVentas}>
                <div className='flex items-center'>

                    <Icon
                        size={15}
                    />
                    <span className="ms-3 text-sm font-normal">
                        {name}
                    </span>
                </div>
                {isVissible ? (

                    <ChevronUp size={17} />
                ): (
                    <ChevronDown size={17} />
                )}
            </a>
            
            
            <ul className={`
                pl-4
                overflow-hidden
                transition-all
                duration-300
                ease-in-out
                ${
                    isVissible === true
                        ? 'max-h-24 opacity-100 translate-y-0'
                        : 'max-h-0 opacity-0 -translate-y-2'
                }
            `}>
                {list.map(x => (

                    <Link key={x.name} to={x.path} target='_blank' className="flex items-center p-2 rounded-lg hover:bg-gray-100 group gap-2">
                        <x.icon size={15} />
                            
                        <span className="text-sm font-normal">
                            {x.name}
                        </span>
                    </Link>
                ))}   
                

            </ul>

            
        </li>
    )
}
