import Link from 'next/link';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { debounce } from 'lodash'; // Import debounce from lodash

function IncomeItem({ income }) {
    // Initialize debouncedToastError as a state variable
    const [debouncedToastError] = React.useState(() => debounce(toast.error, 1000));

    useEffect(() => {
        // Cleanup function to clear debounce timer on component unmount
        return () => {
            debouncedToastError.cancel(); // Cancel any pending debounce operations
        };
    }, [debouncedToastError]); // Ensure effect runs only when debouncedToastError changes

    const calculateProgressPerc = () => {
        const perc = (income.totalSpent / income.amount) * 100;

        // Check if progress exceeds 100%
        if (perc > 100) {
            debouncedToastError('You have gone past your Income! Please Top-up!');
            return 100; // Cap progress at 100%
        }

        return perc.toFixed(2);
    };

    const formatAmount = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Link href={'/dashboard/budgets/' + income?.id}>
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full'>{income?.icon}</h2>
                        <div>
                            <h2 className='font-bold'>{income.name}</h2>
                            <h2 className='text-sm text-gray-500'>{income.totalItem} Item</h2>
                        </div>
                    </div>
                    <h2 className='font-bold text-purple-600 text-lg'>{formatAmount(income.amount)} FCFA</h2>
                </div>
                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-400'>{formatAmount(income.totalSpent ? income.totalSpent : 0)} FCFA Spent</h2>
                        {income.from && (
                            <h2 className='text-xs text-slate-400'> From: {income.from}</h2>
                        )}
                        <h2 className='text-xs text-slate-400'>{formatAmount(income.amount - income.totalSpent)} FCFA Remaining</h2>
                    </div>
                    <div className='w-full bg-slate-300 h-2 rounded-full'>
                        <div className='bg-purple-600 h-2 rounded-full' style={{ width: `${calculateProgressPerc()}%` }}></div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default IncomeItem;
