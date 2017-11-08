// Declare global variables
const RECIPE_SEARCH_URL = 'https://api.edamam.com/search';
let qVal;
let numIng;
let calRange;
let dietLabel;
let allergyLab;
let searchResults;
let calValue;

// Uses ajax to get data from the API
function getDataFromApi(searchTerm, callback, numIng, calRange, dietLabel, allergyLab) {
  const settings = {
    url: RECIPE_SEARCH_URL,
    data: {
      q: `${searchTerm}`,
      app_key: 'ec9336245111d37ee12a4e9ae1777690',
      app_id: 'b3f870bd',
      from: 0,
      to: 30
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

// Renders the results of the ajax call to the page
function renderResult(result, index) {
  let calCount = Math.floor(result.recipe.calories/result.recipe.yield);  
  let itemImg = "http://toogoodtogo.co.uk/wp-content/uploads/2016/02/icon3_cutlery-300x300.png";
  imgEnd = result.recipe.image.substr(result.recipe.image.length - 3);
  imgEnd4 = result.recipe.image.substr(result.recipe.image.length - 4);
  if (imgEnd === "jpg" ||  imgEnd4 === "jpeg" || imgEnd === "png" || imgEnd === "JPG") {
    itemImg = result.recipe.image;
  }

  return `
    <div class="resRecipe" data-id="${index}">
      <h2 class="recipeLabel">
      ${result.recipe.label}
      </h2>
      <h3>
      <img src="${itemImg}" alt="${result.recipe.label}" class="imgResult"/>
      </h3>
      <div class="recipeSpecs">
      <strong>Number of Ingredients: ${result.recipe.ingredients.length}
      | Calories per Serving: ${calCount}</strong>
      </div>
    </div>
    <hr>
  `;
}

// This function hides the form & instructions
function hideSearchEng() {
  $('.js-search-form').hide();
  $('.instrucSearchBlock').hide();
}

// This shows the search parameters used in a query
function showSearchParameters() {
   $('.searchParameters').html(`
      <h2 class="searchTerm">Search Term: ${searchResults.params.q}</h2>
      <p class="advSearch">Search Refined By</p>
      <ul> 
        <li class="bull"><strong>Calories - </strong>${calValue}</li>
        <li class="bull"><strong>Max Number of Ingredients - </strong>${numIng}</li>
        <li class="bull"><strong>Diet Labels - </strong>${dietLabel}</li>
        <li class="bull"><strong>Allergies - </strong>${allergyLab}</li>
      </ul>
    `);
}

// Allows the user to return to the search results from a single result
function returnToSearchResults() {
  $('.returnSearch').on('click', function() {
    $('.js-search-results').show();
    $('.oneResult').hide();
    $('.returnSearch').hide();
  })
}

// Allows the user to start a new search
function newSearch() {
  $('.newSearch').on('click', '.newSearchBut', function() {
    $('.js-search-form').show();
    $('.instrucSearchBlock').show();
    $('.oneResult').hide();
    $('.js-search-results').hide();
    $('.searchParameters').hide();
    $('.newSearch').hide();
    $('.searchInfo').hide();
    $('.returnSearch').hide();
  })
}

// Shows the new search button
function showNewSearchOption() {
  $('.newSearch').html(`
    <button type="submit" name="newSearchBut" class="newSearchBut">New Search</button>
  `);
}

// Displays the search results
function displayRecipeSearchData(data) {
  console.log(data);
  searchResults = data;
  if (data.count < 1) {
    $('.error').show();
    $('.error').text('No recipes found (0 hits)')
  }
  else {
    $('.error').hide();
    const results = data.hits.map((item, index) => renderResult(item, index));
    hideSearchEng();
    showSearchParameters();
    showNewSearchOption();
    $('.searchInfo').show();
    $('.searchParameters').show();
    $('.newSearch').show();
    $('.js-search-results').show();
    $('.js-search-results').html(results);
  }
}

// Hides the search results
function hideResults() {
  $('.js-search-results').hide();
}

// Renders the ingredient list to the single search result page
function renderIngList(item, index) {
  return `
    <li class="bull">${item}</li>
  `;
}

// Displays a single result information from the API data returned
function showResult() {
  $('.js-search-results').on('click', '.resRecipe', function() {
    hideResults();
    $('.oneResult').show();
    $('.returnSearch').show();
    let resInd = $(this).attr("data-id");
    window.scrollTo(0, 0);

    $('.recipeInfo').html(`
      <h2 class="recInfo">
        ${searchResults.hits[resInd].recipe.label}
      </h2>
      <h3 class=recInfo>
        <img src="${searchResults.hits[resInd].recipe.image}" alt="${searchResults.hits[resInd].recipe.label}" class="imgResult"/>
      </h3>
    `);

    $('.servings').html(`
      <h4>Serves ${searchResults.hits[resInd].recipe.yield}</h4>
      <hr>
      <ul class="liIng"> <strong>Ingredient List</strong>         
      </ul>
    `);

    let ingResults = searchResults.hits[resInd].recipe.ingredientLines.map((item, index) => renderIngList(item, index));
    $('.liIng').append(ingResults);

    let url = searchResults.hits[resInd].recipe.url;
    let lastChar = url.substr(url.length - 1);
    if ( lastChar === "/") {
      url = url.slice(0, -1);
    }

    $('.prep').html(`
      <h4>Recipe Instructions</h4>
      <hr>
      <a class="instrucBut" target="_blank" href=${url}><span class="instruc">Instructions</span></a>
    `);


    let calVal = Math.floor(searchResults.hits[resInd].recipe.calories/searchResults.hits[resInd].recipe.yield);
    let FAT = Math.ceil(searchResults.hits[resInd].recipe.totalNutrients.FAT.quantity/searchResults.hits[resInd].recipe.yield);
    let CARBS = Math.ceil(searchResults.hits[resInd].recipe.totalNutrients.CHOCDF.quantity/searchResults.hits[resInd].recipe.yield);
    let PROT = Math.ceil(searchResults.hits[resInd].recipe.totalNutrients.PROCNT.quantity/searchResults.hits[resInd].recipe.yield);

    $('.nutrition').html(`
      <h4>Nutrition Facts Per Serving</h4>
      <hr>
      <ul>
        <li class="bull">Calories: ${calVal}</li>
        <li class="bull">Fat: ${FAT} ${searchResults.hits[resInd].recipe.totalNutrients.FAT.unit}</li>
        <li class="bull">Carbohydrates: ${CARBS} ${searchResults.hits[resInd].recipe.totalNutrients.CHOCDF.unit}</li>
        <li class="bull">Protein: ${PROT} ${searchResults.hits[resInd].recipe.totalNutrients.PROCNT.unit}</li>
      </ul>
      `);
  });
}   

// Watches for the search to be submitted
function watchSubmit() {
  $('.returnSearch').hide();
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
    $('.returnSearch').hide();
  });
  showResult();
  returnToSearchResults();
  newSearch();
}

$(watchSubmit);