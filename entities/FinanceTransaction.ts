import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { FinanceAsset } from "./FinanceAsset";
import { FinanceCategory } from "./FinanceCategory";

@Entity('finance_transactions')
export class FinanceTransaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({
        name: 'transaction_date',
        type: 'datetime'
    })
    transactionDate: Date;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    type: 'Expense' | 'Income' | 'Difference' | 'Transfer';

    @CreateDateColumn({
        name: 'date_created',
        type: 'datetime'
    })
    dateCreated: Date;

    @UpdateDateColumn({
        name: 'last_updated',
        type: 'datetime'
    })
    lastUpdated: Date;

    @ManyToOne(() => FinanceCategory, {
        eager: true
    })
    @JoinColumn({
        name: 'category_id'
    })
    category: FinanceCategory;

    @ManyToOne(() => FinanceAsset, {
        eager: true
    })
    @JoinColumn({
        name: 'from_asset'
    })
    fromAsset: FinanceAsset;

    @ManyToOne(() => FinanceAsset, {
        eager: true
    })
    @JoinColumn({
        name: 'to_asset'
    })
    toAsset: FinanceAsset;
}
