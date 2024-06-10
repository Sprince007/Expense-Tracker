"use client";
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';
import { CSVLink } from 'react-csv'; // Import CSVLink for CSV export

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  const getBudgetInfo = async () => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpent: sql `sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id))
      .groupBy(Budgets.id);

    setBudgetInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  const deleteBudget = async () => {
    const deleteExpenseResult = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

    if (deleteExpenseResult) {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
    }
    toast('Budget has been successfully deleted!');
    route.replace('/dashboard/budgets');
  };

  // Export CSV
  const headers = [
    { label: 'Expense Name', key: 'name' },
    { label: 'Amount', key: 'amount' },
    { label: 'Budget Name', key: 'budgetName' },
    { label: 'Created At', key: 'createdAt' },
  ];

  // Calculate total expense amount
  const totalExpenseAmount = expensesList.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

  // Prepare CSV data
  let csvData = expensesList.map(expense => ({
    name: expense.name,
    amount: expense.amount,
    budgetName: budgetInfo?.name, // Assuming budget name is available in budgetInfo
    createdAt: expense.createdAt,
  }));

  // Insert empty rows before the total expense amount
  for (let i = 0; i < 2; i++) {
    csvData.push({ name: '', amount: '', budgetName: '', createdAt: '' });
  }

  // Add total sum row to csvData
  csvData.push({ name: 'Total Expense Amount', amount: totalExpenseAmount, budgetName: '', createdAt: '' });

   // Add total budget amount row to csvData
   csvData.push({ name: 'Total Budget Amount', amount: budgetInfo?.amount, budgetName: '', createdAt: '' });

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>My Expenses
        <div className='flex gap-2 items-center'>
          <EditBudget budgetInfo={budgetInfo} refreshData={getBudgetInfo} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2' variant="destructive"><Trash /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your expenses alongside with your budget from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBudget}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CSVLink data={csvData} headers={headers} filename={"expenses.csv"}>
            <Button className='bg-purple-500 hover:bg-green-500 text-white px-4 py-1 rounded-xl'>Export Expenses</Button>
          </CSVLink>
        </div>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo ? <BudgetItem budget={budgetInfo} /> :
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
        <AddExpense budgetId={params.id} user={user} refreshData={getBudgetInfo} />
      </div>
      <div className='mt-4'>
        <ExpenseListTable expensesList={expensesList} refreshData={getBudgetInfo} />
      </div>
    </div>
  )
}

export default ExpensesScreen;
