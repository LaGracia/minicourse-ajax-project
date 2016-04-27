
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // Clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Get Google Street View image
    var street = $('#street').val();
    var city = $('#city').val();
    var location = street + ', ' + city;
    var streetview = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location;
    console.log(streetview);

    // Capitalize initial letters of street and city
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    var address = street.capitalize() + ', ' + city.capitalize();

    // Change header question and load image
    $greeting.text('So you want to live at ' + address + '?')
    $body.append('<img class="bgimg" src="' + streetview + '">');

    // Search for NY Times articles on specified city
    var nytAPI = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=0297354ea0ef1f132d762f1a94732524:11:51839516';
    console.log(nytAPI);
    
    // Load articles and change header text
    $.getJSON(nytAPI, function(data) {
        console.log(data);
        
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article"> <a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };

        var chosenCity = city.capitalize();
        $nytHeaderElem.text('New York Times Articles About ' + chosenCity);
    
    });

    return false;

};

$('#form-container').submit(loadData);
