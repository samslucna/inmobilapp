
import React, { Fragment,useContext } from 'react'
import { useState } from 'react'

import '../css/styles.css'
import logoMunicipio from '../img/logoleft.png'

import { RenderContext } from '../../../../context/RenderContext'


const LoginFrm = () => {

  const { setSelectedPage} = useContext(RenderContext)


  const [configdata] = useState({
    razonsocial: 'Tlalixtaquilla de Maldonado',
    url_img:''
  })




  return (

    <Fragment>
      <div className="parentwrapper">
        <div className="wrapper fadeInDown">
          <div id="formContent">

            <div className="fadeIn first">
              <img src={logoMunicipio} id="icon" alt="User Icon" />
              <h3>{configdata.razonsocial}</h3>
            </div>

            <form>
              <input type="text" id="login" className="fadeIn second" name="login" placeholder="usuario" />
              <input type="text" id="password" className="fadeIn third" name="login" placeholder="contraseña" />
              <input type="button" onClick={()=>{ setSelectedPage('catalogos')}} className="fadeIn fourth" value="Log In" />
            </form>

            <div id="formFooter">
              <a className="underlineHover" href="/" >itpuertadeoro.dev</a>
            </div>

          </div>
        </div>

      </div>
    </Fragment >

  )

}

export default LoginFrm