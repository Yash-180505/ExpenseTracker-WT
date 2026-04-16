let transactions = [];

const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const form = document.getElementById("form");

form.addEventListener("submit", addTransaction);

// LOAD DATA
function loadTransactions() {
  fetch("fetch.php")
    .then((res) => res.json())
    .then((data) => {
      transactions = data;
      list.innerHTML = "";
      transactions.forEach(addTransactionDOM);
      updateValues();
      updateChart();
    });
}

// ADD EXPENSE
function addTransaction(e) {
  e.preventDefault();

  const desc = document.getElementById("text").value;
  const amt = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  fetch("insert.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${desc}&amount=${-Math.abs(amt)}&date=${date}`,
  }).then(() => loadTransactions());
}

// ADD BUDGET
function setTotalAmount() {
  const amt = document.getElementById("totalAmount").value;
  const date = new Date().toISOString().split("T")[0];

  fetch("insert.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=Budget&amount=${amt}&date=${date}`,
  }).then(() => loadTransactions());
}

// ADD SAVINGS
function addSaving() {
  const amt = document.getElementById("saving-amount").value;
  const date = new Date().toISOString().split("T")[0];

  fetch("insert.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=Saving&amount=${amt}&date=${date}`,
  }).then(() => loadTransactions());
}

// DELETE ALL
function clearAllData() {
  if (!confirm("Delete all data?")) return;

  fetch("delete.php").then(() => loadTransactions());
}

// UPDATE UI
function updateValues() {
  const amounts = transactions.map((t) => parseFloat(t.amount));

  const balance = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0);

  balanceEl.innerText = balance;
  money_plus.innerText = income;
  money_minus.innerText = Math.abs(expense);
}

// DOM
function addTransactionDOM(t) {
  const li = document.createElement("li");
  li.innerHTML = `${t.text} <span>${t.amount}</span>`;
  list.appendChild(li);
}

// CHART
const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [0, 0],
   backgroundColor: ["#3b82f6", "#a855f7"],
      borderWidth: 2,
      borderColor: "#0f172a",
      hoverOffset: 10
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0"
        }
      }
    }
  }
});
function updateChart() {
  const amounts = transactions.map((t) => parseFloat(t.amount));

  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = Math.abs(
    amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0),
  );

  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

function printPage() {
  window.print();
}
// INIT
window.onload = loadTransactions;
