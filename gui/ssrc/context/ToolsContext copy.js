import React, {
    createContext,
    useState
} from 'react'
import axios from 'axios'



export const ToolsContext = createContext()

const ToolsProvider = (props) => {

    const [datahost, setDataHost] = useState({

        hostname: 'localhost',
        page: 'postd',

    })


    const [paginations, setPaginations] = useState({
        limit: 10,
        current: 0,
        pagenum: 1,
        totalnumber: 0
    })

    const readDatas = async (table) => {

    /*     const response = await axios.get('http://' + datahost.hostname + '/' + datahost.page + '/get.php', {
            params: {
                table
            }
        }); */

        let response = await fetch('http://' + datahost.hostname + '/' + datahost.page + '/get.php?table='+table+'',)             //   .then( res => res.json())
           
        // Return response data 
        return response.json()
    }

    const deleteData = async (table, colnameid, id) => {
        // Awaiting fetch which contains 
        // method, headers and content-type
        const response = await axios.delete('http://' + datahost.hostname + '/' + datahost.page + '/delete.php', {
            data: {
                table,
                colnameid,
                id
            }
        });

        // Awaiting for the resource to be deleted


        // Return response data 
        return response.data
    }

    const saveDatas = async (table, datas) => {
        const response = await axios.post('http://' + datahost.hostname + '/' + datahost.page + '/save.php',
            [
                table,
                datas
            ]
        );

        return response.data

    }

    const updateDatas = async (table, datas) => {

        const response = await axios.post('http://' + datahost.hostname + '/' + datahost.page + '/update.php',
            [
                table,
                datas
            ]
        );

        return response.data

    }

    const createObject = async (table) => {

        let auxObj = {}
        const colnames = await readDatas('http://' + datahost.hostname + '/' + datahost.page + '/getNameColumns.php', table)

        colnames.map((namecol) => {

            for (let i = 0; i < colnames.length; i++) {
                const name = namecol[0]
                return auxObj[name] = ''
            }
            return null
        })

        return auxObj

    }

    function formatNumber(n) {

        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const inputNumber = (e) => {

        const {
            value
        } = e.target

        let valInput = value

        if (valInput === "") {
            return;
        }

        let originalLn = value.length


        let caret_pos = e.target.selectionStart

        if (valInput.indexOf('.') >= 0) {

            const decimalPos = valInput.indexOf('.')


            let leftSide = valInput.substring(0, decimalPos);
            let rightSide = valInput.substring(decimalPos);


            leftSide = formatNumber(leftSide)
            rightSide = formatNumber(rightSide)

            if (e.type === "blur") {
                rightSide += "00";
            }


            rightSide = rightSide.substring(0, 2)

            valInput = '$' + leftSide + '.' + rightSide

        } else {



            valInput = formatNumber(valInput)
            valInput = '$' + valInput

            if (e.type === "blur") {
                valInput += ".00";
            }

        }
        let updateLn = valInput.length
        caret_pos = updateLn - originalLn + caret_pos

        e.target.setSelectionRange(caret_pos, caret_pos)


        return valInput

    }

    const numberToString = (numb) => {

        numb = parseFloat(numb).toFixed(2)

        let valInput = numb.toString()

        if (valInput === "") {
            return;
        }



        if (valInput.indexOf('.') >= 0) {

            const decimalPos = valInput.indexOf('.')


            let leftSide = valInput.substring(0, decimalPos);
            let rightSide = valInput.substring(decimalPos);


            leftSide = formatNumber(leftSide)
            rightSide = formatNumber(rightSide)


            rightSide += "00";



            rightSide = rightSide.substring(0, 2)

            valInput = '$' + leftSide + '.' + rightSide

        } else {



            valInput = formatNumber(valInput)
            valInput = '$' + valInput


            valInput += ".00";


        }



        return valInput

    }

    function toInt(n) {
        n = toString(n)
        if (n !== undefined && n !== '') {
            return parseFloat(n.replace(/,/g, "").replace('$', "")).toFixed(2)
        } else {
            return n
        }

    }

    //Date Context
    const [rangeDate, setRangeDate] = useState({
        datede: '',
        datea: ''
    })

    const renderDate = (date) => {
        date = new Date(date)
        let datemnt = date.getMonth()
        datemnt = datemnt.toString()
        if (datemnt.length !== 1) {
            return date !== null ? date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() : '-';
        } else {
            return date !== null ? date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)) + '-' + date.getDate() : '-';
        }
        

    }

    const toMs = (dateStr) => {

        let parts = dateStr.split("-")
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime()
    }
    const queryDates = () => {

        /*  let dd = toMs(rangeDate.datede)
         let da = toMs(rangeDate.datea)

         let filteredRecibos = dataRender.filter((recibo) => {
             let dateboaux = toMs(recibo.fecha)
             return (dateboaux >= dd) && (dateboaux <= da)
         })

         let nump = Math.ceil(filteredRecibos.length / pagination.limit) */
        // setPagNum(nump)

        // setTableRender(filteredRecibos.slice(pagination.current, pagination.limit))

        // updateTable()
    }

  

   



    return (


        <ToolsContext.Provider value = {
            {
              
                renderDate,
                setDataHost,
                setPaginations,
                readDatas,
                deleteData,
                saveDatas,
                updateDatas,
                createObject,
                numberToString,
                datahost,
                paginations,
                inputNumber,
                toInt
            }
        } > {
            props.children
        } </ToolsContext.Provider>

    )


}


export default ToolsProvider