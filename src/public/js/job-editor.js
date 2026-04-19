document.addEventListener("DOMContentLoaded", function () {
  const rolesEditor = new Quill("#rolesEditor", {
    theme: "snow",
    placeholder: "Write roles & responsibilities..."
  });

  const offersEditor = new Quill("#offerEditor", {
    theme: "snow",
    placeholder: "What you offer..."
  });

    const knowledgeEditor = new Quill("#knowledgeEditor", {
    theme: "snow",
    placeholder: "Tools used..."
  });

      const skillEditor = new Quill("#skillEditor", {
    theme: "snow",
    placeholder: "Tools used..."
  });

  const toolsEditor = new Quill("#toolsEditor", {
    theme: "snow",
    placeholder: "Tools used..."
  });

    const experienceEditor = new Quill("#experienceEditor", {
    theme: "snow",
    placeholder: "Tools used..."
  });

  const form = document.querySelector("form");

  form.addEventListener("submit", function () {
    document.getElementById("rolesInput").value = rolesEditor.root.innerHTML;
    document.getElementById("offersInput").value = offersEditor.root.innerHTML;
    document.getElementById("knowledgeInput").value = knowledgeEditor.root.innerHTML;
    document.getElementById("skillInput").value = skillEditor.root.innerHTML;
    document.getElementById("toolsInput").value = toolsEditor.root.innerHTML;
    document.getElementById("experienceInput").value = experienceEditor.root.innerHTML;
  });
});
// function initEditor(editorId, inputId, initialValue = '') {
//   const quill = new Quill(`#${editorId}`, {
//     theme: 'snow'
//   });

//   // set initial content
//   if (initialValue) {
//     quill.root.innerHTML = initialValue;
//   }

//   // sync with hidden input
//   const input = document.getElementById(inputId);

//   quill.on('text-change', () => {
//     input.value = quill.root.innerHTML;
//   });

//   // set initial value to input too
//   input.value = quill.root.innerHTML;
// }

// // INIT ALL EDITORS
// // get data from window
// const job = window.__JOB__ || {};

// initEditor('rolesEditor', 'rolesInput', job.roles);
// initEditor('offerEditor', 'offersInput', job.offers);
// initEditor('knowledgeEditor', 'knowledgeInput', job.knowledge);
// initEditor('skillEditor', 'skillInput', job.softSkills);
// initEditor('toolsEditor', 'toolsInput', job.tools);
// initEditor('experienceEditor', 'experienceInput', job.preferredExperience);