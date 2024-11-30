document.getElementById('sortButton').addEventListener('click', sortTeams);

function sortTeams() {
    const teamsInput = document.getElementById('teams').value.trim();
    const playersInput = document.getElementById('players').value.trim();

    // Converter as entradas em arrays, removendo linhas vazias
    let teams = teamsInput.split('\n').map(item => item.trim()).filter(item => item !== '');
    let players = playersInput.split('\n').map(item => item.trim()).filter(item => item !== '');

    // Verificar se há a mesma quantidade de equipas e jogadores
    if (teams.length !== players.length) {
        alert('O número de equipas e jogadores deve ser igual!');
        return;
    }

    // Embaralhar ambas as listas
    teams = shuffleArray(teams);
    players = shuffleArray(players);

    // Criar os pares
    const pairs = teams.map((team, index) => ({ team, player: players[index] }));

    // Exibir os resultados
    displayResults(pairs);
}

function shuffleArray(array) {
    // Algoritmo de Fisher-Yates para embaralhar o array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayResults(pairs) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Resultados do Sorteio</h2>';

    pairs.forEach(pair => {
        const pairDiv = document.createElement('div');
        pairDiv.classList.add('pair', 'shadow-sm');
        pairDiv.innerHTML = `<strong>Equipa:</strong> ${pair.team} &nbsp; <strong>Jogador:</strong> ${pair.player}`;
        resultDiv.appendChild(pairDiv);
    });

    // Scroll suave até aos resultados
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}
