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
});

document.addEventListener('DOMContentLoaded', () => {
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
});