import React, { Fragment, useContext } from 'react'
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/dist/sweetalert2.css'
import '../css/styles.css'
import { ResponsableContext } from '../../../context/ResponsableContext'
import { ToolsContext } from '../../../context/ToolsContext'



const Save = ({ setSelectedConten }) => {

  const { responsable, setResponsable, setUpdState, updState } = useContext(ResponsableContext)
  const { saveDatas, updateDatas } = useContext(ToolsContext)


  const changeInpt = async (e, result) => {
    e.preventDefault()
    const { name, value } = e.target || result

    setResponsable({
      ...responsable,
      [name]: value
    })


  }

  const SaveData = async () => {


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

        await saveDatas('responsables', responsable)

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

        setSelectedConten('')
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
        await updateDatas('responsables', responsable)

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
        setUpdState({ id: null, status: false })

        setSelectedConten('')
        return new Swal(
          'El registro se actualizo correctamente!',
          'La información se guardo correctamente.',
          'success'
        )
      }

    }


  }

  //limpiar inputs responsable
  const btnCancel = (e) => {
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
    setUpdState({ id: null, status: false })

    setSelectedConten('') 

  }

  return (
    <Fragment>

      <div className="form-control mb-3">

        <h5  > {updState.status !== true ? 'Nuevo Especialista' : 'Actualizar Especialista'} </h5>
        <div className="row" style={{ marginTop: '30px' }}>

          <h5>Datos Especialista </h5>
          <div className="col-md-9">
            <label className="form-label">Nombre:</label>
            <input type="text" value={responsable.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
            <label className="form-label">Apellido Paterno:</label>
            <input type="text" value={responsable.apellidop} name='apellidop' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
            <label className="form-label">Apellido Materno:</label>
            <input type="text" name='apellidom' value={responsable.apellidom} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
          </div>
          <div className="col-md-3">

            <div className="mb-3">
              <input className="form-control form-control-sm" id="formFileSm" type="file" />


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

      <div className="">
        <button type="button" onClick={(e) => {btnCancel(e)} } className="btn btn-danger" >Cancelar</button>
        <button type="button" onClick={(e) => { SaveData(e) }} className="btn btn-primary">Guardar</button>
      </div>


    </Fragment>


  )

}

export default Save