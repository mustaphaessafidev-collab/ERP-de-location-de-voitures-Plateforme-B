import React from "react";
import "./Sidebar.css";
import {
  LayoutDashboard,
  Car,
  History,
  FileText,
  User,
  Settings
} from "lucide-react";

export default function Sidebar() {

const nav = [
{ name:"Dashboard", icon:LayoutDashboard },
{ name:"Fleet", icon:Car },
{ name:"History", icon:History },
{ name:"Invoices", icon:FileText },
{ name:"Profile", icon:User },
{ name:"Settings", icon:Settings }
];

return (

<aside className="sidebar">
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.sidebar{
  width:240px;
  background:white;
  height:100vh;
  border-right:1px solid #e5e7eb;
  padding:24px;
  display:flex;
  flex-direction:column;
  box-sizing:border-box;
  flex:0 0 240px;
  position:sticky;
  top:0;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.logo{
  color:#2563eb;
  font-weight:600;
  margin-bottom:30px;
  font-size:18px;
}

.navItem{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px;
  border-radius:6px;
  color:#6b7280;
  cursor:pointer;
  margin-bottom:6px;
  user-select:none;
}

.navItem:hover{
  background:#f1f5f9;
}

.rentBtn{
  margin-top:auto;
  background:#2563eb;
  color:white;
  border:none;
  padding:12px;
  border-radius:8px;
  cursor:pointer;
}
`}</style>

<div className="logo">ERP Rental</div>

<nav>

{nav.map((item,i)=>{

const Icon=item.icon;

return(
<div key={i} className="navItem">
<Icon size={18}/>
{item.name}
</div>
);

})}

</nav>

<button className="rentBtn">Rent a Car</button>

</aside>

);

}
