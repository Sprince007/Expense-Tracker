"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useUser,UserButton } from '@clerk/nextjs'
import Link from 'next/link';

function Header() {

  const {user,isSignedIn}=useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-'>
        <Image src={'/ExpenseTracker_Logo1.png'} 
        alt='ET_Logo1'
        width={160}
        height={100}
        />
       {isSignedIn?
       <UserButton/> :  
       <Link href={'/sign-in'}>
       <Button>Get started</Button>
       </Link>
      }
       
    </div>
  )
}

export default Header