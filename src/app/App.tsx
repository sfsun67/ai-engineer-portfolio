import { RouterProvider } from "react-router";
import { router } from "./routes";
import "../styles/pixel.css"; // Include custom CSS

export default function App() {
  return (
    <>
      <div className="bg-scanline" />
      <RouterProvider router={router} />
    </>
  );
}
