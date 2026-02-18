// import { EquityAssets, NewEquityAssets } from "../db/schema";
// import { EquityAssetsRepository } from "../repositories";
// import { Exchange } from "../types/finance";
// import { equityAssetSchema } from "../validations/finance";

// export class EquityAssetsService {
//   static async createAsset(data: NewEquityAssets): Promise<EquityAssets> {
//     const assetData = {
//       ...data,
//       totalAmount: data.totalAmount || data.pricePerShare * data.totalShares,
//     };

//     // Map to snake_case ONLY for validation to match equityAssetSchema
//     await equityAssetSchema.validate({
//       ...assetData,
//       price_per_share: assetData.pricePerShare,
//       total_shares: assetData.totalShares,
//       total_amount: assetData.totalAmount,
//     });

//     return await EquityAssetsRepository.create(assetData);
//   }

//   static async getAllAssets(): Promise<EquityAssets[]> {
//     return await EquityAssetsRepository.getAll();
//   }

//   static async getAssetById(id: number): Promise<EquityAssets | undefined> {
//     return await EquityAssetsRepository.getById(id);
//   }

//   static async getAssetsByCompany(company: string): Promise<EquityAssets[]> {
//     return await EquityAssetsRepository.getByCompany(company);
//   }

//   static async getAssetsByExchange(
//     exchange: Exchange,
//   ): Promise<EquityAssets[]> {
//     return await EquityAssetsRepository.getByExchange(exchange);
//   }

//   static async updateAsset(id: number, data: Partial<NewEquityAssets>): Promise<EquityAssets> {
//     const existing = await EquityAssetsRepository.getById(id);
//     if (!existing) throw new Error(`Asset with id ${id} not found`);

//     const updateData = { ...data };
//     if (data.pricePerShare || data.totalShares) {
//       const pricePerShare = data.pricePerShare || existing.pricePerShare;
//       const totalShares = data.totalShares || existing.totalShares;
//       updateData.totalAmount = pricePerShare * totalShares;
//     }

//     const merged = { ...existing, ...updateData };
    
//     // Map to snake_case ONLY for validation
//     await equityAssetSchema.validate({
//       ...merged,
//       price_per_share: merged.pricePerShare,
//       total_shares: merged.totalShares,
//       total_amount: merged.totalAmount,
//     });

//     return await EquityAssetsRepository.update(id, updateData);
//   }

//   static async deleteAsset(id: number): Promise<void> {
//     const existing = await EquityAssetsRepository.getById(id);
//     if (!existing) {
//       throw new Error(`Asset with id ${id} not found`);
//     }

//     await EquityAssetsRepository.delete(id);
//   }

//   static async getCompanySummary(company: string): Promise<{
//     totalShares: number;
//     totalInvestment: number;
//     averagePrice: number;
//     transactionCount: number;
//   }> {
//     const assets = await EquityAssetsRepository.getByCompany(company);

//     const totalShares = assets.reduce(
//       (sum, asset) => sum + asset.totalShares,
//       0,
//     );
//     const totalInvestment = assets.reduce(
//       (sum, asset) => sum + asset.totalAmount,
//       0,
//     );
//     const averagePrice = totalShares > 0 ? totalInvestment / totalShares : 0;

//     return {
//       totalShares,
//       totalInvestment,
//       averagePrice,
//       transactionCount: assets.length,
//     };
//   }

//   static async calculateCurrentValue(
//     currentPrices: Record<string, number>,
//   ): Promise<{
//     holdings: {
//       company: string;
//       shares: number;
//       averageBuyPrice: number;
//       currentPrice: number;
//       investment: number;
//       currentValue: number;
//       profitLoss: number;
//       profitLossPercentage: number;
//     }[];
//     totalInvestment: number;
//     totalCurrentValue: number;
//     totalProfitLoss: number;
//     totalProfitLossPercentage: number;
//   }> {
//     const portfolioSummary = await EquityAssetsRepository.getPortfolioSummary();
//     const holdings: {
//       company: string;
//       shares: number;
//       averageBuyPrice: number;
//       currentPrice: number;
//       investment: number;
//       currentValue: number;
//       profitLoss: number;
//       profitLossPercentage: number;
//     }[] = [];

//     for (const company of portfolioSummary.companies) {
//       const summary = await this.getCompanySummary(company);
//       const currentPrice = currentPrices[company] || 0;
//       const currentValue = summary.totalShares * currentPrice;
//       const profitLoss = currentValue - summary.totalInvestment;
//       const profitLossPercentage = (profitLoss / summary.totalInvestment) * 100;

//       holdings.push({
//         company,
//         shares: summary.totalShares,
//         averageBuyPrice: summary.averagePrice,
//         currentPrice,
//         investment: summary.totalInvestment,
//         currentValue,
//         profitLoss,
//         profitLossPercentage,
//       });
//     }

//     const totalInvestment = holdings.reduce((sum, h) => sum + h.investment, 0);
//     const totalCurrentValue = holdings.reduce(
//       (sum, h) => sum + h.currentValue,
//       0,
//     );
//     const totalProfitLoss = totalCurrentValue - totalInvestment;
//     const totalProfitLossPercentage = (totalProfitLoss / totalInvestment) * 100;

//     return {
//       holdings,
//       totalInvestment,
//       totalCurrentValue,
//       totalProfitLoss,
//       totalProfitLossPercentage,
//     };
//   }

//   static async getPortfolioSummary(): Promise<{
//     totalInvestment: number;
//     totalShares: number;
//     uniqueCompanies: number;
//     companiesList: string[];
//   }> {
//     const summary = await EquityAssetsRepository.getPortfolioSummary();

//     return {
//       totalInvestment: summary.totalInvestment,
//       totalShares: summary.totalShares,
//       uniqueCompanies: summary.companies.length,
//       companiesList: summary.companies,
//     };
//   }

//   static async getExchangeDiversification(): Promise<
//     Record<
//       Exchange,
//       {
//         investment: number;
//         percentage: number;
//         companies: number;
//       }
//     >
//   > {
//     const allAssets = await EquityAssetsRepository.getAll();
//     const totalInvestment = allAssets.reduce(
//       (sum, asset) => sum + asset.totalAmount,
//       0,
//     );

//     const nseAssets = allAssets.filter((a) => a.exchange === Exchange.NSE);
//     const bseAssets = allAssets.filter((a) => a.exchange === Exchange.BSE);

//     const nseInvestment = nseAssets.reduce(
//       (sum, asset) => sum + asset.totalAmount,
//       0,
//     );
//     const bseInvestment = bseAssets.reduce(
//       (sum, asset) => sum + asset.totalAmount,
//       0,
//     );

//     return {
//       [Exchange.NSE]: {
//         investment: nseInvestment,
//         percentage: (nseInvestment / totalInvestment) * 100,
//         companies: new Set(nseAssets.map((a) => a.company)).size,
//       },
//       [Exchange.BSE]: {
//         investment: bseInvestment,
//         percentage: (bseInvestment / totalInvestment) * 100,
//         companies: new Set(bseAssets.map((a) => a.company)).size,
//       },
//     };
//   }
// }



import { EquityAssets, NewEquityAssets } from "../db/schema";
import { EquityAssetsRepository } from "../repositories";
import { Exchange } from "../types/finance";
import { equityAssetSchema } from "../validations/finance";

export class EquityAssetsService {
  static async createAsset(data: NewEquityAssets, userId: string): Promise<EquityAssets> {
    const assetData = {
      ...data,
      totalAmount: data.totalAmount || data.pricePerShare * data.totalShares,
    };

    await equityAssetSchema.validate({
      ...assetData,
      user_id: userId, // ✅ Map to snake_case
      price_per_share: assetData.pricePerShare,
      total_shares: assetData.totalShares,
      total_amount: assetData.totalAmount,
    });

    return await EquityAssetsRepository.create(assetData, userId);
  }

  static async getAllAssets(userId: string): Promise<EquityAssets[]> {
    return await EquityAssetsRepository.getAll(userId);
  }

  static async getAssetById(id: number, userId: string): Promise<EquityAssets | undefined> {
    return await EquityAssetsRepository.getById(id, userId);
  }

  static async getAssetsByCompany(company: string, userId: string): Promise<EquityAssets[]> {
    return await EquityAssetsRepository.getByCompany(company, userId);
  }

  static async getAssetsByExchange(exchange: Exchange, userId: string): Promise<EquityAssets[]> {
    return await EquityAssetsRepository.getByExchange(exchange, userId);
  }

  static async updateAsset(
    id: number,
    data: Partial<NewEquityAssets>,
    userId: string // ✅ Add userId parameter
  ): Promise<EquityAssets> {
    const existing = await EquityAssetsRepository.getById(id, userId);
    if (!existing) throw new Error(`Asset with id ${id} not found or unauthorized`);

    const updateData = { ...data };
    if (data.pricePerShare || data.totalShares) {
      const pricePerShare = data.pricePerShare || existing.pricePerShare;
      const totalShares = data.totalShares || existing.totalShares;
      updateData.totalAmount = pricePerShare * totalShares;
    }

    const merged = { ...existing, ...updateData };

    await equityAssetSchema.validate({
      ...merged,
      user_id: userId, // ✅ Map to snake_case
      price_per_share: merged.pricePerShare,
      total_shares: merged.totalShares,
      total_amount: merged.totalAmount,
    });

    return await EquityAssetsRepository.update(id, updateData, userId);
  }

  static async deleteAsset(id: number, userId: string): Promise<void> {
    const existing = await EquityAssetsRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }

    await EquityAssetsRepository.delete(id, userId);
  }

  static async getCompanySummary(
    company: string,
    userId: string // ✅ Add userId parameter
  ): Promise<{
    totalShares: number;
    totalInvestment: number;
    averagePrice: number;
    transactionCount: number;
  }> {
    const assets = await EquityAssetsRepository.getByCompany(company, userId);

    const totalShares = assets.reduce((sum, asset) => sum + asset.totalShares, 0);
    const totalInvestment = assets.reduce((sum, asset) => sum + asset.totalAmount, 0);
    const averagePrice = totalShares > 0 ? totalInvestment / totalShares : 0;

    return {
      totalShares,
      totalInvestment,
      averagePrice,
      transactionCount: assets.length,
    };
  }

  static async calculateCurrentValue(
    currentPrices: Record<string, number>,
    userId: string // ✅ Add userId parameter
  ): Promise<{
    holdings: {
      company: string;
      shares: number;
      averageBuyPrice: number;
      currentPrice: number;
      investment: number;
      currentValue: number;
      profitLoss: number;
      profitLossPercentage: number;
    }[];
    totalInvestment: number;
    totalCurrentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
  }> {
    const portfolioSummary = await EquityAssetsRepository.getPortfolioSummary(userId);
    const holdings: any[] = [];

    for (const company of portfolioSummary.companies) {
      const summary = await this.getCompanySummary(company, userId);
      const currentPrice = currentPrices[company] || 0;
      const currentValue = summary.totalShares * currentPrice;
      const profitLoss = currentValue - summary.totalInvestment;
      const profitLossPercentage = (profitLoss / summary.totalInvestment) * 100;

      holdings.push({
        company,
        shares: summary.totalShares,
        averageBuyPrice: summary.averagePrice,
        currentPrice,
        investment: summary.totalInvestment,
        currentValue,
        profitLoss,
        profitLossPercentage,
      });
    }

    const totalInvestment = holdings.reduce((sum, h) => sum + h.investment, 0);
    const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalProfitLoss = totalCurrentValue - totalInvestment;
    const totalProfitLossPercentage = (totalProfitLoss / totalInvestment) * 100;

    return {
      holdings,
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercentage,
    };
  }

  static async getPortfolioSummary(userId: string): Promise<{
    totalInvestment: number;
    totalShares: number;
    uniqueCompanies: number;
    companiesList: string[];
  }> {
    const summary = await EquityAssetsRepository.getPortfolioSummary(userId);

    return {
      totalInvestment: summary.totalInvestment,
      totalShares: summary.totalShares,
      uniqueCompanies: summary.companies.length,
      companiesList: summary.companies,
    };
  }

  static async getExchangeDiversification(userId: string): Promise<
    Record<
      Exchange,
      {
        investment: number;
        percentage: number;
        companies: number;
      }
    >
  > {
    const allAssets = await EquityAssetsRepository.getAll(userId);
    const totalInvestment = allAssets.reduce((sum, asset) => sum + asset.totalAmount, 0);

    const nseAssets = allAssets.filter((a) => a.exchange === Exchange.NSE);
    const bseAssets = allAssets.filter((a) => a.exchange === Exchange.BSE);

    const nseInvestment = nseAssets.reduce((sum, asset) => sum + asset.totalAmount, 0);
    const bseInvestment = bseAssets.reduce((sum, asset) => sum + asset.totalAmount, 0);

    return {
      [Exchange.NSE]: {
        investment: nseInvestment,
        percentage: (nseInvestment / totalInvestment) * 100,
        companies: new Set(nseAssets.map((a) => a.company)).size,
      },
      [Exchange.BSE]: {
        investment: bseInvestment,
        percentage: (bseInvestment / totalInvestment) * 100,
        companies: new Set(bseAssets.map((a) => a.company)).size,
      },
    };
  }
}
