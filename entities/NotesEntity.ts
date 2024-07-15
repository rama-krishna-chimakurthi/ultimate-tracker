import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('notes_table')  // This defines the table name in the database
export class NotesEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({
        type: 'datetime'
    })
    date: Date;

    @CreateDateColumn({
        type: 'datetime'
    })
    dateCreated: Date;

    @UpdateDateColumn({
        type: 'datetime'
    })
    lastUpdated: Date;
}