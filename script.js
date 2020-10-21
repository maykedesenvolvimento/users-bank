window.addEventListener('load', () => {
    const searchInput = document.querySelector('#searchInput');
    const searchButton = document.querySelector('#searchButton');
    const divResult = document.querySelector('#divResult');
    const divStats = document.querySelector('#divStats');
    const messageResult = document.querySelector('#messageResult');

    const users = [];
    const request = fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');

    request.then(res => {
        const json = res.json();
        json.then(data => {
            data.results.forEach(e => {
                const user = {
                    name: `${e.name.first} ${e.name.last}`,
                    img: e.picture.thumbnail,
                    age: e.dob.age,
                    gender: e.gender
                };
                users.push(user);
            });
            users.sort((a, b) => a.name.localeCompare(b.name));
            searchButton.disabled = false;
        }).catch(e => {
            window.alert('Falha ao obter JSON!');
            console.log(e);
        });
    }).catch(e => {
        window.alert('Falha na requisição!');
        console.log(e);
    });

    function doSearch() {
        const arg = searchInput.value.toLowerCase();

        if (arg.length < 1) {
            window.alert('Digite ao menos um caractere!')
            return;
        }

        let searchResult = '';
        const filteredUsers = users.filter(u => u.name.toLowerCase().includes(arg));
        const amount = filteredUsers.length;
        messageResult.innerHTML = (amount == 1) ? '1 usuário encontrado:' : `${amount} usuários encontrados:`;
        filteredUsers.forEach(u => searchResult += `<div class="line">
            <img src='${u.img}'>
            <span>${u.name}, ${u.age} anos</span>
        </div>`);
        divResult.innerHTML = searchResult;

        const male = filteredUsers.filter(u => u.gender == 'male').length;
        const female = filteredUsers.filter(u => u.gender == 'female').length;
        const ageSum = filteredUsers.reduce((a, b) => a + b.age, 0);
        const ageAverage = parseFloat(ageSum / amount).toFixed(2);

        divStats.innerHTML = `<ul>
            <li>Sexo masculino: <b>${male}</b></li>
            <li>Sexo feminino: <b>${female}</b></li>
            <li>Soma das idades: <b>${ageSum}</b></li>
            <li>Média das idades: <b>${ageAverage}</b></li>
        </ul>`;
    };

    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode == 13) doSearch();
    });
    searchButton.addEventListener('click', doSearch);
});