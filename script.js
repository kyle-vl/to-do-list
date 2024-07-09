// Selectors
const textInputElement = document.getElementById('js-text-input');
const dateInputElement = document.getElementById('js-date-input');
const toDoListElement = document.getElementById('js-to-do-list');

// Retrieve list
let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
if (toDoList) {
  renderList();
}

// Event Listeners
document.getElementById('js-add-button')
  .addEventListener('click', () => {
    addToList();
  });

document.getElementById('js-text-input')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addToList();
    }
  })

document.getElementById('js-delete-all-button')
  .addEventListener('click', () => {
    deleteAll();
  });

// Functions
function addToList() {
  const date = dayjs(dateInputElement.value);
  const name = textInputElement.value;
  toDoList.push({ name, date });

  // Remove text from input box
  textInputElement.value = '';
  renderList();
}

function renderList() {
  let listHTML = '';

  sortList();

  toDoList.forEach((toDo) => {
    const dateString = toDo.date.format('DD/MM/YY');
    listHTML += `
      <div class="to-do">
        <div>${toDo.name}</div>
        <div>${dateString}</div>
        <div>
          <button class="delete-button js-delete-button">
            Delete
          </button>
        </div>
      </div>
    `
  });

  toDoListElement.innerHTML = listHTML;
  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        toDoList.splice(index, 1);
        renderList();
      });
    });

  saveToStorage();
}

function sortList() {
  toDoList.forEach((toDo) => {
    // Convert strings to dates (if retrived from localStorage)
    if (typeof toDo.date === 'string') {
      toDo.date = dayjs(toDo.date);
    }
  });

  toDoList.sort((a, b) => a.date.diff(b.date));
}

function saveToStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function deleteAll() {
  toDoList = [];
  toDoListElement.innerHTML = '';
  localStorage.removeItem('toDoList');
}