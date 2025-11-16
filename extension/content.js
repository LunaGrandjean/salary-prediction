/////////////////////////////////////////////////////////
// UTILS
/////////////////////////////////////////////////////////

function safeQuery(selector) {
  const el = document.querySelector(selector);
  return el ? el.innerText.trim() : null;
}

function log(...msg) {
  console.log("[WTTJ Salary Predictor] ", ...msg);
}

log("content.js LOADED !");

/////////////////////////////////////////////////////////
// DETECTION PAGE OFFRE WTTJ
/////////////////////////////////////////////////////////

function isJobPage() {
  return window.location.href.includes("/jobs/");
}

/////////////////////////////////////////////////////////
// EXTRACTION DES INFOS WTTJ
/////////////////////////////////////////////////////////

function getJobTitle() {
  let title = safeQuery('[data-testid="job-metadata-block"] h2');
  if (!title) title = safeQuery("h1");
  return title || "";
}

function getJobDescription() {
  const block = document.querySelector('[data-testid="job-section"] p');
  if (block) return block.innerText.trim();

  const paragraphs = [...document.querySelectorAll("p")];
  const text = paragraphs
    .map(p => p.innerText.trim())
    .filter(t => t.length > 40)
    .join(" ");

  return text || "";
}

function getLocation() {
  const loc = document.querySelector('i[name="location"] + span');
  return loc ? loc.innerText.trim() : "";
}

function getCompany() {
  let company = safeQuery('[data-testid="company-name"] span');
  if (!company) company = safeQuery('[data-testid="company-name"]');
  return company || "";
}

/////////////////////////////////////////////////////////
// HELPERS / FEATURES SUPPLÉMENTAIRES
/////////////////////////////////////////////////////////

function detectSkill(word) {
  return document.body.innerText.toLowerCase().includes(word) ? 1 : 0;
}

function simplifyTitle(t) {
  if (!t) return "na";
  t = t.toLowerCase();
  if (t.includes("data scientist")) return "data scientist";
  if (t.includes("data analyst")) return "data analyst";
  if (t.includes("engineer")) return "data engineer";
  return "na";
}

function seniorityFromTitle(t) {
  if (!t) return "na";
  t = t.toLowerCase();
  if (t.includes("senior") || t.includes("lead")) return "senior";
  if (t.includes("junior")) return "junior";
  return "na";
}

/////////////////////////////////////////////////////////
// CONSTRUCTION DES FEATURES EXACTES DU MODELE CATBOOST
/////////////////////////////////////////////////////////

function extractJobData() {
  const title = getJobTitle();
  const desc = getJobDescription();
  const location = getLocation();
  const company = getCompany();

  const data = {
    // TEXT FEATURES
    job_description: desc,
    company_txt: company,

    // CATEGORICAL FEATURES
    location: location,
    type_of_ownership: "",
    sector: "",
    job_simp: simplifyTitle(title),
    seniority: seniorityFromTitle(title),

    // NUMERIC FEATURES
    rating: 0,
    founded: 0,
    age: 0,
    desc_len: desc.length,
    size_min_employees: 0,
    size_max_employees: 0,
    revenue_min: 0,
    revenue_max: 0,

    // SKILLS
    python_yn: detectSkill("python"),
    r_yn: detectSkill(" r "),
    spark: detectSkill("spark"),
    aws: detectSkill("aws"),
    excel: detectSkill("excel")
  };

  log("Extracted job data:", data);
  return data;
}

/////////////////////////////////////////////////////////
// API BACKEND
/////////////////////////////////////////////////////////

async function predictSalary(jobData) {
  try {
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData)
    });

    const data = await res.json();
    return data.pred_salary;
  } catch (err) {
    log("Erreur API backend :", err);
    return null;
  }
}

/////////////////////////////////////////////////////////
// UI
/////////////////////////////////////////////////////////

function showSalaryBox(salary) {
  const header = document.querySelector('[data-testid="job-metadata-block"]');
  if (!header) return;

  if (document.querySelector("#salary-box")) return;

  const box = document.createElement("div");
  box.id = "salary-box";
  box.style.padding = "12px";
  box.style.marginTop = "12px";
  box.style.background = "#f0f9ff";
  box.style.border = "1px solid #0ea5e9";
  box.style.borderRadius = "6px";
  box.style.fontSize = "16px";
  box.style.fontWeight = "bold";

  box.innerHTML = `💰 Salaire estimé : <span style="color:#0a4a7a">${salary.toFixed(
    1
  )} k€</span>`;

  header.appendChild(box);
}

function addPredictButton() {
  const header = document.querySelector('[data-testid="job-metadata-block"]');
  if (!header) return;

  if (document.querySelector("#predict-btn")) return;

  const button = document.createElement("button");
  button.id = "predict-btn";
  button.innerText = "🔮 Prédire le salaire";
  button.style.padding = "10px 14px";
  button.style.marginTop = "14px";
  button.style.background = "#0ea5e9";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";

  button.onclick = async () => {
    const data = extractJobData();
    const salary = await predictSalary(data);

    if (salary !== null && !isNaN(salary)) showSalaryBox(salary);
    else alert("Impossible de prédire le salaire 😥");
  };

  header.appendChild(button);
}

/////////////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////////////

function main() {
  if (!isJobPage()) return;
  log("Page détectée : Offre WTTJ");
  addPredictButton();
}

setTimeout(main, 1500);
