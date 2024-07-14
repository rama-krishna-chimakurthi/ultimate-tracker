import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('finance_categories')
export class FinanceCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isDeleted: boolean;

    @Column()
    type: 'Expense' | 'Income'
}