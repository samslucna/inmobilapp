import React, { Fragment,  useState } from 'react'

import './css/styles.css'
import './js/script.js'



import NuevoTest from './Forms/NuevoTest'


import TestsProvider from '../../../../context/TestsContext'
import Table from './Table'


const Main = ({ selectedconten }) => {


 

  const [stateView, setStateView] = useState(false)




  return (
    <Fragment>

      {stateView !== false ?

        <TestsProvider>
          <NuevoTest

            setStateView={setStateView}
          />
        </TestsProvider>


        : <div className="row" >

          <div className={"col col-md-12 card"} style={{ marginTop: '30px' }}>
            <TestsProvider>
              <Table selectedconten={selectedconten} setStateView={setStateView} />
            </TestsProvider>
          </div>


        </div>
      }








    </Fragment>


  )

}

export default Main