import type { TopUsuarios } from "../types"

type TableTopUsers = {
    data: TopUsuarios | undefined
    dataThead: string[]
}

export default function TableTopUsers({data, dataThead} : TableTopUsers) {
    return (
    
        <>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-sm text-gray-600  capitalize bg-gray-50 ">
                    <tr>
                        {dataThead.map((item, index) => (
                            <th key={index} scope="col" className="px-6 py-3 font-medium">
                                {item}
                            </th>
                                
                        ))}
                        
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item, index) => (
                    <tr key={index} className="bg-white border-b border-gray-200">
                        <td className="px-6 py-4">
                            {item.nombre + ' ' + item.primerApellido}
                        </td>
                        <td className="px-6 py-4">
                            {item.ventas}
                        </td>
                        <td className="px-6 py-4">
                            ${item.total}
                        </td>

                    </tr>
                    ))}


                </tbody>
            </table>


        </>
    
    )
}




