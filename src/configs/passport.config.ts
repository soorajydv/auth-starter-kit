import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../features/user/models/user.model';
import Profile from '../features/profile/models/profile.model';
import { GOOGLE_CALLBACK_URL } from './env.cofig';

dotenv.config();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: [
          'profile',
          'email',
          // 'https://www.googleapis.com/auth/user.birthday.read',
          // 'https://www.googleapis.com/auth/user.gender.read',
          // 'https://www.googleapis.com/auth/user.addresses.read',
        ],
      },
      async (_accessToken, refreshToken, profile, done) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const email = profile.emails?.[0]?.value;
          if (!email) throw new Error('No email returned from Google');

          // Step 1: Find or create user
          let user = await User.findOne({ email }).session(session);

          if (user) {
            user.isOauth = true;
            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            await user.generateApiKey();
            await user.save({ session });
          } else {
            const createdUsers = await User.create(
              [{
                name: profile.displayName,
                email,
                isOauth: true,
                oauthProvider: 'google',
                oauthId: profile.id,
                refreshToken,
              }],
              { session }
            );
            user = createdUsers[0];
            await user.generateApiKey();
            await user.save({ session });
          }

          // // Step 2: Fetch extended profile info from Google People API
          // const peopleRes = await axios.get('https://people.googleapis.com/v1/people/me', {
          //   headers: { Authorization: `Bearer ${accessToken}` },
          //   params: { personFields: 'birthdays,genders,addresses' },
          // });

          // const dobObj = peopleRes.data.birthdays?.[0]?.date;
          // const gender = peopleRes.data.genders?.[0]?.value || '';
          // const address = peopleRes.data.addresses?.[0]?.formattedValue || '';

          // const dob = dobObj
          //   ? `${dobObj.year || '0000'}-${String(dobObj.month || 1).padStart(2, '0')}-${String(dobObj.day || 1).padStart(2, '0')}`
          //   : '';

          // Step 3: Download and save avatar locally
          const avatarUrlFromGoogle = profile.photos?.[0]?.value || '';
          let avatarUrl = '';

          if (avatarUrlFromGoogle) {
            const response = await axios.get(avatarUrlFromGoogle, { responseType: 'arraybuffer' });

            const safeName = (user.name || 'user').replace(/\s+/g, '_');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${safeName}_avatar_${timestamp}.jpg`;

            const filePath = path.join('public', 'images', 'avatar', filename);
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(filePath, response.data);
            avatarUrl = `public/images/avatar/${filename}`;
          }

          // Step 4: Create or update profile atomically
          await Profile.findOneAndUpdate(
            { user: user._id },
            {
              $setOnInsert: {
                user: user._id,
                avatarUrl,
                // dob,
                // gender,
                // address,
              },
            },
            { upsert: true, new: true, session }
          );

          await session.commitTransaction();
          session.endSession();
          done(null, user);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error('Google OAuth Error:', error);
          done(error as any, null!);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error as any, null);
    }
  });
};
