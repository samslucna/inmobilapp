const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const {getAllData} = require('../model/queryModel')

const helper = require('./helper')




passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { iduser, name, lastnamef, lastnamed, mail } = req.body;
    const user = {
        firstname,
        lastnamef,
        lastnamed,
        email,
        username,
        password,
        password,
    };

    user.password = await helper.encryptPass(password)

    userModel.save(user, (err, result) => {
        if (err) {
            console.log('Failed'+err)
        }
        else {
            user.iduser = result.insertId
            console.log(user)
            return done(null, user)

        }
    });


}))


passport.use('local.signin', new localStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {
  
    userModel.getUsername(username, async (err,row) => {

        if (row.length > 0) {
            const user = row[0]
            const validaPassword = await helper.matchPassword(password, user.password)

            if (validaPassword) {
                done(null, user, req.flash('success', 'Welcome ' + user.username))
            } else {
                done(null, false, req.flash('message', 'Incorrect Password'))
            }
        } else {
            return done(null, false, req.flash('message', 'The username doest not exist'))
        }

    })
}
))



passport.serializeUser((user, done) => {

    done(null, user.iduser)
})

passport.deserializeUser(async (iduser, done) => {
    userModel.getOne(iduser, (err, row) => {
        if (err) {
            console.log('Failed')
        }
        else {


            done(null, row[0])

        }
    })

})

