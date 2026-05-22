import React, { Fragment, useContext } from 'react'

import '../css/styles.css'

//import Menuheadp from '../../Components/Menuheadp'
import { useState } from 'react'
import { RenderContext } from '../../../context/RenderContext'
import Main from './Main'

import Save from './Save'
import ResponsableProvider from '../../../context/ResponsableContext'
const Inicio = () => {

  const { setSelectedPage } = useContext(RenderContext)
  
  const [selectedconten, setSelectedConten] = useState('')

  const handlerConten = () => {
    switch (selectedconten) {
      case 'save':
        return <ResponsableProvider> <Save
          setSelectedConten={setSelectedConten}
        /></ResponsableProvider>
      default:

        return <ResponsableProvider><Main
          setSelectedPage={setSelectedPage}
          setSelectedConten={setSelectedConten}

        /></ResponsableProvider>
    }

  }



  return (
    <Fragment>

    

        {handlerConten()}


    

    </Fragment>


  )

}

export default Inicio