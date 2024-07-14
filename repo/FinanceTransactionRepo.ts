import { Repository } from "typeorm";
import { FinanceTransaction } from "../entities/FinanceTransaction";

export class FinanceTransactionRepo {
    private repo: Repository<FinanceTransaction>

    constructor(repo: Repository<FinanceTransaction>) {
        this.repo = repo;
    }

    async findAll(): Promise<FinanceTransaction[]> {
        return await this.repo.find();
    }


    async findById(id: number): Promise<FinanceTransaction | undefined> {
        return await this.repo.findOne({
            where: { id: id }
        });
    }


    async create(transaction: FinanceTransaction): Promise<FinanceTransaction> {
        return await this.repo.save(transaction);
    }



    async update(transaction: FinanceTransaction): Promise<void> {
        await this.repo.update(transaction.id, transaction);
    }


    async delete(transaction: FinanceTransaction): Promise<void> {
        await this.repo.delete(transaction);
    }



}