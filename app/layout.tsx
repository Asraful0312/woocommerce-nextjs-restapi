import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import { getSiteInfo } from "@/lib/wp";
import { Providers } from "@/components/provider/Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Default metadata
const defaultMetadata: Metadata = {
  title: "My Shop",
  description: "Welcome to My Shop",
  icons: "/default-favicon.ico", // Default favicon as a string URL
};

// Dynamically generate metadata
export async function generateMetadata(): Promise<Metadata> {
  let site;
  try {
    site = await getSiteInfo();
  } catch (error) {
    console.error("Failed to fetch site info:", error);
    return defaultMetadata;
  }

  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`),
    keywords: [site?.title, "e-commerce", "shop"],
    title: site?.title || defaultMetadata.title,
    description: site?.description || defaultMetadata.description,
    icons: site?.siteIcon || defaultMetadata.icons, // Use siteIcon or fallback to default favicon
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let site;
  try {
    site = await getSiteInfo();
  } catch (error) {
    console.error("Failed to fetch site info:", error);
    site = {
      title: defaultMetadata.title,
      description: defaultMetadata.description,
    };
  }

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header logo={site?.logo} />
          {children}
          <Footer />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
