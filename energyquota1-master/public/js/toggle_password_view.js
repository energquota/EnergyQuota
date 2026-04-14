function toggleOldPassword() {
  var passwordInput = document.getElementById("old_password");
  var type = passwordInput.type;
  passwordInput.type = type === "password" ? "text" : "password";
  var toggleBtn = document.getElementById("toggle-btn-old");
  toggleBtn.src =
    type === "password" ? "/images/eye-open.png" : "/images/eye-close.png";
}

function togglePassword() {
  var passwordInput = document.getElementById("password");
  var type = passwordInput.type;
  passwordInput.type = type === "password" ? "text" : "password";
  var toggleBtn = document.getElementById("toggle-btn");
  toggleBtn.src =
    type === "password" ? "/images/eye-open.png" : "/images/eye-close.png";
}

function togglePasswordConfirm() {
  var passwordInput = document.getElementById("confirm_password");
  var type = passwordInput.type;
  passwordInput.type = type === "password" ? "text" : "password";
  var toggleBtn = document.getElementById("toggle-btn-confirm");
  toggleBtn.src =
    type === "password" ? "/images/eye-open.png" : "/images/eye-close.png";
}
