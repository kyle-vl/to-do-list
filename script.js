let toDoList = [];

// Selectors
const textInputElement = document.getElementById('js-text-input');
const dateInputElement = document.getElementById('js-date-input');
const toDoListElement = document.getElementById('js-to-do-list');

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

// Functions
function addToList() {
  const date = dayjs(dateInputElement.value)
    .format(`DD/MM/YY`);
  const name = textInputElement.value
  toDoList.push({ name, date });

  // Remove text from input box
  textInputElement.value = '';
  renderList();
}

function renderList() {
  let listHTML = '';

  toDoList.forEach((toDo) => {
    listHTML += `
      <div class="to-do">
        <p>${toDo.name}</p>
        <p>${toDo.date}</p>
      </div>
    `
  });

  toDoListElement.innerHTML = listHTML;
}