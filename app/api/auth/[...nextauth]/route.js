import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },

    async signIn({ profile }) {
      console.log(profile);

      try {
        await connect();

        const doesUserExist = await User.findOne({ email: profile.email });

        if (!doesUserExist) {
          const user = await User.create({
            email: profile.email,
            name: profile.name,
            img: profile.picture,
            about: "",
            yeahOfJoining: "2021",
          });
        }
        return true;
      } catch (err) {
        console.log(err);
      }
    },
  },
});

export { handler as GET, handler as POST };