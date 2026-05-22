const {
    getConnection
} = require('./database')

if (!getConnection) {
    console.log('se realizo la conexión correctamente')
}



//consulta la tabla solicitada
const getAllData = async (t) => {

    const conn = await getConnection();
    const results = await conn.query("SELECT * FROM " + t + "");
    //console.log(results)
    return results
}

//selecciona la tabla, nombre de  la columna  del criterio,
const getAllDataName = async (t,namecol,name) => {

    const conn = await getConnection();
    const results = await conn.query("SELECT * FROM " + t + " WHERE " + namecol + " = ?",name);
    //console.log(results)
    return results
}


// pagination name table, column name selected id, limit registros, position current
const dataPagination = async (table,limit, position) => {
    const conn = await getConnection();
    const results = await conn.query("SELECT * FROM " + table + " limit ? OFFSET ?", [limit, position]);
    return results
}

//recibe como parametros la nombre de tabla y los datos a recibir
const insertData = async (table, data) => {
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO " + table + " SET ?", data);

        data.id = result.insertId;

        // Return the created
        return data;
    } catch (error) {
        console.log(error);
    }

}






//get data by id: add first params table , second param column id  by name id and tird param id to seach

const getDataById = async (t, namecolid, id) => {
    const conn = await getConnection();
    const result = await conn.query("SELECT * FROM " + t + " WHERE " + namecolid + " = ?", id);
    return result
}

const getAllDataById = async (t, namecolid, id, namecol, idsup) => {
    const conn = await getConnection();
    const result = await conn.query("SELECT * FROM " + t + " WHERE " + namecolid + " = ? AND " + namecol + " = ? ", [id, idsup]);
    console.log(result)
    return result
}


// update data first param t, second param id , tird param data fourt param is name from column id from seach
const updateData = async (t, namecolid, id, data) => {
    const conn = await getConnection();
    const result = await conn.query("UPDATE " + t + " SET ? WHERE " + namecolid + " = ? ", [
        data,
        id,
    ])
    return result
}


const updateDatas = async (t, data, nameIdData, idData, nameIdtSub, idttSub) => {

    const conn = await getConnection();
 
    const result = await conn.query(`UPDATE ${t} SET ? WHERE ${nameIdData} = '${idData}' AND ${nameIdtSub} = '${idttSub}'`,data)
  
    return result
}


const deleteData = async (t, namecolid, id) => {
    const conn = await getConnection();
    const result = await conn.query("DELETE FROM " + t + " WHERE " + namecolid + " = ?", id);
    //console.log(result)
    return result
}
const deleteDataRef = async (t, namecolid, id,ref,valref) => {
    const conn = await getConnection();
    const result = await conn.query("DELETE FROM " + t + " WHERE " + namecolid + " = ? AND " + ref +" = ?", [id,valref]);
    //console.log(result)
    return result
}
 

const getSeachDatas = async (table, col1, col2, col3, limit, columnorder, q) => {


    const conn = await getConnection();
    const results = await conn.query(`SELECT * FROM ${table} WHERE ${col1} LIKE '%${q}%' OR ${col2}  LIKE  '%${q}%' OR ${col3} LIKE  '%${q}%' ORDER BY ${columnorder} DESC limit ${limit} `);
 
    
    return results


}


module.exports = {
    getAllData,
    getAllDataName,
    insertData,
    getDataById,
    deleteData,
    updateData,
    updateDatas,
    getAllDataById,
    dataPagination,
    getSeachDatas,
    deleteDataRef
}