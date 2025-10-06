import { Outlet, useOutletContext } from "react-router";
import { DMsProvider } from "~/contexts/dms-context";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DMsLayout() {
  const context = useOutletContext<HomeLayoutContext>();

  return (
    <DMsProvider>
      <Outlet context={context} />
    </DMsProvider>
  );
}
