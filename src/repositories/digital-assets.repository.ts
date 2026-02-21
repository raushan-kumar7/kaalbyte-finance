import { between, desc, eq, and } from "drizzle-orm";
import { db } from "../db/client";
import { digitalAssets, DigitalAssets, NewDigitalAssets } from "../db/schema";
import { DigitalGoldOrSilverAssetType } from "../types/finance";

export class DigitalAssetsRepository {
  static async create(
    asset: NewDigitalAssets,
    userId: string,
  ): Promise<DigitalAssets> {
    const [created] = await db
      .insert(digitalAssets)
      .values({ ...asset, userId })
      .returning();
    return created;
  }

  static async getAll(userId: string): Promise<DigitalAssets[]> {
    return await db
      .select()
      .from(digitalAssets)
      .where(eq(digitalAssets.userId, userId))
      .orderBy(desc(digitalAssets.date));
  }

  static async getById(
    id: number,
    userId: string,
  ): Promise<DigitalAssets | undefined> {
    const [asset] = await db
      .select()
      .from(digitalAssets)
      .where(and(eq(digitalAssets.id, id), eq(digitalAssets.userId, userId)))
      .limit(1);
    return asset;
  }

  static async getByType(
    type: DigitalGoldOrSilverAssetType,
    userId: string,
  ): Promise<DigitalAssets[]> {
    return await db
      .select()
      .from(digitalAssets)
      .where(
        and(eq(digitalAssets.type, type), eq(digitalAssets.userId, userId)),
      )
      .orderBy(desc(digitalAssets.date));
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
    userId: string,
  ): Promise<DigitalAssets[]> {
    return await db
      .select()
      .from(digitalAssets)
      .where(
        and(
          between(digitalAssets.date, startDate, endDate),
          eq(digitalAssets.userId, userId),
        ),
      )
      .orderBy(desc(digitalAssets.date));
  }

  static async getByPlatform(
    platform: string,
    userId: string,
  ): Promise<DigitalAssets[]> {
    return await db
      .select()
      .from(digitalAssets)
      .where(
        and(
          eq(digitalAssets.platform, platform),
          eq(digitalAssets.userId, userId),
        ),
      )
      .orderBy(desc(digitalAssets.date));
  }

  static async update(
    id: number,
    data: Partial<NewDigitalAssets>,
    userId: string,
  ): Promise<DigitalAssets> {
    const [updated] = await db
      .update(digitalAssets)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(digitalAssets.id, id), eq(digitalAssets.userId, userId)))
      .returning();

    if (!updated) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }

    return updated;
  }

  static async delete(id: number, userId: string): Promise<void> {
    const result = await db
      .delete(digitalAssets)
      .where(and(eq(digitalAssets.id, id), eq(digitalAssets.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }
  }

  static async getTotalWeightByType(
    type: DigitalGoldOrSilverAssetType,
    userId: string,
  ): Promise<number> {
    const assets = await this.getByType(type, userId);
    return assets.reduce((sum, asset) => sum + asset.weightG, 0);
  }

  static async getTotalValueByType(
    type: DigitalGoldOrSilverAssetType,
    userId: string,
  ): Promise<number> {
    const assets = await this.getByType(type, userId);
    return assets.reduce((sum, asset) => sum + asset.assetValue, 0);
  }
}
