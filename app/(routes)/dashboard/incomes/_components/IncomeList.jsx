"use client";
import React, { useEffect, useState } from 'react';
import CreateIncome from './CreateIncome';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Incomes, Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import IncomeItem from './IncomeItem';

function IncomeList() {
  const [incomeList, setIncomeList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getIncomeList();
    }
  }, [user]);

  const getIncomeList = async () => {
    const result = await db.select({
      ...getTableColumns(Incomes),
      totalSpent: sql`sum(${Budgets.amount})`.mapWith(Number),
      totalItem: sql`count(${Budgets.id})`.mapWith(Number)
    }).from(Incomes)
      .leftJoin(Budgets, eq(Incomes.id, Budgets.incomeId))
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    setIncomeList(result);

    const total = result.reduce((acc, income) => acc + parseFloat(income.amount), 0);
    setTotalIncome(total);
  };

  const formatAmount = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredIncomeList = incomeList.filter(income =>
    income.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='mt-7'>
      <div className='mb-5 text-2xl font-bold'>
        Total Income: {formatAmount(totalIncome)} FCFA
      </div>
      <div className='mb-4'>
        <input
          type="text"
          placeholder="Search incomes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateIncome refreshData={getIncomeList} />
        {filteredIncomeList.length > 0 ? (
          filteredIncomeList.map((income, index) => (
            <IncomeItem key={index} income={income} />
          ))
        ) : (
          <div className="text-gray-500">No incomes found.</div>
        )}
      </div>
    </div>
  );
}

export default IncomeList;
