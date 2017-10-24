const RECIPE_SEARCH_URL = 'https://api.edamam.com/search';

let qVal;
let numIng;
let calRange;
let dietLabel;
let allergyLab;
let searchResults;
let calValue;


function getDataFromApi(searchTerm, callback, numIng, calRange, dietLabel, allergyLab) {
  const settings = {
    url: RECIPE_SEARCH_URL,
    data: {
      q: `${searchTerm}`,
      app_key: 'ec9336245111d37ee12a4e9ae1777690',
      app_id: 'b3f870bd',
      from: 0,
      to: 20
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  // Use if statements to determine if each of these parameters are being searched
  if (numIng != "") {
    settings.data.ingr = numIng;
  }

  if (dietLabel != "") {
    settings.data.diet = dietLabel;
  }

  if (allergyLab.length != 0) {
    settings.data.health = allergyLab;
  }

  if (calRange != "") {
    settings.data.calories = calRange;
  }
  // Make call to API with ajax
  $.ajax(settings);
}

function renderResult(result, index) {
  let calCount = Math.floor(result.recipe.calories/result.recipe.yield);
  return `
    <div class="resRecipe">
      <h2>
      ${result.recipe.label}
      </h2>
      <h3>
      <img src="${result.recipe.image}" alt="${result.recipe.label}" class="imgResult"/>
      </h3>
      <div>
      Number of Ingredients: ${result.recipe.ingredients.length}
      Calories per Serving: ${calCount}
      </div>
    </div>
  `;
}

// This function hides the form & instructions
function hideSearchEng() {
  $('.js-search-form').hide();
  $('.APIdesc').hide();
}

function showSearchParameters() {
   $('.searchParameters').html(`
      <h2>Number of Results: ${searchResults.count}</h2>
      <h2>Search Term: ${searchResults.params.q}</h2>
      Advance Search Parameters
      <ul> 
        <li>Calorie Range: ${calValue}</li>
        <li>Number of Ingredients: ${numIng}</li>
        <li>Diet Labels: ${dietLabel}</li>
        <li>Allergies: ${allergyLab}</li>
      </ul>
    `);
}

function returnToSearchResults() {
  $('.oneResult').on('click', '.returnSearch', function() {
    $('.js-search-results').show();
    $('.oneResult').hide();
  })
}

function displayRecipeSearchData(data) {
  console.log(data);
  searchResults = data;
  const results = data.hits.map((item, index) => renderResult(item, index));
  hideSearchEng();
  showSearchParameters();
  $('.js-search-results').html(results);
}

function hideResults() {
  $('.js-search-results').hide();
}

function showResult() {
  $('.js-search-results').on('click', '.resRecipe', function() {
    hideResults();
    $('.oneResult').show();
    let resInd = $(this).index();
    $('.oneResult').html(`
    <div>
      <button type="submit" name="returnSearch" class="returnSearch">Search Results</button>
      <h2>
      ${searchResults.hits[resInd].recipe.label}
      </h2>
      <h3>
      <img src="${searchResults.hits[resInd].recipe.image}" alt="${searchResults.hits[resInd].recipe.label}" class="imgResult"/>
      </h3>
    </div>
  `);
  });
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    // Get recipe or ingredient search term
    const queryTarget = $(event.currentTarget).find('.js-query');
    qVal = queryTarget.val();
    // Get the number of ingredients
    ingTarget = $(event.currentTarget).find('.numIng');
    numIng = ingTarget.val();
    // Get the calorie range values
    calLowTarget = $(event.currentTarget).find('.low');
    calHiTarget = $(event.currentTarget).find('.high');
    let low = calLowTarget.val();
    let high = calHiTarget.val();
    // Use if statements to determine what range(s) are present
    if (low != "" && high != "") {
      calRange = `gte ${low}, lte ${high}`;
      calValue = `${low} to ${high}`;
    }
    else if (high != "") {
      calRange = `lte ${high}`;
      calValue = `Max Calories ${high}`;
    }
    else if (low != ""){
      calRange = `gte ${low}`;
      calValue = `Min Calories ${low}`;
    }
    else {
      calRange = "";
      calValue = "";
    }
    // Get the diet labels that are checked
    dietTarget = $('input[name=diet]:checked', '.js-search-form');
    dietLabel = dietTarget.map((index, target) => target.value).toArray();
    // Get the allergy labels checked
    allTarget = $('input[name=allergy]:checked', '.js-search-form');
    allergyLab = allTarget.map((index, target) => target.value).toArray();
    // Reset the form inputs
    $('.js-search-form')[0].reset();

    // Call function to get data from API
    getDataFromApi(qVal, displayRecipeSearchData, numIng, calRange, dietLabel, allergyLab);
  });
  showResult();
  returnToSearchResults();
}

$(watchSubmit);