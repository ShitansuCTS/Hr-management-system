import "../assets/scss/theme.scss";
import 'react-circular-progressbar/dist/styles.css';
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import NavigationProvider from "@/contentApi/navigationProvider";
import SettingSideBarProvider from "@/contentApi/settingSideBarProvider";
import ThemeCustomizer from "@/components/shared/ThemeCustomizer";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "Duralux | Dashboard",
  description: "Duralux is a admin Dashboard create for multipurpose,",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingSideBarProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </SettingSideBarProvider>
        <ThemeCustomizer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937", // dark gray text
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(52, 84, 209, 0.15)",
              padding: "14px 18px",
              fontSize: "14px",
            },
            success: {
              style: {
                borderLeft: "5px solid #3454d1",
              },
              iconTheme: {
                primary: "#3454d1",
                secondary: "#ffffff",
              },
            },
            error: {
              style: {
                borderLeft: "5px solid #ef4444",
              },
            },
            loading: {
              style: {
                borderLeft: "5px solid #3454d1",
              },
            },
          }}
        />

      </body>
    </html>
  );
}
