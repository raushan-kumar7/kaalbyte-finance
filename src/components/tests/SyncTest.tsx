import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Typo } from "@/src/components";
import { SyncService } from "@/src/services";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  CloudUpload,
  Clock,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { auth } from "@/src/config/firebase";

type SyncStatus = "idle" | "syncing" | "success" | "error";

export const SyncTest = () => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [message, setMessage] = useState<string>("Tap to test sync");
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    SyncService.getLastSyncTime().then((time) => {
      if (time) {
        const date = new Date(time);
        setLastSync(date.toLocaleTimeString());
        setStatus("success");
        setMessage("Cloud backup is up to date");
      }
    });
  }, []);

  const handleSync = async () => {
    setStatus("syncing");
    setMessage("Fetching local data...");

    try {
      // 1. Manually check if there is data to sync first
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // 2. Perform sync
      await SyncService.performSync();

      // 3. Update UI
      const time = await SyncService.getLastSyncTime();
      if (time) setLastSync(new Date(time).toLocaleTimeString());

      setStatus("success");
      setMessage("Sync finished! Refresh Turso Dashboard.");
    } catch (err: any) {
      console.error("[SyncTest] Error:", err);
      setStatus("error");
      setMessage(err?.message ?? "Sync failed");
    }
  };
  
  const StatusIcon = () => {
    if (status === "syncing")
      return <ActivityIndicator size="small" color={colors.gold[500]} />;
    if (status === "success") return <CheckCircle size={20} color="#22c55e" />;
    if (status === "error") return <XCircle size={20} color="#ef4444" />;
    return <CloudUpload size={20} color={colors.gold[500]} />;
  };

  const borderColor =
    status === "success"
      ? "border-green-500"
      : status === "error"
        ? "border-red-500"
        : status === "syncing"
          ? "border-gold-500"
          : "border-white/20";

  return (
    <View
      className={`mx-4 my-3 rounded-2xl border p-4 bg-white/5 ${borderColor}`}
    >
      {/** Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Typo className="text-xs font-mono text-text-secondary uppercase tracking-widest">
          Cloud Sync Status
        </Typo>
        <StatusIcon />
      </View>

      {/** Message */}
      <Typo
        className={`text-sm mb-3 ${
          status === "success"
            ? "text-green-400"
            : status === "error"
              ? "text-red-400"
              : "text-text-secondary"
        }`}
      >
        {message}
      </Typo>

      {/** Last sync time */}
      {lastSync && (
        <View className="flex-row items-center gap-1 mb-3">
          <Clock size={12} color={colors.gold[500]} />
          <Typo className="text-xs text-text-secondary font-mono">
            Last synced at {lastSync}
          </Typo>
        </View>
      )}

      {/** Trigger button */}
      <TouchableOpacity
        onPress={handleSync}
        disabled={status === "syncing"}
        className={`flex-row items-center justify-center gap-2 py-2.5 rounded-xl border ${
          status === "syncing"
            ? "border-white/10 opacity-50"
            : "border-gold-500/60 active:opacity-70"
        }`}
      >
        <RefreshCw
          size={14}
          color={colors.gold[500]}
          style={status === "syncing" ? { opacity: 0.4 } : undefined}
        />
        <Typo className="text-sm text-gold-500 font-mono">
          {status === "syncing" ? "Syncing..." : "Trigger Sync Now"}
        </Typo>
      </TouchableOpacity>
    </View>
  );
};
