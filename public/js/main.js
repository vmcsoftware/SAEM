// Variáveis globais
let currentUser = null;
let musicians = [];
let rehearsals = [];
let events = [];
let selectedDate = new Date();

// Elementos DOM
const sidebarEl = document.querySelector('.sidebar');
const sidebarToggleEl = document.querySelector('.sidebar-toggle');
const pageContainers = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#logout-btn');
const userNameEl = document.querySelector('#user-name');
const userRoleEl = document.querySelector('#user-role');

// Modais
const modals = document.querySelectorAll('.modal');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const addMusicianBtn = document.querySelector('#add-musician-btn');
const addRehearsalBtn = document.querySelector('#add-rehearsal-btn');
const addEventBtn = document.querySelector('#add-event-btn');
const addUserBtn = document.querySelector('#add-user-btn');

// Formulários
const musicianForm = document.querySelector('#musician-form');
const rehearsalForm = document.querySelector('#rehearsal-form');
const eventForm = document.querySelector('#event-form');
const userForm = document.querySelector('#user-form');

// Tabelas
const musiciansTable = document.querySelector('#musicians-table tbody');
const rehearsalsTable = document.querySelector('#rehearsals-table tbody');
const eventsTable = document.querySelector('#events-table tbody');
const usersTable = document.querySelector('#users-table tbody');

// Calendário
const calendarContainer = document.querySelector('.calendar');
const calendarMonthYear = document.querySelector('.calendar-month-year');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');
const dayEventsContainer = document.querySelector('.day-events');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se o usuário está logado
  const token = localStorage.getItem('token');
  if (token) {
    fetchUserProfile(token);
  } else {
    showPage('login-page');
  }

  // Event listeners
  setupEventListeners();
});

// Configuração de event listeners
function setupEventListeners() {
  // Toggle da sidebar
  sidebarToggleEl.addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
  });

  // Navegação
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      showPage(targetPage);

      // Carregar dados específicos da página
      if (targetPage === 'musicians-page') {
        fetchMusicians();
      } else if (targetPage === 'rehearsals-page') {
        fetchRehearsals();
      } else if (targetPage === 'events-page') {
        fetchEvents();
      } else if (targetPage === 'users-page') {
        fetchUsers();
      } else if (targetPage === 'schedule-page') {
        renderCalendar();
        fetchScheduleForDate(selectedDate);
      } else if (targetPage === 'dashboard-page') {
        loadDashboard();
      }
    });
  });

  // Login
  loginForm.addEventListener('submit', handleLogin);

  // Logout
  logoutBtn.addEventListener('click', handleLogout);

  // Modais
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Fechar modal ao clicar fora
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Botões de adicionar
  if (addMusicianBtn) {
    addMusicianBtn.addEventListener('click', () => {
      musicianForm.reset();
      musicianForm.dataset.id = '';
      document.querySelector('#musician-modal-title').textContent = 'Adicionar Músico';
      document.querySelector('#musician-modal').classList.add('active');
    });
  }

  if (addRehearsalBtn) {
    addRehearsalBtn.addEventListener('click', () => {
      rehearsalForm.reset();
      rehearsalForm.dataset.id = '';
      document.querySelector('#rehearsal-modal-title').textContent = 'Adicionar Ensaio';
      document.querySelector('#rehearsal-modal').classList.add('active');
      loadMusiciansForSelection('rehearsal-musicians');
    });
  }

  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      eventForm.reset();
      eventForm.dataset.id = '';
      document.querySelector('#event-modal-title').textContent = 'Adicionar Evento';
      document.querySelector('#event-modal').classList.add('active');
      loadMusiciansForSelection('event-musicians');
    });
  }

  if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
      userForm.reset();
      userForm.dataset.id = '';
      document.querySelector('#user-modal-title').textContent = 'Adicionar Usuário';
      document.querySelector('#user-modal').classList.add('active');
    });
  }

  // Formulários
  musicianForm.addEventListener('submit', handleMusicianSubmit);
  rehearsalForm.addEventListener('submit', handleRehearsalSubmit);
  eventForm.addEventListener('submit', handleEventSubmit);
  userForm.addEventListener('submit', handleUserSubmit);

  // Calendário
  if (prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      selectedDate.setMonth(selectedDate.getMonth() - 1);
      renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
      selectedDate.setMonth(selectedDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Adicionar/remover itens de repertório
  document.querySelector('#add-rehearsal-repertoire').addEventListener('click', () => {
    addRepertoireItem('rehearsal-repertoire');
  });

  document.querySelector('#add-event-repertoire').addEventListener('click', () => {
    addRepertoireItem('event-repertoire');
  });
}

// Funções de navegação
function showPage(pageId) {
  pageContainers.forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');

  // Atualizar link ativo na sidebar
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });
}

// Funções de autenticação
async function handleLogin(e) {
  e.preventDefault();
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      currentUser = data.user;
      updateUserInfo();
      showPage('dashboard-page');
      loadDashboard();
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Verifique sua conexão.');
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  currentUser = null;
  showPage('login-page');
}

async function fetchUserProfile(token) {
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data;
      updateUserInfo();
      showPage('dashboard-page');
      loadDashboard();
    } else {
      localStorage.removeItem('token');
      showPage('login-page');
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    localStorage.removeItem('token');
    showPage('login-page');
  }
}

function updateUserInfo() {
  if (currentUser) {
    userNameEl.textContent = currentUser.name;
    userRoleEl.textContent = currentUser.role === 'admin' ? 'Administrador' : 
                            currentUser.role === 'coordinator' ? 'Coordenador' : 'Usuário';

    // Mostrar/esconder elementos baseados na função do usuário
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    if (currentUser.role === 'admin') {
      adminOnlyElements.forEach(el => el.classList.add('visible'));
    } else {
      adminOnlyElements.forEach(el => el.classList.remove('visible'));
    }
  }
}

// Funções de modal
function closeAllModals() {
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
}

// Funções de API
async function fetchMusicians() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/musicians', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      musicians = data;
      renderMusiciansTable();
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao buscar músicos:', error);
    alert('Erro ao buscar músicos. Verifique sua conexão.');
  }
}

async function fetchRehearsals() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/rehearsals', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      rehearsals = data;
      renderRehearsalsTable();
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao buscar ensaios:', error);
    alert('Erro ao buscar ensaios. Verifique sua conexão.');
  }
}

async function fetchEvents() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/events', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      events = data;
      renderEventsTable();
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    alert('Erro ao buscar eventos. Verifique sua conexão.');
  }
}

async function fetchUsers() {
  if (currentUser?.role !== 'admin') return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      renderUsersTable(data);
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    alert('Erro ao buscar usuários. Verifique sua conexão.');
  }
}

async function fetchScheduleForDate(date) {
  try {
    const token = localStorage.getItem('token');
    const formattedDate = formatDateForAPI(date);
    const response = await fetch(`/api/schedule/${formattedDate}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      renderDayEvents(data, date);
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao buscar agenda:', error);
    alert('Erro ao buscar agenda. Verifique sua conexão.');
  }
}

// Funções de renderização
function renderMusiciansTable() {
  if (!musiciansTable) return;

  musiciansTable.innerHTML = '';

  musicians.forEach(musician => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${musician.name}</td>
      <td>${musician.phone}</td>
      <td>${musician.instrument}</td>
      <td>${musician.isOrganist ? 'Sim' : 'Não'}</td>
      <td>${formatAvailableDays(musician.availableDays)}</td>
      <td>${musician.active ? '<span class="badge badge-secondary">Ativo</span>' : '<span class="badge badge-danger">Inativo</span>'}</td>
      <td class="actions">
        <button class="btn btn-primary btn-sm" onclick="editMusician('${musician._id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteMusician('${musician._id}')">Excluir</button>
      </td>
    `;
    musiciansTable.appendChild(row);
  });
}

function renderRehearsalsTable() {
  if (!rehearsalsTable) return;

  rehearsalsTable.innerHTML = '';

  rehearsals.forEach(rehearsal => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rehearsal.title}</td>
      <td>${formatDate(rehearsal.date)}</td>
      <td>${rehearsal.startTime} - ${rehearsal.endTime}</td>
      <td>${rehearsal.location}</td>
      <td>${rehearsal.musicians.length}</td>
      <td class="actions">
        <button class="btn btn-primary btn-sm" onclick="editRehearsal('${rehearsal._id}')">Editar</button>
        <button class="btn btn-secondary btn-sm" onclick="viewRehearsal('${rehearsal._id}')">Ver</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRehearsal('${rehearsal._id}')">Excluir</button>
      </td>
    `;
    rehearsalsTable.appendChild(row);
  });
}

function renderEventsTable() {
  if (!eventsTable) return;

  eventsTable.innerHTML = '';

  events.forEach(event => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${event.title}</td>
      <td>${formatDate(event.date)}</td>
      <td>${event.startTime} - ${event.endTime}</td>
      <td>${event.location}</td>
      <td>${event.eventType}</td>
      <td>${event.musicians.length}</td>
      <td class="actions">
        <button class="btn btn-primary btn-sm" onclick="editEvent('${event._id}')">Editar</button>
        <button class="btn btn-secondary btn-sm" onclick="viewEvent('${event._id}')">Ver</button>
        <button class="btn btn-danger btn-sm" onclick="deleteEvent('${event._id}')">Excluir</button>
      </td>
    `;
    eventsTable.appendChild(row);
  });
}

function renderUsersTable(users) {
  if (!usersTable) return;

  usersTable.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role === 'admin' ? 'Administrador' : user.role === 'coordinator' ? 'Coordenador' : 'Usuário'}</td>
      <td class="actions">
        <button class="btn btn-primary btn-sm" onclick="editUser('${user._id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Excluir</button>
      </td>
    `;
    usersTable.appendChild(row);
  });
}

function renderCalendar() {
  if (!calendarContainer) return;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  // Atualizar cabeçalho do mês
  calendarMonthYear.textContent = `${getMonthName(month)} ${year}`;
  
  // Limpar calendário
  calendarContainer.innerHTML = '';
  
  // Adicionar cabeçalhos dos dias da semana
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  weekdays.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-header-day';
    dayHeader.textContent = day;
    calendarContainer.appendChild(dayHeader);
  });
  
  // Obter o primeiro dia do mês e o número de dias
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adicionar dias vazios para o início do mês
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarContainer.appendChild(emptyDay);
  }
  
  // Adicionar dias do mês
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    // Verificar se é hoje
    if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
      dayEl.classList.add('today');
    }
    
    // Verificar se é o dia selecionado
    if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && i === selectedDate.getDate()) {
      dayEl.classList.add('selected');
    }
    
    // Adicionar número do dia
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = i;
    dayEl.appendChild(dayNumber);
    
    // Adicionar indicador de eventos (será preenchido depois)
    const dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';
    dayEl.appendChild(dayEvents);
    
    // Adicionar evento de clique
    dayEl.addEventListener('click', () => {
      // Remover seleção anterior
      document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Adicionar seleção ao dia clicado
      dayEl.classList.add('selected');
      
      // Atualizar data selecionada
      selectedDate = new Date(year, month, i);
      
      // Buscar eventos para o dia selecionado
      fetchScheduleForDate(selectedDate);
    });
    
    calendarContainer.appendChild(dayEl);
  }
  
  // Marcar dias com eventos
  markDaysWithEvents();
}

function renderDayEvents(data, date) {
  if (!dayEventsContainer) return;
  
  const { rehearsals, events } = data;
  const formattedDate = formatDate(date);
  
  dayEventsContainer.innerHTML = `
    <h3>Agenda para ${formattedDate}</h3>
    <div class="day-events-list"></div>
  `;
  
  const eventsList = dayEventsContainer.querySelector('.day-events-list');
  
  if (rehearsals.length === 0 && events.length === 0) {
    eventsList.innerHTML = '<p>Nenhum evento ou ensaio agendado para este dia.</p>';
    return;
  }
  
  // Ordenar por horário de início
  const allEvents = [...rehearsals, ...events].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  allEvents.forEach(item => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${item.eventType ? 'event' : 'rehearsal'}`;
    
    const musicians = item.musicians.map(m => {
      const musician = musicians.find(mus => mus._id === m.musician) || { name: 'Músico não encontrado' };
      return `${musician.name} (${musician.instrument})`;
    }).join(', ');
    
    eventItem.innerHTML = `
      <h4>
        ${item.title}
        <span class="event-time">${item.startTime} - ${item.endTime}</span>
      </h4>
      <div class="event-location">${item.location}</div>
      <div class="event-musicians">
        <strong>Músicos:</strong> ${musicians || 'Nenhum músico escalado'}
      </div>
    `;
    
    eventsList.appendChild(eventItem);
  });
}

function markDaysWithEvents() {
  // Combinar ensaios e eventos
  const allEvents = [...rehearsals, ...events];
  
  // Criar um mapa de datas com eventos
  const eventDates = {};
  allEvents.forEach(item => {
    const date = new Date(item.date);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!eventDates[dateKey]) {
      eventDates[dateKey] = [];
    }
    eventDates[dateKey].push(item);
  });
  
  // Marcar dias no calendário
  const calendarDays = document.querySelectorAll('.calendar-day:not(.empty)');
  calendarDays.forEach((dayEl, index) => {
    const day = index + 1;
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${day}`;
    
    if (eventDates[dateKey]) {
      dayEl.classList.add('has-events');
      
      // Adicionar indicadores de eventos
      const dayEventsEl = dayEl.querySelector('.day-events');
      const rehearsalCount = eventDates[dateKey].filter(e => !e.eventType).length;
      const eventCount = eventDates[dateKey].filter(e => e.eventType).length;
      
      if (rehearsalCount > 0) {
        dayEventsEl.innerHTML += `<div class="event-indicator rehearsal">${rehearsalCount} ensaio${rehearsalCount > 1 ? 's' : ''}</div>`;
      }
      
      if (eventCount > 0) {
        dayEventsEl.innerHTML += `<div class="event-indicator event">${eventCount} evento${eventCount > 1 ? 's' : ''}</div>`;
      }
    }
  });
}

async function loadDashboard() {
  // Buscar dados para o dashboard
  try {
    const token = localStorage.getItem('token');
    
    // Buscar contagens
    const countResponse = await fetch('/api/dashboard/counts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const countData = await countResponse.json();
    
    if (countResponse.ok) {
      // Atualizar cards do dashboard
      document.querySelector('#musician-count').textContent = countData.musicians;
      document.querySelector('#rehearsal-count').textContent = countData.rehearsals;
      document.querySelector('#event-count').textContent = countData.events;
      document.querySelector('#active-musician-count').textContent = countData.activeMusicians;
    }
    
    // Buscar próximos eventos
    const upcomingResponse = await fetch('/api/dashboard/upcoming', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const upcomingData = await upcomingResponse.json();
    
    if (upcomingResponse.ok) {
      renderUpcomingEvents(upcomingData);
    }
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
}

function renderUpcomingEvents(data) {
  const { rehearsals, events } = data;
  
  // Renderizar próximos ensaios
  const upcomingRehearsalsEl = document.querySelector('#upcoming-rehearsals');
  if (upcomingRehearsalsEl) {
    if (rehearsals.length === 0) {
      upcomingRehearsalsEl.innerHTML = '<p>Nenhum ensaio agendado para os próximos dias.</p>';
    } else {
      upcomingRehearsalsEl.innerHTML = '';
      rehearsals.forEach(rehearsal => {
        const item = document.createElement('div');
        item.className = 'event-item rehearsal';
        item.innerHTML = `
          <h4>
            ${rehearsal.title}
            <span class="event-time">${formatDate(rehearsal.date)}, ${rehearsal.startTime}</span>
          </h4>
          <div class="event-location">${rehearsal.location}</div>
        `;
        upcomingRehearsalsEl.appendChild(item);
      });
    }
  }
  
  // Renderizar próximos eventos
  const upcomingEventsEl = document.querySelector('#upcoming-events');
  if (upcomingEventsEl) {
    if (events.length === 0) {
      upcomingEventsEl.innerHTML = '<p>Nenhum evento agendado para os próximos dias.</p>';
    } else {
      upcomingEventsEl.innerHTML = '';
      events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'event-item event';
        item.innerHTML = `
          <h4>
            ${event.title}
            <span class="event-time">${formatDate(event.date)}, ${event.startTime}</span>
          </h4>
          <div class="event-location">${event.location}</div>
          <div class="event-type">${event.eventType}</div>
        `;
        upcomingEventsEl.appendChild(item);
      });
    }
  }
}

// Funções de formulário
async function handleMusicianSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.querySelector('#musician-name').value,
    phone: document.querySelector('#musician-phone').value,
    instrument: document.querySelector('#musician-instrument').value,
    isOrganist: document.querySelector('#musician-is-organist').checked,
    availableDays: getSelectedDays(),
    active: document.querySelector('#musician-active').checked,
    notes: document.querySelector('#musician-notes').value
  };
  
  const musicianId = musicianForm.dataset.id;
  const isEditing = !!musicianId;
  
  try {
    const token = localStorage.getItem('token');
    const url = isEditing ? `/api/musicians/${musicianId}` : '/api/musicians';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeAllModals();
      fetchMusicians();
      alert(isEditing ? 'Músico atualizado com sucesso!' : 'Músico adicionado com sucesso!');
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao salvar músico:', error);
    alert('Erro ao salvar músico. Verifique sua conexão.');
  }
}

async function handleRehearsalSubmit(e) {
  e.preventDefault();
  
  const formData = {
    title: document.querySelector('#rehearsal-title').value,
    date: document.querySelector('#rehearsal-date').value,
    startTime: document.querySelector('#rehearsal-start-time').value,
    endTime: document.querySelector('#rehearsal-end-time').value,
    location: document.querySelector('#rehearsal-location').value,
    description: document.querySelector('#rehearsal-description').value,
    repertoire: getRepertoireItems('rehearsal-repertoire'),
    musicians: getSelectedMusicians('rehearsal-musicians')
  };
  
  const rehearsalId = rehearsalForm.dataset.id;
  const isEditing = !!rehearsalId;
  
  try {
    const token = localStorage.getItem('token');
    const url = isEditing ? `/api/rehearsals/${rehearsalId}` : '/api/rehearsals';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeAllModals();
      fetchRehearsals();
      alert(isEditing ? 'Ensaio atualizado com sucesso!' : 'Ensaio adicionado com sucesso!');
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao salvar ensaio:', error);
    alert('Erro ao salvar ensaio. Verifique sua conexão.');
  }
}

async function handleEventSubmit(e) {
  e.preventDefault();
  
  const formData = {
    title: document.querySelector('#event-title').value,
    date: document.querySelector('#event-date').value,
    startTime: document.querySelector('#event-start-time').value,
    endTime: document.querySelector('#event-end-time').value,
    location: document.querySelector('#event-location').value,
    description: document.querySelector('#event-description').value,
    eventType: document.querySelector('#event-type').value,
    repertoire: getRepertoireItems('event-repertoire'),
    musicians: getSelectedMusicians('event-musicians')
  };
  
  const eventId = eventForm.dataset.id;
  const isEditing = !!eventId;
  
  try {
    const token = localStorage.getItem('token');
    const url = isEditing ? `/api/events/${eventId}` : '/api/events';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeAllModals();
      fetchEvents();
      alert(isEditing ? 'Evento atualizado com sucesso!' : 'Evento adicionado com sucesso!');
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao salvar evento:', error);
    alert('Erro ao salvar evento. Verifique sua conexão.');
  }
}

async function handleUserSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.querySelector('#user-name').value,
    email: document.querySelector('#user-email').value,
    role: document.querySelector('#user-role').value
  };
  
  // Adicionar senha apenas se estiver criando um novo usuário ou se a senha for fornecida
  const password = document.querySelector('#user-password').value;
  if (password) {
    formData.password = password;
  }
  
  const userId = userForm.dataset.id;
  const isEditing = !!userId;
  
  try {
    const token = localStorage.getItem('token');
    const url = isEditing ? `/api/users/${userId}` : '/api/users';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeAllModals();
      fetchUsers();
      alert(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!');
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    alert('Erro ao salvar usuário. Verifique sua conexão.');
  }
}

// Funções de edição
function editMusician(id) {
  const musician = musicians.find(m => m._id === id);
  if (!musician) return;
  
  document.querySelector('#musician-name').value = musician.name;
  document.querySelector('#musician-phone').value = musician.phone;
  document.querySelector('#musician-instrument').value = musician.instrument;
  document.querySelector('#musician-is-organist').checked = musician.isOrganist;
  document.querySelector('#musician-active').checked = musician.active;
  document.querySelector('#musician-notes').value = musician.notes || '';
  
  // Marcar dias disponíveis
  const dayCheckboxes = document.querySelectorAll('[name="available-days"]');
  dayCheckboxes.forEach(checkbox => {
    checkbox.checked = musician.availableDays.includes(checkbox.value);
  });
  
  musicianForm.dataset.id = id;
  document.querySelector('#musician-modal-title').textContent = 'Editar Músico';
  document.querySelector('#musician-modal').classList.add('active');
}

function editRehearsal(id) {
  const rehearsal = rehearsals.find(r => r._id === id);
  if (!rehearsal) return;
  
  document.querySelector('#rehearsal-title').value = rehearsal.title;
  document.querySelector('#rehearsal-date').value = formatDateForInput(rehearsal.date);
  document.querySelector('#rehearsal-start-time').value = rehearsal.startTime;
  document.querySelector('#rehearsal-end-time').value = rehearsal.endTime;
  document.querySelector('#rehearsal-location').value = rehearsal.location;
  document.querySelector('#rehearsal-description').value = rehearsal.description || '';
  
  // Limpar e adicionar itens de repertório
  const repertoireContainer = document.querySelector('#rehearsal-repertoire');
  repertoireContainer.innerHTML = '';
  
  if (rehearsal.repertoire && rehearsal.repertoire.length > 0) {
    rehearsal.repertoire.forEach(item => {
      addRepertoireItem('rehearsal-repertoire', item);
    });
  } else {
    addRepertoireItem('rehearsal-repertoire');
  }
  
  // Carregar músicos
  loadMusiciansForSelection('rehearsal-musicians', rehearsal.musicians);
  
  rehearsalForm.dataset.id = id;
  document.querySelector('#rehearsal-modal-title').textContent = 'Editar Ensaio';
  document.querySelector('#rehearsal-modal').classList.add('active');
}

function editEvent(id) {
  const event = events.find(e => e._id === id);
  if (!event) return;
  
  document.querySelector('#event-title').value = event.title;
  document.querySelector('#event-date').value = formatDateForInput(event.date);
  document.querySelector('#event-start-time').value = event.startTime;
  document.querySelector('#event-end-time').value = event.endTime;
  document.querySelector('#event-location').value = event.location;
  document.querySelector('#event-description').value = event.description || '';
  document.querySelector('#event-type').value = event.eventType;
  
  // Limpar e adicionar itens de repertório
  const repertoireContainer = document.querySelector('#event-repertoire');
  repertoireContainer.innerHTML = '';
  
  if (event.repertoire && event.repertoire.length > 0) {
    event.repertoire.forEach(item => {
      addRepertoireItem('event-repertoire', item);
    });
  } else {
    addRepertoireItem('event-repertoire');
  }
  
  // Carregar músicos
  loadMusiciansForSelection('event-musicians', event.musicians);
  
  eventForm.dataset.id = id;
  document.querySelector('#event-modal-title').textContent = 'Editar Evento';
  document.querySelector('#event-modal').classList.add('active');
}

function editUser(id) {
  // Buscar usuário específico
  const token = localStorage.getItem('token');
  
  fetch(`/api/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(user => {
      if (user) {
        document.querySelector('#user-name').value = user.name;
        document.querySelector('#user-email').value = user.email;
        document.querySelector('#user-role').value = user.role;
        
        // Limpar campo de senha para edição
        document.querySelector('#user-password').value = '';
        document.querySelector('#user-password-label').textContent = 'Senha (deixe em branco para manter a atual)';
        
        userForm.dataset.id = id;
        document.querySelector('#user-modal-title').textContent = 'Editar Usuário';
        document.querySelector('#user-modal').classList.add('active');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar usuário:', error);
      alert('Erro ao buscar usuário. Verifique sua conexão.');
    });
}

// Funções de visualização
function viewRehearsal(id) {
  const rehearsal = rehearsals.find(r => r._id === id);
  if (!rehearsal) return;
  
  // Implementar visualização detalhada do ensaio
  // Pode ser um modal diferente ou uma página separada
}

function viewEvent(id) {
  const event = events.find(e => e._id === id);
  if (!event) return;
  
  // Implementar visualização detalhada do evento
  // Pode ser um modal diferente ou uma página separada
}

// Funções de exclusão
async function deleteMusician(id) {
  if (!confirm('Tem certeza que deseja excluir este músico?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/musicians/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      fetchMusicians();
      alert('Músico excluído com sucesso!');
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao excluir músico:', error);
    alert('Erro ao excluir músico. Verifique sua conexão.');
  }
}

async function deleteRehearsal(id) {
  if (!confirm('Tem certeza que deseja excluir este ensaio?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/rehearsals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      fetchRehearsals();
      alert('Ensaio excluído com sucesso!');
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao excluir ensaio:', error);
    alert('Erro ao excluir ensaio. Verifique sua conexão.');
  }
}

async function deleteEvent(id) {
  if (!confirm('Tem certeza que deseja excluir este evento?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      fetchEvents();
      alert('Evento excluído com sucesso!');
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    alert('Erro ao excluir evento. Verifique sua conexão.');
  }
}

async function deleteUser(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      fetchUsers();
      alert('Usuário excluído com sucesso!');
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    alert('Erro ao excluir usuário. Verifique sua conexão.');
  }
}

// Funções auxiliares
function getSelectedDays() {
  const checkboxes = document.querySelectorAll('[name="available-days"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function formatAvailableDays(days) {
  if (!days || days.length === 0) return 'Nenhum';
  
  const dayMap = {
    'sunday': 'Domingo',
    'monday': 'Segunda',
    'tuesday': 'Terça',
    'wednesday': 'Quarta',
    'thursday': 'Quinta',
    'friday': 'Sexta',
    'saturday': 'Sábado'
  };
  
  return days.map(day => dayMap[day] || day).join(', ');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function formatDateForAPI(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getMonthName(month) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month];
}

// Tornando a função global para ser acessível de outros arquivos
window.addRepertoireItem = function(containerId, value = '') {
  const container = document.getElementById(containerId);
  const itemDiv = document.createElement('div');
  itemDiv.className = 'repertoire-item';
  
  itemDiv.innerHTML = `
    <input type="text" class="repertoire-input" value="${value}" placeholder="Nome da música">
    <button type="button" class="remove-repertoire" onclick="removeRepertoireItem(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(itemDiv);
}

// Tornando a função global para ser acessível de outros arquivos
window.removeRepertoireItem = function(button) {
  const item = button.closest('.repertoire-item');
  item.remove();
}

function getRepertoireItems(containerId) {
  const inputs = document.querySelectorAll(`#${containerId} .repertoire-input`);
  return Array.from(inputs)
    .map(input => input.value.trim())
    .filter(value => value !== '');
}

function loadMusiciansForSelection(containerId, selectedMusicians = []) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (!musicians || musicians.length === 0) {
    container.innerHTML = '<p>Nenhum músico cadastrado.</p>';
    return;
  }
  
  // Filtrar apenas músicos ativos
  const activeMusicians = musicians.filter(m => m.active);
  
  activeMusicians.forEach(musician => {
    const isSelected = selectedMusicians.some(m => m.musician === musician._id);
    
    const item = document.createElement('div');
    item.className = 'musician-item';
    item.innerHTML = `
      <div class="musician-info">
        <div class="musician-name">${musician.name}</div>
        <div class="musician-instrument">${musician.instrument}${musician.isOrganist ? ' (Organista)' : ''}</div>
      </div>
      <div class="musician-selection">
        <input type="checkbox" name="selected-musicians" value="${musician._id}" ${isSelected ? 'checked' : ''}>
      </div>
    `;
    
    container.appendChild(item);
  });
}

function getSelectedMusicians(containerId) {
  const checkboxes = document.querySelectorAll(`#${containerId} input[name="selected-musicians"]:checked`);
  return Array.from(checkboxes).map(cb => ({
    musician: cb.value,
    confirmed: false,
    notified: false
  }));
}

// Funções de confirmação de presença
async function confirmAttendance(type, id, musicianId, confirmed) {
  try {
    const token = localStorage.getItem('token');
    const url = `/api/${type}s/${id}/musicians/${musicianId}/confirm`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirmed })
    });
    
    if (response.ok) {
      // Atualizar a lista de ensaios ou eventos
      if (type === 'rehearsal') {
        fetchRehearsals();
      } else {
        fetchEvents();
      }
      
      alert('Presença atualizada com sucesso!');
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    alert('Erro ao confirmar presença. Verifique sua conexão.');
  }
}

// Expor funções globalmente para uso em onclick
window.editMusician = editMusician;
window.deleteMusician = deleteMusician;
window.editRehearsal = editRehearsal;
window.viewRehearsal = viewRehearsal;
window.deleteRehearsal = deleteRehearsal;
window.editEvent = editEvent;
window.viewEvent = viewEvent;
window.deleteEvent = deleteEvent;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.removeRepertoireItem = removeRepertoireItem;
window.confirmAttendance = confirmAttendance;