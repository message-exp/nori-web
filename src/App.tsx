import { Routes, Route } from "react-router";
import Home from "@/pages/index";
import RoomChat from "@/pages/roomChat";
import RoomList from "@/pages/roomList";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/roomchat" element={<RoomChat />}></Route>
      <Route path="/roomlist" element={<RoomList />}></Route>
    </Routes>
  );
}

export default App;
