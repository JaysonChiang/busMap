$(document).ready(function(){

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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

/*
            $.getJSON( "data/bus-tp-stop.json", function( data ) {
                
               
                var myStation = data.features.filter(function(s){
                    return s.properties.bsm_chines === "";     
                });

                data.features.forEach(function(item){
                
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
*/
/***
 ["111","1717"]
*/
// var station_SL = ["111","1717","206","255","255區","260","260區","303","303區",
// "304","304承德","304重慶","557","620","680","683",
// "內科通勤專車13","內科通勤專車15","內科通勤專車16","小15","小15區",
// "小16","小17","小18","小18區","小19","市民小巴1","紅30","紅5","重慶幹線"];
var station_SL = ["111","1717","206","255","260","303","304","557","620","680","683"];

            $.getJSON( "data/bus-tp-route.json", function( data ) {

                var myRoute = data.features
                .filter(function(s){
                    return station_SL.indexOf(s.properties.bad_chines) > 0 ;
                })
                .forEach(function(item){

                    var flightPlanCoordinates = item.geometry.coordinates.map(function(point){
                        return (new google.maps.LatLng(point[1], point[0]));
                    });

                    var flightPath = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                        strokeColor: getRandomColor(), //#FF0000
                        strokeOpacity: 1.0,
                        strokeWeight: 4
                    });

                    flightPath.setMap(map);
                });
            });
        }, 3000 );
    };

});