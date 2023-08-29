import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useUserAuth } from './UserAuthContext';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function NavBar(props) {
  var userAuthData  = useUserAuth();
  const { setUserAuthData } = useUserAuth();
  userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
  const [login,setLogin] = useState(userAuthData==null)
  const navigate = useNavigate();
  useEffect(()=>{
    setLogin(userAuthData===null);
  },[userAuthData])
  const stl = {
    height: '55px',
    width: '100%',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 400,
    marginTop: '30px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#1d075f'
  }

  const hideMenu = () => {
    // Get the checkbox element and uncheck it to hide the menu
    const checkbox = document.getElementById("check");
    if (checkbox) {
      checkbox.checked = false;
    }
  };
  const logoutUser = () => {
    // Remove userAuthData from Local Storage
    localStorage.removeItem('userAuthData');
    localStorage.removeItem('jwtToken')
    setUserAuthData(null)
    setLogin(false)
    navigate("/");
  };

  return (
    <nav>
      <input type="checkbox" id="check" />
      <label htmlFor="check" className="checkbtn">
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M464 256H48a48 48 0 0 0 0 96h416a48 48 0 0 0 0-96zm16 128H32a16 16 0 0 0-16 16v16a64 64 0 0 0 64 64h352a64 64 0 0 0 64-64v-16a16 16 0 0 0-16-16zM58.64 224h394.72c34.57 0 54.62-43.9 34.82-75.88C448 83.2 359.55 32.1 256 32c-103.54.1-192 51.2-232.18 116.11C4 180.09 24.07 224 58.64 224zM384 112a16 16 0 1 1-16 16 16 16 0 0 1 16-16zM256 80a16 16 0 1 1-16 16 16 16 0 0 1 16-16zm-128 32a16 16 0 1 1-16 16 16 16 0 0 1 16-16z"/></svg>
      </label>
      <label className="logo">Bank</label>
      <ul>
        <li><Link to="/" onClick={hideMenu}>Home</Link></li>
        {!login ? (
          <>
            <li><Link to="/dashboard" onClick={hideMenu}>Dashboard</Link></li>
            <li><Link to="/services" onClick={hideMenu}>Services</Link></li>
            
          </>
        ) : null}
        <li><Link to="/contact-us" onClick={hideMenu}>Contact</Link></li>
          <>
            {
              login ? (<li><Link style={stl}  to="/login" onClick={hideMenu}>Login</Link></li>) : (<li><Link to="/" style={stl} onClick={logoutUser}>Logout</Link></li>)
            }
          </>
      </ul>
    </nav>
  );
}

export default NavBar;
