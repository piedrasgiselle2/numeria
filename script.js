const screens = [...document.querySelectorAll(".screen")];
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const state = {
  playerName: "",
  character: "Alquimista",
  appearance: { skin: 1, hair: 1, outfit: 1, accessory: 0 },
  avatar: "🧪",
  startedAt: new Date().toISOString(),
  answers: []
};

const roleTools = {
  "Alquimista":"🧪",
  "Arquera/o":"🏹",
  "Herrera/o":"⚒️",
  "Exploradora/or":"🧭",
  "Granjera/o":"🌾",
  "Guardiana/o":"🛡️"
};

const steps = {
  "screen-welcome": [8,"Inicio"],
  "screen-character": [20,"Personaje"],
  "screen-journal": [32,"Diario"],
  "screen-mission-intro": [44,"Misión"],
  "screen-challenge": [62,"Desafíos"],
  "screen-reflection": [84,"Cierre"],
  "screen-map": [100,"Capítulo completo"]
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
let appearance = { skin: 1, hair: 1, outfit: 1, accessory: 0 };
let challengeIndex = 0;

function showScreen(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  const step = steps[id] || [0,""];
  progressBar.style.width = step[0] + "%";
  progressText.textContent = step[1];
  window.scrollTo({top:0,behavior:"smooth"});
  localStorage.setItem("numeria_current_screen", id);
}

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click",()=>showScreen(btn.dataset.next));
});
document.querySelectorAll("[data-prev]").forEach(btn=>{
  btn.addEventListener("click",()=>showScreen(btn.dataset.prev));
});

const nameInput = document.getElementById("playerName");
const characterButtons = [...document.querySelectorAll(".character")];
const confirmCharacter = document.getElementById("confirmCharacter");
const avatarPreview = document.getElementById("avatarPreview");

function updatePreview(){
  avatarPreview.className = `avatar-builder skin-${appearance.skin} hair-${appearance.hair} outfit-${appearance.outfit} accessory-${appearance.accessory}`;
  document.getElementById("avatarTool").textContent = roleTools[selectedCharacter];
  document.getElementById("previewRole").textContent = selectedCharacter;
  document.getElementById("previewName").textContent = nameInput.value.trim() || "Aventurero/a";
}

function validateCharacter(){
  confirmCharacter.disabled = !nameInput.value.trim();
}
nameInput.addEventListener("input", ()=>{
  validateCharacter();
  updatePreview();
});

document.querySelectorAll("[data-setting]").forEach(group=>{
  group.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      group.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      const setting = group.dataset.setting;
      appearance[setting] = Number(btn.dataset.value);
      updatePreview();
    });
  });
});

characterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    characterButtons.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedCharacter = btn.dataset.character;
    updatePreview();
  });
});

confirmCharacter.addEventListener("click",()=>{
  state.playerName = nameInput.value.trim();
  state.character = selectedCharacter;
  state.appearance = {...appearance};
  state.avatar = roleTools[selectedCharacter];
  document.getElementById("journalCharacter").textContent = state.character;
  document.getElementById("journalName").textContent = state.playerName;
  document.getElementById("missionName").textContent = state.playerName;
  saveState();
  showScreen("screen-journal");
});

updatePreview();

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
  feedback.textContent = "";
  answerInput.focus();
}
function validateAnswer(){
  submitAnswer.disabled = !(answerInput.value.trim() && workRecorded.checked);
}
answerInput.addEventListener("input",validateAnswer);
workRecorded.addEventListener("change",validateAnswer);

submitAnswer.addEventListener("click",()=>{
  const c = challenges[challengeIndex];
  const raw = answerInput.value.trim().replace(",",".");
  const normalized = raw.replace(/[^\d.-]/g,"");
  const correct = normalized === c.expected;

  state.answers.push({
    challenge: challengeIndex + 1,
    title: c.title,
    answer: answerInput.value.trim(),
    correct_reference: correct ? "coincide" : "no_coincide",
    timestamp: new Date().toISOString()
  });
  saveState();

  feedback.className = "feedback neutral";
  feedback.innerHTML = `
    <strong>Respuesta registrada.</strong><br>
    En esta primera misión no vamos a mostrar la resolución automática. Conservá tu procedimiento en la carpeta:
    después lo vamos a comparar con otras estrategias.
  `;
  submitAnswer.disabled = true;

  setTimeout(()=>{
    challengeIndex++;
    if(challengeIndex < challenges.length){
      renderChallenge();
    }else{
      showScreen("screen-reflection");
    }
  }, 1300);
});

const reflectionReady = document.getElementById("reflectionReady");
const finishMission = document.getElementById("finishMission");
reflectionReady.addEventListener("change",()=>finishMission.disabled = !reflectionReady.checked);
finishMission.addEventListener("click",()=>{
  const finalAvatar = document.getElementById("finalAvatar");
  finalAvatar.className = `avatar-builder mini skin-${state.appearance.skin} hair-${state.appearance.hair} outfit-${state.appearance.outfit} accessory-${state.appearance.accessory}`;
  document.getElementById("finalAvatarTool").textContent = roleTools[state.character];
  document.getElementById("finalName").textContent = state.playerName;
  document.getElementById("finalCharacter").textContent = state.character;
  state.finishedAt = new Date().toISOString();
  saveState();
  showScreen("screen-map");
});

function saveState(){
  localStorage.setItem("numeria_clase1", JSON.stringify(state));
}

document.getElementById("downloadData").addEventListener("click",()=>{
  const rows = [
    ["nombre_aventurero","personaje","piel","cabello","vestimenta","accesorio","desafio","titulo","respuesta","comparacion_referencia","fecha_hora"]
  ];
  state.answers.forEach(a=>{
    rows.push([
      state.playerName,
      state.character,
      state.appearance.skin,
      state.appearance.hair,
      state.appearance.outfit,
      state.appearance.accessory,
      a.challenge,
      a.title,
      a.answer,
      a.correct_reference,
      a.timestamp
    ]);
  });
  const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `numeria-clase1-${(state.playerName || "estudiante").toLowerCase().replace(/\s+/g,"-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("restartGame").addEventListener("click",()=>{
  if(confirm("¿Querés reiniciar esta clase? Se borrará el progreso guardado en este dispositivo.")){
    localStorage.removeItem("numeria_clase1");
    localStorage.removeItem("numeria_current_screen");
    location.reload();
  }
});

renderChallenge();
