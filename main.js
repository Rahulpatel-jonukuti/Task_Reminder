// Get references to DOM elements
const todoInput = document.getElementById('todoInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList = document.getElementById('todoList');
const emptyListMessage = document.getElementById('emptyListMessage');

// Array to store to-do items. Each item can now have a 'subtasks' array.
let todos = [];

// Function to render the to-do list
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const noTasksMessage = document.getElementById('noTasksMessage');
    todoList.innerHTML = '';

    if (todos.length === 0) {
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';

        // Iterate over the todos array and create list items for main tasks
        todos.forEach((todo, mainIndex) => {
            const todoItem = document.createElement('div');
            todoItem.className = `bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition duration-200 ease-in-out mb-3 p-4`;

            // Main task display
            todoItem.innerHTML = `
                <div class="flex items-center justify-between pb-2 ${todo.completed ? 'opacity-60 line-through' : ''}">
                    <span class="text-gray-800 text-base font-medium flex-grow cursor-pointer" data-main-index="${mainIndex}" data-type="main-task-text">${todo.text}</span>
                    <div class="flex space-x-2 ml-4">
                        <button class="toggle-complete-btn p-2 rounded-full hover:bg-green-200 transition duration-200" data-main-index="${mainIndex}" data-type="main-task-toggle" title="Toggle Complete">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${todo.completed ? 'text-green-600' : 'text-gray-400'}" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button class="edit-btn p-2 rounded-full hover:bg-yellow-200 transition duration-200" data-main-index="${mainIndex}" data-type="main-task-edit" title="Edit Task">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                            </svg>
                        </button>
                        <button class="delete-btn p-2 rounded-full hover:bg-red-200 transition duration-200" data-main-index="${mainIndex}" data-type="main-task-delete" title="Delete Task">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 3a1 1 0 100 2H8a1 1 0 100-2h5z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- Subtask input and button -->
                <div class="flex items-center mt-2 pl-6">
                    <input
                        type="text"
                        placeholder="Add subtask..."
                        class="subtask-input flex-grow p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 transition duration-200 shadow-sm"
                        data-main-index="${mainIndex}"
                    />
                    <button
                        class="add-subtask-btn bg-purple-500 text-white p-2 ml-2 rounded-lg text-sm shadow-md hover:bg-purple-600 transition duration-300 transform hover:scale-105"
                        data-main-index="${mainIndex}"
                    >
                        Add Subtask
                    </button>
                </div>
                <div class="subtasks-list mt-2 space-y-2 pl-6">
                    <!-- Subtasks will be dynamically added here -->
                </div>
            `;
            todoList.appendChild(todoItem);

            // Render subtasks for the current main task
            const subtasksListContainer = todoItem.querySelector('.subtasks-list');
            todo.subtasks.forEach((subtask, subIndex) => {
                const subtaskItem = document.createElement('div');
                subtaskItem.className = `flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-md shadow-xs
                                          ${subtask.completed ? 'opacity-60 line-through bg-green-100' : 'hover:bg-gray-200'}`;
                subtaskItem.innerHTML = `
                    <span class="text-gray-700 text-sm flex-grow cursor-pointer" data-main-index="${mainIndex}" data-sub-index="${subIndex}" data-type="sub-task-text">${subtask.text}</span>
                    <div class="flex space-x-1 ml-4">
                        <button class="toggle-complete-subtask-btn p-1 rounded-full hover:bg-green-200 transition duration-200" data-main-index="${mainIndex}" data-sub-index="${subIndex}" title="Toggle Subtask Complete">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${subtask.completed ? 'text-green-600' : 'text-gray-400'}" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button class="edit-subtask-btn p-1 rounded-full hover:bg-yellow-200 transition duration-200" data-main-index="${mainIndex}" data-sub-index="${subIndex}" title="Edit Subtask">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                            </svg>
                        </button>
                        <button class="delete-subtask-btn p-1 rounded-full hover:bg-red-200 transition duration-200" data-main-index="${mainIndex}" data-sub-index="${subIndex}" title="Delete Subtask">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 3a1 1 0 100 2H8a1 1 0 100-2h5z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                `;
                subtasksListContainer.appendChild(subtaskItem);
            });
        });
    }
}

// Function to add a new main to-do item
function addTodo() {
    const taskText = todoInput.value.trim();
    if (taskText !== '') {
        todos.push({ text: taskText, completed: false, subtasks: [] });
        todoInput.value = '';
        renderTodos();
        todoInput.focus(); // Refocus input
    }
}

// Function to add a new sub-task to a specific main task
function addSubtask(mainIndex, subtaskInput) {
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        todos[mainIndex].subtasks.push({ text: subtaskText, completed: false });
        subtaskInput.value = '';
        renderTodos();
        subtaskInput.focus(); // Refocus subtask input
    }
}

// Function to toggle the completion status of a main to-do item
function toggleComplete(mainIndex) {
    todos[mainIndex].completed = !todos[mainIndex].completed;
    renderTodos();
}

// Function to toggle the completion status of a sub-task
function toggleCompleteSubtask(mainIndex, subIndex) {
    todos[mainIndex].subtasks[subIndex].completed = !todos[mainIndex].subtasks[subIndex].completed;
    renderTodos();
}

// Function to edit a main to-do item
function editTodo(mainIndex) {
    const newText = prompt('Edit main task:', todos[mainIndex].text);
    if (newText !== null && newText.trim() !== '') {
        todos[mainIndex].text = newText.trim();
        renderTodos();
    }
}

// Function to edit a sub-task
function editSubtask(mainIndex, subIndex) {
    const newText = prompt('Edit subtask:', todos[mainIndex].subtasks[subIndex].text);
    if (newText !== null && newText.trim() !== '') {
        todos[mainIndex].subtasks[subIndex].text = newText.trim();
        renderTodos();
    }
}

// Function to delete a main to-do item
function deleteTodo(mainIndex) {
    showConfirmationModal('Are you sure you want to delete this main task and all its subtasks?', () => {
        todos.splice(mainIndex, 1); // Remove the main item from the array
        renderTodos(); // Re-render the list
    });
}

// Function to delete a sub-task
function deleteSubtask(mainIndex, subIndex) {
    showConfirmationModal('Are you sure you want to delete this subtask?', () => {
        todos[mainIndex].subtasks.splice(subIndex, 1); // Remove the subtask
        renderTodos(); // Re-render the list
    });
}

// Event Listeners for main task input
addTaskBtn.addEventListener('click', function() {
    const todoInput = document.getElementById('todoInput');
    const taskText = todoInput.value.trim();

    if (taskText === '') {
        alert('Please add a task before submitting.');
        return;
    }

    // Add the new task to your todos array and re-render
    todos.push({ text: taskText, completed: false, subtasks: [] });
    todoInput.value = '';
    renderTodos();
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Event delegation for all buttons and task text within the todoList
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const button = target.closest('button');
    const span = target.closest('span');

    if (button) {
        const mainIndex = parseInt(button.dataset.mainIndex);
        const subIndex = button.dataset.subIndex ? parseInt(button.dataset.subIndex) : undefined;
        const type = button.dataset.type; // e.g., 'main-task-toggle', 'main-task-edit'

        if (button.classList.contains('add-subtask-btn')) {
            // Find the corresponding subtask input field
            const subtaskInput = button.previousElementSibling;
            if (subtaskInput && subtaskInput.classList.contains('subtask-input')) {
                addSubtask(mainIndex, subtaskInput);
            }
        } else if (button.classList.contains('toggle-complete-btn') && type === 'main-task-toggle') {
            toggleComplete(mainIndex);
        } else if (button.classList.contains('edit-btn') && type === 'main-task-edit') {
            editTodo(mainIndex);
        } else if (button.classList.contains('delete-btn') && type === 'main-task-delete') {
            deleteTodo(mainIndex);
        } else if (button.classList.contains('toggle-complete-subtask-btn')) {
            toggleCompleteSubtask(mainIndex, subIndex);
        } else if (button.classList.contains('edit-subtask-btn')) {
            editSubtask(mainIndex, subIndex);
        } else if (button.classList.contains('delete-subtask-btn')) {
            deleteSubtask(mainIndex, subIndex);
        }
    } else if (span) {
        const mainIndex = parseInt(span.dataset.mainIndex);
        const subIndex = span.dataset.subIndex ? parseInt(span.dataset.subIndex) : undefined;
        const type = span.dataset.type;

        if (type === 'main-task-text') {
            toggleComplete(mainIndex);
        } else if (type === 'sub-task-text') {
            toggleCompleteSubtask(mainIndex, subIndex);
        }
    }
});

// Event listener for subtask input fields (Enter key)
todoList.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('subtask-input')) {
        const mainIndex = parseInt(e.target.dataset.mainIndex);
        addSubtask(mainIndex, e.target);
    }
});

// --- Custom Confirmation Modal ---
function showConfirmationModal(message, onConfirm) {
    const modalId = 'customConfirmModal';
    let modal = document.getElementById(modalId);

    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-out opacity-0';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform -translate-y-4 transition-transform duration-300 ease-out">
                <p class="text-lg font-semibold text-gray-800 mb-4" id="modalMessage"></p>
                <div class="flex justify-end space-x-3">
                    <button id="cancelBtn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">Cancel</button>
                    <button id="confirmBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listeners for modal buttons
        document.getElementById('cancelBtn').addEventListener('click', () => {
            hideConfirmationModal(modal);
        });
        document.getElementById('confirmBtn').addEventListener('click', () => {
            onConfirm();
            hideConfirmationModal(modal);
        });
    }

    document.getElementById('modalMessage').textContent = message;
    modal.classList.remove('opacity-0');
    modal.querySelector('div').classList.remove('-translate-y-4');
}

function hideConfirmationModal(modal) {
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.add('-translate-y-4');
    modal.addEventListener('transitionend', () => {
        if (modal.classList.contains('opacity-0')) {
            modal.remove(); // Remove modal from DOM after transition
        }
    }, { once: true });
}

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', renderTodos);
