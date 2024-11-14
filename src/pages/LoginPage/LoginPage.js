import React, { useState } from 'react';
import { usePage } from '../../context/PageContext';
import './LoginPage.css'

function LoginPage()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { changePage } = usePage();

    const handleLogin = () =>
    {
        // 如何檢測登入的api

        changePage('home')
    };

    const handleGoSignup = () =>
    {
        // 這邊反而不用寫什麼東西，就可能記得清空之類的
        
        changePage('signup')
    }

    return (
        <div className='main-container'>
            <h1 className='title self-title'>Login Page</h1>
            <p className='title self-subtitle'>Host: {null || 'Unknown'}</p>
            <input
                type="text"
                className='input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                className='input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button className='button' onClick={handleLogin}>Login</button>

            <p className='clickable-text' onClick={handleGoSignup}>or sign up</p>
        </div>
    );
}

export default LoginPage;
