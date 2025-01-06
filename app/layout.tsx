'use client'
import "./globals.css";
import { Provider } from "react-redux";
import {store} from "@/redux/store"
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';


const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
      <body
        className={`${inter.variable} ${plusJakarta.variable} antialiased`}
      >
        {children}
      </body>
      </Provider>
    </html>
  );
}
