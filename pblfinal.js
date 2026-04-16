let totalAmount = 0;
let transactions = [];

const balanceEl = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date");
const monthlyTotal = document.getElementById("monthly-total");

form.addEventListener("submit", addTransaction);

function setTotalAmount() {
    const amountInputField = document.getElementById('totalAmount');
    const amountInput = amountInputField.value;

    if (amountInput === "" || isNaN(amountInput)) {
        alert("Please enter a valid amount.");
        return;
    }

    totalAmount = parseFloat(amountInput);

    const today = new Date().toISOString().split('T')[0];
    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: "Initial Budget",
        amount: +totalAmount,
        date: today
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateChart();

    amountInputField.value = '';
}

function addTransaction(e) {
    e.preventDefault();
    const desc = text.value;
    const amt = +amount.value;
    const date = dateInput.value;

    if (desc.trim() === '' || isNaN(amt) || date === "") {
        alert("Please fill in all fields correctly.");
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: desc,
        amount: -Math.abs(amt),
        date
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateChart();
    form.reset();
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <small>${transaction.date}</small>
    `;
    list.appendChild(item);
}

function addSaving() {
    const savingInput = document.getElementById('saving-amount');
    const amt = parseFloat(savingInput.value);

    if (isNaN(amt) || amt <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: "Savings Added",
        amount: +amt,
        date: today
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    savingInput.value = '';
    updateValues();
    updateChart();
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const balance = amounts.reduce((acc, item) => acc + item, 0);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `₹${balance.toFixed(2)}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
    monthlyTotal.innerText = `₹${expense}`;
}

const chart = new Chart(document.getElementById("chart").getContext("2d"), {
    type: "doughnut",
    data: {
        labels: ["Income/Savings", "Expenses"],
        datasets: [{
            label: "Money Flow",
            data: [0, 0],
            backgroundColor: ["#10b981", "#ef4444"],
            borderWidth: 1,
            borderColor: "rgba(30, 41, 59, 1)",
            hoverOffset: 4
        }],
    },
    options: {
        responsive: true,
        animation: { animateScale: true },
        plugins: {
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: 'Income vs Expenses',
                font: { size: 16 }
            }
        }
    }
});

function updateChart() {
    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    chart.data.datasets[0].data = [income, expense];
    chart.update();
}

function printPage() {
    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expense;

    let transactionsHTML = '';
    transactions.forEach(transaction => {
        transactionsHTML += `
            <li style="border-right: 5px solid ${transaction.amount < 0 ? 'red' : 'green'};">
                ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'}₹${Math.abs(transaction.amount).toFixed(2)}</span>
                <small>${transaction.date}</small>
            </li>
        `;
    });

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>Expense Tracker Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { text-align: center; }
                    .summary { display: flex; justify-content: space-between; margin: 20px 0; }
                    .summary div { flex: 1; text-align: center; }
                    ul { list-style: none; padding: 0; }
                    li { padding: 8px; margin: 5px 0; border-radius: 4px; }
                    .chart-container { width: 80%; margin: 20px auto; }
                    .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
                </style>
            </head>
            <body>
                <h2>Expense Tracker Report</h2>
                <div class="summary">
                    <div>
                        <h4>Total Income/Savings</h4>
                        <p>₹${income.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Total Expenses</h4>
                        <p>₹${expense.toFixed(2)}</p>
                    </div>
                    <div>
                        <h4>Current Balance</h4>
                        <p>₹${balance.toFixed(2)}</p>
                    </div>
                </div>

                <h3>Transaction History</h3>
                <ul>${transactionsHTML}</ul>

                <div class="chart-container">
                    <canvas id="printChart" height="250"></canvas>
                </div>

                <div class="footer">
                    Generated on ${new Date().toLocaleDateString()}
                </div>

                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>
                    const ctx = document.getElementById('printChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Income/Savings', 'Expenses'],
                            datasets: [{
                                data: [${income}, ${expense}],
                                backgroundColor: ['#10b981', '#ef4444'],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: { position: 'bottom' },
                                title: {
                                    display: true,
                                    text: 'Income vs Expenses'
                                }
                            }
                        }
                    });
                </script>
            </body>
        </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
}

window.onload = function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
};

function submitExpense(e) {
    e.preventDefault();
    addTransaction(e);
}
