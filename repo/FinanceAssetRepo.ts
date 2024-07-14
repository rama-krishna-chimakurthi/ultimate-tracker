import { Repository } from "typeorm";
import { FinanceAsset } from "../entities/FinanceAsset";

export class FinanceAssetRepo {
    private repo: Repository<FinanceAsset>

    constructor(repo: Repository<FinanceAsset>) {
        this.repo = repo
    }

    async getAll(): Promise<FinanceAsset[]> {
        return await this.repo.find();
    }

    async create(asset: FinanceAsset): Promise<FinanceAsset> {
        return await this.repo.save(asset);
    }

    async update(asset: FinanceAsset): Promise<FinanceAsset> {
        return await this.repo.save(asset);
    }

    async delete(assetId: number): Promise<void> {
        await this.repo.delete(assetId);
    }

    async findOne(assetId: number): Promise<FinanceAsset | undefined> {
        return await this.repo.findOne({ where: { id: assetId } });
    }
}