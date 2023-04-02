import { renderTodo } from "./dom-view.js";

export async function postData(object) {
    let response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object),
    });
}

export async function getData() {
    await fetch('http://localhost:3000/api/todos')
    .then((receive) => {
        return receive.json();
    })
    .then((data) => {
        renderTodo(data);
    });
}

export async function deleteData(id) {
    await fetch(`http://localhost:3000/api/todos/${id}`, {method: 'DELETE'});
    await getData();
}

export async function changeSaveData(id, object) {
    await fetch(`http://localhost:3000/api/todos/${id}`,  {
        method: 'PATCH',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    await getData();
}