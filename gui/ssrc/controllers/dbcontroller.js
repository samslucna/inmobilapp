let editData = false
let editId = null
let seach = ''
const selectpage = {
    tag: 'dbcontroller',
    tagidtable:'',
    nametable:'',
    datas: []
}
let paginations = {
    limit: 5,
    current: 0,
    pagenum: 1,
    totalnumber: 0
}

let dataexport = []




document.getElementById("paginator").addEventListener('click', function (e) {
    let str = e.target.href
    try {
        let lngstr = str.length
        let currenstr = str.indexOf('-') + 1
        paginations.pagenum = parseInt(str.slice(currenstr, lngstr))
        paginations.current = paginations.limit * (paginations.pagenum - 1)


    } catch (error) {

    }


    updateTable()
})

document.getElementById("exportExcel").addEventListener('click', async function (e) {
    e.preventDefault()
    let exprt = {
        doc: e.target.id,
        data: dataexport
    }

    let docExport = await sendExportQuery('../' + selectpage.tag + '/export.php', exprt)
    if (docExport.ok === true) {

        return docExport.blob().then(res => {
            console.log(res)

            let objectUrl = URL.createObjectURL(res)

            window.location.assign(objectUrl)
            URL.revokeObjectURL(objectUrl)
        })

    }


})






document.getElementById("seachBox").addEventListener('keyup', function (e) {
    e.preventDefault()

    let alfanum = SoloNumeroLetras(e)

    //console.log(alfanum)
    if (alfanum !== '') {

        seach += alfanum
        updateTable()
    }
    if (e.target.value === '') {
        seach = ''
        updateTable()
    }



})






function SoloNumeroLetras(event) {

    if ((event.keyCode < 48) ||
        (event.keyCode > 57) && (event.keyCode < 65) ||
        (event.keyCode > 90) && (event.keyCode < 97) ||
        (event.keyCode > 122)) {
        return '';
    } else {

        return event.key;
    }


}


const btnDeleteRow = async (id) => {
    let confirm = false
    await Swal.fire({
        template: '#alrt-delete',
    }).then(res => {
        confirm = res.isConfirmed
    })
    //console.log(confirm)
    if (confirm === true) {
        let del = await delQuery('../' + selectpage.tag + '/delete.php', selectpage.tagidtable, id)
        if (id === del.id) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Los datos se Eliminaron correctamente...'
            })
        }
        updateTable()

    }

    document.forms[0].reset()

}




const insert = async () => {


    let datas = []
    const getdataform = document.forms[0].elements
    for (let i = 0; i < getdataform.length; i++) {
        const element = getdataform[i];
        if (element.type === 'text' || element.type === 'date') {
            datas.push(element.value)
        }

    }


    let jsn = {
        idganado: null,
        siniiga: datas[0],
        nombre: datas[1],
        registro: datas[2],
        regmadre: datas[3],
        regpadre: datas[4],
        fechanac: datas[5],
        pesonac: datas[6],
        capas: datas[7],
        sexos: datas[8],
        razas: datas[9],
        partos: datas[10],
        procedencias: datas[11],
        estatus: datas[12],
        manejos: datas[13],
        rfit: datas[14],
        fecdesdete: datas[15],
        pesodestete: parseInt(datas[16]),
        pesoanio: parseInt(datas[17]),
        ranchos: parseInt(datas[18]),
        fregistro: parseInt(datas[19]),
        foto1: datas[20],
        foto2: datas[21]

    }

    let confirm = false
    if (jsn[0] !== '' && jsn[1] !== '' && jsn[2] != '') {
        await Swal.fire({
            template: '#alrt-save',
        }).then(res => {
            confirm = res.isConfirmed
        })
        if (confirm === true) {
            if (editData !== true) {

                let indt = await sendQuery('../' + selectpage.tag + '/save.php', jsn)
                //id insertado
                //console.log(parseInt(indt))
                if (indt !== undefined) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 800,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'Los datos se guardaron correctamente...'
                    })

                }
            } else {

                jsn.idganado = parseInt(editId)
                await updateQuery('../' + selectpage.tag + '/update.php', jsn)

            }


            updateTable()

        }

    }


}

const read = async (url) => {
    const response = await fetch(url);
    return response.json()
}

const btnUpdate = async (id) => {


    let upd = await getByIdQuery('../' + selectpage.tag + '/getById.php', selectpage.tagidtable, id)

    let jsn = {

        0: upd[0][1],
        1: upd[0][2],
        2: upd[0][3],
        3: upd[0][4],
        4: upd[0][5],
        5: upd[0][6],
        6: upd[0][7],
        7: upd[0][8],
        8: upd[0][9],
        9: upd[0][10],
        10: upd[0][11],
        11: upd[0][12],
        12: upd[0][13],
        13: upd[0][14],
        14: upd[0][15],
        15: upd[0][16],
        16: upd[0][17],
        17: upd[0][18],
        18: upd[0][19],
        19: upd[0][20],
        20: upd[0][21],
        21: upd[0][22],

    }
    await renderform()
    if (document.forms[0].children.length > 1) {

        document.forms[0].children[0].remove()

    }

    const setdataform = document.forms[0].elements

    for (let i = 0; i < setdataform.length; i++) {
        const element = setdataform[i];
        for (const property in jsn) {
            if (element.type === 'text' || element.type === 'date' && parseInt(property) === i) {
                element.value = jsn[i]
            }
        }

    }

    editId = upd[0][0]
    editData = true

}

const sendQuery = async (url = '', data = {}) => {

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })


    return response.json()

}
const sendExportQuery = async (url = '', data = {}) => {

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })


    return response

}

const delQuery = async (url, namecol, id) => {
    // Awaiting fetch which contains 
    // method, headers and content-type
    let data = {
        namecol: namecol,
        id: id
    }
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    // Awaiting for the resource to be deleted


    // Return response data 
    return response.json()
}

const getByIdQuery = async (url, namecol, id) => {
    // Awaiting fetch which contains 
    // method, headers and content-type
    let data = {
        namecol: namecol,
        id: id
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    // Awaiting for the resource to be deleted


    // Return response data 
    return response.json()
}

const updateQuery = async (url, data) => {

    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })


    return response.json()
}

const initFrm = async (url) => {

    const response = await fetch(url);
    return response.json()
}

const renderform = async () => {



    for (let i = 0; i < document.forms[0].children.length; i++) {
        if (document.forms[0].children.length > 1) {
            document.forms[0].children[1].remove()

        }

    }

    let upd = await initFrm('../' + selectpage + '/getNameColumns.php')



    let tmplateform = `<div> `

    let y = 1


    for (let i = 0; i < upd.length; i++) {

        if (upd[y] !== undefined) {

            if (upd[y][1].slice(0, 7) === 'varchar' || upd[y][1].slice(0, 3) === 'int') {

                tmplateform += `<div class="ui input">
                    <input type="text" placeholder="${(upd[y][0]).toUpperCase()}">
                    </div>`
            }
            if (upd[y][1].slice(0, 4) === 'date') {
                tmplateform += `<div class="ui input">
                    <input type="date" placeholder="${(upd[y][0]).toUpperCase()}">
                    </div>`
            }
        }

        y += 1
    }

    tmplateform += `
       
         <button class="ui button " onclick="insert()" type="button">Guardar</button>
       </div>
         `


    document.forms[0].insertAdjacentHTML('beforeend', tmplateform)


}

const updateTable = async () => {
    let loadTable = await read('../../catalogos/' + selectpage + '/get.php')


    loadTable.reverse()

    let expresion = new RegExp(`${seach}.*`, "i")
    let seachrender = loadTable.filter(res => expresion.test(res[1]) || expresion.test(res[3]))

    paginations.totalnumber = Math.ceil(seachrender.length / paginations.limit)


    $('#paginator').pagination({
        items: seachrender.length,
        itemsOnPage: paginations.limit,
        cssStyle: 'light-theme',
        prevText: '<<',
        nextText: '>>'
    });

    let limit = (paginations.limit * paginations.pagenum)
    let nexpag = seachrender.slice(paginations.current, limit)

    template(nexpag);
    $('#paginator').pagination('selectPage', paginations.pagenum);
    console.log()

}



const template = (data) => {
    let html = ``
    let upd = document.querySelector('#datarender')

    upd.innerHTML = html


    data.filter((res) => {
        dataexport.push(res)
        html = `<td class="collapsing"><p>${res[1]}</p></td><td><p>${res[2]}</p></td><td class="collapsing">${res[3]}</td><td><button onclick="btnUpdate(${res[0]})"  class="ui button vk">E</button><button onclick="btnDeleteRow(${res[0]})" class="ui button red">X</button></td>`
        upd.insertAdjacentHTML('beforeend', html)
    })


}




updateTable()