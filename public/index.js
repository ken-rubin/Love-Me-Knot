(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(){const e=new Proxy(new URLSearchParams(window.location.search),{get:(e,t)=>e.get(t)});let t=e.edit;const n=document.getElementById("cover"),o=document.getElementById("InviteeDiv"),l=document.getElementById("map"),a=document.getElementById("confirm"),s=document.getElementById("MapButton"),i=document.getElementById("ConfirmButton"),r=document.getElementById("AtendeesTextArea"),d=document.getElementById("SendConfirmButton");r&&fetch("/get",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({she:e.she,he:e.he,attendies:r.value})}).then((e=>e.json())).then((e=>{console.log("...back from server."),e.success?r.value=e.payload:alert(new Error(e.payload))})),o&&(o.innerText=e.she&&e.he?`${e.she}  &  ${e.he}`:e.she?e.she:e.he),d?.addEventListener("click",(()=>{const t=document.getElementById("FredImage");t&&t.classList.remove("AnmiateFadeIn"),fetch("/set",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({she:e.she,he:e.he,attendies:r.value})}).then((e=>e.json())).then((e=>{if(console.log("...back from server."),e.success){const e=document.getElementById("FredImage");e&&e.classList.add("AnmiateFadeIn")}else alert(new Error(e.payload))}))})),i?.addEventListener("click",(()=>{const e=a?.classList.contains("hidden");console.log(e),e?(l?.classList.add("hidden"),a?.classList.remove("hidden"),n?.classList.add("totallytransparent"),s&&(s.innerText="map"),i&&(i.innerText="invite")):(a?.classList.add("hidden"),n?.classList.remove("totallytransparent"),s&&(s.innerText="map"),i&&(i.innerText="confirm"))})),s?.addEventListener("click",(()=>{const e=l?.classList.contains("hidden");console.log(e),e?(a?.classList.add("hidden"),l?.classList.remove("hidden"),n?.classList.remove("totallytransparent"),s&&(s.innerText="invite"),i&&(i.innerText="confirm"),navigator.geolocation&&navigator.geolocation.getCurrentPosition((e=>{const t={lat:e.coords.latitude,lng:e.coords.longitude};var n=new google.maps.LatLngBounds;n.extend({lat:41.237507629670944,lng:-73.3964314082411}),n.extend(t),f.fitBounds(n);try{var o={origin:t,destination:{lat:41.23715,lng:-73.39581727981567},travelMode:google.maps.TravelMode.DRIVING};k.route(o,((e,t)=>{"OK"==t&&S.setDirections(e)}))}catch(e){alert("Geocode was not successful for the following reason: "+e)}}),(()=>{}))):(l?.classList.add("hidden"),n?.classList.remove("totallytransparent"),s&&(s.innerText="map"),i&&(i.innerText="confirm"))}));let g=[],m=[{lat:41.239560541203865,lng:-73.39134439917926},{lat:41.239384788295496,lng:-73.3912635849484},{lat:41.23916696066689,lng:-73.39119384751402},{lat:41.238977369362196,lng:-73.39124749169432},{lat:41.23881198075364,lng:-73.3912635849484},{lat:41.238735337110214,lng:-73.39125285611235,marker:!0,label:"25",message:"Turn left.  Head north along the pond to the clearing."},{lat:41.23880391300593,lng:-73.39166055188261,marker:!0,label:"24",message:"Turn right."},{lat:41.238525575100134,lng:-73.3920736120709},{lat:41.23853767677287,lng:-73.39239547715269,marker:!0,label:"23",message:"Turn left off the main path."},{lat:41.238578015665766,lng:-73.39262078270994},{lat:41.23855381233301,lng:-73.39292655453764},{lat:41.238473134492445,lng:-73.3932269619473},{lat:41.23833194803182,lng:-73.39335570798002},{lat:41.23799058050354,lng:-73.39337716565214},{lat:41.23778081610329,lng:-73.39351664052091},{lat:41.237619458414265,lng:-73.39376340375028},{lat:41.237409692822986,lng:-73.39408526883207},{lat:41.23725640215749,lng:-73.39443932042204},{lat:41.23711924704677,lng:-73.39478264317594},{lat:41.2371,lng:-73.39525471196256},{lat:41.23715,lng:-73.39581727981567,marker:!0,label:"Entrance",message:"Enter the trail east of the parking lot.  Continue until marker 23."}];const c=new google.maps.InfoWindow,p=(e,t)=>{google.maps.event.addListener(e,"click",(()=>{c.setContent(t),c.open(f,e)}))},h={max:{lat:Number.MIN_SAFE_INTEGER,lng:Number.MIN_SAFE_INTEGER},min:{lat:Number.MAX_SAFE_INTEGER,lng:Number.MAX_SAFE_INTEGER}},y=m.reduce(((e,t)=>({max:{lat:Math.max(e.max.lat,t.lat),lng:Math.max(e.max.lng,t.lng)},min:{lat:Math.min(e.min.lat,t.lat),lng:Math.min(e.min.lng,t.lng)}})),h),u={lat:(y.max.lat+y.min.lat)/2,lng:(y.max.lng+y.min.lng)/2},f=new google.maps.Map(document.getElementById("map"),{zoom:14,mapTypeId:google.maps.MapTypeId.HYBRID,center:u}),v=document.createElement("div"),E=document.createElement("div");E.style.backgroundColor="#fff",E.style.border="2px solid #fff",E.style.borderRadius="3px",E.style.boxShadow="0 2px 6px rgba(0,0,0,.3)",E.style.cursor="pointer",E.style.marginTop="8px",E.style.marginBottom="2px",E.style.textAlign="center",E.title="Click to center map",v.appendChild(E);const x=document.createElement("div");x.style.color="rgb(25,25,25)",x.style.fontFamily="Roboto,Arial,sans-serif",x.style.fontSize="min(4vh, 3vw)",x.style.lineHeight="min(6vh, 4vw)",x.style.paddingLeft="5px",x.style.paddingRight="5px",x.innerHTML="Devil's Den Nature Preserve</br>33 Pent Rd, Weston, CT 06883",E.appendChild(x),E.addEventListener("click",(()=>{f.setCenter({lat:41.23715,lng:-73.39581727981567})})),f.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(v);const b=document.createElement("div"),T=document.createElement("div");T.style.backgroundColor="#fff",T.style.border="2px solid #fff",T.style.borderRadius="3px",T.style.boxShadow="0 2px 6px rgba(0,0,0,.3)",T.style.cursor="pointer",T.style.marginTop="8px",T.style.marginBottom="22px",T.style.textAlign="center",T.style.opacity="0",T.style.transform="translate(0px, -25%)",T.title="Click to center map",b.appendChild(T);const L=document.createElement("div");L.style.color="rgb(25,25,25)",L.style.fontFamily="Roboto,Arial,sans-serif",L.style.fontSize="min(4vh, 3vw)",L.style.lineHeight="min(6vh, 4vw)",L.style.paddingLeft="5px",L.style.paddingRight="5px",L.innerHTML="Click on the markers (in red)<br/>for hiking directions.",T.appendChild(L),T.addEventListener("click",(()=>{f.setCenter({lat:41.23715,lng:-73.39581727981567})})),f.controls[google.maps.ControlPosition.LEFT_CENTER].push(b);const w=new google.maps.Marker({position:{lat:41.239560541203865,lng:-73.39134439917926},icon:"./55.png",map:f,animation:google.maps.Animation.DROP,zIndex:2});p(w,"The ceremony will be held here.");let I=new google.maps.Polyline({path:m,geodesic:!0,strokeColor:"#EEFF99",strokeOpacity:1,strokeWeight:3,icons:[{icon:{path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW},offset:"100%"}]});I.setMap(f),setInterval((()=>{let e=100-(new Date).getTime()%2e4/2e4*100;const t=I.get("icons");t[0].offset=`${e}%`,I.set("icons",t)}),50);let k=new google.maps.DirectionsService,S=new google.maps.DirectionsRenderer;S.setMap(f);const M=()=>{g.forEach((e=>{e.setMap(null)})),g=[],m.forEach((e=>{if(e.marker){const t=new google.maps.Marker({position:e,map:f,label:{text:e.label||"",color:"yellow",fontSize:"4vh"},animation:google.maps.Animation.DROP});e.message&&p(t,e.message),g.push(t)}}));const e=new google.maps.Marker({position:{lat:41.24126582513925,lng:-73.38364621526185},map:f,label:{text:"home",color:"yellow",fontSize:"4vh"},animation:google.maps.Animation.DROP});p(e,"Our old home in Weston."),g.push(e);const t=new google.maps.Marker({position:{lat:41.237507629670944,lng:-73.3964314082411},map:f,label:{text:"X",color:"yellow",fontSize:"4vh"},animation:google.maps.Animation.DROP});p(t,"Oddly, this part of Pent Road does not exist!  Please disregard.  Avoid driving into the woods!"),g.push(t)};M();const O=document.getElementById("points");t&&O&&(O.classList.remove("hidden"),O.value=JSON.stringify(m,null,2),O.addEventListener("input",(e=>{try{m=JSON.parse(O.value),I.setPath(m),M()}catch{}})),f.addListener("click",(e=>{m.push(JSON.parse(JSON.stringify(e.latLng))),I.setPath(m),M(),O.value=JSON.stringify(m,null,2)})));const C=()=>{let e=f.getZoom();for(let t=0;t<g.length;t++)g[t].setVisible(e>15);e>15?T.classList.add("AnmiateFadeIn"):T.classList.remove("AnmiateFadeIn")};google.maps.event.addListener(f,"zoom_changed",C),setTimeout(C,250)}e.r(t),e.d(t,{initMap:()=>n});var o=window;for(var l in t)o[l]=t[l];t.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})();