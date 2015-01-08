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

function getURLParam(name) {
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
        stopListGo   = [],
        stopListBk   = [],
        linkList   =[],
        linkListGo = [],
        linkListBk = [], //-----------------------------------------------------
        busLineIdList       = [],
      //  busRoutes    = [],
        markerDict   = {},
        stopid2line  = "./proxy.php?url=http://pda.5284.com.tw/MQS/businfo4.jsp?SLID=",
        line2stopUrl = "./proxy.php?url=http://pda.5284.com.tw/MQS/businfo2.jsp?routename=";     
        count        = 0,
        stopName     = getURLParam('name'),
        nowRouteName = "";

//start setMap
    google.maps.event.addDomListener(window, "load", initialize);
    
    $('.busStop').on('click',function(){
        whichWayClick(nowRouteName);
    });

    function whichWayClick(lineName){
        var goState = $('#goWay').prop("checked");
            bkState = $('#bkWay').prop("checked");
            console.log('go:'+goState+', bk:'+bkState);
        var thisRouteName = '_' + lineName;

        for(var key in markerDict){ 

            console.log('key:'+key+', thisRouteName:'+thisRouteName);
            if(goState){
                markerDict[key].go.forEach(function(marker){
                    marker.setVisible(key === thisRouteName);
                });
                markerDict[key].bk.forEach(function(marker){
                    marker.setVisible(false);
                });
            }
            if(bkState){
                markerDict[key].go.forEach(function(marker){
                    marker.setVisible(false);
                });
                markerDict[key].bk.forEach(function(marker){
                    marker.setVisible(key === thisRouteName);
                });
            }
        }
    }

    function initialize() {

        var myOptions = {
                zoom: 12,
                center: new google.maps.LatLng( 25.05, 121.55 ),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        
        var map = new google.maps.Map( document.getElementById('map-canvas'), myOptions );
//end setMap

        $( ".target" ).change(function() {
            var target = $(this).val();
            stopName = target;
            $('#stopName').text(stopName);
            viewMap( map );
        });

        if( stopName === "" ){
            return false;
        }

        $('#stopName').text(stopName);
        viewMap( map );

    }

    function viewMap (map) {

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

                busLineIdList.push(item.properties.bsm_bussto);
            });
        })
        .done(function(){
            busLineIdList.forEach(function( id ){
                getRoutes1(stopid2line, id, map, plotRoutes);
            });
        });
    }

    function getRoutes1 (url, para, map, callback){
        var myUrl = url + para;
        $.ajax({
            type:"GET",
            url:myUrl
        })
        .done(function(data){

            var $tr = $(data).find('tr.ttego1, tr.ttego2');

            $.each($tr,function(index, val){
                var routeName = $(val).find('td:first-child a').text();
                var linkURL = $(val).find('td:first-child a').attr('href'); 
                if (routesList.indexOf(routeName) < 0){
                    routesList.push(routeName);
                    linkList.push(linkURL);
                    markerDict['_'+routeName] = {};
                    markerDict['_'+routeName].pre = [];
                    markerDict['_'+routeName].go = [];
                    markerDict['_'+routeName].bk = [];
                }
            });
        })
        .done(function(){
            count++;
            if(count === busLineIdList.length){
                console.log('getRoutes:'+ count);
                //-----------------------------
                // plot only one side bus Stop
                //-----------------------------
                var jsonString = JSON.stringify(linkList);
               $.ajax({
                  type:"POST",
                  url:"./bus-getStopId.php",
                  data:{list:jsonString}
               });
              
                callback(routesList, para ,map);
                routesList = [];
            }
        });
    }

    function getRoutes2 (url, para, map, callback){
        var myUrl = url + para;
        $.ajax({
            type:"GET",
            url:myUrl
        })
        .done(function(data){

            var $trgo = $(data).find('tr.ttego1, tr.ttego2');
                $trbk = $(data).find('tr.tteback1, tr.tteback2');

            $.each($trgo, function(index, val){
                var routeName = $(val).find('td:first-child a').text();
                var linkURL = $(val).find('td:first-child a').attr('href'); 
                if (stopListGo.indexOf(routeName) < 0){
                    stopListGo.push(routeName);
                    linkListGo.push(linkURL);
                //    markerDict['_'+routeName] = [];
                }
            });

            $.each($trbk, function(index, val){
                var routeName = $(val).find('td:first-child a').text();
                var linkURL = $(val).find('td:first-child a').attr('href'); 
                if (stopListBk.indexOf(routeName) < 0){
                    stopListBk.push(routeName);
                    linkListBk.push(linkURL);
                //    markerDict['_'+routeName] = [];
                }
            });
        })
        .done(function(){
            count++;
            if(count === busLineIdList.length){
                console.log('getRoutes:'+ count);
                //-----------------------------
                // plot only one side bus Stop
                //-----------------------------
                var jsonStringGo = JSON.stringify(linkListGo);
                var jsonStringBk = JSON.stringify(linkListBk);
                $.when(
                   $.ajax({
                      type:"POST",
                      url:"./bus-getStopId.php",
                      data:{list:jsonStringGo}
                   }),
                   $.ajax({
                      type:"POST",
                      url:"./bus-getStopId.php",
                      data:{list:jsonStringBk}
                   })
               )
               .done(function(goList, bkList){
                    console.log('goStop is:'+ goList[0]);
                    console.log('bkStop is:'+ bkList[0]);
                    console.log('goLength:'+ goList[0].length + ', bkLength:'+ bkList[0].length);
                    console.log('_para:_'+para+', para:'+ para);
                //    if(para.length>0){
                        var nowArray = markerDict['_' + para].pre;
                        if(nowArray.length > 0){
                            nowArray.forEach(function(marker){
                                var markerId = marker._id + "";
                                if(goList[0].indexOf(markerId)>=0){
                                   markerDict['_' + para].go.push(marker);
                                }
                                if(bkList[0].indexOf(markerId)>=0){
                                   markerDict['_' + para].bk.push(marker);
                                }
                                /*
                                if(goList[0].indexOf(markerId)<0){
                                //    marker.setMap(null);
                                    marker.setVisible(false);
                                } 
                                */
                            });
                            whichWayClick(nowRouteName);
                        }
                //    }
                });
              
                callback(stopListGo, para ,map);
                stopListGo = [];
                stopListBk = [];
            }
        });
    }

    function displayRoutes (stopList, para, map){

        var jsonString = JSON.stringify(stopList);

        $.ajax({
             type:'POST',
             url :'./bus-stop.php', 
             data:{name:jsonString},
             cache:true
        })
        .done( function(data) {

            for(var key in markerDict){
               markerDict[key].go.forEach(function(marker){
                   marker.setVisible(false);
               });
               markerDict[key].bk.forEach(function(marker){
                   marker.setVisible(false);
               });
               markerDict[key].pre.forEach(function(marker){
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
                        title: item.properties.bsm_chines,
                        _id:item.properties.bsm_bussto
                    });
                (markerDict['_' + para].pre).push(marker);
                busLineIdList.push(item.properties.bsm_bussto);
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

                    var thisId = this.routeId;
                    $('#routeName').text(this.routeName);
                    nowRouteName = this.routeName;

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

                    //get this Line's stops;
                    if( (markerDict['_' + this.routeName]).pre.length === 0 ){
                        count   = 0;
                        linkListGo = [];
                        linkListBk = [];
                        busLineIdList  = [this.routeName];
                        getRoutes2(line2stopUrl, this.routeName, map, displayRoutes);
                    } else {
                        whichWayClick(this.routeName);
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

