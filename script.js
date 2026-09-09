const ASSETS = window.PROOF_ASSETS || {};
document.querySelectorAll("[data-asset]").forEach((img)=>{
  const key = img.dataset.asset;
  if (ASSETS[key]) img.src = ASSETS[key];
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
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelectorAll(".magnetic").forEach((el)=>{
  el.addEventListener("pointermove",(e)=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.08;
    const y=(e.clientY-r.top-r.height/2)*.08;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

const proofCaptions = {
  joe: "Joe Community Chat — Rolex shown with the Mod Joe role.",
  menace: "Menace Shrek — Rolex shown as Admin.",
  stakrr: "Stakrr — Rolex shown with the Raider role.",
  robbie: "$ROBBIE Community CTO — Rolex shown as Admin.",
  lib_praise: "Direct feedback after raid work: ‘Good work! Great job on raids.’",
  joe_feedback: "Trust and raid feedback from the community lead, including ‘No need I trust you’ and ‘Very good.’",
  lib_payment: "Paid work proof: thanks from the client, payment promise, and confirmation that payment was received."
};
const modal = document.getElementById("proof-modal");
const modalImg = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
document.querySelectorAll("[data-proof]").forEach((button)=>{
  button.addEventListener("click",()=>{
    const key=button.dataset.proof;
    modalImg.src=ASSETS[key];
    modalCaption.textContent=proofCaptions[key] || "";
    modal.showModal();
  });
});
document.querySelector(".modal-close").addEventListener("click",()=>modal.close());
modal.addEventListener("click",(e)=>{
  if(e.target===modal) modal.close();
});

const modes = {
  community: {
    number:"01 / 03",
    title:"Plug me into the community.",
    copy:"I learn the project voice, read how members behave, keep chat moving, remove noise and surface useful feedback to the team.",
    cta:"Talk community ops ↗",
    timeline:[["00:00","Get context + access"],["00:30","Understand tone, rules, active members"],["Day 1","Moderate, engage, report gaps"],["Ongoing","Keep the room alive without forcing it"]]
  },
  raid: {
    number:"02 / 03",
    title:"Give me the target. I’ll coordinate the push.",
    copy:"I organize the people, keep replies varied and human, track what has been covered and keep the raid from turning into low-quality spam.",
    cta:"Plan a raid ↗",
    timeline:[["Brief","Target post + desired angle"],["Prep","Align raiders and response direction"],["Go live","Coordinate replies and momentum"],["Wrap","Report back, then improve the next one"]]
  },
  website: {
    number:"03 / 03",
    title:"No website? I can ship the front door.",
    copy:"I turn the project identity into a responsive Web3 landing experience, connect the important links and get it live so the community has somewhere credible to send people.",
    cta:"Talk website ↗",
    timeline:[["Brief","Project identity, links, references"],["Build","Responsive page + interactions"],["Review","Founder feedback + fixes"],["Ship","Deploy and hand over the live link"]]
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