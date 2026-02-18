import React from "react";
import { ScrollView, View } from "react-native";
import { ModalWrapper } from "../shared";
import { Typo } from "../ui";

const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  const Section = ({ title, content }: { title: string; content: string }) => (
    <View className="mb-8">
      <Typo className="text-gold-500 font-mono-bold text-[11px] uppercase tracking-widest mb-3">
        {title}
      </Typo>
      <Typo className="text-text-secondary leading-6 text-[14px]">
        {content}
      </Typo>
    </View>
  );

  return (
    <ModalWrapper title="Privacy Policy" onClose={onBack}>
      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        <Typo className="text-white font-serif-bold text-xl mb-6">
          How we protect your data
        </Typo>

        <Section
          title="Data Collection"
          content="We collect personal identification information, financial data for transactions, and device information to ensure account security and regulatory compliance (KYC)."
        />

        <Section
          title="Usage of Data"
          content="Your data is primarily used to process investments, prevent fraud, and comply with legal financial obligations in your jurisdiction."
        />

        <Section
          title="Third Parties"
          content="We do not sell your personal data. We only share information with regulated banking partners and service providers necessary for account operations."
        />

        <Typo className="text-text-muted text-[12px] italic mt-4 mb-10 text-center">
          Last updated: February 2026
        </Typo>
      </ScrollView>
    </ModalWrapper>
  );
};

export default PrivacyPolicy;
