// Funcție pentru inițializarea modalului de donații
function initDonationModal() {
  const modal = document.getElementById("donationModal");
  const closeBtn = document.getElementById("closeDonationModal");
  const donateButton = document.getElementById("openDonationModal");

  // Guard clause pentru siguranță: dacă elementele esențiale lipsesc, oprim funcția fără să blocăm site-ul
  if (!modal || !donateButton) {
    console.warn("Elementele pentru modalul de donații nu au fost găsite în pagină.");
    return;
  }

  donateButton.addEventListener("click", () => {
    modal.classList.add("show");
  });

  // Verificăm defensiv dacă există butonul de închidere înainte de a-i asocia evenimentul
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
}

// Funcție pentru Calculatorul de Reciclare
function initCalculator() {
  const calculateBtn = document.getElementById("calculateBtn");
  if (!calculateBtn) return;

  calculateBtn.addEventListener("click", () => {
    const plastic = parseFloat(document.getElementById("plasticInput").value) || 0;
    const paper = parseFloat(document.getElementById("paperInput").value) || 0;
    
    // Calcule ipotetice de CO2 salvat (Exemplu: 1kg plastic = 1.5kg CO2, 1kg hârtie = 1kg CO2)
    const co2Saved = (plastic * 1.5) + (paper * 1.0);
    
    const resultBox = document.getElementById("calcResult");
    if (resultBox) {
      resultBox.innerHTML = `<strong>Felicitări!</strong> Prin acțiunea ta ai salvat aproximativ <strong>${co2Saved.toFixed(2)} kg de CO2</strong> în atmosferă!`;
      resultBox.classList.add("active");
    }
  });
}

// Funcție simulată sau reală pentru încărcarea datelor din Supabase
function initSupabaseLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  console.log("Se inițializează conexiunea cu Supabase...");
  // Aici vine logica ta reală de integrare Supabase (ex: supabase.from('donations').select(...))
  // Pentru demonstrație și siguranță în rulare locală, populăm cu date model după 1 secundă:
  setTimeout(() => {
    leaderboardList.innerHTML = `
      <li>🥇 Andrei M. - 500 RON (12 Copaci Plantați)</li>
      <li>🥈 Elena R. - 350 RON (8 Copaci Plantați)</li>
      <li>🥉 Ionuț T. - 200 RON (5 Copaci Plantați)</li>
    `;
  }, 1000);
}

// Funcția principală care pornește toate modulele după ce DOM-ul este complet încărcat
function init() {
  console.log("Aplicația a fost inițializată cu succes.");
  initDonationModal();
  initCalculator();
  initSupabaseLeaderboard();
}

document.addEventListener("DOMContentLoaded", init);
