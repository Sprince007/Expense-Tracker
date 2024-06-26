import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function BudgetListTable({budgetsList,refreshData}) {

    const deleteBudget=async(budget)=>{
        const result=await db.delete(Budgets)
        .where(eq(Budgets.id,budget.id))
        .returning();

        if(result)
            {

                toast('Budget has been deleted!');
                refreshData()
            }
    }
  return (
    <div className='mt-3'>
       <h2 className='font-bold text-lg'>Latest Budgets</h2>
        <div className='grid grid-cols-4 bg-slate-200 p-2 mt-3'>
            <h2 className='font-bold'>Name</h2>
            <h2 className='font-bold'>Amount (FCFA)</h2>
            <h2 className='font-bold'>Created by</h2>
            <h2 className='font-bold'>Action</h2>
        </div>
        {budgetsList.map((budgets,index)=>(
              <div className='grid grid-cols-4 bg-slate-50 p-2'>
              <h2>{budgets.name}</h2>
              <h2>{budgets.amount}</h2>
              <h2>{budgets.createdBy}</h2>
              <h2>
                <Trash className='text-red-600 cursor-pointer'
                onClick={()=>deleteBudget(budgets)}
                />
              </h2>
          </div>
        ))}
    </div>
  )
}

export default BudgetListTable