import { Outlet, useOutletContext } from "react-router";
import type { HomeLayoutContext } from "./_home";
import { DMsProvider } from "~/contexts/dms-context";
import { Loading } from "~/components/ui/loading";

export default function DMsLayout() {
  const context = useOutletContext<HomeLayoutContext>();

  // Wait for context to be ready before rendering children
  if (!context) {
    return <Loading text="Loading Context…" />;
  }

  return (
    <DMsProvider>
      <Outlet context={context} />
    </DMsProvider>
  );
}
