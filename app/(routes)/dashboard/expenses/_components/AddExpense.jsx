import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { Loader } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value.replace(/,/g, ''));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(formatNumber(value));
  };

  const addNewExpense = async () => {
    setLoading(true);
    const numericAmount = parseFloat(amount.replace(/,/g, ''));

    const result = await db.insert(Expenses).values({
      name: name,
      amount: numericAmount,
      budgetId: budgetId || null, // Allow null budgetId
      createdAt: moment().format('DD/MM/yyyy'),
    }).returning({ insertedId: Expenses.id });

    setAmount('');
    setName('');
    if (result) {
      setLoading(false);
      refreshData();
      toast('New Expense has been Added!');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Expense Amount</h2>
        <Input
          type="text"
          placeholder="e.g. 2,000"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={() => addNewExpense()}
        className='mt-3 w-full bg-purple-500 hover:bg-cyan-500'
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
