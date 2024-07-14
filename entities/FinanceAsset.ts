import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FinanceAssetGroup } from "./FinanceAssetGroup";

@Entity('finance_asset')
export class FinanceAsset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isDeleted: boolean;

    @Column({
        name: 'settlement_day',
        type: 'datetime'
    })
    settlementDay: Date;

    @Column({
        name: 'payment_day',
        type: 'datetime'
    })
    paymentDay: Date;

    @ManyToOne(() => FinanceAssetGroup, {
        eager: true
    })
    @JoinColumn({
        name: 'asset_group_id'
    })
    assetGroup: FinanceAssetGroup

    amount?: number
}