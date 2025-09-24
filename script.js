// load station & fare data
const stationsData = {
  stations: [
    "Station A",
    "Station B",
    "Station C",
    "Station D"
  ],
  fares: {
    "Station A-Station B": 30,
    "Station A-Station C": 50,
    "Station A-Station D": 70,
    "Station B-Station C": 40,
    "Station B-Station D": 60,
    "Station C-Station D": 30
  }
};

function populateStations() {
  const fromSel = document.getElementById('from');
  const toSel = document.getElementById('to');
  stationsData.stations.forEach(st => {
    const opt1 = document.createElement('option');
    opt1.value = st;
    opt1.text = st;
    fromSel.add(opt1);
    const opt2 = document.createElement('option');
    opt2.value = st;
    opt2.text = st;
    toSel.add(opt2);
  });
}

function getFare(from, to) {
  if(from === to) return 0;
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  if (stationsData.fares[key1] !== undefined) return stationsData.fares[key1];
  if (stationsData.fares[key2] !== undefined) return stationsData.fares[key2];
  // missing combination
  return null;
}

function calculateTotalFare(baseFare, ticketType, qty) {
  let fare = baseFare;
  if (ticketType === 'return') {
    fare = baseFare * 2;
  } else if (ticketType === 'daypass') {
    fare = baseFare * 3;  // example multiplier for day pass
  }
  return fare * qty;
}

function saveHistory(ticket) {
  let hist = JSON.parse(localStorage.getItem('metroHistory')) || [];
  hist.push(ticket);
  localStorage.setItem('metroHistory', JSON.stringify(hist));
}

function loadHistory() {
  const hist = JSON.parse(localStorage.getItem('metroHistory')) || [];
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  hist.forEach((tkt, idx) => {
    const li = document.createElement('li');
    li.textContent = `${tkt.date} – ${tkt.from} to ${tkt.to} | ${tkt.ticketType} | Qty: ${tkt.qty} | Total ₹${tkt.total}`;
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  populateStations();
  loadHistory();

  document.getElementById('calculate').addEventListener('click', function() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const ticketType = document.getElementById('ticketType').value;
    const qty = parseInt(document.getElementById('qty').value, 10);
    const baseFare = getFare(from, to);

    const infoDiv = document.getElementById('ticketInfo');
    if (baseFare === null) {
      infoDiv.textContent = 'Fare not found for this route.';
      return;
    }

    const total = calculateTotalFare(baseFare, ticketType, qty);
    const now = new Date();
    const ticket = {
      date: now.toLocaleString(),
      from,
      to,
      ticketType,
      qty,
      total
    };

    infoDiv.textContent = `Ticket: ${from} → ${to} | ${ticketType} | Qty: ${qty} | Total ₹${total}`;
    saveHistory(ticket);
    loadHistory();
  });
});
