import type { ProductData } from "../types"

type ListProductsProps = {
    dataLowProducts: ProductData[] | undefined
}

export default function ListProducts({dataLowProducts} : ListProductsProps) {
    return (
        <>
            {dataLowProducts?.map((item, index) => (
                <div key={index} className='bg-[#e6ebef] px-4 py-3 mt-5  rounded '>
                <div className='flex justify-between'>
                    <p className='text-gray-800 font-semibold text-base'>{item.nombre}</p>
                    <span className='font-bold text-lg text-yellow-500'>{item.stockInicial  }</span>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500 text-sm capitalize'>stock restante</p>
                    <span className='text-gray-500 text-sm'>unidades</span>
                </div>
                </div>
            ))}

        </>    
    )
}



