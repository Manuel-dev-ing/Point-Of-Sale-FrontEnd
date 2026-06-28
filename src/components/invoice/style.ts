import { StyleSheet } from "@react-pdf/renderer";

// Create styles
export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: '#262626',
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#b7dff0'

  },
  title: {
    fontSize: 30
  },
  textBold: {
    fontFamily: "Helvetica-Bold"
  },
  fw700: {
    fontWeight: 700 
  },
  fontSize11: {
    fontSize: 10
  },

  spaceY: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginBottom: "30px"

  },
  table: {
    width: "100%",
    borderColor: "#b7dff0",
    borderWidth: 2,
    margin: "20px 0"
  },
  tableHeader: {
    backgroundColor: "#b7dff0"

  },
  td: {
    padding: 6
  },
  totals: {
    display: "flex",
    alignItems: "flex-end"
  },
  // Padding
  paddingTop: {
    paddingTop: "5px"
  },
  paddingBottom: {
    paddingBottom: "15px"
  },
  paddingY:{
    paddingVertical: "2px"
  },
  padding5:{
    padding: "5px"
  },
  paddingLeft5: {
    paddingLeft: "5px"
  },
  //Fin Padding

  //Backgoround Color
  colorBlue: {
    backgroundColor: "#b7dff0"
  },
  textWhite: {
    color: "#ffffff"
  },
  //Fin Backgoround Color

  //Margin
  marginBottom5:{
    marginBottom: "5px"
  },
  marginBottom8:{
    marginBottom: "8px"
  },
  marginTop5:{
    marginTop: "18px"
  },
  //border
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    // padding: "5px"
  },
  borderBottonBlue: {
    borderBottomWidth: 2,
    borderBottomColor: '#b7dff0'
  },
  //Width
  withFull: {
    width: "100%"
  },
  with50: {
    width: "50%"
  },
  uppercase: {
    textTransform: "uppercase"
  },

  flexRow: {
    flexDirection: 'row'
  },
  flexCol:{
    flexDirection: 'column'
  },
  justifyStart:{
    justifyContent: 'flex-start'
  },
  justifyEnd:{
    justifyContent: 'flex-end'
  },
  justifyCenter:{
    justifyContent: 'center'
  },
  justifyBetween:{
    justifyContent: 'space-between'
  },
  justifyAround:{
    justifyContent: 'space-around'
  },
  justifyEvenly:{
    justifyContent: 'space-evenly'
  }

  
  // items-start ➔ alignItems: 'flex-start'items-end ➔ alignItems: 'flex-end'items-center ➔ alignItems: 'center'items-baseline ➔ alignItems: 'baseline'items-stretch ➔ alignItems: 'stretch'
  //  flex-row-reverse ➔ flexDirection: 'row-reverse'flex-col-reverse ➔ flexDirection: 'column-reverse'
  

});



