// import { between, desc, eq } from "drizzle-orm";
// import { db } from "../db/client";
// import { equityAssets, EquityAssets, NewEquityAssets } from "../db/schema";
// import { Exchange } from "../types/finance";

// export class EquityAssetsRepository {
//   static async create(asset: NewEquityAssets): Promise<EquityAssets> {
//     const [created] = await db.insert(equityAssets).values(asset).returning();
//     return created;
//   }

//   static async getAll(): Promise<EquityAssets[]> {
//     return await db
//       .select()
//       .from(equityAssets)
//       .orderBy(desc(equityAssets.date));
//   }

//   static async getById(id: number): Promise<EquityAssets | undefined> {
//     const [asset] = await db
//       .select()
//       .from(equityAssets)
//       .where(eq(equityAssets.id, id))
//       .limit(1);
//     return asset;
//   }

//   static async getByCompany(company: string): Promise<EquityAssets[]> {
//     return await db
//       .select()
//       .from(equityAssets)
//       .where(eq(equityAssets.company, company))
//       .orderBy(desc(equityAssets.date));
//   }

//   static async getByExchange(exchange: Exchange): Promise<EquityAssets[]> {
//     return await db
//       .select()
//       .from(equityAssets)
//       .where(eq(equityAssets.exchange, exchange))
//       .orderBy(desc(equityAssets.date));
//   }

//   static async getByDateRange(
//     startDate: Date,
//     endDate: Date,
//   ): Promise<EquityAssets[]> {
//     return await db
//       .select()
//       .from(equityAssets)
//       .where(between(equityAssets.date, startDate, endDate))
//       .orderBy(desc(equityAssets.date));
//   }

//   static async update(
//     id: number,
//     data: Partial<NewEquityAssets>,
//   ): Promise<EquityAssets> {
//     const [updated] = await db
//       .update(equityAssets)
//       .set({ ...data, updatedAt: new Date() })
//       .where(eq(equityAssets.id, id))
//       .returning();
//     return updated;
//   }

//   static async delete(id: number): Promise<void> {
//     await db.delete(equityAssets).where(eq(equityAssets.id, id));
//   }

//   static async getTotalSharesByCompany(company: string): Promise<number> {
//     const assets = await this.getByCompany(company);
//     return assets.reduce((sum, asset) => sum + asset.totalShares, 0);
//   }

//   static async getTotalInvestmentByCompany(company: string): Promise<number> {
//     const assets = await this.getByCompany(company);
//     return assets.reduce((sum, asset) => sum + asset.totalAmount, 0);
//   }

//   static async getPortfolioSummary(): Promise<{
//     totalInvestment: number;
//     totalShares: number;
//     companies: string[];
//   }> {
//     const assets = await this.getAll();

//     return {
//       totalInvestment: assets.reduce(
//         (sum, asset) => sum + asset.totalAmount,
//         0,
//       ),
//       totalShares: assets.reduce((sum, asset) => sum + asset.totalShares, 0),
//       companies: [...new Set(assets.map((asset) => asset.company))],
//     };
//   }
// }


import { between, desc, eq, and } from "drizzle-orm";
import { db } from "../db/client";
import { equityAssets, EquityAssets, NewEquityAssets } from "../db/schema";
import { Exchange } from "../types/finance";

export class EquityAssetsRepository {
  static async create(asset: NewEquityAssets, userId: string): Promise<EquityAssets> {
    const [created] = await db
      .insert(equityAssets)
      .values({ ...asset, userId }) // ✅ Include userId
      .returning();
    return created;
  }

  static async getAll(userId: string): Promise<EquityAssets[]> {
    return await db
      .select()
      .from(equityAssets)
      .where(eq(equityAssets.userId, userId)) // ✅ Filter by userId
      .orderBy(desc(equityAssets.date));
  }

  static async getById(id: number, userId: string): Promise<EquityAssets | undefined> {
    const [asset] = await db
      .select()
      .from(equityAssets)
      .where(
        and(
          eq(equityAssets.id, id),
          eq(equityAssets.userId, userId) // ✅ Ensure user owns this asset
        )
      )
      .limit(1);
    return asset;
  }

  static async getByCompany(company: string, userId: string): Promise<EquityAssets[]> {
    return await db
      .select()
      .from(equityAssets)
      .where(
        and(
          eq(equityAssets.company, company),
          eq(equityAssets.userId, userId) // ✅ Filter by userId
        )
      )
      .orderBy(desc(equityAssets.date));
  }

  static async getByExchange(exchange: Exchange, userId: string): Promise<EquityAssets[]> {
    return await db
      .select()
      .from(equityAssets)
      .where(
        and(
          eq(equityAssets.exchange, exchange),
          eq(equityAssets.userId, userId) // ✅ Filter by userId
        )
      )
      .orderBy(desc(equityAssets.date));
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
    userId: string // ✅ Add userId parameter
  ): Promise<EquityAssets[]> {
    return await db
      .select()
      .from(equityAssets)
      .where(
        and(
          between(equityAssets.date, startDate, endDate),
          eq(equityAssets.userId, userId) // ✅ Filter by userId
        )
      )
      .orderBy(desc(equityAssets.date));
  }

  static async update(
    id: number,
    data: Partial<NewEquityAssets>,
    userId: string // ✅ Add userId parameter
  ): Promise<EquityAssets> {
    const [updated] = await db
      .update(equityAssets)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(equityAssets.id, id),
          eq(equityAssets.userId, userId) // ✅ Ensure user owns this asset
        )
      )
      .returning();
    
    if (!updated) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }
    
    return updated;
  }

  static async delete(id: number, userId: string): Promise<void> {
    const result = await db
      .delete(equityAssets)
      .where(
        and(
          eq(equityAssets.id, id),
          eq(equityAssets.userId, userId) // ✅ Ensure user owns this asset
        )
      )
      .returning();
    
    if (result.length === 0) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }
  }

  static async getTotalSharesByCompany(company: string, userId: string): Promise<number> {
    const assets = await this.getByCompany(company, userId);
    return assets.reduce((sum, asset) => sum + asset.totalShares, 0);
  }

  static async getTotalInvestmentByCompany(company: string, userId: string): Promise<number> {
    const assets = await this.getByCompany(company, userId);
    return assets.reduce((sum, asset) => sum + asset.totalAmount, 0);
  }

  static async getPortfolioSummary(userId: string): Promise<{
    totalInvestment: number;
    totalShares: number;
    companies: string[];
  }> {
    const assets = await this.getAll(userId); // ✅ Pass userId

    return {
      totalInvestment: assets.reduce((sum, asset) => sum + asset.totalAmount, 0),
      totalShares: assets.reduce((sum, asset) => sum + asset.totalShares, 0),
      companies: [...new Set(assets.map((asset) => asset.company))],
    };
  }
}