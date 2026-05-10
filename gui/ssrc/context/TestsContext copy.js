import React, {
    createContext,
    useState

} from 'react'
import axios from 'axios'

export const PacientesContext = createContext()

const PacientesProvider = (props) => {
 
    const [updState, setUpdState] = useState({
        id: null,
        status: false
    })
    const [datasTable, setDatasTable] = useState([])
    const [datasAuxTable, setDatasAuxTable] = useState([])

    const [testEv, guardarTestEv] = useState({
        idtest: null,
        nombre: "",
        descripcion: ""
    })

    const [pregunta, guardarPregunta] = useState({
        idpregunta: null,
        pregunta: "",
        valor: "",
        testid:""
    })

    const [respuesta, guardarRespuesta] = useState({
        idtrespuesta: null,
        clave: "",
        consecutivo: "",
        respuesta: "",
        valor: "",
        preguntaid:""
    })

    const [resultval, guardarResultVal] = useState({
        idresultval: null,
        condicion: "",
        resultado: "",
        descvaloracion: "",
        testid: ""
    })


    //Paginacion
    const [pagination, setPagination] = useState({
        limit: 8,
        current: 0
    })
    const [activePag, setActivePag] = useState(1)

    const [pagNum, setPagNum] = useState(0)

    const [show, setShow] = useState(false);
  

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
            className = "page-item" > <a className = "page-link"
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
            } </a></li >
        })

    }
    const searchDatas = async (e, result) => {
        e.preventDefault()
        const {
            value
        } = result || e.target
        let expresion = new RegExp(`${value}.*`, "i")

        let auxdatas = datasTable
        let seachRender = auxdatas.filter(element => expresion.test(element.especialidad) || expresion.test(element.nombre))

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
    
        const posIndex = ((activePag - 1) * pagination.limit)
        let limit = pagination.limit * activePag
        let currentpag = renderaux.slice(posIndex, limit)
        setPagNum(nump)
        setDatasAuxTable(currentpag)
    }
    const exportDoc = async (e, format, modulo,datas) => {

        e.preventDefault()
        let data = {
            format,
            modulo,
            datas
        }

        const response = await axios.post('http://localhost/dbcontroller/getDoc.php',
            data, {
                responseType: 'blob'
            }
        );

        const url = URL.createObjectURL(response.data);

        let gtenbed = document.querySelector('#verPdf')

        gtenbed.src = url

    }


    return (


        <PacientesContext.Provider value = {
            {
                updState,
                datasTable,
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
                renderDate,
                show,
                setShow,
                updateTable,
                getDataByObjec,
                exportDoc
            }
        } > {
            props.children
        } </PacientesContext.Provider>

    )


}


export default PacientesProvider