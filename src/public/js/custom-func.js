function addBullet(containerId, name) {
  const container = document.getElementById(containerId);

  const div = document.createElement('div');
  div.className = 'bullet-item m-t10';

  div.innerHTML = `
      <input class="form-control m-b10" name="${name}" type="text" placeholder="Add item" />
    `;

  container.appendChild(div);
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-delete-job').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;

      try {
        const res = await fetch(`/startup/jobs/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'x-csrf-token': document.querySelector('input[name="_csrf"]').value,
          },
        });

        if (res.ok) {
          location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });



  document.querySelectorAll('.toggle-status').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;

      console.log('clicked', id);

      try {
        const res = await fetch(`/startup/jobs/${id}/status`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'x-csrf-token': document.querySelector('input[name="_csrf"]').value,
          },
        });

        if (res.ok) {
          location.reload();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });


  // const buttons = document.querySelectorAll('.btn-status');

  // buttons.forEach(btn => {
  //   btn.addEventListener('click', async () => {
  //     const id = btn.dataset.id;
  //     const status = btn.dataset.status;

  //     try {
  //       const res = await fetch(`/startup/applications/${id}/status`, {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ status }),
  //       });

  //       if (res.ok) {
  //         location.reload();
  //       } else {
  //         alert('Failed to update');
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       alert('Error');
  //     }
  //   });
  // });


  const selects = document.querySelectorAll('.application-status');

  selects.forEach(select => {
    select.addEventListener('change', async () => {
      const id = select.dataset.id;
      const status = select.value;

      try {
        const res = await fetch(`/startup/applications/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        if (res.ok) {
          location.reload();
        } else {
          alert('Failed to update');
        }
      } catch (err) {
        console.error(err);
        alert('Error');
      }
    });
  });

  const form = document.querySelector("form");

  const fields = {
    title: form.querySelector('[name="title"]'),
    description: form.querySelector('[name="description"]'),
    location: form.querySelector('[name="location"]'),
    category: form.querySelector('[name="category"]'),
    type: form.querySelector('[name="type"]'),
    cover: form.querySelector('[name="cover"]'),
  };

  form.addEventListener("submit", (e) => {
    clearErrors();

    
    let isValid = true;

    // Title
    if (!fields.title.value.trim()) {
      showError(fields.title, "Job title is required");
      isValid = false;
    } else if (fields.title.value.length < 3) {
      showError(fields.title, "Minimum 3 characters");
      isValid = false;
    }

    // Description
    if (!fields.description.value.trim()) {
      showError(fields.description, "Description is required");
      isValid = false;
    } else if (fields.description.value.length < 20) {
      showError(fields.description, "Minimum 20 characters");
      isValid = false;
    }

    // Location
    if (!fields.location.value.trim()) {
      showError(fields.location, "Location is required");
      isValid = false;
    }

    // Selects
    if (!fields.category.value) {
      showError(fields.category, "Select a category");
      isValid = false;
    }

    if (!fields.type.value) {
      showError(fields.type, "Select a job type");
      isValid = false;
    }

    const isEdit = !!job && !!job.id;
const hasExistingCover = !!job?.cover;

    // Cover required
    const coverInput = fields.cover;
const cover = coverInput.files[0];

// =====================
// CREATE MODE
// =====================
if (!isEdit) {
  if (!cover) {
    showError(coverInput, "Cover image is required");
    isValid = false;
  }
}

// =====================
// EDIT MODE
// =====================
if (isEdit) {
  // Only validate if user uploads a NEW file
  if (cover) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(cover.type)) {
      showError(coverInput, "Only JPG, PNG or WEBP allowed");
      isValid = false;
    }

    if (cover.size > 2 * 1024 * 1024) {
      showError(coverInput, "Max size is 2MB");
      isValid = false;
    }
  }

  // If no new file AND no existing cover → invalid
  if (!cover && !hasExistingCover) {
    showError(coverInput, "Cover image is required");
    isValid = false;
  }
}

    if (!cover) {
      showError(fields.cover, "Cover image is required");
      isValid = false;
    } else {
      const allowed = ["image/jpeg", "image/png", "image/webp"];

      if (!allowed.includes(cover.type)) {
        showError(fields.cover, "Only JPG, PNG or WEBP allowed");
        isValid = false;
      }

      if (cover.size > 2 * 1024 * 1024) {
        showError(fields.cover, "Max size is 2MB");
        isValid = false;
      }
    }

   if (!isValid) {
  console.log("FORM BLOCKED"); // 👈 check this in console
  e.preventDefault();
  return;
}

    // Sync editors before submit
    syncEditors();
  });

  // Real-time validation (on blur)
  Object.values(fields).forEach((input) => {
  input.addEventListener("blur", () => {
    clearError(input);

    // Special case: file input
    if (input.type === "file") {
      if (!input.files || input.files.length === 0) {
        showError(input, "This field is required");
      }
      return;
    }

    if (!input.value.trim()) {
      showError(input, "This field is required");
    }
  });
});

});

function showError(input, message) {
  input.classList.add("is-invalid");

  // remove existing error
  const existing = input.closest(".form-group")?.querySelector(".error-msg");
  if (existing) existing.remove();

  const error = document.createElement("small");
  error.className = "error-msg text-danger";
  error.innerText = message;

  // append inside form-group (safer for all inputs)
  input.closest(".form-group").appendChild(error);
}

function clearError(input) {
  input.classList.remove("is-invalid");

  const error = input.parentElement.querySelector(".error-msg");
  if (error) error.remove();
}

function clearErrors() {
  document.querySelectorAll(".error-msg").forEach((el) => el.remove());
  document.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
}