$(document).ready(function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        console.log(lat);
        console.log(lon);

        var geocodeURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

        $.getJSON(geocodeURL, function (data) {
            if (data && data.address) {
                // var address = data.display_name;
                // $('#address').text(address);
                console.log(data.address);

                var address = data.address;
                var city = address.city || address.town || address.village;
                var city_district = address.city_district;
                var country = address.country;
                var country_code = address.country_code;
                var industrial = address.industrial;
                var region = address.region;
                var postcode = address.postcode;
                var address_name = data.display_name;

                console.log(city);
                console.log(city_district);
                console.log(country);
                console.log(country_code);
                console.log(industrial);
                console.log(region);
                console.log(postcode);

                $('#spanDistrict').text(city_district);
                $('#spanCountry').text(country);

                alert(address_name);
            } else {
                alert("Geocode was not successful for the following reason: " + data.error);
            }
        });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

})