// No backend is needed anymore
document.addEventListener("DOMContentLoaded", () => {

  // ✅ INIT USERS "FILE" IN LOCALSTORAGE
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Add default users if not present
  if (!users.some(u => u.username === "admin")) {
    users.push({ username: "admin", name: "Admin User", password: "1234", role: "faculty" });
  }
  if (!users.some(u => u.username === "student")) {
    users.push({ username: "student", name: "Student User", password: "1234", role: "student" });
  }
  localStorage.setItem("users", JSON.stringify(users));

  // REGISTER FORM
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("regUsername").value.trim();
      const name = document.getElementById("regName").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const confirmPassword = document.getElementById("regConfirmPassword").value.trim();
      const msg = document.getElementById("regMsg");

      if (password !== confirmPassword) {
        msg.textContent = "Passwords do not match!";
        return;
      }

      // ✅ Add to users "file"
      let usersList = JSON.parse(localStorage.getItem("users")) || [];
      usersList.push({ username, name, password, role: "student" }); // default role = student
      localStorage.setItem("users", JSON.stringify(usersList));

      msg.style.color = "green";
      msg.textContent = "Registration successful! You can now login.";
    });
  }

  // LOGIN FORM
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("errorMsg");

      // ✅ Check hardcoded users
      if (username === "admin" && password === "1234") {
        localStorage.setItem("username", "admin");
        localStorage.setItem("loginAs", "faculty");
        window.location.href = "dashboard.html";
        return;
      } else if (username === "student" && password === "1234") {
        localStorage.setItem("username", "student");
        localStorage.setItem("loginAs", "student");
        window.location.href = "dashboard.html";
        return;
      }

      // ✅ Check users "file"
      let allUsers = JSON.parse(localStorage.getItem("users")) || [];
      let foundUser = allUsers.find(u => u.username === username && u.password === password);
      if (foundUser) {
        localStorage.setItem("username", foundUser.username);
        localStorage.setItem("loginAs", foundUser.role || "student");
        window.location.href = "dashboard.html";
        return;
      }

      // ✅ Registered users fallback
      const userData = localStorage.getItem("reg_" + username);
      if (userData) {
        const user = JSON.parse(userData);
        if (user.password === password) {
          localStorage.setItem("username", username);
          localStorage.setItem("loginAs", "student"); // fallback default
          window.location.href = "dashboard.html";
          return;
        }
      }

      errorMsg.textContent = "Invalid Username or Password";
    });
  }
});
