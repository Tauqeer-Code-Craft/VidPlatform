import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider  from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers:[
    CredentialsProvider({

        name: "Credentials",
        credentials: { 
            email: {label:"Email",type: "text"},
            password: {label: "Password",type: "password"}

        },

        async authorize(credentials){
          if(!credentials?.email || !credentials?.password){
            throw new Error("Email and Password are required")
          }

          try {
            await connectToDB();
            const user = await User.findOne({email: credentials.email})

            if(!user){
              throw new Error("User not found. Please Register")
            }

            const isValid = await bcrypt.compare(credentials.password,user.password)

            if(!isValid){
              throw new Error("Invalid Password")
            }

            return{
              id: user._id.toString(),
              email: user.email
            }

          } catch (error) {
            console.error("Error in authorize function",error);
            throw error ;
          }
        }
        
    })
  ],

  callbacks: {
    async jwt({token,user}){
      if(user){
        token.id = user.id
      }
      return token;
  },
    async session({session,token}){
      if(session){
        session.user.id = token.id as string;
      }
    return session;
  },
},
  pages:{
    signIn: "/login",
    error: "/login"
  },
  session:{
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30 // 30days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

