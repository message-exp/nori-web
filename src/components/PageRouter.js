// PageRouter.js
import React from 'react';
import { usePage } from '../context/PageContext';
import HostPage from '../pages/HostPage/HostPage';
import StyleDemoPage from '../pages/StyleDemoPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import UserHomePage from '../pages/UserHomePage/UserHomePage';
import SignupPage from '../pages/SignupPage/SignupPage';

const PageRouter = () =>
{
    const { currentPage } = usePage();

    switch (currentPage)
    {
        case 'host':
            return <HostPage />;
        case 'demo':
            return <StyleDemoPage />;
        case 'login':
            return <LoginPage />;
        case 'home':
            return <UserHomePage />;
        case 'signup':
            return <SignupPage />;
        default:
            return <HostPage />;
    }
};

export default PageRouter;
