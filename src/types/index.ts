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

export const resumenVenta = z.object({
    ingresos: z.number(),
    ventas: z.number(),
    fecha: z.string()
})

export const resumeStatistics = z.object({
  
    ventas: z.number(),
    ingresos: z.number(),
    unidadesTotales: z.number(),
    valorInventario: z.number()

})

export const topProducts = z.object({
  
    idProducto: z.number(),
    nombre: z.string(),
    cantidad: z.number(),
    ingresos: z.number()

})

export const topUsuarios = z.object({
  
    nombre: z.string(),
    primerApellido: z.string(),
    ventas: z.number(),
    total: z.number()

})

export const ventasCategorias = z.object({
    value: z.number(),
    categoria: z.string()
})

//rols
export const rol = z.object({
    id: number(),
    nombre: string()
})

//users
export const users = z.object({

    id: number(),
    idRol: number(),
    nombre: string(),
    primerApellido: string(),
    segundoApellido: string().nullable(),
    correo: z.string(),
    password: z.string().nullable(),
    estado: z.boolean(),
    fechaCreacion: z.string().nullable()

})

// resume dashboard
export const resumeDashboard = z.object({
    ventas: z.number(),
    ingresos: z.number(),
    productos: z.number(),
    clientes: z.number()
}) 

//auth user 
export const authUser = z.object({
    id: z.number(),
    nombre: z.string(),
    primerApellido: z.string(),
    roles: z.array(rol),
    segundoApellido: z.string().nullable(),
})

export const respuestaAutenticacion = z.object({
    expiracion: z.string(),
    token: z.string(),
    refreshToken: z.string()
})

//Auth
export type ResponseAuthentication = z.infer<typeof respuestaAutenticacion>

// login
export const authLoginSchema = respuestaAutenticacion;

//dashboard
export const resumeDashboardShema = resumeDashboard;

//rols
export const rolsSchema = z.array(rol)
export type Rol = z.infer<typeof rol>

//users
export const usersSchema = z.array(users)
export type User = z.infer<typeof users>
export type UserFormData = Pick<User, 'correo' | 'idRol' | 'nombre' | 'primerApellido' | 'segundoApellido' | 'password'>
export type UserUpdateFormData = Pick<User, 'id' | 'idRol' | 'nombre' | 'correo' | 'primerApellido' | 'segundoApellido' | 'password' | 'estado'>

export const authUserSchema = authUser

export type AuthUser = z.infer<typeof authUser>

//resumen estadisticas
export const resumeStatisticsSchema = resumeStatistics

//Ventas Categorias
export const ventasCategoriasShema = z.array(ventasCategorias)
export type VentaCategoria = z.infer<typeof ventasCategorias>

//Top Usuarios
export const topUsuariosShema = z.array(topUsuarios)
export type TopUsuarios = z.infer<typeof topUsuariosShema>

//Top Products
export const topProductsSchema = z.array(topProducts);
export type TopProducts = z.infer<typeof topProductsSchema>

//Resumen Ventas
export const resumenVentasSchema = z.array(resumenVenta)
export type ResumenVenta = z.infer<typeof resumenVenta>

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
export const productShema = z.array(product)
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

//Login Form Data
export type LoginFormData = {
    email: string
    password: string

}

