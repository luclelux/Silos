document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('carte-container');
    const modal = document.getElementById('siloModal');
    const closeBtn = document.querySelector('.close');
    const listeContenu = document.getElementById('liste-contenu');

    // === HET MOOIE STATUSRECHTHOEKJE (zoals op kaart 171) ===
    const statusEl = document.getElementById('sync-status');

    // ===== FIREBASE =====
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
    const silosRef = firebase.database().ref("silos");

    try { firebase.database().enablePersistence(); } catch(e) {}

    let currentListener = null;

    // === ONLINE / OFFLINE + SYNCHRONISATIE ===
    const connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", snap => {
        if (snap.val() === true) {
            statusEl.textContent = "Alles up-to-date";
            statusEl.style.backgroundColor = "#27ae60";
        } else {
            statusEl.textContent = "Offline";
            statusEl.style.backgroundColor = "#e74c3c";
        }
    });

    function showSyncing() {
        statusEl.textContent = "Synchronisatie bezig";
        statusEl.style.backgroundColor = "#f39c12";
    }

    // ===== JOUW SILOS NORMAUX + SPECIAUX =====
    const silosNormaux = [
        { id: "1", left: 3.15,  top: 47.92 }, { id: "2", left: 9.25,  top: 47.92 },
        { id: "3", left: 14.81, top: 47.92 }, { id: "4", left: 20.48, top: 47.92 },
        { id: "5", left: 37.06, top: 47.92 }, { id: "6", left: 42.62, top: 47.92 },
        { id: "7", left: 47.54, top: 47.92 }, { id: "8", left: 52.46, top: 47.92 },
        { id: "9", left: 56.95, top: 47.92 }, { id: "10", left: 61.77, top: 47.92 },
        { id: "11", left: 67.11, top: 47.92 }, { id: "12", left: 71.93, top: 47.92 },
        { id: "13", left: 75.99, top: 47.92 }, { id: "14", left: 81.23, top: 47.92 },
        { id: "15", left: 95.46, top: 4.71 }, { id: "16", left: 95.46, top: 12.62 },
        { id: "17", left: 95.46, top: 20.32 }, { id: "18", left: 95.46, top: 28.88 },
        { id: "19", left: 95.46, top: 40.75 }, { id: "20", left: 95.46, top: 51.77 },
        { id: "21", left: 95.46, top: 66.32 }, { id: "Bor scié", left: 37.06, top: 54.98 },
        { id: "Bor Brut", left: 56.95, top: 54.98 }
    ];

    const boutonsSpeciaux = [
        { id: "Trémi", left: 81.34, top: 87.39, nom: "Trémi" },
        { id: "Trémi droite", left: 71.71, top: 94.98, nom: "Trémi droite" },
        { id: "Citerne", left: 45.29, top: 26.74, nom: "Citerne" },
        { id: "Citerne droite", left: 70.96, top: 26.74, nom: "Citerne droite" },
        { id: "Citerne gauche", left: 34.81, top: 20.75, nom: "Citerne gauche" },
        { id: "161", left: 16.73, top: 13.80, nom: "161" },
        { id: "Batiment", left: 75.14, top: 8.02, nom: "Batiment" }
    ];

    // ===== KNOPPEN MAKEN + LIVE KLEUR =====
    silosNormaux.forEach(silo => {
        const btn = document.createElement('button');
        btn.className = 'silo-btn';
        btn.dataset.id = silo.id;
        btn.dataset.type = 'normal';
        btn.textContent = silo.id;
        btn.style.left = silo.left + '%';
        btn.style.top = silo.top + '%';
        btn.onclick = () => ouvrirModal(silo.id, 'normal');
        container.appendChild(btn);

        silosRef.child(silo.id).on("value", snap => {
            const data = snap.val() || {};
            updateSiloButtonColor(silo.id, data.marchandise || "");
        });
    });

    boutonsSpeciaux.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'silo-btn special-btn';
        btn.dataset.id = b.id;
        btn.dataset.type = 'special';
        btn.textContent = b.nom;
        btn.style.left = b.left + '%';
        btn.style.top = b.top + '%';
        btn.onclick = () => ouvrirModal(b.id, 'special', b.nom);
        container.appendChild(btn);

        silosRef.child(b.id).on("value", snap => {
            btn.style.backgroundColor = snap.val()?.remarque ? "#27ae60" : "#95a5a6";
        });
    });

    function updateSiloButtonColor(id, marchandise = "") {
        const btn = document.querySelector(`.silo-btn[data-id="${id}"]`);
        if (!btn || btn.dataset.type === 'special') return;
        const t = (marchandise||"").trim().toLowerCase();
        const cols = {grès:"#27ae60",porphyre:"#e67e22","granit suédois":"#992c40",basalt:"#7f8c8d","pierre bleue":"#2980b9",kandla:"#f1c40f",sale:"#2c3e50",vide:"#fff"};
        let col = "#d00";
        for (let k in cols) if (t.startsWith(k)) { col = cols[k]; break; }
        btn.style.backgroundColor = t.startsWith("vide") ? "#fff" : col;
        btn.style.border = t.startsWith("vide") ? "3px solid #333" : "none";
        btn.style.color = t.startsWith("vide") ? "#000" : "#fff";
    }

    // ===== LEGENDE UPDATEN =====
    function refreshListe() {
        listeContenu.innerHTML = "";
        silosNormaux.forEach(silo => {
            const div = document.createElement('div');
            div.className = 'silo-ligne';
            div.innerHTML = `<strong>${silo.id}</strong><span class="info">...</span>`;
            listeContenu.appendChild(div);
            silosRef.child(silo.id).on('value', s => {
                const d = s.val()||{};
                const m = (d.marchandise||"").trim();
                const q = d.quantite||0;
                const u = (silo.id==="Bor scié"||silo.id==="Bor Brut")?"M1":"To";
                div.querySelector('.info').innerHTML = m && !m.toLowerCase().startsWith("vide") ? `${m} – <strong>${q} ${u}</strong>` : "Vide";
            });
        });
        boutonsSpeciaux.forEach(b => {
            const div = document.createElement('div');
            div.className = 'silo-ligne special-ligne';
            div.innerHTML = `<strong>${b.nom}</strong><span class="info">Aucune remarque</span>`;
            listeContenu.appendChild(div);
            silosRef.child(b.id).on('value', s => {
                const r = (s.val()?.remarque||"").trim();
                div.querySelector('.info').textContent = r || "Aucune remarque";
            });
        });
    }
    refreshListe();

    // ===== MODAL OPENEN =====
    function ouvrirModal(id, type = 'normal', nom = null) {
        if (currentListener) currentListener();

        document.getElementById('modal-silo-name').textContent = nom || id;
        modal.dataset.currentId = id;
        modal.dataset.currentType = type;

        document.querySelectorAll('.adjust-block, .dispo-box').forEach(el => el.style.display = 'none');
        document.getElementById('remarque-normale').style.display = 'none';
        document.getElementById('remarque-speciale').style.display = 'none';

        const ref = silosRef.child(id);
        const update = snap => {
            const d = snap.val() || {};
            const estBor = (id === "Bor scié" || id === "Bor Brut");
            const unite = estBor ? "M1" : "ton";

            if (type === 'normal') {
                document.getElementById('modal-marchandise').value = d.marchandise || "";
                document.getElementById('modal-quantite-current').textContent = (d.quantite || 0).toFixed(1);
                document.getElementById('modal-reservee-current').textContent = (d.reservee || 0).toFixed(1);
                document.getElementById('modal-remarque').value = d.remarque || "";
                updateSiloButtonColor(id, d.marchandise || "");
                mettreAJourDisponible();

                document.querySelectorAll('.adjust-block, .dispo-box').forEach(el => el.style.display = 'block');
                document.getElementById('remarque-normale').style.display = 'block';
            } else {
                document.getElementById('modal-remarque-speciale').value = d.remarque || "";
                document.getElementById('remarque-speciale').style.display = 'block';
                document.getElementById('remarque-speciale-label').textContent = nom || "Remarque :";
            }
        };

        ref.on('value', update);
        currentListener = () => ref.off('value', update);
        ref.once('value').then(update);

        modal.style.display = "flex";
    }

    function mettreAJourDisponible() {
        const qText = document.getElementById('modal-quantite-current').textContent;
        const rText = document.getElementById('modal-reservee-current').textContent;
        const q = parseFloat(qText) || 0;
        const r = parseFloat(rText) || 0;
        const disponible = Math.max(0, q - r).toFixed(1);
        const unite = (modal.dataset.currentId === "Bor scié" || modal.dataset.currentId === "Bor Brut") ? "M1" : "tonnes";
        document.getElementById('modal-disponible').textContent = disponible + " " + unite;
    }

    document.querySelectorAll('.btn-ajouter, .btn-retirer').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const action = btn.dataset.action;
            const input = document.getElementById('adjust-' + type);
            const currentEl = document.getElementById('modal-' + type + '-current');

            let amount = parseFloat(input.value) || 0;
            if (amount === 0) return;

            let current = parseFloat(currentEl.textContent) || 0;
            current = action === 'add' ? current + amount : current - amount;
            current = Math.max(0, current);

            currentEl.textContent = current.toFixed(1);

            input.value = '';
            mettreAJourDisponible();
        });
    });

    // ==================== DE FIX – OPSLAAN ====================
    document.querySelector('.btn-save').onclick = () => {
        const id   = modal.dataset.currentId;
        const type = modal.dataset.currentType || 'normal';

        const data = {
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
            // Dit zorgt dat Firebase ALTIJD een wijziging ziet (ook offline)
            _forceSync: Date.now()
        };

        if (type === 'normal') {
            const qText = document.getElementById('modal-quantite-current').textContent;
            const rText = document.getElementById('modal-reservee-current').textContent;

            data.marchandise = document.getElementById('modal-marchandise').value.trim();
            data.quantite    = parseFloat(qText) || 0;
            data.reservee    = parseFloat(rText) || 0;
            data.remarque    = document.getElementById('modal-remarque').value.trim();
        } else {
            data.remarque = document.getElementById('modal-remarque-speciale').value.trim();
        }

        showSyncing(); // geel tijdens opslaan

        silosRef.child(id).set(data, error => {
            if (!error) {
                statusEl.textContent = "Alles up-to-date";
                statusEl.style.backgroundColor = "#27ae60";
            }
        });

        modal.style.display = "none";
    };

    closeBtn.onclick = () => { if (currentListener) currentListener(); modal.style.display = "none"; };
    window.onclick = e => { if (e.target === modal) { if (currentListener) currentListener(); modal.style.display = "none"; } };

    const toggleBtn = document.getElementById('toggle-liste');
    const liste = document.getElementById('liste-silos');
    if (toggleBtn && liste) {
        toggleBtn.addEventListener('click', () => {
            liste.classList.toggle('open');
            toggleBtn.innerHTML = liste.classList.contains('open') ? '↑' : '↓';
        });
        if (window.innerWidth <= 900) {
            liste.classList.add('open');
            toggleBtn.innerHTML = '↑';
        }
    }
// ULTIEME ZOEKBALK – zoekt in marchandise + remarque + begint-met-VD-logica
const searchInput = document.getElementById('search-input');
const searchCount = document.getElementById('search-count');

if (searchInput && searchCount) {
    const allButtons = document.querySelectorAll('.silo-btn');
    searchCount.textContent = allButtons.length + " silos";

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (!query) {
            allButtons.forEach(b => {
                b.style.opacity = "";
                b.style.pointerEvents = "";
                b.style.transform = "";
            });
            searchCount.textContent = allButtons.length + " silos";
            return;
        }

        const lowerQuery = query.toLowerCase();
        const terms = lowerQuery.split(/\s+/).filter(t => t);

        // Speciale regel voor VD-bestellingen
        const isVdSearch = lowerQuery.startsWith("vd") && lowerQuery.length >= 2;

        let visible = 0;

        allButtons.forEach(btn => {
            const id = btn.dataset.id;

            firebase.database().ref(`silos/${id}`).once('value').then(snap => {
                const data = snap.val() || {};
                const marchandise = (data.marchandise || "").toLowerCase();
                const remarque    = (data.remarque    || "").toLowerCase();

                let match = false;

                if (isVdSearch) {
                    // Speciaal: alleen tonen als remarque BEGINT met "vd" (hoofdletterongevoelig)
                    match = remarque.startsWith("vd");
                } else {
                    // Normaal zoeken: alle zoektermen moeten in marchandise OF remarque voorkomen
                    match = terms.every(term =>
                        marchandise.includes(term) || remarque.includes(term)
                    );
                }

                if (match) {
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                    btn.style.transform = "scale(1.08)";
                    visible++;
                } else {
                    btn.style.opacity = "0.15";
                    btn.style.pointerEvents = "none";
                    btn.style.transform = "";
                }

                // Update teller
                setTimeout(() => {
                    const nowVisible = document.querySelectorAll('.silo-btn[style*="opacity: 1"], .silo-btn:not([style*="opacity"])').length;
                    searchCount.textContent = nowVisible + (nowVisible === 1 ? " silo" : " silos");
                }, 400);
            });
        });
    };

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('search', performSearch);
}
});