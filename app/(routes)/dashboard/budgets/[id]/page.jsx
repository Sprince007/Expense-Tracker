"use client";
import { db } from '@/utils/dbConfig';
import { Incomes, Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import IncomeItem from '../../incomes/_components/IncomeItem';
import CreateBudget from '../_components/CreateBudget';
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
import { CSVLink } from 'react-csv'; // Import CSVLink for CSV export
import EditIncome from '../_components/EditIncome';
import BudgetListTable from '../_components/BudgetListTable';
import AddBudget from '../_components/AddBudget';

function BudgetsScreen({ params }) {
  const { user } = useUser();
  const [incomeInfo, setIncomeInfo] = useState();
  const [budgetsList, setBudgetsList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    user && getIncomeInfo();
  }, [user]);

  const getIncomeInfo = async () => {
    const result = await db.select({
      ...getTableColumns(Incomes),
      totalSpent: sql `sum(${Budgets.amount})`.mapWith(Number),
      totalItem: sql `count(${Budgets.id})`.mapWith(Number)
    }).from(Incomes)
      .leftJoin(Budgets, eq(Incomes.id, Budgets.incomeId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Incomes.id, params.id))
      .groupBy(Incomes.id);

    setIncomeInfo(result[0]);
    getBudgetsList();
  };

  const getBudgetsList = async () => {
    const result = await db.select().from(Budgets)
      .where(eq(Budgets.incomeId, params.id))
      .orderBy(desc(Budgets.id));
    setBudgetsList(result);
  };

  const deleteIncome = async () => {
    const deleteBudgetResult = await db.delete(Budgets)
      .where(eq(Budgets.incomeId, params.id))
      .returning();

    if (deleteBudgetResult) {
      const result = await db.delete(Incomes)
        .where(eq(Incomes.id, params.id))
        .returning();
    }
    toast('Income has been successfully deleted!');
    route.replace('/dashboard/incomes');
  };

  // Export CSV
  const headers = [
    { label: 'Budget Name', key: 'name' },
    { label: 'Amount', key: 'amount' },
    { label: 'Income Name', key: 'incomeName' },
    { label: 'Created By', key: 'createdBy' },
  ];

  // Calculate total expense amount
  const totalBudgetAmount = budgetsList.reduce((acc, budget) => acc + parseFloat(budget.amount), 0);

  // Prepare CSV data
  let csvData = budgetsList.map(budget => ({
    name: budget.name,
    amount: budget.amount,
    incomeName: incomeInfo?.name, // Assuming budget name is available in budgetInfo
    createdBy: budget.createdBy,
  }));

  // Insert empty rows before the total expense amount
  for (let i = 0; i < 2; i++) {
    csvData.push({ name: '', amount: '', incomeName: '', createdBy: '' });
  }

  // Add total sum row to csvData
  csvData.push({ name: 'Total Budget Amount', amount: totalBudgetAmount, incomeName: '', createdBy: '' });

   // Add total budget amount row to csvData
   csvData.push({ name: 'Total Income Amount', amount: incomeInfo?.amount, incomeName: '', createdBy: '' });

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>My Incomes
        <div className='flex gap-2 items-center'>
          <EditIncome incomeInfo={incomeInfo} refreshData={getIncomeInfo} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-2' variant="destructive"><Trash /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your Budgets alongside with your Income from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteIncome}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CSVLink data={csvData} headers={headers} filename={"budgets.csv"}>
            <Button className='bg-purple-500 hover:bg-green-500 text-white px-4 py-1 rounded-xl'>Export Budgets</Button>
          </CSVLink>
        </div>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {incomeInfo ? <IncomeItem income={incomeInfo} /> :
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
        <AddBudget incomeId={params.id} user={user} refreshData={getIncomeInfo} />
      </div>
      <div className='mt-4'>
      <BudgetListTable budgetsList={budgetsList} refreshData={getIncomeInfo} />
      </div>
    </div>
  )
}

export default BudgetsScreen;
