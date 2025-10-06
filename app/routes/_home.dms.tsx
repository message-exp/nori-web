import { Outlet, useOutletContext } from "react-router";
import { DMsProvider } from "~/contexts/dms-context";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

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
