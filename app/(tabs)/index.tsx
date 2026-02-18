import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, View, TouchableOpacity, Modal } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import {
  ScreenWrapper,
  PeriodHeader,
  AddDailyExpense,
  AddMonthlyIncome,
  AddDigitalGoldSilverTxn,
  AddMenu,
  DailyActivity,
  WeeklyActivity,
  MonthlyActivity,
  AddEquityTxn,
  DashboardCarousel,
  Typo,
  Image,
} from "@/src/components";
import { TrendingUp, User } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useAuth } from "@/src/hooks/useAuth";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// Define the route params type
type HomeRouteParams = {
  openMenu?: boolean;
};

const HomeDashboard = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: HomeRouteParams }, "params">>();
  const navigation = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeForm, setActiveForm] = useState<
    "expense" | "income" | "digital_asset" | "equity" | null
  >(null);
  const [filter, setFilter] = useState("Daily");
  const greeting = getGreeting();

  const handleCloseMenu = () => setIsMenuVisible(false);

  useEffect(() => {
    if (route.params?.openMenu) {
      setIsMenuVisible(true);
      // Reset the param to prevent auto-opening on refresh
      navigation.setParams({ openMenu: undefined } as any);
    }
  }, [route.params?.openMenu, navigation]);

  const handleSelectAction = (
    type: "expense" | "income" | "digital_asset" | "equity",
  ) => {
    setIsMenuVisible(false);
    setTimeout(() => {
      setActiveForm(type);
    }, 300);
  };

  const closeForm = useCallback(() => setActiveForm(null), []);

  const renderActivity = () => {
    switch (filter) {
      case "Daily":
        return <DailyActivity />;
      case "Weekly":
        return <WeeklyActivity />;
      case "Monthly":
        return <MonthlyActivity />;
      default:
        return <DailyActivity />;
    }
  };

  return (
    <ScreenWrapper className="px-4">
      <View>
        <View className="flex-row justify-between items-start py-8 px-1 bg-brand-950">
          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-gold-500 mr-2" />
              <Typo className="text-gold-500/80 font-mono-bold text-[10px] tracking-[3px] uppercase">
                Kaalbyte Finance
              </Typo>
            </View>

            <View className="flex-row items-center mb-3">
              {user && user?.avatar ? (
                <View className="w-16 h-16 rounded-full mr-4 border-2 border-gold-500/20 overflow-hidden">
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-full h-full"
                  />
                </View>
              ) : (
                <View className="w-16 h-16 rounded-full mr-4 bg-brand-800 items-center justify-center border-2 border-gold-500/20">
                  <User
                    size={24}
                    color={colors.text.secondary}
                    strokeWidth={2}
                  />
                </View>
              )}

              <View className="flex-1">
                <Typo className="text-white/60 font-serif text-lg leading-tight">
                  {greeting},
                </Typo>
                <Typo className="text-white font-serif-bold text-3xl tracking-tight">
                  {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    "User"}
                </Typo>
              </View>
            </View>
          </View>
        </View>
        <DashboardCarousel />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90,
        }}
      >
        <PeriodHeader activeFilter={filter} onFilterChange={setFilter} />

        <View className="flex-row justify-between items-center mb-5 px-1">
          <View className="flex-row items-center">
            <TrendingUp size={14} color={colors.text.secondary} />
            <Typo className="text-text-secondary font-mono-semibold text-[10px] ml-2 uppercase tracking-widest">
              {filter} Overview
            </Typo>
          </View>
          <TouchableOpacity>
            <Typo className="text-gold-500 font-mono-bold text-[9px] uppercase">
              Details
            </Typo>
          </TouchableOpacity>
        </View>

        <View className="mb-10">{renderActivity()}</View>
      </ScrollView>

      {/* --- MODALS --- */}
      <AddMenu
        isVisible={isMenuVisible}
        onClose={handleCloseMenu}
        onSelectAction={(id) =>
          handleSelectAction(id === "gold" ? "digital_asset" : (id as any))
        }
      />

      <Modal
        visible={activeForm === "expense"}
        animationType="slide"
        transparent
      >
        <AddDailyExpense onClose={closeForm} />
      </Modal>

      <Modal
        visible={activeForm === "income"}
        animationType="slide"
        transparent
      >
        <AddMonthlyIncome onClose={closeForm} />
      </Modal>

      <Modal
        visible={activeForm === "digital_asset"}
        animationType="slide"
        transparent
      >
        <AddDigitalGoldSilverTxn onClose={closeForm} />
      </Modal>

      <Modal
        visible={activeForm === "equity"}
        animationType="slide"
        transparent
      >
        <AddEquityTxn onClose={closeForm} />
      </Modal>
    </ScreenWrapper>
  );
};

export default HomeDashboard;
