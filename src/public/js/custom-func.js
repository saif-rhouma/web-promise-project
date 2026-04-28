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

});