import React, { Fragment, useState, useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { ToolsContext } from '../../../../../context/ToolsContext'
import { TestsContext } from '../../../../../context/TestsContext'
import QuestionMultiple from './QuestionMultiple'
const ModalAddQuestion = ({ objSaved, addListQuestion,handleClose,show,edit,setEdit }) => {
    const { saveDatas, updateDatas, readDatas } = useContext(ToolsContext)
    const { setListResponse, pregunta, guardarPregunta } = useContext(TestsContext)
 
    const changeInpt = async (e, result) => {
        e.preventDefault()
        const {
            name,
            value
        } = e.target || result

        pregunta.testid = objSaved.idtest
        guardarPregunta({
            ...pregunta,
            [name]: value
        })

        if (name === 'tipo') {
            setListResponse([])
        }


    }

    const handlerQuestion = (typeQuestion) => {

        switch (typeQuestion) {
            case '1':
                return null

                break;

            case '2':

                return <QuestionMultiple edit={edit} setEdit={setEdit} />


            case '3':

                break;



            default:
                break;
        }

    }

    return (
        <Fragment>
            {/* <Button className='btn btn-secondary form-control' variant="secondary" onClick={handleShow}>
                <i className='bi bi-plus'></i>
            </Button>
 */}
            <Modal show={show} onHide={handleClose} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar pregunta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col col-md-6">
                                <label className="form-label">Pregunta:</label>
                                <input type="text" name='pregunta' onChange={changeInpt} value={pregunta.pregunta} className="form-control" />
                            </div>


                            <div className="col col-md-3">

                                <label className="form-label">Tipo de Respuesta:</label>

                                <select name='tipo' onChange={changeInpt} value={pregunta.tipo} className="form-control">
                                    <option value='0'>Opciones</option>
                                    <option value='1'>Si/No</option>
                                    <option value="2">Multiple</option>
                                    <option value="3">Abierta</option>
                                    <option value="4">Otro</option>
                                </select>

                            </div>

                            <div className="col col-md-3" style={{ marginTop: '30px' }}>
                                <Button variant="success" onClick={(e) => { addListQuestion(e, pregunta) }}>
                                    Agregar
                                </Button>
                            </div>


                        </div>
                        <>

                            <div className="row">
                                {handlerQuestion(pregunta.tipo)}
                            </div>
                        </>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="success" onClick={(e) => { addListQuestion(e, pregunta) }}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>


    )

}

export default ModalAddQuestion