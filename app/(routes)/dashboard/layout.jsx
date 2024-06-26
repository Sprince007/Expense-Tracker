"use client"
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets, Incomes } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

function DashboardLayout({children}) {

  const {user}=useUser();
  const router=useRouter();

  useEffect(()=>{
    user&&checkUserIncomes();
  },[user])

  const checkUserIncomes=async()=>{
    const result=await db.select()
    .from(Incomes)
    .where(eq(Incomes.createdBy,user?.primaryEmailAddress?.emailAddress))
  console.log(result);
  if(result?.length==0)
    {
      router.replace('/dashboard/incomes')
    }
  }



  useEffect(()=>{
    user&&checkUserBudgets();
  },[user])

  const checkUserBudgets=async()=>{
    const result=await db.select()
    .from(Budgets)
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
  console.log(result);
  if(result?.length==0)
    {
      router.replace('/dashboard/budgets')
    }
  }

  useEffect(()=>{
    user&&checkUserIncomes();
  },[user])

 

  return (
    <div>
      <div className='fixed md:w-64 hidden md:block'>
        <SideNav/>
      </div>
      <div className='md:ml-64'>
        <DashboardHeader/>
        {children}
      </div>
     </div>
  )
}

export default DashboardLayout