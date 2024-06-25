import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter.jsx';
import Header from '../ProfileComponents/Header.jsx';
import Sidebar from './Sidebar.jsx';
import Feed from './Feed.jsx';
import Widgets from './Widgets.jsx'
import './index.css';

function Home() {
    return (
        <div className="app">
            {/* Header */}
            <Header />

            {/* App Body */}
            <div className='app__body'>
                <Sidebar />
                {/* Sidebar */}

                <Feed />
                {/* Feed */}

                <Widgets />
                {/* Widgets */}
            </div>

        </div>
    );
}

export default Home;
