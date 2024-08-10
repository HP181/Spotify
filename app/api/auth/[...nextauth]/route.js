import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// const scope =
//   "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

  const scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-follow-modify user-follow-read"


export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.providerAccountId;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };

