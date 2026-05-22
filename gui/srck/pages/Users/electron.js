const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');


var pdfview = require('electron-pdf-viewer');
const {
  ipcMain
} = require('electron');

const helper = require('./lib/helper')

const cQuery = require('./controllers/cQuery');

const cExport = require('./controllers/cExport');


let mainWindow;

function createWindow(filename, options) {


  let win = new BrowserWindow(options);

  win.loadURL(filename);


  if (isDev) {
    //   // Open the DevTools.
    //   //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');

    win.webContents.openDevTools()

  }
  win.on('closed', () => win = null)

  return win
}


function viewerFileWindow(urlFile) {

  //set pdf path

  // you can get full URL to display PDF by using getPdfHtmlURL() function
  const displayPdfUrl = pdfview.getPdfHtmlURL(urlFile);
  const options = {
    width: 800,
    height: 600,
    webPreferences: {
      parent: mainWindow,
      nodeIntegration: false,
      contextIsolation: true
    }
  }
  // If you dont provive options, default options will be use
  var win = pdfview.showpdf(urlFile, options);
  win.show();
}





app.on('ready', () => {
  mainWindow = createWindow(isDev? "http://localhost:3000" : `file://${path.join (__dirname,"../build/index.html ")}`, {
    width: 1000,
    height: 780,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: __dirname + '/preload.js'
    }
  })

});

 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

});




//------------------Acciones con la ventana de la aplicación----------------------------//
ipcMain.handle('window-close', () => {
  mainWindow.close();
})

//------------------Renderizar en PDF Recibo-----------------------------//
ipcMain.handle('genqr', async (e, [recibo]) => {

  await cExport.genqr(recibo)
  return true


})



//------------------Renderizar en PDF Recibo-----------------------------//
ipcMain.handle('printReciboIngresos', async (e, [recibo]) => {
    //t, namecolid, id, namecol, idsup

    let detallesconceptos = await cQuery.getDataById('detalle_recibo', 'recibo', recibo.idrecibo)


    await cExport.reciboIngresos(recibo, detallesconceptos)

    await viewerFileWindow(`file://${path.join(__dirname,'../../../reciboIngresos.pdf')}`)

  }

)


ipcMain.handle('printReciboEgresos', async (e, [reboe]) => {
    //t, namecolid, id, namecol, idsup
    let detallesconceptos = await cQuery.getDataById('detalle_recibo', 'recibo', reboe)
    let recibo = await cQuery.getDataById('recibos', 'idrecibo', reboe)

    await cExport.reciboEgresos(recibo, detallesconceptos)

    await viewerFileWindow(`file://${path.join(__dirname,'../../../reciboEgresos.pdf')}`)

}

)
//------------------Renderizar en Excel Recibo-----------------------------//
 

ipcMain.handle('ExportDetalleCajaExcel', async (e, idcaja) => {
    //t, namecolid, id, namecol, idsup
    let detallesconceptos = await cQuery.getDataById('detalle_recibo', 'idcaja', idcaja)

    let recibos = await cQuery.getDataById('recibos', 'idcaja', idcaja)

    await cExport.ExportDetalleCajaExcel(recibos, detallesconceptos)
  }

)



//-----------------------------------------------
ipcMain.handle('open-dialog', async (e, arg) => {

  arg = await dialog.showOpenDialog({
    properties: ['openDirectory', 'openFile', 'multiSelections'],
    title: 'Selecciona el archivo .....',
    defaultPath: '/home/samu/Documentos/'
  })

  return arg
})

ipcMain.handle('dialog-confirm', async (e, [arg,msg,dtl]) => {

  arg = await dialog.showMessageBox({
   
    title: 'Confirmar Cambios',
    message:msg,
    detail:dtl,
    buttons:['No','Si']
    
  },response =>{
    console.log(`Seleccionaste la  opción: ${response}`)
  })
  //console.log(path.join(__dirname,'../'))
  return arg
})


//------------------Consultas Base de Datos-----------------------------//
ipcMain.handle('dbget', async (e, table) => {
  let cQ = await cQuery.get(table)
  return cQ
})

ipcMain.handle('dbsave', async (e, [table, data]) => {
  let cQ = await cQuery.save(table, data)
  return cQ
})

ipcMain.handle('dbupdate', async (e, [t, namecolid, id, data]) => {
  let cQ = await cQuery.update(t, namecolid, id, data)
  return cQ
})

ipcMain.handle('dbgetid', async (e, [t, namecolid, id]) => {
  let cQ = await cQuery.getDataById(t, namecolid, id)
  return cQ
})

ipcMain.handle('dbdelete', async (e, [t, namecolid, id]) => {
  let cQ = await cQuery.deleteData(t, namecolid, id)
  return cQ
})


//------------------ Inicio de sesión de usuarios del sistema-----------------------------//

ipcMain.handle('singup', async (e, usr) => {


  usr.password = await helper.encryptPass(usr.password)

  const result = await cQuery.save('users', usr)

  return result

})


ipcMain.handle('registerUser', async (e, usr) => {


  usr.password = await helper.encryptPass(usr.password)

  const result = await cQuery.save('personas', usr)

  return result

})

ipcMain.handle('singin', async (e, usr) => {


  const upass = await cQuery.getDataById('personas', 'username', usr.username)

  

  if (upass != undefined) {

      const validpass = await helper.matchPassword(usr.password, upass[0].password)

      const sgnn = {
          username: upass[0].username,
          validpass: validpass
      }



      return sgnn

  }else{

      const sgnn = {
          username: usr.username,
          validpass: false
      }
      return sgnn
  }




})