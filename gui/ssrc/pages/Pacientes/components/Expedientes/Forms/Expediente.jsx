import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react'
import { Card, Tabs, Tab, CardGroup, Nav, NavDropdown } from 'react-bootstrap'
import { GrDocumentPdf, GrDocumentExcel } from 'react-icons/gr'
import { ToolsContext } from '../../../../../context/ToolsContext'
import { PacientesContext } from '../../../../../context/PacientesContext'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'
import '../css/styles.css'
import logouneme from '../img/unemescapa.jpeg'
import ModalExport from './ModalExport'
const Expediente = ({ setSelectedConten }) => {

    const { paciente, updateTable, handleClose, dataCalendario, setdataCalendario,
        exportDoc, setShow, show } = useContext(PacientesContext)

    const { updateDatas, readDatas } = useContext(ToolsContext)
    const [noteData, setNoteData] = useState({})
    const [editNote, setEditNote] = useState(false)
    const [activePag, setActivePag] = useState(1)
    const [pagination, setPagination] = useState({
        limit: 5,
        current: 0
    })
    const [tableRender, setTableRender] = useState([])
    const [pagNum, setPagNum] = useState(0)

    const paginator = async (e) => {
        e.preventDefault()
        const {
            id
        } = e.target
        let renderaux = dataCalendario
        let aux = renderaux.filter(data => {

            if (parseInt(paciente.idpaciente) === parseInt(data.expediente)) {

                return data
            }
        })

        const posIndex = ((id - 1) * pagination.limit)
        let limit = pagination.limit * id
        let nexpag = aux.slice(posIndex, limit)

        setPagination({
            limit: pagination.limit,
            current: posIndex
        })

        setTableRender(nexpag)
        setActivePag(id)
    }
    const renderPagination = (numpag) => {
        let dataret = []
        for (let i = 0; i < numpag; i++) {
            dataret.push(i + 1)
        }
        return dataret.map(inp => {
            return <li key={inp} className="page-item"> <a className="page-link" onClick={(e) => { paginator(e) }} href="#" id={inp}>{inp}</a></li >
        })

    }
    const btnBack = (e) => {
        e.preventDefault()
        setSelectedConten('expedientes')
        handleClose()
    }
    const actionBtns = async (e) => {
        e.preventDefault()

        const actiontype = (e.target.id).substr(0, 3)
        const actionid = (e.target.id).substr(-3, 3)

        if (actiontype === 'vie') {

            let getData = dataCalendario.filter(data => actionid === data.idcita.substr(-3, 3))[0]

            let auxData = {
                idcita: getData.idcita,
                expediente: getData.expediente,
                motivo: getData.motivo,
                fecha: getData.fecha,
                hora: getData.hora,
                tipocita: getData.tipocita,
                status: getData.status,
                responsable: getData.responsable,
                notaevolucion: getData.notaevolucion
            }
            //console.log(updState)
            setNoteData(auxData)

        } else if (actiontype === 'upd') {

            let getData = dataCalendario.filter(data => actionid === data.idcita.substr(-3, 3))[0]
            let auxData = {
                idcita: getData.idcita,
                expediente: getData.expediente,
                motivo: getData.motivo,
                fecha: getData.fecha,
                hora: getData.hora,
                tipocita: getData.tipocita,
                status: getData.status,
                responsable: getData.responsable,
                notaevolucion: getData.notaevolucion
            }

            setNoteData(auxData)
            setEditNote(true)
        }

    }
    const changeInpt = (e, result) => {
        e.preventDefault()
        const {
            name,
            value
        } = e.target || result

        setNoteData({
            ...noteData,
            [name]: value
        })


    }


    const updcita = async () => {
        let citas = await readDatas('citas')
        let renderaux = citas
        let aux = renderaux.filter(data => {

            if (parseInt(paciente.idpaciente) === parseInt(data.expediente)) {

                return data
            }
        })

        let nump = Math.ceil(aux.length / pagination.limit)
        const posIndex = ((activePag - 1) * pagination.limit)
        let limit = pagination.limit * parseInt(activePag)
        let currentpag = aux.slice(posIndex, limit)
        setPagNum(nump)
        setdataCalendario(citas)
        setTableRender(currentpag)
    }

    const btnSaveNote = async () => {

        let alertSave = await Swal.fire({
            title: 'Guardar Cambios',
            text: "Desea Guardar la Nota !",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar!'
        })

        if (alertSave.isConfirmed !== false) {

            let upd = await updateDatas('citas', noteData)

            updcita()
            setEditNote(false)
            return new Swal(
                `Operación exitosa`,
                'Actualización exitosa.',
                'info'
            )
        } else {
            setEditNote(false)
            return new Swal(
                `No se realizo ninguna acción`,
                'selecciona otra  opción.',
                'info'
            )
        }

    }

    const printDoc = (e, typedoc) => {
        e.preventDefault()


        let exportNote = dataCalendario.filter(data => parseInt(paciente.idpaciente) === parseInt(data.expediente))
        exportNote.push(paciente)
        console.log(exportNote)
        setShow(true)
        switch (typedoc) {
            case 'pdf':
                exportDoc(e, typedoc, 'notas', exportNote)
                break;

            default:
                break;
        }
       
    }

    useEffect(() => {


        updateTable()
        updcita()
        setShow(false)

    }, [])
    return (
        <Fragment>

            <ModalExport
                show={show}
                setShow={setShow}

            />

            <div className="container">
                <div className="row">
                    <Card  >
                        <Card.Header>Numero de Expediente:{paciente.idpaciente}</Card.Header>
                        <Card.Body>
                            <Tabs
                                defaultActiveKey="perfil"
                                id="fill-tab-example"
                                className="mb-3"

                                fill
                            >
                                <Tab eventKey="perfil" title="Información General">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col col-md-3">
                                                <Card style={{ heigth: '100%' }}>


                                                    <Card.Img src={logouneme}></Card.Img>

                                                </Card>
                                            </div>

                                            <div className="col col-md-9">
                                                <Card style={{ heigth: '100%' }}>



                                                    <Card.Body>
                                                        <div className="col col-md-12">
                                                            <div className="row">

                                                                <div className="col col-md-5">
                                                                    <h6>Nombre: {`${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`}</h6>
                                                                </div>
                                                                <div className="col col-md-4">
                                                                    <h6>Telefono: {`${paciente.telefono}`}</h6>
                                                                </div>
                                                            </div>
                                                            <div className="row" >
                                                                <div className="col col-md-5">
                                                                    <h6>Correo: {`${paciente.email}`}</h6>
                                                                </div>
                                                                <div className="col col-md-7">
                                                                    <h6>   Direccion: {`${paciente.direccionparticular}`}</h6>
                                                                </div>

                                                            </div>
                                                            <div className="row">
                                                                <div className="col col-md-5">
                                                                    <h6>Fecha de  Ingreso: {`${paciente.fechaingreso}`}</h6>
                                                                </div>
                                                                <div className="col col-md-7">
                                                                    <h6>  Motivo: {`${paciente.motivo}`}</h6>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </Card.Body>

                                                </Card>
                                            </div>
                                        </div>
                                        <div className='row' style={{ marginTop: '30px' }}>
                                            <CardGroup>
                                                <Card>
                                                    <Card.Header>Datos de Consulta:</Card.Header>

                                                    <Card.Body>

                                                        <Card.Text>
                                                            <CardGroup>
                                                                <Card>
                                                                    <Card.Title>Consultas</Card.Title>
                                                                    <Card.Body>
                                                                        <h1 style={{ textAlign: 'center' }}>2</h1>

                                                                    </Card.Body>
                                                                </Card>
                                                            </CardGroup>
                                                        </Card.Text>
                                                    </Card.Body>

                                                </Card>
                                                <Card>
                                                    <Card.Header>Evaluaciones</Card.Header>
                                                    <Card.Body>

                                                        <Card.Text>
                                                            <CardGroup>
                                                                <Card>
                                                                    <Card.Title style={{ textAlign: 'center' }}>Aplicadas</Card.Title>
                                                                    <Card.Body>
                                                                        <h1 style={{ textAlign: 'center' }}>7</h1>

                                                                    </Card.Body>
                                                                </Card>
                                                                <Card>
                                                                    <Card.Title style={{ textAlign: 'center' }}>Pendientes</Card.Title>
                                                                    <Card.Body>
                                                                        <h1 style={{ textAlign: 'center' }}>3</h1>

                                                                    </Card.Body>
                                                                </Card>
                                                            </CardGroup>
                                                        </Card.Text>
                                                    </Card.Body>

                                                </Card>
                                                <Card>
                                                    <Card.Header>Avance del Programa</Card.Header>
                                                    <Card.Body>

                                                        <Card.Text>
                                                            <CardGroup>

                                                                <Card style={{ marginTop: '15px' }}>

                                                                    <Card.Body>
                                                                        <h1 style={{ textAlign: 'center' }}>70 %</h1>

                                                                    </Card.Body>
                                                                </Card>
                                                            </CardGroup>
                                                        </Card.Text>
                                                    </Card.Body>

                                                </Card>
                                            </CardGroup>
                                        </div>
                                    </div>


                                </Tab>
                                <Tab eventKey="citas" title="Consultas" >
                                    <div className="container">
                                        <div className="row">
                                            <div className="col col-md-12 " >
                                                <Nav className='justify-content-end'>
                                                    <NavDropdown title="Exportar" id="nav-dropdown" >
                                                        <NavDropdown.Item eventKey="4.1" onClick={(e) => { printDoc(e, 'pdf') }} ><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'red' }}><GrDocumentPdf /></i>PDF</NavDropdown.Item>
                                                        <NavDropdown.Item eventKey="4.2"><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'green' }}><GrDocumentExcel /></i>Excel</NavDropdown.Item>
                                                    </NavDropdown>
                                                </Nav>

                                            </div>
                                            <div className="col col-md-4">

                                                <table className='table table-responsive table-bordered table-sm'>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ with: '10%' }}>ID</th>
                                                            <th style={{ with: '70%' }}>Fecha</th>
                                                            <th style={{ with: '10%' }}>Status</th>
                                                            <th style={{ with: '10%' }}>Nota</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataCalendario !== undefined && dataCalendario !== [] ?

                                                            tableRender.map(data => {



                                                                return <tr key={data.idcita}>
                                                                    <td>{data.idcita}</td>
                                                                    <td>{data.fecha}</td>
                                                                    <td >{data.notaevolucion !== '' ? <p style={{ color: 'green' }}>Atendida</p> : <p style={{ color: 'red' }}>Pendiente</p>}</td>
                                                                    <td>


                                                                        <div className="col col-md-12">
                                                                            <Nav className='justify-content-end'>
                                                                                <NavDropdown title="Acción" id="nav-dropdown" >
                                                                                    <NavDropdown.Item eventKey="4.1" onClick={(e) => { actionBtns(e) }} id={'vie' + data.idcita}><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'red' }}></i>Ver</NavDropdown.Item>
                                                                                    <NavDropdown.Item eventKey="4.2" onClick={(e) => { actionBtns(e) }} id={'upd' + data.idcita}><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'green' }}></i>Editar</NavDropdown.Item>
                                                                                </NavDropdown>
                                                                            </Nav>
                                                                        </div>




                                                                    </td>
                                                                </tr>


                                                            })

                                                            : null}

                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th colSpan="6">
                                                                <nav aria-label="Page navigation example">
                                                                    <ul className="pagination">
                                                                        {renderPagination(pagNum)}
                                                                    </ul>
                                                                </nav>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>

                                            <div className="col col-md-8">
                                                <Card style={{ heigth: '100%' }}>



                                                    <Card.Body>
                                                        <div className="col col-md-12">
                                                            <h4>Nota de Evlolución:</h4>
                                                            <div className="row">

                                                                <div className="col col-md-5">
                                                                    <h6>Nombre: {`${paciente.nombre} ${paciente.apellidop} ${paciente.apellidom}`}</h6>
                                                                </div>
                                                                <div className="col col-md-3">
                                                                    <h6>Telefono: {`${paciente.telefono}`}</h6>
                                                                </div>
                                                                <div className="col col-md-4">
                                                                    <h6>Fecha: {noteData.fecha !== '' && noteData.fecha !== undefined ? `${noteData.fecha}` : ''}</h6>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </Card.Body>

                                                </Card>
                                                <Card style={{ marginTop: '10px' }}>
                                                    <Card.Body>

                                                        {editNote !== false ?
                                                            <>
                                                                <textarea className='form-control' name='notaevolucion' onChange={changeInpt} value={noteData.notaevolucion} />
                                                                <button className='btn btn-success' onClick={(e) => { btnSaveNote(e) }}>Guardar</button>
                                                            </>
                                                            : <div className="col col-md-12">
                                                                <p  >
                                                                    {noteData.notaevolucion !== '' && noteData.notaevolucion !== undefined ?
                                                                        noteData.notaevolucion : 'No existe nota seleccionada.!!'}
                                                                </p>
                                                            </div>}

                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </div>

                                    </div>
                                </Tab>
                                <Tab eventKey="evaluaciones" title="Evaluaciones" >
                                    Test
                                </Tab>
                                <Tab eventKey="observaciones" title="Observaciones" >
                                    Observaciones
                                </Tab>
                            </Tabs>

                        </Card.Body>
                        <Card.Footer>

                            <div className="col col-md-10">
                                <button className="btn btn-danger" onClick={(e) => btnBack(e)}>
                                    Salir
                                </button>
                            </div>
                        </Card.Footer>


                    </Card>


                </div>





            </div>


        </Fragment>


    )

}

export default Expediente