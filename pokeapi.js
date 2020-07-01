const rs = require('readline-sync')
const axios = require('axios')
const fs = require('fs')

var pokemon = rs.question("Informe o POKEMON ou o ID: ")

async function main() {

    var pokemonRecuperado = await recuperaPokemon(pokemon) // a variavel esta recebendo o retorno da funcao que recupera os dados do pokemon

    exibeDadosPokemon(pokemonRecuperado) // vai imprimir os dados recuperados  

    var salvarPokemon = rs.keyInYN("\nDeseja salvar na pokedex ")

    if (salvarPokemon == true) {
        salvaPokedex(pokemonRecuperado) // executa a funcao que salvo os dados do pokemon no arq json
    }
}


async function recuperaPokemon(pokemon) { // essa funcao serve para recuperar os dados do pokemon informado e retorna essas informacoes no obj criado -(recuperado)
    var response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    var recuperado = {} // objeto
    recuperado.name = response.data.name
    recuperado.abilities = response.data.abilities
    recuperado.types = response.data.types
    return recuperado
}

function salvaPokedex(pokemonRecuperado) { //essa funcao serializa o pokemon no arquivo json
    var ler = fs.readFileSync('pokedex.json') // lê o arq json
    var pokemons = JSON.parse(ler)   // transforma o conteudo do arq json em um array (deserializacao)
    pokemons.push(pokemonRecuperado)  // acrescenta o novo pokemon no array (arq json)
    var serializacaoPokemon = JSON.stringify(pokemons) // serializa os dados recebidos
    fs.writeFileSync('pokedex.json', serializacaoPokemon) // envia para o arquivo json

}

function exibeDadosPokemon(recuperaPokemon) {
    console.log("Pokemon:", recuperaPokemon.name.toUpperCase())
    console.log("\nHabilidades:")
    recuperaPokemon.abilities.forEach(abilityAtual => {
        console.log(abilityAtual.ability.name)
    });
    console.log("\nTipos:")
    recuperaPokemon.types.forEach(typeAtual => {
        console.log(typeAtual.type.name)
    })
}

main()