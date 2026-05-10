const {
    getAllData,
    updateData,
    insertData,
    deleteData,
    getDataById
} = require('../lib/queryModel')

const cQuery = () => {}

cQuery.get = async (name) => {

    const gdata = await getAllData(name)

    return gdata

}
cQuery.getDataById = async (tabla, namecolid, id) => {
    const gdata = getDataById(tabla, namecolid, id)
    return gdata
}


cQuery.save = async (table, data) => {

    const gdata = await insertData(table, data)
    return gdata

}

cQuery.update = async (t, namecolid, id, data) => {

    const gdata = await updateData(t, namecolid, id, data)

    return gdata
}

cQuery.deleteData = async (t, namecolid, id) => {

    const delRef = await deleteData(t, namecolid, id)

    return delRef

}



module.exports = cQuery