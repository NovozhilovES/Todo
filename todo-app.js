(function() {

    let todoStorage = [];
    let getTodoStorage;

    function createAppTittle(title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createToDoItemForm() {
        //создаем элементы формы и саму форму
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        //добавляем классы 
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        input.placeholder = 'Введите название нового дела';
        button.textContent = 'Добавить дело';
        //добавляем тег disable к кнопке
        button.setAttribute("disabled", "disabled");

        //вкладываем элементы друг в друга
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createToDoList() {
        //создаем элемент списка и присваиваем ему класс
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        //создаем элемент списка
        let item = document.createElement('li');

        //создаем кнопки
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');


        //доюавляем стили из бутстрап
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //вкладываем кнопки в отдельный див, а сам этот див вкладываем в элемент списка ли(айтем)
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item, 
            doneButton,
            deleteButton,
        }
    }

    function generationID(arr) { //создаем генератор ID
        let max = 0;
        for(const arrID of arr) {
            if(arrID.id >= max) max = arrID.id;
        }
        return max + 1;
    }

    function createDefoltTodo() {

        //let todoListDefoltName = createToDoList(); но если я вызываю ту же функцию в другой переменной, у меня ничего не работает.

        defoltTodo = [
            {name: 'Сходить в магазин', done: true,},
            {name: 'Погулять с собакой', done: false,},
        ];

        for(const values of defoltTodo) {
            let defoltListColor = createTodoItem(values.name);
            if(values.done == true) {
                defoltListColor.item.classList.add('list-group-item-dark');
            } else {
                defoltListColor.item.classList.add('list-group-item-danger');
            }
            todoList.append(defoltListColor.item);//здесь у меня было todoListDefoltName.append(defoltListColor.item) и это не срабатывало
        }
        return;
    }

    function checkContent() {
        for(const row of getTodoStorage) {
            let StorageList = createTodoItem(row.name);
            if(row.done == true) {
                StorageList.item.classList.add('list-group-item-dark');
            } else {
                StorageList.item.classList.add('list-group-item-danger');
            }
            todoList.append(StorageList.item);
            StorageList.doneButton.addEventListener('click', function() {
                StorageList.item.classList.add('list-group-item-dark');
                row.done = true;
                localStorage.setItem(listName, JSON.stringify(getTodoStorage));
            });
            StorageList.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    StorageList.item.remove();
                    getTodoStorage = getTodoStorage.filter(value => value.id !== row.id);
                    localStorage.setItem(listName, JSON.stringify(getTodoStorage));
                }
            });
        }
        return;
    }

    function writeTodoGet() {
        getTodoStorage = JSON.parse(localStorage.getItem(listName));
        if(getTodoStorage !== null) {
            checkContent();
        } else {
            getTodoStorage = [];
        }
        return;
    }

    let todoList = createToDoList();// эта переменная была раньше в функции createTodoApp, я же обьявил ее глобальной что бы использовать в функции createDefoltTodo

    function createTodoApp(container, tittle = 'Список дел', keyName) { 

        listName = keyName;
        
        //вызываем 3 фунции созданные сверху
        let todoAppTitle = createAppTittle(tittle);
        let todoItemForm = createToDoItemForm();
        createDefoltTodo();
        writeTodoGet();

        //добавляем в div с классом container
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        
        todoItemForm.input.addEventListener('input', function() {
            if(todoItemForm.input.value !== '') {
                todoItemForm.button.disabled = false;
            } else {
                todoItemForm.button.disabled = true;
            }
        });

        //вешаем обработчик собатия сабмит, что бы при нажатию на ентер или кнопку браузер передавал данные 
        todoItemForm.form.addEventListener('submit', function(e) {
            //убираем стандартную отправку данных и перезагрузку страницы
            e.preventDefault();
            //проверяем, есть ли какое либо значение внутри инпута 
            if(!todoItemForm.input.value) {
                return;
            } 

            let todoItem = createTodoItem(todoItemForm.input.value);

            todoStorage = getTodoStorage;
            let todoObject = {
                id: generationID(todoStorage),
                name: todoItemForm.input.value,
                done: false,
            }

            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.add('list-group-item-dark');
                todoObject.done = true;
                localStorage.setItem(listName, JSON.stringify(todoStorage));
            });
            todoItem.deleteButton.addEventListener('click', function() {
                if(confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    todoStorage = todoStorage.filter(value => value.id !== todoObject.id);
                    localStorage.setItem(listName, JSON.stringify(todoStorage));
                }
            });

            todoStorage.push(todoObject);
            //записываем полученный массив из localstorage в массив, в который будем добавлять новое дело в конец
            localStorage.setItem(listName, JSON.stringify(todoStorage));
            //добавляем элемент в список
            todoList.append(todoItem.item);
            //после добавления дела обнуляем значение инпута, что бы не удалять в ручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }
    
    window.createTodoApp = createTodoApp;
})();