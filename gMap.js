$(document).ready(function(){

var go=[];
$.getJSON( "myBus.json", function( data ) {
  
  var bus113 = data.filter(function(item){
        return item.Route_nameZh === "812" ;
  });

go = bus113.filter(function(item){
    return item.Station_goBack ==="0";
});

/*
var back = bus113.filter(function(item){
    return item.Station_goBack ==="1";
});
*/
  console.log(bus113.length+","+ go.length); 
});

function initialize() {
    
    var myLatLng = new google.maps.LatLng( 24, 122 ),
        myOptions = {
            zoom: 4,
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
       

    go.forEach(function(item){
        //markers[key] = item;
        var position = new google.maps.LatLng( item.Station_latitude, item.Station_longitude ),
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: item.Route_nameZh
        });
    });

    

        
    }, 1500 );

};


});