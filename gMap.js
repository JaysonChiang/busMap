function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById('map-canvas');

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '90%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    //var color = '#';
    var color = '';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
} 

$(document).ready(function(){
    
    detectBrowser();

    var routesList   = [],
        busids       = [],
        busRoutes    = [],
        markerList   = {},
        stopid2line  = "./proxy.php?url=http://pda.5284.com.tw/MQS/businfo4.jsp?SLID=",
        line2stopUrl = "./proxy.php?url=http://pda.5284.com.tw/MQS/businfo2.jsp?routename=";     
        count        = 0;

    var stopName = getParameterByName('name');
    $('#stopName').text(stopName);

    google.maps.event.addDomListener(window, "load", initialize);

    function initialize() {

        var myOptions = {
                zoom: 12,
                center: new google.maps.LatLng( 25.05, 121.55 ),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        
        var map = new google.maps.Map( document.getElementById('map-canvas'), myOptions );

        mainBusStop( map );
    }

    function mainBusStop (map) {

        var jsonString = JSON.stringify([stopName]);
  
        $.ajax({
            type:"POST",
            url:'./bus-stop.php',
            data:{name:jsonString},
            cache:true
        })
        .done(function(data) {

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
        })
        .done(function(){
            busids.forEach(function(id){
                getRoutes(stopid2line, id, plotRoutes, map);
            });
        });
    }

    function getRoutes (url, para, callback, map){
        var myUrl = url + para;
        $.ajax({
            type:"GET",
            url:myUrl
        })
        .done(function(data){

            var $tr = $(data).find('tr.ttego1, tr.ttego2');

            $.each($tr,function(index,val){
                var routeName = $(val).find('td:first-child').text();

                if (routesList.indexOf(routeName)<0){
                    routesList.push(routeName);
                    markerList['_'+routeName] = [];
                }
            });
        })
        .done(function(){
            count++;
            if(count === busids.length){
                console.log('getRoutes:'+ count);
                callback(routesList, para ,map);
                routesList = [];
            }
        });
    }

    function displayRoutes (routeList, para, map){

        var jsonString = JSON.stringify(routeList);

        $.ajax({
             type:'POST',
             url :'./bus-stop.php', 
             data:{name:jsonString},
             cache:true
        })
        .done( function(data) {
       //     markerList[para].forEach(function(marker){
       //         marker.setVisible(false);
       //     });
        for(var key in markerList){
                                              
                            
                               markerList[key].forEach(function(marker){
                                   marker.setVisible(false);
                               });
        }



            var pinColor = getRandomColor();
            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));

            data.forEach(function(item){
                var position = new google.maps.LatLng( 
                        item.geometry.coordinates[1], 
                        item.geometry.coordinates[0]
                    ),
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: pinImage,
                        title: item.properties.bsm_chines
                    });
                markerList['_'+para].push(marker);
                busids.push(item.properties.bsm_bussto);
            });
        });
    }

    function plotRoutes (routesList, para, map){
        console.log('plotList:'+ routesList);
        var jsonString = JSON.stringify(routesList);

        $.ajax({
            type: "POST",
            url:"./bus-route.php",
            data: {routes : jsonString}, 
            cache: true
        })  
        .done( function( data ) {
            var routeObjs   = [],
                routeObjs_s = [],
                zz          = 1;

            data.forEach(function(item, idx){
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

                var flightPath = new google.maps.Polyline({
                    path: flightPlanCoordinates,
                    geodesic: true,
                        strokeColor: '#'+getRandomColor(), //#FF0000
                        strokeOpacity: 1.0,
                        strokeWeight: 4,
                        routeName: item.properties.bad_chines,
                        routeId:idx,
                        clicked:false
                    });
                flightPathShadow.setMap(map);
                flightPath.setMap(map);
                routeObjs_s.push(flightPathShadow);
                routeObjs.push(flightPath);
                
                google.maps.event.addListener(flightPath, 'click', function (event) {
                 // this.setOptions({zIndex:zz++});
                    var thisId = this.routeId;

                    routeObjs.forEach(function(obj,i){
                        if(obj.routeId === thisId) {
                            obj.setOptions({zIndex      :zz++,
                                            strokeWeight: 8,
                                            clicked     : true });
                        } else {
                            obj.setOptions({strokeWeight: 4,
                                            clicked     : false});
                            routeObjs_s[i].setOptions({strokeOpacity: 0});
                        }
                    });

                    $('#routeName').text(this.routeName);


                    //get this Line's stops;
                    if( markerList['_' + this.routeName].length === 0){
                        var targetStops = [];
                        busroutes = [];
                        count = [];
                        busids = [this.routeName];
                        getRoutes(line2stopUrl,this.routeName, displayRoutes, map);
                    } else {
                        for(var key in markerList){
                            var myBool = (key === ('_' + this.routeName)) ? true : false;                             
                            
                               markerList[key].forEach(function(marker){
                                   marker.setVisible(myBool);
                               });
                        }
                    }
                });

                google.maps.event.addListener(flightPath, 'mouseover', function (event) {
                    if(!this.clicked){
                        this.setOptions({strokeWeight:8});
                        flightPathShadow.setOptions({strokeOpacity: 0.2});
                    }
                }); 

                google.maps.event.addListener(flightPath, 'mouseout', function (event) {
                    if(!this.clicked){
                        this.setOptions({strokeWeight:4});
                        flightPathShadow.setOptions({strokeOpacity: 0});
                    }
                });  
            });
        });
    }

});

