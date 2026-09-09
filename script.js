
const screens = [...document.querySelectorAll(".screen")];
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const roleData = {
  "Alquimista": { className:"role-alchemist", item:"🧪", outfitLabel:"Color de la túnica" },
  "Arquera/o": { className:"role-archer", item:"🏹", outfitLabel:"Color de la ropa de arquero/a" },
  "Herrera/o": { className:"role-smith", item:"⚒️", outfitLabel:"Color del delantal" },
  "Exploradora/or": { className:"role-explorer", item:"🧭", outfitLabel:"Color de la capa" },
  "Granjera/o": { className:"role-farmer", item:"🌾", outfitLabel:"Color de la ropa de campo" },
  "Guardiana/o": { className:"role-guardian", item:"🛡️", outfitLabel:"Color de la armadura" }
};

const state = {
  playerName:"",
  character:"Alquimista",
  appearance:{ skin:1, hair:"short", haircolor:1, outfitcolor:1 },
  reward:"Sello del Consejo de Numeria",
  startedAt:new Date().toISOString(),
  answers:[]
};

const steps = {
  "screen-welcome":[8,"Inicio"],
  "screen-character":[20,"Personaje"],
  "screen-journal":[32,"Diario"],
  "screen-mission-intro":[44,"Misión"],
  "screen-challenge":[62,"Desafíos"],
  "screen-reflection":[84,"Cierre"],
  "screen-map":[100,"Mapa de Numeria"]
};

const challenges = [
  {
    title:"Desafío 1 · El horno de pan",
    icon:"🍞",
    text:"Para alimentar a 4 habitantes durante un día se necesitan 6 hogazas de pan. Si llegan 8 habitantes, ¿cuántas hogazas se necesitarán?",
    label:"Cantidad de hogazas",
    expected:"12"
  },
  {
    title:"Desafío 2 · Nuevos habitantes",
    icon:"🥖",
    text:"Para alimentar a 4 habitantes durante un día se necesitan 6 hogazas de pan. Si llegan 10 habitantes, ¿cuántas hogazas se necesitarán?",
    label:"Cantidad de hogazas",
    expected:"15"
  },
  {
    title:"Desafío 3 · El puesto del mercado",
    icon:"🪙",
    text:"Una capa cuesta 600 monedas y el comerciante anuncia un descuento del 50 %. ¿Cuántas monedas se pagan finalmente?",
    label:"Precio final en monedas",
    expected:"300"
  },
  {
    title:"Desafío 4 · La tela del sastre",
    icon:"🧵",
    text:"Una pieza de tela cuesta 800 monedas. Durante la feria tiene un descuento del 25 %. ¿Cuántas monedas se descuentan?",
    label:"Cantidad descontada",
    expected:"200"
  }
];

let selectedCharacter = "Alquimista";
let appearance = { skin:1, hair:"short", haircolor:1, outfitcolor:1 };
let challengeIndex = 0;

function showScreen(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  const [pct,label] = steps[id] || [0,""];
  progressBar.style.width = pct + "%";
  progressText.textContent = label;
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click",()=>showScreen(btn.dataset.next)));
document.querySelectorAll("[data-prev]").forEach(btn => btn.addEventListener("click",()=>showScreen(btn.dataset.prev)));

const nameInput = document.getElementById("playerName");
const preview = document.getElementById("avatarPreview");
const confirmCharacter = document.getElementById("confirmCharacter");
const roleButtons = [...document.querySelectorAll(".character")];

function avatarClass(extra=""){
  const roleClass = roleData[selectedCharacter].className;
  return `rpg-avatar ${extra} ${roleClass} skin-${appearance.skin} hair-${appearance.hair} haircolor-${appearance.haircolor} outfitcolor-${appearance.outfitcolor}`.trim();
}
function updatePreview(){
  preview.className = avatarClass();
  preview.querySelector(".held-item").textContent = roleData[selectedCharacter].item;
  document.getElementById("previewRole").textContent = selectedCharacter;
  document.getElementById("previewName").textContent = nameInput.value.trim() || "Aventurero/a";
  document.getElementById("outfitLabel").textContent = roleData[selectedCharacter].outfitLabel;
  confirmCharacter.disabled = !nameInput.value.trim();
}
nameInput.addEventListener("input", updatePreview);

document.querySelectorAll("[data-setting]").forEach(group=>{
  group.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      const setting = group.dataset.setting;
      appearance[setting] = ["hair"].includes(setting) ? btn.dataset.value : Number(btn.dataset.value);
      updatePreview();
    });
  });
});

roleButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    roleButtons.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedCharacter = btn.dataset.character;
    updatePreview();
  });
});

confirmCharacter.addEventListener("click",()=>{
  state.playerName = nameInput.value.trim();
  state.character = selectedCharacter;
  state.appearance = {...appearance};
  localStorage.setItem("numeria_player", JSON.stringify({
    playerName:state.playerName,
    character:state.character,
    appearance:state.appearance
  }));
  document.getElementById("journalCharacter").textContent = state.character;
  document.getElementById("journalName").textContent = state.playerName;
  document.getElementById("missionName").textContent = state.playerName;
  saveState();
  showScreen("screen-journal");
});

const journalReady = document.getElementById("journalReady");
const startMission = document.getElementById("startMission");
journalReady.addEventListener("change",()=>startMission.disabled = !journalReady.checked);
startMission.addEventListener("click",()=>showScreen("screen-mission-intro"));

const answerInput = document.getElementById("answerInput");
const workRecorded = document.getElementById("workRecorded");
const submitAnswer = document.getElementById("submitAnswer");
const feedback = document.getElementById("challengeFeedback");

function renderChallenge(){
  const c = challenges[challengeIndex];
  document.getElementById("challengeTitle").textContent = c.title;
  document.getElementById("challengeNumber").textContent = challengeIndex + 1;
  document.getElementById("questIcon").textContent = c.icon;
  document.getElementById("questText").textContent = c.text;
  document.getElementById("answerLabel").textContent = c.label;
  answerInput.value = "";
  workRecorded.checked = false;
  submitAnswer.disabled = true;
  feedback.className = "feedback hidden";
}
function validateAnswer(){
  submitAnswer.disabled = !(answerInput.value.trim() && workRecorded.checked);
}
answerInput.addEventListener("input", validateAnswer);
workRecorded.addEventListener("change", validateAnswer);

submitAnswer.addEventListener("click",()=>{
  const c = challenges[challengeIndex];
  const normalized = answerInput.value.trim().replace(",",".").replace(/[^\d.-]/g,"");
  state.answers.push({
    challenge:challengeIndex+1,
    title:c.title,
    answer:answerInput.value.trim(),
    correct_reference:normalized === c.expected ? "coincide" : "no_coincide",
    timestamp:new Date().toISOString()
  });
  saveState();

  feedback.className = "feedback";
  feedback.innerHTML = "<strong>Respuesta registrada.</strong><br>Conservá tu procedimiento en la carpeta: después lo vamos a comparar con otras estrategias.";
  submitAnswer.disabled = true;

  setTimeout(()=>{
    challengeIndex++;
    if(challengeIndex < challenges.length) renderChallenge();
    else showScreen("screen-reflection");
  },900);
});

const reflectionReady = document.getElementById("reflectionReady");
const finishMission = document.getElementById("finishMission");
reflectionReady.addEventListener("change",()=>finishMission.disabled = !reflectionReady.checked);

function renderAvatarIn(targetId, extraClass, heldItemId){
  const el = document.getElementById(targetId);
  const role = roleData[state.character];
  el.className = `rpg-avatar ${extraClass} ${role.className} skin-${state.appearance.skin} hair-${state.appearance.hair} haircolor-${state.appearance.haircolor} outfitcolor-${state.appearance.outfitcolor}`;
  document.getElementById(heldItemId).textContent = role.item;
}

finishMission.addEventListener("click",()=>{
  state.finishedAt = new Date().toISOString();
  saveState();
  renderAvatarIn("finalAvatar","card-mini","finalHeldItem");
  renderAvatarIn("mapAvatar","map-mini","mapHeldItem");
  document.getElementById("finalName").textContent = state.playerName;
  document.getElementById("finalCharacter").textContent = state.character;
  document.getElementById("mapPlayerName").textContent = state.playerName;
  showScreen("screen-map");
});

function saveState(){
  localStorage.setItem("numeria_clase1", JSON.stringify(state));
}

document.getElementById("downloadData").addEventListener("click",()=>{
  const rows = [[
    "nombre_aventurero","personaje","piel","largo_pelo","color_pelo","color_vestimenta",
    "recompensa","desafio","titulo","respuesta","comparacion_referencia","fecha_hora"
  ]];
  state.answers.forEach(a=>{
    rows.push([
      state.playerName,state.character,state.appearance.skin,state.appearance.hair,
      state.appearance.haircolor,state.appearance.outfitcolor,state.reward,
      a.challenge,a.title,a.answer,a.correct_reference,a.timestamp
    ]);
  });
  const csv = rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `numeria-clase1-${(state.playerName || "estudiante").toLowerCase().replace(/\s+/g,"-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("restartGame").addEventListener("click",()=>{
  if(confirm("¿Querés reiniciar esta clase? Se borrará el progreso de esta misión, pero podés volver a crear el personaje.")){
    localStorage.removeItem("numeria_clase1");
    localStorage.removeItem("numeria_player");
    location.reload();
  }
});

updatePreview();
renderChallenge();
