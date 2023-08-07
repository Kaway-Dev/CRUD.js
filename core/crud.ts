import fs from "fs"; //ES6
import { v4 as uuid } from 'uuid';
// const fs = require("fs"); - CommonJS
const DB_FILE_PATH = ".\core\db";

console.log('[CRUD]');

type UUID = string;

interface Todo {
    id: UUID;
    date: string;
    content: string
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = { 
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Array<Todo> = [
        ...read(),
        todo,
    ];

    //Salvar o content no sistema
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
        dogs: [],
    }, null, 2));
    return todo;
}

function read (): Array<Todo> {
    const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const db = JSON.parse(dbString || "{}");
    if(!db.todos) { //Fail Fast Validations
        return [];
    }

    return db.todos;
}

function update (id: UUID, partialTodo: Partial<Todo>): Todo {
    let updateTodo;
    const todos = read();
    todos.forEach((curretTodo) => {
        const isToUpdate = curretTodo.id === id;
        if(isToUpdate) {
            updateTodo = Object.assign(curretTodo, partialTodo );
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2));

    if(!updateTodo) {
        throw new Error("Please, provide another ID!")
    }
    return updateTodo;
}

function updateContentById(id: UUID, content: string): Todo {
    return update(id, {
        content,
    });
}

function deleteById(id: UUID) {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if(id === todo.id) {
            return false;
        }
        return true;
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne,
    }, null, 2));
}

function CLEAR_DB() {
    fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
CLEAR_DB();
create("Primeiro TODO");
const secordTodo = create("Segunda TODO");
deleteById(secordTodo.id);
const thirdTodo = create("Terceira TODO");
// update(thirdTodo.id, {
//     content: "Atualizada!",
//     done: true,
// });
updateContentById(thirdTodo.id, "Atualizada");
const todos = read();
console.log(todos);
console.log(todos.length);