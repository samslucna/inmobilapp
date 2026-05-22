const electron = require('electron')
const dialog = electron.dialog;
const pdfkit = require('pdfkit')
const excelJs = require('exceljs')
const fs = require('fs')
const path = require('path')
let convertir = require('numero-a-letras')
const cExport = () => {}

const qrcode = require('qrcode')


const workbook = new excelJs.Workbook();

const formatNumero = (numero) => {
  return numero.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const aMoneda = (numero) => {

  if (numero !== null && numero !== undefined) {
    numero = numero.toString()
    if (numero === '') {
      return;

    }

    //let tamNumero = numero.length

    if (numero.indexOf('.') >= 0) {

      const decimalPos = numero.indexOf('.')


      let ladoIzq = numero.substring(0, decimalPos)
      let ladoDer = numero.substring(decimalPos)

      ladoIzq = formatNumero(ladoIzq)
      ladoDer = formatNumero(ladoDer)


      ladoDer = ladoDer.substring(0, 2)

      return numero = '$ ' + ladoIzq + '.' + ladoDer



    }
    return numero
  }




}



const mntLetra = (mn) => {
  mn = mn + 1

  let mnaux = ''
  switch (mn) {
    case 1:
      mnaux = 'Enero'
      return mnaux
    case 2:
      mnaux = 'Febrero'
      return mnaux

    case 3:
      mnaux = 'Marzo'
      return mnaux
    case 4:
      mnaux = 'Abril'
      return mnaux

    case 5:
      mnaux = 'Mayo'
      return mnaux

    case 6:
      mnaux = 'Junio'
      return mnaux


    case 7:
      mnaux = 'Julio'
      return mnaux


    case 8:
      mnaux = 'Agosto'
      return mnaux

    case 9:
      mnaux = 'Septiembre'
      return mnaux

    case 10:
      mnaux = 'Octubre'
      return mnaux
    case 11:
      mnaux = 'Noviembre'
      return mnaux

    case 12:
      mnaux = 'Diciembre'
      return mnaux
    default:
      mnaux = 'Nada homie'
      return mnaux
  }



}

cExport.genqr = async (dataqr) => {

  let datatext = JSON.stringify(dataqr)
  qrcode.toFile(
    `${path.join(__dirname, '../../../'+dataqr.idrecibo+'.png')}`,
    datatext, {
      width: 200,
      height: 200
    },
    err => {
      if (err) throw err
    }
  )

}


cExport.reciboIngresos2 = async (recibo, detallesconceptos) => {

  const doc = new pdfkit();


  doc.pipe(fs.createWriteStream('./reciboIngresos.pdf'));


  doc.image(`${path.join(__dirname, 'img/recibopagotesoreria2.png')}`, 15, 15, {
    width: 580,
    height: 740
  })




  //texto
  //encabezado
  doc.font('Helvetica-Bold').fontSize(16).text('RECIBO DE PAGO A LA TESORERIA', 180, 113)
  // Nombre del Municipio
  doc.font('Helvetica-Bold').fontSize(10).text('Municipio:', 45, 143)
  doc.font('Helvetica').fontSize(10).text('Tlalixtaquilla de Maldonado, Guerrero', 100, 143)
  doc.font('Helvetica-Bold').fontSize(10).text('Dirección:', 290, 143)
  doc.font('Helvetica').fontSize(10).text('Av. Morelos N° 1 Colonia Centro C.P.: 41350', 339, 143)
  doc.font('Helvetica-Bold').fontSize(10).text('Contribuyente:', 45, 158)
  doc.font('Helvetica').fontSize(10).text(recibo.persona.toUpperCase(), 120, 158)
  doc.font('Helvetica-Bold').fontSize(10).text('Dirección:', 45, 172)
  doc.font('Helvetica').fontSize(10).text(recibo.domicilio.toUpperCase(), 100, 172)



  //fecha

  doc.font('Helvetica-Bold').fontSize(10).text('Fecha:', 435, 158)
  doc.font('Helvetica').fontSize(9).text(recibo.fecha, 475, 158)

  doc.font('Helvetica-Bold').fontSize(10).text('Folio:', 439, 172)
  doc.font('Helvetica').fontSize(9).text(recibo.idrecibo, 475, 172)









  //ENCABEZADO DE LA TABLA
  doc.rect(41, 185, 530, 16)
  doc.stroke()
  doc.rect(41, 185, 530, 16).fill('#c5ad8b')
  doc.stroke()
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('NUMERO', 45, 190)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('CANTIDAD', 104, 190)
  doc.rect(161, 185, 265, 117)
  doc.stroke()
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('CONCEPTOS', 270, 190)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('IMPORTE', 435, 190)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('TOTAL', 500, 190)

  //conceptos

  let conceptoy = 208
  let detalley = 218
  let totalRecibo = 0
  detallesconceptos.forEach((concepto, i) => {

    let timporte = (parseFloat(concepto.cantidad) * concepto.importe).toFixed(2)
    doc.font('Helvetica-Bold').fontSize(8).text(i + 1, 60, conceptoy)
    doc.font('Helvetica-Bold').fontSize(8).text(concepto.cantidad, 128, conceptoy)
    doc.font('Helvetica-Bold').fontSize(8).text(concepto.concepto, 163, conceptoy, {
      width: 280
    })
    doc.font('Helvetica').fontSize(8).text(concepto.detallepago, 166, detalley)
    doc.font('Helvetica-Bold').fontSize(8).text(aMoneda(concepto.importe.toFixed(2)), 432, conceptoy, {
      width: 50,
      align: 'right'
    })
    doc.font('Helvetica-Bold').fontSize(8).text(aMoneda(timporte), 491, conceptoy, {
      width: 65,
      align: 'right'
    })
    conceptoy += 19
    detalley += 19
    totalRecibo += parseFloat(timporte)

  })




  doc.rect(426, 302, 145, 18).fill('#801330')
  doc.stroke()
  doc.fillColor('white').font('Helvetica-Bold').fontSize(9).text('TOTAL:', 429, 311)
  doc.fillColor('white').font('Helvetica-Bold').fontSize(9).text(aMoneda(totalRecibo.toFixed(2)), 491, 311, {
    width: 65,
    align: 'right'
  })

  // x,y ancho, alto cuadro superior

  doc.rect(41, 154, 530, 149)
  doc.stroke()

  doc.rect(41, 185, 60, 117)
  doc.stroke()
  doc.rect(100, 185, 60, 117)
  doc.stroke()

  doc.rect(426, 185, 60, 135)
  doc.stroke()

  doc.rect(486, 185, 85, 135)
  doc.stroke()


  //CON LETRA
  doc.rect(41, 302, 385, 18)
  doc.stroke()

  doc.fillColor('black').font('Helvetica-Bold').fontSize(8).text('CON LETRA:', 42, 308)

  doc.fillColor('black').font('Helvetica').fontSize(8).text((convertir.NumerosALetras(totalRecibo)).toUpperCase(), 95, 308)

  let pathqr = `${path.join(__dirname, '../../../'+recibo.idrecibo+'.png')}`

  try {
    doc.image(pathqr, 42, 324, {
      width: 80,
      height: 80
    })
  } catch (error) {
    console.log(error)
  }


  //+400 y  cuadro superior



  //texto
  //encabezado
  doc.fillColor('black').font('Helvetica-Bold').fontSize(16).text('RECIBO DE PAGO A LA TESORERIA', 180, 485)

  // Nombre del Municipio

  doc.font('Helvetica-Bold').fontSize(10).text('Municipio:', 45, 515)
  doc.font('Helvetica').fontSize(10).text('Tlalixtaquilla de Maldonado, Guerrero', 100, 515)
  doc.font('Helvetica-Bold').fontSize(10).text('Dirección:', 290, 515)
  doc.font('Helvetica').fontSize(10).text('Av. Morelos N° 1 Colonia Centro C.P.: 41350', 339, 515)

  doc.font('Helvetica-Bold').fontSize(10).text('Contribuyente:', 45, 538)
  doc.font('Helvetica').fontSize(10).text((recibo.persona).toUpperCase(), 120, 538)
  doc.font('Helvetica-Bold').fontSize(10).text('Dirección:', 45, 552)
  doc.font('Helvetica').fontSize(10).text((recibo.domicilio).toUpperCase(), 100, 552)

  //fecha

  doc.font('Helvetica-Bold').fontSize(10).text('Fecha:', 435, 538)
  doc.font('Helvetica').fontSize(9).text(recibo.fecha, 475, 538)

  doc.font('Helvetica-Bold').fontSize(10).text('Folio:', 439, 552)
  doc.font('Helvetica').fontSize(9).text(recibo.idrecibo, 475, 552)


  //ENCABEZADO DE LA TABLA
  doc.rect(41, 565, 530, 16)
  doc.stroke()
  doc.rect(41, 565, 530, 16).fill('#c5ad8b')
  doc.stroke()
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('NUMERO', 45, 570)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('CANTIDAD', 104, 570)
  doc.rect(161, 565, 265, 117)
  doc.stroke()
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('CONCEPTOS', 270, 570)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('IMPORTE', 435, 570)
  doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text('TOTAL', 500, 570)

  //conceptos
  let conceptoyd = 588
  let detalleyd = 598

  detallesconceptos.forEach((concepto, i) => {
    let timporte = (parseFloat(concepto.cantidad) * concepto.importe).toFixed(2)
    doc.font('Helvetica-Bold').fontSize(8).text(i + 1, 60, conceptoyd)
    doc.font('Helvetica-Bold').fontSize(8).text(concepto.cantidad, 128, conceptoyd)
    doc.font('Helvetica-Bold').fontSize(8).text(concepto.concepto, 163, conceptoyd, {
      width: 280
    })
    doc.font('Helvetica').fontSize(8).text(concepto.detallepago, 166, detalleyd)
    doc.font('Helvetica-Bold').fontSize(8).text(aMoneda(concepto.importe.toFixed(2)), 432, conceptoyd, {
      width: 50,
      align: 'right'
    })
    doc.font('Helvetica-Bold').fontSize(8).text(aMoneda(timporte), 491, conceptoyd, {
      width: 65,
      align: 'right'
    })
    conceptoyd += 19
    detalleyd += 19


  })


  doc.rect(426, 682, 145, 18).fill('#801330')
  doc.stroke()
  doc.fillColor('white').font('Helvetica-Bold').fontSize(9).text('TOTAL:', 429, 691)
  doc.fillColor('white').font('Helvetica-Bold').fontSize(9).text(aMoneda(totalRecibo.toFixed(2)), 491, 691, {
    width: 65,
    align: 'right'
  })


  doc.rect(41, 528, 530, 154)
  doc.stroke()
  doc.rect(41, 565, 60, 117)
  doc.stroke()
  doc.rect(100, 565, 60, 117)
  doc.stroke()

  doc.rect(426, 565, 60, 135)
  doc.stroke()

  doc.rect(486, 565, 85, 135)
  doc.stroke()


  //CON LETRA
  doc.rect(41, 682, 385, 18)
  doc.stroke()
  doc.fillColor('black').font('Helvetica-Bold').fontSize(8).text('CON LETRA:', 42, 688)

  doc.fillColor('black').font('Helvetica').fontSize(8).text((convertir.NumerosALetras(totalRecibo)).toUpperCase(), 95, 688)






  // Finalize PDF file
  doc.end();





}

cExport.reciboIngresos = async (recibo, detallesconceptos) => {

  const doc = new pdfkit();


  doc.pipe(fs.createWriteStream('./reciboIngresos.pdf'));


  doc.image(`${path.join(__dirname, 'img/logoleft.png')}`, 15, 15, {
    width: 80,
    height: 80
  })


  doc.image(`${path.join(__dirname, 'img/logoright.jpg')}`, 500, 15, {
    width: 80,
    height: 80
  })


  //doc.font('Helvetica').fontSize(9).text(recibo.fecha, 475, 158)

  let mnt = new Date(recibo.fecha)

  //texto
  //encabezado
  doc.font('Helvetica-Bold').fontSize(13).text('H. AYUNTAMIENTO MUNICIPAL DE', 190, 25)
  doc.font('Helvetica-Bold').fontSize(13).text('TLALIXTAQUILLA DE MALDONADO, GUERRERO', 140, 40)
  doc.font('Helvetica-Bold').fontSize(13).text('TESORERIA MUNICIPAL', 230, 55)
  doc.font('Helvetica-Bold').fontSize(13).text('PERIODO 2021-2024', 245, 70)
  doc.font('Helvetica').fontSize(9).text(('Av. Morelos #1, Col. Centro, C.P. 41350, Tlalixtaquilla de Maldonado,Guerrero').toUpperCase(), 115, 85)
  doc.fillColor('black').font('Helvetica').fontSize(9).text('TLALIXTAQUILLA,GRO, 2 DE ' + (mntLetra(mnt.getMonth())).toUpperCase() + ' DEL 2022', 210, 100)
  //ENCABEZADO DE LA TABLA
  doc.rect(41, 110, 110, 16).fill('#c5ad8b')
  doc.stroke()
  doc.rect(200, 110, 70, 16).fill('#c5ad8b')
  doc.stroke()
  doc.rect(395, 110, 60, 16).fill('#c5ad8b')
  doc.stroke()
  doc.rect(41, 110, 530, 16)
  doc.stroke()

  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('FOLIO:', 118, 114)
  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('R.F.C:', 241, 114)
  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('CUENTA:', 411, 114)
  doc.font('Times-Roman').fontSize(12).text(recibo.idrecibo, 155, 114)
  doc.font('Times-Roman').fontSize(12).text('XAXX010101000', 275, 114)
  doc.font('Times-Roman').fontSize(12).text('123434', 455, 114)

  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('NOMBRE O RAZÓN SOCIAL:', 102, 130)
  doc.font('Helvetica').fillColor('black').fontSize(10).text(recibo.persona.toUpperCase(), 245, 130)
  doc.moveTo(41, 140) // set the current point
    .lineTo(570, 140)
    .stroke()

  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('DIRECCIÓN:', 180, 145)
  doc.font('Helvetica').fillColor('black').fontSize(10).text(recibo.domicilio.toUpperCase(), 245, 145)
  doc.moveTo(41, 155) // set the current point
    .lineTo(570, 155)
    .stroke()

  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('GIRO O ACTIVIDAD:', 140, 160)
  doc.font('Helvetica').fillColor('black').fontSize(10).text('NO APLICA:', 245, 160)
  doc.moveTo(41, 170) // set the current point
    .lineTo(570, 170)
    .stroke()
  doc.font('Helvetica-Bold').fillColor('black').fontSize(10).text('CONCEPTO DEL INGRESO:', 108, 175)
  doc.font('Helvetica').fillColor('black').fontSize(10).text('NO APLICA:', 245, 175)


  doc.rect(41, 186, 150, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('PERIODO:', 140, 191)
  doc.rect(191, 186, 140, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('ENERO-DICIEMBRE 2022', 200, 191)
  doc.rect(331, 186, 90, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('IMPORTE:', 345, 191)
  doc.rect(421, 186, 148, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('$ 500.00', 425, 191)
  // end and display the document in the iframe to the right

  doc.rect(41, 202, 150, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('BASE O CALIFICACIÓN:', 75, 208)
  doc.rect(191, 202, 140, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('ENERO-DICIEMBRE 2022', 200, 208)
 

  doc.font('Helvetica').fillColor('black').fontSize(10).text('CUOTA O TARIFA:', 105, 224)
  doc.rect(191, 218, 140, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('ENERO-DICIEMBRE 2022', 200, 224)

  doc.rect(41, 218, 150, 16)
  doc.stroke()
  doc.rect(331, 202, 90, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('15% PRO-EDU:', 345, 208)
  doc.rect(421, 202, 148, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00', 425, 208)


  doc.rect(331, 218, 90, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('15% PRO-CAM:', 345, 224)
  doc.rect(421, 218, 148, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00', 425, 224)

  doc.rect(331, 234, 90, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('15% PRO-RED:', 345, 239)
  doc.rect(421, 234, 148, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00', 425, 239)

  doc.rect(331, 250, 90, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('15% PRO-ECO:', 345, 254)
  doc.rect(421, 250, 148, 16)
  doc.stroke()
  doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00', 425, 254)
  doc.rect(331, 266,  90, 16)
  doc.stroke()
 doc.font('Helvetica').fillColor('black').fontSize(10).text('15% PRO-TUR:', 345, 271)
doc.rect(421, 266,  148, 16)
doc.stroke()
doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00',425, 271)
// end and display the document in the iframe to the right
doc.rect(331, 282,  90, 16)
  doc.stroke()
 doc.font('Helvetica').fillColor('black').fontSize(10).text('15% C. ESTATAL:', 338, 286)
doc.rect(421, 282,  148, 16)
doc.stroke()
doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00',425, 286)
// end and display the document in the iframe to the right
doc.rect(331, 298,  90, 16)
  doc.stroke()
 doc.font('Helvetica').fillColor('black').fontSize(10).text('FORMATO:', 365, 303)
doc.rect(421, 298,  148, 16)
doc.stroke()
doc.font('Helvetica').fillColor('black').fontSize(10).text('$0.00',425, 303)
// end and display the document in the iframe to the right
doc.rect(41, 234, 290, 80)
  doc.stroke()

  let pathqr = `${path.join(__dirname, '../../../'+recibo.idrecibo+'.png')}`

  try {
    doc.image(pathqr, 42, 324, {
      width: 80,
      height: 80
    })
  } catch (error) {
    console.log(error)
  }


  
  // Finalize PDF file
  doc.end();


}


cExport.reciboEgresos = (recibo, detallesconceptos) => {

  //console.log(detallesconceptos)

  // Create a document
  let fecha = new Date(recibo[0].fecha)

  let mntmes = fecha.getMonth()

  const doc = new pdfkit();

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(fs.createWriteStream('./reciboEgresos.pdf'));


  // Add an image, constrain it to a given size, and center it vertically and horizontally


  doc.image(`${path.join(__dirname, 'img/reciboegresos.png')}`, 15, 15, {
    width: 580,
    height: 740
  })


  doc.fillColor('red').font('Helvetica-Bold').fontSize(15).text(`${recibo[0].idrecibo}`, 483, 139)


  doc.fillColor('black').font('Helvetica').fontSize(11).text(`${aMoneda(detallesconceptos[0].importe.toFixed(2))}` + ' (' + (convertir.NumerosALetras(detallesconceptos[0].importe.toFixed(2)).toUpperCase()) + ')', 284, 279)



  doc.fillColor('black').font('Helvetica').fontSize(11).text(`${(detallesconceptos[0].concepto).toUpperCase()}`, 66, 334)


  doc.fillColor('black').font('Helvetica').fontSize(11).text(`${fecha.getDate()}`, 397, 373)
  doc.fillColor('black').font('Helvetica').fontSize(11).text(`${mntLetra((mntmes))}`, 436, 373)
  doc.fillColor('black').font('Helvetica').fontSize(11).text(`${fecha.getFullYear()}`, 515, 373)

  doc.fillColor('black').font('Helvetica').fontSize(12).text((recibo[0].persona).toUpperCase(), 226, 584)
  doc.fillColor('black').font('Helvetica').fontSize(12).text((detallesconceptos[0].detallepago).toUpperCase(), 206, 624)
  doc.fillColor('black').font('Helvetica').fontSize(12).text((recibo[0].domicilio).toUpperCase(), 206, 644)



  // Finalize PDF file
  doc.end();


}

cExport.ExportDetalleCajaExcel = async (recibos, detallescaja) => {
  //console.log(recibos)
  const leerExcel = await workbook.xlsx.readFile(path.join(__dirname, './templates/templateDetalleCaja.xlsx'))
    .then(function () {
      var worksheet = workbook.getWorksheet(1);

      let rowinicial = 6
      detallescaja.forEach((detalle) => {
        recibos.forEach((rbos) => {

          if (rbos.idrecibo === detalle.recibo) {


            if (detalle.idconcepto === null && detalle.detallepago !== '') {
              worksheet.insertRow(rowinicial, [rbos.fecha, rbos.idrecibo, detalle.concepto, detalle.cantidad, (-detalle.importe), 0.00, (detalle.cantidad * (-detalle.importe))], 'i+');

            } else {
              worksheet.insertRow(rowinicial, [rbos.fecha, rbos.idrecibo, detalle.concepto, detalle.cantidad, (detalle.importe), (detalle.cantidad * (detalle.importe)), 0.00], 'i+');
            }

            rowinicial += 1

          }
          return null
        })

      })

      let rowtres = worksheet.getRow(rowinicial)

      rowtres.getCell(6).value = 'Recibido:'
      rowtres.getCell(7).value = {
        formula: `SUM(F6:F${rowinicial-1})`
      }
      rowtres.commit();
      rowinicial += 1

      worksheet.insertRow(rowinicial, ['', '', '', '', '', 'Retirado:', rowinicial], 'i+')

      let rowret = worksheet.getRow(rowinicial)
      rowret.getCell(7).value = {
        formula: `SUM(G6:G${rowinicial-2})`
      }
      rowret.commit();


      rowinicial += 1

      worksheet.insertRow(rowinicial, ['', '', '', '', '', 'Saldo Final :', rowinicial], 'i+')
      let rowsf = worksheet.getRow(rowinicial)

      rowsf.getCell(7).value = {
        formula: `SUM(G${rowinicial-2}:G${rowinicial-1})`
      }
      rowsf.commit();
      return workbook.xlsx.writeFile(path.join(__dirname, '../../../detallecaja.xlsx'))
    })


  let savePath = await dialog.showSaveDialog(null, {
      title: 'Guardar',
      defaultPath: path.join(__dirname, '../../../detallecaja' + detallescaja[0].idcaja + '.xlsx'),
      filters: [{
        name: 'Text',
        extensions: 'xlsx'
      }],
      buttonLabel: 'Guardar'
    }


  )

  fs.copyFile(path.join(__dirname, '../../../detallecaja.xlsx'), savePath.filePath, (err) => {
    if (err) throw null;
    console.log(path.join(__dirname, '../../../detallecaja.xlsx') + ' was copied to ' + savePath.filePath);
  });

  return leerExcel
}

cExport.ExportDetalleCajasExcel = async (recibos, detallescaja) => {
  //console.log(recibos)
  const leerExcel = await workbook.xlsx.readFile(path.join(__dirname, './templates/templateDetalleDates.xlsx'))
    .then(function () {
      var worksheet = workbook.getWorksheet(1);

      let rowinicial = 11
      detallescaja.forEach((detalle) => {
        recibos.forEach((rbos) => {

          if (rbos.idrecibo === detalle.recibo) {

            if (detalle.idconcepto === null && detalle.detallepago !== '') {
              console.log(detalle)
              worksheet.insertRow(rowinicial, [rbos.fecha, rbos.idrecibo, detalle.idconcepto, rbos.tiporecibo, rbos.persona, detalle.concepto, detalle.detallepago, detalle.cantidad, (-detalle.importe), (detalle.cantidad * (-detalle.importe))], 'i+');

            } else {
              worksheet.insertRow(rowinicial, [rbos.fecha, rbos.idrecibo, detalle.idconcepto, rbos.tiporecibo, rbos.persona, detalle.concepto, detalle.detallepago, detalle.cantidad, (detalle.importe), (detalle.cantidad * (detalle.importe))], 'i+');
            }

            rowinicial += 1

          }
          return null
        })

      })

      let rowtres = worksheet.getRow(rowinicial)

      rowtres.getCell(9).value = 'Recibido:'
      rowtres.getCell(10).value = {
        formula: `SUM(J11:J${rowinicial-1})`
      }
      rowtres.commit();
      rowinicial += 1

      worksheet.insertRow(rowinicial, ['', '', '', '', '', '', '', '', 'Retirado:'], 'i+')
      let rowret = worksheet.getRow(rowinicial)
      rowret.getCell(10).value = {
        formula: `SUMIF(J11:J${rowinicial-2},"<0")`
      }
      rowret.commit();


      rowinicial += 1

      worksheet.insertRow(rowinicial, ['', '', '', '', '', '', '', '', 'Saldo Final :'], 'i+')
      let rowsf = worksheet.getRow(rowinicial)

      rowsf.getCell(10).value = {
        formula: `SUM(J${rowinicial-2}:J${rowinicial-1})`
      }
      rowsf.commit();
      return workbook.xlsx.writeFile(path.join(__dirname, '../../../detalleDates.xlsx'))
    })


  let savePath = await dialog.showSaveDialog(null, {
      title: 'Guardar',
      defaultPath: path.join(__dirname, '../../../detalleDates.xlsx'),
      filters: [{
        name: 'Text',
        extensions: 'xlsx'
      }],
      buttonLabel: 'Guardar'
    }


  )

  fs.copyFile(path.join(__dirname, '../../../detalleDates.xlsx'), savePath.filePath, (err) => {
    if (err) throw null;
    console.log(path.join(__dirname, '../../../detalleDates.xlsx') + ' was copied to ' + savePath.filePath);
  });

  return leerExcel
}

cExport.import = () => {

}

module.exports = cExport