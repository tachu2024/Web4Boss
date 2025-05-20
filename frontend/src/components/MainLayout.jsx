import React from 'react';
import VerticalMenu from './VerticalMenu';
import Footer from './Footer';

export default function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <VerticalMenu />
            <div className="flex-1 pb-12">
                {children}
            </div>
            <Footer />
        </div>
    );
} 