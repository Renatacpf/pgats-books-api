// Gera um ISBN único para criação de livros
export function randomISBN() {
    const timestamp = Date.now();
    const vu = typeof __VU !== 'undefined' ? __VU : 1;
    return `978-${timestamp}-${vu}`;
}

// Gera um ano válido para livros
export function randomYear() {
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    return minYear + Math.floor(Math.random() * (currentYear - minYear + 1));
}
