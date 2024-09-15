import Link from 'next/link';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { debounce } from 'lodash';

function BudgetItem({ budget }) {
    const [debouncedToastError] = React.useState(() => debounce(toast.error, 1000));

    useEffect(() => {
        return () => {
            debouncedToastError.cancel();
        };
    }, [debouncedToastError]);

    const calculateProgressPerc = () => {
        const perc = (budget.totalSpent / budget.amount) * 100;

        if (perc > 100) {
            debouncedToastError('You have gone past your budget! Please Top-up!');
            return 100;
        }

        return perc.toFixed(2);
    };

    const formatAmount = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Link href={'/dashboard/expenses/' + budget?.id}>
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
                {budget.incomeName && (
                    <h3 className='text-xs text-gray-400 mb-2'>{budget.incomeName}</h3>
                )}
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full'>{budget?.icon}</h2>
                        <div>
                            <h2 className='font-bold'>{budget.name}</h2>
                            <h2 className='text-sm text-gray-500'>{budget.totalItem} Item</h2>
                        </div>
                    </div>
                    <h2 className='font-bold text-purple-600 text-lg'>{formatAmount(budget.amount)} NGN</h2>
                </div>
                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-400'>{formatAmount(budget.totalSpent ? budget.totalSpent : 0)} NGN Spent</h2>
                        <h2 className='text-xs text-slate-400'>{budget.from}</h2>
                        <h2 className='text-xs text-slate-400'>{formatAmount(budget.amount - budget.totalSpent)} NGN Remaining</h2>
                    </div>
                    <div className='w-full bg-slate-300 h-2 rounded-full'>
                        <div className='bg-purple-600 h-2 rounded-full' style={{ width: `${calculateProgressPerc()}%` }}></div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BudgetItem;
