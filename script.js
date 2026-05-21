const incomeCategories = [
  "Зарплата",
  "Стипендія",
  "Подарунок",
  "Підробіток",
  "Продаж речей",
  "Фріланс",
  "Премія",
  "Інвестиції",
  "Повернення боргу",
  "Інше"
];
const expenseCategories = [
  "Їжа",
  "Продукти",
  "Кафе",
  "Транспорт",
  "Таксі",
  "Навчання",
  "Книги",
  "Одяг",
  "Взуття",
  "Розваги",
  "Спорт",
  "Ліки",
  "Здоров'я",
  "Інтернет",
  "Мобільний зв'язок",
  "Комунальні послуги",
  "Оренда",
  "Подорожі",
  "Подарунки",
  "Техніка",
  "Домашні тварини",
  "Інше"
];

let records = JSON.parse(localStorage.getItem("financeRecords")) || [];
let editId = null;

const form = document.getElementById("financeForm");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const commentInput = document.getElementById("comment");
const recordsList = document.getElementById("recordsList");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filterType");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");

dateInput.valueAsDate = new Date();

function updateCategories(selectedCategory = "") {
  const categories =
    typeInput.value === "income"
      ? incomeCategories
      : expenseCategories;
  categoryInput.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    if (category === selectedCategory) {
      option.selected = true;
    }

    categoryInput.appendChild(option);
  });
}
function saveRecords() {
  localStorage.setItem("financeRecords", JSON.stringify(records));
}
function formatMoney(value) {
  return value.toLocaleString("uk-UA") + " грн";
}
function resetForm() {
  editId = null;

  form.reset();
  dateInput.valueAsDate = new Date();

  formTitle.textContent = "Додати операцію";
  submitBtn.textContent = "Додати";
  cancelEditBtn.style.display = "none";

  updateCategories();
}
function addOrUpdateRecord(event) {
  event.preventDefault();

  const recordData = {
    type: typeInput.value,
    category: categoryInput.value,
    amount: Number(amountInput.value),
    date: dateInput.value,
    comment: commentInput.value.trim()
  };

  if (!recordData.category || recordData.amount <= 0 || !recordData.date) {
    alert("Заповніть усі поля правильно.");
    return;
  }

  if (editId) {
    records = records.map(record => {
      if (record.id === editId) {
        return {
          id: editId,
          ...recordData
        };
      }
      return record;
    });
  } else {
    records.push({
      id: Date.now(),
      ...recordData
    });
  }
  saveRecords();
  resetForm();
  render();
}

function startEdit(id) {
  const record = records.find(item => item.id === id);

  if (!record) {
    return;
  }
  editId = id;
  typeInput.value = record.type;
  updateCategories(record.category);
  amountInput.value = record.amount;
  dateInput.value = record.date;
  commentInput.value = record.comment;
  formTitle.textContent = "Редагувати операцію";
  submitBtn.textContent = "Зберегти";
  cancelEditBtn.style.display = "block";
  window.scrollTo({
    top: 220,
    behavior: "smooth"
  });
}

function deleteRecord(id) {
  if (confirm("Видалити цей запис?")) {
    records = records.filter(record => record.id !== id);

    saveRecords();
    render();
  }
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
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedType = filterType.value;
  const from = dateFrom.value;
  const to = dateTo.value;

  return records.filter(record => {
    const text = (record.category + " " + record.comment).toLowerCase();
    const matchesSearch = text.includes(searchText);
    const matchesType = selectedType === "all" || record.type === selectedType;
    const matchesFrom = !from || record.date >= from;
    const matchesTo = !to || record.date <= to;

    return matchesSearch && matchesType && matchesFrom && matchesTo;
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
      <div>
        <strong>${record.category}</strong>
        <small>${record.comment || "Без коментаря"}</small>
      </div>
      <span>${record.type === "income" ? "Дохід" : "Витрата"}</span>
      <strong class="${record.type === "income" ? "income" : "expense"}">
        ${record.type === "income" ? "+" : "-"}${formatMoney(record.amount)}
      </strong>
      <span>${record.date}</span>
      <div class="record-buttons">
        <button class="secondary" onclick="startEdit(${record.id})">Змінити</button>
        <button class="delete-btn" onclick="deleteRecord(${record.id})">Видалити</button>
      </div>
    `;

    recordsList.appendChild(div);
  });
}

function render() {
  calculateStats();
  renderRecords();
}

typeInput.addEventListener("change", () => updateCategories());
form.addEventListener("submit", addOrUpdateRecord);
cancelEditBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderRecords);
filterType.addEventListener("change", renderRecords);
dateFrom.addEventListener("change", renderRecords);
dateTo.addEventListener("change", renderRecords);
updateCategories();
render();