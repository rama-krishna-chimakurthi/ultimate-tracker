import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('finance_asset_group')
export class FinanceAssetGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isDeleted: boolean;
}