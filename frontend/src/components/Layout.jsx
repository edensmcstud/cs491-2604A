import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="layout">
            {/* Global Header Container */}
            <div style={{ width: '100%', textAlign: 'center', padding: '30px 0 10px 0' }}>
                
                {/* Your Exact Logo Vector Graphic */}
                <div style={{ display: 'inline-block', margin: '0 auto' }}>
                    <svg 
                        xmlns="http://w3.org" 
                        viewBox="0 0 100 100" 
                        width="80" 
                        height="80"
                        style={{ display: 'block', margin: '0 auto' }}
                    >
                        {/* Book Icon Paths matching your image */}
                        <path 
                            fill="currentColor" 
                            style={{ color: 'var(--text-h, #ffffff)' }} 
                            d="M50,57.5 C50,57.5 41,53 29,53 L29,28 C41,28 50,32.5 50,32.5 Z M50,57.5 C50,57.5 59,53 71,53 L71,28 C59,28 50,32.5 50,32.5 Z" 
                        />
                        <path 
                            fill="currentColor" 
                            style={{ color: 'var(--text-h, #ffffff)' }} 
                            d="M50,54 C50,54 43,49.5 36.5,49.5 L36.5,24.5 C43,24.5 50,29 50,29 Z M50,54 C50,54 57,49.5 63.5,49.5 L63.5,24.5 C57,24.5 50,29 50,29 Z" 
                        />
                    </svg>
                    
                    {/* Your Logo Text Style */}
                    <div style={{
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--text-h, #ffffff)',
                        borderTop: '2px solid #f3a4b1',
                        borderBottom: '2px solid #f3a4b1',
                        padding: '4px 12px',
                        marginTop: '10px',
                        display: 'inline-block'
                    }}>
                        Book Store
                    </div>
                </div>
            </div>

            {/* Core App View Frame */}
            <div className="layout-body" style={{ width: '100%' }}>
                <Outlet />
            </div>
        </div>
    );
}
