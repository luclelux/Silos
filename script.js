// script.js – Version Firebase 10 modulaire – ZÉRO WARNING – 20/11/2025
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('carte-container');
    const modal = document.getElementById('siloModal');
    const closeBtn = document.querySelector('.close');

    // Récupération de db et silosRef depuis index.html (version module)
    const db = window.db;
    const silosRef = window.silosRef;

    // Fonctions Firebase importées via le module dans index.html
    const { ref, onValue, set, serverTimestamp } = window;

    // ────── TES 80 SILOS COMPLÈTEMENT DÉFINIS (comme tu les voulais) ──────
    const silosList = [
        { id: "1", left: 50.63, top: 76.32, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "2", left: 50.74, top: 73.16, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "3", left: 50.74, top: 69.89, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "4", left: 50.74, top: 66.61, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "5", left: 50.63, top: 63.69, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "6", left: 50.86, top: 60.54, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "7", left: 50.86, top: 57.50, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "8", left: 50.74, top: 54.23, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "9", left: 50.63, top: 50.72, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "10", left: 54.98, top: 82.86, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "11", left: 54.86, top: 78.89, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "12", left: 54.98, top: 75.03, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "13", left: 54.86, top: 71.64, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "14", left: 55.21, top: 68.60, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "15", left: 55.67, top: 65.45, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "16", left: 55.44, top: 62.29, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "17", left: 55.09, top: 59.14, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "18", left: 54.98, top: 56.10, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "19", left: 55.21, top: 52.82, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "20", left: 55.44, top: 49.67, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "0", left: 51.09, top: 80.17, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "Coin 0", left: 51.43, top: 83.91, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "24", left: 6.55, top: 5.84, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "25", left: 10.22, top: 4.09, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "26A", left: 13.77, top: 3.62, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "26B", left: 17.20, top: 3.39, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "27A", left: 19.95, top: 3.62, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "27B", left: 23.50, top: 3.15, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "28A", left: 26.24, top: 3.62, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "28B", left: 29.56, top: 3.15, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "29A", left: 32.31, top: 3.50, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "29B", left: 35.98, top: 3.39, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "30", left: 40.55, top: 3.39, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "31", left: 46.51, top: 3.27, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "32", left: 52.92, top: 3.62, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "33", left: 58.30, top: 3.04, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "34", left: 66.08, top: 3.62, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "35", left: 69.29, top: 13.09, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "36", left: 70.89, top: 18.70, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "37", left: 71.92, top: 23.61, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "38", left: 73.30, top: 28.05, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "39", left: 74.56, top: 33.07, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "40", left: 76.16, top: 37.75, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "41", left: 77.65, top: 42.66, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "42", left: 79.02, top: 47.68, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "43", left: 80.28, top: 52.47, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "44", left: 81.31, top: 57.27, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "45", left: 82.91, top: 62.06, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "46", left: 84.29, top: 66.73, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "47", left: 85.66, top: 71.17, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "48", left: 86.80, top: 74.80, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "49", left: 87.95, top: 78.30, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "50", left: 88.87, top: 81.93, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "51", left: 86.46, top: 90.92, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "52", left: 79.48, top: 91.16, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "53", left: 72.95, top: 90.22, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "54", left: 71.46, top: 83.44, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "55", left: 72.15, top: 77.83, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "56", left: 72.72, top: 70.82, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "57", left: 72.15, top: 65.21, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "58", left: 69.63, top: 60.89, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "60", left: 65.17, top: 56.80, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "61", left: 65.17, top: 61.01, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "62", left: 66.88, top: 64.98, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "63", left: 67.11, top: 68.84, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "64", left: 66.88, top: 72.58, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "65", left: 66.88, top: 76.32, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "66", left: 67.11, top: 80.17, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "67", left: 67.11, top: 84.03, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "68", left: 67.00, top: 87.65, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "69", left: 66.20, top: 91.16, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "70", left: 61.85, top: 91.27, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "71", left: 58.53, top: 91.51, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "72", left: 54.75, top: 91.51, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "73", left: 51.09, top: 91.27, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "74", left: 47.42, top: 91.39, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "78", left: 29.45, top: 38.45, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "79", left: 29.34, top: 33.77, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "80", left: 29.11, top: 28.16, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "81", left: 34.72, top: 22.09, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "82", left: 34.37, top: 28.28, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "83", left: 34.14, top: 34.01, marchandise: "", quantite: 0, reservee: 0, remarque: "" },
        { id: "84", left: 34.26, top: 38.33, marchandise: "", quantite: 0, reservee: 0, remarque: "" }
    ];

    // Création des boutons sur la carte
    silosList.forEach(silo => {
        const btn = document.createElement('button');
        btn.className = 'silo-btn';
        btn.textContent = silo.id;
        btn.style.left = silo.left + '%';
        btn.style.top = silo.top + '%';
        btn.onclick = () => ouvrirModal(silo.id);
        container.appendChild(btn);
    });

    // Ouvrir le modal et charger les données en temps réel
    function ouvrirModal(siloId) {
        const siloRef = ref(db, "silos/" + siloId);
        onValue(siloRef, (snapshot) => {
            const data = snapshot.val() || { marchandise: "", quantite: 0, reservee: 0, remarque: "" };
            document.getElementById('modal-silo-name').textContent = `Silo ${siloId}`;
            document.getElementById('modal-marchandise').value = data.marchandise || "";
            document.getElementById('modal-quantite').value = data.quantite || 0;
            document.getElementById('modal-reservee').value = data.reservee || 0;
            document.getElementById('modal-remarque').value = data.remarque || "";
            mettreAJourDisponible();
        }, { onlyOnce: false });

        modal.style.display = "flex";
        modal.dataset.currentId = siloId;
    }

    function mettreAJourDisponible() {
        const qtt = parseFloat(document.getElementById('modal-quantite').value) || 0;
        const res = parseFloat(document.getElementById('modal-reservee').value) || 0;
        document.getElementById('modal-disponible').textContent = Math.max(0, qtt - res);
    }

    window.changeReserve = function(val) {
        const input = document.getElementById('modal-reservee');
        let current = parseFloat(input.value) || 0;
        input.value = Math.max(0, current + val);
        mettreAJourDisponible();
    };

    // Sauvegarder les modifications
    document.querySelector('.btn-save').onclick = function() {
        const id = modal.dataset.currentId;
        const data = {
            marchandise: document.getElementById('modal-marchandise').value.trim(),
            quantite: parseFloat(document.getElementById('modal-quantite').value) || 0,
            reservee: parseFloat(document.getElementById('modal-reservee').value) || 0,
            remarque: document.getElementById('modal-remarque').value.trim(),
            updatedAt: serverTimestamp()
        };
        set(ref(db, "silos/" + id), data);
        modal.style.display = "none";
    };

    // Fermeture du modal
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    // Mise à jour en direct du disponible
    document.getElementById('modal-quantite').oninput = mettreAJourDisponible;
    document.getElementById('modal-reservee').oninput = mettreAJourDisponible;
});