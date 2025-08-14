import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "PORTFOLIO BLOG",
  description: "A blog showcasing my projects and experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
