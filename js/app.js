$(document).ready(function(){

  /**
   * elementos DOM que necesitaremos
   */
  const form = document.getElementById('form');
  const pokeSearch = document.getElementById('poke-search');
  const btn = document.getElementById('submit-btn');
  const container = document.getElementById('results-container');
  let poke;
  const logo = document.getElementById('logo');
  const previous = document.getElementsByClassName('previous')[0];
  const next = document.getElementsByClassName('next')[0];

  /**
   * imprimir pokemons al cargar la página
   */
  putOnResults(`https://pokeapi.co/api/v2/pokemon/?limit=10`);
  
  /**
   * click en botón previous o next
   */
  $('#results-container button').click(function() {
    $(pokeSearch).val('');
    let url = this.dataset.url;
    putOnResults(url);
  })

  /**
   * click en el logo, vuelve a los 10 primeros
   */
  $('#logo').click(function(){
    $(pokeSearch).val('');
    putOnResults(`https://pokeapi.co/api/v2/pokemon/?limit=10`);
  });


  /**
   * función para llamar a la api e imprimir pokemons
   */
  function putOnResults(url) {
    $('#load').show();
    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const allPoke = data.results;
        for (let i = 0; i < allPoke.length; i++) {
          let name = allPoke[i].name;
          list(name);
        }
        let nextUrl = data.next;
        if (nextUrl !== null) {
          $(next).removeAttr('disabled');
        next.dataset.url = nextUrl;
        } else {
          $(next).attr('disabled', 'disabled');
        }
        let previousUrl = data.previous;
        if (previousUrl !== null) {
          $(previous).removeAttr('disabled');
          previous.dataset.url = previousUrl;
        } else {
          $(previous).attr('disabled', 'disabled');
        }
      }).then(function(){
        $('#load').hide();
      }).catch(function(error){
        $('#load').empty();
        $('#load').html('<p class="alert alert-danger text-center" role="alert">Lo sentimos, el servidor esta fallando, porfavor intente mas tarde</p>');
      })
  }

  /**
   * click en el botón para buscar -pokebola-
   */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    container.innerHtml = '';
    poke = pokeSearch.value;
    poke = poke.toLowerCase();
    $('#results-container ul').empty()
    searchPokemon(poke);
    next.dataset.url = null;
    previous.dataset.url = null;
    $(next).attr('disabled', 'disabled');
    $(previous).attr('disabled', 'disabled');
  })

  $('#submit-btn').attr('disabled', 'disabled');
  $(pokeSearch).keyup(function(){
    if ($(this).val().length === 0) {
      $('#submit-btn').attr('disabled', 'disabled');
    } if ($(this).val().length > 0) {
      $('#submit-btn').removeAttr('disabled');
    }
    else if ($('#submit-btn').empty()){
         $(pokeSearch).val('');
    putOnResults(`https://pokeapi.co/api/v2/pokemon/?limit=10`);
    }
  });

  /**
   * función que llama a la api al darle click al botón
   */
  const searchPokemon = function(value) {
    $('#load').show();
    fetch('https://pokeapi.co/api/v2/pokedex/1')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
         // aquí muestra datos básicos de todos los pokemons
        const allPoke = data.pokemon_entries;
        // pero para acceder a los nombres, hay que entrar a otra propiedad
        for (let i = 0; i < allPoke.length; i++) {
          let name = allPoke[i].pokemon_species.name;
          if (name.indexOf(value) !== -1) {
            list(name);
          }
        }
      }).then(function() {
        $('#load').hide();
      }).catch(function(error) {
        $('#load').empty();
        $('#load').html('<p class="alert alert-danger text-center col-md-8 offset-md-1" role="alert">!Lo Sentimos¡No se encontro el pokemon.</p>');
      });
  }

  /**
   * función para insertar HTML en el RESULTS-CONTAINER de la lista de los pokemons
   */
  function list(pokemon) {
    $('#results-container ul').empty();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(function(response) {
      return response.json();
    })
    
    .then(function(data) {
      let name = data.name;
      let img = data.sprites.front_default;
      let abilities = [];
      for (let i = 0; i < data.abilities.length; i++) {
        let each = data.abilities[i];
        abilities.push(each.ability.name);
      }
      $datopk = $('#results-container ul');
      $tabla = $('<table class="table table-hover responsive"></table>');
      $btabla = $('<tbody></tbody>');
      var $tr = $('<tr></tr>');
      $tr.append('<td>'+`<input type="checkbox" name="checks[]" value='${name}' id="p">`+'</td>');
      $tr.append('<td >' + name + '</td>');
      $tr.append('<td >' + `<figure><img src='${img}' class= "align-middle"></figure>` + '</td>');
      for (let j = 0; j < abilities.length; j++) {
      $tr.append('<td width = "130px">' + abilities[j] + '</td>');
      }
        $(document).ready(function() {

          $('[name="checks[]"]').click(function() {
           var arr = $('[name="checks[]"]:checked').map(function(){
                 return this.value;
         }).get();
        var str = arr.join(', ');
        $('#str').text(str);
      
     });

});
      
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
    .then(function(responses) {
      return responses.json();
    })
    .then(function(datas) {

         let array = datas.flavor_text_entries;
      let description = '';
      for (var i = 0; i < array.length; i++){
        if (array[i].version['name'] == 'moon' && array[i].language['name'] == 'en'){
          description = array[i].flavor_text;
        }
        if (array[i].version['name'] == 'x' && array[i].language['name'] == 'en'){
          description = array[i].flavor_text;
        }
      }
       let category = datas.genera[2].genus;
      //$tr.append('<td width = "130px">' + description + '</td>');
      $tr.append('<td width = "130px">' + category + '</td>');
      
    });

        $btabla.append($tr)
        $tabla.append($btabla);
        $datopk.append($tabla);
    })
  }
    
})
