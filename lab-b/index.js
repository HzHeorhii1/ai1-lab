class Todo {
    constructor() {
        this.taskList = document.getElementById('task-list');
        this.searchInput = document.getElementById('search');
        document.addEventListener('DOMContentLoaded', () => this.loadTasks());
        document.querySelector('button').addEventListener('click', () => this.addTask());

        this.searchInput.addEventListener('input', () => this.searchTasks());
    }

    addTask = () => {
        const taskText = document.getElementById('new-task').value.trim();
        const taskDate = document.getElementById('task-date').value;

        // Валідація: довжина тексту і дата
        if (taskText.length < 3 || taskText.length > 255) {
            alert('min 3, max 255 characters');
            return;
        }

        // Перевірка дати: дата повинна бути або порожня, або в майбутньому
        if (taskDate && new Date(taskDate) <= new Date()) {
            alert('Дата повинна бути або порожня, або в майбутньому!');
            return;
        }

        const task = {
            text: taskText,
            date: taskDate || ''
        };
        this.saveTask(task);
        document.getElementById('new-task').value = '';
        document.getElementById('task-date').value = '';
    }

    saveTask = (task) => {
        const tasks = this.getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.renderTasks(tasks);
    }

    getTasksFromStorage = () => {
        const tasks = localStorage.getItem('tasks');
        return JSON.parse(tasks) || [];
    }

    renderTasks = (tasks, query = '') => {
        this.taskList.innerHTML = '';

        for (const [index, task] of tasks.entries()) {
            const listItem = document.createElement('li');
            listItem.className = 'task-item';

            const taskTextSpan = document.createElement('span');
            taskTextSpan.innerHTML = this.highlightSearchQuery(task.text, query);
            taskTextSpan.contentEditable = true;
            taskTextSpan.onblur = () => this.updateTask(index, taskTextSpan.innerText, task.date);
            taskTextSpan.onfocus = () => taskTextSpan.select();
            listItem.appendChild(taskTextSpan);

            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.value = task.date;
            dateInput.onblur = () => this.updateTask(index, task.text, dateInput.value);
            listItem.appendChild(dateInput);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️';
            deleteButton.onclick = () => this.deleteTask(index);
            listItem.appendChild(deleteButton);

            this.taskList.appendChild(listItem);
        }
    }

    updateTask = (index, newText, newDate) => {
        const tasks = this.getTasksFromStorage();

        // Перевірка дати перед оновленням
        if (newDate && new Date(newDate) <= new Date()) {
            alert('Дата повинна бути або порожня, або в майбутньому!');
            return;
        }

        tasks[index] = { text: newText, date: newDate };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.renderTasks(tasks);
    }

    deleteTask = (index) => {
        const tasks = this.getTasksFromStorage();
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        this.renderTasks(tasks);
    }

    loadTasks = () => {
        const tasks = this.getTasksFromStorage();
        this.renderTasks(tasks);
    }

    searchTasks = () => {
        const query = this.searchInput.value.toLowerCase();
        if (query.length < 2) {
            this.renderTasks(this.getTasksFromStorage());
            return;
        }

        const filteredTasks = this.getTasksFromStorage().filter(task =>
            task.text.toLowerCase().includes(query)
        );

        this.renderTasks(filteredTasks, query);
    }

    highlightSearchQuery = (text, query) => {
        if (!query) return text; // Якщо немає пошукового запиту, не виділяємо

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>'); // Виділення <mark>
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Todo();
});
