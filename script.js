const API_URL = "https://script.google.com/macros/s/AKfycbwYeRiCBc4CBqoCte9AKQeAQHvFfylGc6P3DU4JAODpIQoxXeW1hCNF0ED7UtdUrC66/exec";

// On DOM load (in index.html)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    errorEl.textContent = ""; // Clear previous error

    if (!email || !password) {
      errorEl.textContent = "Please fill in both email and password.";
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch(`${API_URL}?action=login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("sessionId", data.sessionId);
        window.location.href = "dashboard.html";
      } else {
        errorEl.textContent = data.message || "Login failed.";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorEl.textContent = "Something went wrong. Please try again.";
    }
  });
});


  // For admission-detail page
  if (document.getElementById("details")) {
    checkDashboardSession();
    getAdmissionDetails();
  }

  // For dashboard page
  if (document.getElementById("studentName") && !document.getElementById("details")) {
    checkDashboardSession();
    fetchStudentName();
  }


// ----------------- Logout -----------------
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("studentName");
  window.location.href = "index.html";
}

// ----------------- Session Check -----------------
function checkSession() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    window.location.href = "dashboard.html";
  }
}

function checkDashboardSession() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("⚠ Session expired. Please login again.");
    logout();
  }
}

// ----------------- Fetch Admission Details -----------------
async function getAdmissionDetails() {
  const userId = localStorage.getItem("userId");
  const detailsBox = document.getElementById("details");
  const message = document.getElementById("message");
  const studentNameEl = document.getElementById("studentName");

  // ✅ Show loading message
  message.textContent = "⏳ Loading... Please wait.";
  detailsBox.innerHTML = ""; // Clear any old data

  if (!userId) {
    message.textContent = "⚠ Session expired. Please login again.";
    logout();
    return;
  }

  try {
    const res = await fetch(`${API_URL}?action=getAdmissionDetails&userId=${userId}`);
    const data = await res.json();

    if (data.success) {
      // ✅ Hide loading message
      message.textContent = "";

      // Set welcome name
      if (studentNameEl) {
        const fullName = `${data.first_name} ${data.last_name}`;
        studentNameEl.textContent = fullName;
        localStorage.setItem("studentName", fullName);
      }

      // Fill admission details
      detailsBox.innerHTML = `
        <div class="detail-row"><strong>ID:</strong><span>${data.student_id}</span></div>
        <div class="detail-row"><strong>Name:</strong><span>${data.first_name} ${data.last_name}</span></div>
        <div class="detail-row"><strong>Father's Name:</strong><span>${data.father_name}</span></div>
        <div class="detail-row"><strong>DOB:</strong><span>${data.dob}</span></div>
        <div class="detail-row"><strong>Gender:</strong><span>${data.gender}</span></div>
        <div class="detail-row"><strong>Email:</strong><span>${data.email}</span></div>
        <div class="detail-row"><strong>Phone:</strong><span>${data.phone}</span></div>
        <div class="detail-row"><strong>Course:</strong><span>${data.course}</span></div>
        <div class="detail-row"><strong>Year:</strong><span>${data.year}</span></div>
        <div class="detail-row"><strong>Admission Date:</strong><span>${data.admission_date}</span></div>
      `;
    } else {
      message.textContent = data.message || "Student not found!";
    }
  } catch (err) {
    message.textContent = "❌ Error fetching data. Please try again.";
    console.error("Fetch error:", err);
  }
}

// ----------------- Fetch Cached/Fresh Name -----------------
async function fetchStudentName() {
  const userId = localStorage.getItem("userId");
  const studentNameEl = document.getElementById("studentName");

  if (!userId || !studentNameEl) {
    logout();
    return;
  }

  // Show cached name
  const cachedName = localStorage.getItem("studentName");
  if (cachedName) {
    studentNameEl.textContent = cachedName;
  }

  // Fetch latest
  try {
    const res = await fetch(`${API_URL}?action=getAdmissionDetails&userId=${userId}`);
    const data = await res.json();

    if (data.success) {
      const fullName = `${data.first_name} ${data.last_name}`;
      studentNameEl.textContent = fullName;
      localStorage.setItem("studentName", fullName);
    }
  } catch (err) {
    console.error("Fetch name error:", err);
  }
}
