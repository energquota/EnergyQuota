const myFunction = () => {
  window.location.href = "/dashboard";
};

const viewTenants = () => {
  window.location.href = "/tenants";
};

var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
  el.classList.toggle("toggled");
};
