class ToDo {
    constructor() {
        const savedTasks = localStorage.getItem('savedData');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : []; //tablica zadań (pusta gdy nie ma nic w pamięci)
        this.searchField = ''; //zawartość pola wyszukiwarki
    }
    save() {
        localStorage.setItem('savedData', JSON.stringify(this.tasks)); //serializacja i zapis listy zadań
    }
    getSearchRes() {
        if (this.searchField.length >= 2) { //co najmniej 2 znaki
            const lowercase = this.searchField.toLowerCase(); //zamiana na małe litery
            return this.tasks.filter(t => t.name.toLowerCase().includes(lowercase)); //filtrowanie zadań by wybrać te zgodne z wyszukaniem
        }
        return this.tasks;
    }
    draw() {
        const container = document.getElementById('container');
        container.innerHTML = ''; //zawartość do wyświetlenia
        const tasksToDraw = this.getSearchRes();
        tasksToDraw.forEach(task => {
            const div = document.createElement('div'); //div z zadaniem
            div.className = 'entry';
            const checkbox = document.createElement('input'); //checkbox w divie
            checkbox.type = 'checkbox';
            checkbox.className = 'check';
            div.appendChild(checkbox); //dodany w środku diva
            const par = document.createElement('p'); //paragraf z nazwą zadania
            par.className = 'name';
            let displayText = task.name;
            if (this.searchField.length >= 2) {
                const regex = new RegExp(`(${this.searchField})`, 'gi');
                displayText = task.name.replace(regex, '<mark>$1</mark>'); //wyszukanie regexem i nałożenie żółtego oznaczenia na pasujący tekst
            }
            par.innerHTML = displayText;
            par.onclick = () => this.editMode(par, task, 'name'); //po kliknięciu na nazwę zadania można ją edytować
            div.appendChild(par);
            const date = document.createElement('p');
            date.className = 'date';
            date.textContent = task.date ? task.date : 'Nie podano daty.';
            date.onclick = () => this.editMode(date, task, 'date');
            div.appendChild(date);
            const xButton = document.createElement('button');
            xButton.className = 'delete';
            xButton.textContent = 'X';
            xButton.onclick = () => this.remove(task.id);
            div.appendChild(xButton);
            container.appendChild(div);
        });
    }

    add(name, date) {
        if (name.length < 3 || name.length > 255) {
            alert('Nazwa zadania musi mieć od 3 do 255 znaków');
            return;
        }
        if (date) {
            const taskDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (taskDate <= today) {
                alert('Data nie może być w przeszłości');
                return;
            }
        }
        this.tasks.push({
            id: Math.floor(Math.random() * 1000000), //losowe id z przedziału od 0 do 999999, szansa na duplikaty jest niska
            name: name,
            date: date
        });
        this.save();
        this.draw();
    }
    remove(id) {
        this.tasks = this.tasks.filter(t => t.id !== id); //filtr pozostawia tylko te zadania, których id nie zostało wybrane do usunięcia
        this.save();
        this.draw();
    }
    editMode(toEdit, task, type) {
        const input = document.createElement('input');
        if (type === 'name') {
            input.type = 'text';
            input.value = task.name;
        } else {
            input.type = 'date';
            input.value = task.date || '';
        }
        toEdit.replaceWith(input);
        input.onblur = () => { //onblur wywołuje się gdy input straci fokus
            let validation = true;
            if (type === 'name') {
                if (input.value.length >= 3 && input.value.length <= 255) {
                    task.name = input.value;
                } else {
                    alert('Nazwa zadania musi mieć od 3 do 255 znaków');
                    validation = false;
                }
            } else {
                if (!input.value || new Date(input.value) > new Date(new Date().setHours(0,0,0,0))) {
                    task.date = input.value;
                } else {
                    alert('Data nie może być w przeszłości');
                    validation = false;
                }
            }
            if (validation){
                this.save();
            }
            this.draw();
        };
        input.focus();
    }
    search(toSearch) {
        this.searchField = toSearch;
        this.draw();
    }
}
document.todo = new ToDo();
document.addEventListener('DOMContentLoaded', () => { //DOMContentLoaded wywołuje się gdy cały HTML się załaduje
    document.todo.draw();
    document.getElementById('addButton').addEventListener('click', () => { //przycisk do dodania zadania
        const nameInput = document.getElementById('addName');
        const dateInput = document.getElementById('addDate');
        document.todo.add(nameInput.value, dateInput.value);
        nameInput.value = '';
        dateInput.value = '';
    });
    document.getElementById('search').addEventListener('input', (e) => { //wyszukiwanie
        document.todo.search(e.target.value);
    });
});