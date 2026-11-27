const el = id => document.getElementById(id);
const key = 'physics-kpi-review-v1';
let saved;
try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch { saved = []; }
const repeat = new Set(Array.isArray(saved) ? saved : []);
let index = 0;
function available() {
  return el('review').checked ? questions.filter(q => repeat.has(q.id)) : questions;
}
function show() {
  const items = available();
  index = items.length ? index % items.length : 0;
  const current = items[index];
  el('count').textContent = current ? (index + 1) + ' / ' + items.length : '';
  el('question').textContent = current ? current.q : 'Відкладених питань поки немає.';
  el('reveal').open = false;
  el('reveal').hidden = !current;
  for (const id of ['next', 'known', 'repeat']) el(id).disabled = !current;
  if (current) {
    el('answer').textContent = current.a;
    el('read').href = 'kpi-' + current.id + '.html';
  }
}
function mark(again) {
  const id = available()[index].id;
  if (again) repeat.add(id); else repeat.delete(id);
  try { localStorage.setItem(key, JSON.stringify([...repeat])); } catch {}
  if (again || !el('review').checked) index++;
  show();
}
el('review').onchange = () => { index = 0; show(); };
el('repeat').onclick = () => mark(true);
el('known').onclick = () => mark(false);
el('next').onclick = () => { index++; show(); };
show();
