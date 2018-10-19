const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

let allTrainers
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main')

  function fetchTrainers() {
    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(parsed => {
      allTrainers = parsed
      console.log(parsed)
      parsed.forEach(trainerObj => createTrainer(trainerObj))
    })
  }

  fetchTrainers()


  function createTrainer(trainerObj) {
    const trainerDiv = document.createElement('div')
    trainerDiv.setAttribute('class', 'card')
    trainerDiv.setAttribute('data-id', `${trainerObj.id}`)
    const trainerName = document.createElement('p')
    trainerName.innerText = `${trainerObj.name}`
    const addBtn = document.createElement('button')
    addBtn.setAttribute('class', 'add-btn')
    addBtn.setAttribute('data-trainer-id', `${trainerObj.id}`)
    addBtn.innerText = 'Add Pokemon'
    const pokemonList = document.createElement('ul')

    main.appendChild(trainerDiv)
    trainerDiv.appendChild(trainerName)
    trainerDiv.appendChild(addBtn)
    trainerDiv.appendChild(pokemonList)

    trainerObj.pokemons.forEach(pokemon => {
      const pokemonName = document.createElement('li')
      pokemonName.innerText = `${pokemon.nickname} (${pokemon.species}) `
      const releaseBtn = document.createElement('button')
      releaseBtn.setAttribute('class', 'release')
      releaseBtn.setAttribute('data-pokemon-id', `${pokemon.id}`)
      releaseBtn.innerText = 'Release'

      pokemonName.appendChild(releaseBtn)
      pokemonList.appendChild(pokemonName)
    })
  }

  document.addEventListener('click', event => {
    if (event.target && event.target.className === 'add-btn') {
      let selectedTrainer = allTrainers.find(trainer => parseInt(trainer.id) === parseInt(event.target.dataset.trainerId))
      if (selectedTrainer.pokemons.length < 6) {
        addPokemon(selectedTrainer)
      }
    } else if (event.target && event.target.className === 'release') {
      let selectedTrainer = allTrainers.find(trainer => parseInt(trainer.id) === parseInt(event.target.parentNode.parentNode.parentNode.dataset.id))
      let selectedPokemon = selectedTrainer.pokemons.find(pokemon => parseInt(pokemon.id) === parseInt(event.target.dataset.pokemonId))
      releasePokemon(selectedPokemon)
    }
  })

  function addPokemon(trainerObj) {
    fetch(POKEMONS_URL, {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        'trainer_id': trainerObj.id
      })
    })
    .then(response => response.json())
    .then(json => {
      main.innerHTML = ""
      fetchTrainers()
      console.log(json)
    })
  }

  function releasePokemon(pokemonObj) {
    fetch(`${POKEMONS_URL}/${pokemonObj.id}`, {
      'method': 'DELETE'
    })
    .then(response => response.json())
    .then(json => {
      const pokemonLine = document.querySelector(`[data-pokemon-id="${pokemonObj.id}"]`).parentElement
      pokemonLine.remove()
      console.log(json)
    })
  }

})
