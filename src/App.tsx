// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 示例頁面組件
import LoginPage from './pages/login';
// import DashboardPage from './pages/DashboardPage';
// ... existing code ...

function NavigationPage() {
  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>UI Prototype Pages</h1>
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
      }}>
        {/* 每個卡片都是一個完整頁面的入口 */}
        <PageCard
          title="Login Page"
          description="用戶登入頁面原型"
          path="/login"
        />
        <PageCard
          title="Dashboard"
          description="主控台頁面原型"
          path="/dashboard"
        />
        {/* 添加更多頁面卡片 */}
      </div>
    </div>
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
    <div
      onClick={() => window.location.href = path}
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <p style={{ margin: 0, color: '#666' }}>{description}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavigationPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 添加更多路由 */}
      </Routes>
    </Router>
  );
}

export default App;