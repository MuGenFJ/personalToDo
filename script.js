const alert = document.querySelector('.alert'); //message d'alert quand mise a jour
const form = document.querySelector('.grocery-form'); //le forumlaire sans la liste
const grocery = document.getElementById('grocery'); //is the input from user
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container'); //container the mes tasks avec les buttons delete
const list = document.querySelector('.grocery-list'); //la list de mes tasks uniquement sans les btn delete
const clearBtn = document.querySelector('.clear-btn');

//edit option
let editElement;
let editFlag = false;
let editID = "";

// ##### EVENT LISTENER #####

//submit form
form.addEventListener('submit', addItem)
//clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// ##### FUNCTIONS #####

//addItem
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        createListItem(id, value);
        //display alert
        displayAlert("add is done", "success");
        //show container
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id,value);
        // set back to default
        setBackToDefault()
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert("edit done", "success");
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
        }
    else {
        displayAlert("enter value please", "danger")
    }
}

//display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    setTimeout(function (){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)  
    }, 1000)
}

//clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    if(items.length > 0) {
        items.forEach(function(item){
            list.removeChild(item)
        });
    }// when the if condition above is done, 
    container.classList.remove('show-container');
    displayAlert('Successfully removed', "success"); 
    setBackToDefault();
    localStorage.removeItem("list");
}

// delete function
function deleteItem(e){
   const currentArticleTasks = e.currentTarget.parentElement.parentElement
   const currentArticleTasksID = currentArticleTasks.dataset.id
    list.removeChild(currentArticleTasks);
    if(list.children.length == 0){
        container.classList.remove("show-container");
    }
    displayAlert('task removed', "success");
    setBackToDefault()
    // remove from local storage
    removeFromLocalStorage(currentArticleTasksID);
}

// edit function
function editItem(e){
    const currentArticleTasks = e.currentTarget.parentElement.parentElement
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling; //va me donner <p> avec le title du current task selected
    // set form value
    grocery.value = editElement.innerHTML
    editFlag = true
    editID = currentArticleTasks.dataset.id
    submitBtn.textContent = "edit"
}

//set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = '';
    submitBtn.textContent = "submit";
}

// ##### LOCAL STORAGE #####
function addToLocalStorage(id,value){
    const grocery = {id, value};
    let items = getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items))

}

function removeFromLocalStorage(id){
    let items = getLocalStorage(); // either go get the entire actual list or the empty array

    items = items.filter(function (item){
        if(item.id !==id){ //si l'id du item de la localStorage ne match pas avec l'id du item qu'on a select en appuyant sur la corbeille alors retourne le visible
        return item
     }
    })
    localStorage.setItem('list', JSON.stringify(items)) // apres avoir filter set la nouvelle list
}

function editLocalStorage(id, value){
    let items = getLocalStorage();

    items = items.map(function (item){
        if(item.id === id){ //si le l'id the item du localStorage match au id de celui qu'on select on appuyant sur le edit btn alors la valeur de cette item du localStorage sera la meme value que celle qu'on va marque sur le  user input(value)
            item.value = value;
        }
        return item // si il ne match pas juste return la item
    })
    localStorage.setItem('list', JSON.stringify(items)) // apres avoir filter set la nouvelle list
}

function getLocalStorage (){
   return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

// ##### WHEN THE PAGE IS LOADED #####
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function (item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container');
    }
}

function createListItem(id, value){
    const element = document.createElement('article')
    //add class
    element.classList.add('grocery-item')
    //add id
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    //append child
    list.appendChild(element);
}

