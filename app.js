const RECIPE_SEARCH_URL = 'https://api.edamam.com/search';

let qVal;
let numIng;
let dietLabel;
let allergyLab;
let calRange;

function getDataFromApi(searchTerm, callback, numIng, dietLabel, allergyLab, calRange) {
  const settings = {
    url: RECIPE_SEARCH_URL,
    data: {
      q: `${searchTerm}`,
      app_key: 'ec9336245111d37ee12a4e9ae1777690',
      app_id: 'b3f870bd',
      from: 0,
      to: 20,
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
    const queryTarget = $(event.currentTarget).find('.js-query');
    qVal = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(qVal, displayRecipeSearchData);
  });
}

$(watchSubmit);