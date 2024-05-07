import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import LayoutPage from "@/components/layouts/LayoutPage";
import { ContextProvider } from "@/contexts/ContextProvider";

import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const neueMontrealFont = localFont({
  src: [
    {
      path: "../assets/fonts/NeueMontreal-Light.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "../assets/fonts/NeueMontreal-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueMontreal-Medium.otf",
      weight: "600",
      style: "medium",
    },
    {
      path: "../assets/fonts/NeueMontreal-Bold.otf",
      weight: "700",
      style: "bold",
    },
  ],
});

const APP_NAME = "Solmedia";
const APP_DEFAULT_TITLE = "Solmedia";
const APP_TITLE_TEMPLATE = "%s - Solmedia";
const APP_DESCRIPTION =
  "Watch & Upload Videos On-Chain with Solmedia, the First Decentralized Content Sharing Platform on Solana.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  icons: "/favicon.png",
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={neueMontrealFont.className}>
        <Toaster
          toastOptions={{
            style: {
              borderRadius: "10px",
              background: "#2c2d30",
              color: "#fff",
              fontWeight: "bold",
            },
            position: "top-center",
          }}
        />
        <ContextProvider>
          <LayoutPage>{children}</LayoutPage>
        </ContextProvider>
      </body>
    </html>
  );
}
