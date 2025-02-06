import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Permite a exportação estática
  distDir: "out", // Define o diretório de saída
  basePath: "/ask-for-file", // Substitua pelo nome do seu repositório
  assetPrefix: "/ask-for-file/", // Prefixo para os assets
};

export default nextConfig;
