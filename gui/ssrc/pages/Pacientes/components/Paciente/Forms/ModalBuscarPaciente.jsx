import React, { Fragment, useState } from 'react'


import { Modal, Button } from 'react-bootstrap'

const ModalBuscarPaciente = ({ setSelectedConten }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    return (
        <Fragment>
            <Button className='btn btn-secondary form-control' variant="secondary" onClick={handleShow}>
            <i className='bi bi-search'>Buscar</i>
            </Button>

            <Modal show={show} onHide={handleClose} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title> Expediente: 0</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col col-md-2">
                                imagen
                            </div>
                            <div className="col col-md-10">
                                <div className="row">
                                    <div className="col col-md-3">
                                        <h6>   Expediente: 0</h6>
                                    </div>
                                    <div className="col col-md-5">
                                        <h6>Nombre: Caritino  Maldonado N</h6>
                                    </div>
                                    <div className="col col-md-4">
                                        <h6>Telefono: 8798799423</h6>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col col-md-5">
                                        <h6>Correo: caritino@test.com</h6>
                                    </div>
                                    <div className="col col-md-7">
                                        <h6>   Direccion: calle morelos, colonia centro , tlalixtaquilla de Maldonado, Guerrero</h6>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col col-md-5">
                                        <h6>Fecha de  Ingreso: 19/11/1986</h6>
                                    </div>
                                    <div className="col col-md-7">
                                        <h6>  Motivo: Lucha social</h6>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="info" onClick={()=>{setSelectedConten('expediente')}}>
                        Mostrar expediente
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>


    )

}

export default ModalBuscarPaciente