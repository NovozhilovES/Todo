import { renderTodo } from "./dom-view.js";

let localArray = [];

export function generationID(arr) { //создаем генератор ID
    let max = 0;
    for(const arrID of arr) {
        if(arrID.id >= max) max = arrID.id;
    }
    return max + 1;
}

export function saveLocalData(key, todoName) {

    let todoObjectStorage = {
        id: generationID(localArray),
        owner: key,
        name: todoName,
        done: false,
    }
    if(localArray.length !== 0) {
        localArray = JSON.parse(localStorage.getItem(key));
    }
    localArray.push(todoObjectStorage);
    localStorage.setItem(key, JSON.stringify(localArray));
    getLocalData(key);
}

export function getLocalData(nameOwner) {
    const getLocalStorage = JSON.parse(localStorage.getItem(nameOwner));
    if(getLocalStorage == null) {
        return;
    } else {
        localArray = getLocalStorage;
        renderTodo(getLocalStorage);
    }
}

export function changeLocalData(key, changeClick) {
    const getLocalStorage = JSON.parse(localStorage.getItem(key));

    for (const key of getLocalStorage) { if(changeClick.id == key.id) { key.done = true; } }
    localStorage.setItem(key, JSON.stringify(getLocalStorage));
    getLocalData(key);
}

export function deleteLocalData(key, deleteObject) {
    let getLocalStorage = JSON.parse(localStorage.getItem(key));
    const saveStorage = getLocalStorage.filter(e => e.id !== deleteObject.id);
    localStorage.setItem(key, JSON.stringify(saveStorage));
    getLocalData(key);
}