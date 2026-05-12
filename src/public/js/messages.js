document.addEventListener('DOMContentLoaded', () => {

  // ======================
  // ELEMENTS
  // ======================

  const messageModal = document.getElementById('sign_up_popup');
  const startupName = document.getElementById('startupName');
  const startupIdInput = document.getElementById('startupId');

  const messageForm = document.getElementById('messageForm');
  const conversationForm = document.getElementById('conversationForm');

  const chatWrap = document.getElementById('msg-chat-wrap');
  const el = document.getElementById('conversation-data');



  function scrollToBottom() {
    if (!chatWrap) return;
    chatWrap.scrollTop = chatWrap.scrollHeight;
  }

  requestAnimationFrame(scrollToBottom);
  // ======================
  // MODAL INIT
  // ======================

  if (messageModal) {

    messageModal.addEventListener('show.bs.modal', (event) => {

      const button = event.relatedTarget;

      const id = button.getAttribute('data-startup-id');
      const name = button.getAttribute('data-startup-name');

      if (startupName) {
        startupName.textContent = name;
      }

      if (startupIdInput) {
        startupIdInput.value = id;
      }

    });

  }

  // ======================
  // SEND MESSAGE FROM MODAL
  // ======================

  if (messageForm) {

    messageForm.addEventListener('submit', async (e) => {

      e.preventDefault();

      const messageText =
        document.getElementById('messageText');

      const payload = {
        receiverId: startupIdInput.value,
        subject: 'Startup Contact',
        message: messageText.value.trim(),
      };

      try {

        const csrfToken =
          document.querySelector('input[name="_csrf"]').value;

        const response =
          await fetch('/startup/contacts/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken,
            },
            body: JSON.stringify(payload),
          });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to send message'
          );
        }

        alert('Message sent successfully');

        messageForm.reset();

        // CLOSE MODAL
        const modalInstance =
          bootstrap.Modal.getInstance(messageModal);

        if (modalInstance) {
          modalInstance.hide();
        }

      } catch (err) {

        console.error(err);

        alert(err.message || 'Failed to send message');

      }

    });

  }

  // ======================
  // SEND MESSAGE FROM CHAT
  // ======================

  if (conversationForm) {

    conversationForm.addEventListener('submit', async (e) => {

      e.preventDefault();

      const messageInput =
        conversationForm.querySelector(
          'textarea[name="message"]'
        );

      const receiverId =
        conversationForm.querySelector(
          'input[name="receiverId"]'
        ).value;

      const message =
        messageInput.value.trim();

      if (!message) return;

      const payload = {
        receiverId,
        subject: 'Startup Contact',
        message,
      };

      try {

        const csrfToken =
          document.querySelector('input[name="_csrf"]').value;

        const response =
          await fetch('/startup/contacts/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken,
            },
            body: JSON.stringify(payload),
          });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to send message'
          );
        }

        // ======================
        // APPEND MESSAGE
        // ======================

        const avatar = el.getAttribute('data-user-avatar');


        const now = new Date();

        const time =
          now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

        chatWrap.insertAdjacentHTML(
          'beforeend',
          `
          <div class="single-user-comment-wrap sigle-user-reply">

            <div class="row justify-content-end">

              <div class="col-xl-9 col-lg-12">

                <div class="single-user-comment-block clearfix">

                  <div class="single-user-com-pic">

                    <img
                      src="${avatar}"
                      alt="avatar"
                    >

                  </div>

                  <div class="single-user-com-text">
                    ${message}
                  </div>

                  <div class="single-user-msg-time">
                    ${time}
                  </div>

                </div>

              </div>

            </div>

          </div>
          `
        );

        // CLEAR INPUT
        messageInput.value = '';

        // AUTO SCROLL
        chatWrap.scrollTop =
          chatWrap.scrollHeight;

      } catch (err) {

        console.error(err);

        alert(err.message || 'Failed to send message');

      }

    });

  }

  // ❗ If chat page is not rendered, stop here
  if (!chatWrap || !el) return;

  const currentUserId = el.getAttribute('data-user-id');

  document.querySelectorAll('.conversation-link')
    .forEach(el => el.classList.remove('active'));

  document.querySelectorAll('.conversation-link')
    .forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        link.classList.add('active');
        const id = link.dataset.id;

        try {
          const res = await fetch(`/startup/messages/${id}/json`);
          const messages = await res.json();

          window.history.pushState({}, '', `/startup/messages/${id}`);

          chatWrap.innerHTML = '';
          const messageInput =
            conversationForm?.querySelector('textarea[name="message"]');

          const sendButton =
            conversationForm?.querySelector('button[type="submit"]');

          // ENABLE INPUT WHEN CONVERSATION IS LOADED
          if (messageInput) {
            messageInput.disabled = false;
            messageInput.placeholder = 'Type a message here';
          }

          if (sendButton) {
            sendButton.disabled = false;
          }

          messages.forEach(msg => {

            const isMine = msg.sender.id == currentUserId;

            chatWrap.insertAdjacentHTML(
              'beforeend',
              `
              <div class="single-user-comment-wrap ${isMine ? 'sigle-user-reply' : ''}">
                <div class="row ${isMine ? 'justify-content-end' : ''}">
                  <div class="col-xl-9 col-lg-12">
                    <div class="single-user-comment-block clearfix">

                      <div class="single-user-com-pic">
                        <img src="/images/${msg.sender.avatar || 'default-cover.jpg'}">
                      </div>

                      <div class="single-user-com-text">
                        ${msg.message}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              `
            );


            conversationForm.querySelector(
              'input[name="receiverId"]'
            ).value = id;


          });

          chatWrap.scrollTop = chatWrap.scrollHeight;

        } catch (err) {
          console.error(err);
        }

      });
    });


});