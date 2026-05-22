import React, { Fragment, useContext, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ToolsContext } from '../../../../../context/ToolsContext'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'
import '../css/styles.css'
import { TestsContext } from '../../../../../context/TestsContext'
import ModalAddQuestion from './ModalAddQuestion'


const NuevoTest = ({ setStateView }) => {
    // reparar la vista del input editar para enviar a actualiar, 
    //configurar los alert correspondientes

    const { saveDatas, updateDatas, readDatas } = useContext(ToolsContext)
    const { updateTable, testEv, changeInpt, updState,
        guardarPregunta, setListResponse, setUpdState, setDatasTable, datasTable } = useContext(TestsContext)
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false)


    const handleClose = () => {
        setShow(false)
        guardarPregunta(
            {
                idpregunta: null,
                pregunta: "",
                valor: "",
                tipo: '',
                testid: ""

            })
        setListResponse([])
        setEdit(false)

    }
    const handleShow = () => setShow(true);
    const [objSaved, setObjSaved] = useState({})

    const [editQuestion, setEditQuestion] = useState(false)
    const [listQuestion, setListQuestion] = useState([])

    const SaveData = async (e) => {
        e.preventDefault()
        if (testEv.idtest === null && testEv.nombre !== ''
            && testEv.descripcion !== '') {

            let alertSave = await Swal.fire({
                title: 'Desea guardar los cambios?',
                text: "Podra editar los datos despues!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar!'
            })

            if (alertSave.isConfirmed !== false) {
                let id = await saveDatas('tests', testEv)

                let aux = parseInt(id)
                if (!isNaN(aux)) {
                    testEv.idtest = aux
                    setObjSaved(testEv)
                    let datas = await readDatas('tests')
                    updateTable(datas)
                    setDatasTable(datas)
                    return new Swal(
                        'Guardado!',
                        'La información se guardo correctamente.',
                        'success'
                    )
                } else {
                    return new Swal(
                        'Error!',
                        'Ocurrio un  error al registrar la informacion',
                        'warning'
                    )
                }
            } else {
                btnCancel(e)
            }

        } else if (testEv.idtest !== null && updState.status === true) {

            let alertupd = await Swal.fire({
                title: 'Desea guardar los cambios?',
                text: "Podra editar los datos despues!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar!'
            })
            if (alertupd.isConfirmed !== false) {
                //await updateDatas('testEvs', testEv)

                btnCancel(e)

                return new Swal(
                    'El registro se actualizo correctamente!',
                    'La información se guardo correctamente.',
                    'success'
                )
            }

        }


    }

    const btnCancel = (e) => {
        e.preventDefault()

        setStateView(false)
        setUpdState({ id: null, status: false })
        setDatasTable(datasTable)
    }

    const btnCancelEdit = (e) => {
        e.preventDefault()
        setEditQuestion(false)
    }

    const editTest = (e) => {
        e.preventDefault()
        setEditQuestion(true)
    }

    const addListQuestion = (e, pregunta) => {
        e.preventDefault()
        console.log(pregunta)
        let question = renderResponse(pregunta)
        if (question !== undefined) {
            setListQuestion([...listQuestion, question])
            setShow(false)
        }


    }

    const renderResponse = (pregunta) => {
        switch (pregunta.tipo) {

            case '1':
                return { pregunta: pregunta.pregunta, respuestas: ['si (  )', 'no (  )'] }
            default:
                break
        }

    }


    return (
        <Fragment>
            <div className="row" >
                <div style={{ marginTop: '20px' }} className={updState.status !== true ? "col col-md-12  card" : "col col-md-12  card"}>

                    <h5 style={{ marginTop: '20px' }}> {updState.status !== true ? 'Nuevo Test' : 'Actualizar Test'} </h5>
                    <form className="row g-3 ">
                        {testEv.idtest === '' || testEv.idtest === null ?

                            <div className="row" style={{ marginTop: '20px' }}>

                                <div className="col col-md-2">
                                    <label className="form-label">Nombre:</label>
                                    <input type="text" value={testEv.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                                </div>
                                <div className="col col-md-4">
                                    <label className="form-label">Descripcion:</label>
                                    <input type="text" value={testEv.descripcion} name='descripcion' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                                </div>
                                <div className="col col-md-6" style={{ marginTop: '30px', marginBottom: '15px' }}>
                                    <button type="button" className="btn btn-success" onClick={(e) => SaveData(e)} >Guardar</button>
                                    <button type="button" className="btn btn-danger" onClick={(e) => btnCancel(e)}>Cancelar</button>
                                </div>

                            </div>

                            :

                            editQuestion !== true ?
                                <div className="row" style={{ marginTop: '20px' }}>

                                    <div className="col col-md-2">
                                        <label className="form-label">Nombre:</label>
                                        <input type="text" value={testEv.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" style={{ background: 'gray', color: 'white' }} readOnly />
                                    </div>
                                    <div className="col col-md-4">
                                        <label className="form-label">Descripcion:</label>
                                        <input type="text" value={testEv.descripcion} name='descripcion' onChange={(e) => { changeInpt(e) }} className="form-control" style={{ background: 'gray', color: 'white' }} readOnly />
                                    </div>
                                    <div className="col col-md-6" style={{ marginTop: '30px', marginBottom: '15px' }}>
                                        <button type="button" className="btn btn-primary" onClick={(e) => editTest(e)} >Editar</button>

                                    </div>

                                </div>

                                : <div className="row" style={{ marginTop: '20px' }}>

                                    <div className="col col-md-2">
                                        <label className="form-label">Nombre:</label>
                                        <input type="text" value={testEv.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" />
                                    </div>
                                    <div className="col col-md-4">
                                        <label className="form-label">Descripcion:</label>
                                        <input type="text" value={testEv.descripcion} name='descripcion' onChange={(e) => { changeInpt(e) }} className="form-control" />
                                    </div>
                                    <div className="col col-md-6" style={{ marginTop: '30px', marginBottom: '15px' }}>
                                        <button type="button" className="btn btn-danger" onClick={(e) => btnCancelEdit(e)}>Cancelar</button>
                                    </div>

                                </div>




                        }




                        <div className="col col-md-12" style={{ marginBottom: '15px' }}>

                        </div>
                    </form>


                </div>
            </div>

            <div className="row" >
                <div style={{ marginTop: '20px' }} className={updState.status !== true ? "col col-md-12  card" : "col col-md-12  card"}>

                    <h5 style={{ marginTop: '20px' }}> {updState.status !== true ? 'Preguntas' : 'Actualizar Preguntas'} </h5>
                    <div className="col col-md-2" style={{ marginBottom: '15px' }}>
                        <Button className='btn btn-secondary form-control' variant="secondary" onClick={handleShow}>
                            <i className='bi bi-plus'></i>
                        </Button>

                        <ModalAddQuestion
                            objSaved={objSaved}
                            addListQuestion={addListQuestion}
                            handleClose={handleClose}
                            show={show}
                            edit={edit}
                            setEdit={setEdit}
                        />
                    </div>

                    <div className="row" style={{ marginTop: '20px' }}>

                        <div className="col col-md-12">
                            {
                                listQuestion.map((quest, i) => {
                                    return <>
                                        <h6 key={i}>{i + 1}{'. ' + quest.pregunta}</h6>

                                        {quest.respuestas.map(resp => {
                                            return <p>{resp}</p>
                                        })}

                                    </>
                                })
                            }

                        </div>
                        <div className="col col-md-12">


                        </div>

                    </div>




                </div>



            </div>

            <div className="col col-md-6" style={{ marginTop: '30px', marginBottom: '15px' }}>
                <button type="button" className="btn btn-danger" onClick={(e) => btnCancel(e)}>Salir</button>
            </div>
        </Fragment>


    )

}

export default NuevoTest