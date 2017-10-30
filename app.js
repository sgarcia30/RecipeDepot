const RECIPE_SEARCH_URL = 'https://api.edamam.com/search';

let qVal;
let numIng;
let calRange;
let dietLabel;
let allergyLab;
let searchResults;
let calValue;
let calCount;


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

function renderResult(result, index) {
  calCount = Math.floor(result.recipe.calories/result.recipe.yield);
  
  let itemImg = "http://www.readersdigest.ca/wp-content/uploads/2011/01/4-ways-cheer-up-depressed-cat.jpg";
  if (result.recipe.image !== "https://www.edamam.com/web-img/d10/d10f3cd0564a9c2a4a7db3e1b49041f8.gif") {
    itemImg = result.recipe.image;
  }

  return `
    <div class="resRecipe">
      <h2 class="recipeLabel">
      ${result.recipe.label}
      </h2>
      <h3>
      <img src="${itemImg}" alt="${result.recipe.label}" class="imgResult"/>
      </h3>
      <div class="recipeSpecs">
      Number of Ingredients: ${result.recipe.ingredients.length}
      | Calories per Serving: ${calCount}
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

function showSearchParameters() {
   $('.searchParameters').html(`
      <h2>Search Term: ${searchResults.params.q}</h2>
      <p class="advSearch">Advance Search Parameters</p>
      <ul> 
        <li>Calories: ${calValue}</li>
        <li>Max Number of Ingredients: ${numIng}</li>
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

function newSearch() {
  $('.newSearch').on('click', '.newSearchBut', function() {
    $('.js-search-form').show();
    $('.instrucSearchBlock').show();
    $('.oneResult').hide();
    $('.js-search-results').hide();
    $('.searchParameters').hide();
    $('.newSearch').hide();
  })
}

function showNewSearchOption() {
  $('.newSearch').html(`
    <button type="submit" name="newSearchBut" class="newSearchBut">New Search</button>
  `);
}

function displayRecipeSearchData(data) {
  console.log(data);
  searchResults = data;
  const results = data.hits.map((item, index) => renderResult(item, index));
  hideSearchEng();
  showSearchParameters();
  showNewSearchOption();
  $('.searchParameters').show();
  $('.newSearch').show();
  $('.js-search-results').show();
  $('.js-search-results').html(results);
}

function hideResults() {
  $('.js-search-results').hide();
}

function renderIngList(item, index) {
  return `
    <li>${item}</li>
  `;
}

function showResult() {
  $('.js-search-results').on('click', '.resRecipe', function() {
    hideResults();
    $('.oneResult').show();
    console.log(this);
    let resInd = $(this).index();
    console.log(resInd);
    $('.recipeInfo').html(`
      <button type="submit" name="returnSearch" class="returnSearch">Search Results</button>
      <h2>
        ${searchResults.hits[resInd].recipe.label}
      </h2>
      <h3>
        <img src="${searchResults.hits[resInd].recipe.image}" alt="${searchResults.hits[resInd].recipe.label}" class="imgResult"/>
      </h3>
    `);

    $('.ingredients').html(`
      <h4>${searchResults.hits[resInd].recipe.ingredients.length} Ingredients</h4>
      <ul class="liIng">          
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
      <a class="instrucBut" target="_blank" href=${url}>Instructions</a>
    `);

    let FAT = Math.floor(searchResults.hits[resInd].recipe.totalNutrients.FAT.quantity/searchResults.hits[resInd].recipe.yield);
    let CARBS = Math.floor(searchResults.hits[resInd].recipe.totalNutrients.CA.quantity/searchResults.hits[resInd].recipe.yield);
    let PROT = Math.floor(searchResults.hits[resInd].recipe.totalNutrients.PROCNT.quantity/searchResults.hits[resInd].recipe.yield);

    $('.nutrition').html(`
      <h4>Nutrition Facts Per Serving</h4>
      <ul>
        <li>Calories: ${calCount}</li>
        <li>Fat: ${FAT} ${searchResults.hits[resInd].recipe.totalNutrients.FAT.unit}</li>
        <li>Carbohydrates: ${CARBS} ${searchResults.hits[resInd].recipe.totalNutrients.CA.unit}</li>
        <li>Protein: ${PROT} ${searchResults.hits[resInd].recipe.totalNutrients.PROCNT.unit}</li>
      </ul>
      `);
  });
}   

function startSearch() {
  $('.iconSearch').on('click', function() {
    
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
  newSearch();
}

$(watchSubmit);