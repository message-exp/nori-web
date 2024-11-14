import React, { useState } from 'react';
import { usePage } from '../../context/PageContext';
import './LoginPage.css'

function LoginPage()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hint_error, setHintError] = useState('');
    const { changePage } = usePage();

    const handleLogin = () =>
    {
        // 如何檢測登入的api
        const return_code = checkLoginValid(username, password);
        if (return_code === 200)
        {
            changePage('home');
            setHintError('');
        }
        else if (return_code === 401)
        {
            setHintError('username or password not valid')
        }
        else 
        {
            setHintError(`unknown error, return code: ${return_code}`)
        }

        
    };

    const checkLoginValid = (check_username, check_password) =>
    {
        // 在這邊放login邏輯的api

        // 這邊先模擬個狀況
        // 假設return code:
        //  200: 成功
        //  401: 帳號或密碼錯誤
        //  500: 單純測試用

        if (check_username === "test")
        {
            return 500;
        }

        if (check_username !== "senen")
        {
            console.log("username not valid");
            return 401;
        }
        else if (check_password !== "senen")
        {
            console.log("password not valid");
            return 401;
        }
        else
        {
            console.log("login valid");
            return 200;
        }
    }

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

            <p className='hint-text error'>{hint_error}</p>

            <button className='button' onClick={handleLogin}>Login</button>

            <p className='clickable-text' onClick={handleGoSignup}>or sign up</p>
        </div>
    );
}

export default LoginPage;
