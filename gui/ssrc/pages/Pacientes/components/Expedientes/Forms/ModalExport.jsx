import React from 'react'
import { Modal, Col } from 'react-bootstrap'

const ModalExport = ({ show, setShow }) => {

    return (
        <>
            <Modal 
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
               {/*      <Modal.Title id="contained-modal-title-vcenter">
                        
                        <h3>Reporte Prueba</h3>
                    </Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <Col sm='12'>
                        <embed id='verPdf' type="application/pdf" width={'100%'} height='600px' />

                    </Col>
                </Modal.Body>
            
            </Modal>

        </>
    )
}


export default ModalExport