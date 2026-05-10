import React, { Fragment, useContext, useState, useEffect } from 'react'
import { ToolsContext } from '../../../../../context/ToolsContext'
import { PacientesContext } from '../../../../../context/PacientesContext'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'
import '../css/styles.css'

const NuevoPaciente = ({setStateView }) => {
    const fecha = new Date()
    let datecurrent = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`
    const [auxcita, setAuxcita] = useState({
        idcita: null,
        expediente: "",
        motivo: "",
        fecha: '',
        hora: "",
        tipocita: 1,
        status: 1,
        responsable: "",
        notaevolucion: ""
    })
    const [listResp, setListResp] = useState([])
    const renderDate = (date) => {
        date = new Date(date)
        let datemnt = date.getMonth()
        datemnt = datemnt.toString()
        if (datemnt.length !== 1) {
            return date !== null ? date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() : '-';
        } else {
            return date !== null ? date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)) + '-' + date.getDate() : '-';
        }

    }

    const { saveDatas, updateDatas, readDatas } = useContext(ToolsContext)
    const { setPaciente, updateTable,paciente, changeInpt, updState, setUpdState } = useContext(PacientesContext)

    const SaveData = async (e) => {
        e.preventDefault()
        if (paciente.idpaciente === null && paciente.nombre !== ''
            && paciente.apellidop !== ''
            && paciente.apellidom !== '') {

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

                let pte = await saveDatas('pacientes', paciente)
                let aux = parseInt(pte)
                if (!isNaN(aux)) {
                    auxcita.expediente = aux
                    let cit = await saveDatas('citas', auxcita)
                    btnCancel(e)
                    return new Swal(
                        'Guardado!',
                        'La información se guardo correctamente.',
                        'success'
                    )

                } else {
                    return new Swal(
                        'Error!',
                        'Ocurrio un  error al al agendar la cita.',
                        'warning'
                    )
                }

                console.log(auxcita)

                btnCancel(e)

                return new Swal(
                    'Guardado!',
                    'La información se guardo correctamente.',
                    'success'
                )

            } else {
                btnCancel(e)
            }

        } else if (paciente.idpaciente !== null && updState.status === true) {

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
                await updateDatas('pacientes', paciente)

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
        setPaciente({
            idpaciente: null,
            nombre: "",
            apellidop: "",
            apellidom: "",
            email: "",
            telefono: "",
            fechanacimiento: renderDate(datecurrent),
            lugarnacimiento: "",
            genero: "0",
            estadocivil: "0",
            escolaridad: "",
            ocupacion: "",
            lugartrabajo: "",
            direccionparticular: "",
            personacontacto: "",
            personacontactoocupacion: "",
            fechaingreso: renderDate(datecurrent),
            expediente: ""
        })
        setStateView(false)
        setUpdState({ id: null, status: false })
        updateTable()
    }
    const changeCitaInpt = async (e, result) => {
        e.preventDefault()
        const {
            name,
            value
        } = e.target || result

        setAuxcita({
            ...auxcita,
            [name]: value
        })


    }

    useEffect(() => {

        const listResp = async () => {
            let r = await readDatas('responsables')
            setListResp(r)
        }

        listResp()

    }, [])


    return (
        <Fragment>
            <>
                <form className="row g-3 ">

                    {updState.status !== false ? 
                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col col-md-4">
                            <label className="form-label">Nombre:</label>
                            <input type="text" value={paciente.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Apellido Paterno:</label>
                            <input type="text" value={paciente.apellidop} name='apellidop' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Apellido Materno:</label>
                            <input type="text" name='apellidom' value={paciente.apellidom} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Telefono:</label>
                            <input type="text" maxLength={10} name='telefono' value={paciente.telefono} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label >Fecha de Nacimiento:</label>
                            <input type="date" name='fechanacimiento' value={paciente.fechanacimiento} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Genero:</label>
                            <select name="genero" value={paciente.genero} onChange={(e) => { changeInpt(e) }} className="form-control">
                                <option value="">Opciones</option>
                                <option value="1">Femenino</option>
                                <option value="2">Masculino</option>
                            </select>
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Estado Civil:</label>
                            <select name="estadocivil" value={paciente.estadocivil} onChange={(e) => { changeInpt(e) }} className="form-control">
                                <option value="">Opciones</option>
                                <option value="1">Solter@</option>
                                <option value="2">Casad@</option>
                                <option value="3">Divorciad@</option>
                                <option value="4">Union libre</option>
                            </select>
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Escolaridad:</label>
                            <input type="text" name='escolaridad' value={paciente.escolaridad} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Correo Electronico:</label>
                            <input type="email" name='email' value={paciente.email} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-6">
                            <label className="form-label">Lugar de Nacimiento:</label>
                            <input type="text" name='lugarnacimiento' value={paciente.lugarnacimiento} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                        </div>
                        <div className="col col-md-2">
                            <label className="form-label">Ocupación:</label>
                            <input type="text" name='ocupacion' value={paciente.ocupacion} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-5">
                            <label className="form-label">Lugar de Trabajo:</label>
                            <input type="text" name='lugartrabajo' value={paciente.lugartrabajo} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-5">
                            <label className="form-label">Dirección Particular:</label>
                            <input type="text" name='direccionparticular' value={paciente.direccionparticular} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Persona contacto:</label>
                            <input type="text" name='personacontacto' value={paciente.personacontacto} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Ocupación Contacto:</label>
                            <input type="text" name='personacontactoocupacion' value={paciente.personacontactoocupacion} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Fecha de Ingreso:</label>
                            <input type="date" name='fechaingreso' value={paciente.fechaingreso} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                    </div>
                        : 
                        <div className="row" style={{ marginTop: '20px' }}>
                                       <div className="col col-md-4">
                            <label className="form-label">Nombre:</label>
                            <input type="text" value={paciente.nombre} name='nombre' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Apellido Paterno:</label>
                            <input type="text" value={paciente.apellidop} name='apellidop' onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Apellido Materno:</label>
                            <input type="text" name='apellidom' value={paciente.apellidom} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Telefono:</label>
                            <input type="text" maxLength={10} name='telefono' value={paciente.telefono} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label >Fecha de Nacimiento:</label>
                            <input type="date" name='fechanacimiento' value={paciente.fechanacimiento} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Genero:</label>
                            <select name="genero" value={paciente.genero} onChange={(e) => { changeInpt(e) }} className="form-control">
                                <option value="">Opciones</option>
                                <option value="1">Femenino</option>
                                <option value="2">Masculino</option>
                            </select>
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Estado Civil:</label>
                            <select name="estadocivil" value={paciente.estadocivil} onChange={(e) => { changeInpt(e) }} className="form-control">
                                <option value="">Opciones</option>
                                <option value="1">Solter@</option>
                                <option value="2">Casad@</option>
                                <option value="3">Divorciad@</option>
                                <option value="4">Union libre</option>
                            </select>
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Escolaridad:</label>
                            <input type="text" name='escolaridad' value={paciente.escolaridad} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-3">
                            <label className="form-label">Correo Electronico:</label>
                            <input type="email" name='email' value={paciente.email} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-6">
                            <label className="form-label">Lugar de Nacimiento:</label>
                            <input type="text" name='lugarnacimiento' value={paciente.lugarnacimiento} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />

                        </div>
                        <div className="col col-md-2">
                            <label className="form-label">Ocupación:</label>
                            <input type="text" name='ocupacion' value={paciente.ocupacion} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-5">
                            <label className="form-label">Lugar de Trabajo:</label>
                            <input type="text" name='lugartrabajo' value={paciente.lugartrabajo} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-5">
                            <label className="form-label">Dirección Particular:</label>
                            <input type="text" name='direccionparticular' value={paciente.direccionparticular} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Persona contacto:</label>
                            <input type="text" name='personacontacto' value={paciente.personacontacto} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Ocupación Contacto:</label>
                            <input type="text" name='personacontactoocupacion' value={paciente.personacontactoocupacion} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                        <div className="col col-md-4">
                            <label className="form-label">Fecha de Ingreso:</label>
                            <input type="date" name='fechaingreso' value={paciente.fechaingreso} onChange={(e) => { changeInpt(e) }} className="form-control" placeholder="" />
                        </div>
                            <h5>Programación de Cita</h5>
                            <div className="col col-md-4">
                                <label className="form-label">Fecha Cita:</label>
                                <input type="date" name='fecha' value={auxcita.fecha} onChange={(e) => { changeCitaInpt(e) }} className="form-control" placeholder="" />

                            </div>
                            <div className="col col-md-4">
                                <label className="form-label">Hora:</label>
                                <input type="time" name='hora' value={auxcita.hora} onChange={(e) => { changeCitaInpt(e) }} className="form-control" placeholder="" />

                            </div>
                            <div className="col col-md-4">
                                <label className="form-label">Especialista:</label>
                                <select name="responsable" value={auxcita.responsable} onChange={(e) => { changeCitaInpt(e) }} className="form-control">
                                    <option value="">Opciones</option>
                                    {listResp.map(data => {
                                        return <option value={data.idresponsable} key={data.idresponsable}>{data.nombre}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col col-md-5">
                                <label className="form-label">Motivo:</label>
                                <textarea type="text" name='motivo' value={auxcita.motivo} onChange={(e) => { changeCitaInpt(e) }} className="form-control" placeholder="" />
                            </div>
                        </div>}


                    <div className="col col-md-6" style={{ marginTop: '45px', marginBottom: '15px' }}>
                        <button type="button" className="btn btn-success" onClick={(e) => SaveData(e)} >Guardar</button>
                        <button type="button" className="btn btn-danger" onClick={(e) => btnCancel(e)}>Cancelar</button>
                    </div>
                </form>
            </>
        </Fragment>


    )

}

export default NuevoPaciente