const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@libsql/client") {
    return context.resolveRequest(context, "@libsql/client/web", platform);
  }

  if (
    moduleName === "drizzle-orm/libsql/migrator" ||
    moduleName === "drizzle-orm/migrator"
  ) {
    return { type: "empty" };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./app/global.css" });
