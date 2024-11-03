const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Make sure this points to your main entry point
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle JS and JSX files
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/, // Handle image files
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Allows importing without specifying file extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML template
      filename: "index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
  devServer: {
    historyApiFallback: true, // For React Router support
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
  },
  mode: "development",
};