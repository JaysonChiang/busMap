$(document).ready(function(){


/***for NTP

$.getJSON( "data/bus-ntp-stop.json", function( data ) {
  
  var busNTP = data.filter(function(item){
        return item.Route_nameZh === "812" ;
  });

go = busNTP.filter(function(item){
    return item.Station_goBack ==="0";
});


var back = busNTP.filter(function(item){
    return item.Station_goBack ==="1";
});

});
**/



function initialize() {
    
    var myLatLng = new google.maps.LatLng( 25.05, 121.55 ),
        myOptions = {
            zoom: 12,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            },
        map = new google.maps.Map( document.getElementById('map-canvas'), myOptions );
        //marker = new google.maps.Marker( {position: myLatLng, map: map} );

    //marker.setMap( map );
    moveMarker( map );
    
}

google.maps.event.addDomListener(window, "load", initialize);

    function moveMarker( map) {
        
        //delayed so you can see it move
        setTimeout( function(){ 
        
           // marker.setPosition( new google.maps.LatLng( 24, 122 ) );
           // map.panTo( new google.maps.LatLng( 24, 122 ) );

            $.getJSON( "data/bus-tp-stop.json", function( data ) {
                
                data.features
                .forEach(function(item){
                
                    var position = new google.maps.LatLng( 
                        item.geometry.coordinates[1], 
                        item.geometry.coordinates[0]
                        ),
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: item.properties.bsm_chines
                    });
                });
            });

        }, 3000 );

    };

});