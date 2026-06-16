
// Annotation persistence
function saveAnnotation(pid) {
  const ta = document.getElementById('annotation-' + pid);
  if (ta) localStorage.setItem('mockup_annotation_' + pid, ta.value);
}
function loadAnnotation(pid) {
  const ta = document.getElementById('annotation-' + pid);
  if (ta) ta.value = localStorage.getItem('mockup_annotation_' + pid) || '';
}
function exportAnnotations() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('mockup_annotation_')) {
      const pid = k.replace('mockup_annotation_', '');
      const val = localStorage.getItem(k);
      if (val && val.trim()) data[pid] = val;
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'anotacoes_mockup.json'; a.click();
}

// Index filter
function filterByPerfil(perfil) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('[data-perfil="' + perfil + '"]');
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.page-card').forEach(card => {
    if (perfil === 'ALL') { card.style.display = ''; return; }
    const perfis = card.dataset.perfis || '';
    card.style.display = perfis.includes(perfil) ? '' : 'none';
  });
  // Show/hide empty groups
  document.querySelectorAll('.page-grid').forEach(grid => {
    const visible = [...grid.querySelectorAll('.page-card')].some(c => c.style.display !== 'none');
    const title = grid.previousElementSibling;
    if (title) title.style.display = visible ? '' : 'none';
    grid.style.display = visible ? '' : 'none';
  });
}
