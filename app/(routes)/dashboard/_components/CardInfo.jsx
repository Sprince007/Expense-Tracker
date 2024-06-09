import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList = [] }) { // Ensure budgetList is an array by default

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, settotalSpent] = useState(0);

    useEffect(() => {
        if (budgetList.length > 0) {
            CalculateCardInfo();
        }
    }, [budgetList]);

    const CalculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpent_ = 0;

        budgetList.forEach(element => {
            totalBudget_ = totalBudget_ + Number(element.amount);
            totalSpent_ = totalSpent_ + (element.totalSpent || 0); // Ensure totalSpent is a number
        });

        setTotalBudget(totalBudget_);
        settotalSpent(totalSpent_);
    }

    return (
        <div>
            {budgetList?.length > 0 ?
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>{totalBudget} FCFA</h2>
                        </div>
                        <PiggyBank
                            className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spent</h2>
                            <h2 className='font-bold text-2xl'>{totalSpent} FCFA</h2>
                        </div>
                        <ReceiptText
                            className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>No. of Budget</h2>
                            <h2 className='font-bold text-2xl'>{budgetList?.length}</h2> {}
                        </div>
                        <Wallet
                            className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                </div>
                :
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default CardInfo
