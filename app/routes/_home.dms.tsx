import { Outlet, useOutletContext } from "react-router";
import type { HomeLayoutContext } from "./_home";
import { DMsProvider } from "~/contexts/dms-context";

export default function DMsLayout() {
  const context = useOutletContext<HomeLayoutContext>();

  // Wait for context to be ready before rendering children
  if (!context) {
    return <div>Loading...</div>;
  }

  return (
    <DMsProvider>
      <Outlet context={context} />
    </DMsProvider>
  );
}
