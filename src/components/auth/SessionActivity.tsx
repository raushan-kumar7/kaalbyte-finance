import React, { useEffect, useMemo } from "react";
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import {
  Smartphone,
  Monitor,
  MapPin,
  LogOut,
  ShieldCheck,
  Clock,
  ShieldAlert,
} from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { useAuth } from "@/src/hooks/useAuth";
import { formatTimeAgo } from "@/src/utils/date";

const SessionActivity = () => {
  const {
    sessions,
    subscribeSessions,
    terminateSession,
    terminateOtherSessions,
    isLoading,
  } = useAuth();

  useEffect(() => {
    // subscribeSessions should be wrapped in useCallback in your useAuth hook
    // to prevent this effect from re-running unnecessarily.
    const unsubscribe = subscribeSessions();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [subscribeSessions]);

  const handleTerminate = (id: string) => {
    Alert.alert("Terminate Session", "Are you sure you want to log out of this device?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => terminateSession(id),
      },
    ]);
  };

  const handleSignOutOthers = () => {
    Alert.alert(
      "Secure Account",
      "This will sign you out of all devices except your current one. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out Others",
          style: "destructive",
          onPress: () => terminateOtherSessions(),
        },
      ],
    );
  };

  // Sort sessions: Current device always at the top
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => (a.isCurrent === b.isCurrent ? 0 : a.isCurrent ? -1 : 1));
  }, [sessions]);

  return (
    <View className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="py-6">
          {/* --- INFO HEADER --- */}
          <View className="bg-ui-card p-5 rounded-[24px] border border-white/5 mb-8 flex-row items-start">
            <View className="bg-gold-500/10 p-2 rounded-lg">
                <ShieldCheck size={20} color={colors.gold[500]} />
            </View>
            <View className="flex-1 ml-3">
              <Typo className="text-white font-sans-bold text-[14px] mb-1">
                Security Monitor
              </Typo>
              <Typo className="text-text-secondary font-sans text-[12px] leading-4">
                We track active sessions to help keep your account secure. If you see an unrecognized device, terminate it immediately.
              </Typo>
            </View>
          </View>

          {/* --- SESSION LIST --- */}
          <View className="flex-row items-center justify-between mb-4 px-2">
            <Typo className="text-text-secondary font-mono-bold text-[11px] uppercase tracking-[2px]">
              Active Sessions ({sessions.length})
            </Typo>
            {isLoading && <ActivityIndicator size="small" color={colors.gold[500]} />}
          </View>

          {sortedSessions.length === 0 && !isLoading ? (
            <View className="py-10 items-center">
                <Typo variant="secondary">No active sessions found.</Typo>
            </View>
          ) : (
            sortedSessions.map((item) => (
              <View
                key={item.id}
                className={`p-5 rounded-[24px] mb-4 border ${
                  item.isCurrent
                    ? "bg-gold-500/10 border-gold-500/20"
                    : "bg-white/5 border-white/5"
                }`}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View
                      className={`w-10 h-10 rounded-xl items-center justify-center ${
                        item.isCurrent ? "bg-gold-500" : "bg-white/10"
                      }`}
                    >
                      {item.type === "mobile" ? (
                        <Smartphone
                          size={20}
                          color={item.isCurrent ? colors.brand[900] : colors.text.secondary}
                        />
                      ) : (
                        <Monitor 
                          size={20} 
                          color={item.isCurrent ? colors.brand[900] : colors.text.secondary} 
                        />
                      )}
                    </View>
                    <View className="ml-3">
                      <Typo className="text-white font-sans-bold text-[15px]">
                        {item.device}
                      </Typo>
                      <Typo className="text-text-secondary font-sans text-[12px]">
                        {item.os} • {item.device || 'Native App'}
                      </Typo>
                    </View>
                  </View>
                  
                  {item.isCurrent ? (
                    <View className="bg-success-500/20 px-2 py-1 rounded-md border border-success-500/20">
                      <Typo className="text-success-500 font-mono-bold text-[8px] uppercase">
                        Current
                      </Typo>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleTerminate(item.id)}
                      className="p-2 bg-danger-500/10 rounded-full"
                    >
                      <LogOut size={16} color={colors.danger[500]} />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="flex-row items-center justify-between border-t border-white/5 pt-3">
                  <View className="flex-row items-center">
                    <MapPin size={12} color={colors.text.muted} />
                    <Typo className="text-text-muted text-[11px] ml-1">
                      {item.location}
                    </Typo>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={12} color={colors.text.muted} />
                    <Typo className="text-text-muted text-[11px] ml-1">
                      {formatTimeAgo(item.lastActive)}
                    </Typo>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* --- BULK ACTION --- */}
          {sessions.length > 1 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSignOutOthers}
              disabled={isLoading}
              className={`mt-4 flex-row items-center justify-center py-5 rounded-[24px] border border-danger-500/20 bg-danger-500/5 ${isLoading ? "opacity-50" : ""}`}
            >
              <ShieldAlert size={18} color={colors.danger[500]} />
              <Typo className="text-danger-500 font-sans-bold text-[14px] ml-2">
                {isLoading ? "Processing..." : "Sign out of all other devices"}
              </Typo>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SessionActivity;