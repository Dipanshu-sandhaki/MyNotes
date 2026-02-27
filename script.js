var taskCount = 0;

function addTask(savedContent, savedId) {
  taskCount++;
  var id = savedId || ("task" + taskCount);

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

  var toolbar = document.createElement("div");
  toolbar.className = "task-toolbar";

  var boldBtn = document.createElement("button");
  boldBtn.className = "btn-bold";
  boldBtn.textContent = "B";
  boldBtn.title = "Bold";
  boldBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    document.execCommand("bold", false, null);
  });

  var ulBtn = document.createElement("button");
  ulBtn.textContent = "• List";
  ulBtn.title = "Unordered List";
  ulBtn.addEventListener("mousedown", function(e) {
    e.preventDefault();
    document.execCommand("insertUnorderedList", false, null);
  });

  var olBtn = document.createElement("button");
  olBtn.textContent = "1. List";
  olBtn.title = "Ordered List";
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
  }

  var footer = document.createElement("div");
  footer.className = "task-footer";

  var saveBtn = document.createElement("button");
  saveBtn.className = "task-save-btn";
  saveBtn.textContent = "Save";
  saveBtn.onclick = function() {
    saveTask(id, savedMsg);
  };

  var savedMsg = document.createElement("span");
  savedMsg.className = "task-saved-msg";
  savedMsg.textContent = "Saved!";

  footer.appendChild(saveBtn);
  footer.appendChild(savedMsg);

  card.appendChild(xBtn);
  card.appendChild(toolbar);
  card.appendChild(editArea);
  card.appendChild(footer);

  document.getElementById("tasksWrapper").appendChild(card);
}

function saveTask(cardId, msgEl) {
  var area = document.querySelector("#" + cardId + " .task-area");
  var allData = getSavedData();
  allData[cardId] = area.innerHTML;
  localStorage.setItem("notebookTasks", JSON.stringify(allData));

  msgEl.style.display = "inline";
  setTimeout(function() {
    msgEl.style.display = "none";
  }, 1500);
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

window.onload = function() {
  var allData = getSavedData();
  var keys = Object.keys(allData);
  for (var i = 0; i < keys.length; i++) {
    addTask(allData[keys[i]], keys[i]);
  }
};