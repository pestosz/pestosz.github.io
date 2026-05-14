interface styleData { // szablon tablicy
    name: string;
    file: string;
}
const styles: styleData[] = [ // tablica styli
    { name: "Styl 1", file: "style-1.css" },
    { name: "Styl 2", file: "style-2.css" },
    { name: "Styl 3", file: "style-3.css" }
];
function applyStyle(style: styleData): void {
    const head = document.querySelector('head');
    if (!head) return; // head nie może być null
    const old = document.querySelector('link#style'); // poprzedni <link> ze stylem
    if (old) {
        old.remove(); // usunięcie poprzedniego <link> jeśli istnieje
    }
    const link = document.createElement('link'); // nowy <link>
    link.id = 'style';
    link.rel = 'stylesheet';
    link.href = `/${style.file}`;
    head.appendChild(link); // dodaje <link> do <head>
}
function renderButtons(): void { // wyświetlanie przycisków
    const container = document.querySelector('#switcher');
    if (!container) return; // kontener na przyciski nie może być null
    container.innerHTML = '';
    styles.forEach(style => { // tworzy przycisk dla każdego stylu
        const btn = document.createElement('button');
        btn.textContent = style.name;
        btn.style.margin = '1rem';
        btn.addEventListener('click', () => applyStyle(style)); // aplikuje wybrany styl po kliknięciu
        container.appendChild(btn); // dodaje przycisk do kontenera
    });
}
document.addEventListener('DOMContentLoaded', () => { // dodaje do <head> pierwszy styl przy załadowaniu drzewa DOM
    applyStyle(styles[0]);
    renderButtons();
});