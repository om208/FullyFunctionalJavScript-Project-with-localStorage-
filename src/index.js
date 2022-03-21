import "../assets/css/style.css";

const app = document.getElementById("app");

app.innerHTML = `
  <div class="todos">
     <div class="todos-header">
       <h3 class="todos-title">Todo List</h3>
       <div>
        <p>You have <span class="todos-count"> </span>  items</p>
        <button class="todos-clear" style="display:none">Clear completed</button>
       </div>
     </div>

     <form class="todos-form" name="todos">
       <input type="text" id="input1" placeholder="what you want to add next?" name="todo">
     </form>

     <ul class="todos-list">
     </ul>
  </div>

`;

const form = document.forms.todos;
const input1 = form.elements.todo;
//
const root = document.querySelector(".todos");
const list = root.querySelector(".todos-list");
const count = root.querySelector(".todos-count");
const cler = root.querySelector(".todos-clear");

//      state management

let todos = [];

if (JSON.parse(localStorage.getItem("todos"))) {
  todos = JSON.parse(localStorage.getItem("todos"));
} else {
  todos = [];
}


//                                                                                                                                            console.log(todos.filter((todo)=>{todo.complet=== true ? true: false}));

//      add funcanality

// localStorage Funacality
function saveToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// render funcanality
function renderTodos(todos) {
  let todosString = ``;

  todos.forEach((todo, index) => {
    todosString += `
    <li id="${index}" ${todo.complet ? "class='todos-complete'" : ""}> 
      <input type="checkbox" ${todo.complet ? "checked" : " "}>
        <span>
          ${todo.label}
        </span>
        <button></button>
    </li>
    `;
  });
  list.innerHTML = todosString;

  const countNumber = todos.filter((todo) => {
    if (todo.complet === false) {
      return true;
    }
  });
  count.innerText = countNumber.length;

  cler.style.display = todos.filter((item, index) => item.complet === true)
    .length
    ? "block"
    : "none";
}

// for creat funcanality
function addTodo(event) {
  event.preventDefault();
  const label = input1.value.trim(); //                                                                                                   input1 is reference name of input tang whose name "todo"
  const complet = false;
  console.log((Boolean(label)));

  if(Boolean(label)===false){
    alert("Input box is empty! first fill it");
    return;
  }
  const todo = { label, complet };
  todos = [...todos, todo]; //                                                                                                         we get brand new array of needed information in immutable way
  // console.log(todos);

  input1.value = ""; //                                                                                                                this for after you submit entered input then input window clear
  renderTodos(todos); //                                                                                                              clearing the input window after submitting the field
  saveToStorage(todos);
}

// for update today chek funcanality
function updateTodo(event) {
  // console.dir(event.target);
  const id = Number(event.target.parentNode.getAttribute("id"));
  //                                                                                                                                 we get attribute in string format
  // console.log(id);

  todos = todos.map((todo, index) => {
    let complet = event.target.checked;
    if (id === index) {
      const updateTodo = { ...todo, complet: complet };
      //                                                                                                                                    old todos array are completly updated in unmutable way
      // console.log(updateTodo);
      return updateTodo;
    }
    return todo;
  });
  // console.log(todos);
  renderTodos(todos);
  saveToStorage(todos);
}

//delete list items
function deleteTodo(event) {
  if (event.target.nodeName !== "BUTTON") {
    return;
  } else {
    const id = Number(event.target.parentNode.getAttribute("id"));
    todos = todos.filter((todo, index) => index !== id);

    // console.log(todos);
    renderTodos(todos);
    saveToStorage(todos);
  }
}

// clerComple Todo
function clerCompleTodo() {
  if (todos.filter((item) => item.complet).length === 0) {
    return alert("first complet at least one task");
  }

  todos = todos.filter((todo) => !todo.complet);
  renderTodos(todos);
  saveToStorage(todos);
}

//  edit Todo label
function editTodo(event) {
  let itemsList = [...list.children];

  let num = false;

  let multiBox = itemsList.forEach((item) => {
    if(item.children.length === 4){
      console.log("*********another input box is open*********");
      return num=true;
    }
  });

  if (event.target.nodeName !== "SPAN") {
    return;
  }
  if(num === true){
    console.log("*********another input box is open*********");
    return ;
  }
  console.log(event.target);
  let id = Number(event.target.parentNode.getAttribute("id"));
  let todoLabel = todos[id].label;

  const input = document.createElement("input");
  input.type = "text";
  input.value = todoLabel;

  event.target.style.display = "none";
  event.target.parentNode.append(input);

  //function HandleLabel
  // function handleEdit(event){
  //   event.stopIPropagation()

  //   let label =this.value;
  //   if (label === todoLabel){
  //     return ;
  //   }
  //   todos = todos.map((todo,index)=>{
  //       if( index !== id ){                //if (label !== todoLabel) {

  //         todo = {...todo, label: label};
  //         console.log(todo);
  //         return todo;
  //       }
  //       return todo;
  //     });
  //   console.log(todos);
  //   renderTodos(todos);
  //   saveToStorage(todos);
  //   }

  //   input.addEventListener("change",handleEdit);
  // }

  function handleEdit(event) {
    event.stopPropagation();
    const label = this.value;
    if (label !== todoLabel) {
      todos = todos.map((todo, index) => {
        if (index === id) {
          return {
            ...todo,
            label: label,
          };
        }
        return todo;
      });
    }

    renderTodos(todos);
    saveToStorage(todos);
  }

  input.addEventListener("change", handleEdit);
}

//  init function main function
function init() {
  saveToStorage(todos);
  renderTodos(todos);

  form.addEventListener("submit", addTodo);
  list.addEventListener("change", updateTodo);
  list.addEventListener("click", deleteTodo);
  cler.addEventListener("click", clerCompleTodo);
  list.addEventListener("dblclick", editTodo);

  // console.log(todos.filter((todo)=>{todo.complet=== true ? true: false}));
}

//calling the init function

init();

