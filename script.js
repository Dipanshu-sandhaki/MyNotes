var taskCount = 0;

function addTask(savedData, savedId) {
  if (!savedId) {
    taskCount++;
  }
  var id = savedId || ("task" + taskCount);

  var savedContent = savedData ? savedData.content : "";
  var savedName = savedData ? savedData.name : "";

  var card = document.createElement("div");
  card.className = "task-card";
  card.id = id;

  var xBtn = document.createElement("button");
  xBtn.className = "task-delete-x";
  xBtn.textContent = "×";
  xBtn.title = "Delete task";
  xBtn.onclick = function() {
    removeTask(id);
  };

  var nameRow = document.createElement("div");
  nameRow.className = "task-name-row";

  var nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "task-name-input";
  nameInput.value = savedName;
  nameInput.placeholder = "Add task name...";
  nameInput.onchange = function() {
    updateTaskName(id, nameInput.value);
  };

  if (savedContent) {
    nameInput.readOnly = true;
    nameInput.style.cursor = "default";
  }

  nameRow.appendChild(nameInput);

  var toolbar = document.createElement("div");
  toolbar.className = "task-toolbar";

  var boldBtn = document.createElement("button");
  boldBtn.className = "btn-bold";
  boldBtn.textContent = "B";
  boldBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    document.execCommand("bold", false, null);
  });

  var ulBtn = document.createElement("button");
  ulBtn.textContent = "• List";
  ulBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    document.execCommand("insertUnorderedList", false, null);
  });

  var olBtn = document.createElement("button");
  olBtn.textContent = "1. List";
  olBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    document.execCommand("insertOrderedList", false, null);
  });

  toolbar.appendChild(boldBtn);
  toolbar.appendChild(ulBtn);
  toolbar.appendChild(olBtn);

  var editArea = document.createElement("div");
  editArea.className = "task-area";
  editArea.contentEditable = "true";

  if (savedContent) {
    editArea.innerHTML = savedContent;
    editArea.contentEditable = "false";
    editArea.classList.add("task-area-locked");
  }

  var footer = document.createElement("div");
  footer.className = "task-footer";

  var saveBtn = document.createElement("button");
  saveBtn.className = "task-save-btn";
  saveBtn.textContent = "Save";

  var editBtn = document.createElement("button");
  editBtn.className = "task-edit-btn";
  editBtn.textContent = "Edit";

  var savedMsg = document.createElement("span");
  savedMsg.className = "task-saved-msg";
  savedMsg.textContent = "Saved!";

  if (savedContent) {
    saveBtn.style.display = "none";
    editBtn.style.display = "inline-block";
    toolbar.style.display = "none";
  } else {
    editBtn.style.display = "none";
  }

  saveBtn.onclick = function() {
    saveTask(id, savedMsg, saveBtn, editBtn, editArea, toolbar, nameInput);
  };

  editBtn.onclick = function() {
    editArea.contentEditable = "true";
    editArea.classList.remove("task-area-locked");
    editArea.focus();
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    toolbar.style.display = "flex";
    nameInput.readOnly = false;
    nameInput.style.cursor = "text";
  };

  footer.appendChild(saveBtn);
  footer.appendChild(editBtn);
  footer.appendChild(savedMsg);

  card.appendChild(xBtn);
  card.appendChild(nameRow);
  card.appendChild(toolbar);
  card.appendChild(editArea);
  card.appendChild(footer);

  document.getElementById("tasksWrapper").appendChild(card);
}

function saveTask(cardId, msgEl, saveBtn, editBtn, editArea, toolbar, nameInput) {
  var allData = getSavedData();

  allData[cardId] = {
    name: nameInput.value,
    content: editArea.innerHTML
  };

  localStorage.setItem("notebookTasks", JSON.stringify(allData));

  editArea.contentEditable = "false";
  editArea.classList.add("task-area-locked");
  saveBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  toolbar.style.display = "none";
  nameInput.readOnly = true;
  nameInput.style.cursor = "default";

  msgEl.style.display = "inline";
  setTimeout(function() {
    msgEl.style.display = "none";
  }, 1500);
}

function updateTaskName(cardId, newName) {
  var allData = getSavedData();
  if (allData[cardId]) {
    allData[cardId].name = newName;
    localStorage.setItem("notebookTasks", JSON.stringify(allData));
  }
}

function removeTask(cardId) {
  var card = document.getElementById(cardId);
  if (card) {
    card.remove();
  }
  var allData = getSavedData();
  delete allData[cardId];
  localStorage.setItem("notebookTasks", JSON.stringify(allData));
}

function getSavedData() {
  var stored = localStorage.getItem("notebookTasks");
  if (stored) {
    return JSON.parse(stored);
  }
  return {};
}

function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

function searchTasks() {
  var query = normalize(document.getElementById("searchInput").value);
  var cards = document.querySelectorAll(".task-card");
  var visibleCount = 0;

  for (var i = 0; i < cards.length; i++) {
    var nameInput = cards[i].querySelector(".task-name-input");
    var taskName = nameInput ? normalize(nameInput.value) : "";

    if (query === "" || taskName.indexOf(query) !== -1) {
      cards[i].style.display = "flex";
      visibleCount++;
    } else {
      cards[i].style.display = "none";
    }
  }

  var noResults = document.getElementById("noResults");
  noResults.style.display = (query !== "" && visibleCount === 0) ? "block" : "none";
}

window.onload = function() {
  var allData = getSavedData();
  var keys = Object.keys(allData);

  for (var i = 0; i < keys.length; i++) {
    var match = keys[i].match(/^task(\d+)$/);
    if (match) {
      var num = parseInt(match[1]);
      if (num > taskCount) taskCount = num;
    }
  }

  for (var i = 0; i < keys.length; i++) {
    addTask(allData[keys[i]], keys[i]);
  }
};