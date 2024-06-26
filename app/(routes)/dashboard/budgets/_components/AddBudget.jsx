import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import EmojiPicker from 'emoji-picker-react'; // Import EmojiPicker

function AddBudget({ incomeId, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState('🤩')
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value.replace(/,/g, ''));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(formatNumber(value));
  };

  const addNewBudget = async () => {
    setLoading(true);
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const result = await db.insert(Budgets).values({
      name: name,
      amount: numericAmount,
      from: from,
      icon:emojiIcon,
      incomeId: incomeId || null,
      createdBy: user?.primaryEmailAddress.emailAddress,
    }).returning({ insertedId: Budgets.id });

    setAmount('');
    setName('');
    setFrom('');
    
    if (result) {
      setLoading(false);
      refreshData();
      toast('New Budget has been Added!');
    } else {
      setLoading(false);
    }
  };

 

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Budget</h2>
      <div className='mt-2'>

      <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                  {emojiIcon}
                </Button>
                <div className='absolute z-20'>
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji)
                      setOpenEmojiPicker(false)
                    }}
                  />
                </div>
                </div>

        <h2 className='text-black font-medium my-1'>Budget Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
      <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>Budget Amount</h2>
        <Input
          type="text"
          placeholder="e.g. 2,000"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <div className='mt-2'>
        <h2 className='text-black font-medium my-1'>From(optional)</h2>
        <Input
          placeholder="e.g. Sherif"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={addNewBudget}
        className='mt-3 w-full bg-purple-500 hover:bg-cyan-500'
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Budget"}
      </Button>
    </div>
  );
}

export default AddBudget;
