import React, { Fragment, useContext } from 'react'
import { FcReadingEbook, FcImport, FcPortraitMode, FcDocument } from 'react-icons/fc'
import { Nav} from 'react-bootstrap'
import '../css/styles.css'


import { useState } from 'react'
import { RenderContext } from '../../../context/RenderContext'


import Main from './Main'

import PacientesProvider from '../../../context/PacientesContext'
import Paciente from './Paciente'
import Expedientes from './Expedientes'
import Expediente from './Expedientes/Forms/Expediente'


const Inicio = () => {

  const { setSelectedPage } = useContext(RenderContext)

  const [selectedconten, setSelectedConten] = useState('')

  const navMenu = (e) => {
    e.preventDefault()

    setSelectedConten(e.target.id)
  }

  const handlerConten = () => {
    switch (selectedconten) {

      case 'principal':
        return <PacientesProvider><Main
        selectedconten={selectedconten}
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}
        /></PacientesProvider>

      case 'pacientes':
        return <PacientesProvider><Paciente
          setSelectedConten={setSelectedConten}
        /></PacientesProvider>

      case 'expedientes':
        return <PacientesProvider><Expedientes
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}
        /></PacientesProvider>
 
      case 'expediente':
        return <PacientesProvider><Expediente
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}
        /></PacientesProvider>

      default:

        return <PacientesProvider><Expedientes
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}

        /></PacientesProvider>
    }

  } 

  return (
    <Fragment>
     <header className="navbar  sticky-top  flex-md-nowrap p-0 shadow" style={{background:'white'}}>
        <h4 className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">UnemeCapa</h4>
        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <a className="nav-link px-3" href="#" id='' onClick={(e) => navMenu(e)}>Sign out</a>
          </div>
        </div>
      </header>
      <div className="conainer-fluid">
        <div className="row">
    
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Nav.Link href="#" id='' onClick={(e) => navMenu(e)}><i style={{ fontSize: '1.5rem' }}><FcReadingEbook /></i>Expedientes</Nav.Link>

                </li>
              
                <li className="nav-item">

                  <Nav.Link href="#" id='pacientes' onClick={(e) => navMenu(e)}><i style={{ fontSize: '1.5rem' }}><FcPortraitMode /></i>Admin. Pacientes</Nav.Link>

                </li>

                <li className="nav-item">
                  <Nav.Link href="#" id='expediente' onClick={(e) => navMenu(e)}><i style={{ fontSize: '1.5rem' }}> <FcDocument /></i>  Reportes </Nav.Link>

                </li>
                <li className="nav-item">
                  <Nav.Link href="#" onClick={() => { setSelectedPage('user-profile') }}><i style={{ fontSize: '1.5rem' }}> <FcImport /></i>  Salir </Nav.Link>

                </li>
              </ul>

            </div>
          </nav>
          
          <div className="col col-md-10">
            <div className="container ">

              {handlerConten()}

            </div>
          </div>


        </div>

      </div>



    </Fragment>


  )

}

export default Inicio