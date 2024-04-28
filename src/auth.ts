import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDb from "./lib/dbConnect";
import User from "./models/user.model";
import conf from "./conf/conf";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",

      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        await connectToDb();

        try {
          const user = await User.findOne({
            $or: [
              {
                email: String(credentials.identifier),
              },
              {
                username: String(credentials.identifier),
              },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email...");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login...");
          }

          const isPasswordCorrect = await bcrypt.compare(
            String(credentials.password),
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password...");
          }

          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Make our token more stronger
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }

      return token;
    },

    session: async ({ session, token }) => {
      // Make our session more stronger

      if (token) {
        const { _id, isVerified, username, isAcceptingMessage }: any = token;

        session.user._id = _id;
        session.user.isVerified = isVerified;
        session.user.username = username;
        session.user.isAcceptingMessage = isAcceptingMessage;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: conf.authSecret,
});
