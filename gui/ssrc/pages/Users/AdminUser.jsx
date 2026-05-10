import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Grid, Header, Input, Segment, Table,Pagination } from 'semantic-ui-react'

import { CajaContext } from '../../context/CajaContext'
import { RenderContext } from '../../context/RenderContext'

const AdminUser = ({dbget, usertypes}) => {
  
  const { setSelectedMenu } = useContext(CajaContext)
  const {registerUser} = useContext(RenderContext)


  const [user, setUser] = useState({
    idpersona: null,
    nombre: '',
    apellidop: '',
    apellidom: '',
    direccion: '',
    email: '',
    telefono: '',
    username: '',
    password: '',
    usertype: ''
  })

  const [dataRender, setDataRender] = useState([])
  const [dataSearch, setDataSearch] = useState('')
  const [activePag, setActivePag] = useState({ activePage: 1 })
  const [pagination, setPagination] = useState({
    limit: 5,
    current: 0
  })
  const [tableRender, setTableRender] = useState([])
  const [pagNum, setPagNum] = useState(0)

  const searchDatas = async (e, result) => {
    e.preventDefault()
    const { value } = result || e.target
    
    setDataSearch(value)

  }

  const onChange = (e, result) => {
    e.preventDefault()


    setUser({
      ...user,
      [result.name]: result.value
    })
  }

  const paginator = async (e, result) => {
    e.preventDefault()
    let renderaux = dataRender
    const posIndex = ((result.activePage - 1) * pagination.limit)
    let limit = pagination.limit * result.activePage
    let nexpag = renderaux.slice(posIndex, limit)

    setPagination({
        limit: pagination.limit,
        current: posIndex
    })

    setTableRender(nexpag)
    setActivePag({ activePage: result.activePage })
}

  const saveUsr = async (usr) => {

    if (usr.username !== '' && usr.password !== '') {
     await registerUser(usr)
     await updateTable()


    } else {
      console.log('datos incompletos')
    }


  }

  const updateTable = async () => {
    await dbget('personas').then(r => {
      setDataRender(r)
    })
    await setUser({
      idpersona: null,
      nombre: '',
      apellidop: '',
      apellidom: '',
      direccion: '',
      email: '',
      telefono: '',
      username: '',
      password: '',
      usertype: ''
    })

    setTableRender(dataRender.slice(pagination.current, pagination.limit))
  }




  useEffect(() => {
    dbget('personas').then(r => {
      setDataRender(r)
    })

  }, [])

 



  useEffect(() => {

    let expresion = new RegExp(`${dataSearch}.*`, "i")
    let seachRender = dataRender.filter(element => expresion.test(element.username) || expresion.test(element.email))
    
    let nump = Math.ceil(seachRender.length / pagination.limit)

    if (dataSearch !== '') {

     
      setPagNum(nump)
      setTableRender(seachRender.slice(pagination.current, pagination.limit))


    } else {

     
      setPagNum(nump)
      setTableRender(dataRender.slice(pagination.current, pagination.limit))
    

    }


  }, [dataSearch,dataRender])
  return (

    <Grid.Row  >

      <Grid.Column width={4} style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center' style={{ backgroundColor: 'white', borderRadius: '2px' }} >
          SCGA
        </Header>


        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Usuario'
              name='username'
              value={user.username}
              onChange={onChange}
            />

            <Form.Input
              fluid
              icon='user'
              value={user.nombre}
              iconPosition='left'
              placeholder='Nombre'
              name='nombre'
              onChange={onChange}
            />

            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Apellido Paterno'
              name='apellidop'
              value={user.apellidop}
              onChange={onChange}
            />
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Apellido Materno'
              name='apellidom'
              onChange={onChange}
              value={user.apellidom}

            />

            <Form.Input
              fluid
              icon='home'
              iconPosition='left'
              placeholder='Direccion'
              name='direccion'
              onChange={onChange}
              value={user.direccion}

            />

            <Form.Input
              fluid
              icon='phone'
              iconPosition='left'
              placeholder='telefono'
              name='telefono'
              onChange={onChange}
              value={user.telefono}

            />

            <Form.Select
              fluid
              options={usertypes}
              placeholder='Tipo de usuario'
              name='usertype'
              onChange={onChange}
              value={user.usertype}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Contraseña'
              type='password'
              name='password'
              onChange={onChange}
              value={user.password}
            />



            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder='Correo electronico'
              name='email'
              onChange={onChange}
              value={user.email}

            />


            <Button
              color='teal'
              fluid size='large'
              onClick={() => saveUsr(user)}
            >
              Registrar
            </Button>

          </Segment>
        </Form>
        {/* <Message>
            <Button fluid size='large' onClick={() => setSelectedForm('login')} >Regresar</Button>
          </Message> */}

      </Grid.Column>
      <Grid.Column width={11} style={{ height: '100vh', top: '44px' }} >
        <Input size='large' type='text' name='search' icon='search' onChange={searchDatas} />

        <Table celled selectable compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell >Numero</Table.HeaderCell>
              <Table.HeaderCell >Usuario</Table.HeaderCell>
              <Table.HeaderCell >Correo Electronico</Table.HeaderCell>
              <Table.HeaderCell >Tipo de Usuario</Table.HeaderCell>

              <Table.HeaderCell >Opciones</Table.HeaderCell>

            </Table.Row>
          </Table.Header>

          <Table.Body>

            {
              tableRender.map((dr, i) => {

                return <Table.Row key={i + 1}>
                  <Table.Cell>{dr.idpersona}</Table.Cell>
                  <Table.Cell>{dr.username}</Table.Cell>
                  <Table.Cell>{dr.email}</Table.Cell>
                  <Table.Cell>{dr.usertype}</Table.Cell>
                  <Table.Cell>
                    <Button id={dr.idpersona} icon='cogs' color='teal' />
                    <Button id={dr.idpersona} icon='trash' color='red' />
                  </Table.Cell>

                </Table.Row>
              })
            }








          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan='5'>
                <Pagination
                  defaultActivePage={activePag.activePage}
                  onPageChange={paginator}
                  value={activePag.activePage}
                  totalPages={pagNum}
                />
              </Table.Cell>
            </Table.Row>

          </Table.Footer>
        </Table>
        <Button floated='right' onClick={() => { setSelectedMenu('caja-main') }} size='large' icon='chevron left' label='Regresar' color='vk' />
      </Grid.Column>
    </Grid.Row>



  )

}

export default AdminUser