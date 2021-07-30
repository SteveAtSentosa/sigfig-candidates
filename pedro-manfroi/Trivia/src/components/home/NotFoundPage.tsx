/**
 * Represents a 404 - Not Found page.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../../assets/PageNotFound.png';

export default function NotFound() {
    return (
        <div style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "50%"}}>
            <img src={PageNotFound} alt="Not found"/>            
            <Link to="/">
                <p>Return to home page</p>
            </Link>
        </div>
    )
}