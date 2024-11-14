// import React from 'react';

// function UserHomePage()
// {
//     return (
//         <div>
//             <h1>User Home Page</h1>
//             <p>Welcome to the home page!</p>
//         </div>
//     );
// }

// export default UserHomePage;

import React, { useState } from 'react';
import Popup from '../../components/Popup/Popup';
import './UserHomePage.css';

function UserHomePage()
{
    const [rooms, setRooms] = useState(['Room 1', 'Room 2']); // 範例房間列表
    const [messages, setMessages] = useState([]); // 範例訊息列表
    const [currentRoom, setCurrentRoom] = useState(rooms[0]); // 選取的房間
    const [inputMessage, setInputMessage] = useState('');

    const [isAddRoomPop, setIsAddRoomPop] = useState(false);

    const handleAddRoomShow = () =>
    {
        setIsAddRoomPop(true);
    };

    const handleAddRoomUnshow = () =>
    {
        setIsAddRoomPop(false);
    };

    const handleAddRoomSubmit = async (input) =>
    {
        // 模擬確認邏輯，假設輸入非空時為成功
        if (input.trim() === '')
        {
            return false;
        }
        else
        {
            addRoom(input);
            updateRoomList();
            return true;
        }
    };

    // 新增房間
    const addRoom = (room_name) =>
    {
        // const newRoom = room;
        setRooms([...rooms, room_name]);
    };

    const updateRoomList = () =>
    {
        // TODO
    }

    // 切換房間
    const selectRoom = (room) =>
    {
        setCurrentRoom(room);
        // get room message
        setMessages([]); // 清除訊息展示，假設每個房間有各自訊息
    };

    // 發送訊息
    const sendMessage = () =>
    {
        if (inputMessage)
        {
            const newMessage = {
                user: 'User1', // 使用者名稱
                time: new Date().toLocaleTimeString(),
                content: inputMessage
            };
            setMessages([...messages, newMessage]);
            setInputMessage(''); // 清空輸入框
        }
    };

    return (
        <div className="chat-app">
            {/* 房間列表 */}
            <div className='room-tab-bar'>
                <div className='room-top'>
                    <button onClick={handleAddRoomShow}>Add Room</button>
                </div>
                
                <div className='room-list' style={{ marginTop: '1rem' }}>
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            onClick={() => selectRoom(room)}
                            className={`room-item ${room === currentRoom ? 'active' : ''}`}
                        >
                            {room}
                        </div>
                    ))}
                </div>
            </div>

            {/* 房間顯示 */}
            <div className="room-display">
                {/* 房間頂部 */}
                <div className="room-header">
                    <h2>{currentRoom}</h2>
                    <button>Invite</button>
                </div>

                {/* 訊息顯示區域 */}
                <div className="message-list">
                    {messages.map((message, index) => (
                        <div key={index} className="message-item">
                            <div className="message-user">{message.user}</div>
                            <div className="message-time">{message.time}</div>
                            <div>{message.content}</div>
                        </div>
                    ))}
                </div>

                {/* 訊息輸入區域 */}
                <div className="message-input">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
            {isAddRoomPop && (
                <Popup
                    title="Custom Title" /* 設置彈出視窗的標題 */
                    onSubmit={handleAddRoomSubmit}
                    onClose={handleAddRoomUnshow}
                />
            )}
        </div>
    );
}

export default UserHomePage;

