"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React,{useState} from 'react'

const page = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        try {
            // Handle login logic here
            const res = await signIn('credentials',{
                email,
                password,
                redirect: false,
            })

            if(res?.error){
                console.error(res.error)
                throw new Error(res.error)
            }else{
                router.push('/')
            }

        } catch (error) {
            console.error("Error logging in:", error)
        }

    }

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
        <h1 className='text-2xl font-bold text-center'>Login</h1>
        <input type="email" placeholder='Email' className='border p-2 rounded' />
        <input type="password" placeholder='Password' className='border p-2 rounded' />
        <button type="submit" className='bg-blue-500 text-white p-2 rounded'>Login</button>
        <p className='text-center'>
            Don't have an account? <a href="/register" className='text-blue-500'>Register</a>
        </p>
        <hr />
        <button onClick={() => signIn('google')} className='bg-red-800 text-white p-2 rounded mt-4'>Login with Google</button>
      </form>
    </div>
  )
}

export default page