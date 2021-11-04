var qte = [], multi = [];

var qte_url   = "./json/qte_final.json";
var multi_url = "./json/multi_final.json";

fetch(qte_url)
  .then(response => response.json())
  .then(json => {
    qte = json.map(row => ({ q: row.Question, a: row.Answer.split('') }));
    document.querySelector('#qte_cnt')
            .innerText = qte.length;
    document.querySelector('#qte_input')
            .addEventListener('keyup', qteKeyupCallback);
    document.querySelectorAll('#qte_pos input[type=radio]')
            .forEach(radio => {
              radio.addEventListener('change', qteKeyupCallback);
            });
  })
  .catch(e => console.error(e));

fetch(multi_url)
  .then(response => response.json())
  .then(json => {
    multi = json.map(row => ({ q: row.Question, a: row.Answer.split('　') }));
    document.querySelector('#multi_cnt')
            .innerText = multi.length;
    document.querySelector('#multi_input')
            .addEventListener('keyup', multiKeyupCallback);
  })
  .catch(e => console.error(e));

function search4Result (val, data) {
  const keywords = val.split(' ').reduce((last, keyword) => {
    if (keyword.length === 0 || last.indexOf(keyword) >= 0) return last;

    last.push(keyword);
    return last;
  }, []);

  const result = data.filter(row => keywords.every(keyword => row.q.indexOf(keyword) >= 0));

  return result;
}

function qteKeyupCallback () {
  const val = document.querySelector('#qte_input').value.toLowerCase();
  const pos = parseInt(document.querySelector('#qte_pos input[type=radio]:checked').value);

  if (val.length === 0) return;

  const result = search4Result(val, qte);
  if(result.length === 0) return;

  const html = result.reduce((last, row) => {
    const q = row.q;
    const a = row.a.map((ai, i) => i === pos ? `<span>${ai}</span>` : `${ai}`);

    last += `<tr><td>${a}</td><td>${q}</td></tr>`;
    return last;
  }, '');
  
  document.querySelector('#qte_result').innerHTML = html;
}

function multiKeyupCallback() {
  const val = document.querySelector('#multi_input').value.toLowerCase();

  if (val.length === 0) return;

  const result = search4Result(val, multi);
  if(result.length === 0) return;

  const html = result.reduce((last, row) => {
    const q = row.q;
    const a = row.a.map((ai, i) => `<span class="cAns cAns${i}">${ai}</span>`);

    last += `<tr><td>${a.join('<br />')}</td><td>${q}</td></tr>`;
    return last;
  }, '');
  
  document.querySelector('#multi_result').innerHTML = html;
}

document.querySelector('#qte_input_clear').addEventListener('click', () => {
  document.querySelector('#qte_input').value = '';
  document.querySelector('#qte_result').innerHTML = '';
});

document.querySelector('#multi_input_clear').addEventListener('click', () => {
  document.querySelector('#multi_input').value = '';
  document.querySelector('#multi_result').innerHTML = '';
});