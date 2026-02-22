import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Typo } from "@/src/components";
import { SyncService } from "@/src/services";
import {
  CheckCircle,
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
    const initStatus = async () => {
      const time = await SyncService.getLastSyncTime();
      if (time) {
        setLastSync(new Date(time).toLocaleTimeString());
        setStatus("success");
      }
    };
    initStatus();
  }, []);

  const handleSync = async () => {
    setStatus("syncing");
    setMessage("Syncing with Cloud...");

    try {
      if (!auth.currentUser) throw new Error("Please log in first");

      await SyncService.performSync();

      const time = await SyncService.getLastSyncTime();
      if (time) setLastSync(new Date(time).toLocaleTimeString());

      setStatus("success");
      setMessage("Backup complete!");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Sync failed");
    }
  };

  const borderColor =
    status === "success"
      ? "border-green-500"
      : status === "error"
        ? "border-red-500"
        : "border-white/20";

  return (
    <View
      className={`mx-4 my-3 rounded-2xl border p-4 bg-white/5 ${borderColor}`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Typo className="text-xs font-mono text-text-secondary uppercase tracking-widest">
          Cloud Sync Status
        </Typo>
        {status === "syncing" ? (
          <ActivityIndicator size="small" color={colors.gold[500]} />
        ) : status === "success" ? (
          <CheckCircle size={20} color="#22c55e" />
        ) : (
          <CloudUpload size={20} color={colors.gold[500]} />
        )}
      </View>

      <Typo
        className={`text-sm mb-3 ${status === "success" ? "text-green-400" : status === "error" ? "text-red-400" : "text-text-secondary"}`}
      >
        {message}
      </Typo>

      {lastSync && (
        <View className="flex-row items-center gap-1 mb-3">
          <Clock size={12} color={colors.gold[500]} />
          <Typo className="text-xs text-text-secondary font-mono">
            Last synced at {lastSync}
          </Typo>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSync}
        disabled={status === "syncing"}
        className="flex-row items-center justify-center gap-2 py-2.5 rounded-xl border border-gold-500/60"
      >
        <RefreshCw size={14} color={colors.gold[500]} />
        <Typo className="text-sm text-gold-500 font-mono">
          {status === "syncing" ? "Syncing..." : "Sync Now"}
        </Typo>
      </TouchableOpacity>
    </View>
  );
};
