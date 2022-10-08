module.exports = {
    presets: ["module:metro-react-native-babel-preset", "@babel/preset-typescript"],
    plugins: [
        [
            "module-resolver",
            {
                root: ["."],
                extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
                alias: {
                    "@src": "./src",
                    "@utils": "./src/utils",
                    "@api": "./src/api",
                    "@locales": "./src/locales",
                    "@storage": "./src/storage",
                    "@screens": "./src/screens",
                    "@navigation": "./src/navigation",
                    "@components": "./src/components",
                    "@assets": "./src/assets",
                    "@hooks": "./src/hooks",
                },
            },
        ],
    ],
};
