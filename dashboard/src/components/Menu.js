import React,{useState}from 'react'
import {Link} from 'react-router-dom'
function Menu({ username, onLogout }) {
  const [selectedMenu,setSelectedMenu]=useState(0);
  const [isProfileDropdownOpen,setIsProfileDropdownOpen]=useState(false);
 const handleMenuClick=(index)=>{
  setSelectedMenu(index);
 };
 const handleProfileClick=()=>{
  setIsProfileDropdownOpen(!isProfileDropdownOpen);
 };
 const menuClass="menu";
 const activeMenuClass="munu.selected";
  return (  
      <div className="menu-container">
      <img src="/media/images/logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul>
          <li>
            <Link to="/" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(0)}
            ><p className={selectedMenu==0?activeMenuClass:menuClass}>Dashboard</p></Link>
          </li>
          <li>
             <Link to="/holdings" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(1)}
            ><p className={selectedMenu==1?activeMenuClass:menuClass}>Holdings</p></Link>
          </li>
          <li>
             <Link to="/orders" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(2)}
            ><p className={selectedMenu==2?activeMenuClass:menuClass}>Orders</p></Link>
          </li>
          <li>
            <Link to="/positions" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(3)}
            ><p className={selectedMenu==3?activeMenuClass:menuClass}>Positions</p></Link>     
          </li>
          <li>
            <Link to="/funds" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(4)}
            ><p className={selectedMenu==4?activeMenuClass:menuClass}>Funds</p></Link>
          </li>
          <li>    
            <Link to="/apps" style={{ textDecoration: 'none' }} onClick={()=> handleMenuClick(5)}
            ><p className={selectedMenu==5?activeMenuClass:menuClass}>Apps</p></Link>         
          </li>
        </ul> 
        <hr />
        <div className="profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <div className="avatar">{username ? username.substring(0, 2).toUpperCase() : "ZU"}</div>
          <p className="username">{username || "USER"}</p>
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-dropdown" style={{ position: 'absolute', right: '30px', top: '70px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 }}>
            <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 24px', fontSize: '15px', color: '#e53935', fontWeight: '500' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;