const incomeCategories = [
  "Зарплата",
  "Стипендія",
  "Подарунок",
  "Підробіток",
  "Фріланс",
  "Інше"
];
const expenseCategories = [
  "Їжа",
  "Продукти",
  "Транспорт",
  "Навчання",
  "Одяг",
  "Розваги",
  "Ліки",
  "Інтернет",
  "Комунальні послуги",
  "Інше"
];

let records = JSON.parse(localStorage.getItem("financeRecords")) || [];

const form = document.getElementById("financeForm");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const recordsList = document.getElementById("recordsList");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");

dateInput.valueAsDate = new Date();

function updateCategories() {
  const categories =
    typeInput.value === "income"
      ? incomeCategories
      : expenseCategories;
  categoryInput.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryInput.appendChild(option);
  });
}
function saveRecords() {
  localStorage.setItem("financeRecords", JSON.stringify(records));
}
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
  saveRecords();
  form.reset();
  dateInput.valueAsDate = new Date();
  updateCategories();
  render();
}

function deleteRecord(id) {
  records = records.filter(record => record.id !== id);
  saveRecords();
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
function getFilteredRecords() {
  const searchText = searchInput.value.toLowerCase();
  const selectedType = filterType.value;

  return records.filter(record => {
    const matchesSearch = record.category.toLowerCase().includes(searchText);
    const matchesType = selectedType === "all" || record.type === selectedType;

    return matchesSearch && matchesType;
  });
}
function renderRecords() {
  const filtered = getFilteredRecords();

  if (filtered.length === 0) {
    recordsList.innerHTML = '<div class="empty">Записів не знайдено</div>';
    return;
  }
  recordsList.innerHTML = "";

  filtered.forEach(record => {
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
      <button onclick="deleteRecord(${record.id})">Видалити</button>
    `;

    recordsList.appendChild(div);
  });
}

function render() {
  calculateStats();
  renderRecords();
}

typeInput.addEventListener("change", updateCategories);
form.addEventListener("submit", addRecord);
searchInput.addEventListener("input", renderRecords);
filterType.addEventListener("change", renderRecords);
updateCategories();
render();