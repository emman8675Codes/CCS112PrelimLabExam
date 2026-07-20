const API_STUDENTS = "api/students.php";

document.addEventListener("DOMContentLoaded", fetchStudents);

async function fetchStudents() {
  const response = await fetch(API_STUDENTS);
  const students = await response.json();
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  students.forEach((s) => {
    tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.course}</td>
                <td>
                    <button class="btn-action" onclick="openLoanWorkspace(${s.id}, '${s.name}')">Loans</button>
                    <button class="btn-edit" onclick="editStudent(${s.id}, '${s.name}', '${s.email}', '${s.course}')">Edit</button>
                    <button class="btn-delete" onclick="deleteStudent(${s.id})">Delete</button>
                </td>
            </tr>
        `;
  });
}

document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    course: document.getElementById("course").value,
  };
  let method = "POST";

  if (id) {
    payload.id = id;
    method = "PUT";
  }

  await fetch(API_STUDENTS, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  resetForm();
  fetchStudents();
});

function editStudent(id, name, email, course) {
  document.getElementById("studentId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("course").value = course;
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

async function deleteStudent(id) {
  if (confirm("Delete student?")) {
    await fetch(API_STUDENTS, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchStudents();
  }
}

function resetForm() {
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
  document.getElementById("submitBtn").innerText = "Add Student";
  document.getElementById("cancelBtn").style.display = "none";
}

function showStudentSection() {
  document.getElementById("student-section").style.display = "block";
  document.getElementById("loan-section").style.display = "none";
  document.getElementById("payment-section").style.display = "none";
}
