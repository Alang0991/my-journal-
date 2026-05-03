const PASSWORD = "BlueyBarks";

/* STORAGE */

let entries =
    JSON.parse(
        localStorage.getItem("journalEntries")
    ) || [];

let currentEntry = null;

/* ELEMENTS */

const loginScreen =
    document.getElementById("loginScreen");

const journalApp =
    document.getElementById("journalApp");

const passwordInput =
    document.getElementById("passwordInput");

const loginError =
    document.getElementById("loginError");

const entryList =
    document.getElementById("entryList");

const entryTitle =
    document.getElementById("entryTitle");

const journalText =
    document.getElementById("journalText");

const moodSelect =
    document.getElementById("moodSelect");

const saveStatus =
    document.getElementById("saveStatus");

const liveWordCount =
    document.getElementById("liveWordCount");

const entryCount =
    document.getElementById("entryCount");

const wordCount =
    document.getElementById("wordCount");

const searchBox =
    document.getElementById("searchBox");

/* LOGIN */

function login() {

    const enteredPassword =
        passwordInput.value;

    if (enteredPassword === PASSWORD) {

        loginScreen.classList.remove("active");

        journalApp.classList.remove("hidden");

        renderEntries();

        if (entries.length > 0) {

            loadEntry(entries[0].id);

        } else {

            newEntry();

        }

    } else {

        loginError.textContent =
            "Incorrect password.";

        passwordInput.style.borderColor =
            "#f87171";

        setTimeout(() => {

            passwordInput.style.borderColor =
                "rgba(255,255,255,0.08)";

        }, 1500);

    }

}

/* ENTER KEY LOGIN */

passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            login();

        }

    }
);

/* CREATE NEW ENTRY */

function newEntry() {

    const entry = {

        id: Date.now(),

        title: "Untitled Entry",

        content: "",

        mood: "Neutral",

        date: new Date().toLocaleString()

    };

    entries.unshift(entry);

    saveEntries();

    renderEntries();

    loadEntry(entry.id);

}

/* LOAD ENTRY */

function loadEntry(id) {

    currentEntry =
        entries.find(
            entry => entry.id === id
        );

    if (!currentEntry) return;

    entryTitle.value =
        currentEntry.title;

    journalText.value =
        currentEntry.content;

    moodSelect.value =
        currentEntry.mood;

    updateLiveWordCount();

}

/* SAVE */

function saveEntries() {

    localStorage.setItem(
        "journalEntries",
        JSON.stringify(entries)
    );

    updateStats();

}

/* RENDER ENTRIES */

function renderEntries() {

    entryList.innerHTML = "";

    const search =
        searchBox.value.toLowerCase();

    entries
        .filter(entry => {

            return (

                entry.title
                    .toLowerCase()
                    .includes(search)

                ||

                entry.content
                    .toLowerCase()
                    .includes(search)

            );

        })

        .forEach(entry => {

            const div =
                document.createElement("div");

            div.className =
                "entry-item";

            div.innerHTML = `
                <strong>${entry.title}</strong><br>
                <small>${entry.date}</small><br>
                <small>${entry.mood}</small>
            `;

            div.onclick = () => {

                loadEntry(entry.id);

            };

            entryList.appendChild(div);

        });

    updateStats();

}

/* UPDATE STATS */

function updateStats() {

    entryCount.textContent =
        entries.length;

    const totalWords =
        entries.reduce((count, entry) => {

            return (
                count +

                entry.content
                    .split(/\\s+/)
                    .filter(Boolean)
                    .length
            );

        }, 0);

    wordCount.textContent =
        totalWords;

}

/* LIVE WORD COUNT */

function updateLiveWordCount() {

    const words =
        journalText.value
            .split(/\\s+/)
            .filter(Boolean)
            .length;

    liveWordCount.textContent =
        `${words} words`;

}

/* AUTO SAVE */

function autoSave() {

    if (!currentEntry) return;

    currentEntry.title =
        entryTitle.value
        || "Untitled Entry";

    currentEntry.content =
        journalText.value;

    currentEntry.mood =
        moodSelect.value;

    currentEntry.date =
        new Date().toLocaleString();

    saveEntries();

    renderEntries();

    updateLiveWordCount();

    saveStatus.textContent =
        "Saved";

    saveStatus.style.opacity = "1";

    setTimeout(() => {

        saveStatus.style.opacity =
            "0.5";

    }, 1000);

}

/* EXPORT */

function exportEntries() {

    const data =
        JSON.stringify(
            entries,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "journal-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* SEARCH */

searchBox.addEventListener(
    "input",
    renderEntries
);

/* AUTO SAVE EVENTS */

entryTitle.addEventListener(
    "input",
    autoSave
);

journalText.addEventListener(
    "input",
    autoSave
);

moodSelect.addEventListener(
    "change",
    autoSave
);

/* AUTO SAVE LOOP */

setInterval(() => {

    autoSave();

}, 10000);

/* SHORTCUTS */

document.addEventListener(
    "keydown",
    function(event) {

        /* CTRL + S */

        if (
            event.ctrlKey &&
            event.key === "s"
        ) {

            event.preventDefault();

            autoSave();

        }

        /* CTRL + N */

        if (
            event.ctrlKey &&
            event.key === "n"
        ) {

            event.preventDefault();

            newEntry();

        }

    }
);

/* INITIALIZE */

updateStats();
