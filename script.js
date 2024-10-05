const notesContainer = document.getElementById("notsContainer");
const btnAjouter = document.querySelector(".btn1");
const colorsContainer = document.querySelector(".couleurs");
const colors = document.querySelectorAll(".couleur");
const btnStocker = document.querySelector(".btn2");
const btnEnregistrer = document.querySelector(".btn2"); // Assurez-vous que c'est le bon bouton

// Charger les notes depuis le stockage local au démarrage
document.addEventListener("DOMContentLoaded", loadNotes);

// Ajouter une nouvelle note
btnAjouter.addEventListener("click", () => {
    createNoteElement(""); // Créer une nouvelle note vide
});

// Fonction pour créer une nouvelle note
function createNoteElement(noteText) {
    let newNoteContainer = document.createElement("div");
    newNoteContainer.className = "container2";
    newNoteContainer.setAttribute("draggable", "true"); // Rendre la note déplaçable

    let inputBox = document.createElement("p");
    let img = document.createElement("img");
    inputBox.className = "texte";
    inputBox.setAttribute("contenteditable", "true");
    inputBox.innerText = noteText; // Remplir avec le texte de la note (vide ou chargé)
    img.src = "delete.webp";

    newNoteContainer.appendChild(img);
    newNoteContainer.appendChild(inputBox);
    newNoteContainer.style.display = "block";
    notesContainer.appendChild(newNoteContainer);

    
    toggleColorsContainer();

    // Événements pour supprimer la note
    img.addEventListener("click", () => {
        newNoteContainer.remove();
        saveNotes(); // Enregistrer les notes après suppression
        toggleColorsContainer(); // Vérifier de nouveau après suppression
    });

    // Événements pour le glisser-déposer
    newNoteContainer.addEventListener("dragstart", () => {
        newNoteContainer.classList.add("dragging"); // Ajouter la classe pour le style
    });

    newNoteContainer.addEventListener("dragend", () => {
        newNoteContainer.classList.remove("dragging"); // Retirer la classe
    });
}

// Permettre le glisser-déposer
notesContainer.addEventListener("dragover", (e) => {
    e.preventDefault(); // Nécessaire pour permettre le dépôt
});

notesContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    const allElements = [...notesContainer.querySelectorAll(".container2")]; // Récupérer tous les éléments
    const closestElement = allElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2; // Calculer la position
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;

    if (closestElement && closestElement !== draggingElement) {
        notesContainer.insertBefore(draggingElement, closestElement); // Réorganiser
    } else {
        notesContainer.appendChild(draggingElement); // Sinon, ajouter à la fin
    }
});

// Couleurs
colors.forEach(element => {
    element.addEventListener("click", () => {
        const color = element.getAttribute("data-color");
        document.execCommand("foreColor", false, color);
    });
});


btnStocker.addEventListener("click", saveNotes);


function saveNotes() {
    const notes = [];
    const noteElements = document.querySelectorAll(".container2");

    noteElements.forEach(noteElement => {
        const noteText = noteElement.querySelector(".texte").innerText;
        notes.push(noteText); // Récupérer le texte de chaque note
    });

    localStorage.setItem("notes", JSON.stringify(notes)); // Sauvegarder dans le localStorage
    
}


function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    notesContainer.innerHTML = ""; // Vider l'écran avant d'ajouter les notes

    savedNotes.forEach(note => {
        createNoteElement(note); // Créer une note avec le texte chargé
    });

    // Vérifier si le conteneur de couleurs doit être affiché
    toggleColorsContainer();
}

function toggleColorsContainer() {
    if (notesContainer.children.length === 0) {
        colorsContainer.style.display = "none"; // Masquer le conteneur de couleurs
        btnEnregistrer.style.display = "none"; // Masquer le bouton d'enregistrement
    } else {
        colorsContainer.style.display = "block"; // Afficher le conteneur de couleurs
        btnEnregistrer.style.display = "block"; // Afficher le bouton d'enregistrement
    }
}
