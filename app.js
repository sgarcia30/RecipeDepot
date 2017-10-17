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
      to: 100
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

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
    // queryTarget.val("");
    // Get the number of ingredients
    ingTarget = $(event.currentTarget).find('.numIng');
    numIng = ingTarget.val();
    // ingTarget.val("");
    // Get the calorie range values
    calLowTarget = $(event.currentTarget).find('.low');
    calHiTarget = $(event.currentTarget).find('.high');
    let low = calLowTarget.val();
    // calLowTarget.val("");
    let high = calHiTarget.val();
    // calHiTarget.val("");

    if (low != "" && high != "") {
      calRange = `gte ${low}, lte ${high}`;
    }
    else if (high != "") {
      calRange = `lte ${high}`;
    }
    else if (low != ""){
      calRange = `gte ${low}`;
    }
    else {
      calRange = "";
    }

    // Get the diet labels that are checked
    dietTarget = $('input[name=diet]:checked', '.js-search-form');
    dietLabel = dietTarget.val();
    // dietTarget.attr('checked',false);
    // Get the allergy label checked
    allTarget = $('input[name=allergy]:checked', '.js-search-form');
    console.log("something here", allTarget);
    allergyLab = allTarget.map((index, target) => target.value).toArray();
    console.log(allergyLab);
    // $('input[name=allergy]', '.js-search-form').attr('checked',false);
    $('.js-search-form')[0].reset();

    // Call function to get data from API
    getDataFromApi(qVal, displayRecipeSearchData, numIng, calRange, dietLabel, allergyLab);
  });
}

$(watchSubmit);