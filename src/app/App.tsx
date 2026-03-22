import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import "../styles/pixel.css"; // Include custom CSS

export default function App() {
  return (
    <LanguageProvider>
      <div className="bg-scanline" />
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
