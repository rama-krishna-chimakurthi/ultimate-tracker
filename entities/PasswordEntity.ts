import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('passwords_table')
export class PasswordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    website: string;

    @Column()
    category: 'Bank' | 'Social';

    @Column()
    password: string;

    @CreateDateColumn({
        type: 'datetime'
    })
    dateCreated: Date;

    @UpdateDateColumn({
        type: 'datetime'
    })
    lastUpdated: Date;

    @Column({
        type: 'datetime'
    })
    expiringOn: Date;

    @Column({
        type: 'datetime'
    })
    nextReminder: Date;
}