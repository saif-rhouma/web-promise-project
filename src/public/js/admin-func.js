document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // TOGGLE STATUS
  // ======================
  document.querySelectorAll(".toggle-status").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      try {
        const res = await fetch(`/admin/users/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": document.querySelector('input[name="_csrf"]').value
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // update UI without refresh
        const icon = btn.querySelector("span");

        if (data.status === "ACTIVE") {
          icon.className = "fa fa-ban";
          btn.title = "Block";
        } else {
          icon.className = "fa fa-check";
          btn.title = "Activate";
        }

        btn.setAttribute("data-status", data.status);


        const row = btn.closest("tr");

        // ===== UPDATE STATUS TEXT =====
        const badge = row.querySelector(".status-badge");
        badge.textContent = data.status;

        // ===== UPDATE BADGE COLOR =====
        badge.className = "status-badge"; // reset

        if (data.status === "ACTIVE") {
          badge.classList.add("twm-bg-green");
          btn.querySelector("span").className = "fa fa-ban";
          btn.title = "Block";
        } else {
          badge.classList.add("twm-bg-red");
          btn.querySelector("span").className = "fa fa-check";
          btn.title = "Activate";
        }

      } catch (err) {
        console.error(err);
        alert("Failed to toggle status");
      }
    });
  });

  // ======================
  // DELETE USER
  // ======================
  let selectedUserId = null;
  let selectedRow = null;

  document.querySelectorAll(".delete-user").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedUserId = btn.dataset.id;
      selectedRow = btn.closest("tr");

      document.getElementById("delete-user-name").textContent =
        btn.dataset.name;

      const modal = new bootstrap.Modal(
        document.getElementById("deleteUserModal")
      );

      modal.show();
    });
  });

  document
    .getElementById("confirm-delete-user")
    ?.addEventListener("click", async () => {
      if (!selectedUserId) return;

      try {
        const res = await fetch(`/admin/users/${selectedUserId}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": document.querySelector('input[name="_csrf"]').value,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        selectedRow?.remove();

        bootstrap.Modal.getInstance(
          document.getElementById("deleteUserModal")
        )?.hide();

        selectedUserId = null;
        selectedRow = null;
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    });

  // ======================
  // JOB STATUS CHANGE
  // ======================
  document.querySelectorAll(".job-status-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const jobId = select.dataset.id;
      const status = select.value;

      try {
        const res = await fetch(`/admin/jobs/${jobId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": document.querySelector('input[name="_csrf"]').value,
          },
          body: JSON.stringify({
            status,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        const row = select.closest("tr");
        const badge = row.querySelector(".job-status-badge");

        badge.textContent = status;

        badge.className = "job-status-badge";

        const colors = {
          published: "twm-bg-green",
          draft: "twm-bg-sky",
          archived: "twm-bg-purple",
          blocked: "twm-bg-red",
        };

        badge.classList.add(colors[status]);
      } catch (err) {
        console.error(err);
        alert("Failed to update job status");
      }
    });
  });

  // ======================
  // DELETE JOB 
  // ======================

  let selectedJobId = null;
  let selectedJobRow = null;

  document.querySelectorAll(".delete-job").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedJobId = btn.dataset.id;
      selectedJobRow = btn.closest("tr");

      document.getElementById("delete-job-title").textContent =
        btn.dataset.title;

      new bootstrap.Modal(
        document.getElementById("deleteJobModal")
      ).show();
    });
  });

  document
    .getElementById("confirm-delete-job")
    ?.addEventListener("click", async () => {
      try {
        const res = await fetch(`/admin/jobs/${selectedJobId}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": document.querySelector('input[name="_csrf"]').value,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        selectedJobRow?.remove();

        bootstrap.Modal.getInstance(
          document.getElementById("deleteJobModal")
        )?.hide();
      } catch (err) {
        console.error(err);
        alert("Failed to delete job");
      }
    });
});