import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as UIProvider } from "@/components/ui/provider";
import { RoomMembersProvider } from "./contexts/room-chat/RoomMembersProvider.tsx";
// import './index.css'
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoomMembersProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </RoomMembersProvider>
  </StrictMode>
);
