import React from 'react'
import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';

function Header(){
    return (
        <header className="bg-red-700">
            <Link to='/'>Fast React Pizza</Link>
            <SearchOrder />
            <p>Chirag</p>
        </header>
    );
}
export default Header;