"use client"
import React, { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import CardInfo from './_components/CardInfo';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses, Incomes } from '@/utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (user) {
      getBudgetList();
      getTotalIncome();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpent: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    
    console.log("Budget List:", result); // Debugging log
    setBudgetList(result);
    getAllExpenses();
  };

  const getTotalIncome = async () => {
    const result = await db.select({
      amount: sql`sum(${Incomes.amount})`.mapWith(Number)
    }).from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress));

    const income = result[0]?.amount || 0;
    console.log("Total Income:", income); // Debugging log
    setTotalIncome(income);
  };

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    
    setExpensesList(result);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const totalBudgetAmount = budgetList.reduce((acc, budget) => acc + Number(budget.amount), 0);
  console.log("Total Budget Amount:", totalBudgetAmount); // Debugging log

  const remainingBalance = totalIncome - totalBudgetAmount;
  console.log("Remaining Balance Calculation:", totalIncome, "-", totalBudgetAmount, "=", remainingBalance); // Debugging log

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-3xl'>Hi, {user?.username || user?.fullName} 👋🏼</h2>
          <p className='text-gray-500'>Here's what's happening with your money, Let's manage your expenses.</p>
        </div>
        <div className='text-right'>
          <UserButton />
          <div className='text-xl font-bold mt-2'>
            <p>Total Income: {formatNumber(totalIncome)} NGN</p>
            <p>Remaining Balance: {formatNumber(remainingBalance)} NGN</p>
          </div>
        </div>
      </div>
      <CardInfo budgetList={budgetList} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
        <div className='md:col-span-2'>
          <BarChartDashboard budgetList={budgetList} />
          <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetList()} />
        </div>
        <div className='grid gap-5'>
          <h2 className='font-bold text-lg'>Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
