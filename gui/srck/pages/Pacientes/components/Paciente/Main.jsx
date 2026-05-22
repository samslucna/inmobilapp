import React, { Fragment, useContext, useEffect, useState } from 'react'

import { ToolsContext } from '../../../../context/ToolsContext'

import './css/styles.css'
import './js/script.js'

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

import NuevoPaciente from './Forms/NuevoPaciente'
import Calendario from '../../../../Components/Property/components/AgendarCita/Forms/Calendario.jsx'
import { PacientesContext } from '../../../../context/PacientesContext'
import Table from './Table'



const Main = ({ selectedconten }) => {


  const { readDatas } = useContext(ToolsContext)
  const { updateTable, updState, setDatasTable, setdataCalendario, dataCalendario,
    listDataAgenda } = useContext(PacientesContext)

  const [stateView, setStateView] = useState(false)

  useEffect(() => {

    const goToFunction = async () => {

      let datas = await readDatas('pacientes')
      let ctacalendario = await readDatas('citas')
      setDatasTable(datas)
      setdataCalendario(ctacalendario)

    }
    goToFunction()


  }, [])

  useEffect(() => {
    if (dataCalendario.length <= 1) {
      updateTable()
    }
  }, [dataCalendario])

  return (
    <Fragment>

      {stateView !== false ?
        <div className="row" >
          <div style={{ marginTop: '20px' }} className={updState.status !== true ? "col col-md-8  card" : "col col-md-12  card"}>

            <h5 style={{ marginTop: '20px' }}> {updState.status !== true ? 'Nuevo Paciente' : 'Actualizar Paciente'} </h5>
            <NuevoPaciente

              setStateView={setStateView}
            />
          </div>

          {updState.status !== true ?
            <div style={{ marginTop: '30px' }} className="col col-md-4  card">


              <h5 style={{ marginTop: '30px' }}> Calendario </h5>


              <Calendario listDataAgenda={listDataAgenda} />


            </div>
            : null}



        </div>

        : <div className="row" >

          <div className={"col col-md-12 card"} style={{ marginTop: '30px' }}>

            <Table selectedconten={selectedconten} setStateView={setStateView} />
          </div>


        </div>
      }








    </Fragment>


  )

}

export default Main