/*************************
  ADMIN CONFIG
*************************/
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

let isAdminLoggedIn = false;
let adminSettings = {
  displayNumber: ""
};

/*************************
  HEADER SCROLL BEHAVIOR
*************************/

/*************************
  TERMS & CONDITIONS
*************************/
function checkTermsAccepted() {
  return localStorage.getItem("termsAccepted") === "true";
}

function acceptTerms() {
  localStorage.setItem("termsAccepted", "true");
  localStorage.setItem("termsAcceptedDate", new Date().toISOString());
  document.getElementById("termsModal").style.display = "none";
  document.body.classList.remove("terms-pending");
  console.log("Terms accepted and saved to localStorage");
}

function declineTerms() {
  alert("You must accept the terms and conditions to continue.");
}

function showTermsIfNeeded() {
  if (!checkTermsAccepted()) {
    document.getElementById("termsModal").style.display = "flex";
    document.body.classList.add("terms-pending");
  }
}

/*************************
  ADMIN MODAL
*************************/
function showAdminLogin() {
  document.getElementById("adminModal").style.display = "block";
}

function hideAdminLogin() {
  document.getElementById("adminModal").style.display = "none";
  document.getElementById("loginError").style.display = "none";
}

/*************************
  ADMIN STATE
*************************/
function checkAdminStatus() {
  isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  const adminLink = document.getElementById("adminLoginLink");
  const adminSection = document.getElementById("admin");

  if (!adminLink || !adminSection) return;

  if (isAdminLoggedIn) {
    adminLink.textContent = "Dashboard";
    adminSection.style.display = "block";
  } else {
    adminLink.textContent = "Admin";
    adminSection.style.display = "none";
  }
}

/*************************
  ADMIN SETTINGS
*************************/
function updateNumberDisplay() {
  const box = document.getElementById("numberDisplay");
  if (box) box.textContent = adminSettings.displayNumber || "";
}

function loadAdminSettings() {
  const saved = localStorage.getItem("adminSettings");
  if (saved) {
    adminSettings = JSON.parse(saved);
    document.getElementById("adminNumberDisplay").value =
      adminSettings.displayNumber || "";
    updateNumberDisplay();
  }
}

function saveAdminSettings() {
  localStorage.setItem("adminSettings", JSON.stringify(adminSettings));
  updateNumberDisplay();
}

/*************************
  DOM READY
*************************/
document.addEventListener("DOMContentLoaded", () => {
  showTermsIfNeeded();
  loadAdminSettings();
  checkAdminStatus();
  updateNumberDisplay();

  /* ADMIN NAV CLICK */
  const adminLink = document.getElementById("adminLoginLink");
  const adminSection = document.getElementById("admin");

  if (adminLink) {
    adminLink.addEventListener("click", (e) => {
      e.preventDefault();

      if (localStorage.getItem("adminLoggedIn") === "true") {
        adminSection.style.display = "block";
        adminSection.scrollIntoView({ behavior: "smooth" });
      } else {
        showAdminLogin();
      }
    });
  }

  /* ADMIN LOGIN */
  document
    .getElementById("adminLoginForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const user = adminUsername.value;
      const pass = adminPassword.value;
      const error = document.getElementById("loginError");

      if (
        user === ADMIN_CREDENTIALS.username &&
        pass === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        hideAdminLogin();
        checkAdminStatus();
        alert("Admin login successful");
      } else {
        error.textContent = "Invalid username or password";
        error.style.display = "block";
      }
    });

  /* LOGOUT */
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("adminLoggedIn");
    checkAdminStatus();
    alert("Logged out successfully");
  });

  /* UPDATE NUMBER */
  document.getElementById("updateNumber")?.addEventListener("click", () => {
    if (!isAdminLoggedIn) return;
    adminSettings.displayNumber =
      document.getElementById("adminNumberDisplay").value;
    saveAdminSettings();
    alert("Updated successfully");
  });

  /* MODAL CLOSE */
  document.querySelector(".close")?.addEventListener("click", hideAdminLogin);
  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("adminModal")) {
      hideAdminLogin();
    }
  });
});

/*************************
  KEYBOARD ADMIN ACCESS
*************************/
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    e.preventDefault();
    showAdminLogin();
  }
});

/*************************
  PAYSTACK PAYMENT
*************************/
document
  .getElementById("paymentForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const handler = PaystackPop.setup({
      key: "pk_live_1fcb965c9c209f782b648e36092f6818cc337ab2",
      email: email.value,
      amount: 30000 * 100,
      currency: "NGN",
      ref: "tx-" + Date.now(),
      callback: function (response) {
        alert("Payment successful: " + response.reference);
      },
      onClose: function () {
        alert("Payment closed");
      }
    });

    handler.openIframe();
  });

/*************************
  SMOOTH SCROLL
*************************/
document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});
