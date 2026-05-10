import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react'
import { RenderContext } from '../../../../../context/RenderContext'
import { ToolsContext } from '../../../../../context/ToolsContext'
import { CitasContext } from '../../../../../context/CitasContext'
import ModalBuscarPaciente from './ModalBuscarPaciente'



//import Swal from 'sweetalert2/dist/sweetalert2.js'
//import 'sweetalert2/dist/sweetalert2.css'

const PacienteRutina = ({ setSelectedConten }) => {

    const { setSelectedPage } = useContext(RenderContext)
    const { readDatas, deleteData } = useContext(ToolsContext)
    const { setResponsable, responsable } = useContext(CitasContext)

    const [viewDetail, setViewDetail] = useState(false)

    const changeInpt = async (e, result) => {
        e.preventDefault()
        const { name, value } = e.target || result

        setResponsable({
            ...responsable,
            [name]: value
        })


    }




    const btnClose = (e) => {
        e.preventDefault()
        setResponsable({
            idresponsable: null,
            nombre: "",
            apellidop: "",
            apellidom: "",
            direccion: "",
            especialidad: "",
            telefono1: "",
            telefono2: "",
            email: "",
            sexo: "",
            cedula: ""
        })

        setViewDetail(false)


    }



    return (
        <Fragment>
            <div className="col col-md-3 ">
            <button className='btn btn-secondary form-control' ><i className='bi bi-search'>Buscar</i></button>

<ModalBuscarPaciente />
            </div>
            <div style={{ marginTop: '30px' }} className="form-control">

                <h5  >Información del Paciente</h5>
                <div className="row" >

                    <h5>Registar Cita </h5>
                    <div className="col-md-7">
                        <h6 style={{ marginTop: '30px' }}>Expediente:</h6>
                        <p>{responsable.nombre}</p>
                        <h6 >Nombre del Paciente:</h6>
                        <p>{responsable.nombre}</p>
                 
                    </div>
                
                    <div className="col-md-12" >
                        <h6 >Fecha:</h6>
                        <input type='date' className='form-control' name='fecha' />
                    </div>
                    <div className="col-md-12" style={{ marginTop: '30px' }}>
                        <h6 >Hora:</h6>
                        <input type='time' className='form-control' name='hora' />
                    </div>
                 
                    <div className="col-md-12" style={{ marginTop: '30px' }}>
                        <h6 className="form-label">Motivo:</h6>
                        <textarea type='text' name='motivo'  className='form-control' />
                    </div>
                 </div>
          
            </div>
        </Fragment>


    )

}

export default PacienteRutina