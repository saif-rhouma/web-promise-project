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

    // 1. instant local preview
    const tempUrl = URL.createObjectURL(file);
    preview.src = tempUrl;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
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
        // 2. force refresh + prevent cache issues
        preview.src = '/images/'+data.avatar + '?t=' + Date.now();
        // optional: cleanup blob URL
        URL.revokeObjectURL(tempUrl);
      }

    } catch (err) {
      console.error(err);
    } finally {
      loader.classList.add('hidden');
    }
  });
});