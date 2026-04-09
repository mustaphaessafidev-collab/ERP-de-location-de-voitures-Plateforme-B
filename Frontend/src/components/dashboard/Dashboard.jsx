import React from "react";
import {
  LayoutDashboard,
  Car,
  History,
  FileText,
  User,
  Settings,
  Search,
  Bell,
  Key,
  Calendar,
  DollarSign
} from "lucide-react";
import Sidebar from "./Sidebar";


export default function Dashboard() {

const bookings = [
{
name:"Tesla Model 3",
img:"https://i.pinimg.com/1200x/dd/e0/90/dde090a46c2af259fb3f8540eee76154.jpg",
plate:"Plate: KJ-406-YTS",
dates:"Jun 12 - Jun 15",
duration:"3 days rental",
total:"$450.00",
status:"progress"
},
{
name:"MERCEDES E-Class E350",
img:"https://i.pinimg.com/736x/1d/9f/19/1d9f192008b06b3118c83f27be55f4ac.jpg",
plate:"Plate: PZ-22F-MR",
dates:"Jun 20 - Jun 22",
duration:"2 days rental",
total:"$790.00",
status:"confirmed" 
},
{
name:"BMW 3 Series",
img:"https://i.pinimg.com/736x/92/43/76/924376abba339a8c17f9504fbb7bf460.jpg",
plate:"Plate: HN-789-BW",
dates:"Jul 04 - Jul 06",
duration:"2 days rental",
total:"$320.00",
status:"pending"
}
];

const nav = [
{ name:"Dashboard", icon:LayoutDashboard },
{ name:"Fleet", icon:Car },
{ name:"History", icon:History },
{ name:"Invoices", icon:FileText },
{ name:"Profile", icon:User },
{ name:"Settings", icon:Settings }
];

return (

<div className="layout">

<style>{`

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Inter;
}

body{
background:#f6f8fb;
}

.layout{
display:flex;
}


/* MAIN */

.main{
flex:1;
padding:35px 40px;
}

/* TOPBAR */

.topbar{
display:flex;
justify-content:space-between;
margin-bottom:30px;
}

.search{
display:flex;
align-items:center;
gap:10px;
background:white;
border:1px solid #e5e7eb;
padding:10px 14px;
border-radius:8px;
width:320px;
}

.search input{
border:none;
outline:none;
width:100%;
}

.user{
display:flex;
align-items:center;
gap:10px;
}

.avatar{
width:34px;
height:34px;
background:#e5e7eb;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
}

/* HEADER */

.header{
display:flex;
justify-content:space-between;
margin-bottom:25px;
}

.header h1{
font-size:26px;
}

.header p{
font-size:14px;
color:#6b7280;
}

.bookBtn{
background:white;
border:1px solid #e5e7eb;
padding:10px 14px;
border-radius:8px;
cursor:pointer;
}

/* STATS */

.stats{
display:flex;
gap:20px;
margin-bottom:25px;
}

.card{
background:white;
border:1px solid #e5e7eb;
border-radius:10px;
padding:20px;
flex:1;
}

.cardTop{
display:flex;
justify-content:space-between;
margin-bottom:10px;
}

.cardTitle{
font-size:13px;
color:#6b7280;
}

.cardValue{
font-size:22px;
font-weight:600;
}

/* TABLE */

.tableCard{
background:white;
border:1px solid #e5e7eb;
border-radius:10px;
padding:20px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th{
font-size:11px;
color:#9ca3af;
text-align:left;
padding:12px 0;
border-bottom:1px solid #e5e7eb;
}

td{
padding:16px 0;
border-bottom:1px solid #f1f3f6;
}

.vehicle{
display:flex;
align-items:center;
gap:12px;
}

.vehicle img{
width:60px;
border-radius:6px;
}

.carName{
font-weight:500;
}

.plate{
font-size:12px;
color:#9ca3af;
}

.sub{
font-size:12px;
color:#9ca3af;
}

.total{
font-weight:500;
}

.status{
padding:4px 10px;
border-radius:20px;
font-size:12px;
font-weight:500;
display:inline-flex;
align-items:center;
gap:6px;
}

.status::before{
content:"";
width:6px;
height:6px;
border-radius:50%;
display:inline-block;
}

.status.progress{
background:#e7f8ef;
color:#16a34a;
}

.status.progress::before{
background:#16a34a;
}

.status.confirmed{
background:#eef4ff;
color:#2563eb;
}

.status.confirmed::before{
background:#2563eb;
}

.status.pending{
background:#fff3e6;
color:#f59e0b;
}

.status.pending::before{
background:#f59e0b;
}

.modify{
border:none;
background:none;
color:#2563eb;
cursor:pointer;
}

.bottom{
display:flex;
gap:20px;
margin-top:20px;
}

.help,.invoice{
flex:1;
background:white;
border:1px solid #e5e7eb;
border-radius:10px;
padding:20px;
}

`}</style>

{/* SIDEBAR */}

<Sidebar/>

{/* MAIN */}

<main className="main">

{/* TOPBAR */}

<div className="topbar">

<div className="search">
<Search size={20}/>
<input placeholder="Search bookings, invoices..." />
</div>

<div className="user">
<Bell size={18}/>
<div className="avatar"><img className="avatar" src="./images/Mezz.jpg"/></div>
</div>

</div>

{/* HEADER */}

<div className="header">

<div>
<h1>Welcome back, Mouhssine</h1>
<p>Here is an overview of your car rental activity for June 2024.</p>
</div>

<button className="bookBtn">Book New Car</button>

</div>

{/* STATS */}

<div className="stats">

<div className="card">
<div className="cardTop">
<Key size={18}/>
<span style={{color:"#16a34a"}}>+10%</span>
</div>
<div className="cardTitle">Active Rentals</div>
<div className="cardValue">2</div>
</div>

<div className="card">
<div className="cardTop">
<Calendar size={18}/>
<span style={{color:"#6b7280"}}>0%</span>
</div>
<div className="cardTitle">Upcoming Bookings</div>
<div className="cardValue">1</div>
</div>

<div className="card">
<div className="cardTop">
<DollarSign size={18}/>
<span style={{color:"#ef4444"}}>-5%</span>
</div>
<div className="cardTitle">Total Spent (MTD)</div>
<div className="cardValue">$1,240.00</div>
</div>

</div>

{/* TABLE */}

<div className="tableCard">

<h3>Current Bookings</h3>

<table>

<thead>
<tr>
<th>VEHICLE</th>
<th>DATES</th>
<th>TOTAL</th>
<th>STATUS</th>
<th>ACTIONS</th>
</tr>
</thead>

<tbody>

{bookings.map((b,i)=>(
<tr key={i}>

<td className="vehicle">

<img src={b.img}/>

<div>
<div className="carName">{b.name}</div>
<div className="plate">{b.plate}</div>
</div>

</td>

<td>
<div>{b.dates}</div>
<div className="sub">{b.duration}</div>
</td>

<td className="total">{b.total}</td>

<td>
<span className={`status ${b.status}`}>
{b.status==="progress"?"In Progress":b.status==="confirmed"?"Confirmed":"Pending"}
</span>
</td>

<td>
<button className="modify">Modify</button>
</td>

</tr>
))}

</tbody>

</table>

</div>

{/* BOTTOM */}

<div className="bottom">

<div className="help">
<h4>Need help with a rental?</h4>
<p>Our support team is available 24/7</p>
<button className="rentBtn">Chat Now</button>
</div>

<div className="invoice">
<h4>Recent Invoices</h4>
<p>Download your latest statements</p>
<button className="rentBtn">View All</button>
</div>

</div>

</main>

</div>

);

};