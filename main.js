
const app = document.getElementById("app");
const newNoteBtn = document.getElementById("new-note-btn");
const createNoteModal = document.getElementById("note-modal");
const NoteBtn1 = document.getElementById("note-btn-1");
const NoteBtn2 = document.getElementById("note-btn-2");

const noteContent = document.getElementById("note-content");
const noteTitle = document.getElementById("note-title");

const notesDiv = document.getElementById("notes");

const ReWriteBtn = document.getElementById("re-write-btn");
const viewPreviousBtn = document.getElementById("view-previous-btn");


let notes = []
let isShowingPrev = false;


notes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];



const accessNote = (index) => {

    noteTitle.value = '';
    noteContent.value = '';

    viewPreviousBtn.style.display = "none";

    NoteBtn1.value = null;
    ReWriteBtn.value = null;

    viewPreviousBtn.value = null;


    ReWriteBtn.disabled = true;
    ReWriteBtn.style.display = "none";

    console.log(index)
    createNoteModal.style.display = "flex"

    NoteBtn1.innerText = ' Create ';
    NoteBtn2.innerText = ' Discard ';


    if (typeof index !== "number"){
        return;
    }

    NoteBtn1.innerText = ' Save ';
    NoteBtn2.innerText = ' Close ';

    ReWriteBtn.disabled = false;
    ReWriteBtn.style.display = "inline";

    NoteBtn1.value = index;
    ReWriteBtn.value = index;


    viewPreviousBtn.style.display = notes[index].history.length > 0 ? "inline" : "none";
    
    viewPreviousBtn.value = index;

    noteTitle.value = notes[index].title;
    noteContent.value = notes[index].text;
}

const displayNotes = () => {
    console.log("I fired")
    notes.forEach((note, index)=> {
        notesDiv.innerHTML += `
            <button class="note button" onclick="accessNote(${index})" id="${note.id}" value=${index} >
                <h2></h2>
                <h2>${note.title}</h2>
    
                <p >${note.text.length > 40 ? `${note.text.substring(0, 40)}...` : note.text}</p>
                
            </button>
        `
    
    })
}



const finishNote = (e) => {
    notesDiv.innerHTML = ``

    index = Number(e.target.value); 

    if (noteTitle.value === "" && noteContent.value === ""){
        alert("Please enter a title and/or enter text.");
        displayNotes();
        return;
    }

    createNoteModal.style.display = "none";
    const noteID = `${noteTitle.value.toLowerCase().split(" ").join("-")}-${notes.length}`;

    noteContent.placeholder = "Take down some notes, make sure to keep it short!";

    if(notes[index]){
        console.log(notes[index])
        editNote(index, noteID);
        return;
    }

    notes.push({title: noteTitle.value, text: noteContent.value, time: 0, id: noteID, index: e.target.value, history: []});
    localStorage.setItem("notes", JSON.stringify(notes))

    noteTitle.value = '';
    noteContent.value = '';

    displayNotes();
}

const editNote = (index, ID) => {
    isShowingPrev = false;
    notes[index] = {title: noteTitle.value, text: noteContent.value, time: 0, id: ID, index: index, history: notes[index].history};
    localStorage.setItem("notes", JSON.stringify(notes))
    noteTitle.value = '';
    noteContent.value = '';
    displayNotes();
}

const reWriteNote = (e) => {
    notesDiv.innerHTML = ``

    const index = e.target.value;

    console.log(index)
    let count = 60;

    notes[index].history.unshift({ 
        title: notes[index].title, 
        text: notes[index].text,
        id: notes[index].id,
        index: notes[index].index
        }
    )

    editNote(index, notes[index].id)
    

    const displayedNote = document.getElementById(notes[index].id)

    noteContent.placeholder = `Re:Write your notes! 
    
    Rewrite your old notes to the best of your ability. Only use the "View Previous" if you're really stuck or once you're complete with your re-write!

    Hint: ${notes[index].text.substring(0, 40)}...`;

    notes[index].text = ""

    localStorage.setItem("notes", JSON.stringify(notes))

    createNoteModal.style.display = "none";

    displayedNote.disabled = true;

    const timer = setInterval(()=>{
        displayedNote.firstElementChild.innerText = count;
        count -= 1;
        if (count < 0){
            clearInterval(timer);
            displayedNote.disabled = false;
            displayedNote.firstElementChild.innerText = "";
        }
    }, 1000);

}


let current = {};



const viewPrevious = (e) => {
    
    isShowingPrev = !isShowingPrev;

    const index = e.target.value

    if(isShowingPrev){
        current = {title: noteTitle.value, text: noteContent.value};
        noteTitle.value = notes[index].history[0].title;
        noteContent.value = notes[index].history[0].text;

        viewPreviousBtn.innerText = "View Current";

        noteContent.disabled = true;
        NoteBtn1.disabled = true;
        NoteBtn2.disabled = true;
        ReWriteBtn.disabled = true;
    }else{
        noteContent.disabled = false;
        NoteBtn1.disabled = false;
        NoteBtn2.disabled = false;
        ReWriteBtn.disabled = false;
        noteTitle.value = current.title
        noteContent.value = current.text

        viewPreviousBtn.innerText = "View Previous";
        
    }
    
}


newNoteBtn.addEventListener('click', accessNote)
NoteBtn1.addEventListener('click', finishNote)
NoteBtn2.addEventListener('click', ()=>{
    createNoteModal.style.display = "none";
    isShowingPrev = false;
    noteContent.placeholder = "Take down some notes, make sure to keep it short!";
})

ReWriteBtn.addEventListener('click', reWriteNote)
viewPreviousBtn.addEventListener('click', viewPrevious)

//localStorage.setItem("notes", []);

displayNotes();