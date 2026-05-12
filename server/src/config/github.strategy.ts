import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    },
    async (_accessToken:any, _refreshToken:any, profile:any, done:any) => {
      try {
        const user = {
          provider: 'github',
          githubId: profile.id,
          username: profile.username,
          avatar: profile.photos?.[0].value,
        };

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);