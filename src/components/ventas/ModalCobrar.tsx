import React, { useMemo, useState } from 'react'
import { calcularResta } from '../../helpers'
import type { SaleData } from '../../types'


type ModalChangeProductProps = {
    cobrar: boolean
    setCobrar: React.Dispatch<React.SetStateAction<boolean>>
    total: number
    dataVenta: SaleData[]
}

export default function ModalCobrar({cobrar, setCobrar, total, dataVenta} : ModalChangeProductProps) {
  const [recibe, setRecibe] = useState<number>(0)

  const handleClickCerrar = () => {
    setCobrar(false)
    
  }

  const handleClickBackdrop = () => {
    setCobrar(false)
  }

  const handleChangeRecibe = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = Number(e.target.value)
    setRecibe(valor)
  }

  const handleClickCobrar = () => {
    
    console.log('Cobrando modal cobrar...');

    const detalleVenta = dataVenta.map(item => {

      const {idProducto, cantidad, precioVenta} = item
      
      const total = (cantidad * precioVenta).toFixed(2)

      return { idProducto: idProducto, cantidad: cantidad, precio: precioVenta, total: Number(total) }

    })

    const venta = {
      idUsuario: 1,
      idCliente: 8,
      numeroVenta: 1,
      subTotal: total,
      total: total,
      detalleVenta: detalleVenta
    }

    console.log(venta);

  }

  let resultado = useMemo(() => calcularResta(total, recibe), [total, recibe])

  return (
    
    <>
      {cobrar && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Backdrop con animación */}
          <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
          opacity-20" onClick={handleClickBackdrop}></div>

          {/* Contenido del modal con animación */}
          <div className="relative bg-white rounded-md shadow-lg p-6 w-md z-10">
              <h3 className="text-lg font-medium text-gray-600 mb-4">Cobrar en Efectivo</h3>
              <div className=''>
                <div className='border rounded p-2 border-[#98a8b8] bg-[#e7ecf0] mb-5'>
                  <p className='text-sm text-gray-500'>Total de la Venta</p>
                  <span className='text-3xl font-bold text-[#4c78a5]'>${total.toFixed(2)} MXN</span>
                </div>
                <div className='mb-5'>
                  <label htmlFor="nombre" className="text-gray-700 font-medium text-sm">Recibe</label>
                  <input type="number" min={0} className='block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-blue-500' placeholder='0.00'
                    onChange={handleChangeRecibe}
                  />
                </div>
                {resultado < 0 ? (
                  <div className='border rounded p-2 border-red-200 bg-red-50'>
                      <p className='text-red-600 text-sm'>
                        La cantidad recibida es menor al total. Falta: ${(total - recibe).toFixed(2)} MXN
                      </p>
                  </div>
                ) : (
                  <div className='border rounded p-2 border-green-200 bg-green-50'>
                    <p className='text-sm text-gray-500'>Cambio</p>
                    <span 
                      className={`text-3xl font-bold text-green-700`}
                    >
                      ${resultado.toFixed(2)} MXN
                    </span>
                  </div>
                )}
                

              </div>
              <div className="flex justify-start gap-2 mt-5">
                  <button
                      onClick={handleClickCobrar}
                      type="submit"
                      className="text-center text-white cursor-pointer btn-blue font-medium rounded text-sm px-5 py-2.5 transition w-xs">
                      Cobrar
                  </button>
                  <button
                      className="px-4 py-2 text-gray-800 font-medium text-sm bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                      onClick={handleClickCerrar}>
                      Cerrar
                  </button>
              </div>
          </div>



        </div>
      )}
    
    </>

  )
}
