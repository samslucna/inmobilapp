import React, { Fragment } from 'react'

import '../css/styles.css'
import logoleft from '../img/logoleft.png'
import Menuheadp from '../../Components/Menuheadp'

const Catalogos = () => {


  return (



    <Fragment>

      <div className="conten-body">
      <Menuheadp />
        <div className="container">
       <div className="row fluid">
         <div className="col-2 ">
         <img src={logoleft} height='80%' />
         </div>
         <div className="col-8 text-center">

         <h3>Municipio de Tlalixtaquilla de Maldonado</h3>
         <h5>Sistema de Gestión de Indicadores de Desempeño</h5>
         <h5>Ejercicio Fiscal 2021</h5>
         </div>
         <div className="col-2 ">

         <img src={logoleft} height='80%' />

         </div>
        
       </div>
          <div className="row" key={'form'}>
            <select className="form-select" aria-label="Default select example">
              <option defaultValue={'0'}>Unidad Administrativa</option>
              <option value="0100">Presidencia Municipal</option>
              <option value="0200">Secretaria General</option>
              
            </select>
            <form>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" >Check me out</label>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>

          <div className="row" key={'table'}>
            <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John</td>
                  <td>Doe</td>
                  <td>john@example.com</td>
                </tr>
                <tr>
                  <td>Smith</td>
                  <td>Thomas</td>
                  <td>smith@example.com</td>
                </tr>
                <tr>
                  <td>Merry</td>
                  <td>Jim</td>
                  <td>merry@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>


    </Fragment>


  )

}

export default Catalogos