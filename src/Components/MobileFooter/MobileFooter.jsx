import React, { useEffect, useState, useRef } from 'react';
import './MobileFooter.css'
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import baseURL from '../url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome,faShop,faPhone } from '@fortawesome/free-solid-svg-icons';

export default function MobileFooter() {


    return (
        <div className='FooterMobileContain'>
            <Link to={'/'}><FontAwesomeIcon icon={faHome} /></Link>
            <Link to={'/'}><FontAwesomeIcon icon={faShop} /></Link>
            <Link to={'/'}><FontAwesomeIcon icon={faPhone} /></Link>
        </div>
    )
}
