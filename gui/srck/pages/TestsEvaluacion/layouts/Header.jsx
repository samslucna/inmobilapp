import React from 'react'

import logounemescapa from '../img/unemescapa.jpeg'
const Header = () => {


    return (

        <>
            <div className="row" >

                <div className=" col col-md-12" >
                    <nav className="navbar navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">
                                <img src={logounemescapa} alt="unemespacpaimg" width="30" height="24" className="d-inline-block align-text-top" />
                                UnemesCapa San Marcos
                            </a>
                        </div>
                    </nav>
                </div>

            </div>
        </>

    )

}

export default Header