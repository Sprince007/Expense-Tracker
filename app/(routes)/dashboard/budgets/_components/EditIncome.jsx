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
import { Incomes } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditIncome({ incomeInfo, refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState(incomeInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [from, setFrom] = useState('');

    const { user } = useUser();

    useEffect(() => {
        if (incomeInfo) {
            setEmojiIcon(incomeInfo?.icon);
            setName(incomeInfo.name);
            setAmount(formatAmount(incomeInfo.amount));
            setFrom(incomeInfo.from);
        }
    }, [incomeInfo]);

    const formatAmount = (value) => {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (!isNaN(value)) {
            setAmount(formatAmount(value));
        }
    };

    const onUpdateIncome = async () => {
        const formattedAmount = amount.replace(/,/g, '');
        const result = await db.update(Incomes).set({
            name: name,
            amount: formattedAmount,
            from: from,
            icon: emojiIcon,
        }).where(eq(Incomes.id, incomeInfo.id))
            .returning();

        if (result) {
            refreshData();
            toast('Income has been successfully updated!');
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
                        <DialogTitle> Update Income</DialogTitle>
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
                                    <h2 className='text-black font-medium my-1'>Income Name</h2>
                                    <Input placeholder="e.g. Finances"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Income Amount</h2>
                                    <Input type="text"
                                        value={amount}
                                        placeholder="e.g. 2,000 NGN"
                                        onChange={handleAmountChange} />
                                </div>

                                 <div className='mt-2'>
                                     <h2 className='text-black font-medium my-1'>From</h2>
                                     <Input
                                      placeholder="e.g. Sherif"
                                      value={from}
                                      onChange={(e) => setFrom(e.target.value)} />
                                </div>      

                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={onUpdateIncome}
                                className='mt-5 w-full bg-purple-500 hover:bg-cyan-500'>
                                Update Income
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditIncome;
