


export function GenerarCodigoBarras(): number {
    
    var min = 111111111111;
    var max = 999999999999;

    var x = Math.floor(Math.random()*(max-min+1)+min);
    return x
}


