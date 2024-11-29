import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Otras opciones de configuración aquí */
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante el build
  },
};

export default nextConfig;
