// PageContext.js
import React, { createContext, useContext, useState } from 'react';

// 建立 PageContext
const PageContext = createContext();

// 提供頁面管理的 Provider
export const PageProvider = ({ children }) =>
{
    const [currentPage, setCurrentPage] = useState('login');

    // 切換頁面的方法
    const changePage = (page) =>
    {
        setCurrentPage(page);
    };

    return (
        <PageContext.Provider value={{ currentPage, changePage }}>
            {children}
        </PageContext.Provider>
    );
};

// 客製化的 Hook 讓各頁面更簡單地使用頁面管理功能
export const usePage = () => useContext(PageContext);
