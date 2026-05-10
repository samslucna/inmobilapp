import React, { Fragment, useContext } from 'react'
import { FcReadingEbook, FcImport, FcPortraitMode, FcDocument } from 'react-icons/fc'
import { Nav} from 'react-bootstrap'
import '../css/styles.css'

import { useState } from 'react'
import { RenderContext } from '../../../context/RenderContext'


import Main from './Main'

import TestsProvider from '../../../context/PacientesContext'

import Tests from './Tests'



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
        return <TestsProvider><Main
        selectedconten={selectedconten}
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}
        /></TestsProvider>

      case 'tests':
        return <TestsProvider><Tests
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}
        /></TestsProvider>
 


      default:

        return <TestsProvider><Tests
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}

        /></TestsProvider>
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
                  <Nav.Link href="#" id='' onClick={(e) => navMenu(e)}><i style={{ fontSize: '1.5rem' }}><FcReadingEbook /></i>Tests de Evaluacines</Nav.Link>

                </li>
              
       
                <li className="nav-item">
                  <Nav.Link href="#" id='principal' onClick={(e) => navMenu(e)}><i style={{ fontSize: '1.5rem' }}> <FcDocument /></i>  Reportes </Nav.Link>

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