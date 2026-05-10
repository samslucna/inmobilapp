import React, { Fragment, useContext, useEffect } from 'react'
import { ToolsContext } from '../../../../context/ToolsContext'
import { NavDropdown, Nav } from 'react-bootstrap'
import { GrDocumentPdf, GrDocumentExcel } from 'react-icons/gr'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

import { PacientesContext } from '../../../../context/PacientesContext'
import { TestsContext } from '../../../../context/TestsContext'



const Table = ({ selectedconten, setAsingExpediente, handleClose, setStateView }) => {

  const { readDatas, deleteData, getDataByObjec } = useContext(ToolsContext)
  const { searchDatas, datasTable, pagNum, setDatasTable, renderPagination,
    datasAuxTable, setUpdState, updateTable } = useContext(TestsContext)


  const actionBtns = async (e) => {
    e.preventDefault()

    const actiontype = (e.target.id).substr(0, 3)
    const actionid = (e.target.id).substr(-2, 3)

    if (actiontype === 'upd') {

      let getData = datasTable.filter(data => actionid === data.idtest.substr(-2, 3))[0]

      /* setPaciente({
      }) */
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


          await deleteData('tests', 'idtest', actionid)
          let datas = await readDatas('tests')
          updateTable(datas)
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


  const btnAsignarPaciente = async () => {

    console.log(1)

  }


  useEffect(() => {
    const goFunction = async () => {

      let datas = await readDatas('tests')
      updateTable(datas)
     

    }
    goFunction()

  }, [])

  return (

    <Fragment>



      <h3>Tests de evaluaciones.</h3>

      <div className="form-group">
        <div className="row">
          <div className="col col-md-4" >
            <input type="text" placeholder='Busar...' onChange={searchDatas} className='form-control' />

          </div>

          <>
            <div className="col col-md-2" >
              <button className='btn btn-success form-control' onClick={(e) => { setStateView(true) }}>Nuevo Test</button>

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

        </div>

      </div>

      <h5>Lista de Tests</h5>
      <table className='table table-responsive table-bordered table-sm'>
        <thead>
          <tr>
            <th width={'10%'}>ID</th>
            <th width={'20%'}>Nombre</th>
            <th width={'50%'}>Descripcion</th>
            <th width={'10%'}>Accion</th>
          </tr>

        </thead>
        <tbody>

          {

            datasTable !== [] ?

              datasAuxTable.map(data => {
                return <tr key={'r' + data.idtest}>
                  <td>{data.idtest}</td>
                  <td>{data.nombre}</td>
                  <td>{data.descripcion}</td>
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => { btnAsignarPaciente(data) }} id={'exp' + data.idtest}>
                        <i className="bi bi-eye" id={'vie' + data.idtest}></i>
                      </button>
                    </div>
                    <div className="btn-group">

                      <button type="button" className="btn btn-info btn-sm" onClick={(e) => { actionBtns(e) }} id={'upd' + data.idtest}>
                        <i className="bi bi-pencil-square" id={'upd' + data.idtest}></i>
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={(e) => { actionBtns(e) }} id={'del' + data.idtest}>
                        <i className="bi bi-trash-fill" id={'del' + data.idtest}></i>
                      </button>

                    </div>


                  </td>
                </tr>
              })

              : null}
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