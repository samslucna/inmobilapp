const bcrypt = require('bcrypt')
const helper = {}

helper.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    //console.log(hash)
    return hash
}

helper.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword)
    } catch (e) {
        console.log(e)
    }
}



module.exports = helper