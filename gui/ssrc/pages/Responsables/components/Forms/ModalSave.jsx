import React, { Fragment, useContext } from 'react'
import { ToolsContext } from '../../../../context/ToolsContext'

import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/dist/sweetalert2.css'

const ModalSave = ({ updateTable, updState, responsable, setResponsable,setUpdState}) => {

  const { saveDatas, datahost,updateDatas } = useContext(ToolsContext)

  const changeInpt = async (e, result) => {
    e.preventDefault()
    const { name, value } = e.target || result

    setResponsable({
      ...responsable,
      [name]: value
    })


  }



  const SaveData = async () => {

    let urlSave = 'http://' + datahost.hostname + '/' + datahost.page + '/save.php'
    let urlUpdate = 'http://' + datahost.hostname + '/' + datahost.page + '/update.php'


    if (responsable.idresponsable === null && responsable.nombre !== '' && responsable.apellidop !== '' && responsable.apellidom) {

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

        await saveDatas(urlSave, 'responsables', responsable)
        updateTable()
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

   
        return new Swal(
          'Guardado!',
          'La información se guardo correctamente.',
          'success'
        )
      } else {
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
      }

    } else if (responsable.idresponsable !== null && updState.status === true) {
     await updateDatas(urlUpdate,'responsables',responsable)
     updateTable()
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
    setUpdState({ id: null, status: false})
    }

    updateTable()

  }

  return (



    <Fragment>

      <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Agregar Responsable
      </button>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Nuevo responsable</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="form-control mb-3">


                <div className="row" style={{ marginTop: '30px' }}>

                  <h5>Datos responsable </h5>
                  <div className="col-md-9">
                    <label className="form-label">Nombre:</label>
                    <input type="text" value={responsable.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                    <label className="form-label">Apellido Paterno:</label>
                    <input type="text" value={responsable.apellidop} name='apellidop' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                    <label className="form-label">Apellido Materno:</label>
                    <input type="text" name='apellidom' value={responsable.apellidom} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                  </div>
                  <div className="col-md-3">
                    <div className="card" style={{ width: "18rem" }}>
                      {/* <img src="#" className="card-img-top" alt="..." />
                      <div className="card-body">
                        <div className="mb-3">
                          <input className="form-control form-control-sm" id="formFileSm" type="file" />
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Dirección:</label>
                    <input type="text" name='direccion' value={responsable.direccion} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                  </div>
                  <div className="col-md-4" >
                    <label className="form-label">Especialidad:</label>
                    <input type="text" name='especialidad' value={responsable.especialidad} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                  </div>
                  <div className="col-md-4" >
                    <label className="form-label">Telefono 1:</label>
                    <input type="text" name='telefono1' value={responsable.telefono1} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                  </div>
                  <div className="col-md-4" >
                    <label className="form-label">Telefono 2:</label>
                    <input type="text" name='telefono2' value={responsable.telefono2} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                  </div>
                  <div className="col-md-4" style={{ marginTop: '30px' }}>
                    <label className="form-label">Sexo:</label>
                    <select className="form-control" name='sexo' value={responsable.sexo} onChange={(e) => { changeInpt(e) }}>
                      <option defaultValue={null}> Opciones</option>
                      <option value={1}>Masculino</option>
                      <option value={0}>Femenino</option>
                    </select>
                  </div>
                  <div className="col-md-4" style={{ marginTop: '30px' }}>
                    <label className="form-label">Correo Electronico:</label>
                    <input type="text" name='email' value={responsable.email} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                  </div>
                  <div className="col-md-4" style={{ marginTop: '30px' }}>
                    <label className="form-label">Cedula:</label>
                    <input type="text" name='cedula' value={responsable.cedula} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                  </div>

                </div>

              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" onClick={(e) => { SaveData(e) }} data-bs-dismiss="modal" className="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>


    </Fragment>


  )

}

export default ModalSave