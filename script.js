var palavras = ["Kiko", "Djalma", "Pitoco", "Ticolé", "Tobias", "Atlas", "Colleen Hoover", "Otorinolaringologista", "Dunga", "Riana", "Úrsula", "Tigo", "Pepino", "Salada de Maionese", "Paçoca", "Milkshake", "Capivara Gorda", "Açaí do La Fruta", "Lagosta Rica", "Eu Te Amo"];
var palavra_secreta = "";
var letras_adivinhadas = [];
var tentativas = 6;
var dicas_usadas = 0;
var palavras_adivinhadas = 0;
var palavras_usadas = [];
var dicas = [];

function normalize_string(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function start_game() {
    if (palavras_adivinhadas >= 20) {
        document.getElementById('game').style.display = 'none';
        document.getElementById('bonus-message').style.display = 'block';
        return;
    }
    if (palavras_usadas.length === palavras.length) {
        palavras_usadas = [];
    }
    palavra_secreta = palavras[Math.floor(Math.random() * palavras.length)];
    while (palavras_usadas.includes(palavra_secreta)) {
        palavra_secreta = palavras[Math.floor(Math.random() * palavras.length)];
    }
    palavras_usadas.push(palavra_secreta);
    letras_adivinhadas = [];
    tentativas = 6;
    dicas_usadas = 0;
    dicas = Array.from(new Set(normalize_string(palavra_secreta).split(''))).filter(letter => letter !== ' ');
    updateUI();
}

function makeGuess() {
    const guess = document.getElementById("guess").value;
    if (guess) {
        var normalized_guess = normalize_string(guess);
        if (normalized_guess.length === 1) {
            if (letras_adivinhadas.includes(normalized_guess) || !normalized_guess.match(/^[a-z]$/)) {
                return;
            }
            letras_adivinhadas.push(normalized_guess);
            if (!normalize_string(palavra_secreta).includes(normalized_guess)) {
                tentativas -= 1;
            }
        } else if (normalized_guess === normalize_string(palavra_secreta.replace(/\s/g, ''))) {
            letras_adivinhadas = normalize_string(palavra_secreta).split('');
        }
        document.getElementById('guess').value = '';
        updateUI();
    }
}

function getHint() {
    if (dicas_usadas >= 3) {
        alert('Você já utilizou o máximo de dicas para esta palavra.');
        return;
    }
    var hintIndex = Math.floor(Math.random() * dicas.length);
    var hint = dicas[hintIndex];
    dicas.splice(hintIndex, 1);
    dicas_usadas += 1;
    alert('Dica: A palavra contém a letra "' + hint + '".');
}

function get_display_word() {
    return palavra_secreta.split('').map(letter => letter === ' ' ? ' ' : (letras_adivinhadas.includes(normalize_string(letter)) ? letter : '_')).join('');
}

function updateUI() {
    document.getElementById('word').innerText = get_display_word();
    document.getElementById('attempts').innerText = tentativas;
    document.getElementById('guessed-letters').innerText = letras_adivinhadas.join(', ');
    document.getElementById('word-count').innerText = palavras_adivinhadas + '/' + palavras.length;
    document.getElementById('word-length').innerText = 'Número de letras: ' + palavra_secreta.replace(/\s/g, '').length;
    if (tentativas == 0) {
        alert('Fim de Jogo! A palavra era: ' + palavra_secreta);
        palavras_adivinhadas = 0;
        start_game();
    } else if (!get_display_word().includes('_')) {
        alert('Parabéns! Você acertou a palavra: ' + palavra_secreta);
        palavras_adivinhadas += 1;
        start_game();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    start_game();
    document.getElementById("guess").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            makeGuess();
        }
    });
});
