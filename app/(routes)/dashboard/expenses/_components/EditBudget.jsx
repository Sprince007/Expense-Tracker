"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({ budgetInfo, refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [from, setFrom] = useState(''); // Add state for "from"

    const { user } = useUser();

    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo?.icon);
            setName(budgetInfo.name);
            setAmount(formatAmount(budgetInfo.amount));
            setFrom(budgetInfo.from || ''); // Set "from" value, handle null/undefined
        }
    }, [budgetInfo]);

    const formatAmount = (value) => {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (!isNaN(value)) {
            setAmount(formatAmount(value));
        }
    };

    const onUpdateBudget = async () => {
        const formattedAmount = amount.replace(/,/g, '');
        const result = await db.update(Budgets).set({
            name: name,
            amount: formattedAmount,
            icon: emojiIcon,
            from: from || null // Update "from" field, set to null if empty
        }).where(eq(Budgets.id, budgetInfo.id))
            .returning();

        if (result) {
            refreshData();
            toast('Budget has been successfully updated!');
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2 bg-purple-500 hover:bg-cyan-500 rounded-xl'><PenBox /> Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle> Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant="outline" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon}
                                </Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker
                                        open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji);
                                            setOpenEmojiPicker(false);
                                        }}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input placeholder="e.g. Home Decor"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input type="text"
                                        value={amount}
                                        placeholder="e.g. 2,000 NGN"
                                        onChange={handleAmountChange} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>From(optional)</h2>
                                    <Input placeholder="e.g. Finance Office"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)} /> {/* Add input for "from" */}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)} // Allow "from" to be empty
                                onClick={onUpdateBudget}
                                className='mt-5 w-full bg-purple-500 hover:bg-cyan-500'>
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget;
