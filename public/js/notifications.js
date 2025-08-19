// Funções para lidar com notificações e confirmações de presença

// Função para exibir o QR code do WhatsApp
function displayWhatsAppQR(qrCode) {
  const qrContainer = document.getElementById('whatsapp-qr-container');
  if (!qrContainer) return;
  
  qrContainer.innerHTML = '';
  
  const qrImage = document.createElement('img');
  qrImage.src = qrCode;
  qrImage.alt = 'QR Code para WhatsApp';
  qrImage.className = 'whatsapp-qr';
  
  const instructions = document.createElement('p');
  instructions.textContent = 'Escaneie este QR code com seu WhatsApp para conectar o sistema.';
  instructions.className = 'qr-instructions';
  
  qrContainer.appendChild(qrImage);
  qrContainer.appendChild(instructions);
  
  // Mostrar o modal do QR code
  document.getElementById('whatsapp-qr-modal').classList.add('active');
}

// Função para verificar o status da conexão do WhatsApp
async function checkWhatsAppStatus() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/whatsapp/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Usar o formato correto da resposta do serviço
      updateWhatsAppStatus(data.connected ? 'connected' : 'disconnected', data.qrCode);
    }
  } catch (error) {
    console.error('Erro ao verificar status do WhatsApp:', error);
    updateWhatsAppStatus('disconnected');
  }
}

// Função para atualizar o status do WhatsApp na interface
function updateWhatsAppStatus(status, qrCode) {
  const statusElement = document.getElementById('whatsapp-status');
  if (!statusElement) return;
  
  let statusText = '';
  let statusClass = '';
  
  switch (status) {
    case 'connected':
      statusText = 'Conectado';
      statusClass = 'text-success';
      break;
    case 'disconnected':
      statusText = 'Desconectado';
      statusClass = 'text-danger';
      break;
    case 'connecting':
      statusText = 'Conectando...';
      statusClass = 'text-warning';
      break;
    default:
      statusText = 'Status desconhecido';
      statusClass = 'text-danger';
  }
  
  statusElement.textContent = statusText;
  statusElement.className = statusClass;
  
  // Se estiver desconectado e tiver um QR code, exibi-lo
  if (status === 'disconnected' && qrCode) {
    displayWhatsAppQR(qrCode);
  }
}

// Função para enviar mensagem de teste
async function sendTestMessage() {
  const phoneInput = document.getElementById('test-phone');
  if (!phoneInput) return;
  
  const phone = phoneInput.value.trim();
  if (!phone) {
    alert('Por favor, insira um número de telefone válido.');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/whatsapp/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Mensagem de teste enviada com sucesso!');
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem de teste:', error);
    alert('Erro ao enviar mensagem de teste. Verifique sua conexão.');
  }
}

// Função para enviar notificações manualmente para um ensaio
async function sendRehearsalNotifications(rehearsalId) {
  if (!confirm('Deseja enviar notificações para todos os músicos deste ensaio?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/whatsapp/rehearsals/${rehearsalId}/notify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(`Notificações enviadas com sucesso para ${data.successCount} músicos. Falhas: ${data.failCount}`);
    } else {
      alert(`Erro: ${data.error || data.message || 'Falha ao enviar notificações'}`);
    }
  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    alert('Erro ao enviar notificações. Verifique sua conexão.');
  }
}

// Função para enviar notificações manualmente para um evento
async function sendEventNotifications(eventId) {
  if (!confirm('Deseja enviar notificações para todos os músicos deste evento?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/whatsapp/events/${eventId}/notify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(`Notificações enviadas com sucesso para ${data.successCount} músicos. Falhas: ${data.failCount}`);
    } else {
      alert(`Erro: ${data.error || data.message || 'Falha ao enviar notificações'}`);
    }
  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    alert('Erro ao enviar notificações. Verifique sua conexão.');
  }
}

// Função para confirmar presença em um ensaio ou evento
async function confirmPresence(type, id, confirmed = true) {
  // Verificar se o usuário atual é um músico
  if (!currentUser || !currentUser.musician) {
    alert('Apenas músicos podem confirmar presença.');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const url = `/api/${type}s/${id}/musicians/${currentUser.musician}/confirm`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirmed })
    });
    
    if (response.ok) {
      alert(`Presença ${confirmed ? 'confirmada' : 'recusada'} com sucesso!`);
      
      // Atualizar a interface
      if (type === 'rehearsal') {
        fetchRehearsals();
      } else {
        fetchEvents();
      }
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    alert('Erro ao confirmar presença. Verifique sua conexão.');
  }
}

// Função para reconectar o WhatsApp
async function reconnectWhatsApp() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/whatsapp/reconnect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Solicitação de reconexão enviada. Aguarde o QR code.');
      
      // Verificar o status após alguns segundos
      setTimeout(checkWhatsAppStatus, 5000);
    } else {
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro ao reconectar WhatsApp:', error);
    alert('Erro ao reconectar WhatsApp. Verifique sua conexão.');
  }
}

// Verificar o status do WhatsApp periodicamente (a cada 30 segundos)
setInterval(checkWhatsAppStatus, 30000);

// Verificar o status do WhatsApp ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se o usuário está logado
  const token = localStorage.getItem('token');
  if (token) {
    // Verificar o status do WhatsApp
    checkWhatsAppStatus();
  }
  
  // Adicionar event listener para o botão de teste
  const testButton = document.getElementById('send-test-message');
  if (testButton) {
    testButton.addEventListener('click', sendTestMessage);
  }
  
  // Adicionar event listener para o botão de reconexão
  const reconnectButton = document.getElementById('reconnect-whatsapp');
  if (reconnectButton) {
    reconnectButton.addEventListener('click', reconnectWhatsApp);
  }
});

// Expor funções globalmente
window.sendRehearsalNotifications = sendRehearsalNotifications;
window.sendEventNotifications = sendEventNotifications;
window.confirmPresence = confirmPresence;
window.reconnectWhatsApp = reconnectWhatsApp;