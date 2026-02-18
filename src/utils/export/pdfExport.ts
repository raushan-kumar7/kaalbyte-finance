import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { buildPdfHtml } from "./pdfTemplate";
import { ExportData } from "@/src/types/export-data";

// ─────────────────────────────────────────────────────────────────────────────
// PDF Export — delegates HTML generation to pdfTemplate.ts
// ─────────────────────────────────────────────────────────────────────────────

export const exportToPDF = async (
  data: ExportData,
  userName: string = "Account Holder",
  userEmail: string = "",
): Promise<void> => {
  const html = buildPdfHtml(data, userName, userEmail);

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const dest = `${FileSystem.documentDirectory}${data.month.replace(/ /g, "_")}_statement.pdf`;
  await FileSystem.moveAsync({ from: uri, to: dest });
  await Sharing.shareAsync(dest, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: `${data.month} Expense Statement`,
  });
};
