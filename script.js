let toDoList = [];

// Selectors
const textInputElement = document.getElementById('js-text-input');
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
  toDoList.push(textInputElement.value);

  // Remove text from input box
  textInputElement.value = '';
  renderList();
}

function renderList() {
  listHTML = '';

  toDoList.forEach((toDo) => {
    listHTML += `
      <div>
        <p>${toDo}</p>
      </div>
    `
  });

  toDoListElement.innerHTML = listHTML;
}