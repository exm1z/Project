let records = [];

const form = document.getElementById("financeForm");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const recordsList = document.getElementById("recordsList");

dateInput.valueAsDate = new Date();

function formatMoney(value) {
  return value.toLocaleString("uk-UA") + " грн";
}

function addRecord(event) {
  event.preventDefault();
  const record = {
    id: Date.now(),
    type: typeInput.value,
    category: categoryInput.value,
    amount: Number(amountInput.value),
    date: dateInput.value
  };
  if (!record.category || record.amount <= 0 || !record.date) {
    alert("Заповніть усі поля правильно.");
    return;
  }
  records.push(record);

  form.reset();
  dateInput.valueAsDate = new Date();
  render();
}

function calculateStats() {
  let income = 0;
  let expense = 0;
  records.forEach(record => {
    if (record.type === "income") {
      income += record.amount;
    } else {
      expense += record.amount;
    }
  });
  document.getElementById("totalIncome").textContent = formatMoney(income);
  document.getElementById("totalExpense").textContent = formatMoney(expense);
  document.getElementById("balance").textContent = formatMoney(income - expense);
  document.getElementById("recordsCount").textContent = records.length;
}
function renderRecords() {
  if (records.length === 0) {
    recordsList.innerHTML = '<div class="empty">Записів поки немає</div>';
    return;
  }
  recordsList.innerHTML = "";

  records.forEach(record => {
    const div = document.createElement("div");
    div.className =
      record.type === "income"
        ? "record income-record"
        : "record expense-record";
    div.innerHTML = `
      <strong>${record.category}</strong>
      <span>${record.type === "income" ? "Дохід" : "Витрата"}</span>
      <span>${record.type === "income" ? "+" : "-"}${formatMoney(record.amount)}</span>
      <span>${record.date}</span>
    `;
    recordsList.appendChild(div);
  });
}

function render() {
  calculateStats();
  renderRecords();
}

form.addEventListener("submit", addRecord);
render();