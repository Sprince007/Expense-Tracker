'use client'
import React, { useEffect } from 'react'
import Image from 'next/image';
import {Brain, LayoutDashboard, LayoutGrid,PiggyBank,ReceiptText,ShieldCheck, ShieldPlus} from 'lucide-react'
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
function SideNav() {
  const menuList=[
    {
      id:1,
      name:'Dashboard',
      icon:LayoutDashboard,
      path:'/dashboard'
    },

    {
      id:2,
      name:'Incomes',
      icon:ShieldPlus,
      path:'/dashboard/incomes'
    },

    {
      id:3,
      name:'Budgets',
      icon:PiggyBank,
      path:'/dashboard/budgets'
    },
    {
      id:4,
      name:'Expenses',
      icon:ReceiptText,
      path:'/dashboard/expenses'
    },
    {
      id:5,
      name:'Finance Friend',
      icon:Brain,
      path:'https://www.chatbase.co/chatbot-iframe/utfUOA183lFG1qrOBiSz0'
    }
  ]
  const path=usePathname();
  
  useEffect(()=>{
    console.log(path)
  },[path])
  return (
    <div className='h-screen p-5 border shadow-sm'>
      <Image src={'/ExpenseTracker_Logo1.png'}
      alt='ET_Logo1'
      width={170}
      height={100}
      />
      <div className='mt-5'>
        {menuList.map((menu,index)=>(
          <Link href={menu.path}>
            <h2 className={`flex gap-2 items-center
            text-gray-500 font-medium
            mb-2
            p-5 cursor-pointer rounded-md
            hover:text-primary hover:bg-cyan-100
            ${path==menu.path&&'text-primary bg-cyan-100'}
            `}>
              <menu.icon/>
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2
      items-center'>
        <UserButton/>
        Profile
      </div>
    </div>
  )
}

export default SideNav