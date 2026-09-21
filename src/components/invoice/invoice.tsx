import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { styles } from './style';
import { tableData, totalData } from './data';
import { usePosNetStore } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { getProveedorById } from '../../services/ProveedoresAPI';
import type { DataCompany, Proveedor } from '../../types';
import { format } from '@formkit/tempo';
import { calcularIVA, numeroOrdenCompra } from '../../helpers';
import { useEffect, useState } from 'react';
import { getConfigCompany } from '../../services/ConfiguracionEmpresaAPI';

export default function Invoice() {
    const [configCompany, SetConfigCompany] = useState<DataCompany>({} as DataCompany)
    const dataCompras = usePosNetStore((state) => state.dataCompras)
    
    const idProveedor = usePosNetStore((state) => state.idProveedor)
    
    const {data: dataProv, isLoading} = useQuery<Proveedor>({
        queryFn: () => getProveedorById(idProveedor),
        queryKey: ['proveedor']
    })

    const { data: dataConfig, isLoading: isLoadingConfig, isError } = useQuery({
        queryFn: getConfigCompany,
        queryKey: ['configcompany']
    })
    
    console.log(dataConfig);

    const total = dataCompras.reduce((total, item) => total + (item.costoUnitario * item.cantidad), 0);
    

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={[styles.header, styles.paddingBottom]}>
                    <View>
                        <Text style={[styles.title, styles.textBold, styles.fw700]}>
                            PURCHASE ORDER
                        </Text>
                    </View>        
                    
                </View>
                <View style={[styles.justifyBetween, styles.flexRow]}>
                    <View>
                        <Text style={[ styles.textBold]}>
                            {dataConfig?.nombreEmpresa ?? "Vendor Name" }

                        </Text>
                        <Text style={[styles.paddingY]}>
                            {dataConfig?.direccion ?? "Address 23456 Street Name"}
                        </Text>
                        <Text style={[styles.paddingY]}>
                           {dataConfig?.ciudad ?? "City"}{", "}{dataConfig?.estado ?? "State"}{", "}{dataConfig?.codigoPostal ?? "Zip Code"}
                           
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Phone: {dataConfig?.telefono ?? "(123) 456 231"}
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Email: {dataConfig?.email ?? "correo@gmail.com"}
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Website: {dataConfig?.sitioWeb ?? "www.ejemplo.com"}
                        </Text>

                    </View>
                    
                    <View>
                        <Text style={[styles.colorBlue, styles.padding5, styles.marginBottom5]}>
                            DATE : {format(new Date(), "YYYY/MM/DD", "en")}
                        </Text>
                        <Text style={[styles.colorBlue, styles.padding5]}>
                            PO# : {numeroOrdenCompra()}
                        </Text>
                    </View>
                </View>
                <View style={[styles.withFull, styles.flexRow, styles.justifyBetween, styles.marginTop5]}>
                    <View style={[styles.with50]}>
                        <Text style={[styles.padding5, styles.colorBlue, styles.uppercase, styles.textBold, styles.fontSize11]}>
                            Vendor Information
                        </Text>

                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataConfig?.nombreEmpresa ?? "Vendor Name" }
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            {dataConfig?.direccion ?? "Address 23456 Street Name"}
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                           {dataConfig?.ciudad ?? "City"}{", "}{dataConfig?.estado ?? "State"}{", "}{dataConfig?.codigoPostal ?? "Zip Code"}
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            Phone: {dataConfig?.telefono ?? "(123) 456 231"}
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            Email: {dataConfig?.email ?? "correo@gmail.com"}
                        </Text>        
                    
                    </View>
                    <View style={[styles.with50]}>
                        <Text style={[styles.padding5, styles.colorBlue, styles.uppercase, styles.textBold, styles.fontSize11]}>
                            SKIP TO
                        </Text>        
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataProv?.nombre + " " + dataProv?.primerApellido + " " + dataProv?.segundoApellido}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataProv?.colonia}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataProv?.ciudad+", " + dataProv?.codigoPostal}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataProv?.telefono}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {dataProv?.correo}
                        </Text>        

                    </View>

                </View>

                {/* <View style={styles.spaceY}>
                    <Text style={[ styles.textBold]}>Bill To:</Text>
                    <Text>Client Name</Text>
                    <Text>Client Address</Text>
                    <Text>City, State ZIP</Text>
                </View> */}
                
                {/* Render Table */}
                <Table style={styles.table}>
                    <TH style={[styles.tableHeader, styles.textBold]}>
                        <TD style={[styles.td, styles.uppercase, styles.fontSize11]}>Description</TD>
                        <TD style={[styles.td, styles.uppercase, styles.fontSize11]}>Quantity</TD>
                        <TD style={[styles.td, styles.uppercase, styles.fontSize11]}>Unit Price</TD>
                        <TD style={[styles.td, styles.uppercase, styles.fontSize11]}>Total</TD>

                    </TH>
                    {dataCompras.map((item, index) => (
                        <TR key={index}>
                            <TD style={styles.td}>{item.producto}</TD>
                            <TD style={styles.td}>{item.cantidad}</TD>
                            <TD style={styles.td}>{item.costoUnitario.toFixed(2)}</TD>
                            <TD style={styles.td}>{item.subTotal.toFixed(2)}</TD>
                        </TR>

                    ))}
                </Table>

                <View style={styles.totals}>
                    <View style={{
                        minWidth: "256px",
                    }}>
                        
                        <View>
                            <View style={[styles.flexRow, styles.justifyBetween, styles.borderBottonBlue, styles.marginBottom5, styles.padding5]}>
                                <Text style={[styles.textBold]}>
                                    Sub total:
                                </Text>
                                <Text style={[styles.textBold]}>
                                    $ {total}
                                </Text>


                            </View>
                            <View style={[styles.flexRow, styles.justifyBetween, styles.borderBottonBlue, styles.marginBottom5, styles.padding5]}>
                                <Text style={[styles.textBold]}>
                                    IVA (16%):
                                </Text>
                                <Text style={[styles.textBold]}>
                                    $ {calcularIVA(total)}
                                </Text>


                            </View>
                            <View style={[styles.flexRow, styles.justifyBetween, styles.colorBlue, styles.padding5]}>
                                <Text style={[styles.textBold]}>
                                    Total
                                </Text>
                                <Text style={[styles.fw700]}>
                                    $ {(calcularIVA(total) + total).toFixed(2)}
                                </Text>


                            </View>
                           
                        </View>
                        


                    </View>

                </View>    


            </Page>
        </Document>
    );

    return (
        <div>
            <div className='w-full h-[38rem] border'>
                <PDFViewer width="100%" height="100%">
                    <MyDocument />
                </PDFViewer>
            </div>
        </div>
    )
}
