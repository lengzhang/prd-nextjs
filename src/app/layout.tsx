import { LayoutComponent } from "@/app/types";

const RootLayout: LayoutComponent = ({ children }) => {
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
