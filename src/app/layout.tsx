import { LayoutComponent } from "@/app/types";
import SnackBarWrapper from "@/components/SnackbarWrapper";

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
