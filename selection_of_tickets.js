let minCountMessageForAgent = 3; // Сколько должно быть сообщений от агента в одном тикете, чтобы он попал в выборку
let minTicketResult = 50; // Сколько id тикетов нужно получить

deleteKeyStorage('agentList'); // При перезапуске скрипта - удалить предыдущие данные
init();

function init() {
  if (!document.querySelector('#go').hasAttribute('disabled') && countMessageAgent() >= minCountMessageForAgent) {
    setTicketId();
  } else {
    setTimeout(function() {
      if (countSetStorage() < minTicketResult) {
        nextTicket();

        if (getError().indexOf('Нет данных') !== -1) {
          result();
        } else {
          setTimeout(init, 500);
        }
      } else {
        result();
      }
    }, 250);
  }
}

function setTicketId() {
  if (resultTickets()) {
    let list = resultTickets() + ',' + getId();

    setToStorage('agentList', list);
  } else {
    setToStorage('agentList', getId());
  }

  nextTicket();
  init();
}

function countMessageAgent() {
  let currentCount = 0;

  function isMessage() {
    let message = document.querySelectorAll('.com.acom.tcom');

    if (message.length) {
      message.forEach((index) => {
        let agentNameForTicket = index.firstElementChild.innerText.trim().replace(':', '');

        if (agentNameForTicket === validationAgentName()) {
          currentCount++;
        }
      });
    } else {
      setTimeout(isMessage, 500);
    }
  }

  isMessage();

  return currentCount;
}

function validationAgentName() {
  let valName = '';
  
  document.querySelectorAll('#list1 option').forEach((index) => {
    if (index.selected) {
      valName = index.innerText.trim();
    }
  });

  return valName;
}

function getId() {
  return document.querySelector('.message-body .panel-block .link4').innerText.trim().replace(/\D/g, '');
}

function nextTicket() {
  document.querySelector('#go').click();
}

function countSetStorage() {
  try {
    return resultTickets().split(',').length;
  } catch (e) {
    return resultTickets();
  }
}

function getFromStorage(name) {
  return localStorage.getItem(name);
}

function setToStorage(name, value) {
  return localStorage.setItem(name, value);
}

function deleteKeyStorage(name) {
  return localStorage.removeItem(name);
}

function getError() {
  try {
    return document.querySelector('.results .notification').innerText.trim();
  } catch (e) {
    return String(document.querySelector('.results .notification'));
  }
}

function resultTickets() {
  return getFromStorage('agentList');
}

function result() {
  console.log('Собрано ' + countSetStorage() + ' тикетов:' + '\n\n' + resultTickets().replace(/,/g, '\n'));
  deleteKeyStorage('agentList');
}
