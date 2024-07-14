
export interface TransactionsByMonth {
    id?: number;
    totalExpenses: number;
    totalIncome: number;
}


export interface SumOfTransactionsByMonth {
    name: string;
    id: string;
    totalIncome: number;
    totalExpenses: number;
}

export interface SumOfTransactionsByMonthAssets extends SumOfTransactionsByMonth {
    assetGroupId: number;
}