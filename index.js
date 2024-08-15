let editingTask = null;

window.onload = function() {
    loadTasks();

const taskInput = document.getElementById("taskInput");
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {  
            addTask();  
        }
    });
}
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const taskText = li.querySelector('.task-text').textContent;
        const isChecked = li.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed: isChecked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(taskText, isChecked = false) {
    const taskList = document.getElementById("taskList");

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <div class="d-flex align-items-center">
            <input type="checkbox" class="me-2" ${isChecked ? 'checked' : ''} onchange="toggleTaskCompletion(this)">
            <span class="task-text ${isChecked ? 'text-decoration-line-through' : ''}">${taskText}</span>
        </div>
        <div>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">Delete</button>
            <button class="btn btn-sm btn-outline-dark btn-warning me-1" onclick="copyTask(this)">Copy</button>
            <button class="btn btn-sm btn-outline-dark btn-warning me-1" onclick="editTask(this)">Edit</button>
            <button class="btn btn-sm btn-outline-dark btn-warning me-1" onclick="moveUp(this)">Up</button>
            <button class="btn btn-sm btn-outline-dark btn-warning me-1" onclick="moveDown(this)">Down</button>
        </div>
    `;

    taskList.appendChild(li);
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    showNotification("Task added successfully!");

    if (taskText === "") return;

    if (editingTask) {
        editingTask.querySelector('.task-text').textContent = taskText;
        editingTask = null;
        taskInput.value = "";
        document.querySelector('button[onclick="addTask()"]').textContent = 'Add Task';
        saveTasks();
        showNotification("Task edited successfully!");
        return;
    }

    createTaskElement(taskText);
    saveTasks();
    taskInput.value = "";
}

function editTask(button) {
    const li = button.parentNode.parentNode;
    const taskTextElement = li.querySelector('.task-text');
    const taskInput = document.getElementById("taskInput");

    taskInput.value = taskTextElement.textContent;
    editingTask = li;

    document.querySelector('button[onclick="addTask()"]').textContent = 'Save Task';
}

function copyTask(button) {
    const li = button.parentNode.parentNode;
    const taskText = li.querySelector('.task-text').textContent;
    createTaskElement(taskText);
    saveTasks();
}

function moveUp(button) {
    const li = button.parentNode.parentNode;
    const prevLi = li.previousElementSibling;

    if (prevLi) {
        li.parentNode.insertBefore(li, prevLi);
        saveTasks();
    }
}

function moveDown(button) {
    const li = button.parentNode.parentNode;
    const nextLi = li.nextElementSibling;

    if (nextLi) {
        li.parentNode.insertBefore(nextLi, li);
        saveTasks();
    }
}

function deleteTask(button) {
    if (confirm("Do you want to delete this text?")) {
        const li = button.parentNode.parentNode;
        li.remove();
        saveTasks();
        showNotification("Task deleted successfully!");
    }
}

function toggleTaskCompletion(checkbox) {
    const taskText = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskText.classList.add('text-decoration-line-through');
    } else {
        taskText.classList.remove('text-decoration-line-through');
    }
    saveTasks();
}

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.remove("d-none");
    
    setTimeout(() => {
        notification.classList.add("d-none");
    }, 1500);
}