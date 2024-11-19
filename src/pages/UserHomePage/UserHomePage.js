import React from 'react';
import './UserHomePage.css'

function UserHomePage()
{
    const rooms = [
        'General Chat',
        'Tech Talk',
        'Gaming Hub',
        'Music Lounge',
        'Study Group',
        'Fitness Enthusiasts',
        'Movie Night',
        'Travel Buddies',
        'Foodies Unite',
        'Code Masters',
        'Pet Lovers',
        'Parenting Tips',
        'Photography Club',
        'DIY Projects',
        'Anime Fans',
        'Book Club',
        'Startup Ideas',
        'Health & Wellness',
        'Random Chat',
        'Art Lovers'
    ];

    return (

        

        <div class="container">
            <div class="left">Left
                <div class="top">Top (固定高度)</div>
                <div class="content">
                    {rooms.map((item, index) => (
                        <div key={index} className="room-block">
                            <p className='room-text'>
                                {item}
                            </p>
                            
                        </div>
                    ))}
                </div>
            </div>
            <div class="right">Right
                <div className='right-top'>top</div>
                <div className='right-middle'>middle
                    <div class="block-element">Item 1</div>
                    <div class="block-element">Item 2</div>
                    <div class="block-element">Item 3</div>
                    <div class="block-element">Item 4</div>
                    <div class="block-element">Item 5</div>
                    <div class="block-element">Item 6</div>
                    <div class="block-element">Item 7</div>
                    <div class="block-element">Item 8</div>
                    <div class="block-element">Item 9</div>
                    <div class="block-element">Item 10</div>
                    <div class="block-element">Item 1</div>
                    <div class="block-element">Item 2</div>
                    <div class="block-element">Item 3</div>
                    <div class="block-element">Item 4</div>
                    <div class="block-element">Item 5</div>
                    <div class="block-element">Item 6</div>
                    <div class="block-element">Item 7</div>
                    <div class="block-element">Item 8</div>
                    <div class="block-element">Item 9</div>
                    <div class="block-element">Item 10</div>
                </div>
                <div className='right-bottom'>bottom</div>
            </div>
        </div>
    );
}

export default UserHomePage;
