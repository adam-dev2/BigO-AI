import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env.js";

passport.use(
    new GoogleStrategy(
        {
            clientID:GOOGLE_CLIENT_ID!,
            clientSecret:GOOGLE_CLIENT_SECRET!,
            callbackURL:GOOGLE_CALLBACK_URL!
        },
        async(_accessToken,_refreshToken,profile,done) => {
            try {
                const user = {
                    provider:'google',
                    googleId:profile.id,
                    email: profile.emails?.[0]?.value,
                    name:profile.displayName,
                    avatar:profile.photos?.[0]?.value
                }

                return done(null,user);
            }catch(error) {
                return done(error as Error);
            }
        }
    )
)