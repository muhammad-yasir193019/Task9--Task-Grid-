let teams = [
  { id: 1, name: "Team Alpha", department: "Development", members: ["John Doe", "Jane Smith", "Mike Johnson"] },
  { id: 2, name: "Team Beta", department: "Design", members: ["Sarah Wilson", "David Brown"] },
  { id: 3, name: "Team Gamma", department: "Marketing", members: ["Emily Davis", "Robert Taylor", "Lisa Anderson"] }
];

let tasks = [
  { id: 1, title: "Design Homepage", description: "Create wireframes and mockups for the homepage", status: "Done", priority: "High", team: "Team Beta", assignedTo: "Sarah Wilson", deadline: "2025-04-15" },
  { id: 2, title: "Implement Authentication", description: "Build user authentication system", status: "In Progress", priority: "High", team: "Team Alpha", assignedTo: "John Doe", deadline: "2025-04-20" },
  { id: 3, title: "Social Media Campaign", description: "Plan and execute Q2 social media strategy", status: "Pending", priority: "Medium", team: "Team Gamma", assignedTo: "Emily Davis", deadline: "2025-04-25" },
  { id: 4, title: "Database Optimization", description: "Optimize database queries for better performance", status: "In Progress", priority: "Medium", team: "Team Alpha", assignedTo: "Mike Johnson", deadline: "2025-04-18" },
  { id: 5, title: "Mobile App UI", description: "Design mobile app interface components", status: "Pending", priority: "Low", team: "Team Beta", assignedTo: "David Brown", deadline: "2025-05-01" }
];

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', function(e) {
      if (!mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  initializePage();
});

function initializePage() {
  const path = window.location.pathname;
  const page = path.split('/').pop();

  switch(page) {
    case '':
    case 'index.html':
      initializeDashboard();
      break;
    case 'teams.html':
      initializeTeams();
      break;
    case 'tasks.html':
      initializeTasks();
      break;
    case 'analytics.html':
      initializeAnalytics();
      break;
    case 'contact.html':
      initializeContact();
      break;
    default:
      initializeDashboard();
  }
}

function initializeDashboard() {
  updateOverviewCards();
}

function updateOverviewCards() {
  const overviewCards = document.getElementById('overview-cards');
  if (!overviewCards) return;

  const totalTeams = teams.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const activeMembers = teams.reduce((total, team) => total + (Array.isArray(team.members) ? team.members.length : 0), 0);

  overviewCards.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <div class="text-blue-500 text-3xl mb-4"><i class="fas fa-users" aria-hidden></i></div>
      <h3 class="text-2xl font-bold mb-2">${totalTeams}</h3>
      <p class="text-gray-600">Total Teams</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <div class="text-green-500 text-3xl mb-4"><i class="fas fa-check-circle" aria-hidden></i></div>
      <h3 class="text-2xl font-bold mb-2">${completedTasks}</h3>
      <p class="text-gray-600">Tasks Completed</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <div class="text-yellow-500 text-3xl mb-4"><i class="fas fa-clock" aria-hidden></i></div>
      <h3 class="text-2xl font-bold mb-2">${pendingTasks}</h3>
      <p class="text-gray-600">Pending Tasks</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <div class="text-purple-500 text-3xl mb-4"><i class="fas fa-user-friends" aria-hidden></i></div>
      <h3 class="text-2xl font-bold mb-2">${activeMembers}</h3>
      <p class="text-gray-600">Active Members</p>
    </div>
  `;
}

function initializeTeams() {
  renderTeamsGrid();
  setupTeamModals();
}

function renderTeamsGrid() {
  const teamsGrid = document.getElementById('teams-grid');
  if (!teamsGrid) return;

  teamsGrid.innerHTML = teams.map(team => `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-bold mb-2">${escapeHtml(team.name)}</h3>
      <p class="text-gray-600 mb-4">${escapeHtml(team.department)}</p>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">${Array.isArray(team.members) ? team.members.length : 0} members</span>
        <button class="view-members-btn bg-blue-100 text-blue-600 py-1 px-3 rounded text-sm hover:bg-blue-200 transition" data-team-id="${team.id}" aria-label="View members of ${escapeHtml(team.name)}">
          View Members
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.view-members-btn').forEach(button => {
    if (!button.dataset.bound) {
      button.addEventListener('click', function(e) {
        const teamId = parseInt(this.getAttribute('data-team-id'), 10);
        const team = teams.find(t => t.id === teamId);
        if (!team) return;
        const membersModal = document.getElementById('team-members-modal');
        const modalTeamName = document.getElementById('modal-team-name');
        const modalTeamMembers = document.getElementById('modal-team-members');
        const closeMembersModal = document.getElementById('close-members-modal');

        if (modalTeamName && modalTeamMembers) {
          modalTeamName.textContent = `${team.name} Members`;
          modalTeamMembers.innerHTML = `
            <ul class="list-disc pl-5">
              ${team.members.map(member => `<li class="mb-1">${escapeHtml(member)}</li>`).join('')}
            </ul>
          `;
        }

        if (membersModal) {
          membersModal.classList.remove('hidden');
          setTimeout(() => membersModal.classList.add('opacity-100'), 10);
        }

        if (closeMembersModal) {
          closeMembersModal.onclick = function() {
            if (membersModal) {
              membersModal.classList.add('hidden');
              membersModal.classList.remove('opacity-100');
            }
          };
        }
      });
      button.dataset.bound = '1';
    }
  });
}

function setupTeamModals() {
  const addTeamBtn = document.getElementById('add-team-btn');
  const addTeamModal = document.getElementById('add-team-modal');
  const cancelTeamBtn = document.getElementById('cancel-team-btn');
  const addTeamForm = document.getElementById('add-team-form');

  if (addTeamBtn && addTeamModal) {
    addTeamBtn.onclick = function() {
      addTeamModal.classList.remove('hidden');
      setTimeout(() => addTeamModal.classList.add('opacity-100'), 10);
    };
  }

  if (cancelTeamBtn && addTeamModal) {
    cancelTeamBtn.onclick = function() {
      addTeamModal.classList.add('hidden');
      addTeamModal.classList.remove('opacity-100');
      if (addTeamForm) addTeamForm.reset();
    };
  }

  if (addTeamForm) {
    addTeamForm.onsubmit = function(e) {
      e.preventDefault();
      const nameEl = document.getElementById('team-name');
      const deptEl = document.getElementById('department');
      const membersEl = document.getElementById('members');
      const name = nameEl ? nameEl.value.trim() : '';
      const department = deptEl ? deptEl.value.trim() : '';
      const members = membersEl ? membersEl.value.split(',').map(m => m.trim()).filter(Boolean) : [];

      if (!name || !department || members.length === 0) {
        alert('Please fill out all fields and add at least one member.');
        return;
      }

      const newTeam = {
        id: teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1,
        name,
        department,
        members
      };

      teams.push(newTeam);

      if (addTeamModal) {
        addTeamModal.classList.add('hidden');
        addTeamModal.classList.remove('opacity-100');
      }

      addTeamForm.reset();
      renderTeamsGrid();
      populateTeamFilters();
      updateOverviewCards();
    };
  }

  document.addEventListener('keydown', function(e) {
    const membersModal = document.getElementById('team-members-modal');
    const addTeamModalEl = document.getElementById('add-team-modal');
    if (e.key === 'Escape') {
      if (membersModal && !membersModal.classList.contains('hidden')) {
        membersModal.classList.add('hidden');
        membersModal.classList.remove('opacity-100');
      }
      if (addTeamModalEl && !addTeamModalEl.classList.contains('hidden')) {
        addTeamModalEl.classList.add('hidden');
        addTeamModalEl.classList.remove('opacity-100');
      }
    }
  });
}

function initializeTasks() {
  populateTeamFilters();
  renderTaskGrid();
  setupTaskForm();
  setupTaskFilters();
}

function populateTeamFilters() {
  const teamFilter = document.getElementById('team-filter');
  const taskTeam = document.getElementById('task-team');

  const options = teams.map(team => `<option value="${escapeHtml(team.name)}">${escapeHtml(team.name)}</option>`).join('');

  if (teamFilter) teamFilter.innerHTML = `<option value="">All Teams</option>` + options;
  if (taskTeam) taskTeam.innerHTML = `<option value="">Select Team</option>` + options;
}

function renderTaskGrid(taskList = tasks) {
  const taskGrid = document.getElementById('task-grid');
  if (!taskGrid) return;

  taskGrid.innerHTML = taskList.map(task => {
    let statusColor = '';
    let priorityColor = '';

    switch(task.status) {
      case 'Done': statusColor = 'bg-green-100 text-green-800'; break;
      case 'In Progress': statusColor = 'bg-blue-100 text-blue-800'; break;
      case 'Pending': statusColor = 'bg-yellow-100 text-yellow-800'; break;
      default: statusColor = 'bg-gray-100 text-gray-800';
    }

    switch(task.priority) {
      case 'High': priorityColor = 'bg-red-100 text-red-800'; break;
      case 'Medium': priorityColor = 'bg-orange-100 text-orange-800'; break;
      case 'Low': priorityColor = 'bg-gray-100 text-gray-800'; break;
      default: priorityColor = 'bg-gray-100 text-gray-800';
    }

    const deadlineText = task.deadline ? safeFormatDate(task.deadline) : 'No deadline';

    return `
      <div class="bg-white rounded-lg shadow p-4 task-card" data-team="${escapeHtml(task.team)}" data-priority="${escapeHtml(task.priority)}">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg">${escapeHtml(task.title)}</h3>
          <span class="text-xs ${priorityColor} px-2 py-1 rounded">${escapeHtml(task.priority)}</span>
        </div>
        <p class="text-gray-600 text-sm mb-3">${escapeHtml(task.description)}</p>
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs text-gray-500">${escapeHtml(task.team)}</span>
          <span class="text-xs ${statusColor} px-2 py-1 rounded">${escapeHtml(task.status)}</span>
        </div>
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>Assigned to: ${escapeHtml(task.assignedTo)}</span>
          <span>Due: ${deadlineText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupTaskForm() {
  const addTaskForm = document.getElementById('add-task-form');
  const taskSuccessMessage = document.getElementById('task-success-message');

  if (!addTaskForm) return;

  addTaskForm.onsubmit = function(e) {
    e.preventDefault();

    const titleEl = document.getElementById('task-title');
    const descriptionEl = document.getElementById('task-description');
    const deadlineEl = document.getElementById('task-deadline');
    const teamEl = document.getElementById('task-team');
    const priorityEl = document.getElementById('task-priority');
    const assignedEl = document.getElementById('task-assigned');

    const title = titleEl ? titleEl.value.trim() : '';
    const description = descriptionEl ? descriptionEl.value.trim() : '';
    const deadline = deadlineEl ? deadlineEl.value : '';
    const team = teamEl ? teamEl.value : '';
    const priority = priorityEl ? priorityEl.value : '';
    const assignedTo = assignedEl ? assignedEl.value.trim() : '';

    if (!title || !description || !deadline || !team || !priority || !assignedTo) {
      alert('Please fill out all required fields for the task.');
      return;
    }

    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title,
      description,
      status: 'Pending',
      priority,
      team,
      assignedTo,
      deadline
    };

    tasks.push(newTask);

    if (taskSuccessMessage) {
      taskSuccessMessage.textContent = 'Task Added Successfully!';
      taskSuccessMessage.classList.remove('hidden');
    }

    addTaskForm.reset();
    renderTaskGrid();
    updateOverviewCards();
    setTimeout(() => {
      if (taskSuccessMessage) taskSuccessMessage.classList.add('hidden');
    }, 3000);
  };
}

function setupTaskFilters() {
  const teamFilter = document.getElementById('team-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const searchInput = document.getElementById('search');

  if (teamFilter) teamFilter.addEventListener('change', filterTasks);
  if (priorityFilter) priorityFilter.addEventListener('change', filterTasks);
  if (searchInput) searchInput.addEventListener('input', filterTasks);
}

function filterTasks() {
  const teamFilter = document.getElementById('team-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const searchInput = document.getElementById('search');

  if (!teamFilter || !priorityFilter || !searchInput) return;

  const teamValue = teamFilter.value;
  const priorityValue = priorityFilter.value;
  const searchValue = searchInput.value.toLowerCase();

  let filteredTasks = tasks.slice();

  if (teamValue) filteredTasks = filteredTasks.filter(task => task.team === teamValue);
  if (priorityValue) filteredTasks = filteredTasks.filter(task => task.priority === priorityValue);
  if (searchValue) {
    filteredTasks = filteredTasks.filter(task =>
      (task.title && task.title.toLowerCase().includes(searchValue)) ||
      (task.description && task.description.toLowerCase().includes(searchValue)) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchValue))
    );
  }

  renderTaskGrid(filteredTasks);
}

// analytics related
function initializeAnalytics() {
  updateSummaryStats();
  updateTeamProgress();
  updateCharts();
}

function updateSummaryStats() {
  const summaryStats = document.getElementById('summary-stats');
  if (!summaryStats) return;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  summaryStats.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <h3 class="text-2xl font-bold mb-2">${totalTasks}</h3>
      <p class="text-gray-600">Total Tasks</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <h3 class="text-2xl font-bold mb-2">${completedTasks}</h3>
      <p class="text-gray-600">Completed</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <h3 class="text-2xl font-bold mb-2">${pendingTasks}</h3>
      <p class="text-gray-600">Pending</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
      <h3 class="text-2xl font-bold mb-2">${completionRate}%</h3>
      <p class="text-gray-600">Avg Progress</p>
    </div>
  `;
}

function updateTeamProgress() {
  const teamProgress = document.getElementById('team-progress');
  if (!teamProgress) return;

  const teamProgressData = teams.map(team => {
    const teamTasks = tasks.filter(task => task.team === team.name);
    const completedTeamTasks = teamTasks.filter(task => task.status === 'Done').length;
    const progress = teamTasks.length > 0 ? Math.round((completedTeamTasks / teamTasks.length) * 100) : 0;
    return {
      name: team.name,
      progress,
      completed: completedTeamTasks,
      total: teamTasks.length
    };
  });

  teamProgress.innerHTML = teamProgressData.map(t => `
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-medium">${escapeHtml(t.name)}</span>
        <span class="text-sm text-gray-600">${t.completed}/${t.total} tasks (${t.progress}%)</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${t.progress}%"></div>
      </div>
    </div>
  `).join('');
}

function updateCharts() {
  updatePieChart();
  updatePriorityDistribution();
}

function updatePieChart() {
  const pieChart = document.getElementById('pie-chart');
  const chartLegend = document.getElementById('chart-legend');
  if (!pieChart || !chartLegend) return;

  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const totalTasks = tasks.length || 1;
  const circumference = 2 * Math.PI * 40;
  const doneArc = (completedTasks / totalTasks) * circumference;
  const inProgArc = (inProgressTasks / totalTasks) * circumference;
  const pendingArc = (pendingTasks / totalTasks) * circumference;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  pieChart.innerHTML = `
    <svg viewBox="0 0 100 100" class="w-full h-full" role="img" aria-label="Task status distribution">
      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5E7EB" stroke-width="20"></circle>
      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" stroke-width="20" stroke-dasharray="${doneArc} ${circumference - doneArc}" transform="rotate(-90 50 50)"></circle>
      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" stroke-width="20" stroke-dasharray="${inProgArc} ${circumference - inProgArc}" stroke-dashoffset="${-doneArc}" transform="rotate(-90 50 50)"></circle>
      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" stroke-width="20" stroke-dasharray="${pendingArc} ${circumference - pendingArc}" stroke-dashoffset="${-(doneArc + inProgArc)}" transform="rotate(-90 50 50)"></circle>
    </svg>
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="text-center">
        <div class="text-2xl font-bold">${completionRate}%</div>
        <div class="text-sm text-gray-600">Complete</div>
      </div>
    </div>
  `;

  chartLegend.innerHTML = `
    <div class="flex items-center">
      <div class="w-3 h-3 bg-green-500 rounded-full mr-2" aria-hidden></div>
      <span class="text-sm">Done (${completedTasks})</span>
    </div>
    <div class="flex items-center">
      <div class="w-3 h-3 bg-blue-500 rounded-full mr-2" aria-hidden></div>
      <span class="text-sm">In Progress (${inProgressTasks})</span>
    </div>
    <div class="flex items-center">
      <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2" aria-hidden></div>
      <span class="text-sm">Pending (${pendingTasks})</span>
    </div>
  `;
}

function updatePriorityDistribution() {
  const priorityDistribution = document.getElementById('priority-distribution');
  if (!priorityDistribution) return;

  const totalTasks = tasks.length || 1;
  const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'Low').length;

  const safePercent = (n) => Math.round((n / totalTasks) * 100);

  priorityDistribution.innerHTML = `
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-medium">High Priority</span>
        <span class="text-sm text-gray-600">${highPriorityTasks} tasks</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-red-600 h-2.5 rounded-full" style="width: ${safePercent(highPriorityTasks)}%"></div>
      </div>
    </div>
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-medium">Medium Priority</span>
        <span class="text-sm text-gray-600">${mediumPriorityTasks} tasks</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-orange-500 h-2.5 rounded-full" style="width: ${safePercent(mediumPriorityTasks)}%"></div>
      </div>
    </div>
    <div>
      <div class="flex justify-between mb-1">
        <span class="font-medium">Low Priority</span>
        <span class="text-sm text-gray-600">${lowPriorityTasks} tasks</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-gray-500 h-2.5 rounded-full" style="width: ${safePercent(lowPriorityTasks)}%"></div>
      </div>
    </div>
  `;
}

function initializeContact() {
  const contactForm = document.getElementById('contact-form');
  const contactSuccessMessage = document.getElementById('contact-success-message');
  if (!contactForm) return;

  contactForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name') ? document.getElementById('contact-name').value.trim() : '';
    const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '';
    const subject = document.getElementById('contact-subject') ? document.getElementById('contact-subject').value.trim() : '';
    const message = document.getElementById('contact-message') ? document.getElementById('contact-message').value.trim() : '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (contactSuccessMessage) {
      contactSuccessMessage.textContent = 'Thank you for your message! We will get back to you soon.';
      contactSuccessMessage.classList.remove('hidden');
    }

    contactForm.reset();

    setTimeout(() => {
      if (contactSuccessMessage) contactSuccessMessage.classList.add('hidden');
    }, 5000);
  };
}

function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeFormatDate(dateString) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}
