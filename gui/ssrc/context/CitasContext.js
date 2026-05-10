import React, {
    createContext,
    useState

} from 'react'
import ModalExport from '../Components/Property/components/AgendarCita/Forms/ModalExport'
import ModalGestionCitas from '../Components/Property/components/AgendarCita/Forms/ModalGestionCitas'
import axios from 'axios'
export const CitasContext = createContext()

const CitasProvider = (props) => {

    const [updState, setUpdState] = useState({
        id: null,
        status: false
    })
    const [datasTable, setDatasTable] = useState([])
    const [datasAuxTable, setDatasAuxTable] = useState([])
    const [cita, setCita] = useState({
        idcita: null,
        expediente: "",
        motivo: "",
        fecha: "",
        hora: "",
        tipocita: "",
        status: "",
        responsable: "",
        notaevolucion: ""

    })
    const [asingExpediente, setAsingExpediente] = useState(null)
    const [listDataAgenda, setListDataAgenda] = useState([])
    const [show, setShow] = useState(false);
    const [menu, setMenu] = useState('')
    const [listAux, setListAux] = useState([]);
    const [listResp, setListResp] = useState([])
    const [selectedPaciente, setSelectedPaciente] = useState('')
    const [auxname, setAuxName] = useState('')


    //Paginacion
    const [pagination, setPagination] = useState({
        limit: 8,
        current: 0
    })
    const [activePag, setActivePag] = useState(1)

    const [pagNum, setPagNum] = useState(0)


    const paginator = async (e) => {
        e.preventDefault()
        const {
            id
        } = e.target
        let renderaux = datasTable

        const posIndex = ((id - 1) * pagination.limit)
        let limit = pagination.limit * id
        let nexpag = renderaux.slice(posIndex, limit)

        setPagination({
            limit: pagination.limit,
            current: posIndex
        })

        setDatasAuxTable(nexpag)
        setActivePag(id)
    }

    const renderPagination = (numpag) => {
        let dataret = []
        for (let i = 0; i < numpag; i++) {
            dataret.push(i + 1)
        }
        return dataret.map(inp => {
            return <li key = {
                inp
            }
            className = "page-item" > < a className = "page-link"
            onClick = {
                (e) => {
                    paginator(e)
                }
            }
            href = "#"
            id = {
                inp
            } > {
                inp
            } < /a></li >
        })

    }

    const searchDatas = async (e, result) => {
        e.preventDefault()
        const {
            value
        } = result || e.target
        let expresion = new RegExp(`${value}.*`, "i")

        let auxdatas = datasTable
        let seachRender = auxdatas.filter(element => expresion.test(element.expediente) || expresion.test(element.nombre))

        if (value !== '') {

            let nump = Math.ceil(seachRender.length / pagination.limit)
            setPagNum(nump)
            setDatasAuxTable(seachRender)

        } else {
            let nump = Math.ceil(auxdatas.length / pagination.limit)
            setPagNum(nump)
            setDatasAuxTable(auxdatas.slice(pagination.current, pagination.limit))
        }

    }

    const changeInpt = async (e, result) => {
        e.preventDefault()
        const {
            name,
            value
        } = e.target || result

        setCita({
            ...cita,
            [name]: value
        })


    }


    const getDataByObjec = (id, data, nameprop) => {

        return data.filter(pas => {

            if (parseInt(pas[nameprop]) === parseInt(id)) {
             
                return pas
            }

        })[0]
    }

    const updateTable = async () => {
     
        let nump = Math.ceil(datasTable.length / pagination.limit)
        let renderaux = datasTable
        renderaux.map(data => {

            let datagetnombre = getDataByObjec(parseInt(data.expediente), listAux, 'idpaciente')
            let getresponsable = getDataByObjec(parseInt(data.responsable), listResp, 'idresponsable')

            data.nombre = datagetnombre !== undefined ? datagetnombre.nombre + ' ' + datagetnombre.apellidop + ' ' + datagetnombre.apellidom : 'sin asignar'
            data.nameresp = getresponsable !== undefined ? getresponsable.nombre : 'sin asignar'

            return data
        })

        const posIndex = ((activePag - 1) * pagination.limit)
        let limit = pagination.limit * activePag
        let currentpag = renderaux.slice(posIndex, limit)
        setPagNum(nump)
        setDatasAuxTable(currentpag)
    }

    const handlerMenu = (link) => {

        switch (link) {
            case 'export':
                return <ModalExport
                show = {
                    show
                }
                setShow = {
                    setShow
                }
                />

            case 'modificarcita':
                return <ModalGestionCitas /
                    >

                    case 'gestioncita':
                    return <ModalGestionCitas

                        /
                        >
                        default:
                        return null;
        }
    }
    const exportDoc = async (e, format, modul) => {
        datasTable.map(data => {

            let datagetnombre = getDataByObjec(parseInt(data.expediente), listAux, 'idpaciente')
            let getresponsable = getDataByObjec(parseInt(data.responsable), listResp, 'idresponsable')

            data.nombre = datagetnombre !== undefined ? datagetnombre.nombre + ' ' + datagetnombre.apellidop + ' ' + datagetnombre.apellidom : 'sin asignar'
            data.responsable = getresponsable !== undefined ? getresponsable.nombre : 'sin asignar'

            return data
        })
        e.preventDefault()
        let data = {
            format: format,
            datasTable
        }

        const response = await axios.post('http://localhost/dbcontroller/export.php',
            data, {
                responseType: 'blob'
            }
        );
        setMenu('export')
        setShow(true)

        const url = URL.createObjectURL(response.data);

        let gtenbed = document.querySelector('#verPdf')

        gtenbed.src = url

    }


    return (


        <
        CitasContext.Provider value = {
            {
                updState,
                datasTable,
                cita,
                pagination,
                activePag,
                pagNum,
                datasAuxTable,
                searchDatas,
                changeInpt,
                setDatasAuxTable,
                setPagNum,
                paginator,
                renderPagination,
                setActivePag,
                setPagination,
                setUpdState,
                setDatasTable,
                setCita,
                setAsingExpediente,
                asingExpediente,
                listDataAgenda,
                setListDataAgenda,
                getDataByObjec,
                show,
                setShow,
                listAux,
                setListAux,
                listResp,
                setListResp,
                selectedPaciente,
                setSelectedPaciente,
                auxname,
                updateTable,
                setAuxName,
                handlerMenu,
                menu,
                setMenu,
                exportDoc


            }
        } > {
            props.children
        } < /CitasContext.Provider>

    )


}


export default CitasProvider