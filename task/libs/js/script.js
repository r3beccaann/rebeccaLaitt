$(window).on('load', function () {
    if (
        $('#preloader').length) {
            $('#preloader').delay(1000).fadeOut('slow', function () {
                $(this).remove();
            });
    }
});

$('#earthquakeSubmit').click(function () {

    $.ajax({
        url: "libs/php/earthquake.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#northInputE').val(),
            south: $('#southInputE').val(),
            east: $('#eastInputE').val(),
            west: $('#westInputE').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#rowOneHeadingE').html('Date and Time:');
                $('#rowTwoHeadingE').html('Depth:');
                $('#rowThreeHeadingE').html('Magnitude:');
                $('#rowFourHeadingE').html('Longitude:');
                $('#rowFiveHeadingE').html('Latitude:');
                $('#rowOneResultE').html(result['data'][0]['datetime']);
                $('#rowTwoResultE').html(result['data'][0]['depth']);
                $('#rowThreeResultE').html(result['data'][0]['magnitude']);
                $('#rowFourResultE').html(result['data'][0]['lng']);
                $('#rowFiveResultE').html(result['data'][0]['lat']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

});

$('#weatherSubmit').click(function () {

    $.ajax({
        url: "libs/php/weather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#northInputW').val(),
            south: $('#southInputW').val(),
            east: $('#eastInputW').val(),
            west: $('#westInputW').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#rowOneHeadingW').html('Date and Time:');
                $('#rowTwoHeadingW').html('Temperature:');
                $('#rowThreeHeadingW').html('Clouds:');
                $('#rowFourHeadingW').html('Wind Speed:');
                $('#rowFiveHeadingW').html('Wind Direction:');
                $('#rowOneResultW').html(result['data'][0]['datetime']);
                $('#rowTwoResultW').html(result['data'][0]['temperature']);
                $('#rowThreeResultW').html(result['data'][0]['clouds']);
                $('#rowFourResultW').html(result['data'][0]['windSpeed']);
                $('#rowFiveResultW').html(result['data'][0]['windDirection']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    });

});