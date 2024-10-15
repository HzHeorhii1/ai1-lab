// f12 -> application -> localstorage
class Todo {

    constructor(){
        this.taskList = document.getElementById('task-list');
        this.searchInput = document.getElementById('search');
        document.addEventListener('DOMContentLoaded', loadTasks);
    }

    addTask = () => {
        const taskText = document.getElementById('new-task').value.trim();
        const taskDate = document.getElementById('task-date').value;
        const lengthValidation = taskText.length < 3 || taskText.length > 255;
        if(lengthValidation) { alert('min 3, max 255 characters'); return; }
        const task = {
            text: taskText,
            date: taskDate || ''
        };
        saveTask(task);
        document.getElementById('new-task').value = '';
        document.getElementById('task-date').value = '';
    }

    saveTask = () => {
        const tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }

    getTasksFromStorage = () => {
        const tasks = localStorage.getItem('tasks');
        return JSON.parse(tasks) || [];
    }

    renderTasks = (tasks) => {
        taskList.innerHTML = '';

        // decompose this!!!!!!!!!!!!!!!!!!!!

        for (const [index, task] of tasks.entries()) {
            const listItem = document.createElement('li');
            listItem.className = 'task-item';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.onblur = () => updateTask(index, input.value, task.date);
            input.onfocus = () => input.select();
            listItem.appendChild(input);

            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.value = task.date;
            dateInput.onblur = () => updateTask(index, task.text, dateInput.value);
            listItem.appendChild(dateInput);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️';
            deleteButton.onclick = () => deleteTask(index);
            listItem.appendChild(deleteButton);

            taskList.appendChild(listItem);
        }
    }
}