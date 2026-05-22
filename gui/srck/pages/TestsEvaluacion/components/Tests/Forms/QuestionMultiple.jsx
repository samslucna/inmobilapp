import React, { useContext } from 'react'

import { ToolsContext } from '../../../../../context/ToolsContext'
import { TestsContext } from '../../../../../context/TestsContext'
import { useState } from 'react'
const QuestionMultiple = () => {
    const { saveDatas, updateDatas, readDatas } = useContext(ToolsContext)
    const { updateTable, updState, setUpdState, guardarRespuesta, respuesta, listResponse,
        setListResponse } = useContext(TestsContext)

    //configurar edicion de la tabla para actualizar los datos
    //guardar en base de datos respuestas segun preguntas
    //reparar la paginacion de la tabla
    const [edit, setEdit] = useState(false)

    const addResponse = (e) => {
        e.preventDefault()

        if (respuesta.consecutivo === '') {
            setListResponse([...listResponse, respuesta])
            cleanForm()
        } else {
            let newlist = listResponse.map(data => {
                if (data.consecutivo === respuesta.consecutivo) {
                    data = respuesta
                    return data
                }
                return data
            })
            setListResponse(newlist)
            setEdit(false)
            cleanForm()
        }
    }

    const changeInpt = (e) => {
        e.preventDefault()
        const { name, value } = e.target

        guardarRespuesta({
            ...respuesta,
            [name]: value
        })
    }

    const cleanForm = () => {
        guardarRespuesta({
            idtrespuesta: null,
            clave: "",
            consecutivo: "",
            respuesta: "",
            valor: 0,
            preguntaid: ""
        })
    }

    const deleteItem = (e) => {
        e.preventDefault()
        const { id } = e.target

        let del = listResponse.filter(data => parseInt(data.consecutivo) !== parseInt(id))

        setListResponse(del)
    }

    const updItem = (e, data) => {

        e.preventDefault()

        guardarRespuesta(data)
        setEdit(true)

    }

    return (
        <>
            <div className="row">
            <div className="col col-md-12">
                                    <label className="form-label">Captura Respuestas:</label>
                                </div>
                <div className="col col-md-2">
                    <label className="form-label">Clave:</label>
                    <input type="text" name='clave' value={respuesta.clave} onChange={changeInpt} className="form-control" placeholder="" />
                </div>
                <div className="col col-md-4">
                    <label className="form-label">Respuesta:</label>
                    <input type="text" name='respuesta' value={respuesta.respuesta} onChange={changeInpt} className="form-control" placeholder="" />
                </div>
                <div className="col col-md-2">
                    <label className="form-label">Valor:</label>
                    <input type="text" name='valor' value={respuesta.valor} onChange={changeInpt} className="form-control" placeholder="" />
                </div>

                <div className="col col-md-2" style={{ marginTop: '30px' }}>
                    {edit !== true ?
                        <button className='btn btn-secondary' onClick={(e) => { addResponse(e) }}><i className='bi bi-plus' onClick={(e) => { addResponse(e) }}></i></button>
                        : <button className='btn btn-success' onClick={(e) => { addResponse(e) }}><i className='bi bi-save' onClick={(e) => { addResponse(e) }}></i></button>
                    }
                </div>

            </div>

            <div className="row" style={{ marginTop: '30px' }}>
                <h5>Lista de Respuestas</h5>
                <table className='table table-sm table-bordered table-responsive'>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Respuesta</th>
                            <th>Valor</th>
                            <th style={{ with: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listResponse.map((resp, i) => {
                            resp.consecutivo = i + 1
                            return <tr key={resp.consecutivo}>
                                <td>{resp.consecutivo}</td>
                                <td>{`${resp.clave} ${resp.respuesta}  `}</td>
                                <td>{`${resp.valor}`}</td>
                                <td>
                                    <button className='btn btn-danger btn-sm' onClick={(e) => deleteItem(e)} id={resp.consecutivo} ><i id={resp.consecutivo} onClick={(e) => deleteItem(e)} className='bi bi-trash'></i></button>
                                    <button className='btn btn-primary btn-sm' onClick={(e) => updItem(e, resp)} ><i id={resp.consecutivo} onClick={(e) => updItem(e, resp)} className='bi bi-pencil'></i></button>
                                </td>
                            </tr>
                        })}

                    </tbody>
                </table>
                <ul>

                </ul>
            </div>



        </>
    )



}

export default QuestionMultiple