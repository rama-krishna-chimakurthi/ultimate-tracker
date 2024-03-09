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
    settlement_day: number;
}

export interface FiananceTransaction {
    id: number,
    category_id: number;
    from_asset: number;
    to_asset: number;
    amount: number;
    date: number;
    name: string;
    description: string;
    type: 'Expense' | 'Income' | 'Difference' | 'Transfer';
}