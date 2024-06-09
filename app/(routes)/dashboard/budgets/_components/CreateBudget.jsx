"use client" // This directive is used in Next.js to indicate that this component should be rendered on the client side.

import React, { useState } from 'react' // Import React and useState hook.
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" // Import Dialog components from your UI library.
import EmojiPicker from 'emoji-picker-react' // Import EmojiPicker component.
import { Button } from '@/components/ui/button' // Import Button component from your UI library.
import { Input } from '@/components/ui/input' // Import Input component from your UI library.
import { db } from '@/utils/dbConfig' // Import database configuration.
import { Budgets } from '@/utils/schema' // Import Budgets schema.
import { useUser } from '@clerk/nextjs' // Import useUser hook for user authentication.
import { toast } from 'sonner' // Import toast for notifications.

function CreateBudget({refreshData}) {

    // State for selected emoji icon
    const [emojiIcont, setEmojiIcon] = useState('🤩')

    // State for controlling the emoji picker visibility
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    // State for budget name
    const [name, setName] = useState();
    
    // State for budget amount
    const [amount, setAmount] = useState();

    // Get the current user
    const { user } = useUser();

    // Function to create a new budget
    const onCreateBudget = async () => {
      const result = await db.insert(Budgets)
        .values({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcont
        }).returning({ insertedId: Budgets.id })

      if (result) {
        refreshData()
        toast('New Budget Successfully created!') // Show success notification
      }
    }

  return (
    <div>
        <Dialog>
          <DialogTrigger asChild>
            <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                <h2 className='text-3xl'>+</h2>
                <h2>Create New Budget</h2>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new Budget</DialogTitle>
              <DialogDescription>
                <div className='mt-5'>
                  <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                    {emojiIcont}
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
                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                    <Input placeholder="e.g. Home Decor" onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                    <Input type="number" placeholder="e.g. 2000 FCFA" onChange={(e) => setAmount(e.target.value)} />
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button 
                  disabled={!(name && amount)} 
                  onClick={() => onCreateBudget()} 
                  className='mt-5 w-full bg-cyan-500 hover:bg-orange-500'>
                  Create Budget
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreateBudget