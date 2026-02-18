// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// config.resolver.sourceExts.push('sql');

// module.exports = config;

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for Drizzle migration files
config.resolver.sourceExts.push("sql");

module.exports = withNativeWind(config, { input: "./app/global.css" });
