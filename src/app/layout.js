import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Diary: Your Local Diary For Essential Services!",
  description:
    "Discover verified local service providers including electricians, plumbers, beauticians, tutors, and more in your area. Fast, reliable, and community-powered!",
  keywords: [
    "local services",
    "plumbers near me",
    "electricians near me",
    "beauty services",
    "local directory",
    "salon booking",
    "home services",
    "verified professionals",
    "My Diary app",
    "local business listing",
    "hyperlocal marketplace",
    "find skilled professionals",
  ],
  openGraph: {
    title: "My Diary: Your Local Diary For Essential Services!",
    description:
      "Browse local professionals like electricians, tutors, beauticians, and more. Book services instantly from your neighborhood!",
    url: "https://my-diary-xi-one.vercel.app/", // replace with your actual domain
    siteName: "My Diary",
    images: [
      {
        url: "/settings.png", // Replace with a valid image path
        width: 1200,
        height: 630,
        alt: "My Diary - Local Services",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Diary: Your Local Diary For Essential Services!",
    description:
      "Verified local professionals at your fingertips. Quick booking, trusted services, and community powered listings.",
    images: ["/settings.png"], // Replace with your social preview image
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [
    { name: "My Diary Team", url: "https://my-diary-xi-one.vercel.app/" }, // optional about page
  ],
  applicationName: "My Diary",
  generator: "Next.js",
  themeColor: "#002c22", // Optional: matches brand color
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
