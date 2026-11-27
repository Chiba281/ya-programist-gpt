const field = document.querySelector('#filter');
const rows = Array.from(document.querySelectorAll('main section li'));
const sections = Array.from(document.querySelectorAll('main section'));
field.addEventListener('input', () => {
  const query = field.value.trim().toLocaleLowerCase('uk');
  let count = 0;
  for (const row of rows) {
    const matches = row.textContent.toLocaleLowerCase('uk').includes(query);
    row.hidden = !matches;
    if (matches) count++;
  }
  for (const section of sections) {
    section.hidden = !section.querySelector('li:not([hidden])');
  }
  document.querySelector('#matches').textContent = query ? 'Знайдено записів: ' + count : '';
});
