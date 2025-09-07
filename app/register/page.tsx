"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'


const page = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(password !== confirmPassword){
            alert("Passwords do not match")
            return
        }

        try {
            const res = await fetch('/api/register',
                {method: 'POST',
                headers:{
                    "Content-Type":"application/json"},
                body: JSON.stringify({
                    email,password
                })
                }
            )

            const data = await res.json()

            if(!res.ok){
                throw new Error(data.error || "Something went wrong")
            }

            router.push('/login')
        } catch (error) {
            throw new Error("Error registering user")
        }

    }

  return (
    <div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md mx-auto mt-10'>
            <h1 className='text-2xl font-bold text-center'>Register</h1>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='border p-2 rounded' />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='border p-2 rounded' />
            <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='border p-2 rounded' />
            <button type="submit" className='bg-blue-500 text-white p-2 rounded'>Register</button>
            <p className='text-center'>
                Already have an account? <Link href="/login" className='text-blue-500'>Login</Link>
            </p>
        </form>
    </div>
  )
}

export default page