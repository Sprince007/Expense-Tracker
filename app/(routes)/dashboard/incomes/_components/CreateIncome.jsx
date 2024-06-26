"use client" 
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Incomes } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

function CreateIncome({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState('🤩')
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState('')
  const { user } = useUser()

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value.replace(/,/g, ''));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(formatNumber(value));
  };

  const onCreateIncome = async () => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    const result = await db.insert(Incomes)
      .values({
        name: name,
        amount: numericAmount, // Ensure the amount is a number
        from: from,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
      }).returning({ insertedId: Incomes.id })

    if (result) {
      refreshData()
      toast('New Income Successfully created!')
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
            <h2 className='text-3xl'>+</h2>
            <h2>Create New Income</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Income</DialogTitle>
            <DialogDescription>
              <div className='mt-5'>
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
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Income Name</h2>
                  <Input placeholder="e.g. Home Decor" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>Income Amount</h2>
                  <Input type="text" placeholder="e.g. 2,000 FCFA" value={amount} onChange={handleAmountChange} />
                </div>
                <div className='mt-2'>
                  <h2 className='text-black font-medium my-1'>From(optional)</h2>
                  <Input placeholder="e.g. Sherif" onChange={(e) => setFrom(e.target.value)} />
                </div>   

              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)} 
                onClick={onCreateIncome}
                className='mt-5 w-full bg-purple-500 hover:bg-cyan-500'>
                Create Income
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateIncome
