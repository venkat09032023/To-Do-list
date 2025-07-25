document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    
    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (filter === 'all') return true;
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
        });
        
        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${todo.text}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            
            li.addEventListener('click', () => toggleComplete(index));
            todoList.appendChild(li);
        });
    }
    

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            saveTodos();
            todoInput.value = '';
            renderTodos();
        }
    }
    
    
    function toggleComplete(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos(getCurrentFilter());
    }
 
    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos(getCurrentFilter());
    }
    
   
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
   
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }
    
    
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            e.stopPropagation();
            const index = e.target.dataset.index;
            deleteTodo(index);
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTodos(btn.dataset.filter);
        });
    });
    
   
    renderTodos();
});