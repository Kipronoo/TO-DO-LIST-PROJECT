// URL of your backend API
const apiUrl = 'http://localhost:3000';

// Add a new task
document.getElementById('newTaskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Gather form inputs
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const priority = document.getElementById('taskPriority').value;
  const files = document.getElementById('taskFiles').files;
  const collaborators = document.getElementById('collaborators').value.split(',').map(email => email.trim());
  const recurring = document.getElementById('taskRecurring').checked;
  
  // Create a FormData object to handle file uploads
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('dueDate', dueDate);
  formData.append('priority', priority);
  formData.append('collaborators', JSON.stringify(collaborators));
  formData.append('recurring', recurring);

  for (let i = 0; i < files.length; i++) {
    formData.append('attachedFiles', files[i]);
  }

  // Send task data to the backend
  fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    alert('Task added successfully!');
    loadTasks(); // Reload tasks after adding a new one
  })
  .catch(error => console.error('Error adding task:', error));
});

// Load tasks and display them in the task list
function loadTasks() {
  fetch(`${apiUrl}/tasks`)
    .then(response => response.json())
    .then(tasks => {
      const tasksContainer = document.getElementById('tasksContainer');
      tasksContainer.innerHTML = ''; // Clear previous tasks

      tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.classList.add(task.completed ? 'completed' : '');
        taskElement.innerHTML = `
          <strong>${task.title}</strong>
          <p>${task.description}</p>
          <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Priority: ${task.priority}</p>
          <p>Collaborators: ${task.collaborators.join(', ')}</p>
          <button onclick="markCompleted('${task._id}')">Mark as Completed</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        tasksContainer.appendChild(taskElement);
      });
    })
    .catch(error => console.error('Error loading tasks:', error));
}

// Mark a task as completed
function markCompleted(taskId) {
  fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed: true })
  })
  .then(() => {
    alert('Task marked as completed!');
    loadTasks(); // Reload tasks after marking as completed
  })
  .catch(error => console.error('Error marking task as completed:', error));
}

// Delete a task
function deleteTask(taskId) {
  fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'DELETE',
  })
  .then(() => {
    alert('Task deleted successfully!');
    loadTasks(); // Reload tasks after deletion
  })
  .catch(error => console.error('Error deleting task:', error));
}

// Apply filters to task list
document.getElementById('applyFilters').addEventListener('click', () => {
  const priority = document.getElementById('filterPriority').value;
  const category = document.getElementById('filterCategory').value;
  const completed = document.getElementById('filterCompleted').checked;

  let query = `${apiUrl}/tasks/filter?`;

  if (priority) query += `priority=${priority}&`;
  if (category) query += `category=${category}&`;
  if (completed) query += `completed=${completed}&`;

  fetch(query)
    .then(response => response.json())
    .then(tasks => {
      const tasksContainer = document.getElementById('tasksContainer');
      tasksContainer.innerHTML = '';

      tasks.forEach(task => {
        const taskElement = document.create
