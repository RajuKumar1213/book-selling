import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import ImagePreloader from "@/components/ImagePreloader";
import { Playfair_Display } from "next/font/google";
import { Merriweather } from "next/font/google";
import { Lora } from "next/font/google";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-lora",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

// Optimized font loading - only load weights we actually use
// const poppins = Poppins({
//   variable: "--font-poppins",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap", // Better performance
//   preload: true,
// });

// const roboto = Roboto({
//   subsets: ["latin"], // required
//   weight: ["400", "700"], // choose what you need
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap", // Better performance
  preload: true,
});

export const metadata: Metadata = {
  title: "Oxford Book - Buy Books Online | Best Bookstore",
  description:
    "Discover a wide range of books online at Oxford Book. From academic to fiction, competitive exams to novels – shop your favorite books with fast delivery and great prices.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Next.js Google Fonts handles font optimization automatically */}
        <meta name="theme-color" content="#DC2626" />

        {/* Google Analytics */}
        {/* <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-91ZV172QKR"
        ></script> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-91ZV172QKR');
            `,
          }}
        /> */}

        {/* Razorpay Checkout Script */}
        {/* <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script> */}
      </head>
      <body
        className={`${playfair.variable} ${lora.variable} ${inter.variable} ${merriweather.variable}`}
      >
        {" "}
        <AuthProvider>
          <CartProvider>
            <CategoriesProvider>
              <ToastProvider>
                <ImagePreloader />
                {children}
              </ToastProvider>
            </CategoriesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
