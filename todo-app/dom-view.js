import { getData, postData, deleteData, changeSaveData} from "./api.js";
import { getLocalData, saveLocalData, changeLocalData, deleteLocalData } from "./local.js";

let todoStorage = [];
let getTodoStorage;
let getTodoId = null;
let listName = null;
let changeStorage = null;
let getStorageState = null;
let storageName = null;

function createAppTittle(title) {
    let appTitle = document.createElement('h2')
    appTitle.innerHTML = title;
    return appTitle;
}

function keyStorageLoad(owner) {
   changeStorage = JSON.parse(localStorage.getItem('setStorage'));
   if(changeStorage == null) {
        localStorage.setItem('setStorage', JSON.stringify('local'));
        storageName = 'API'
   } 
   else if(changeStorage == 'local') { 
        getLocalData(owner);
        storageName = 'API';
    } 
   else if (changeStorage == 'api') { 
        getData();
        storageName = 'LocalStorage';
    }
   getStorageState = JSON.parse(localStorage.getItem('setStorage'));
}


function createToDoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    input.placeholder = 'Введите название нового дела';
    button.textContent = 'Добавить дело';


    button.setAttribute("disabled", "disabled");

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
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

function createTodoItem(name) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
        item, 
        doneButton,
        deleteButton,
        buttonGroup,
    }
}

const getLocalStorage = JSON.parse(localStorage.getItem('setStorage'));

export function renderTodo(object) {
    const deleteTodoList = document.querySelector('.list-group');
    if(deleteTodoList) deleteTodoList.replaceChildren();

    for(const values of object) {
        if(listName == values.owner) {
            const createListName = createTodoItem(values.name);
            if(values.done == true) { createListName.item.classList.add('list-group-item-dark'); } 
            else { createListName.item.classList.add('list-group-item-danger'); }
            todoList.append(createListName.item);
            createListName.buttonGroup.dataset.id = values.id;
            clickButtonEvent(createListName, values);
        }
    }
    return;
}

let todoList = createToDoList();

function clickButtonEvent(buttonElement, element) {
    buttonElement.doneButton.addEventListener('click', (e) => {
        element.done = true;
        getTodoId = e.target.parentNode.getAttribute("data-id");
        if(getLocalStorage == 'local') {
            changeLocalData(listName, element);
        } else if(getLocalStorage == 'api') {
            changeSaveData(getTodoId, element);
            getData();
        }
    });
    buttonElement.deleteButton.addEventListener('click', (e) => {
        getTodoId = e.target.parentNode.getAttribute("data-id");
        if(confirm('Вы уверены?')) {
            if(getLocalStorage == 'local') {
                deleteLocalData(listName, element);
            } else if(getLocalStorage == 'api') {
                deleteData(getTodoId);
            }
        }    
    });
}

function switchStorage() {
    const getLocalStorage = JSON.parse(localStorage.getItem('setStorage'));
    if(getLocalStorage == 'local') {
        localStorage.setItem('setStorage', JSON.stringify('api'));
        location.reload();
    } else if (getLocalStorage == 'api') {
        localStorage.setItem('setStorage', JSON.stringify('local'));
        location.reload();
    }
}

function createTodoApp(container, tittle = 'Список дел', keyName) { 

    listName = keyName;

    keyStorageLoad(listName);

    const todoAppTitle = createAppTittle(tittle);
    const todoItemForm = createToDoItemForm();
    const btnSetStorage = document.createElement('button');

    container.append(todoAppTitle);
    container.append(btnSetStorage);
    container.append(todoItemForm.form);
    container.append(todoList);

    btnSetStorage.textContent = 'Переключить на ' + storageName;

    btnSetStorage.addEventListener('click', () => { switchStorage(); });

    btnSetStorage.classList.add('btn', 'btn-warning', 'mr-3', 'mb-3');

    
    todoItemForm.input.addEventListener('input', function() {
        if(todoItemForm.input.value !== '') {
            todoItemForm.button.disabled = false;
        } else {
            todoItemForm.button.disabled = true;
        }
    });

    todoItemForm.form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if(!todoItemForm.input.value) { return; } 

        if(getStorageState == 'local') { saveLocalData(listName, todoItemForm.input.value); } 
            else if (getStorageState == 'api') {
                let todoObject = {
                    owner: listName,
                    name: todoItemForm.input.value,
                    done: false,
                }
                await postData(todoObject);
                await getData();
        }

        todoStorage = getTodoStorage;

        todoItemForm.input.value = '';
        todoItemForm.button.disabled = true;
    });

}

export { createTodoApp };