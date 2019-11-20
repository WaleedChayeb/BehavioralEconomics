const router = require('express').Router()
const XLSX = require('xlsx')
const path = require('path')
const wbSheetName = "Sheet1"

router.post('/',(req,res)=>{

    let wb = XLSX.utils.book_new()     
    try{
    //try to open the excel file
    wb = XLSX.readFile('./database/data.xlsx')
    
    }catch(exception){
        //If the file is not found
        if(exception.code === "ENOENT"){
            //The column headers
            const columnData = [["Name","Gender","DOB","Income","No.Sign","No.Cancel","No.SignAfterCancel","No.OC Skip","No.RP Skip"]]
            //Create the new sheet
            const columnWorkSheet = XLSX.utils.aoa_to_sheet(columnData)
            //recreate the wb
            wb = XLSX.utils.book_new()
            //Assign the basic properties of the workbook 
            wb.Props = {
                Title : "Data",
                Subject : "Experment data",
                Author : "Auto created",
                CreatedDate : new Date()
            }
            //Add a new sheet
            wb.SheetNames.push(wbSheetName)
            //Assign the column sheet to the wb
            wb.Sheets[wbSheetName] = columnWorkSheet
        }
    }
    //Edit the excel file
    const ws  = XLSX.utils.sheet_add_aoa(wb.Sheets[wbSheetName],[req.body.data],{origin : -1})
    //Write back the result
    XLSX.writeFile(wb,'./database/data.xlsx')
  
    res.status(200).send()
  
})

router.get('/',(req,res)=>{
    try{
    const wb = XLSX.readFile('./database/data.xlsx')
    res.send(XLSX.utils.sheet_to_html(wb.Sheets[wbSheetName]))
    }catch(exception){
        res.send(exception.message).end()
    }
})

router.get('/download',(req,res)=>{
    try{
    const wb = XLSX.readFile('./database/data.xlsx')
    // res.sendfile(fileSaver.saveAs(new Blob([s2ab(wb)],{type:"application/octet-stream"}),"data.xlsx"))
        res.sendfile(path.join(__dirname,'../database','data.xlsx'))
    }catch(exception){
        res.send(exception.message).end()
    }
})
module.exports = router
