// ---- Initialization ----
let allShipments = JSON.parse(localStorage.getItem("shipments") || "[]");

// Redirect to login if not authenticated
if (
  !localStorage.getItem("loggedIn") &&
  !location.pathname.endsWith("login.html")
) {
  location.href = "login.html";
}

// ---- Common Functions ----
function saveAll() {
  localStorage.setItem("shipments", JSON.stringify(allShipments));
}

function updateDashboard() {
  const total = allShipments.length;
  const delivered = allShipments.filter((s) => s.status === "Delivered").length;
  const inTransit = total - delivered;
  if (document.getElementById("totalCount")) {
    document.getElementById("totalCount").textContent = total;
    document.getElementById("deliveredCount").textContent = delivered;
    document.getElementById("inTransitCount").textContent = inTransit;
  }
  return { delivered, inTransit };
}
function renderChart() {
  const { delivered, inTransit } = updateDashboard();
  const ctx = document.getElementById("statusChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Delivered", "In Transit"],
      datasets: [{ data: [delivered, inTransit] }],
    },
    options: { responsive: true },
  });
}

// ---- home Page ----
if (location.pathname.endsWith("home.html") || location.pathname === "/") {
  renderChart();
}

// ---- List Page ----
if (location.pathname.endsWith("list.html")) {
  const tbody = document.querySelector("#shipmentsTable tbody");
  function renderTable(data = allShipments) {
    tbody.innerHTML = "";
    data.forEach((s, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.id}</td><td>${s.sender}</td><td>${s.receiver}</td>
        <td>${s.destination}</td><td>${s.weight}</td><td>${s.status}</td>
        <td class="">
          <button class="btn btn-sm btn-info" data-edit="${idx}">Edit</button>
          <button class="btn btn-sm btn-danger" data-delete="${idx}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }
  renderTable();

  // Search
  document.getElementById("searchBar").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    renderTable(
      allShipments.filter(
        (s) =>
          s.id.toLowerCase().includes(term) ||
          s.sender.toLowerCase().includes(term)
      )
    );
  });

  // Sort
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    const [field, dir] = e.target.value.split("-");
    allShipments.sort((a, b) =>
      dir === "asc"
        ? a[field].toString().localeCompare(b[field].toString())
        : b[field].toString().localeCompare(a[field].toString())
    );
    saveAll();
    renderTable();
  });

  // Delegate Edit/Delete
  document.getElementById("shipmentsTable").addEventListener("click", (e) => {
    if (e.target.dataset.delete !== undefined) {
      if (confirm("Delete this shipment?")) {
        allShipments.splice(+e.target.dataset.delete, 1);
        saveAll();
        renderTable();
        renderChart();
      }
    }
    if (e.target.dataset.edit !== undefined) {
      localStorage.setItem("editIndex", e.target.dataset.edit);
      location.href = "add.html";
    }
  });
}

// ---- Add/Edit Page ----
if (location.pathname.endsWith("add.html")) {
  const form = document.getElementById("shipmentForm");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const editIndex = localStorage.getItem("editIndex");

  // Pre-fill if editing
  if (editIndex !== null) {
    const s = allShipments[editIndex];
    document.getElementById("formTitle").textContent = "Edit Shipment";
    [
      "shipmentId",
      "sender",
      "receiver",
      "destination",
      "weight",
      "status",
    ].forEach((id) => (document.getElementById(id).value = s[id]));
  }

  // Enable save only when valid
  form.addEventListener("input", () => {
    saveBtn.disabled = !form.checkValidity();
  });

  // Save handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newData = {
      id: document.getElementById("shipmentId").value,
      sender: document.getElementById("sender").value,
      receiver: document.getElementById("receiver").value,
      destination: document.getElementById("destination").value,
      weight: document.getElementById("weight").value,
      status: document.getElementById("status").value,
    };
    if (editIndex !== null) {
      allShipments[editIndex] = newData;
      localStorage.removeItem("editIndex");
    } else {
      allShipments.push(newData);
    }
    saveAll();
    renderChart();
    location.href = "list.html";
  });

  cancelBtn.addEventListener("click", () => {
    localStorage.removeItem("editIndex");
    location.href = "list.html";
  });
}

// ---- Keyboard Shortcut (Ctrl+S) ----
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    const form = document.getElementById("shipmentForm");
    if (form && form.checkValidity()) form.requestSubmit();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const yr = new Date().getFullYear();
  const el = document.getElementById("year");
  if (el) el.textContent = yr;
});
