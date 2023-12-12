let listIdCounter = 1;
let todoIdCounter = 1;
let selectedListId = '';

function addList() {
    const listNameInput = document.getElementById('listName');
    const listTagInput = document.getElementById('listTags');
    const listColor = document.getElementById('listColor');
    const listName = listNameInput.value.trim(); // trim : boşlukları yok eder.
    const listTags = listTagInput.value.trim();
    const listColorValue = listColor.value;

    if (listName !== '') {
        const table = document.getElementById('listTable');
        const row = table.insertRow(-1); // -1 : yeni satır tablonun sonuna gönderilir.

        const cellListId = row.insertCell(0);
        const cellListName = row.insertCell(1);
        const cellListTags = row.insertCell(2);
        const cellColor = row.insertCell(3);
        const cellListAction = row.insertCell(4);

        cellListId.innerHTML = listIdCounter++;
        cellListName.innerHTML = listName;
        cellListTags.innerHTML = listTags;
        cellColor.style.backgroundColor = listColorValue; 
        cellListAction.innerHTML = '<button onclick="deleteList(this)">Delete</button>';

        
        updateListSelector('listSelector');
        updateListSelector('listSelectorV2');
        applyFilters();

        listNameInput.value = '';
        listTagInput.value = '';
        listColor.value = GetRandomColor();
    }
}

// renk değişimi.


function GetRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var colorLength = 6;
    for (var i = 0; i < colorLength; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function deleteList(button) {
    const row = button.parentNode.parentNode;
    const listIdToDelete = row.cells[0].innerHTML; // [0]

    deleteTodosByListId(listIdToDelete);

    row.parentNode.removeChild(row);

    updateListSelector('listSelector');
    updateListSelector('listSelectorV2');

    
    selectedListId = '';

    updateTodoTable();
}


function updateListSelector(targetSelectorId) {
    const listSelector = document.getElementById(targetSelectorId);
    const listTable = document.getElementById('listTable');

    listSelector.innerHTML = '';

    if (targetSelectorId === 'listSelector') {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'Select a list';
        listSelector.add(defaultOption);
    }
    else if (targetSelectorId === 'listSelectorV2') {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = 'All lists';
        listSelector.add(defaultOption);
    }

    for (let i = 1; i < listTable.rows.length; i++) {
        const listId = listTable.rows[i].cells[0].innerHTML;
        const listName = listTable.rows[i].cells[1].innerHTML;

        const option = document.createElement('option');
        option.value = listId;
        option.text = listName;

        listSelector.add(option);
    }
}


function addTodo() {
    const taskInput = document.getElementById('todoTask');
    const listSelector = document.getElementById('listSelector');

    const task = taskInput.value.trim();
    const listId = listSelector.value;

    if (task !== '' && listId !== '') {
        const table = document.getElementById('todoTable');
        const row = table.insertRow(-1);

        const cellTodoId = row.insertCell(0);
        const cellListId = row.insertCell(1);
        const cellTask = row.insertCell(2);
        const cellStatus = row.insertCell(3);
        const cellTodoAction = row.insertCell(4);

        cellTodoId.innerHTML = todoIdCounter++;
        cellListId.innerHTML = listId;
        cellTask.innerHTML = task;
        cellStatus.innerHTML = `<select id="todoStatus" required>
        <option value="0" selected>New</option>
        <option value="1">In progress</option>
        <option value="2">Completed</option>
    </select>`;
        cellTodoAction.innerHTML = '<button onclick="deleteTodo(this)">Delete</button> ' +
            '<button onclick="updateTodo(this)">Update</button>';

        console.log(cellStatus.innerHTML);
        taskInput.value = '';
        listSelector.value = '';
    }

    applyFilters();
}

function deleteTodo(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function updateTodo(button) {
    const row = button.parentNode.parentNode;
    const taskCell = row.cells[2];
    const newTask = prompt('Update task:', taskCell.innerHTML);

    if (newTask !== null) {
        taskCell.innerHTML = newTask;
    }
}

function deleteTodosByListId(listId) {
    const todoTable = document.getElementById('todoTable');
    const rowsToDelete = [];

    for (let i = 1; i < todoTable.rows.length; i++) {
        const todoListId = todoTable.rows[i].cells[1].innerHTML;

        if (todoListId === listId) {
            rowsToDelete.push(i);
        }
    }

    for (let i = rowsToDelete.length - 1; i >= 0; i--) {
        todoTable.deleteRow(rowsToDelete[i]);
    }
}

function searchTodo() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.toLowerCase();

    const table = document.getElementById('todoTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { 
        const cells = rows[i].getElementsByTagName('td');
        const title = cells[2].innerText.toLowerCase(); 

        if (title.includes(searchQuery)) {
            rows[i].style.display = ''; 
        } else {
            rows[i].style.display = 'none'; 
        }
    }
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusSelector = document.getElementById('statusSelector');
    const listSelector = document.getElementById('listSelectorV2');

    const searchQuery = searchInput.value.toLowerCase();
    const status = statusSelector.value;
    const listId = listSelector.value;

    const table = document.getElementById('todoTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const title = cells[2].innerText.toLowerCase(); 
        const statusCell = cells[3].getElementsByTagName('select')[0];
        const listCell = cells[1];
        const listValue = listCell.innerHTML;

        
        const matchesSearch = title.includes(searchQuery);
        const matchesStatus = status === '3' || statusCell.value === status;
        const matchesList = listId === '' || listValue === listId;

        
        if (matchesSearch && matchesStatus && matchesList) {
            rows[i].style.display = ''; 
        } else {
            rows[i].style.display = 'none'; 
        }
    }
}

function resetFilter() {
    const searchInput = document.getElementById('searchInput');
    const statusSelector = document.getElementById('statusSelector');
    const listSelector = document.getElementById('listSelectorV2');

    searchInput.value = '';
    statusSelector.value = '3';
    listSelector.value = '';

    applyFilters();
}