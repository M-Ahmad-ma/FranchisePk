const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = mergeConfig(getDefaultConfig(__dirname), {
  transformer: {
    // Strip every console.* call from the minified bundle. Logging stays
    // intact in development; nothing ships to production.
    //
    // This is the single choke point for the ~70 console.* calls across src/
    // (axios interceptors, AuthContext, HTMLContentView, services). Hand-
    // editing each one is error-prone and new ones would silently leak again.
    minifierConfig: {
      compress: {
        drop_console: true,
      },
    },
  },
});

module.exports = withNativeWind(config, { input: "./global.css" });
