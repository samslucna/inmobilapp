import React, {
    createContext,
    useState

} from 'react'


export const PropertyContext = createContext()

const propertyProvider = (props) => {


    const [updState, setUpdState] = useState({ id: null, status: false })
    
    const [pagNum, setPagNum] = useState(0)
    const [datasTable, setDatasTable] = useState([])
    const [property, setproperty] = useState({
      idproperty: null,
      nombre: "",
      apellidop: "",
      apellidom: "",
      direccion: "",
      especialidad: "",
      telefono1: "",
      telefono2: "",
      email: "",
      sexo: "",
      cedula: ""
    })
    
   

      const changeInpt = async (e, result) => {
        e.preventDefault()
        const { name, value } = e.target || result
    
        setproperty({
          ...property,
          [name]: value
        })
    
    
      }
    
  

    return (


        <PropertyContext.Provider value = {
            {
                updState,
                datasTable,
                property,                
                changeInpt,
                setUpdState,
                setDatasTable,
                setproperty

            }
        } > {
            props.children
        } </PropertyContext.Provider>

    )


}


export default P
PropertyProvider