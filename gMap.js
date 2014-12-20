

$(document).ready(function(){


    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

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
var stopName = getParameterByName('name');
function moveMarker( map) {

        //delayed so you can see it move
        
       // marker.setPosition( new google.maps.LatLng( 24, 122 ) );
       // map.panTo( new google.maps.LatLng( 24, 122 ) );
       var busids=[];
       var routesList = [];

       var myurl = "proxy.php?url=http://pda.5284.com.tw/MQS/businfo4.jsp?SLID=";
       var count = 0;
       $.get('./bus-stop.php', {'name':stopName}, function(data) {

            data.forEach(function(item){

                var position = new google.maps.LatLng( 
                    item.geometry.coordinates[1], 
                    item.geometry.coordinates[0]
                    ),
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: item.properties.bsm_chines
                });
                busids.push(item.properties.bsm_bussto);
            });

        }).done(function(){

            console.log(busids);

            busids.forEach(function(id){
                getRoutes(myurl+id);
            });
        });

    var busRoutes = [];

function getRoutes(url){
     console.log(url);

     $.ajax(url).done(function(data){

        var $tr = $(data).find('tr.ttego1, tr.ttego2');

        $.each($tr,function(index,val){
            var routeName = $(val).find('td:first-child').text();

            if (routesList.indexOf(routeName)<0){
                routesList.push(routeName);
            }
        });
    }).done(function(){
        count++;
        if(count === busids.length){
            console.log('getRoutes:'+ count);
            plotRoutes(routesList);
        }
    });
}


function plotRoutes (routesList){
    console.log('plotList:'+ routesList);
    var jsonString = JSON.stringify(routesList);

    $.ajax({
        type: "POST",
        url:"./bus-route.php",
        data: {routes : jsonString}, 
        cache: true
    })
    .done( function( data ) {

        var zz = 1;
        data
        .forEach(function(item){
                    //console.log(item);
                    var flightPlanCoordinates = item.geometry.coordinates.map(function(point){
                        return (new google.maps.LatLng(point[1], point[0]));
                    });

                    var flightPathShadow = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        strokeColor: 'black',
                        strokeOpacity: 0,
                        strokeWeight: 16
                    });

                    flightPathShadow.setMap(map);

                    var flightPath = new google.maps.Polyline({
                        path: flightPlanCoordinates,
                        geodesic: true,
                            strokeColor: getRandomColor(), //#FF0000
                            strokeOpacity: 1.0,
                            strokeWeight: 4,
                            routeName: item.properties.bad_chines
                        });

                    flightPath.setMap(map);

                    google.maps.event.addListener(flightPath, 'click', function (event) {
                      this.setOptions({zIndex:zz++});
                      console.log(this.routeName);
                  });

                    google.maps.event.addListener(flightPath, 'mouseover', function (event) {
                      this.setOptions({strokeWeight:8});
                      flightPathShadow.setOptions({strokeOpacity: 0.2});
                  }); 

                    google.maps.event.addListener(flightPath, 'mouseout', function (event) {
                      this.setOptions({strokeWeight:4});
                      flightPathShadow.setOptions({strokeOpacity: 0});
                  });  
                });
            });

        }
    };
});

