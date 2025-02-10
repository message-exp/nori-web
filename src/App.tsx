
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 示例頁面組件
import LoginPage from "@/pages/login";
import RoomList from "@/pages/room-list";
import SignupPage from "./pages/signup";
import { Box, Card, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import RoomChat from "./pages/roomChat";

function NavigationPage() {
    return (
        <Box style={{
            padding: "40px",
            maxWidth: "800px",
            margin: "0 auto"
        }}>
            <Heading size={"6xl"}>UI Prototype Pages</Heading>
            <div style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
            }}>
                {/* 每個卡片都是一個完整頁面的入口 */}
                <PageCard
                    title="Login Page"
                    description="用戶登入頁面原型"
                    path="/login"
                />
                <PageCard
                    title="Room List"
                    description="房間列表"
                    path="/roomlist"
                />
                <PageCard
                    title="Room Chat"
                    description="聊天室"
                    path="/roomchat"
                />
                {/* 添加更多頁面卡片 */}
            </div>
        </Box>
    );
}

interface PageCardProps {
    title: string;
    description: string;
    path: string;
}

// 頁面卡片組件
function PageCard({ title, description, path }: PageCardProps) {
    return (
        <Card.Root>
            <Card.Body gap={2}>
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Description>
                    {description}
                </Card.Description>
            </Card.Body>
            <Card.Footer>
                <Button colorPalette={"teal"} onClick={() => window.location.href = path}>
                    view
                </Button>
            </Card.Footer>
        </Card.Root>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NavigationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/roomlist" element={<RoomList />} />
                <Route path="/signup" element = {<SignupPage />} />
                <Route path="/roomchat" element={<RoomChat/>} />
                {/* 添加更多路由 */}
            </Routes>
        </Router>
        
    );
}

export default App;