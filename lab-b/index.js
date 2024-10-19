const getTasksFromStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];

const saveTasksToStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

const drawTasks = (tasks, query = '') => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed || false;
        checkbox.onchange = () => toggleTaskCompletion(index, checkbox.checked);
        listItem.appendChild(checkbox);

        const taskTextSpan = document.createElement('span');
        taskTextSpan.innerHTML = highlightSearchQuery(task.text, query);
        taskTextSpan.contentEditable = !task.completed;
        taskTextSpan.style.color = task.completed ? 'gray' : 'black';
        taskTextSpan.onblur = () => updateTask(index, taskTextSpan.innerText, task.date);
        listItem.appendChild(taskTextSpan);

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.date;
        dateInput.disabled = task.completed;
        dateInput.style.color = task.completed ? 'gray' : 'black';
        dateInput.onblur = () => updateTask(index, task.text, dateInput.value);
        listItem.appendChild(dateInput);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.onclick = () => deleteTask(index);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
};

const highlightSearchQuery = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

const addTask = () => {
    const taskText = document.getElementById('new-task').value.trim();
    const taskDate = document.getElementById('task-date').value;

    if (!taskText) {
        alert('Task name is required');
        return;
    }

    if (!taskDate) {
        alert('Task date is required');
        return;
    }

    if (taskText.length < 3 || taskText.length > 255) {
        alert('Task name must be between 3 and 255 characters');
        return;
    }

    if (new Date(taskDate) <= new Date()) {
        alert('You cannot set a task date in the past');
        return;
    }

    const task = { text: taskText, date: taskDate, completed: false };
    const tasks = getTasksFromStorage();
    const updatedTasks = [...tasks, task]

    saveTasksToStorage(updatedTasks);
    drawTasks(updatedTasks);
    document.getElementById('new-task').value = '';
    document.getElementById('task-date').value = '';
};

const updateTask = (index, newText, newDate) => {
    const tasks = getTasksFromStorage();

    if (!newText || !newDate) {
        alert('Task name and date cannot be empty');
        return;
    }

    if (new Date(newDate) <= new Date()) {
        alert('You cannot set a task date in the past');
        return;
    }

    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, text: newText, date: newDate } : task);
    saveTasksToStorage(updatedTasks);
    drawTasks(updatedTasks);
};

const deleteTask = (index) => {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.filter((_, i) => i !== index);
    saveTasksToStorage(updatedTasks);
    drawTasks(updatedTasks);
};

const toggleTaskCompletion = (index, isCompleted) => {
    const tasks = getTasksFromStorage();
    const updatedTasks = tasks.map((task, i) => i === index ? { ...task, completed: isCompleted } : task);
    saveTasksToStorage(updatedTasks);
    drawTasks(updatedTasks);
};

const searchTasks = () => {
    const query = document.getElementById('search').value.toLowerCase();
    const tasks = getTasksFromStorage();
    if (query.length < 2) {
        drawTasks(tasks);
        return;
    }
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(query));
    drawTasks(filteredTasks, query);
};

document.addEventListener('DOMContentLoaded', () => {
    const tasks = getTasksFromStorage();
    drawTasks(tasks);
    document.getElementById('add-task').addEventListener('click', addTask);
    document.getElementById('search').addEventListener('input', searchTasks);
});
