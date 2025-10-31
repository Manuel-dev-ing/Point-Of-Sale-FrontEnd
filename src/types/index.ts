import z, { number, string } from "zod"

//Categories
const categories = z.object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    fechaCreacion: z.string(),
    estado: z.boolean(), 
    productos: z.number()
});

const clients = z.object({
    id: z.number(),
    nombre: z.string(),
    primerApellido: z.string().nullable(),
    segundoApellido: z.string().nullable(),
    correo: z.string().nullable(),
    telefono: z.string().nullable(),
    estado: z.boolean()
})

const products = z.object({
    id: z.number(),
    categoria: z.string(),
    nombre: z.string(),
    precio: z.number(),
    stockInicial: z.number(),
    stockMinimo: z.number(),
    codigoBarras: z.string(),
    descripcion: z.string(),
    estado: z.boolean()
})


export const product = z.object({
    id: z.number(),
    idCategoria: z.number(),
    nombre: z.string(),
    precio: z.number(),
    stockInicial: z.number(),
    stockMinimo: z.number(),
    codigoBarras: z.string(),
    descripcion: z.string(),
    estado: z.boolean()
})

//proveedores
const proveedor = z.object({
    id: z.number(),
    ciudad: z.string(),
    nombre: z.string(),
    primerApellido: z.string(),
    segundoApellido: z.string(),
    correo: z.string(),
    telefono: z.string(),
    colonia: z.string(),
    codigoPostal: z.string(),
    estado: z.boolean()
})

//datos venta
const datosVenta = z.object({
    idProducto: z.number(),
    codigoBarras: z.string(),
    producto: z.string(),
    precioVenta: z.number(),
    cantidad: z.number(),
    existencia: z.number()
})

//datos compras
const datosCompras = z.object({
    idProducto: z.number(),
    categoria: z.string(),
    producto: z.string(),
    cantidad: z.number(),
    costoUnitario: z.number(),
    subTotal: z.number()
})



//schema ventas
const detalleVenta = z.object({
    idProducto: z.number(),
    cantidad: z.number(),
    precio: z.number(),
    total: z.number()
})

export const venta = z.object({
    idUsuario: z.number(),
    idCliente: z.number(),
    numeroVenta: z.number(),
    subTotal: z.number(),
    total: z.number(),
    detalleVenta: z.array(detalleVenta)
})

const compra = z.object({
    idUsuario: z.number(),
    idProveedor: z.number(),
    numeroCompra: z.number(),
    subTotal: z.number(),
    total: z.number(),
    DetalleCompra: z.array(detalleVenta)
})

// movimientos schema
export const movimiento = z.object({
    id: z.number(),
    idUsuario: z.number(),
    idProducto: z.number(),
    tipo: z.string(),
    cantidad: z.number(),
    motivo: z.string(),
    fecha: z.string(),
})


//Categories
export const categoriesShema = z.array(categories); 
export type Categories = z.infer<typeof categoriesShema>
export type Category = z.infer<typeof categories>
export type CategoryFormData = Pick<Category, 'nombre' | 'descripcion'>

//Clients
export const clientsShema = z.array(clients)
export type Clients = z.infer<typeof clients>
export type ClientFormData = Pick<Clients, 'nombre' | 'primerApellido' | 'segundoApellido' | 'correo' | 'telefono'>

//Products
export const productsShema = z.array(products)
export type Product = z.infer<typeof products>
export type ProductData = z.infer<typeof product>

export type ProductFormData = Pick<ProductData, 'nombre' | 'idCategoria' | 'precio' | 'stockInicial' | 'stockMinimo' | 'codigoBarras' | 'descripcion'>

//Ventas
export type Venta = z.infer<typeof venta>

//Datos Venta
export type SaleData = z.infer<typeof datosVenta>

//Datos Compras
export type ComprasData = z.infer<typeof datosCompras>

//Proveedores
export const proveedorSchema = z.array(proveedor)
export type Proveedor = z.infer<typeof proveedor>

//Compras
export type Compra = z.infer<typeof compra>


//Movimientos
export const movimientosShema = z.array(movimiento)



export type MovimientoFormData = {
    idProducto: number,
    movimiento: string,
    cantidad: number,
    motivo: string
}

//Alerta
export type Alerta = {
  isSuccess: boolean
  mensaje: string
}