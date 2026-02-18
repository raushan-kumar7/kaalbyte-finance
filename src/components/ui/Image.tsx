import React from "react";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/src/constants/colors";

interface ImageProps extends ExpoImageProps {
  className?: string;
  showLoader?: boolean;
}

const Image = ({
  className,
  showLoader = true,
  style,
  ...props
}: ImageProps) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <View className={className} style={style}>
      <ExpoImage
        {...props}
        style={{ width: "100%", height: "100%" }}
        contentFit={props.contentFit || "cover"}
        transition={300}
        // Blurhash is a placeholder that looks like a gradient before the image loads
        placeholder="|rF?hV%2WCj[ayj[a|j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        onLoadEnd={() => setLoading(false)}
      />

      {loading && showLoader && (
        <View className="absolute inset-0 items-center justify-center bg-white/5">
          <ActivityIndicator size="small" color={colors.gold[500]} />
        </View>
      )}
    </View>
  );
};

export default Image;
