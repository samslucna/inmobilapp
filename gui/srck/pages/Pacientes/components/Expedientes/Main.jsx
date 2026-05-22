import React, { Fragment, useContext, useEffect } from 'react'
import { ToolsContext } from '../../../../context/ToolsContext'
import { Card,Button } from 'react-bootstrap'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

import { PacientesContext } from '../../../../context/PacientesContext'
import ModalExpedientePaciente from './Forms/ModalExpedientePaciente'



const Main = ({ setSelectedConten }) => {


 const {readDatas} = useContext(ToolsContext)
  const { searchDatas, datasTable,pagNum,
    renderPagination,datasAuxTable, setUpdState,setDatasTable,setdataCalendario,
    setPaciente,handleShow,updateTable,handleClose } = useContext(PacientesContext)

 
 
  const actionBtns = async (e) => {
    e.preventDefault()

    const actiontype = (e.target.id).substr(0, 3)
    const actionid = (e.target.id).substr(-3, 3)

    if (actiontype === 'vie') {

      let getData = datasAuxTable.filter(data => actionid === data.idpaciente.substr(-3, 3))[0]
     
      handleShow()
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
        expediente: getData.expediente,
        motivo: getData.motivo

      })

    } 

  }


  useEffect(() => {

    const goToFunction = async () => {

      let datas = await readDatas('pacientes')
      let ctacalendario = await readDatas('citas')
      
      setdataCalendario(ctacalendario)
      setDatasTable(datas)
      handleClose()
    }
    goToFunction()
   

  }, [])

  useEffect(() => {
    if(datasAuxTable.length <2){
      updateTable()
      console.log(1)
    }
  }, [datasTable])

  return (
    <Fragment>

      <ModalExpedientePaciente setSelectedConten={setSelectedConten} />


      <div className="row" >
        <Card>
      
          <Card.Title>
            Expedientes
          </Card.Title>
          <Card.Body>
            <div className={"col col-md-12"} style={{ marginTop: '30px' }}>

              <div className="form-group">

                <input type="text" placeholder='Busar...' onChange={searchDatas} className='form-control' />
              </div>
              <table className='table table-responsive table-bordered table-sm'>
                <thead>
                  <tr>
                    <th width={'10%'}>Expediente</th>
                    <th width={'40%'}>Nombre</th>
                    <th width={'30%'}>Motivo</th>
                    <th width={'10%'}>Ingreso</th>
                    <th width={'10%'}>Accion</th>
                  </tr>

                </thead>
                <tbody>

                  {
                    datasTable !== [] ?
                      datasAuxTable.map(data => {
                        return <tr key={data.idpaciente}>
                          <td>{data.idpaciente}</td>
                          <td>{`${data.nombre} ${data.apellidop} ${data.apellidom}`}</td>
                          <td>{data.motivo}</td>
                          <td>{data.fechaingreso}</td>
                          <td>
                            <div className="btn-group">
                              <button type="button" className="btn btn-secondary btn-sm" onClick={(e) => { actionBtns(e) }} id={'vie' + data.idpaciente}>
                                <i className="bi bi-eye" id={'vie' + data.idpaciente}></i>
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

          </Card.Body>


        </Card>




      </div>







    </Fragment>


  )

}

export default Main