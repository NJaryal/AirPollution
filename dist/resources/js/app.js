'use strict';function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}(function(){navigator.serviceWorker&&(navigator.serviceWorker.register('/sw.js').then(function(a){return navigator.serviceWorker.controller?a.waiting?(_showSnackBar('Get latest improvements'),_initSWUpdateBtn(a.waiting)):a.installing?_trackInstalling(a.installing):void a.addEventListener('updatefound',function(){_trackInstalling(a.installing)}):void 0}).catch(function(a){console.log(a)}),navigator.serviceWorker.addEventListener('controllerchange',function(){window.location.reload()}),navigator.serviceWorker.addEventListener('message',function(a){'mapsoffline'===a.data.message?_showOfflinePlaces():'ipoffline'===a.data.message&&localforage.getItem('ip').then(function(a){var b=a.apiData.data.city.geo;aqiCall(b[0],b[1],'ip')}).catch(function(a){console.log(a)})}))})();function _trackInstalling(a){a.addEventListener('statechange',function(){'installed'===a.state&&(_showSnackBar('Get latest improvements'),_initSWUpdateBtn(a))})}var map=void 0,initZoom=void 0,timeout=void 0,unionPoly=void 0,distances=[];function initGMap(){map=new google.maps.Map(document.getElementById('map'),{center:{lat:20,lng:20},zoom:8,maxZoom:14,mapTypeId:'roadmap',mapTypeControl:!1,streetViewControl:!1,zoomControl:!1,fullscreenControl:!1,styles:[{featureType:'poi.business',stylers:[{visibility:'off'}]},{featureType:'poi.park',elementType:'labels.text',stylers:[{visibility:'off'}]},{featureType:'road.arterial',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.highway',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.local',stylers:[{visibility:'off'}]}]}),localforage.getItem('isDark').then(function(a){a&&toggleDark()}).catch(function(a){console.log(a)}),google.maps.event.addListenerOnce(map,'idle',function(){axios.get('https://ipinfo.io/?token=7eed22252c7672').then(function(a){var b=a.data.loc.split(',');map.setCenter(new google.maps.LatLng(b[0],b[1])),aqiCall(b[0],b[1],'ip')}).catch(function(a){console.log(a)})});var a=document.getElementById('txtMapSearch'),b=new google.maps.places.SearchBox(a);map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('mapControls')),map.addListener('bounds_changed',function(){b.setBounds(map.getBounds())}),b.addListener('places_changed',function(){var a=b.getPlaces();if(0!=a.length){var c=new google.maps.LatLngBounds;a.forEach(function(a){return a.geometry?void(a.geometry.viewport?c.union(a.geometry.viewport):c.extend(a.geometry.location),map.fitBounds(c),initZoom=map.getZoom(),map.setZoom(initZoom-3),aqiCall(a.geometry.location.lat(),a.geometry.location.lng()).then(function(){map.setZoom(initZoom)})):console.log('Returned place contains no geometry')})}})}function _renderDOM(a){var b=Math.round;if('nope'!=a.status&&'error'!=a.status){var c=document.getElementById('badgeMain'),d=document.getElementById('badgeMainOtherToday'),e=document.getElementById('pollutantDetails'),f=document.getElementById('pollutantDetailsToday');e.innerHTML='',f.innerHTML='';var g=document.getElementById('timeObserved'),h=document.getElementById('locObserved'),i=document.getElementById('attribution'),j=document.getElementById('mainHealthMessage'),k=document.getElementById('healthMessageOtherToday');c.classList=[],c.classList.add('badge'),d.classList=[],d.classList.add('badge','small'),a=a.data;var l=a.aqi,m=new Date(a.time.v),n=_aqiStatus(l);for(var r in a.iaqi)if(a.iaqi.hasOwnProperty(r)&&_getTitle(r)){var s=document.createElement('div');s.classList.add('column');var t=document.createElement('div');t.classList.add('badge','smallest',_aqiStatus(a.iaqi[r].v)),t.innerText=b(10*a.iaqi[r].v)/10,a.dominentpol==r&&t.classList.add('dominant');var u=document.createElement('div');u.classList.add('main-title'),u.innerText=_getTitle(r),s.appendChild(t),s.appendChild(u),e.appendChild(s),(a.dominentpol==r||0==f.children.length)&&f.appendChild(s.cloneNode(!0))}c.innerText=l,d.innerText=l,c.classList.add(n),d.classList.add(n),j.innerText=50>=l?'No Risk, enjoy your day':100>=l?'Small concern for people sensitive to air pollution':150>=l?'Children & Senior groups may experience health effects':200>=l?'Everyone may begin to experience health effects':300>=l?'Everyone may experience more serious health effects':'Health warnings and emergency conditions',k.innerText=j.innerText,g.innerText=m.getHours()+':'+m.getMinutes(),h.innerText=b(a.city.distance/1e3)+'km - '+a.city.name,i.innerText=a.attributions[0].name,i.href=a.attributions[0].url;var o=document.getElementById('expand-legend'),p=o.getElementsByTagName('div')[0],q=_getStrokeColor(l);o.getElementsByTagName('span')[0].style.background=q,p.style.color=q,p.innerText=_aqiStatus(l,!0)}}function _aqiStatus(a,b){return 50>=a?'good':100>=a?'moderate':150>=a?b?'USG':'unhealthy-moderate':200>=a?'unhealthy':300>=a?b?'VU':'very-unhealthy':'hazardous'}function _getStrokeColor(a){return 50>=a?'#0ACD47':100>=a?'#F5DB2A':150>=a?'#F99846':200>=a?'#F16A62':300>=a?'#80518E':'#6B1C31'}function _getTitle(a){return'co'==a?'Carbon Monoxide':'h'==a?'Hydrogen':'no2'==a?'Nitrogen Oxide':'o3'==a?'Ozone':'pm10'==a?'PM (1.0)':'pm25'==a?'PM (2.5)':'so2'==a?'Sulphur Dioxide':null}async function aqiCall(a,b,c){var d=new google.maps.LatLng(a,b),e=document.getElementById('txtMapSearch'),f={status:''};for(c=c?c:e.value,timeout&&(clearTimeout(timeout),timeout=void 0);''===f.status||'nug'===f.status;)f=(await axios.get('https://api.waqi.info/feed/geo:'+a+';'+b+'/',{params:{token:'157ae3a4ea08e71b5d0e6ed5096fbe6a90a01e0d',key:c}})).data;if(localforage.setItem(c,{apiData:f,time:new Date,key:c}).then(function(){return localforage.keys()}).then(function(a){return 30>a.length?void 0:Promise.all(a.map(function(a){return localforage.getItem(a)}))}).then(function(a){a&&(a.sort(function(c,a){return new Date(a.time)-new Date(c.time)}),a.splice(-15),localforage.clear().then(function(){a.forEach(function(a){localforage.setItem(a.key,a)})}).catch(function(a){console.log(a)}))}).catch(function(a){console.log(a)}),!f.data.city.distance){var h=new google.maps.LatLng(f.data.city.geo[0],f.data.city.geo[1]);f.data.city.distance=google.maps.geometry.spherical.computeDistanceBetween(d,h)}if(_renderDOM(f),'none'!==document.querySelector('.map').style.display){var g=map.getBounds().getSouthWest().lat()+','+map.getBounds().getSouthWest().lng()+','+map.getBounds().getNorthEast().lat()+','+map.getBounds().getNorthEast().lng();axios.get('https://api.waqi.info/map/bounds/?latlng='+g+'&token=157ae3a4ea08e71b5d0e6ed5096fbe6a90a01e0d').then(function(a){var b=a.data,c=new jsts.geom.GeometryFactory;unionPoly&&unionPoly.setMap(null),distances=[];for(var n=0;n<b.data.length;n++)if('-'!=b.data[n].aqi){var e=new google.maps.LatLng(b.data[n].lat,b.data[n].lon),g=google.maps.geometry.spherical.computeDistanceBetween(d,e)+1e3;2e4<g||distances.push({distance:g,coords:e,aqi:b.data[n].aqi})}distances.sort(function(c,a){return c.distance<a.distance?1:a.distance<c.distance?-1:0});for(var h,j=[],k=void 0,l=0;l<distances.length&&5!=l;l++)h=new google.maps.Polygon({paths:getCirclePoints(distances[l].coords,distances[l].distance,80,!0)}),j.push(c.createPolygon(c.createLinearRing(googleMaps2JSTS(h.getPath())))),j[l].normalize(),k=0==l?j[l]:k.union(j[l]);var m=jsts2googleMaps(k);unionPoly=new google.maps.Polygon({map:map,paths:m,strokeColor:_getStrokeColor(f.data.aqi),strokeOpacity:.6,strokeWeight:1,fillColor:_getStrokeColor(f.data.aqi),fillOpacity:.35}),map.setZoom(14)}).catch(function(a){console.log(a)}),timeout=setTimeout(function(){var d=map.getZoom();map.setZoom(d-3),aqiCall(a,b,c).then(function(){map.setZoom(d)})},15e3)}}function _showSnackBar(a,b){if(a){var c=document.querySelector('.snack-bar'),d=document.getElementById('snackMessage'),e=document.getElementsByTagName('meta')['theme-color'];d.innerText=a,c.style.display='flex',e.content='#363636',b&&setTimeout(function(){c.style.display='none',d.innerText='',e.content='#2ad09e'},b)}}function _initSWUpdateBtn(a){if(a){var b=document.getElementById('btnSwUpdate');b.style.display='inline-flex',b.addEventListener('click',function(){a.postMessage({action:'skipWaiting'})})}}function _showOfflinePlaces(){var a=document.querySelector('.map');a.style.display='none';var b=document.getElementById('offlinePlaces');b.innerHTML='',localforage.iterate(function(a,c){if(c&&'ip'!==c){var d=document.createElement('li');d.innerText=c,d.classList.add('card'),d.addEventListener('click',function(){var b=a.apiData.data.city.geo;aqiCall(b[0],b[1],c)}),b.appendChild(d)}}),b.parentElement.style.display='block'}var btnLegend=document.getElementById('expand-legend');btnLegend.addEventListener('click',function(){var a=document.getElementById('aqi-values'),b=a.style.display;a.style.display='block'===b?'none':'block';var c=btnLegend.getElementsByTagName('i')[0];c.innerText='expand_less'===c.innerText?'expand_more':'expand_less'});function toggleDark(){var a=document.body.classList.toggle('dark');map&&(a?map.setOptions({styles:[{elementType:'geometry',stylers:[{color:'#242f3e'}]},{elementType:'labels.text.stroke',stylers:[{color:'#242f3e'}]},{elementType:'labels.text.fill',stylers:[{color:'#746855'}]},{featureType:'administrative.locality',elementType:'labels.text.fill',stylers:[{color:'#71717f'}]},{featureType:'poi',elementType:'labels.text.fill',stylers:[{color:'#71717f'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#263c3f'}]},{featureType:'poi.park',elementType:'labels.text.fill',stylers:[{color:'#6b9a76'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#38414e'}]},{featureType:'road',elementType:'geometry.stroke',stylers:[{color:'#212a37'}]},{featureType:'road',elementType:'labels.text.fill',stylers:[{color:'#9ca5b3'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#746855'}]},{featureType:'road.highway',elementType:'geometry.stroke',stylers:[{color:'#1f2835'}]},{featureType:'road.highway',elementType:'labels.text.fill',stylers:[{color:'#cacaca'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#2f3948'}]},{featureType:'transit.station',elementType:'labels.text.fill',stylers:[{color:'#828288'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#17263c'}]},{featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#515c6d'}]},{featureType:'water',elementType:'labels.text.stroke',stylers:[{color:'#17263c'}]}].concat(_toConsumableArray(map.styles))}):map.setOptions({styles:[{featureType:'poi.business',stylers:[{visibility:'off'}]},{featureType:'poi.park',elementType:'labels.text',stylers:[{visibility:'off'}]},{featureType:'road.arterial',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.highway',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'road.local',stylers:[{visibility:'off'}]}]}),localforage.setItem('isDark',a))}