import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo({ budgetList = [] }) { // Ensure budgetList is an array by default

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        if (budgetList.length > 0) {
            calculateCardInfo();
        }
    }, [budgetList]);

    const calculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpent_ = 0;

        budgetList.forEach(element => {
            totalBudget_ += Number(element.amount);
            totalSpent_ += Number(element.totalSpent || 0); // Ensure totalSpent is a number
        });

        setTotalBudget(totalBudget_);
        setTotalSpent(totalSpent_);
    };

    const formatAmount = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            {budgetList?.length > 0 ? (
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>{formatAmount(totalBudget)} NGN</h2>
                        </div>
                        <PiggyBank className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spent</h2>
                            <h2 className='font-bold text-2xl'>{formatAmount(totalSpent)} NGN</h2>
                        </div>
                        <ReceiptText className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>No. of Budget</h2>
                            <h2 className='font-bold text-2xl'>{budgetList.length}</h2>
                        </div>
                        <Wallet className='bg-purple-500 p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                </div>
            ) : (
                <div className='mt-7'>
                    <p className='text-center text-gray-500 font-bold'>You Currently have no Budgets</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardInfo;
