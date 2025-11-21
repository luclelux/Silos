document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('carte-container');
    const modal = document.getElementById('siloModal');
    const closeBtn = document.querySelector('.close');
    const listeContenu = document.getElementById('liste-contenu');

    // ===== CONFIG FIREBASE =====
    const firebaseConfig = {
        apiKey: "AIzaSyBe4nChIrhbcT2XsXSaVlQxo-qyrnXcJHE",
        authDomain: "silos-monentreprise.firebaseapp.com",
        databaseURL: "https://silos-monentreprise-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "silos-monentreprise",
        storageBucket: "silos-monentreprise.firebasestorage.app",
        messagingSenderId: "760917493520",
        appId: "1:760917493520:web:d970312c551e49345a0795"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const silosRef = db.ref("silos");

    let currentListener = null;

    
function updateSiloButtonColor(siloId, marchandise = "") {
    const btn = document.querySelector(`.silo-btn[data-id="${siloId}"]`);
    if (!btn) return;

    const texte = (marchandise || "").trim().toLowerCase(); // on ignore la casse

    // Liste des mots-clés reconnus (on regarde juste s’il COMMENCE par ça)
    const couleurs = {
        "grès":              "#27ae60",
        "porphyre":          "#e67e22",
        "granit suédois":    "#992c40",
        "basalt":            "#7f8c8d",
        "pierre bleue":      "#2980b9",
        "kandla":            "#f1c40f",
        "sale":              "#2c3e50",  // pour "Sale / à trier"
        "vide":              "#ffffff"
    };

    let couleur = "#d00"; // rouge par défaut

    // On cherche le premier mot-clé qui apparaît au début
    for (const [mot, col] of Object.entries(couleurs)) {
        if (texte.startsWith(mot)) {
            couleur = col;
            break;
        }
    }

    btn.style.backgroundColor = couleur;

    if (texte.startsWith("vide")) {
        btn.style.border = "3px solid #333";
        btn.style.color = "#000";
    } else {
        btn.style.border = "none";
        btn.style.color = "#ffffff";
    }

    btn.textContent = siloId;
}

    // ==================================================================
    // ====================== TES 80 SILOS (intacts) =====================
    // ==================================================================
    const silosList = [
        { id: "1", left: 50.63, top: 76.32 }, { id: "2", left: 50.74, top: 73.16 },
        { id: "3", left: 50.74, top: 69.89 }, { id: "4", left: 50.74, top: 66.61 },
        { id: "5", left: 50.63, top: 63.69 }, { id: "6", left: 50.86, top: 60.54 },
        { id: "7", left: 50.86, top: 57.50 }, { id: "8", left: 50.74, top: 54.23 },
        { id: "9", left: 50.63, top: 50.72 }, { id: "10", left: 54.98, top: 82.86 },
        { id: "11", left: 54.86, top: 78.89 }, { id: "12", left: 54.98, top: 75.03 },
        { id: "13", left: 54.86, top: 71.64 }, { id: "14", left: 55.21, top: 68.60 },
        { id: "15", left: 55.67, top: 65.45 }, { id: "16", left: 55.44, top: 62.29 },
        { id: "17", left: 55.09, top: 59.14 }, { id: "18", left: 54.98, top: 56.10 },
        { id: "19", left: 55.21, top: 52.82 }, { id: "20", left: 55.44, top: 49.67 },
        { id: "0", left: 51.09, top: 80.17 }, { id: "Coin 0", left: 51.43, top: 83.91 },
        { id: "24", left: 6.55, top: 5.84 }, { id: "25", left: 10.22, top: 4.09 },
        { id: "26A", left: 13.77, top: 3.62 }, { id: "26B", left: 17.20, top: 3.39 },
        { id: "27A", left: 19.95, top: 3.62 }, { id: "27B", left: 23.50, top: 3.15 },
        { id: "28A", left: 26.24, top: 3.62 }, { id: "28B", left: 29.56, top: 3.15 },
        { id: "29A", left: 32.31, top: 3.50 }, { id: "29B", left: 35.98, top: 3.39 },
        { id: "30", left: 40.55, top: 3.39 }, { id: "31", left: 46.51, top: 3.27 },
        { id: "32", left: 52.92, top: 3.62 }, { id: "33", left: 58.30, top: 3.04 },
        { id: "34", left: 66.08, top: 3.62 }, { id: "35", left: 69.29, top: 13.09 },
        { id: "36", left: 70.89, top: 18.70 }, { id: "37", left: 71.92, top: 23.61 },
        { id: "38", left: 73.30, top: 28.05 }, { id: "39", left: 74.56, top: 33.07 },
        { id: "40", left: 76.16, top: 37.75 }, { id: "41", left: 77.65, top: 42.66 },
        { id: "42", left: 79.02, top: 47.68 }, { id: "43", left: 80.28, top: 52.47 },
        { id: "44", left: 81.31, top: 57.27 }, { id: "45", left: 82.91, top: 62.06 },
        { id: "46", left: 84.29, top: 66.73 }, { id: "47", left: 85.66, top: 71.17 },
        { id: "48", left: 86.80, top: 74.80 }, { id: "49", left: 87.95, top: 78.30 },
        { id: "50", left: 88.87, top: 81.93 }, { id: "51", left: 86.46, top: 90.92 },
        { id: "52", left: 79.48, top: 91.16 }, { id: "53", left: 72.95, top: 90.22 },
        { id: "54", left: 71.46, top: 83.44 }, { id: "55", left: 72.15, top: 77.83 },
        { id: "56", left: 72.72, top: 70.82 }, { id: "57", left: 72.15, top: 65.21 },
        { id: "58", left: 69.63, top: 60.89 }, { id: "60", left: 65.17, top: 56.80 },
        { id: "61", left: 65.17, top: 61.01 }, { id: "62", left: 66.88, top: 64.98 },
        { id: "63", left: 67.11, top: 68.84 }, { id: "64", left: 66.88, top: 72.58 },
        { id: "65", left: 66.88, top: 76.32 }, { id: "66", left: 67.11, top: 80.17 },
        { id: "67", left: 67.11, top: 84.03 }, { id: "68", left: 67.00, top: 87.65 },
        { id: "69", left: 66.20, top: 91.16 }, { id: "70", left: 61.85, top: 91.27 },
        { id: "71", left: 58.53, top: 91.51 }, { id: "72", left: 54.75, top: 91.51 },
        { id: "73", left: 51.09, top: 91.27 }, { id: "74", left: 47.42, top: 91.39 },
        { id: "78", left: 29.45, top: 38.45 }, { id: "79", left: 29.34, top: 33.77 },
        { id: "80", left: 29.11, top: 28.16 }, { id: "81", left: 34.72, top: 22.09 },
        { id: "82", left: 34.37, top: 28.28 }, { id: "83", left: 34.14, top: 34.01 },
        { id: "84", left: 34.26, top: 38.33 }
    ];

    // ===== CRÉATION DES BOUTONS + COULEUR TOUJOURS À JOUR =====
    silosList.forEach(silo => {
        const btn = document.createElement('button');
        btn.className = 'silo-btn';
        btn.dataset.id = silo.id;
        btn.textContent = silo.id;                    // ← juste le numéro
        btn.style.left = silo.left + '%';
        btn.style.top = silo.top + '%';
        btn.onclick = () => ouvrirModal(silo.id);
        container.appendChild(btn);

        // Écoute complète du silo → couleur toujours bonne
        silosRef.child(silo.id).on("value", snap => {
            const data = snap.val() || {};
            updateSiloButtonColor(silo.id, data.marchandise || "");
        });
    });

    // ==================================================================
    // ====================== LISTE DYNAMIQUE À GAUCHE ==================
    // ==================================================================
    function mettreAJourListeSilos() {
    listeContenu.innerHTML = "";
    silosList.forEach(silo => {
        const ligne = document.createElement('div');
        ligne.className = 'silo-ligne';
        ligne.innerHTML = `<strong>Silo ${silo.id}</strong><span class="info">Chargement...</span>`;
        listeContenu.appendChild(ligne);

        silosRef.child(silo.id).on('value', snap => {
            const data = snap.val() || {};
            const m = (data.marchandise || "").trim();
            const q = data.quantite || 0;

            // Plus de classe de couleur → tout en noir/gris
            const texte = m && !m.toLowerCase().startsWith("vide") 
                ? `${m} – <strong>${q} To</strong>` 
                : "Vide";

            ligne.innerHTML = `<strong>Silo ${silo.id}</strong><span class="info">${texte}</span>`;
        });
    });
}
mettreAJourListeSilos();

    // ==================================================================
    // ====================== MODAL & SAUVEGARDE ========================
    // ==================================================================
    function ouvrirModal(siloId) {
        if (currentListener) currentListener();
        document.getElementById('modal-silo-name').textContent = `Silo ${siloId}`;
        modal.style.display = "flex";
        modal.dataset.currentId = siloId;

        const siloRef = silosRef.child(siloId);
        const update = snap => {
            const d = snap.val() || {};
            document.getElementById('modal-marchandise').value = d.marchandise || "";
            document.getElementById('modal-quantite').value = d.quantite || 0;
            document.getElementById('modal-reservee').value = d.reservee || 0;
            document.getElementById('modal-remarque').value = d.remarque || "";
            updateSiloButtonColor(siloId, d.marchandise || "");
            mettreAJourDisponible();
        };
        siloRef.on('value', update);
        currentListener = () => siloRef.off('value', update);
        siloRef.once('value').then(update);
    }

    document.querySelector('.btn-save').onclick = () => {
        const id = modal.dataset.currentId;
        const data = {
            marchandise: document.getElementById('modal-marchandise').value.trim(),
            quantite: parseFloat(document.getElementById('modal-quantite').value) || 0,
            reservee: parseFloat(document.getElementById('modal-reservee').value) || 0,
            remarque: document.getElementById('modal-remarque').value.trim(),
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
        silosRef.child(id).set(data);
        modal.style.display = "none";
    };

    function mettreAJourDisponible() {
        const q = parseFloat(document.getElementById('modal-quantite').value) || 0;
        const r = parseFloat(document.getElementById('modal-reservee').value) || 0;
        document.getElementById('modal-disponible').textContent = Math.max(0, q - r);
    }

    window.changeReserve = val => {
        const input = document.getElementById('modal-reservee');
        input.value = Math.max(0, (parseFloat(input.value) || 0) + val);
        mettreAJourDisponible();
    };

    closeBtn.onclick = window.onclick = e => {
        if (e.target === modal || e.target === closeBtn) {
            if (currentListener) currentListener();
            modal.style.display = "none";
        }
    };

    document.getElementById('modal-quantite').oninput =
    document.getElementById('modal-reservee').oninput = mettreAJourDisponible;
// TEMPORAIRE – juste pour déplacer le logo une dernière fois
const logo = document.getElementById('logo-droite');
let isLocked = false;

function startDrag(e) {
    if (isLocked) return;
    e.preventDefault();
    let startX = e.clientX || e.touches[0].clientX;
    let startY = e.clientY || e.touches[0].clientY;
    let origX = logo.offsetLeft;
    let origY = logo.offsetTop;

    function move(e) {
        let x = (e.clientX || e.touches[0].clientX) - startX;
        let y = (e.clientY || e.touches[0].clientY) - startY;
        logo.style.left = (origX + x) + 'px';
        logo.style.top = (origY + y) + 'px';
        logo.style.right = 'auto';
    }

    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('touchmove', move);
        document.removeEventListener('mouseup', stop);
        document.removeEventListener('touchend', stop);
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchend', stop);
}

logo.addEventListener('mousedown', startDrag);
logo.addEventListener('touchstart', startDrag);
});