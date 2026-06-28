import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer';
import { Table, TD, TH, TR } from '@ag-media/react-pdf-table';
import { styles } from './style';
import { tableData, totalData } from './data';
import { usePosNetStore } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { getProveedorById } from '../../services/ProveedoresAPI';
import type { Proveedor } from '../../types';
import { format } from '@formkit/tempo';
import { calcularIVA, numeroOrdenCompra } from '../../helpers';

export default function Invoice() {

    const dataCompras = usePosNetStore((state) => state.dataCompras)
    
    const idProveedor = usePosNetStore((state) => state.idProveedor)
    
    
    const {data, isLoading} = useQuery<Proveedor>({
        queryFn: () => getProveedorById(idProveedor),
        queryKey: ['proveedor']
    })

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
                            COMPANY NAME
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Address 23456 Street Name
                        </Text>
                        <Text style={[styles.paddingY]}>
                           City, State, Zip Code
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Phone: (123) 465-789
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Email: ejemplo@gmail.com
                        </Text>
                        <Text style={[styles.paddingY]}>
                            Website: www.ejemplo.com
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
                            Vendor Name
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            Address 23456 Street Name
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                           City, State, Zip Code
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            Phone: (123) 465-789
                        </Text>
                        <Text style={[styles.paddingTop, styles.paddingLeft5]}>
                            Email: ejemplo@gmail.com
                        </Text>        
                    
                    </View>
                    <View style={[styles.with50]}>
                        <Text style={[styles.padding5, styles.colorBlue, styles.uppercase, styles.textBold, styles.fontSize11]}>
                            SKIP TO
                        </Text>        
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {data?.nombre + " " + data?.primerApellido + " " + data?.segundoApellido}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {data?.colonia}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {data?.ciudad+", " + data?.estado + ", " + data?.codigoPostal}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {data?.telefono}
                        </Text>
                        <Text style={[styles.paddingLeft5, styles.paddingTop]}>
                            {data?.correo}
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
