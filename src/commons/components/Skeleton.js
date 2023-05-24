import React from 'react'
// css
import './Skeleton.css';

function Skeleton() {
    return (
    <div className='skeleton'>
            <div className='skeleton-avatar'/>
            <div className='skeleton-author'/>
            <div className='skeleton-description'/>
    </div>
  )
}

export default Skeleton