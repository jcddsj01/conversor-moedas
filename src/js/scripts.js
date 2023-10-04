// Chave da API ExchangeRate-API
const chave_API = '1bf09bc689c8c92878947f08';

const conversaoMoeda = document.getElementById("conversao-moeda");
const inputMoedaEntrada = document.getElementById("moeda-entrada");
const botaoConverter = document.getElementById("botao-converter");

botaoConverter.addEventListener("click", async () => {
    const moedaEntrada = inputMoedaEntrada.value;

    // Verifica se o campo está vazio
    if (moedaEntrada === "") {
        alert("Erro: O valor está vazio.")
    } else {
        try {
            const valorConvertido = await converterUSDparaBRL(moedaEntrada);
            conversaoMoeda.innerHTML = valorConvertido;
        } catch (error) {
            // Exibir erro no console
            console.error(error.message);
            alert("Erro ao converter moeda. Verifique se o valor é válido.");
        }
    }
});

// Função para obter o valor da taxa de câmbio entre duas moedas
async function getExchangeRate(converterMoeda, moedaConvertida) {
    try {
        // URL da API ExchangeRate-API
        const API_URL = `https://v6.exchangerate-api.com/v6/${chave_API}/latest/${converterMoeda}`;

        // Obter a resposta da API usando fetch
        const response = await fetch(API_URL);

        // Converter a resposta em um objeto JSON
        const data = await response.json();

        // Verificar se a resposta da API foi bem-sucedida
        if (data.result === 'success') {
            // Extrai a taxa de câmbio entre as duas moedas
            const exchangeRate = data.conversion_rates[moedaConvertida];

            // Retornar a taxa de câmbio
            return exchangeRate;
        } else {
            // Lançar um erro com a mensagem da API
            throw new Error(data['error-type']);
        }
    } catch (error) {
        // Exibir o erro no console
        console.error(error.message);
        throw error; // Propagar o erro para que possa ser tratado no código principal
    }
}

// Função para converter uma moeda no formato USD para BRL
async function converterUSDparaBRL(quantia) {
    try {
        // Extrai o valor da taxa de câmbio entre USD e BRL
        const exchangeRate = await getExchangeRate('USD', 'BRL');

        // Calcula o valor em BRL
        const valorEmBRL = quantia * exchangeRate;

        // Retorna o valor em BRL com duas casas decimais
        return valorEmBRL.toLocaleString('pt-BR', {style: 'decimal', currency: 'BRL', minimumFractionDigits: 2}) + ' BRL';
    } catch (error) {
        // Exibi o erro no console
        console.error(error.message);
        throw error; // Propagar o erro para que possa ser tratado no código principal
    }
}
