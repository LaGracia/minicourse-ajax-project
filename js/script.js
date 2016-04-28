
function loadData() {

    var $body = $('body');
    var $greeting = $('#greeting');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $wikiElem = $('#wikipedia-links');

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

    // Construct NYT API URL to search for articles for the chosen city
    var nytAPI = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&fl=headline,snippet,web_url&api-key=0297354ea0ef1f132d762f1a94732524:11:51839516';
    console.log(nytAPI);
    
    // Get articles using the URL
    $.getJSON(nytAPI, function(data) {
        console.log(data);

        // List articles under the header
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article"> <a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };

    // Display an error message if the request fails
    }).fail(function() {
        $nytHeaderElem.text('Problem loading New York Times articles!');
    });

    // Change NY Times header text
    var chosenCity = city.capitalize();
    $nytHeaderElem.text('New York Times Articles About ' + chosenCity);

    // Construct MediaWiki API URL to search for Wikipedia links
    var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=?';
    console.log(wikiURL);

    // Time out any error
    var wikiTimeoutMsg = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia links!');
    }, 6000);

    // Get Wikipedia page titles and URLs
    $.ajax({
        url: wikiURL,
        dataType: 'jsonp'
    }).done(function(data) {
        console.log(data);
            
        // List links under the header
        var pageList = data[1];
        for (var i = 0; i < pageList.length; i++) {
            var pageTitle = pageList[i];
            var pageURL = 'http://en.wikipedia.org/wiki/' + pageTitle;
            $wikiElem.append('<li class="link"><a href="' + pageURL + '">' + pageTitle + '</a></li>');
        };

        // Prevent timeout message from appearing by default
        clearTimeout(wikiTimeoutMsg);
    });

    // Change Wikipedia header text
    var chosenCity = city.capitalize();
    $wikiHeaderElem.text('Relevant Wikipedia Links About ' + chosenCity);

    // Prevent the submit function from reloading the page by default
    return false;

};

$('#form-container').submit(loadData);
