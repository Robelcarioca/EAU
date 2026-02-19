import { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// ─── REAL ET LOGO (from ethiopianairlines.com CDN) ────────────────────────────
const ET_LOGO_URL = "https://assets.airtrfx.com/media-em/et/logos/et-large-default.svg";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id:1, name:"Admin User",      email:"admin@eau.edu.et",       password:"admin123", role:"admin",     status:"approved", department:null,          studentId:null },
  { id:2, name:"Registrar Staff", email:"registrar@eau.edu.et",   password:"reg123",   role:"registrar", status:"approved", department:null,          studentId:null },
  { id:3, name:"Abebe Girma",     email:"abebe@student.eau.et",   password:"pass123",  role:"student",   status:"approved", department:"Avionics",    studentId:"EAU-2024-001" },
  { id:4, name:"Tigist Haile",    email:"tigist@student.eau.et",  password:"pass123",  role:"student",   status:"pending",  department:"Power Plant", studentId:"EAU-2024-002" },
  { id:5, name:"Dawit Tadesse",   email:"dawit@student.eau.et",   password:"pass123",  role:"student",   status:"pending",  department:"Airframe",    studentId:"EAU-2024-003" },
  { id:6, name:"Hana Bekele",     email:"hana@student.eau.et",    password:"pass123",  role:"student",   status:"rejected", department:"Structure",   studentId:"EAU-2024-004" },
];

const DEPTS = [
  { id:"avionics",   name:"Avionics",    icon:"📡", desc:"Aircraft Electronic Systems & Navigation" },
  { id:"powerplant", name:"Power Plant", icon:"⚙️", desc:"Turbine Engines & Propulsion Systems"    },
  { id:"airframe",   name:"Airframe",    icon:"✈️", desc:"Aircraft Structure & Systems"             },
  { id:"structure",  name:"Structure",   icon:"🔩", desc:"Composite Materials & Structural Repair"  },
  { id:"gc",         name:"GC Course",   icon:"📚", desc:"General Course – Freshman Foundation"     },
];

const DIMGS = {
  avionics:   "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&q=80",
  powerplant: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=600&q=80",
  airframe:   "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  structure:  "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&q=80",
  gc:         "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
};

const INITIAL_CONTENT = {
  avionics:{ sections:[
    { id:"a1", name:"AVO 1 – DC Fundamentals", modules:[
      { id:"m1", title:"Introduction to DC Circuits",    pdf:"DC_Circuits.pdf",  ppt:null,         video:"https://www.youtube.com/embed/F_vLWkkNbKY" },
      { id:"m2", title:"Ohm's Law & Kirchhoff's Laws",   pdf:"Ohms_Law.pdf",    ppt:"Ohms.pptx",  video:null },
      { id:"m3", title:"Capacitors & Inductors",          pdf:"Cap_Ind.pdf",     ppt:null,         video:"https://www.youtube.com/embed/tIrANMKAu8w" },
      { id:"m4", title:"DC Circuit Analysis Lab",         pdf:"Lab_DC.pdf",      ppt:null,         video:null },
    ]},
    { id:"a2", name:"AVO 2 – AC Fundamentals", modules:[
      { id:"m5", title:"AC Waveforms & Phase",            pdf:"AC_Wave.pdf",     ppt:"AC.pptx",    video:"https://www.youtube.com/embed/vN9aR2C6KPo" },
      { id:"m6", title:"Transformers & Rectifiers",       pdf:"Trans.pdf",       ppt:null,         video:null },
    ]},
    { id:"a3", name:"AVO 3 – Digital Electronics", modules:[
      { id:"m7", title:"Logic Gates & Boolean Algebra",   pdf:"Logic.pdf",       ppt:"Logic.pptx", video:null },
      { id:"m8", title:"Microprocessor Fundamentals",     pdf:"Micro.pdf",       ppt:null,         video:"https://www.youtube.com/embed/AkFi90lZmXA" },
    ]},
  ]},
  powerplant:{ sections:[
    { id:"p1", name:"PWR 1 – Gas Turbine Theory", modules:[
      { id:"m9",  title:"Thermodynamic Cycle",            pdf:"Thermo.pdf",      ppt:null,         video:"https://www.youtube.com/embed/KjiUUJdPGX0" },
      { id:"m10", title:"Compressor Types",               pdf:"Comp.pdf",        ppt:"Comp.pptx",  video:null },
    ]},
    { id:"p2", name:"PWR 2 – Engine Maintenance", modules:[
      { id:"m11", title:"Engine Inspection Procedures",   pdf:"Inspection.pdf",  ppt:null,         video:null },
    ]},
  ]},
  airframe:{ sections:[
    { id:"f1", name:"AFR 1 – Aircraft Systems", modules:[
      { id:"m12", title:"Hydraulic Systems Overview",    pdf:"Hydraulic.pdf",   ppt:null,         video:"https://www.youtube.com/embed/HzDe2YNYB5E" },
      { id:"m13", title:"Fuel System Architecture",      pdf:"Fuel.pdf",        ppt:"Fuel.pptx",  video:null },
    ]},
  ]},
  structure:{ sections:[
    { id:"s1", name:"STR 1 – Composite Materials", modules:[
      { id:"m14", title:"Carbon Fiber Fundamentals",     pdf:"Carbon.pdf",      ppt:null,         video:null },
    ]},
  ]},
  gc:{ sections:[
    { id:"g1", name:"GCC 1 – Aviation Fundamentals", modules:[
      { id:"m15", title:"History of Aviation",            pdf:"AvHist.pdf",      ppt:"Hist.pptx",  video:"https://www.youtube.com/embed/nRU5OcAXfuo" },
      { id:"m16", title:"Principles of Flight",           pdf:"PoFlight.pdf",   ppt:null,         video:"https://www.youtube.com/embed/Gg0TXNXgz-w" },
    ]},
    { id:"g2", name:"GCC 2 – Mathematics for Aviation", modules:[
      { id:"m17", title:"Trigonometry Essentials",        pdf:"Trig.pdf",        ppt:null,         video:null },
      { id:"m18", title:"Physics for Mechanics",          pdf:"Physics.pdf",     ppt:"Phys.pptx",  video:"https://www.youtube.com/embed/ZM8ECpBuQYE" },
    ]},
  ]},
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
// Colours taken directly from ethiopianairlines.com:
//   Navbar green: #1e7e34 (dark green) / header: #2d8a2d
//   CTA button red: #c8102e
//   Yellow accent: #f5a623 / #ffc72c
//   Body font: similar to Roboto/Open Sans, clean sans-serif
//   White page backgrounds with light grey (#f5f5f5) section alternates
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Slab:wght@700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:  #2b8a2b;
  --green2: #1f6e1f;
  --green3: #e8f5e8;
  --green4: #d4edda;
  --red:    #c8102e;
  --red2:   #a00d24;
  --yellow: #ffc72c;
  --yel2:   #e6b300;
  --white:  #ffffff;
  --grey0:  #f5f5f5;
  --grey1:  #eeeeee;
  --grey2:  #e0e0e0;
  --grey3:  #9e9e9e;
  --grey4:  #616161;
  --text:   #212121;
  --text2:  #424242;
  --text3:  #757575;
  --sans:'Roboto',system-ui,sans-serif;
  --slab:'Roboto Slab',Georgia,serif;
  --r:4px;
  --r2:8px;
  --sh:0 2px 8px rgba(0,0,0,.12);
  --sh2:0 4px 24px rgba(0,0,0,.15);
}
body{font-family:var(--sans);background:var(--white);color:var(--text);-webkit-font-smoothing:antialiased;font-size:14px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.au{animation:fadeUp .45s ease forwards}
.ai{animation:fadeIn .3s ease forwards}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--grey1)}::-webkit-scrollbar-thumb{background:var(--grey2);border-radius:3px}

/* ── ET NAV (exact match to ethiopianairlines.com) ── */
.et-topbar-wrap{position:sticky;top:0;z-index:500;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.et-topbar-upper{background:var(--green);height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 20px}
.et-logo-link{display:flex;align-items:center;gap:10px;text-decoration:none}
.et-logo-img{height:28px;object-fit:contain;filter:brightness(0) invert(1)}
.et-top-right{display:flex;align-items:center;gap:4px}
.et-top-btn{background:transparent;border:none;color:rgba(255,255,255,.85);font-family:var(--sans);font-size:13px;font-weight:500;padding:0 12px;height:42px;cursor:pointer;display:flex;align-items:center;gap:4px;transition:background .15s;white-space:nowrap}
.et-top-btn:hover{background:rgba(255,255,255,.12);color:#fff}
.et-top-btn.cta{background:var(--red);color:#fff;font-weight:700}
.et-top-btn.cta:hover{background:var(--red2)}
.et-topbar-lower{background:#1a5e1a;height:40px;display:flex;align-items:center;padding:0 20px;gap:2px;border-top:1px solid rgba(255,255,255,.1)}
.et-nav-btn{background:transparent;border:none;color:rgba(255,255,255,.78);font-family:var(--sans);font-size:13px;font-weight:500;padding:0 16px;height:40px;cursor:pointer;transition:background .15s;white-space:nowrap}
.et-nav-btn:hover{background:rgba(255,255,255,.1);color:#fff}
.et-nav-btn.active{background:rgba(255,255,255,.15);color:#fff;border-bottom:3px solid var(--yellow)}

/* ── ET BREADCRUMB ── */
.et-breadcrumb{background:var(--grey0);border-bottom:1px solid var(--grey2);padding:8px 20px;font-size:12px;color:var(--grey3);display:flex;align-items:center;gap:6px}
.et-breadcrumb a{color:var(--green);text-decoration:none;cursor:pointer}.et-breadcrumb a:hover{text-decoration:underline}

/* ── HERO ── */
.hero{position:relative;height:420px;display:flex;align-items:flex-end;overflow:hidden;background:var(--green2)}
.hero-img{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80') center/cover;opacity:.4}
.hero-grad{position:absolute;inset:0;background:linear-gradient(90deg,rgba(27,94,32,.95) 0%,rgba(27,94,32,.6) 50%,rgba(0,0,0,.1) 100%)}
.hero-content{position:relative;z-index:1;padding:40px 40px 48px;max-width:640px}
.hero-eyebrow{font-size:12px;color:var(--yellow);font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.hero-eyebrow::before{content:'';width:24px;height:2px;background:var(--yellow);display:block}
.hero-title{font-family:var(--slab);font-size:clamp(22px,3.5vw,38px);font-weight:900;color:#fff;line-height:1.15;margin-bottom:10px}
.hero-sub{font-size:15px;color:rgba(255,255,255,.75);line-height:1.7;margin-bottom:28px;max-width:440px}
.hero-stats{display:flex;gap:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,.2)}
.hero-stat-val{font-family:var(--slab);font-size:26px;font-weight:900;color:var(--yellow)}
.hero-stat-lbl{font-size:11px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}

/* ── ET STRIPE ── */
.et-stripe{height:4px;display:flex}
.et-stripe-g{flex:1;background:var(--green)}
.et-stripe-y{flex:1;background:var(--yellow)}
.et-stripe-r{flex:1;background:var(--red)}

/* ── SECTION LAYOUTS ── */
.page-wrap{background:var(--white)}
.section{padding:40px 20px;max-width:1100px;margin:0 auto}
.section-alt{background:var(--grey0)}
.section-title{font-family:var(--slab);font-size:22px;font-weight:700;color:var(--text);margin-bottom:6px;display:flex;align-items:center;gap:10px}
.section-title::before{content:'';width:4px;height:22px;background:var(--green);display:block;border-radius:2px}
.section-sub{color:var(--text3);font-size:13px;margin-bottom:24px;padding-left:14px}

/* ── DEPT GRID ── */
.dept-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px}
.dept-card{position:relative;border-radius:var(--r2);overflow:hidden;aspect-ratio:4/3;cursor:pointer;transition:transform .22s,box-shadow .22s;box-shadow:var(--sh);border:1px solid var(--grey2)}
.dept-card:hover{transform:translateY(-4px);box-shadow:var(--sh2)}
.dept-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dept-card-ov{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.2) 55%,rgba(0,0,0,0) 100%)}
.dept-card-body{position:relative;z-index:1;padding:14px;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;height:100%}
.dept-card-icon{font-size:20px;margin-bottom:6px}
.dept-card-name{font-weight:700;font-size:14px;line-height:1.3}
.dept-card-desc{font-size:11px;opacity:.65;margin-top:3px;line-height:1.4}
.dept-card-bar{display:flex;height:3px;gap:2px;margin-top:10px;border-radius:2px;overflow:hidden}

/* ── SECTION/MODULE ACCORDION ── */
.accordion{border:1px solid var(--grey2);border-radius:var(--r2);overflow:hidden;margin-bottom:10px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.acc-head{padding:14px 16px;background:var(--grey0);border-bottom:1px solid var(--grey2);display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;transition:background .15s}
.acc-head:hover{background:var(--green3)}
.acc-head.open{background:var(--green3);border-bottom-color:var(--green)}
.acc-title{font-weight:700;font-size:13.5px;color:var(--text);display:flex;align-items:center;gap:8px}
.acc-chevron{color:var(--grey3);font-size:12px;transition:transform .2s}
.acc-chevron.open{transform:rotate(180deg)}
.mod-list{padding:6px}
.mod-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:var(--r);cursor:pointer;transition:background .15s;gap:12px}
.mod-item:hover{background:var(--grey0)}
.mod-title{font-size:13px;font-weight:500;color:var(--text2);display:flex;align-items:center;gap:8px;flex:1}
.mod-item:hover .mod-title{color:var(--green)}
.mod-num{width:22px;height:22px;border-radius:3px;background:var(--green3);border:1px solid #b2ddb2;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--green2);flex-shrink:0}
.mod-tags{display:flex;gap:4px;flex-shrink:0}
.tag{padding:2px 7px;border-radius:3px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.tag-pdf{background:#fde8ea;color:var(--red)}
.tag-ppt{background:#fff3e0;color:#e65100}
.tag-vid{background:var(--green3);color:var(--green2)}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:var(--r);font-family:var(--sans);font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .18s;white-space:nowrap;letter-spacing:.01em}
.btn-green{background:var(--green);color:#fff}.btn-green:hover{background:var(--green2);box-shadow:0 2px 10px rgba(43,138,43,.35);transform:translateY(-1px)}
.btn-red{background:var(--red);color:#fff}.btn-red:hover{background:var(--red2);transform:translateY(-1px)}
.btn-yellow{background:var(--yellow);color:var(--text)}.btn-yellow:hover{background:var(--yel2);transform:translateY(-1px)}
.btn-outline-g{background:#fff;color:var(--green);border:1.5px solid var(--green)}.btn-outline-g:hover{background:var(--green3)}
.btn-outline-w{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.65)}.btn-outline-w:hover{background:rgba(255,255,255,.12);border-color:#fff}
.btn-ghost{background:var(--grey0);color:var(--text2);border:1px solid var(--grey2)}.btn-ghost:hover{background:var(--grey1)}
.btn-danger{background:#d32f2f;color:#fff}.btn-danger:hover{background:#b71c1c}
.btn-sm{padding:6px 13px;font-size:12px}
.btn-lg{padding:12px 28px;font-size:15px}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}

/* ── FORM ── */
.form-group{display:flex;flex-direction:column;gap:5px}
.form-label{font-size:11px;font-weight:700;color:var(--grey4);letter-spacing:.06em;text-transform:uppercase}
.form-input{padding:10px 13px;border:1.5px solid var(--grey2);border-radius:var(--r);font-family:var(--sans);font-size:14px;color:var(--text);background:#fff;outline:none;transition:border-color .18s,box-shadow .18s;width:100%}
.form-input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(43,138,43,.12)}
.form-input::placeholder{color:#bdbdbd}
.form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23757575' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}

/* ── AUTH PAGE ── */
.auth-page{min-height:100vh;display:flex;flex-direction:column}
.auth-body{flex:1;display:grid;grid-template-columns:1fr 1fr;background:var(--grey0)}
.auth-left{background:var(--green);position:relative;display:flex;flex-direction:column;justify-content:center;padding:48px;overflow:hidden}
.auth-left-photo{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=900&q=60') center/cover;opacity:.12}
.auth-left-fade{position:absolute;inset:0;background:linear-gradient(150deg,rgba(43,138,43,.7) 0%,rgba(20,70,20,.97) 100%)}
.auth-left-c{position:relative;z-index:1}
.auth-right{display:flex;align-items:center;justify-content:center;padding:40px;background:#fff;border-left:1px solid var(--grey2)}
.auth-form{width:100%;max-width:380px}
.auth-tabs{display:flex;border-bottom:2px solid var(--grey2);margin-bottom:24px}
.auth-tab{flex:1;padding:10px;border:none;background:transparent;font-family:var(--sans);font-size:14px;font-weight:500;color:var(--grey3);cursor:pointer;transition:all .18s;border-bottom:2px solid transparent;margin-bottom:-2px}
.auth-tab.active{color:var(--green);border-bottom-color:var(--green);font-weight:700}
.cred-box{background:rgba(255,199,44,.1);border:1px solid rgba(255,199,44,.3);border-radius:var(--r2);padding:14px;margin-top:24px}
.cred-box-title{color:var(--yellow);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.cred-item{background:rgba(0,0,0,.2);border-radius:4px;padding:8px 10px;margin-bottom:6px}
.cred-item:last-child{margin-bottom:0}
.cred-role{color:var(--yellow);font-size:11px;font-weight:700}
.cred-detail{color:rgba(255,255,255,.65);font-size:11px;font-family:monospace;margin-top:2px}

/* ── SIDEBAR (ET style) ── */
.app-layout{display:flex;min-height:100vh}
.sidebar{width:236px;flex-shrink:0;background:#fff;border-right:1px solid var(--grey2);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.sb-header{background:var(--green)}
.sb-logo-row{padding:12px 16px;display:flex;align-items:center;gap:10px}
.sb-logo-img{height:24px;filter:brightness(0) invert(1)}
.sb-user-row{background:rgba(0,0,0,.2);padding:10px 16px}
.sb-user-name{color:#fff;font-size:13px;font-weight:700}
.sb-user-sub{color:rgba(255,255,255,.65);font-size:11px;margin-top:2px}
.sb-nav{padding:8px}
.sb-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--grey3);padding:10px 8px 4px}
.sb-item{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:var(--r);cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.sb-item:hover{background:var(--green3);color:var(--green)}
.sb-item.active{background:var(--green);color:#fff;font-weight:700}
.sb-item-icon{width:18px;text-align:center;flex-shrink:0;font-size:14px}
.sb-footer{padding:8px;border-top:1px solid var(--grey2);margin-top:auto}

/* ── MAIN CONTENT AREA ── */
.main-area{flex:1;background:var(--grey0);overflow-y:auto}
.main-header{background:#fff;border-bottom:1px solid var(--grey2);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.main-header-title{font-weight:700;font-size:15px;color:var(--text)}
.main-header-sub{font-size:12px;color:var(--grey3);margin-top:1px}
.main-body{padding:24px;max-width:1060px}

/* ── CARDS ── */
.card{background:#fff;border-radius:var(--r2);border:1px solid var(--grey2);box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden}
.card-header{padding:12px 16px;border-bottom:1px solid var(--grey2);background:var(--grey0);display:flex;align-items:center;gap:8px}
.card-header-title{font-weight:700;font-size:13px}
.card-body{padding:16px}

/* ── TABLE ── */
.table-wrap{border-radius:var(--r2);border:1px solid var(--grey2);overflow:auto;box-shadow:0 1px 4px rgba(0,0,0,.06)}
table{width:100%;border-collapse:collapse;background:#fff}
th{background:var(--grey0);padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--green);border-bottom:2px solid var(--green)}
td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--grey1);color:var(--text2);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#f9fff9}
.pending-highlight td{background:#fffde7}
.pending-highlight:hover td{background:#fff8d6}

/* ── STAT CARDS ── */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px;margin-bottom:24px}
.stat-card{background:#fff;border-radius:var(--r2);padding:16px;border:1px solid var(--grey2);box-shadow:0 1px 3px rgba(0,0,0,.06)}
.stat-card-icon{font-size:22px;margin-bottom:8px}
.stat-card-val{font-family:var(--slab);font-size:30px;font-weight:900;line-height:1}
.stat-card-label{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--grey3);margin-top:4px;font-weight:700}

/* ── BADGES ── */
.badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:3px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.badge-green{background:#e8f5e9;color:#1b5e20}
.badge-yellow{background:#fff8e1;color:#f57f17}
.badge-red{background:#ffebee;color:#b71c1c}
.badge-blue{background:#e3f2fd;color:#0d47a1}
.badge-gray{background:#f5f5f5;color:#616161}

/* ── TOAST ── */
.toast{position:fixed;bottom:20px;right:20px;background:var(--text);color:#fff;padding:12px 18px;border-radius:var(--r2);z-index:9999;animation:fadeUp .3s;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;box-shadow:0 8px 32px rgba(0,0,0,.25);max-width:300px}
.toast-success{border-left:4px solid #4caf50}
.toast-error{border-left:4px solid var(--red)}
.toast-info{border-left:4px solid var(--yellow)}

/* ── VIEWER ── */
.viewer{min-height:100vh;display:flex;flex-direction:column;background:#f5f5f5}
.viewer-header{background:var(--green);color:#fff;padding:12px 20px;display:flex;align-items:center;gap:12px}
.viewer-tabs{display:flex;background:#fff;border-bottom:1px solid var(--grey2)}
.viewer-tab{padding:10px 20px;border:none;background:transparent;font-family:var(--sans);font-size:13px;font-weight:600;color:var(--grey3);cursor:pointer;transition:all .15s;border-bottom:3px solid transparent}
.viewer-tab.active{color:var(--green);border-bottom-color:var(--green)}
.viewer-body{flex:1;display:flex;align-items:center;justify-content:center;padding:24px}

/* ── PDF MOCK ── */
.pdf-doc{background:#fff;max-width:640px;width:100%;border:1px solid var(--grey2);border-radius:4px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.14)}
.pdf-doc-header{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:3px solid var(--green);margin-bottom:18px}
.pdf-doc-logo{height:36px}
.pdf-doc-meta-title{font-size:10px;color:var(--grey3);text-transform:uppercase;letter-spacing:.07em}
.pdf-doc-meta-dept{font-size:12px;font-weight:600;color:var(--text2)}
.pdf-doc h2{font-family:var(--slab);font-size:20px;margin-bottom:14px;color:var(--text)}
.pdf-doc p{font-size:14px;line-height:1.85;color:var(--text2);margin-bottom:12px}
.pdf-doc-footer{text-align:center;font-size:11px;color:var(--grey3);margin-top:20px;padding-top:12px;border-top:1px solid var(--grey2);font-family:monospace}

/* ── MISC ── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.panel{background:#fff;border:1px solid var(--grey2);border-radius:var(--r2);padding:16px}
.breadcrumb{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--grey3);margin-bottom:18px;flex-wrap:wrap}
.breadcrumb a{color:var(--green);cursor:pointer;text-decoration:none;font-weight:600}.breadcrumb a:hover{text-decoration:underline}
.empty-state{text-align:center;padding:48px 24px;color:var(--grey3)}
.empty-state-icon{font-size:40px;margin-bottom:12px}
.empty-state-title{font-size:15px;font-weight:700;color:var(--text2);margin-bottom:6px}
.empty-state-sub{font-size:13px}
.alert-success{background:#e8f5e9;border:1px solid #a5d6a7;border-radius:var(--r);padding:12px 16px;color:#1b5e20;font-size:13px;display:flex;align-items:center;gap:8px}
.alert-error{background:#ffebee;border:1px solid #ef9a9a;border-radius:var(--r);padding:12px 16px;color:#b71c1c;font-size:13px;display:flex;align-items:center;gap:8px}
.upload-zone{background:var(--green3);border:2px dashed #81c784;border-radius:var(--r2);padding:36px;text-align:center;transition:border-color .2s}
.upload-zone:hover{border-color:var(--green)}
.info-row{display:flex;flex-direction:column;gap:6px;background:var(--grey0);border-radius:var(--r);padding:12px 14px;font-size:13px}
.info-row span:first-child{color:var(--grey3)}strong{color:var(--text);font-weight:600}
@media(max-width:768px){
  .auth-body{grid-template-columns:1fr}.auth-left{display:none}
  .sidebar{width:200px}.dept-grid{grid-template-columns:repeat(2,1fr)}
  .stat-grid{grid-template-columns:repeat(2,1fr)}.main-body{padding:14px}
  .two-col{grid-template-columns:1fr}.hero-content{padding:24px 20px 36px}
}
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  return (
    <div className={`toast toast-${type}`}>
      <span>{icon}</span>{msg}
    </div>
  );
}

// ─── ET NAV BAR (matches ethiopianairlines.com exactly) ───────────────────────
function EtNav({ onSignIn, showBack, onBack }) {
  return (
    <div className="et-topbar-wrap">
      <div className="et-topbar-upper">
        <div className="et-logo-link">
          <img
            src={ET_LOGO_URL}
            alt="Ethiopian Airlines"
            className="et-logo-img"
            onError={e => { e.target.onerror = null; e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
          />
          <span style={{ display:"none", color:"#fff", fontWeight:700, fontSize:14, letterSpacing:2 }}>ETHIOPIAN</span>
        </div>
        <div className="et-top-right">
          {showBack
            ? <button className="et-top-btn" onClick={onBack}>← Home</button>
            : <>
                <button className="et-top-btn">About EAU</button>
                <button className="et-top-btn">Programs</button>
                <button className="et-top-btn" onClick={onSignIn}>Sign In</button>
                <button className="et-top-btn cta" onClick={onSignIn}>Enroll Now</button>
              </>
          }
        </div>
      </div>
      <div className="et-topbar-lower">
        <button className="et-nav-btn">Book</button>
        <button className="et-nav-btn">Information</button>
        <button className="et-nav-btn">Services</button>
        <button className="et-nav-btn">Learning Portal</button>
      </div>
    </div>
  );
}

// ─── ET STRIPE ────────────────────────────────────────────────────────────────
function EtStripe() {
  return (
    <div className="et-stripe">
      <div className="et-stripe-g"/><div className="et-stripe-y"/><div className="et-stripe-r"/>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ onEnter }) {
  return (
    <div className="page-wrap">
      <EtNav onSignIn={onEnter} />
      <EtStripe />

      {/* HERO */}
      <div className="hero">
        <div className="hero-img" />
        <div className="hero-grad" />
        <div className="hero-content au">
          <div className="hero-eyebrow">The New Spirit of Africa</div>
          <h1 className="hero-title">
            Ethiopian Aviation University<br />
            <span style={{ color:"var(--yellow)" }}>Digital Learning Platform</span>
          </h1>
          <p className="hero-sub">
            Empowering the next generation of aviation maintenance technicians with ICAO-accredited education — accessible anywhere.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="btn btn-yellow btn-lg" onClick={onEnter}>Access Platform →</button>
            <button className="btn btn-outline-w" onClick={onEnter}>Student Sign In</button>
          </div>
          <div className="hero-stats">
            {[["4+","Departments"],["500+","Students Enrolled"],["200+","Modules"],["ICAO","Accredited"]].map(([v,l]) => (
              <div key={l}>
                <div className="hero-stat-val">{v}</div>
                <div className="hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="section">
        <div className="section-title">Learning Departments</div>
        <div className="section-sub">Select your department to explore courses and materials</div>
        <div className="dept-grid">
          {DEPTS.map(d => (
            <div key={d.id} className="dept-card au" onClick={onEnter}>
              <img src={DIMGS[d.id]} alt={d.name} onError={e => { e.target.style.display = "none"; }} />
              <div className="dept-card-ov" />
              <div className="dept-card-body">
                <div className="dept-card-icon">{d.icon}</div>
                <div className="dept-card-name">{d.name}</div>
                <div className="dept-card-desc">{d.desc}</div>
                <div className="dept-card-bar">
                  <span style={{ background:"var(--green)" }} />
                  <span style={{ background:"var(--yellow)" }} />
                  <span style={{ background:"var(--red)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY EAU */}
      <div className="section-alt">
        <div className="section" style={{ paddingTop:40, paddingBottom:40 }}>
          <div className="section-title">Why Ethiopian Aviation University?</div>
          <div className="section-sub">The industry standard for aviation maintenance education in Africa</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {[
              { icon:"✈️", title:"ICAO Accredited", desc:"All programs meet ICAO Doc 9379 and EASA Part-66 standards" },
              { icon:"📱", title:"Digital-First", desc:"Access PDFs, PowerPoints and video lectures from any device" },
              { icon:"🎓", title:"Expert Faculty", desc:"Learn from certified aviation maintenance instructors" },
              { icon:"🌍", title:"Pan-African Reach", desc:"Serving students across Africa and beyond" },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding:20 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontWeight:700, marginBottom:6, fontSize:14 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--text3)", lineHeight:1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER (matches ET site) */}
      <div style={{ background:"#1a1a1a", color:"#fff", padding:"32px 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:24 }}>
          <div>
            <img src={ET_LOGO_URL} alt="Ethiopian Airlines" style={{ height:32, filter:"brightness(0) invert(1)", marginBottom:12, display:"block" }} onError={e=>e.target.style.display="none"} />
            <p style={{ fontSize:12, color:"rgba(255,255,255,.45)", lineHeight:1.8 }}>Ethiopian Aviation University<br/>Digital Learning Platform</p>
          </div>
          {[
            { title:"Quick Links", links:["Departments","Programs","About EAU","Contact"] },
            { title:"Support", links:["Help Center","FAQ","Registrar Office","IT Support"] },
            { title:"Contact", links:["admissions@eau.edu.et","📍 Addis Ababa, Ethiopia","📞 +251-111-517-000"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight:700, fontSize:12, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize:13, color:"rgba(255,255,255,.65)", marginBottom:7, cursor:"pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.65)"}>
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth:1100, margin:"24px auto 0", borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:16, fontSize:12, color:"rgba(255,255,255,.3)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span>© 2026 Ethiopian Aviation University. All rights reserved.</span>
          <span>Privacy Policy · Terms of Use</span>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({ users, setUsers, onAuth, onBack }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ text:"", type:"" });
  const [form, setForm] = useState({ email:"", password:"", name:"", studentId:"", department:"" });

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const clearAlert = () => setAlert({ text:"", type:"" });

  // ── FIXED LOGIN: case-insensitive email, exact password match ────────────────
  const handleLogin = () => {
    clearAlert();
    const emailNorm = form.email.trim().toLowerCase();
    const pass = form.password;

    if (!emailNorm || !pass) {
      setAlert({ text:"Please enter your email address and password.", type:"error" });
      return;
    }

    // Find user by email (case-insensitive) AND password
    const found = users.find(u =>
      u.email.trim().toLowerCase() === emailNorm &&
      u.password === pass
    );

    if (!found) {
      setAlert({ text:"Incorrect email or password. Please check your credentials and try again.", type:"error" });
      return;
    }

    if (found.status === "pending") {
      setAlert({ text:"Your account is pending approval by the registrar. You will receive confirmation once approved.", type:"error" });
      return;
    }
    if (found.status === "rejected") {
      setAlert({ text:"Your registration has been rejected. Please contact the admissions office.", type:"error" });
      return;
    }
    if (found.status === "disabled") {
      setAlert({ text:"Your account has been disabled. Please contact administration.", type:"error" });
      return;
    }

    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth(found); }, 600);
  };

  const handleSignup = () => {
    clearAlert();
    if (!form.name || !form.email || !form.password || !form.studentId || !form.department) {
      setAlert({ text:"All fields are required. Please complete the form.", type:"error" });
      return;
    }
    if (form.password.length < 6) {
      setAlert({ text:"Password must be at least 6 characters long.", type:"error" });
      return;
    }
    const emailNorm = form.email.trim().toLowerCase();
    if (users.find(u => u.email.trim().toLowerCase() === emailNorm)) {
      setAlert({ text:"An account with this email address already exists.", type:"error" });
      return;
    }
    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: "student",
      status: "pending",
      department: form.department,
      studentId: form.studentId.trim(),
    };
    setUsers(prev => [...prev, newUser]);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTab("login");
      setForm(f => ({ ...f, email: form.email.trim(), password:"", name:"", studentId:"", department:"" }));
      setAlert({ text:"Account created successfully! Your application is now pending registrar approval.", type:"success" });
    }, 700);
  };

  const handleKey = e => { if (e.key === "Enter") tab === "login" ? handleLogin() : handleSignup(); };

  return (
    <div className="auth-page">
      <EtNav showBack onBack={onBack} />
      <EtStripe />

      <div className="auth-body">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-left-photo" />
          <div className="auth-left-fade" />
          <div className="auth-left-c">
            <img src={ET_LOGO_URL} alt="Ethiopian Airlines" style={{ height:44, marginBottom:20, filter:"brightness(0) invert(1)" }} onError={e => e.target.style.display="none"} />
            <h2 style={{ fontFamily:"var(--slab)", color:"#fff", fontSize:22, fontWeight:900, lineHeight:1.25, marginBottom:10 }}>
              Ethiopian Aviation University
            </h2>
            <p style={{ color:"rgba(255,255,255,.65)", fontSize:13, lineHeight:1.8, marginBottom:20 }}>
              Africa's leading aviation maintenance training institution. ICAO accredited. Internationally recognised.
            </p>
            <EtStripe />
            <div className="cred-box" style={{ marginTop:20 }}>
              <div className="cred-box-title">⚡ Demo Credentials</div>
              {[
                { r:"Admin",      e:"admin@eau.edu.et",      p:"admin123", note:"Full access" },
                { r:"Registrar",  e:"registrar@eau.edu.et",  p:"reg123",   note:"Approve students" },
                { r:"Student ✓",  e:"abebe@student.eau.et",  p:"pass123",  note:"Pre-approved" },
              ].map(x => (
                <div key={x.r} className="cred-item">
                  <div className="cred-role">{x.r} <span style={{ color:"rgba(255,255,255,.4)", fontWeight:400 }}>— {x.note}</span></div>
                  <div className="cred-detail">{x.e}</div>
                  <div className="cred-detail">Password: {x.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form">
            <img src={ET_LOGO_URL} alt="Ethiopian Airlines" style={{ height:38, marginBottom:20, display:"block" }} onError={e => e.target.style.display="none"} />
            <h1 style={{ fontFamily:"var(--slab)", fontSize:22, fontWeight:900, color:"var(--text)", marginBottom:4 }}>
              {tab === "login" ? "Sign In to Your Account" : "Create New Account"}
            </h1>
            <p style={{ color:"var(--grey3)", fontSize:13, marginBottom:20 }}>
              {tab === "login" ? "Access your aviation learning dashboard." : "Register as a new aviation student."}
            </p>

            <div className="auth-tabs">
              <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); clearAlert(); }}>Sign In</button>
              <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); clearAlert(); }}>Register</button>
            </div>

            {alert.text && (
              <div className={alert.type === "success" ? "alert-success" : "alert-error"} style={{ marginBottom:16 }}>
                <span>{alert.type === "success" ? "✓" : "✕"}</span>
                <span>{alert.text}</span>
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {tab === "signup" && (
                <>
                  <div className="two-col">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="Abebe Girma" value={form.name} onChange={e => upd("name", e.target.value)} onKeyDown={handleKey} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Student ID</label>
                      <input className="form-input" placeholder="EAU-2024-XXX" value={form.studentId} onChange={e => upd("studentId", e.target.value)} onKeyDown={handleKey} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select className="form-input form-select" value={form.department} onChange={e => upd("department", e.target.value)}>
                      <option value="">— Select Department —</option>
                      {["Avionics","Power Plant","Airframe","Structure","AMT"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => upd("email", e.target.value)} onKeyDown={handleKey} autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => upd("password", e.target.value)} onKeyDown={handleKey} autoComplete={tab === "login" ? "current-password" : "new-password"} />
              </div>
              <button
                className="btn btn-green"
                style={{ width:"100%", justifyContent:"center", padding:"11px", fontSize:14, marginTop:4 }}
                onClick={tab === "login" ? handleLogin : handleSignup}
                disabled={loading}
              >
                {loading ? "⏳ Please wait…" : tab === "login" ? "Sign In to Platform" : "Create Account →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, active, setActive, onLogout }) {
  const studentNav = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"search",    icon:"🔍", label:"Search Materials" },
    { id:"recent",    icon:"🕒", label:"Recently Viewed" },
  ];
  const adminNav = [
    { id:"dashboard", icon:"📊", label:"Overview" },
    { id:"users",     icon:"👥", label:"Manage Users" },
    { id:"content",   icon:"📁", label:"Content Manager" },
    { id:"upload",    icon:"⬆", label:"Upload & Create" },
    { id:"logs",      icon:"📋", label:"Audit Logs" },
  ];
  const regNav = [
    { id:"dashboard", icon:"⏳", label:"Pending Approvals" },
    { id:"students",  icon:"🎓", label:"All Students" },
  ];
  const navItems = user.role === "admin" ? adminNav : user.role === "registrar" ? regNav : studentNav;

  return (
    <div className="sidebar">
      <div className="sb-header">
        <div className="sb-logo-row">
          <img src={ET_LOGO_URL} alt="ET" className="sb-logo-img" onError={e=>e.target.style.display="none"} />
        </div>
        <div className="sb-user-row">
          <div className="sb-user-name">{user.name}</div>
          <div className="sb-user-sub">{user.role}{user.department ? ` · ${user.department}` : ""}</div>
        </div>
      </div>
      <EtStripe />
      <nav className="sb-nav">
        <div className="sb-section-label">Navigation</div>
        {navItems.map(it => (
          <button key={it.id} className={`sb-item ${active === it.id ? "active" : ""}`} onClick={() => setActive(it.id)}>
            <span className="sb-item-icon">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sb-footer">
        <button className="sb-item" style={{ width:"100%", color:"var(--red)" }} onClick={onLogout}>
          <span className="sb-item-icon">🚪</span><span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── PENDING SCREEN ───────────────────────────────────────────────────────────
function PendingScreen({ user, onLogout }) {
  return (
    <div style={{ minHeight:"100vh", background:"var(--grey0)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"var(--green)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <img src={ET_LOGO_URL} alt="ET" style={{ height:30, filter:"brightness(0) invert(1)" }} onError={e=>e.target.style.display="none"} />
      </div>
      <EtStripe />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div className="card" style={{ maxWidth:440, width:"100%", overflow:"visible" }}>
          <div style={{ background:"var(--green)", padding:"20px 24px", borderRadius:"8px 8px 0 0" }}>
            <img src={ET_LOGO_URL} alt="ET" style={{ height:32, filter:"brightness(0) invert(1)" }} onError={e=>e.target.style.display="none"} />
          </div>
          <EtStripe />
          <div style={{ padding:28, textAlign:"center" }}>
            <div style={{ width:64, height:64, background:"#fff8e1", border:"2px solid var(--yellow)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 16px" }}>⏳</div>
            <h2 style={{ fontFamily:"var(--slab)", fontSize:20, marginBottom:10 }}>Account Under Review</h2>
            <p style={{ color:"var(--text2)", fontSize:13, lineHeight:1.75, marginBottom:20 }}>
              Hello <strong>{user.name}</strong>, your application for the <strong>{user.department}</strong> department has been received and is under review by the registrar office.
            </p>
            <div className="info-row" style={{ textAlign:"left", marginBottom:20 }}>
              <div><span style={{ color:"var(--grey3)" }}>Name: </span><strong>{user.name}</strong></div>
              <div><span style={{ color:"var(--grey3)" }}>Student ID: </span><strong>{user.studentId}</strong></div>
              <div><span style={{ color:"var(--grey3)" }}>Department: </span><strong>{user.department}</strong></div>
              <div><span style={{ color:"var(--grey3)" }}>Status: </span><span className="badge badge-yellow">Pending Approval</span></div>
            </div>
            <button className="btn btn-outline-g" onClick={onLogout}>← Back to Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODULE VIEWER ────────────────────────────────────────────────────────────
function ModViewer({ dept, sec, mod, onBack, toast }) {
  const [tab, setTab] = useState(mod.pdf ? "pdf" : mod.ppt ? "ppt" : "video");

  return (
    <div className="viewer">
      <div className="viewer-header">
        <button className="btn btn-outline-w btn-sm" onClick={onBack}>← Back</button>
        <div style={{ flex:1, marginLeft:8 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", marginBottom:2 }}>{dept.name} › {sec.name}</div>
          <div style={{ fontWeight:700, fontSize:14 }}>{mod.title}</div>
        </div>
        <img src={ET_LOGO_URL} alt="ET" style={{ height:26, filter:"brightness(0) invert(1)" }} onError={e=>e.target.style.display="none"} />
      </div>
      <EtStripe />
      <div className="viewer-tabs">
        {mod.pdf   && <button className={`viewer-tab ${tab==="pdf"  ?"active":""}`} onClick={()=>setTab("pdf")}>📄 PDF Material</button>}
        {mod.ppt   && <button className={`viewer-tab ${tab==="ppt"  ?"active":""}`} onClick={()=>setTab("ppt")}>📊 PowerPoint</button>}
        {mod.video && <button className={`viewer-tab ${tab==="video"?"active":""}`} onClick={()=>setTab("video")}>🎬 Video Lecture</button>}
      </div>
      <div className="viewer-body">
        {(tab === "pdf" || tab === "ppt") && (
          <div style={{ width:"100%", maxWidth:680 }}>
            <div className="pdf-doc">
              <div className="pdf-doc-header">
                <img src={ET_LOGO_URL} className="pdf-doc-logo" alt="ET" onError={e=>e.target.style.display="none"} />
                <div>
                  <div className="pdf-doc-meta-title">Ethiopian Aviation University</div>
                  <div className="pdf-doc-meta-dept">{dept.name} — {sec.name}</div>
                </div>
              </div>
              <h2>{mod.title}</h2>
              <p>This is a demonstration of the EAU built-in {tab === "ppt" ? "PowerPoint (converted to PDF)" : "PDF"} viewer. In the production system, authenticated documents are securely rendered via cloud storage with role-based access control.</p>
              <p>The curriculum adheres to ICAO Doc 9379, EASA Part-66 standards, and Ethiopian CAA regulations for aviation maintenance training at certificate levels A, B1.1, B1.3, and B2.</p>
              <p>Students must complete all reading materials and module assessments before advancing to the next section in <strong>{sec.name}</strong>.</p>
              <div className="pdf-doc-footer">Page 1 of 14 &nbsp;·&nbsp; {tab === "ppt" ? mod.ppt : mod.pdf}</div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:16 }}>
              <button className="btn btn-green btn-sm" onClick={() => toast("Opening full screen viewer…", "info")}>📂 Full Screen</button>
              <button className="btn btn-ghost btn-sm" onClick={() => toast(`Download started: ${tab==="ppt"?mod.ppt:mod.pdf}`, "success")}>⬇ Download</button>
            </div>
          </div>
        )}
        {tab === "video" && mod.video && (
          <div style={{ width:"100%", maxWidth:860 }}>
            <div style={{ borderRadius:8, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,.18)", border:"1px solid var(--grey2)" }}>
              <iframe width="100%" height="460" src={mod.video} title={mod.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display:"block" }} />
            </div>
            <p style={{ color:"var(--grey3)", fontSize:12, textAlign:"center", marginTop:10 }}>{mod.title} — {dept.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDash({ user, content, toast }) {
  const [view, setView] = useState("dashboard");
  const [dept, setDept] = useState(null);
  const [mod, setMod] = useState(null);
  const [openSecs, setOpenSecs] = useState({});
  const [recent, setRecent] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const toggleSec = id => setOpenSecs(o => ({ ...o, [id]: !o[id] }));

  const openMod = (d, s, m) => {
    setMod({ dept:d, sec:s, mod:m });
    setRecent(r => [{ dept:d, sec:s, mod:m, time:Date.now() }, ...r.filter(x => x.mod.id !== m.id)].slice(0, 12));
  };

  const doSearch = val => {
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    const found = [];
    DEPTS.forEach(d =>
      (content[d.id]?.sections || []).forEach(s =>
        s.modules.forEach(m => {
          if (m.title.toLowerCase().includes(val.toLowerCase()) || s.name.toLowerCase().includes(val.toLowerCase()))
            found.push({ dept:d, sec:s, mod:m });
        })
      )
    );
    setResults(found);
  };

  if (mod) return <ModViewer dept={mod.dept} sec={mod.sec} mod={mod.mod} onBack={() => setMod(null)} toast={toast} />;
  if (dept) {
    const deptContent = content[dept.id];
    return (
      <div className="app-layout">
        <Sidebar user={user} active={view} setActive={v => { setView(v); setDept(null); }} onLogout={() => window.location.reload()} />
        <div className="main-area">
          <div className="main-header">
            <div>
              <div className="main-header-title">{dept.icon} {dept.name}</div>
              <div className="main-header-sub">{dept.desc}</div>
            </div>
            <img src={ET_LOGO_URL} alt="ET" style={{ height:28 }} onError={e=>e.target.style.display="none"} />
          </div>
          <div className="main-body">
            <div className="breadcrumb">
              <a onClick={() => setDept(null)}>Dashboard</a>
              <span>›</span><span>{dept.name}</span>
            </div>
            {deptContent
              ? deptContent.sections.map(sec => (
                  <div key={sec.id} className="accordion">
                    <div className={`acc-head ${openSecs[sec.id] ? "open" : ""}`} onClick={() => toggleSec(sec.id)}>
                      <div className="acc-title">
                        <span style={{ color:"var(--green)" }}>▸</span>
                        {sec.name}
                        <span className="badge badge-green">{sec.modules.length}</span>
                      </div>
                      <span className={`acc-chevron ${openSecs[sec.id] ? "open" : ""}`}>▼</span>
                    </div>
                    {openSecs[sec.id] && (
                      <div className="mod-list">
                        {sec.modules.map((m, i) => (
                          <div key={m.id} className="mod-item" onClick={() => openMod(dept, sec, m)}>
                            <div className="mod-title">
                              <span className="mod-num">{i + 1}</span>
                              {m.title}
                            </div>
                            <div className="mod-tags">
                              {m.pdf   && <span className="tag tag-pdf">PDF</span>}
                              {m.ppt   && <span className="tag tag-ppt">PPT</span>}
                              {m.video && <span className="tag tag-vid">VID</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              : <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-title">No content yet</div><div className="empty-state-sub">The admin hasn't added modules to this department yet.</div></div>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} active={view} setActive={v => { setView(v); setDept(null); }} onLogout={() => window.location.reload()} />
      <div className="main-area">
        <div className="main-header">
          <div>
            <div className="main-header-title">Student Learning Portal</div>
            <div className="main-header-sub">Welcome back, {user.name.split(" ")[0]} · {user.department} · {user.studentId}</div>
          </div>
          <img src={ET_LOGO_URL} alt="ET" style={{ height:28 }} onError={e=>e.target.style.display="none"} />
        </div>

        <div className="main-body">
          {view === "dashboard" && (
            <div className="au">
              <div className="section-title">My Departments</div>
              <div className="section-sub">Select a department to access learning materials</div>
              <div className="dept-grid">
                {DEPTS.map(d => (
                  <div key={d.id} className="dept-card" onClick={() => setDept(d)}>
                    <img src={DIMGS[d.id]} alt={d.name} onError={e => { e.target.style.display = "none"; }} />
                    <div className="dept-card-ov" />
                    <div className="dept-card-body">
                      <div className="dept-card-icon">{d.icon}</div>
                      <div className="dept-card-name">{d.name}</div>
                      <div className="dept-card-desc">{d.desc}</div>
                      <div className="dept-card-bar">
                        <span style={{ background:"var(--green)" }} />
                        <span style={{ background:"var(--yellow)" }} />
                        <span style={{ background:"var(--red)" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "search" && (
            <div className="au">
              <div className="section-title">Search Materials</div>
              <div style={{ marginBottom:16 }}>
                <input
                  className="form-input"
                  placeholder="Search modules, sections, departments…"
                  value={query}
                  onChange={e => doSearch(e.target.value)}
                  style={{ fontSize:15, padding:"12px 14px" }}
                />
              </div>
              {results.length > 0
                ? <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {results.map((r, i) => (
                      <div key={i} className="accordion" style={{ cursor:"pointer" }} onClick={() => openMod(r.dept, r.sec, r.mod)}>
                        <div className="acc-head" style={{ padding:"12px 16px" }}>
                          <div className="acc-title" style={{ gap:10 }}>
                            <span>{r.dept.icon}</span>
                            <div>
                              <div style={{ fontWeight:700 }}>{r.mod.title}</div>
                              <div style={{ fontWeight:400, fontSize:12, color:"var(--grey3)", marginTop:2 }}>{r.dept.name} › {r.sec.name}</div>
                            </div>
                          </div>
                          <div className="mod-tags">
                            {r.mod.pdf   && <span className="tag tag-pdf">PDF</span>}
                            {r.mod.ppt   && <span className="tag tag-ppt">PPT</span>}
                            {r.mod.video && <span className="tag tag-vid">VID</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                : query
                  ? <div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">No results found</div><div className="empty-state-sub">Try a different keyword.</div></div>
                  : null
              }
            </div>
          )}

          {view === "recent" && (
            <div className="au">
              <div className="section-title">Recently Viewed</div>
              {recent.length === 0
                ? <div className="empty-state"><div className="empty-state-icon">🕒</div><div className="empty-state-title">No history yet</div><div className="empty-state-sub">Open a module to see it here.</div></div>
                : <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {recent.map((r, i) => (
                      <div key={i} className="accordion" style={{ cursor:"pointer" }} onClick={() => openMod(r.dept, r.sec, r.mod)}>
                        <div className="acc-head" style={{ padding:"12px 16px" }}>
                          <div className="acc-title" style={{ gap:10 }}>
                            <span>{r.dept.icon}</span>
                            <div>
                              <div style={{ fontWeight:700 }}>{r.mod.title}</div>
                              <div style={{ fontWeight:400, fontSize:12, color:"var(--grey3)", marginTop:2 }}>{r.dept.name} › {r.sec.name}</div>
                            </div>
                          </div>
                          <span style={{ fontSize:12, color:"var(--grey3)" }}>{Math.max(1, Math.round((Date.now() - r.time) / 60000))}m ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDash({ user, users, setUsers, content, setContent, toast }) {
  const [view, setView] = useState("dashboard");
  const [deptFilter, setDeptFilter] = useState("");
  const [newSec, setNewSec] = useState({ dept:"", name:"" });
  const [newMod, setNewMod] = useState({ dept:"", section:"", title:"" });

  const students = users.filter(u => u.role === "student");
  const pending  = students.filter(u => u.status === "pending");
  const approved = students.filter(u => u.status === "approved");
  const totalMods = Object.values(content).reduce((a, d) => a + (d?.sections?.reduce((b, s) => b + s.modules.length, 0) || 0), 0);

  const setApproval = (id, status) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));
    toast(`Student ${status === "approved" ? "approved ✓" : "rejected"}`, status === "approved" ? "success" : "error");
  };
  const toggleRole = id => {
    setUsers(u => u.map(x => x.id === id && x.role !== "admin" ? { ...x, role: x.role === "registrar" ? "student" : "registrar" } : x));
    toast("Role updated", "success");
  };
  const toggleDisable = id => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === "disabled" ? "approved" : "disabled" } : x));
    toast("Account updated", "success");
  };
  const addSection = () => {
    if (!newSec.dept || !newSec.name) { toast("Fill all fields", "error"); return; }
    setContent(c => ({ ...c, [newSec.dept]: { ...c[newSec.dept], sections: [...(c[newSec.dept]?.sections || []), { id:"s"+Date.now(), name:newSec.name, modules:[] }] } }));
    setNewSec({ dept:"", name:"" });
    toast("Section created", "success");
  };
  const addModule = () => {
    if (!newMod.dept || !newMod.section || !newMod.title) { toast("Fill all fields", "error"); return; }
    const m = { id:"m"+Date.now(), title:newMod.title, pdf:null, ppt:null, video:null };
    setContent(c => ({ ...c, [newMod.dept]: { ...c[newMod.dept], sections: c[newMod.dept].sections.map(s => s.id === newMod.section ? { ...s, modules: [...s.modules, m] } : s) } }));
    setNewMod({ dept:"", section:"", title:"" });
    toast("Module added", "success");
  };
  const deleteModule = (dId, sId, mId) => {
    setContent(c => ({ ...c, [dId]: { ...c[dId], sections: c[dId].sections.map(s => s.id === sId ? { ...s, modules: s.modules.filter(m => m.id !== mId) } : s) } }));
    toast("Module deleted", "success");
  };

  const filteredUsers = users.filter(u => u.role !== "admin" && (!deptFilter || u.department === deptFilter));

  return (
    <div className="app-layout">
      <Sidebar user={user} active={view} setActive={setView} onLogout={() => window.location.reload()} />
      <div className="main-area">
        <div className="main-header">
          <div>
            <div className="main-header-title">Administration Panel</div>
            <div className="main-header-sub">Ethiopian Aviation University — System Admin</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {pending.length > 0 && <span className="badge badge-yellow">⏳ {pending.length} Pending</span>}
            <img src={ET_LOGO_URL} alt="ET" style={{ height:28 }} onError={e=>e.target.style.display="none"} />
          </div>
        </div>
        <div className="main-body">

          {/* OVERVIEW */}
          {view === "dashboard" && (
            <div className="au">
              <div className="stat-grid">
                {[
                  { icon:"🎓", label:"Total Students",   val:students.length, color:"var(--green)" },
                  { icon:"⏳", label:"Pending Approval", val:pending.length,  color:"#e65100"       },
                  { icon:"✅", label:"Approved",         val:approved.length, color:"var(--green)"  },
                  { icon:"📚", label:"Total Modules",    val:totalMods,       color:"var(--red)"    },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ borderLeft:`4px solid ${s.color}` }}>
                    <div className="stat-card-icon">{s.icon}</div>
                    <div className="stat-card-val" style={{ color:s.color }}>{s.val}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* PENDING APPROVALS – front and centre */}
              <div className="card" style={{ marginBottom:24, borderLeft:"4px solid var(--yellow)" }}>
                <div className="card-header">
                  <div className="card-header-title">⏳ Pending Student Approvals</div>
                  {pending.length > 0 && <span className="badge badge-yellow">{pending.length} awaiting</span>}
                </div>
                <div className="card-body" style={{ padding:0 }}>
                  {pending.length === 0
                    ? <div style={{ padding:"16px 20px" }} className="alert-success"><span>✅</span><span>All clear — no pending approvals.</span></div>
                    : <div className="table-wrap" style={{ borderRadius:0, border:"none", boxShadow:"none" }}>
                        <table>
                          <thead>
                            <tr><th>Student</th><th>ID</th><th>Department</th><th style={{ textAlign:"center" }}>Actions</th></tr>
                          </thead>
                          <tbody>
                            {pending.map(u => (
                              <tr key={u.id} className="pending-highlight">
                                <td>
                                  <div style={{ fontWeight:700 }}>{u.name}</div>
                                  <div style={{ fontSize:12, color:"var(--grey3)" }}>{u.email}</div>
                                </td>
                                <td><code style={{ fontSize:12, background:"var(--grey0)", padding:"2px 6px", borderRadius:3 }}>{u.studentId || "—"}</code></td>
                                <td>
                                  <span style={{ display:"flex", alignItems:"center", gap:5, fontWeight:600 }}>
                                    {DEPTS.find(d => d.name === u.department)?.icon || "🎓"} {u.department || "—"}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                                    <button className="btn btn-green btn-sm" onClick={() => setApproval(u.id, "approved")}>✓ Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => setApproval(u.id, "rejected")}>✕ Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                  }
                </div>
              </div>

              {/* All students summary */}
              <div className="section-title" style={{ marginBottom:12 }}>All Students</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Department</th><th>Status</th></tr></thead>
                  <tbody>
                    {students.map(u => (
                      <tr key={u.id}>
                        <td><div style={{ fontWeight:600 }}>{u.name}</div><div style={{ fontSize:12, color:"var(--grey3)" }}>{u.email}</div></td>
                        <td>{u.department}</td>
                        <td><span className={`badge ${u.status==="approved"?"badge-green":u.status==="pending"?"badge-yellow":u.status==="disabled"?"badge-gray":"badge-red"}`}>{u.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MANAGE USERS */}
          {view === "users" && (
            <div className="au">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div className="section-title" style={{ margin:0 }}>Manage Users</div>
                <select className="form-input form-select" style={{ width:175 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="">All Departments</option>
                  {["Avionics","Power Plant","Airframe","Structure","AMT"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>User</th><th>ID</th><th>Dept/Role</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className={u.status === "pending" ? "pending-highlight" : ""}>
                        <td><div style={{ fontWeight:600 }}>{u.name}</div><div style={{ fontSize:12, color:"var(--grey3)" }}>{u.email}</div></td>
                        <td><code style={{ fontSize:12 }}>{u.studentId || "—"}</code></td>
                        <td>{u.department || u.role}</td>
                        <td><span className={`badge ${u.status==="approved"?"badge-green":u.status==="pending"?"badge-yellow":u.status==="disabled"?"badge-gray":"badge-red"}`}>{u.status}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {u.status === "pending" && <>
                              <button className="btn btn-green btn-sm" onClick={() => setApproval(u.id, "approved")}>✓ Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => setApproval(u.id, "rejected")}>✕ Reject</button>
                            </>}
                            {u.status === "approved" && u.role === "student" && <button className="btn btn-sm" style={{ background:"#e3f2fd", color:"#0d47a1", border:"1px solid #90caf9" }} onClick={() => toggleRole(u.id)}>↑ Registrar</button>}
                            {u.role === "registrar" && <button className="btn btn-ghost btn-sm" onClick={() => toggleRole(u.id)}>↓ Remove Role</button>}
                            {(u.status === "approved" || u.status === "disabled") && <button className="btn btn-sm" style={{ background:u.status==="disabled"?"#e8f5e9":"#ffebee", color:u.status==="disabled"?"#1b5e20":"#b71c1c" }} onClick={() => toggleDisable(u.id)}>{u.status === "disabled" ? "Enable" : "Disable"}</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTENT MANAGER */}
          {view === "content" && (
            <div className="au">
              <div className="section-title" style={{ marginBottom:16 }}>Content Manager</div>
              {DEPTS.map(d => (
                <div key={d.id} className="card" style={{ marginBottom:12 }}>
                  <div className="card-header" style={{ borderBottom:"2px solid var(--green)" }}>
                    <span>{d.icon}</span>
                    <div className="card-header-title">{d.name}</div>
                    <span className="badge badge-green">{content[d.id]?.sections?.length || 0} sections</span>
                  </div>
                  <div style={{ padding:"10px" }}>
                    {(content[d.id]?.sections || []).map(sec => (
                      <div key={sec.id} style={{ background:"var(--grey0)", borderRadius:6, padding:10, marginBottom:8, border:"1px solid var(--grey2)" }}>
                        <div style={{ fontWeight:700, fontSize:12, color:"var(--green)", marginBottom:6 }}>📂 {sec.name}</div>
                        {sec.modules.map(m => (
                          <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 10px", background:"#fff", border:"1px solid var(--grey2)", borderRadius:4, marginBottom:4 }}>
                            <span style={{ fontSize:13, fontWeight:500 }}>{m.title}</span>
                            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                              {m.pdf   && <span className="tag tag-pdf">PDF</span>}
                              {m.ppt   && <span className="tag tag-ppt">PPT</span>}
                              {m.video && <span className="tag tag-vid">VID</span>}
                              <button className="btn btn-sm" style={{ background:"#ffebee", color:"var(--red)", padding:"3px 8px" }} onClick={() => deleteModule(d.id, sec.id, m.id)}>🗑</button>
                            </div>
                          </div>
                        ))}
                        {sec.modules.length === 0 && <div style={{ fontSize:12, color:"var(--grey3)", fontStyle:"italic" }}>No modules yet</div>}
                      </div>
                    ))}
                    {!content[d.id]?.sections?.length && <div style={{ fontSize:12, color:"var(--grey3)", fontStyle:"italic", padding:"4px 2px" }}>No sections yet.</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* UPLOAD & CREATE */}
          {view === "upload" && (
            <div className="au">
              <div className="section-title" style={{ marginBottom:20 }}>Upload & Create Content</div>
              <div className="two-col">
                <div className="panel">
                  <div style={{ fontWeight:700, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:24, height:24, background:"var(--green)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14 }}>+</span>
                    Add New Section
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-input form-select" value={newSec.dept} onChange={e => setNewSec(s => ({ ...s, dept:e.target.value }))}>
                        <option value="">Select Department</option>
                        {DEPTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section Name</label>
                      <input className="form-input" placeholder="e.g. AVO 8 – Advanced Nav" value={newSec.name} onChange={e => setNewSec(s => ({ ...s, name:e.target.value }))} />
                    </div>
                    <button className="btn btn-green" onClick={addSection}>Create Section</button>
                  </div>
                </div>
                <div className="panel">
                  <div style={{ fontWeight:700, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:24, height:24, background:"var(--red)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14 }}>+</span>
                    Add Module to Section
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-input form-select" value={newMod.dept} onChange={e => setNewMod(m => ({ ...m, dept:e.target.value, section:"" }))}>
                        <option value="">Select</option>
                        {DEPTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section</label>
                      <select className="form-input form-select" value={newMod.section} onChange={e => setNewMod(m => ({ ...m, section:e.target.value }))} disabled={!newMod.dept}>
                        <option value="">Select</option>
                        {(content[newMod.dept]?.sections || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Module Title</label>
                      <input className="form-input" placeholder="e.g. Autopilot Systems" value={newMod.title} onChange={e => setNewMod(m => ({ ...m, title:e.target.value }))} />
                    </div>
                    <button className="btn btn-red" onClick={addModule}>Add Module</button>
                  </div>
                </div>
              </div>
              <div className="panel" style={{ marginTop:14 }}>
                <div style={{ fontWeight:700, marginBottom:12 }}>📎 Attach Files to Module</div>
                <div className="upload-zone">
                  <div style={{ fontSize:36, marginBottom:10 }}>☁️</div>
                  <div style={{ fontWeight:700, marginBottom:4 }}>Drag & Drop Files Here</div>
                  <div style={{ fontSize:13, color:"var(--grey3)", marginBottom:14 }}>Supports PDF, PPTX, or YouTube URL</div>
                  <button className="btn btn-green btn-sm" onClick={() => toast("File upload active in production", "info")}>Choose Files</button>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {view === "logs" && (
            <div className="au">
              <div className="section-title" style={{ marginBottom:16 }}>Audit Logs</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>Details</th></tr></thead>
                  <tbody>
                    {[
                      { t:"Today 10:42", a:"User Approved",  ac:"Admin User",      d:"Abebe Girma — Avionics" },
                      { t:"Today 10:38", a:"Module Created", ac:"Admin User",      d:"DC Circuit Analysis Lab" },
                      { t:"Today 09:55", a:"File Uploaded",  ac:"Admin User",      d:"AC_Waveforms.pdf → AVO 2" },
                      { t:"Today 09:30", a:"User Rejected",  ac:"Registrar Staff", d:"Applicant — Power Plant" },
                      { t:"Today 09:12", a:"Section Created",ac:"Admin User",      d:"PWR 3 – Turbine Inspection" },
                      { t:"Today 08:50", a:"Login",          ac:"Admin User",      d:"admin@eau.edu.et" },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td><code style={{ fontSize:12 }}>{row.t}</code></td>
                        <td><span className="badge badge-blue">{row.a}</span></td>
                        <td style={{ fontWeight:600 }}>{row.ac}</td>
                        <td style={{ color:"var(--grey4)" }}>{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REGISTRAR DASHBOARD ──────────────────────────────────────────────────────
function RegistrarDash({ user, users, setUsers, toast }) {
  const [view, setView] = useState("dashboard");
  const [deptFilter, setDeptFilter] = useState("");

  const updateStatus = (id, status) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, status } : x));
    toast(`Student ${status === "approved" ? "approved ✓" : "rejected"}`, status === "approved" ? "success" : "error");
  };

  const pending = users.filter(u => u.role === "student" && u.status === "pending" && (!deptFilter || u.department === deptFilter));
  const all     = users.filter(u => u.role === "student" && (!deptFilter || u.department === deptFilter));
  const list    = view === "dashboard" ? pending : all;

  return (
    <div className="app-layout">
      <Sidebar user={user} active={view} setActive={setView} onLogout={() => window.location.reload()} />
      <div className="main-area">
        <div className="main-header">
          <div>
            <div className="main-header-title">Registrar Office</div>
            <div className="main-header-sub">Student Enrollment Management</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {pending.length > 0 && <span className="badge badge-yellow">⏳ {pending.length} Pending</span>}
            <img src={ET_LOGO_URL} alt="ET" style={{ height:28 }} onError={e=>e.target.style.display="none"} />
          </div>
        </div>
        <div className="main-body">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div className="section-title" style={{ margin:0 }}>
              {view === "dashboard" ? "Pending Approvals" : "All Students"}
            </div>
            <select className="form-input form-select" style={{ width:175 }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {["Avionics","Power Plant","Airframe","Structure","AMT"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {list.length === 0
            ? <div className="empty-state">
                <div className="empty-state-icon">{view === "dashboard" ? "🎉" : "📭"}</div>
                <div className="empty-state-title">{view === "dashboard" ? "All caught up!" : "No students found"}</div>
                <div className="empty-state-sub">{view === "dashboard" ? "No pending approvals at this time." : "Try adjusting the department filter."}</div>
              </div>
            : <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th><th>Student ID</th><th>Department</th><th>Status</th>
                      {view === "dashboard" && <th style={{ textAlign:"center" }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(u => (
                      <tr key={u.id} className={u.status === "pending" ? "pending-highlight" : ""}>
                        <td><div style={{ fontWeight:700 }}>{u.name}</div><div style={{ fontSize:12, color:"var(--grey3)" }}>{u.email}</div></td>
                        <td><code style={{ fontSize:12 }}>{u.studentId || "—"}</code></td>
                        <td><span style={{ display:"flex", alignItems:"center", gap:5, fontWeight:600 }}>{DEPTS.find(d => d.name === u.department)?.icon || "🎓"} {u.department || "—"}</span></td>
                        <td><span className={`badge ${u.status==="approved"?"badge-green":u.status==="pending"?"badge-yellow":"badge-red"}`}>{u.status}</span></td>
                        {view === "dashboard" && (
                          <td>
                            <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                              <button className="btn btn-green btn-sm" onClick={() => updateStatus(u.id, "approved")}>✓ Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(u.id, "rejected")}>✕ Reject</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [toastData, setToastData] = useState(null);

  const showToast = (msg, type = "info") => {
    setToastData({ msg, type, key: Date.now() });
    setTimeout(() => setToastData(null), 4500);
  };

  const handleAuth = user => { setCurrentUser(user); setPage("app"); };
  const handleLogout = () => { setCurrentUser(null); setPage("landing"); };

  return (
    <>
      <style>{STYLES}</style>

      {page === "landing" && <Landing onEnter={() => setPage("auth")} />}

      {page === "auth" && (
        <AuthPage
          users={users}
          setUsers={setUsers}
          onAuth={handleAuth}
          onBack={() => setPage("landing")}
        />
      )}

      {page === "app" && currentUser && (
        <>
          {currentUser.role === "student" && currentUser.status === "approved" && (
            <StudentDash user={currentUser} content={content} toast={showToast} />
          )}
          {currentUser.role === "student" && currentUser.status !== "approved" && (
            <PendingScreen user={currentUser} onLogout={handleLogout} />
          )}
          {currentUser.role === "admin" && (
            <AdminDash user={currentUser} users={users} setUsers={setUsers} content={content} setContent={setContent} toast={showToast} />
          )}
          {currentUser.role === "registrar" && (
            <RegistrarDash user={currentUser} users={users} setUsers={setUsers} toast={showToast} />
          )}
        </>
      )}

      {toastData && (
        <Toast key={toastData.key} msg={toastData.msg} type={toastData.type} onClose={() => setToastData(null)} />
      )}
      
      <SpeedInsights />
    </>
  );
}
