document.addEventListener('DOMContentLoaded', function () {
    let cep = document.querySelector('#cep');
    let rua = document.querySelector('#rua');
    let bairro = document.querySelector('#bairro');
    let cidade = document.querySelector('#cidade');
    let estado = document.querySelector('#estado');
    let numero = document.querySelector('#numero');
    let ibge = document.querySelector('#ibge');
    let addDataBtn = document.querySelector('#add-data');
    let saveDataBtn = document.querySelector('#add-data1');
    let tabela = document.querySelector('#tabela');
    let cepForm = document.querySelector('#cep-form'); // função só p resetar o form

    let cepTimeout; // chamando essa função da linha (42)

    function buscarCep(cepValue) {
        if (cepValue.length !== 8) {
            alert('CEP inválido');
            return;
        }

        fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
            .then(resposta => resposta.json())
            .then(json => {
                if ("erro" in json) {
                    alert('CEP não encontrado');
                    return;
                }

                rua.value = json.logradouro;
                bairro.value = json.bairro;
                cidade.value = json.localidade;
                estado.value = json.uf;
                ibge.value = json.ibge;
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP');
            });
    }
    //preencher dados no form automaticamente em 1s
    cep.addEventListener('input', function() {
        clearTimeout(cepTimeout);
        cepTimeout = setTimeout(function() {
            let cepValue = cep.value.replace(/\D/g, '');
            buscarCep(cepValue);
        }, 1000);
    });

    // adiciona os dados na tabela
    addDataBtn.addEventListener('click', function(event) {
        event.preventDefault();

        if (!cep.value || !rua.value || !numero.value || !bairro.value || !cidade.value || !estado.value || !ibge.value) {
            alert("Preencha todos os campos!");
            return;
        }

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${cep.value}</td>
            <td>${rua.value}</td>
            <td>${numero.value}</td>
            <td>${bairro.value}</td>
            <td>${cidade.value}</td>
            <td>${estado.value}</td>
            <td>${ibge.value}</td>
            <td><button class="delete-btn">🚮</button></td> `;

        tabela.appendChild(row);

        cepForm.reset();
        // document.querySelector('#cep-form').reset();
    });

    // salva dados no local storage
    saveDataBtn.addEventListener('click', function(event) {
        event.preventDefault();
        let tableData = [];

        tabela.querySelectorAll('tr').forEach(row => {
            let rowData = {
                cep: row.cells[0].textContent,
                rua: row.cells[1].textContent,
                numero: row.cells[2].textContent,
                bairro: row.cells[3].textContent,
                cidade: row.cells[4].textContent,
                estado: row.cells[5].textContent,
                ibge: row.cells[6].textContent
            };
            tableData.push(rowData);
        });

        localStorage.setItem('cepData', JSON.stringify(tableData));
        alert('Dados salvos no Local Storage!');
    });

    // carrega dados do local storage
    function loadData() {
        let storedData = localStorage.getItem('cepData');
        if (storedData) {
            let tableData = JSON.parse(storedData);
            tableData.forEach(data => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.cep}</td>
                    <td>${data.rua}</td>
                    <td>${data.numero}</td>
                    <td>${data.bairro}</td>
                    <td>${data.cidade}</td>
                    <td>${data.estado}</td>
                    <td>${data.ibge}</td>
                    <td><button class="delete-btn">🚮</button></td> <!-- Emoji de lixeira -->
                `;
                tabela.appendChild(row);
            });
        }
    }

    loadData();

    // botao lixeira que exclui uma linha da tabela
    tabela.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            event.target.closest('tr').remove();
            saveToLocalStorage();
        }
    });

    // função auxiliar para salvar dados no local storage
    function saveToLocalStorage() {
        let tableData = [];

        tabela.querySelectorAll('tr').forEach(row => {
            let rowData = {
                cep: row.cells[0].textContent,
                rua: row.cells[1].textContent,
                numero: row.cells[2].textContent,
                bairro: row.cells[3].textContent,
                cidade: row.cells[4].textContent,
                estado: row.cells[5].textContent,
                ibge: row.cells[6].textContent
            };
            tableData.push(rowData);
        });

        localStorage.setItem('cepData', JSON.stringify(tableData));
    }
});
