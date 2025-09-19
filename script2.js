const { jsPDF } = window.jspdf;
const isFaculty = true; // toggle for faculty or student
let sectionHistory = ["notice"]; // keep track of visited sections

// Change logo text depending on role
document.querySelector("#dashboardTitle").innerText = isFaculty ? "Faculty Dashboard" : "Student Dashboard";

// Hamburger toggle only for mobile
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("hidden");
  }
});

// format date function dd/mm/yyyy
function formatDate(date) {
  let d = new Date(date);
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function showSection(sectionId, event) {
  if (event) event.preventDefault();
  const currentVisible = document.querySelector('.section:not([style*="display: none"])');
  if (currentVisible && currentVisible.id !== sectionId) {
    sectionHistory.push(currentVisible.id);
  }
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
  document.getElementById('section-title').innerText =
    sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('-', ' ');
  document.querySelectorAll('.sidebar nav a').forEach(link => link.classList.remove('active'));
  if (event) event.target.classList.add('active');
}

function goBack() {
  if (sectionHistory.length > 0) {
    const prevSection = sectionHistory.pop();
    showSection(prevSection);
  }
}

function logout() {
  window.location.href = "login.html";
}

// PDF Download for notices
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.notice-card');
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('p').innerText;
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.text(desc, 10, 20);
    doc.save(title.replace(/\s+/g, '_') + ".pdf");
  });
});

// ----- NOTICE FUNCTIONS -----
function editCard(el) {
  const card = el.closest('.notice-card');
  const titleEl = card.querySelector('h3');
  const descEl = card.querySelector('p');
  const editBtn = card.querySelector('.edit-btn');
  const saveBtn = card.querySelector('.save-btn');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = titleEl.innerText;
  input.className = 'inline-input';
  titleEl.replaceWith(input);
  input.focus();

  const textarea = document.createElement('textarea');
  textarea.value = descEl.innerText;
  textarea.className = 'inline-textarea';
  descEl.replaceWith(textarea);

  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline';
}

function saveCard(el) {
  const card = el.closest('.notice-card');
  const input = card.querySelector('.inline-input');
  const textarea = card.querySelector('.inline-textarea');
  const editBtn = card.querySelector('.edit-btn');
  const saveBtn = card.querySelector('.save-btn');
  const dateText = card.querySelector('.date-text');

  if (input && textarea) {
    const newTitle = document.createElement('h3');
    newTitle.innerText = input.value;
    input.replaceWith(newTitle);

    const newDesc = document.createElement('p');
    newDesc.innerText = textarea.value;
    textarea.replaceWith(newDesc);

    // Update date on save (dd/mm/yyyy format)
    const today = formatDate(new Date());
    dateText.innerText = "Updated on: " + today;
  }

  saveBtn.style.display = 'none';
  editBtn.style.display = 'inline';
}

function deleteCard(el) {
  const card = el.closest('.notice-card');
  card.remove();
}

function addCard(sectionId) {
  const section = document.getElementById(sectionId);
  const newCard = document.createElement('div');
  newCard.classList.add('notice-card');
  const today = formatDate(new Date());

  newCard.innerHTML = `
    <div class="notice-header">
      <h3>New ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Card</h3>
      <span class="date-container">
        <i class="fa-solid fa-pencil edit-btn" style="display:${isFaculty ? 'inline' : 'none'};" onclick="editCard(this)"></i>
        <i class="fa-solid fa-floppy-disk save-btn" style="display:none;" onclick="saveCard(this)"></i>
        <i class="fa-solid fa-trash delete-btn" style="display:${isFaculty ? 'inline' : 'none'};" onclick="deleteCard(this)"></i>
        <span class="date-text">Published: ${today}</span>
      </span>
    </div>
    <p>New ${sectionId} description here...</p>
    <button class="download-btn"><i class="fa-solid fa-download"></i> Download</button>
  `;

  section.appendChild(newCard);

  newCard.querySelector('.download-btn').addEventListener('click', () => {
    const title = newCard.querySelector('h3').innerText;
    const desc = newCard.querySelector('p').innerText;
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.text(desc, 10, 20);
    doc.save(title.replace(/\s+/g, '_') + ".pdf");
  });
}

if (isFaculty) {
  document.querySelectorAll('.edit-btn, .delete-btn, .add-btn').forEach(btn => {
    btn.style.display = 'inline';
  });
}

// ----- TIMETABLE FUNCTIONS -----
function createTimetableCard() {
  const today = formatDate(new Date());
  const id = "tt_" + Date.now();

  const timetableData = {
    id,
    title: "New Timetable",
    date: today,
    table: Array.from({length: 7}, () => Array(7).fill(""))
  };

  renderTimetableCard(timetableData);
}

function renderTimetableCard(data) {
  const container = document.getElementById('timetable-container');
  const card = document.createElement('div');
  card.className = 'notice-card';
  card.dataset.id = data.id;

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  card.innerHTML = `
    <div class="notice-header">
      <h3 contenteditable="false">${data.title}</h3>
      <span class="date-container">
        <i class="fa-solid fa-pencil edit-btn" style="display:${isFaculty ? 'inline' : 'none'};" onclick="enableTimetableEdit(this)"></i>
        <i class="fa-solid fa-floppy-disk save-btn" style="display:none;" onclick="saveTimetable(this)"></i>
        <i class="fa-solid fa-trash delete-btn" style="display:${isFaculty ? 'inline' : 'none'};" onclick="deleteTimetable(this)"></i>
        <span class="date-text">Published: ${data.date}</span>
      </span>
    </div>
    <table class="timetable-table">
      <thead>
        <tr>
          <th>Day</th>
          ${Array.from({length: 7}).map((_,i)=>`<th>Period ${i+1}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${days.map((d, row)=>`
          <tr>
            <td>${d}</td>
            ${Array.from({length: 7}).map((_,col)=>`<td contenteditable="false">${data.table?.[row]?.[col]||""}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <button class="download-btn"><i class="fa-solid fa-download"></i> Download</button>
  `;

  container.appendChild(card);

  card.querySelector('.download-btn').addEventListener('click', () => {
    const title = card.querySelector('h3').innerText;
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.save(title.replace(/\s+/g, '_') + ".pdf");
  });
}

function enableTimetableEdit(pencilIcon){
  const card = pencilIcon.closest('.notice-card');
  card.querySelector('h3').setAttribute('contenteditable','true');
  card.querySelectorAll('td').forEach(td => td.setAttribute('contenteditable','true'));
  card.querySelector('.edit-btn').style.display='none';
  card.querySelector('.save-btn').style.display='inline';
}

function saveTimetable(saveIcon){
  const card = saveIcon.closest('.notice-card');
  card.querySelector('h3').setAttribute('contenteditable','false');
  const today = formatDate(new Date());
  card.querySelector('.date-text').innerText = `Updated on: ${today}`;
  card.querySelectorAll('td').forEach(td => td.setAttribute('contenteditable','false'));
  card.querySelector('.save-btn').style.display='none';
  card.querySelector('.edit-btn').style.display='inline';
}

function deleteTimetable(trashIcon){
  const card = trashIcon.closest('.notice-card');
  card.remove();
}
