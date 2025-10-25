



export function calcularResta(total: number, recibe: number) : number{
    let resultado = (recibe - total)

    return resultado
}



export function calcularIVA(numero:number) : number {
    
    const iva : number = 16

    const resultado = (numero * iva)

    let total_iva = resultado / 100

    return total_iva
}




