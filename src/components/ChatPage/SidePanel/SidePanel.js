import React from 'react'

import ChatRooms from './ChatRooms'
import UserPanel from './UserPanel'
import DirectMessages from './DirectMessages'
import Favorited from './Favorited'

function SidePanel() {
  return (
    <div
        style={{
            backgroundColor: '#7B83EB',
            padding: '2rem',
            minHeight: '100vh',
            color: 'white',
            minWidth: '275px'
    }}>

        <UserPanel/>

        <Favorited/>

        <ChatRooms/>

        <DirectMessages/>

    </div>
  )
}

export default SidePanel