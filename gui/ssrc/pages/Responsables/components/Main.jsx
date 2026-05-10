import React, { Fragment, useContext, useEffect } from 'react'
import { useState } from 'react'
import { RenderContext } from '../../../context/RenderContext'
import { ToolsContext } from '../../../context/ToolsContext'

import '../css/styles.css'
import '../js/script.js'
import imgtest from '../img/unemescapa.jpeg'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'
import { ResponsableContext } from '../../../context/ResponsableContext'

const Main = ({ setSelectedConten }) => {

  const { setSelectedPage } = useContext(RenderContext)
  const { readDatas, deleteData } = useContext(ToolsContext)
  const { searchDatas, datasTable, pagination, activePag, pagNum, setPagNum, setDatasAuxTable, renderPagination,
    datasAuxTable, setUpdState, setDatasTable, setResponsable, responsable } = useContext(ResponsableContext)

  const [viewDetail, setViewDetail] = useState(false)

  const updateTable = async () => {
    let datas = await readDatas('responsables')
    let nump = Math.ceil(datas.length / pagination.limit)
    let renderaux = datas
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

      let getData = datasTable.filter(data => actionid === data.idresponsable.substr(-3, 3))[0]
      setResponsable({
        idresponsable: getData.idresponsable,
        nombre: getData.nombre,
        apellidop: getData.apellidop,
        apellidom: getData.apellidom,
        direccion: getData.direccion,
        especialidad: getData.especialidad,
        telefono1: getData.telefono1,
        telefono2: getData.telefono2,
        email: getData.email,
        sexo: getData.sexo,
        cedula: getData.cedula
      })
      setUpdState({ id: getData[0], status: true })
      setSelectedConten('save')
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

          await deleteData('responsables', 'idresponsable', actionid)
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
    } else if (actiontype === 'vie') {

      let getData = datasTable.filter(data => actionid === data.idresponsable.substr(-3, 3))[0]
      setResponsable({
        idresponsable: getData.idresponsable,
        nombre: getData.nombre,
        apellidop: getData.apellidop,
        apellidom: getData.apellidom,
        direccion: getData.direccion,
        especialidad: getData.especialidad,
        telefono1: getData.telefono1,
        telefono2: getData.telefono2,
        email: getData.email,
        sexo: getData.sexo,
        cedula: getData.cedula
      })

      setViewDetail(true)

    }


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

  useEffect(() => {

    updateTable()

  }, [])

  return (
    <Fragment>

      <div className="container">

        <div className="row">


          <div className={viewDetail !== true ? "col col-md-12" : "col col-md-7"}>
            <h3>Especialista</h3>

            <button type="button" className="btn btn-success" onClick={() => setSelectedConten('save')}>
              Agregar Especialista
            </button>
            <div className="form-group">

              <input type="text" placeholder='Busar...' onChange={searchDatas} className='form-control' />
            </div>
            <table className='table table-responsive table-bordered table-sm'>
              <thead>
                <tr>
                  <th width={'10%'}>ID</th>
                  <th width={'30%'}>Nombre</th>
                  <th width={'30%'}>Dirección</th>
                  <th width={'10%'}>Telefono</th>
                  <th width={'10%'}>Especialidad</th>
                  <th width={'10%'}>Accion</th>
                </tr>

              </thead>
              <tbody>

                {
                  datasTable !== [] ?
                    datasAuxTable.map(data => {
                      return <tr key={'r' + data.idresponsable}>
                        <td>{data.idresponsable}</td>
                        <td>{data.nombre} {data.apellidop} {data.apellidom}</td>
                        <td>{data.direccion}</td>

                        <td>{data.telefono1}</td>
                        <td>{data.especialidad}</td>
                        <td>
                          <div className="btn-group">
                            <button type="button" className="btn btn-primary btn-sm" onClick={(e) => { actionBtns(e) }} id={'vie' + data.idresponsable}>
                              <i className="bi bi-eye" id={'vie' + data.idresponsable}></i>
                            </button>
                            <button type="button" className="btn btn-info btn-sm" onClick={(e) => { actionBtns(e) }} id={'upd' + data.idresponsable}>
                              <i className="bi bi-pencil-square" id={'upd' + data.idresponsable}></i>
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={(e) => { actionBtns(e) }} id={'del' + data.idresponsable}>
                              <i className="bi bi-trash-fill" id={'del' + data.idresponsable}></i>
                            </button>

                          </div>
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
          </div>

          {viewDetail !== false ? <div className=" card col col-md-5">
            <div className="mb-3">

              <h5  >Información Responsable </h5>
              <div className="row" style={{ marginTop: '30px' }}>

                <h5>Datos responsable </h5>
                <div className="col-md-7">
                  <h6 >Nombre:</h6>
                  <p>{responsable.nombre}</p>
                  <h6 >Apellido Paterno:</h6>
                  <p>{responsable.apellidop}</p>
                  <h6 >Apellido Materno:</h6>
                  <p>{responsable.apellidom}</p>
                </div>
                <div className="col-md-3">
                  <img width={'150px'} src={imgtest} />
                </div>
                <div className="col-md-12">
                  <h6 >Dirección:</h6>
                  <p>{responsable.direccion}</p>
                </div>
                <div className="col-md-12" >
                  <h6 >Especialidad:</h6>
                  <p>{responsable.especialidad}</p>
                </div>
                <div className="col-md-6" >
                  <h6>Telefono 1:</h6>
                  <p>{responsable.telefono1}</p>
                </div>
                <div className="col-md-6" >
                  <h6>Telefono 2:</h6>
                  <p>{responsable.telefono2}</p>
                </div>
                <div className="col-md-12" >
                  <h6 className="form-label">Sexo:</h6>
                  <p>{responsable.sexo}</p>
                </div>
                <div className="col-md-6" >
                  <h6>Correo Electronico:</h6>
                  <p>{responsable.email}</p>
                </div>
                <div className="col-md-6">
                  <h6>Cedula:</h6>
                  <p>{responsable.cedula}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <button className='btn btn-secondary' onClick={(e) => { btnClose(e) }}>Cerrar</button>
                </div>
              </div>
            </div>

          </div> : null}


        </div>

        <div className="row">
          <div className="col-md-2">
            <button className='btn btn-danger' onClick={() => { setSelectedPage('user-profile') }}>Salir</button>
          </div>
        </div>


      </div>


    </Fragment>


  )

}

export default Main