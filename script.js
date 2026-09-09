const ASSETS = window.PROOF_ASSETS || {};

document.querySelectorAll("[data-asset]").forEach((img)=>{
  const key = img.dataset.asset;
  if (ASSETS[key]) img.src = ASSETS[key];
});

document.querySelectorAll("[data-avatar]").forEach((img)=>{
  if (window.ROLEX_AVATAR) img.src = window.ROLEX_AVATAR;
});

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (e)=>{
  if (!glow) return;
  glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
},{passive:true});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll(".magnetic").forEach((el)=>{
  el.addEventListener("pointermove",(e)=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.07;
    const y=(e.clientY-r.top-r.height/2)*.07;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

const proofCaptions = {
  joe: "Joe Community Chat — Rolex shown with the Mod Joe role.",
  menace: "Menace Shrek — Rolex shown as an Admin.",
  stakrr: "Stakrr — Rolex shown with the Raider role.",
  robbie: "$ROBBIE Community CTO — Rolex shown as an Admin.",
  lib_praise: "Direct feedback after raid work: ‘Good work! Great job on raids.’",
  joe_feedback: "Trust and raid feedback from the community lead, including ‘No need I trust you’ and ‘Very good.’",
  lib_payment: "Paid work receipt: the client thanked Rolex, promised payment, and the chat shows payment received."
};

const modal = document.getElementById("proof-modal");
const modalImg = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");

document.querySelectorAll("[data-proof]").forEach((button)=>{
  button.addEventListener("click",()=>{
    const key=button.dataset.proof;
    if (!ASSETS[key]) return;
    modalImg.src=ASSETS[key];
    modalCaption.textContent=proofCaptions[key] || "";
    modal.showModal();
  });
});

document.querySelector(".modal-close")?.addEventListener("click",()=>modal.close());
modal?.addEventListener("click",(e)=>{
  if(e.target===modal) modal.close();
});

const modes = {
  community: {
    number:"01 / 03",
    title:"Enter the room before trying to change it.",
    copy:"I learn the project voice, read how members behave, keep chat moving, remove noise and surface useful feedback back to the team.",
    cta:"Talk community ops ↗",
    timeline:[["CONTEXT","Understand the project, tone and rules"],["ROOM","Identify active members and recurring friction"],["OPERATE","Moderate, engage and keep information clean"],["REPORT","Surface what the team actually needs to know"]]
  },
  raid: {
    number:"02 / 03",
    title:"Coordinate attention without making it look automated.",
    copy:"I set the angle, organize the people, keep replies varied and human, and make sure the raid creates momentum instead of a wall of copy-paste noise.",
    cta:"Talk raid coordination ↗",
    timeline:[["TARGET","Understand the post and the objective"],["ANGLE","Give raiders a direction, not a script"],["PUSH","Coordinate replies and keep quality up"],["REVIEW","See what landed and improve the next run"]]
  },
  website: {
    number:"03 / 03",
    title:"Give the project somewhere worth sending traffic.",
    copy:"I turn the project identity into a responsive Web3 site, wire the important links correctly, test the mobile experience and get the deployment live.",
    cta:"Talk website ↗",
    timeline:[["BRIEF","Identity, references, links and goal"],["BUILD","Responsive layout and interactions"],["CHECK","Test links, mobile and project details"],["SHIP","Deploy and hand over the live site"]]
  }
};

const modeNumber=document.querySelector(".mode-number");
const modeTitle=document.getElementById("mode-title");
const modeCopy=document.getElementById("mode-copy");
const modeCta=document.getElementById("mode-cta");
const modeTimeline=document.getElementById("mode-timeline");

document.querySelectorAll(".workflow-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".workflow-tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    const m=modes[tab.dataset.mode];
    modeNumber.textContent=m.number;
    modeTitle.textContent=m.title;
    modeCopy.textContent=m.copy;
    modeCta.textContent=m.cta;
    modeTimeline.innerHTML=m.timeline.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join("");
  });
});