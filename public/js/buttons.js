// Arquivo para ativar os botões da interface

document.addEventListener('DOMContentLoaded', () => {
  // Botões de salvar nos modais
  const saveMusicianBtn = document.getElementById('save-musician-btn');
  const saveRehearsalBtn = document.getElementById('save-rehearsal-btn');
  const saveEventBtn = document.getElementById('save-event-btn');
  const saveUserBtn = document.getElementById('save-user-btn');

  // Ativar botão de salvar músico
  if (saveMusicianBtn) {
    saveMusicianBtn.addEventListener('click', () => {
      document.getElementById('musician-form').dispatchEvent(new Event('submit'));
    });
  }

  // Ativar botão de salvar ensaio
  if (saveRehearsalBtn) {
    saveRehearsalBtn.addEventListener('click', () => {
      document.getElementById('rehearsal-form').dispatchEvent(new Event('submit'));
    });
  }

  // Ativar botão de salvar evento
  if (saveEventBtn) {
    saveEventBtn.addEventListener('click', () => {
      document.getElementById('event-form').dispatchEvent(new Event('submit'));
    });
  }

  // Ativar botão de salvar usuário
  if (saveUserBtn) {
    saveUserBtn.addEventListener('click', () => {
      document.getElementById('user-form').dispatchEvent(new Event('submit'));
    });
  }

  // Ativar botões de adicionar repertório
  const addRehearsalRepertoireBtn = document.getElementById('add-repertoire-item');
  const addEventRepertoireBtn = document.getElementById('add-event-repertoire-item');

  if (addRehearsalRepertoireBtn) {
    addRehearsalRepertoireBtn.addEventListener('click', () => {
      // Usar a função existente no main.js
      if (typeof window.addRepertoireItem === 'function') {
        window.addRepertoireItem('rehearsal-repertoire-list');
      }
    });
  }

  if (addEventRepertoireBtn) {
    addEventRepertoireBtn.addEventListener('click', () => {
      // Usar a função existente no main.js
      if (typeof window.addRepertoireItem === 'function') {
        window.addRepertoireItem('event-repertoire-list');
      }
    });
  }

  console.log('Botões ativados com sucesso!');
});