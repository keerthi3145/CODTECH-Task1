class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.selectedCategory = '';
        this.init();
    }

    init() {
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setCategory(btn.dataset.category));
        });

        this.render();
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = this.todoInput.value.trim();
        const category = document.getElementById('category-select').value;
        
        if (title) {
            this.addTodo(title, category);
            this.todoInput.value = '';
        }
    }

    addTodo(title, category) {
        const newTodo = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            createdAt: new Date(),
            category: category || null
        };
        
        this.todos.unshift(newTodo);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const newTitle = prompt('Edit task:', todo.title);
            if (newTitle?.trim()) {
                this.todos = this.todos.map(t =>
                    t.id === id ? { ...t, title: newTitle.trim() } : t
                );
                this.saveTodos();
                this.render();
            }
        }
    }

    setFilter(newFilter) {
        this.filter = newFilter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === newFilter);
        });
        this.render();
    }

    setCategory(newCategory) {
        this.selectedCategory = newCategory;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === newCategory);
        });
        this.render();
    }

    getFilteredTodos() {
        return this.todos.filter(todo => {
            const matchesFilter = 
                this.filter === 'all' ? true :
                this.filter === 'active' ? !todo.completed :
                todo.completed;
            
            const matchesCategory = 
                !this.selectedCategory || todo.category === this.selectedCategory;
            
            return matchesFilter && matchesCategory;
        });
    }

    updateProgress() {
        const completedCount = this.todos.filter(todo => todo.completed).length;
        const totalCount = this.todos.length;
        const percentage = totalCount ? (completedCount / totalCount) * 100 : 0;

        document.getElementById('completed-count').textContent = completedCount;
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('progress-fill').style.width = `${percentage}%`;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text">${todo.title}</div>
                    ${todo.category ? `<div class="todo-category">${todo.category}</div>` : ''}
                </div>
                <div class="todo-actions">
                    <button onclick="app.editTodo('${todo.id}')">Edit</button>
                    <button onclick="app.deleteTodo('${todo.id}')">Delete</button>
                </div>
            </div>
        `).join('');

        this.emptyState.classList.toggle('hidden', filteredTodos.length > 0);
        this.updateProgress();

        // Add event listeners for checkboxes
        this.todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const todoId = e.target.closest('.todo-item').dataset.id;
                this.toggleTodo(todoId);
            });
        });
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

const app = new TodoApp();