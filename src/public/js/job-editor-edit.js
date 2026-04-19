function initEditor(editorId, inputId, initialValue = '') {
  const quill = new Quill(`#${editorId}`, {
    theme: 'snow'
  });

  const input = document.getElementById(inputId);

  if (initialValue && initialValue !== '<p><br></p>') {
    quill.clipboard.dangerouslyPasteHTML(initialValue);
  }

  quill.on('text-change', () => {
    input.value = quill.root.innerHTML;
  });

  input.value = quill.root.innerHTML;
}
// INIT ALL EDITORS

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('job-data');

  const job = el ? JSON.parse(el.dataset.job) : {};

  initEditor('rolesEditor', 'rolesInput', job.roles);
  initEditor('offerEditor', 'offersInput', job.offers);
  initEditor('knowledgeEditor', 'knowledgeInput', job.knowledge);
  initEditor('skillEditor', 'skillInput', job.softSkills);
  initEditor('toolsEditor', 'toolsInput', job.tools);
  initEditor('experienceEditor', 'experienceInput', job.preferredExperience);
});