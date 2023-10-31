import { LayoutComponent } from "@/app/types";
import SnackBarWrapper from "@/components/SnackbarWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Report Dashboard",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/public/apple-touch-icon.png",
  },
};

const RootLayout: LayoutComponent = ({ children }) => {
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  return (
    <html lang="en">
      <body>
        <SnackBarWrapper>{children}</SnackBarWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
