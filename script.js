// Selectors
const textInputElement = document.getElementById('js-text-input');
const dateInputElement = document.getElementById('js-date-input');
const toDoListElement = document.getElementById('js-to-do-list');

// Retrieve list
let filterType = 'all';
let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
if (toDoList) {
  renderList(filterType);
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

document.querySelectorAll('input[name="filter-type"]')
  .forEach((radio) => {
    radio.addEventListener('change', () => {
      filterType = radio.value;
      renderList(filterType);
    })
  })

// Functions
function addToList() {
  const date = dayjs(dateInputElement.value);
  const name = textInputElement.value;

  // Check for empty names and invalid dates
  if (!name.trim()) {
    alert('Please enter a task name.');
    return;
  }

  if (!date.isValid()) {
    alert('Please enter a valid date.');
    return;
  }

  toDoList.push({ name, date });

  // Remove text from input box
  textInputElement.value = '';

  renderList(filterType);
}

function renderList(filterType) {
  let listHTML = '';
  let filteredList = [];

  sortList();
  if (filterType === 'all') {
    filteredList = toDoList;
  } else if (filterType === 'completed') {
    filteredList = toDoList.filter(task => task.completed);
  } else if (filterType === 'uncompleted') {
    filteredList = toDoList.filter(task => !task.completed);
  }

  filteredList.forEach((toDo) => {
    const dateString = toDo.date.format('DD/MM/YY');
    listHTML += `
      <li class="to-do ${toDo.completed ? 'completed' : ''}">
        <div class="to-do-left">
          <input type="checkbox" class="checkbox js-checkbox"
          ${toDo.completed ? 'checked' : ''}>
          <div>${toDo.name}</div>
        </div>
        <div class="to-do-right">
          <div class="due-date">
            ${dateString}
          </div>
          <div class="delete-button-container">
            <button class="delete-button js-delete-button">
              X
            </button>
          </div>
        </div>
      </li>
    `
  });

  toDoListElement.innerHTML = listHTML;

  // Add event listeners to delete button and checkboxes
  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        toDoList.splice(index, 1);
        renderList(filterType);
      });
    });

  document.querySelectorAll('.js-checkbox')
    .forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => {
        toDoList[index].completed = checkbox.checked;

        const listItem = checkbox.closest('.to-do');
        listItem.classList.toggle('completed', checkbox.checked);

        renderList(filterType);
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

  // Sort by due date
  toDoList.sort((a, b) => a.date.diff(b.date));

  // Move completed items to bottom of list
  toDoList.sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    } else if (!a.completed && b.completed) {
      return -1;
    } else {
      return 0;
    }
  });
}

function saveToStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function deleteAll() {
  toDoList = [];
  toDoListElement.innerHTML = '';
  localStorage.removeItem('toDoList');
}