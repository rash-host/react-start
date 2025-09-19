// attendance.js

function addAttendanceCard() {
  const container = document.getElementById("attendance-container");

  // Create card wrapper
  const card = document.createElement("div");
  card.classList.add("notice-card");

  // Current date for publish
  const today = new Date();
  const publishDate = String(today.getDate()).padStart(2, "0") + "/" + String(today.getMonth() + 1).padStart(2, "0") + "/" + today.getFullYear();

  // Header with edit/delete buttons
  const header = document.createElement("div");
  header.classList.add("notice-header");
  header.innerHTML = `
    <h3 contenteditable="false">Month Attendance</h3>
    <span class="date-container">
      <i class="fa-solid fa-pencil edit-btn" onclick="editAttendanceCard(this)"></i>
      <i class="fa-solid fa-floppy-disk save-btn" style="display:none;" onclick="saveAttendanceCard(this)"></i>
      <i class="fa-solid fa-trash delete-btn" onclick="deleteAttendanceCard(this)"></i>
      <span class="date-text">Published: ${publishDate}</span>
    </span>
  `;

  // Attendance table
  const table = document.createElement("table");
  table.classList.add("attendance-table");

  // Header row
  let headerRow = "<tr><th>Date</th>";
  for (let i = 1; i <= 7; i++) {
    headerRow += `<th>Period ${i}</th>`;
  }
  headerRow += "</tr>";
  table.innerHTML = headerRow;

  // Rows for 1-30 days
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  for (let day = 1; day <= 30; day++) {
    const dd = String(day).padStart(2, "0");
    const dateVal = `${dd}/${String(month).padStart(2, "0")}/${year}`;
    let row = `<tr><td contenteditable="false">${dateVal}</td>`;
    for (let p = 1; p <= 7; p++) {
      row += `<td contenteditable="false"></td>`;
    }
    row += "</tr>";
    table.innerHTML += row;
  }

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.classList.add("download-btn");
  downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i> Download`;
  downloadBtn.addEventListener("click", () => {
    const doc = new jsPDF();
    let y = 10;
    const title = card.querySelector("h3").innerText;
    doc.text(title, 10, y);
    y += 10;
    doc.text("[Attendance Data]", 10, y);
    doc.save(title.replace(/\s+/g, "_") + ".pdf");
  });

  // Append to card
  card.appendChild(header);
  card.appendChild(table);
  card.appendChild(downloadBtn);

  // Add to container
  container.appendChild(card);
}

function editAttendanceCard(icon) {
  const card = icon.closest(".notice-card");
  const title = card.querySelector("h3");
  const saveBtn = card.querySelector(".save-btn");
  const table = card.querySelector("table");

  title.setAttribute("contenteditable", "true");
  table.querySelectorAll("td").forEach(td => td.setAttribute("contenteditable", "true"));
  title.focus();

  icon.style.display = "none";
  saveBtn.style.display = "inline-block";
}

function saveAttendanceCard(icon) {
  const card = icon.closest(".notice-card");
  const title = card.querySelector("h3");
  const editBtn = card.querySelector(".edit-btn");
  const table = card.querySelector("table");

  title.setAttribute("contenteditable", "false");
  table.querySelectorAll("td").forEach(td => td.setAttribute("contenteditable", "false"));

  // Update publish date
  const today = new Date();
  const updateDate = String(today.getDate()).padStart(2, "0") + "/" + String(today.getMonth() + 1).padStart(2, "0") + "/" + today.getFullYear();
  card.querySelector(".date-text").innerText = "Updated on: " + updateDate;

  icon.style.display = "none";
  editBtn.style.display = "inline-block";
}

function deleteAttendanceCard(icon) {
  const card = icon.closest(".notice-card");
  card.remove();
}
