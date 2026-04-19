document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('avatarInput');
  const button = document.getElementById('avatarBtn');
  const preview = document.getElementById('avatarPreview');
  const loader = document.getElementById('avatarLoading');

  button.addEventListener('click', () => {
    input.click();
  });

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    // preview instantly
    preview.src = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      // 🔄 SHOW LOADER
      loader.classList.remove('hidden');

      const res = await fetch('/startup/profile/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'x-csrf-token': document.querySelector('input[name="_csrf"]').value,
        },
      });

      const data = await res.json();

      if (data.avatar) {
        preview.src = data.avatar;
      }
    } catch (err) {
      console.error(err);
    } finally {
      // 🔄 HIDE LOADER
      loader.classList.add('hidden');
    }
  });
});