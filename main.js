//! Variables
let input = document.querySelector(".input");
let addTask = document.querySelector(".add");
let tasks = document.querySelector(".tasks");
let form = document.querySelector(".form");
let logo = document.querySelector(".logo");
let footer = document.querySelector("footer");
let backIcon = document.querySelector("i.back");

//! Time
let time = document.querySelector(".time");
setInterval(function () {
  time.innerHTML = new Date().toLocaleTimeString();
}, 1000);

//! Time Mode
function myFunction(x) {
  if (x.matches) {
    time.addEventListener("click", function () {
      logo.style.opacity = "0";
      tasks.style.opacity = "0";
      form.style.opacity = "0";
      numHolder.style.opacity = "0";
      delAll.style.opacity = "0";
      footer.style.opacity = "0";

      setTimeout(function () {
        logo.style.display = "none";
        tasks.style.display = "none";
        form.style.display = "none";
        numHolder.style.display = "none";
        delAll.style.display = "none";
        footer.style.display = "none";
      }, 500);

      time.style.top = "50%";
      time.style.right = "50%";
      time.style.transform = "translate(50%, -50%)";
      time.style.fontSize = "10rem";

      modeIcon.style.left = "calc(100% - 60px)";
      colorIcon.style.left = "calc(100% - 95px)";

      backIcon.style.display = "block";
    });

    backIcon.addEventListener("click", function () {
      logo.style.display = "block";
      tasks.style.display = "block";
      form.style.display = "flex";
      numHolder.style.display = "block";
      if (tasks.children.length != 0) {
        delAll.style.display = "block";
      } else {
        delAll.style.display = "none";
      }
      footer.style.display = "block";

      setTimeout(function () {
        logo.style.opacity = "100%";
        tasks.style.opacity = "100%";
        form.style.opacity = "100%";
        numHolder.style.opacity = "100%";
        delAll.style.opacity = "100%";
        footer.style.opacity = "100%";
      }, 500);

      time.style.top = "70px";
      time.style.right = "40px";
      time.style.transform = "unset";
      time.style.fontSize = "20px";

      modeIcon.style.left = "40px";
      colorIcon.style.left = "75px";

      backIcon.style.display = "none";
    });
  } else {
    return;
  }
}

var x = window.matchMedia("(min-width: 768px)");
myFunction(x);
x.addEventListener("change", myFunction);

//! Joker Array
let tasksHolderArr = [];

if (localStorage.getItem("tasks")) {
  tasksHolderArr = JSON.parse(localStorage.getItem("tasks"));
}

getTasksFromLocal();
doneChecker();

//! Task Process "ADD + DELETE"
addTask.addEventListener("click", function (e) {
  if (
    input.value.trim() === "" ||
    input.value.trim() === " " ||
    input.value.length < 1 ||
    input.value.trim().includes("  ")
  ) {
    e.preventDefault();
  } else {
    addTasksToArray(input.value);
  }
  input.value = "";
  tasksNumber();
  delAllBtn(delAll);
  doneChecker();
});

//! To Make Enter Act Like Add Task
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask.click();
  }
});

//! Functions
//? Add Tasks To Array
function addTasksToArray(taskText) {
  let task = {
    id: Date.now(),
    title: taskText,
    completed: false,
    date: new Date().toString().slice(0, 21),
  };
  tasksHolderArr.push(task);
  addTasksToPage(tasksHolderArr);
  addTasksToLocal(tasksHolderArr);
}

//? Add Tasks To Page
function addTasksToPage(tasksHolderArr) {
  tasks.innerHTML = "";
  tasksHolderArr.forEach(function (task) {
    let taskNode = document.createTextNode(task.title);
    let taskP = document.createElement("p");
    taskP.classList.add("taskP");
    taskP.append(taskNode);

    taskP.addEventListener("click", function (e) {
      toggleComplete(e.target.parentElement.getAttribute("data-id"));
      e.target.parentElement.classList.toggle("done");
      tasksNumber();
    });

    taskP.addEventListener("contextmenu", function () {
      this.setAttribute("contenteditable", "");
    });

    taskP.addEventListener("blur", function (e) {
      this.removeAttribute("contenteditable");
      editTask(e.target.parentElement.getAttribute("data-id"), taskP);
    });

    let taskDiv = document.createElement("div");
    taskDiv.classList.add("taskDiv");
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.append(taskP);
    tasks.append(taskDiv);

    let dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    dateSpan.innerHTML = task.date;
    taskDiv.append(dateSpan);

    //? Fix delBtn background
    setTimeout(function () {
      if (rs.getPropertyValue("--secondColor") == "#e9e9e9") {
        document.querySelectorAll(".delBtn").forEach((btn) => {
          btn.style.background = "url(./media/Images/lightsmallinputbg.jpg)";
          btn.style.backgroundSize = "cover";
        });
      }
    }, 0);

    let priority = document.createElement("i");
    priority.classList.add("fa-solid");
    priority.classList.add("fa-angles-up");
    taskDiv.prepend(priority);

    priority.addEventListener("click", function (e) {
      addPriority(
        e.target.parentElement.getAttribute("data-id"),
        e.target.parentElement
      );
    });

    let delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerHTML = "Delete";
    taskDiv.append(delBtn);
    delBtn.onclick = () => {
      delPopup(taskDiv, delBtn);
    };
  });
}

//? Add Tasks To Local Storage From Array
function addTasksToLocal(tasksHolderArr) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksHolderArr));
}

//? Get Tasks From Local Storage
function getTasksFromLocal() {
  if (window.localStorage.getItem("tasks")) {
    let tasks = JSON.parse(window.localStorage.getItem("tasks"));
    addTasksToPage(tasks);
  }
}

//? Delete Tasks From Local Storage
function delTaskFromLocal(taskID) {
  tasksHolderArr = tasksHolderArr.filter((task) => task.id != taskID);
  addTasksToLocal(tasksHolderArr);
}

//? Toggle Completed Prop On Clicked Task
function toggleComplete(taskID) {
  for (let i = 0; i < tasksHolderArr.length; i++) {
    if (tasksHolderArr[i].id == taskID) {
      if (tasksHolderArr[i].completed == false) {
        tasksHolderArr[i].completed = true;
      } else {
        tasksHolderArr[i].completed = false;
      }
    }
  }
  addTasksToLocal(tasksHolderArr);
}

//? Editing Task
function editTask(taskID, taskCont) {
  for (let i = 0; i < tasksHolderArr.length; i++) {
    if (tasksHolderArr[i].id == taskID) {
      tasksHolderArr[i].title = taskCont.innerHTML;
    }
  }
  addTasksToLocal(tasksHolderArr);
}

//? Add Priority
function addPriority(taskID, taskDiv) {
  tasks.prepend(taskDiv);
  tasksHolderArr.forEach(function (ele, i) {
    if (ele.id == taskID) {
      let prior = tasksHolderArr.splice(i, 1);
      tasksHolderArr.unshift(...prior);
    }
  });
  addTasksToLocal(tasksHolderArr);
}

//? Number Of Tasks
let numHolder = document.createElement("div");
numHolder.innerHTML = "";
numHolder.classList.add("numHolder");
numHolder.style.textAlign = "center";
tasks.before(numHolder);
function tasksNumber() {
  let notDone = [];
  for (let i = 0; i < tasksHolderArr.length; i++) {
    if (tasksHolderArr[i].completed == false) {
      notDone.push(tasksHolderArr[i]);
    }
  }
  if (notDone.length == 0) {
    numHolder.innerHTML = `You've No Tasks`;
  } else if (notDone.length == 1) {
    numHolder.innerHTML = `You've ${notDone.length} Task`;
  } else {
    numHolder.innerHTML = `You've ${notDone.length} Tasks`;
  }
}
tasksNumber();

//? Deleting All Tasks
let delAll = document.createElement("button");
delAll.innerHTML = "Delete All";
delAll.classList.add("delAll");
tasks.after(delAll);
delAllBtn(delAll);
if (tasks.children.length != 0) {
  delAll.style.display = "block";
} else {
  delAll.style.display = "none";
}
function delAllBtn(delAll) {
  if (tasks.children.length != 0) {
    delAll.style.display = "block";
  }
  delAll.addEventListener("click", function () {
    tasks.innerHTML = "";
    tasksHolderArr = [];
    window.localStorage.removeItem("tasks");
    tasksNumber();
    delAll.style.display = "none";
  });
}

//? Check Done Class
function doneChecker() {
  for (let i = 0; i < tasksHolderArr.length; i++) {
    for (let j = 0; j < tasks.childNodes.length; j++) {
      if (tasksHolderArr[j].completed == true) {
        tasks.childNodes[j].classList.add("done");
      }
    }
  }
}

//? Delete popup
function delPopup(taskDiv, delBtn) {
  let popup = document.createElement("div");
  popup.classList.add("popup");
  document.body.append(popup);

  let popCont = document.createElement("div");
  popCont.classList.add("popCont");
  popup.append(popCont);

  let warnP = document.createElement("p");
  warnP.classList.add("warnP");
  warnP.innerHTML = "Are you sure?";
  popCont.append(warnP);
  let warnP2 = document.createElement("p");
  warnP2.classList.add("warnP2");
  warnP2.innerHTML = "There is no Backup for Deleted tasks!";
  popCont.append(warnP2);

  let btnsHolder = document.createElement("div");
  btnsHolder.classList.add("btnsHolder");
  popCont.append(btnsHolder);

  let no = document.createElement("button");
  no.innerHTML = "Nope! keep it.";
  no.classList.add("no");
  btnsHolder.append(no);
  let yes = document.createElement("button");
  yes.innerHTML = "Yep";
  yes.classList.add("yes");
  btnsHolder.append(yes);

  setTimeout(function () {
    popup.style.opacity = "1";
    popCont.style.opacity = "1";
    popCont.style.transform = "scale(1)";
  }, 0);

  yes.onclick = () => {
    taskDiv.remove();
    delTaskFromLocal(delBtn.parentElement.getAttribute("data-id"));
    tasksNumber();
    if (tasks.children.length == 0) {
      delAll.style.display = "none";
    }
    popup.remove();
  };
  no.onclick = () => {
    popup.remove();
    return;
  };
}

//! Color Changing
let colorIcon = document.querySelector("i.color");
let colorInput = document.querySelector("input[type='color']");
colorIcon.addEventListener("click", function () {
  colorInput.click();
});

colorInput.addEventListener("change", function () {
  window.localStorage.setItem("color", colorInput.value);
  r.style.setProperty("--mainColor", window.localStorage.getItem("color"));
});

function clrLocal() {
  colorInput.value = window.localStorage.getItem("color");
  r.style.setProperty("--mainColor", window.localStorage.getItem("color"));
}

//! Dark/Light Mode
let modeIcon = document.querySelector("i.mode");
var r = document.querySelector(":root");
var rs = getComputedStyle(r);

let buddy = document.querySelector("body");
let overlay = document.querySelector(".overlay");

modeIcon.addEventListener("click", function () {
  if (rs.getPropertyValue("--secondColor") == "#e9e9e9") {
    overlay.style.setProperty("background-color", "#121212a2");

    r.style.setProperty("--secondColor", "#121212");

    buddy.style.setProperty("background", "url(./media/Images/darkbgblur.jpg)");
    buddy.style.setProperty("background-size", "cover");

    input.style.setProperty("background", "url(./media/Images/inputbg.jpg)");
    input.style.setProperty("background-size", "cover");

    addTask.style.setProperty(
      "background",
      "url(./media/Images/smallinputbg.jpg)"
    );
    addTask.style.setProperty("background-size", "cover");

    document.querySelectorAll(".delBtn").forEach((btn) => {
      btn.style.setProperty(
        "background",
        "url(./media/Images/smallinputbg.jpg)"
      );
      btn.style.setProperty("background-size", "cover");
    });
  } else {
    overlay.style.setProperty("background-color", "#e9e9e9a2");

    r.style.setProperty("--secondColor", "#e9e9e9");

    buddy.style.setProperty(
      "background",
      "url(./media/Images/lightbgblur.jpg)"
    );
    buddy.style.setProperty("background-size", "cover");

    input.style.setProperty(
      "background",
      "url(./media/Images/lightinputbg.jpg)"
    );
    input.style.setProperty("background-size", "cover");

    addTask.style.setProperty(
      "background",
      "url(./media/Images/lightsmallinputbg.jpg)"
    );
    addTask.style.setProperty("background-size", "cover");

    document.querySelectorAll(".delBtn").forEach((btn) => {
      btn.style.setProperty(
        "background",
        "url(./media/Images/lightsmallinputbg.jpg)"
      );

      btn.style.setProperty("background-size", "cover");
    });
  }
});

clrLocal();

//! Disable Right-Click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
