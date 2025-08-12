import type { Metadata } from "next";
import "./globals.css";
import { Providers } from '../components/providers';

export const metadata: Metadata = {
  title: "Dermilise - Sistema de Agendamento",
  description: "Sistema de agendamento para clínicas de procedimentos estéticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
