import React, { Fragment, useContext, useEffect } from 'react'
import { ToolsContext } from '../../../../context/ToolsContext'
import { NavDropdown, Nav } from 'react-bootstrap'
import { GrDocumentPdf, GrDocumentExcel } from 'react-icons/gr'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

import { PacientesContext } from '../../../../context/PacientesContext'



const Table = ({ selectedconten, setAsingExpediente, handleClose, setStateView }) => {

  const { readDatas, deleteData, getDataByObjec } = useContext(ToolsContext)
  const { searchDatas, datasTable, pagination, activePag, pagNum, setPagNum, setDatasAuxTable, renderPagination,
    datasAuxTable, setUpdState, setDatasTable, setPaciente } = useContext(PacientesContext)



  const updateTable = async () => {
    let datas = await readDatas( 'pacientes')
    let readct = await readDatas('citas')
    let nump = Math.ceil(datas.length / pagination.limit)
    let renderaux = datas
    renderaux.map(data => {
      let cta = getDataByObjec(parseInt(data.idpaciente), readct, 'expediente')

      return data.motivo = cta.motivo
    })
    const posIndex = ((activePag - 1) * pagination.limit)
    let limit = pagination.limit * activePag
    let currentpag = renderaux.slice(posIndex, limit)
    setPagNum(nump)
    setDatasTable(datas)
    setDatasAuxTable(currentpag)
  }

  const actionBtns = async (e) => {
    e.preventDefault()

    const actiontype = (e.target.id).substr(0, 3)
    const actionid = (e.target.id).substr(-3, 3)

    if (actiontype === 'upd') {

      let getData = datasTable.filter(data => actionid === data.idpaciente.substr(-3, 3))[0]

      setPaciente({
        idpaciente: getData.idpaciente,
        nombre: getData.nombre,
        apellidop: getData.apellidop,
        apellidom: getData.apellidom,
        email: getData.email,
        telefono: getData.telefono,
        fechanacimiento: getData.fechanacimiento,
        lugarnacimiento: getData.lugarnacimiento,
        genero: getData.genero,
        estadocivil: getData.estadocivil,
        escolaridad: getData.escolaridad,
        ocupacion: getData.ocupacion,
        lugartrabajo: getData.lugartrabajo,
        direccionparticular: getData.direccionparticular,
        personacontacto: getData.personacontacto,
        personacontactoocupacion: getData.personacontactoocupacion,
        fechaingreso: getData.fechaingreso,
        expediente: getData.expediente
      })
      setUpdState({ id: getData[0], status: true })
      setStateView(true)
    } else if (actiontype === 'del') {
      if (actionid !== '' && actionid !== null) {

        let alertSave = await Swal.fire({
          title: 'Desea eliminar los datos?',
          text: "la información se perdera !",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar!'
        })

        if (alertSave.isConfirmed !== false) {

          await deleteData('pacientes', 'idpaciente', actionid)
          //console.log(' la información se elimino correctamente')
          updateTable()
          return new Swal(
            'Borrar datos!',
            'Los datos se eliminaron correctamente.',
            'info'
          )
        } else {
          console.log('No se realizo la accion')
        }

      }
    }

  }


  const btnAsignarPaciente = async (paciente) => {

    let alertSave = await Swal.fire({
      title: 'Desea seleccionar el expediente?',
      text: "Seleccionar el expediente !",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar!'
    })

    if (alertSave.isConfirmed !== false) {

      setAsingExpediente(paciente)
      handleClose()
      return new Swal(
        `Operación exitosa`,
        'El expediente se asigno correctamente.',
        'info'
      )
    } else {
      return new Swal(
        `No se realizo ninguna acción`,
        'selecciona otra  opción.',
        'info'
      )
    }

  }


  useEffect(() => {
    const goFunction = async () => {
      updateTable()
    }
    goFunction()

  }, [])

  return (

    <Fragment>



      <h3>Pacientes</h3>

      <div className="form-group">
        <div className="row">
          <div className="col col-md-4" >
            <input type="text" placeholder='Busar...' onChange={searchDatas} className='form-control' />

          </div>
          {selectedconten === 'Cita' ? null :
            <>
              <div className="col col-md-2" >
                <button className='btn btn-success form-control' onClick={(e) => { setStateView(true) }}>Nuevo Paciente</button>

              </div>
              <div className="col col-md-6">
                <div className="col col-md-12 " >
                  <Nav className='justify-content-end'>
                    <NavDropdown title="Exportar" id="nav-dropdown" >
                      <NavDropdown.Item eventKey="4.1" ><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'red' }}><GrDocumentPdf /></i>PDF</NavDropdown.Item>
                      <NavDropdown.Item eventKey="4.2"><i style={{ fontSize: '1.5rem', marginRight: '1rem', color: 'green' }}><GrDocumentExcel /></i>Excel</NavDropdown.Item>

                    </NavDropdown>
                  </Nav>

                </div>
              </div>
            </>
          }
        </div>

      </div>
      <table className='table table-responsive table-bordered table-sm'>
        <thead>
          <tr>
            <th width={'10%'}>ID</th>
            <th width={'25%'}>Nombre</th>
            {selectedconten === 'Cita' ? null : <th width={'25%'}>Fecha Ingreso</th>}
            {/*  {selectedconten === 'Cita' ?null:<th width={'10%'}>Hora</th>} */}
            {selectedconten === 'Cita' ? null : <th width={'30%'}>Motivo</th>}
            <th width={'10%'}>Accion</th>
          </tr>

        </thead>
        <tbody>

          {

            datasTable !== [] ?

              datasAuxTable.map(data => {
                return <tr key={'r' + data.idpaciente}>
                  <td>{data.idpaciente}</td>
                  <td>{data.nombre + ' ' + data.apellidop + ' ' + data.apellidom}</td>
                  {selectedconten === 'Cita' ? null : <td>{data.fechaingreso}</td>}

                  {/*   {selectedconten === 'Cita'  ?null:<td>{data.hora}</td>} */}
                  {selectedconten === 'Cita' ? null : <td>{data.motivo}</td>}
                  <td>
                    {selectedconten === 'Cita' ? <div className="btn-group">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { btnAsignarPaciente(data) }} id={'exp' + data.idpaciente}>
                        <i className="bi bi-arrow-right" id={'vie' + data.idpaciente}></i>
                      </button>
                    </div>
                      : <div className="btn-group">

                        <button type="button" className="btn btn-info btn-sm" onClick={(e) => { actionBtns(e) }} id={'upd' + data.idpaciente}>
                          <i className="bi bi-pencil-square" id={'upd' + data.idpaciente}></i>
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={(e) => { actionBtns(e) }} id={'del' + data.idpaciente}>
                          <i className="bi bi-trash-fill" id={'del' + data.idpaciente}></i>
                        </button>

                      </div>}


                  </td>
                </tr>
              })
              : null
          }
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











    </Fragment>


  )

}

export default Table