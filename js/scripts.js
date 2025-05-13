const themeBTN = document.getElementById("theme-switcher");
const addBTN = document.getElementById("add-btn");
const toDoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFillter = document.querySelector("#clear-completed");

function main() {
  // Theme Switcher
  themeBTN.addEventListener("click", () => {
    document.querySelector("body").classList.toggle("light");
    const themeIMG = themeBTN.children[0];
    themeIMG.setAttribute(
      "src",

      themeIMG.getAttribute("src") === "./assets/images/icon-sun.svg"
        ? "./assets/images/icon-moon.svg"
        : "./assets/images/icon-sun.svg"
    );
  });
  // test

  makeToDoElement(JSON.parse(localStorage.getItem("todos")));

  ul.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (
      e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currentPos, newPos);
      if (currentPos > newPos) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        ul.insertBefore(draggingCard, e.target.nextSibling);
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPos, 1);
      todos.splice(newPos, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });

  // Add to Local Storage
  addBTN.addEventListener("click", () => {
    const item = toDoInput.value.trim();
    if (item) {
      toDoInput.value = "";
      const toDos = !localStorage.getItem("todos")
        ? []
        : JSON.parse(localStorage.getItem("todos"));

      const currentToDo = {
        item: item,
        isCompleted: false,
      };

      toDos.push(currentToDo);
      localStorage.setItem("todos", JSON.stringify(toDos));
      makeToDoElement([currentToDo]);
    }
  });

  // Enter !!!
  toDoInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") addBTN.click();
  });

  // filter !!!
  filter.addEventListener("click", (e) => {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });

  // ?????????????????????
  btnFillter.addEventListener("click", () => {
    var deleteIndexes = [];
    document.querySelectorAll(".card.checked").forEach((card) => {
      deleteIndexes.push(
        [...document.querySelectorAll(".todos .card")].indexOf(card)
      );
      card.classList.add("fall");
      card.addEventListener("animationend", () => {
        card.remove();
      });
    });
    removeMultipuleTodos(deleteIndexes);
  });
}
function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = isComplete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeMultipuleTodos(indexes) {
  var todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Make To Do Elements
function makeToDoElement(toDoArray) {
  if (!toDoArray) {
    return null;
  }
  const itemsLeft = document.querySelector("#items-left");

  toDoArray.forEach((toDoObject) => {
    // Creating Elements
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBTN = document.createElement("button");
    const img = document.createElement("img");

    // Add Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBTN.classList.add("clear");

    // Add Attributes
    card.setAttribute("draggable", true);
    cbInput.setAttribute("type", "checkbox");
    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");
    item.textContent = toDoObject.item;

    if (toDoObject.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }
    // Add Event Listener

    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    cbInput.addEventListener("click", () => {
      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;
      const currentCardIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      stateTodo(currentCardIndex, checked);
      checked
        ? currentCard.classList.add("checked")
        : currentCard.classList.remove("checked");

      itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });

    clearBTN.addEventListener("click", (e) => {
      const currentCard = clearBTN.parentElement;
      currentCard.classList.add("fall");
      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);
      console.log(indexOfCurrentCard);
      removeTodo(indexOfCurrentCard);
      currentCard.addEventListener("animationend", () => {
        setTimeout(() => {
          currentCard.remove();
          itemsLeft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);
      });
    });

    // Set Element by Parent Child
    clearBTN.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBTN);

    document.querySelector(".todos").appendChild(card);
  });
  itemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}

document.addEventListener("DOMContentLoaded", main);
