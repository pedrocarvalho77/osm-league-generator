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
  
