import passport from 'passport';
import './google.strategy.js'
import './github.strategy.js'


passport.serializeUser((user:any,done) => {
    done(null,user);
})

passport.deserializeUser((user:any,done) => {
    done(null,user)
})