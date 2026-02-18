// import { useState, useCallback } from "react";
// import { Alert } from "react-native";
// import * as MailComposer from "expo-mail-composer";
// import * as FileSystem from "expo-file-system/legacy";
// import { exportToPDF } from "@/src/utils/export/pdfExport";
// import { exportToExcel } from "@/src/utils/export/excelExport";
// import type { ExportData } from "@/src/utils/export";

// export type ReportFormat = "PDF" | "EXCEL";

// interface UseReportPreferenceOptions {
//   userEmail?: string;
//   userName?: string;
// }

// interface UseReportPreferenceReturn {
//   reportFormat: ReportFormat;
//   setReportFormat: (fmt: ReportFormat) => void;
//   isSending: boolean;
//   sendReportEmail: (data: ExportData) => Promise<void>;
// }

// export const useReportPreference = ({
//   userEmail = "",
//   userName = "Account Holder",
// }: UseReportPreferenceOptions = {}): UseReportPreferenceReturn => {
//   const [reportFormat, setReportFormat] = useState<ReportFormat>("PDF");
//   const [isSending, setIsSending] = useState(false);

//   const sendReportEmail = useCallback(
//     async (data: ExportData) => {
//       // Check mail availability
//       const isAvailable = await MailComposer.isAvailableAsync();
//       if (!isAvailable) {
//         Alert.alert(
//           "Mail Not Available",
//           "No mail account is configured on this device. Please set up a mail account in your device settings.",
//           [{ text: "OK" }],
//         );
//         return;
//       }

//       setIsSending(true);

//       try {
//         let attachmentUri: string;
//         let mimeType: string;
//         let fileName: string;
//         const monthSlug = data.month.replace(/ /g, "_");

//         if (reportFormat === "PDF") {
//           // Generate PDF to local filesystem
//           await exportToPDF(data, userName, userEmail);
//           attachmentUri = `${FileSystem.documentDirectory}${monthSlug}_statement.pdf`;
//           mimeType = "application/pdf";
//           fileName = `${monthSlug}_statement.pdf`;
//         } else {
//           // Generate Excel to local filesystem
//           await exportToExcel(data);
//           attachmentUri = `${FileSystem.documentDirectory}${monthSlug}_statement.xlsx`;
//           mimeType =
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//           fileName = `${monthSlug}_statement.xlsx`;
//         }

//         // Verify the file actually exists before attaching
//         const fileInfo = await FileSystem.getInfoAsync(attachmentUri);
//         if (!fileInfo.exists) {
//           throw new Error("Generated file not found at expected path.");
//         }

//         // Open native mail composer with pre-filled fields
//         const result = await MailComposer.composeAsync({
//           recipients: userEmail ? [userEmail] : [],
//           subject: `KaalByte Finance · ${data.month} Expense Statement`,
//           body: buildEmailBody(data, userName, reportFormat),
//           isHtml: false,
//           attachments: [attachmentUri],
//         });

//         if (result.status === MailComposer.MailComposerStatus.SENT) {
//           Alert.alert(
//             "Statement Sent",
//             `Your ${data.month} expense statement has been sent successfully.`,
//             [{ text: "OK" }],
//           );
//         }
//         // CANCELLED and SAVED are silent — user chose not to send, that's fine
//       } catch (err) {
//         Alert.alert(
//           "Send Failed",
//           "Could not prepare the report for email. Please try exporting it manually.",
//           [{ text: "OK" }],
//         );
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [reportFormat, userEmail, userName],
//   );

//   return {
//     reportFormat,
//     setReportFormat,
//     isSending,
//     sendReportEmail,
//   };
// };

// // ─── Email body builder ───────────────────────────────────────────────────────

// function buildEmailBody(
//   data: ExportData,
//   userName: string,
//   format: ReportFormat,
// ): string {
//   const surplus = data.totalIncome - data.grandTotal;
//   const isOverBudget = surplus < 0;
//   const surplusLine =
//     data.totalIncome > 0
//       ? `${isOverBudget ? "Deficit" : "Surplus"}: ₹${Math.abs(surplus).toLocaleString("en-IN")} (${Math.abs((surplus / data.totalIncome) * 100).toFixed(1)}% of income)`
//       : "";

//   return [
//     `Hi ${userName},`,
//     ``,
//     `Please find your KaalByte Finance expense statement for ${data.month} attached to this email.`,
//     ``,
//     `── Statement Summary ──────────────────`,
//     `Period      : ${data.month_range}`,
//     `Total Income: ₹${data.totalIncome > 0 ? data.totalIncome.toLocaleString("en-IN") : "—"}`,
//     `Total Spent : ₹${data.grandTotal.toLocaleString("en-IN")}`,
//     surplusLine,
//     `Format      : ${format === "PDF" ? "PDF Report" : "Excel Spreadsheet"}`,
//     `────────────────────────────────────────`,
//     ``,
//     `This statement is auto-generated by KaalByte Finance for personal reference only.`,
//     `It does not constitute an official financial document.`,
//     ``,
//     `— KaalByte Finance`,
//   ]
//     .filter((line) => line !== undefined)
//     .join("\n");
// }


import { useState, useCallback } from "react";
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system/legacy";
import { exportToPDF } from "@/src/utils/export/pdfExport";
import { exportToExcel } from "@/src/utils/export/excelExport";
import type { ExportData } from "@/src/utils/export";
import { showToast } from "@/src/utils/toast";

export type ReportFormat = "PDF" | "EXCEL";

interface UseReportPreferenceOptions {
  userEmail?: string;
  userName?: string;
}

interface UseReportPreferenceReturn {
  reportFormat: ReportFormat;
  setReportFormat: (fmt: ReportFormat) => void;
  isSending: boolean;
  sendReportEmail: (data: ExportData) => Promise<void>;
}

export const useReportPreference = ({
  userEmail = "",
  userName = "Account Holder",
}: UseReportPreferenceOptions = {}): UseReportPreferenceReturn => {
  const [reportFormat, setReportFormat] = useState<ReportFormat>("PDF");
  const [isSending, setIsSending] = useState(false);

  const sendReportEmail = useCallback(
    async (data: ExportData) => {
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        showToast.error(
          "Mail Not Available",
          "Please set up a mail account in your device settings."
        );
        return;
      }

      setIsSending(true);

      try {
        let attachmentUri: string;
        const monthSlug = data.month.replace(/ /g, "_");

        if (reportFormat === "PDF") {
          await exportToPDF(data, userName, userEmail);
          attachmentUri = `${FileSystem.documentDirectory}${monthSlug}_statement.pdf`;
        } else {
          await exportToExcel(data);
          attachmentUri = `${FileSystem.documentDirectory}${monthSlug}_statement.xlsx`;
        }

        const fileInfo = await FileSystem.getInfoAsync(attachmentUri);
        if (!fileInfo.exists) {
          throw new Error("File generation failed");
        }

        const result = await MailComposer.composeAsync({
          recipients: userEmail ? [userEmail] : [],
          subject: `KaalByte Finance · ${data.month} Expense Statement`,
          body: buildEmailBody(data, userName, reportFormat),
          isHtml: false,
          attachments: [attachmentUri],
        });

        if (result.status === MailComposer.MailComposerStatus.SENT) {
          showToast.success(
            "Statement Sent",
            `Your ${data.month} statement was sent successfully.`
          );
        }
      } catch (error) {
        console.error("Export Error:", error);
        showToast.error(
          "Send Failed",
          "Could not prepare report. Please try exporting manually."
        );
      } finally {
        setIsSending(false);
      }
    },
    [reportFormat, userEmail, userName]
  );

  return {
    reportFormat,
    setReportFormat,
    isSending,
    sendReportEmail,
  };
};

// ─── Email body builder ───────────────────────────────────────────────────────

function buildEmailBody(
  data: ExportData,
  userName: string,
  format: ReportFormat,
): string {
  const surplus = data.totalIncome - data.grandTotal;
  const isOverBudget = surplus < 0;
  const surplusLine =
    data.totalIncome > 0
      ? `${isOverBudget ? "Deficit" : "Surplus"}: ₹${Math.abs(surplus).toLocaleString("en-IN")} (${Math.abs((surplus / data.totalIncome) * 100).toFixed(1)}% of income)`
      : "";

  return [
    `Hi ${userName},`,
    "",
    `Please find your KaalByte Finance expense statement for ${data.month} attached.`,
    "",
    "── Statement Summary ──────────────────",
    `Period      : ${data.month_range}`,
    `Total Income: ₹${data.totalIncome > 0 ? data.totalIncome.toLocaleString("en-IN") : "—"}`,
    `Total Spent : ₹${data.grandTotal.toLocaleString("en-IN")}`,
    surplusLine,
    `Format      : ${format === "PDF" ? "PDF Report" : "Excel Spreadsheet"}`,
    "────────────────────────────────────────",
    "",
    "This statement is auto-generated by KaalByte Finance.",
    "",
    "— KaalByte Finance",
  ].join("\n");
}