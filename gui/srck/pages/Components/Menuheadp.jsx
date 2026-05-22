import React, { Fragment, useContext } from 'react'


import logo from './img/logoleft.png'
import { RenderContext } from '../../context/RenderContext'
const Menuheadp = ({setSelectedPage}) => {

    const { configdata } = useContext(RenderContext)

    const getId = async (e) => {

        setSelectedPage(e.target.id)
    }

    return (

        <Fragment>
            <nav style={{ marginBottom: '20px' }} className="navbar navbar-expand-lg navbar-light bg-light " id="headerNav">
                <div className="container-fluid">


                    <ul className="nav nav-tabs flex-column">
               
                        <li className="nav-item">
                            <a className="nav-link" id='main' onClick={(e)=>{getId(e)}} aria-current="page" href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id='responsables' onClick={(e)=>{getId(e)}} aria-current="page" href="#">Responsables</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id='pacientes' onClick={(e)=>{getId(e)}} aria-current="page" href="#">Pacientes</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Contatos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Consultas</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Test</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Agenda</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Citas</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Bitacoras</a>
                        </li>

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Repotes</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Expedientes</a></li>
                                <li><a className="dropdown-item" href="#">Pacientes</a></li>
                                <li><a className="dropdown-item" href="#">Reporte N</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Otros reportes</a></li>
                            </ul>
                        </li>
        
                        <li className="nav-item">
                            <a className="nav-link" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>


                </div>
            </nav>
        </Fragment>


    )

}

export default Menuheadp