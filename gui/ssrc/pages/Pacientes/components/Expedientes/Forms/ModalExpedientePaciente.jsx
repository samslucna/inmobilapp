import React, { Fragment, useContext,useEffect } from 'react'
import { useState } from 'react'


import { Modal, Button } from 'react-bootstrap'
import { PacientesContext } from '../../../../../context/PacientesContext'

const ModalExpedientePaciente = ({ setSelectedConten }) => {

const {handleClose,show,paciente} =useContext(PacientesContext)




    return (
        <Fragment>
            

            <Modal show={show} onHide={handleClose} size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title> Expediente: {paciente.idpaciente}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col col-md-2">
                               
                                <img />
                            </div>
                            <div className="col col-md-10">
                                <div className="row">
                                  
                                    <div className="col col-md-6">
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
                                        <h6>   Direccion: {`${paciente.direccionparticular} `}</h6>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col col-md-5">
                                        <h6>Fecha de  Ingreso: {`${paciente.fechaingreso} `}</h6>
                                    </div>
                                    <div className="col col-md-7">
                                        <h6>  Motivo: {`${paciente.motivo} `}</h6>
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

export default ModalExpedientePaciente