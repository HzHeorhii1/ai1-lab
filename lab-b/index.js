const getTasksFromStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];
const saveTasksToStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

const highlightSearchQuery = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

const drawTasks = (tasks, query = '') => {
    const taskList = document.getElementById('task-list');
    const template = taskList.querySelector('.task-item');
    taskList.innerHTML = ''; // u need 2 clear it 
    tasks.forEach((task, index) => {
        const listItem = template.cloneNode(true);
        listItem.dataset.index = index;
        listItem.querySelector('.task-checkbox').checked = task.completed;
        listItem.querySelector('.task-text').innerHTML = highlightSearchQuery(task.text, query);
        listItem.querySelector('.task-text').contentEditable = !task.completed;
        listItem.querySelector('.task-date').value = task.date;
        listItem.querySelector('.task-date').disabled = task.completed;
        listItem.querySelector('.task-checkbox').addEventListener('change', (e) => {
            taskComplettion(index, e.target.checked);
        });
        listItem.querySelector('.task-text').addEventListener('blur', (e) => {
            updateTask(index, e.target.innerText, listItem.querySelector('.task-date').value);
        });
        listItem.querySelector('.task-date').addEventListener('blur', (e) => {
            updateTask(index, listItem.querySelector('.task-text').innerText, e.target.value);
        });
        listItem.querySelector('.delete-task').addEventListener('click', () => {
            deleteTask(index);
        });

        taskList.appendChild(listItem);
    });
};

const addTask = () => {
    const taskText = document.getElementById('new-task').value.trim();
    const taskDate = document.getElementById('task-date').value;

    if (!taskText) {
        alert('task name is required');
        return;
    }

    if (!taskDate) {
        alert('task date is required');
        return;
    }

    if (taskText.length < 3 || taskText.length > 255) {
        alert('task name must be between 3 and 255 characters');
        return;
    }

    const futereDataChecker = new Date(taskDate) <= new Date();

    if (futereDataChecker) {
        alert('u cannot set a task date in the past');
        return;
    }

    if (query.length < 2) {
        drawTasks(tasks);
        return;
    }

    const task = { text: taskText, date: taskDate, completed: false };
    const tasks = getTasksFromStorage();
    const updatedTasks = [...tasks, task];
    saveTasksToStorage(updatedTasks);
    drawTasks(updatedTasks);
    document.getElementById('new-task').value = '';
    document.getElementById('task-date').value = '';
};

const updateTask = (index, newText, newDate) => {
    const tasks = getTasksFromStorage();

    if (!newText || !newDate) {
        alert('task name and date can not be empty');
        return;
    }

    const futereDataChecker = new Date(taskDate) <= new Date();

    if (futereDataChecker) {
        alert('u cannot set a task date in the past');
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

const taskComplettion = (index, isCompleted) => {
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
