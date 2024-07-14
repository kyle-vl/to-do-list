// Selectors
const textInputElement = document.getElementById('js-text-input');
const dateInputElement = document.getElementById('js-date-input');
const timeInputElement = document.getElementById('js-time-input');
const toDoListElement = document.getElementById('js-to-do-list');
const filterDropdownElement =
  document.getElementById('js-filter-dropdown');
const displayDropdownElement =
  document.getElementById('js-display-dropdown');

// Retrieve list
let filterType = 'all';
let displayType = localStorage.getItem('displayType') || '24';
let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
if (toDoList) {
  renderList(filterType, displayType);
}

// Input Header Event Listeners
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

// Sidebar Event Listeners

// Filter options
document.querySelectorAll('.filter-option')
  .forEach((option) => {
    option.addEventListener('click', (event) => {
      filterDropdownElement.style.display = 'none';

      filterType = event.currentTarget.getAttribute('filter-type');
      renderList(filterType, displayType);
    });
  });

document.getElementById('js-filter-drop-button')
  .addEventListener('click', () => {
    filterDropdownElement.style.display =
      (filterDropdownElement.style.display === 'block') ? 'none' : 'block';
  });

filterDropdownElement.addEventListener('mouseleave', function () {
  filterDropdownElement.style.display = 'none';
});

// Display options
document.querySelectorAll('.display-option')
  .forEach((option) => {
    option.addEventListener('click', (event) => {
      displayDropdownElement.style.display = 'none';

      displayType = event.currentTarget.getAttribute('display-type');
      localStorage.setItem('displayType', displayType);
      renderList(filterType, displayType);
    });
  });

document.getElementById('js-display-drop-button')
  .addEventListener('click', () => {
    displayDropdownElement.style.display =
      (displayDropdownElement.style.display === 'block') ? 'none' : 'block';
  });

displayDropdownElement.addEventListener('mouseleave', function () {
  displayDropdownElement.style.display = 'none';
});

// Functions
function addToList() {
  const dateValue = dateInputElement.value;
  const timeValue = timeInputElement.value;

  // Append :00 at the end of timeValue to include seconds
  const combinedDateTime = `${dateValue}T${timeValue}:00`

  const date = dayjs(combinedDateTime);
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

  renderList(filterType, displayType);
}

function renderList(filterType, displayType) {
  let previousToDo = '';
  let previousDateString = '';
  let timeString = '';

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

  filteredList.forEach((toDo, index) => {
    const dateString = toDo.date.format('dddd, MMMM D');
    if (index !== 0) {
      previousDateString = previousToDo.date.format('dddd, MMMM D');
    }

    if (index === 0 || dateString !== previousDateString) {
      listHTML += `
        <div class="to-do-date">${dateString}</div>
      `
    }


    if (displayType === '12') {
      timeString = toDo.date.format('h:mm A');
    } else {
      timeString = toDo.date.format('HH:mm');
    }
    listHTML += `
      <li class="to-do ${toDo.completed ? 'completed' : ''}">
        <div class="to-do-left">
          <input type="checkbox" class="checkbox js-checkbox"
          ${toDo.completed ? 'checked' : ''}>
          <div class="task-name">
            ${toDo.name}
          </div>
        </div>
        <div class="to-do-right">
          <div class="due-time">
            ${timeString}
          </div >
    <div class="delete-button-container">
      <button class="delete-button js-delete-button">
        X
      </button>
    </div>
        </div >
      </li >
    `

    previousToDo = toDo;
  });

  toDoListElement.innerHTML = listHTML;

  // Add event listeners to delete button and checkboxes
  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        toDoList.splice(index, 1);
        renderList(filterType, displayType);
      });
    });

  document.querySelectorAll('.js-checkbox')
    .forEach((checkbox, index) => {
      checkbox.addEventListener('change', () => {
        toDoList[index].completed = checkbox.checked;

        const listItem = checkbox.closest('.to-do');
        listItem.classList.toggle('completed', checkbox.checked);

        saveToStorage();
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
}

function saveToStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function deleteAll() {
  toDoList = [];
  toDoListElement.innerHTML = '';
  localStorage.removeItem('toDoList');
}