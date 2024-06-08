"use client"

import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable'; // Adjust the import path if needed
import AddExpense from './_components/AddExpense'; // Adjust the import path if needed
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';

function Page() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  const getAllExpenses = async () => {
    if (!user) return;
    
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
  };

  const refreshData = () => {
    getAllExpenses();
  };

  return (
    <div className='p-10'>
      <h1 className='font-bold text-3xl p-3'>My Expenses</h1>
      <AddExpense user={user} refreshData={refreshData} />
      <ExpenseListTable expensesList={expensesList} refreshData={refreshData} />
    </div>
  );
}

export default Page;
