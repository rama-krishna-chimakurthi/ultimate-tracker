export interface FiananceCategory {
    id: number;
    name: string;
    isDeleted: boolean;
    type: 'Expense' | 'Income'
}

export interface FiananceAssetGroup {
    id: number;
    name: string;
    isDeleted: boolean;
}

export interface FiananceAsset {
    id: number;
    name: string;
    asset_group_id: number;
    isDeleted: boolean;
    settlement_day: number | undefined;
}

export interface FiananceTransaction {
    id: number,
    category_id: number;
    from_asset: number | undefined;
    to_asset: number | undefined;
    amount: number;
    date: number;
    name: string;
    description: string;
    type: 'Expense' | 'Income' | 'Difference' | 'Transfer';
}

export interface TransactionsByMonth {
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