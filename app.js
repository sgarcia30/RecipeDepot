const RECIPE_SEARCH_URL = 'https://api.edamam.com/search';

let qVal;
let numIng;
let calRange;
let dietLabel;
let allergyLab;


function getDataFromApi(searchTerm, callback, numIng, calRange, dietLabel, allergyLab) {
  const settings = {
    url: RECIPE_SEARCH_URL,
    data: {
      q: `${searchTerm}`,
      app_key: 'ec9336245111d37ee12a4e9ae1777690',
      app_id: 'b3f870bd',
      from: 0,
      to: 100,
      ingr: numIng,
      diet: dietLabel,
      health: allergyLab,
      calories: calRange
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}

function displayRecipeSearchData(data) {
  console.log(data);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    // Get recipe or ingredient search term
    const queryTarget = $(event.currentTarget).find('.js-query');
    qVal = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    // Get the number of ingredients
    ingTarget = $(event.currentTarget).find('.numIng');
    numIng = ingTarget.val();
    ingTarget.val("");
    // Get the calorie range values
    calLowTarget = $(event.currentTarget).find('.low');
    calHiTarget = $(event.currentTarget).find('.high');
    let low = calLowTarget.val();
    calLowTarget.val("");
    let high = calHiTarget.val();
    calHiTarget.val("");
    calRange = `gte ${low}, lte ${high}`;
    // Get the diet labels that are checked
    dietTarget = $('input[name=diet]:checked', '.js-search-form');
    dietLabel = dietTarget.val();
    dietTarget.attr('checked',false);
    // Get the allergy label checked
    allTarget = $('input[name=allergy]:checked', '.js-search-form');
    allergyLab = allTarget.val();
    console.log(allergyLab);
    $('input[name=allergy]', '.js-search-form').attr('checked',false);
    // Call function to get data from API
    getDataFromApi(qVal, displayRecipeSearchData, numIng, calRange, dietLabel, allergyLab);
  });
}

$(watchSubmit);