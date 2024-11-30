// Selecionar Elementos do DOM
const sortButton = document.getElementById('sortButton');
const resetButton = document.getElementById('resetButton');
const themeToggle = document.getElementById('themeToggle');
const uploadTeams = document.getElementById('uploadTeams');
const uploadPlayers = document.getElementById('uploadPlayers');

// Adicionar Event Listeners
sortButton.addEventListener('click', sortTeams);
resetButton.addEventListener('click', resetSorteio);
themeToggle.addEventListener('click', toggleTheme);
uploadTeams.addEventListener('change', handleFileUploadTeams);
uploadPlayers.addEventListener('change', handleFileUploadPlayers);

// Inicializar Histórico e Tema
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    loadTheme();
});

// Função para Sortear Equipas e Jogadores
function sortTeams() {
    const teamsInput = document.getElementById('teams').value.trim();
    const playersInput = document.getElementById('players').value.trim();

    // Converter as entradas em arrays, removendo linhas vazias
    let teams = teamsInput.split('\n').map(item => item.trim()).filter(item => item !== '');
    let players = playersInput.split('\n').map(item => item.trim()).filter(item => item !== '');

    // Validação de Dados
    if (teams.length === 0 || players.length === 0) {
        alert('Por favor, insira pelo menos uma equipa e um jogador.');
        return;
    }

    if (teams.length !== players.length) {
        alert('O número de equipas e jogadores deve ser igual!');
        return;
    }

    if (hasDuplicates(teams)) {
        alert('Há equipas duplicadas! Por favor, verifique a lista de equipas.');
        return;
    }

    if (hasDuplicates(players)) {
        alert('Há jogadores duplicados! Por favor, verifique a lista de jogadores.');
        return;
    }

    // Embaralhar as Listas
    teams = shuffleArray(teams);
    players = shuffleArray(players);

    // Criar os Pares
    const pairs = teams.map((team, index) => ({ team, player: players[index] }));

    // Exibir os Resultados
    displayResults(pairs);

    // Adicionar ao Histórico
    addToHistory(pairs);
}

// Função para Reiniciar o Sorteio
function resetSorteio() {
    if (confirm('Tem a certeza que deseja reiniciar o sorteio? Isso irá limpar os resultados atuais e os campos de entrada.')) {
        document.getElementById('result').innerHTML = '';
        document.getElementById('teams').value = '';
        document.getElementById('players').value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Função para Alternar Tema (Claro/Escuro)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Modo Claro' : '<i class="fas fa-moon"></i> Modo Escuro';
    // Salvar Preferência no localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Opcional: Mostrar Notificação usando Toastify
    Toastify({
        text: isDarkMode ? "Tema Escuro Ativado" : "Tema Claro Ativado",
        duration: 3000,
        gravity: "top", // top ou bottom
        position: "right", // left, center ou right
        backgroundColor: isDarkMode ? "#333333" : "#0d6efd",
        close: true
    }).showToast();
}

// Carregar Tema Salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
}

// Função para Verificar Duplicados
function hasDuplicates(array) {
    return new Set(array).size !== array.length;
}

// Função para Embaralhar um Array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para Exibir Resultados
function displayResults(pairs) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Resultados do Sorteio</h2>';

    pairs.forEach(pair => {
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('pair', 'shadow-sm');
        pairDiv.innerHTML = `<strong>Equipa:</strong> ${pair.team} &nbsp; <strong>Jogador:</strong> ${pair.player}`;
        resultDiv.appendChild(pairDiv);
    });

    // Botão para Exportar Resultados
    const exportButton = document.createElement('button');
    exportButton.classList.add('btn', 'btn-success', 'mt-3');
    exportButton.innerHTML = '<i class="fas fa-download"></i> Exportar Resultados (CSV)';
    exportButton.addEventListener('click', () => exportCSV(pairs));
    resultDiv.appendChild(exportButton);

    // Scroll suave até aos resultados
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Função para Adicionar ao Histórico
function addToHistory(pairs) {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const timestamp = new Date().toLocaleString('pt-PT');
    history.push({ timestamp, pairs });
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

// Função para Carregar Histórico
function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    const history = JSON.parse(localStorage.getItem('history')) || [];

    if (history.length === 0) {
        historyList.innerHTML = '<li class="list-group-item">Nenhum sorteio realizado ainda.</li>';
        return;
    }

    history.slice().reverse().forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.innerHTML = `<span>${entry.timestamp}</span>`;
        
        const viewButton = document.createElement('button');
        viewButton.classList.add('badge', 'bg-primary', 'rounded-pill');
        viewButton.textContent = 'Ver';
        viewButton.addEventListener('click', () => displayHistoricalResult(entry));

        listItem.appendChild(viewButton);
        historyList.appendChild(listItem);
    });
}

// Função para Exibir Resultado Histórico
function displayHistoricalResult(entry) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Resultado do Sorteio em ${entry.timestamp}</h2>`;

    entry.pairs.forEach(pair => {
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('pair', 'shadow-sm');
        pairDiv.innerHTML = `<strong>Equipa:</strong> ${pair.team} &nbsp; <strong>Jogador:</strong> ${pair.player}`;
        resultDiv.appendChild(pairDiv);
    });

    // Botão para Exportar Resultados
    const exportButton = document.createElement('button');
    exportButton.classList.add('btn', 'btn-success', 'mt-3');
    exportButton.innerHTML = '<i class="fas fa-download"></i> Exportar Resultados (CSV)';
    exportButton.addEventListener('click', () => exportCSV(entry.pairs));
    resultDiv.appendChild(exportButton);

    // Scroll suave até aos resultados
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Função para Exportar Resultados em CSV
function exportCSV(pairs) {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Equipa,Jogador\n"
        + pairs.map(pair => `"${pair.team}","${pair.player}"`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `sorteio_${new Date().toISOString()}.csv`);
}

// Função para Manipular Upload de Equipas
function handleFileUploadTeams(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                const teams = results.data.flat().join('\n');
                document.getElementById('teams').value = teams;
            },
            error: function(err) {
                alert('Erro ao ler o ficheiro de equipas.');
            }
        });
    }
}

// Função para Manipular Upload de Jogadores
function handleFileUploadPlayers(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            complete: function(results) {
                const players = results.data.flat().join('\n');
                document.getElementById('players').value = players;
            },
            error: function(err) {
                alert('Erro ao ler o ficheiro de jogadores.');
            }
        });
    }
}
