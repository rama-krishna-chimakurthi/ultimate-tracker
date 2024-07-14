import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('passwords_table')
export class PasswordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userNameEmail: string;

    @Column()
    password: string;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    lastUpdated: Date;

    @Column()
    expiringOn: Date;

    @Column()
    nexReminder: Date;
}