
const app = document.getElementById("app");
const newNoteBtn = document.getElementById("new-note-btn");
const createNoteModal = document.getElementById("note-modal");
const NoteBtn1 = document.getElementById("note-btn-1");
const NoteBtn2 = document.getElementById("note-btn-2");

const noteContent = document.getElementById("note-content");
const noteTitle = document.getElementById("note-title");

const notesDiv = document.getElementById("notes");


let notes = []

notes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];



const accessNote = (index) => {


    noteTitle.value = '';
    noteContent.value = '';

    console.log(index)
    createNoteModal.style.display = "flex"

    NoteBtn1.innerText = ' Create ';
    NoteBtn2.innerText = ' Discard ';


    if (typeof index !== "number"){
        return;
    }

    NoteBtn1.innerText = ' Edit ';
    NoteBtn2.innerText = ' Close ';

    NoteBtn1.value = index;

    noteTitle.value = notes[index].title;
    noteContent.value = notes[index].text;
}

const displayNotes = () => {
    notes.forEach((note, index)=> {
        notesDiv.innerHTML += `
            <button class="note button" onclick="accessNote(${index})" id="${note.id}" value=${index} >
                <h2>${note.title}</h2>
    
                <p >${note.text.length > 40 ? `${note.text.substring(0, 40)}...` : note.text}</p>
            </button>
        `
    
    })
}




const finishNote = (e) => {

    notesDiv.innerHTML = ``    

    if (noteTitle.value === "" && noteContent.value === ""){
        alert("Please enter a title and/or enter text.");
        displayNotes();
        return;
    }

    createNoteModal.style.display = "none";
    const noteID = `${noteTitle.value.toLowerCase().split(" ").join("-")}-${notes.length}`;

    if(e.target.value){
        editNote(e.target.value, noteID);
        return;
    }

    notes.push({title: noteTitle.value, text: noteContent.value, time: 5, id: noteID});
    localStorage.setItem("notes", JSON.stringify(notes))

    noteTitle.value = '';
    noteContent.value = '';

    displayNotes();
}

const editNote = (index, ID) => {
    notes[index] = {title: noteTitle.value, text: noteContent.value, time: 5, id: ID};
    localStorage.setItem("notes", JSON.stringify(notes))
    noteTitle.value = '';
    noteContent.value = '';
    displayNotes();
}




newNoteBtn.addEventListener('click', accessNote)
NoteBtn1.addEventListener('click', finishNote)
NoteBtn2.addEventListener('click', ()=>{createNoteModal.style.display = "none";})




displayNotes();