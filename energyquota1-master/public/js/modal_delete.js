// Delete tenant modal - single setup, no duplicate listeners
let currentUserId = null;

const modal = document.getElementById("myModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

if (modal && confirmBtn && cancelBtn) {
  document.querySelectorAll(".deleteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      currentUserId = button.getAttribute("data-user-id");
      modal.classList.add("show");
    });
  });

  cancelBtn.addEventListener("click", function () {
    closeModal();
  });

  confirmBtn.addEventListener("click", function () {
    if (!currentUserId) return;
    const data = { user_id: currentUserId };
    fetch("/tenants/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => {
        closeModal();
        location.reload();
      })
      .catch((err) => {
        console.error("Error deleting tenant:", err);
        closeModal();
      });
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  if (modal) {
    modal.classList.remove("show");
    currentUserId = null;
  }
}
