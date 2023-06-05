$(window).on('load', function () {
    if (
        $('#preloader').length) {$('#preloader').delay(1000).fadeOut('slow',function () {
            $(this).remove();
        });
    }
});

$('#earthquakeSubmit').click(function() {

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
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#rowOneHeading').html('Date and Time:');
                $('#rowTwoHeading').html('Depth:');
                $('#rowThreeHeading').html('Magnitude:');
                $('#rowFourHeading').html('Longitude:');
                $('#rowFiveHeading').html('Latitude:');
                $('#rowOneResult').html(result['data'][0]['datetime']);
                $('#rowTwoResult').html(result['data'][0]['depth']);
                $('#rowThreeResult').html(result['data'][0]['magnitude']);
                $('#rowFourResult').html(result['data'][0]['lng']);
                $('#rowFiveResult').html(result['data'][0]['lat']); 
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        }
    }); 

});