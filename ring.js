const slider = document.getElementById('position');
function field(xCm) {
  const x = xCm / 100;
  return 8.99e9 * 20e-9 * x / (0.06 ** 2 + x ** 2) ** 1.5 / 1000;
}
function coordinates(xCm) {
  return [60 + xCm * 520 / 18, 200 - 8 * field(xCm)];
}
const path = Array.from({ length: 361 }, (_, i) =>
  (i === 0 ? 'M' : 'L') + coordinates(i / 20).join(' ')
);
document.getElementById('curve').setAttribute('d', path.join(' '));
function updatePoint() {
  const x = Number(slider.value);
  const [cx, cy] = coordinates(x);
  const point = document.getElementById('point');
  point.setAttribute('cx', cx);
  point.setAttribute('cy', cy);
  const format = n => n.toLocaleString('uk-UA', { maximumFractionDigits: 2 });
  document.getElementById('result').textContent = 'x = ' + format(x) + ' см · E = ' + format(field(x)) + ' кВ/м';
}
slider.addEventListener('input', updatePoint);
updatePoint();
