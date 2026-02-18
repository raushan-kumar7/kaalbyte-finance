// import { DigitalAssets, NewDigitalAssets } from "../db/schema";
// import { DigitalAssetsRepository } from "../repositories";
// import { DigitalGoldOrSilverAssetType } from "../types/finance";
// import { goldAssetSchema } from "../validations/finance";

// export class DigitalAssetsService {
//   /**
//    * Helper to map our camelCase Database/UI object to 
//    * the snake_case object expected by the Yup Validation Schema.
//    */
//   private static mapToValidationSchema(data: any) {
//     return {
//       date: data.date,
//       platform: data.platform,
//       rate_per_gram: data.ratePerGram,
//       amount_paid: data.amountPaid,
//       gst_3_percent: data.gst3Percent,
//       weight_g: data.weightG,
//       gold_value: data.assetValue,
//     };
//   }

//   static async createAsset(data: NewDigitalAssets): Promise<DigitalAssets> {
//     const assetData = { ...data };

//     // 1. Calculate values if missing
//     if (!assetData.weightG) {
//       assetData.weightG = this.calculateWeight(
//         assetData.amountPaid,
//         assetData.ratePerGram,
//         assetData.gst3Percent || 0
//       );
//     }

//     if (!assetData.assetValue) {
//       assetData.assetValue = assetData.weightG * assetData.ratePerGram;
//     }

//     // 2. Map to snake_case for Validation ONLY
//     const validationObject = this.mapToValidationSchema(assetData);
//     await goldAssetSchema.validate(validationObject);

//     // 3. Save the original camelCase object to Repository
//     return await DigitalAssetsRepository.create(assetData);
//   }

//   private static calculateWeight(
//     amountPaid: number,
//     ratePerGram: number,
//     gst: number
//   ): number {
//     const amountBeforeGst = amountPaid - gst;
//     return ratePerGram > 0 ? amountBeforeGst / ratePerGram : 0;
//   }

//   static async updateAsset(
//     id: number,
//     data: Partial<NewDigitalAssets>
//   ): Promise<DigitalAssets> {
//     const existing = await DigitalAssetsRepository.getById(id);
//     if (!existing) {
//       throw new Error(`Asset with id ${id} not found`);
//     }

//     const updateData = { ...data };

//     // Recalculate values if money fields changed
//     if (data.amountPaid || data.ratePerGram || data.gst3Percent !== undefined) {
//       const amountPaid = data.amountPaid ?? existing.amountPaid;
//       const ratePerGram = data.ratePerGram ?? existing.ratePerGram;
//       const gst = data.gst3Percent ?? existing.gst3Percent;

//       updateData.weightG = this.calculateWeight(amountPaid, ratePerGram, gst);
//       updateData.assetValue = updateData.weightG * ratePerGram;
//     }

//     // Validate the merged result in snake_case
//     const mergedForValidation = this.mapToValidationSchema({
//       ...existing,
//       ...updateData,
//     });
//     await goldAssetSchema.validate(mergedForValidation);

//     return await DigitalAssetsRepository.update(id, updateData);
//   }

//   // --- Static Helper Methods ---

//   static async getAllAssets(): Promise<DigitalAssets[]> {
//     return await DigitalAssetsRepository.getAll();
//   }

//   static async getAssetsByType(
//     type: DigitalGoldOrSilverAssetType
//   ): Promise<DigitalAssets[]> {
//     return await DigitalAssetsRepository.getByType(type);
//   }

//   static async deleteAsset(id: number): Promise<void> {
//     return await DigitalAssetsRepository.delete(id);
//   }

//   static async getPortfolioSummary(type: DigitalGoldOrSilverAssetType) {
//     const assets = await DigitalAssetsRepository.getByType(type);

//     const totalWeight = assets.reduce((sum, a) => sum + a.weightG, 0);
//     const totalInvestment = assets.reduce((sum, a) => sum + a.amountPaid, 0);
//     const totalValue = assets.reduce((sum, a) => sum + a.assetValue, 0);
//     const averageRate = totalWeight > 0 ? totalValue / totalWeight : 0;

//     return {
//       totalWeight,
//       totalValue,
//       totalInvestment,
//       averageRate,
//       assetCount: assets.length,
//     };
//   }
// }


import { DigitalAssets, NewDigitalAssets } from "../db/schema";
import { DigitalAssetsRepository } from "../repositories";
import { DigitalGoldOrSilverAssetType } from "../types/finance";
import { goldAssetSchema } from "../validations/finance";

export class DigitalAssetsService {
  private static mapToValidationSchema(data: any) {
    return {
      user_id: data.userId, // ✅ Map userId to snake_case
      date: data.date,
      platform: data.platform,
      rate_per_gram: data.ratePerGram,
      amount_paid: data.amountPaid,
      gst_3_percent: data.gst3Percent,
      weight_g: data.weightG,
      gold_value: data.assetValue,
    };
  }

  static async createAsset(data: NewDigitalAssets, userId: string): Promise<DigitalAssets> {
    const assetData = { ...data };

    if (!assetData.weightG) {
      assetData.weightG = this.calculateWeight(
        assetData.amountPaid,
        assetData.ratePerGram,
        assetData.gst3Percent || 0
      );
    }

    if (!assetData.assetValue) {
      assetData.assetValue = assetData.weightG * assetData.ratePerGram;
    }

    const validationObject = this.mapToValidationSchema({ ...assetData, userId });
    await goldAssetSchema.validate(validationObject);

    return await DigitalAssetsRepository.create(assetData, userId);
  }

  private static calculateWeight(amountPaid: number, ratePerGram: number, gst: number): number {
    const amountBeforeGst = amountPaid - gst;
    return ratePerGram > 0 ? amountBeforeGst / ratePerGram : 0;
  }

  static async updateAsset(
    id: number,
    data: Partial<NewDigitalAssets>,
    userId: string // ✅ Add userId parameter
  ): Promise<DigitalAssets> {
    const existing = await DigitalAssetsRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Asset with id ${id} not found or unauthorized`);
    }

    const updateData = { ...data };

    if (data.amountPaid || data.ratePerGram || data.gst3Percent !== undefined) {
      const amountPaid = data.amountPaid ?? existing.amountPaid;
      const ratePerGram = data.ratePerGram ?? existing.ratePerGram;
      const gst = data.gst3Percent ?? existing.gst3Percent;

      updateData.weightG = this.calculateWeight(amountPaid, ratePerGram, gst);
      updateData.assetValue = updateData.weightG * ratePerGram;
    }

    const mergedForValidation = this.mapToValidationSchema({
      ...existing,
      ...updateData,
      userId,
    });
    await goldAssetSchema.validate(mergedForValidation);

    return await DigitalAssetsRepository.update(id, updateData, userId);
  }

  static async getAllAssets(userId: string): Promise<DigitalAssets[]> {
    return await DigitalAssetsRepository.getAll(userId);
  }

  static async getAssetsByType(
    type: DigitalGoldOrSilverAssetType,
    userId: string // ✅ Add userId parameter
  ): Promise<DigitalAssets[]> {
    return await DigitalAssetsRepository.getByType(type, userId);
  }

  static async deleteAsset(id: number, userId: string): Promise<void> {
    return await DigitalAssetsRepository.delete(id, userId);
  }

  static async getPortfolioSummary(
    type: DigitalGoldOrSilverAssetType,
    userId: string // ✅ Add userId parameter
  ) {
    const assets = await DigitalAssetsRepository.getByType(type, userId);

    const totalWeight = assets.reduce((sum, a) => sum + a.weightG, 0);
    const totalInvestment = assets.reduce((sum, a) => sum + a.amountPaid, 0);
    const totalValue = assets.reduce((sum, a) => sum + a.assetValue, 0);
    const averageRate = totalWeight > 0 ? totalValue / totalWeight : 0;

    return {
      totalWeight,
      totalValue,
      totalInvestment,
      averageRate,
      assetCount: assets.length,
    };
  }
}