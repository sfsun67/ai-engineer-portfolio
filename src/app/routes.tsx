import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Demo } from "./pages/Demo";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "project/:id", Component: ProjectDetail },
    ],
  },
  {
    path: "/demo/:id",
    Component: Demo,
  },
]);
