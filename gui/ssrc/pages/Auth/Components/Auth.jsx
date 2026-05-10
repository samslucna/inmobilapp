import React, { Fragment,useContext} from 'react'


import {RenderContext} from '../../../context/RenderContext'

function Auth() {

    const {handlerPage } = useContext(RenderContext)

 

    return (
        <Fragment>
              
                  {handlerPage()}
              
        </Fragment>
    )


}

export default Auth