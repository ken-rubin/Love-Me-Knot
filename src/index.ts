import "./style.css";

// initMap is specified in the HTML as the "callback" parameter to the Google API.
function initMap(): void {

    // Get the edit query string parameter to determine if the editor window and clickable map should be enabled.
    interface MyParams {
        edit: boolean;
        he: string;
        she: string;
    }
    const params:MyParams = <MyParams><unknown>new Proxy(new URLSearchParams(window.location.search), {

        get: (searchParams, prop) => searchParams.get(<string>prop),
    });
    // Get the value of "edit" key.
    let editValue = params.edit;
    
    const theCoverElement = document.getElementById("cover");
    const theInviteeDiv = document.getElementById("InviteeDiv");
    const theMapElement = document.getElementById("map");
    const theConfirmElement = document.getElementById("confirm");
    const theMapButton = document.getElementById("MapButton");
    const theConfirmButton = document.getElementById("ConfirmButton");
    const theAtendeesTextArea:HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("AtendeesTextArea");
    const theSendConfirmButton = document.getElementById("SendConfirmButton");

    if (theAtendeesTextArea) {

        fetch(`/get`, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "she": params.she, "he": params.he, attendies: theAtendeesTextArea.value })
        }).then((response) => {

            return response.json();
        }).then((data) => {

            console.log(`...back from server.`);
            if (!data.success) {

                alert(new Error(data.payload));
            } else {

                theAtendeesTextArea.value = data.payload;
            }
        });        
    }

    // Try to get invitees from the query strings.
    if (theInviteeDiv) {

        theInviteeDiv.innerText = (params.she && params.he ? `${params.she}  &  ${params.he}` : (params.she ? params.she : params.he));
    }

    theSendConfirmButton?.addEventListener("click", () => {

        const imageFred = document.getElementById("FredImage");
        if (imageFred) {

            imageFred.classList.remove("AnmiateFadeIn");
        }

        fetch(`/set`, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "she": params.she, "he": params.he, attendies: theAtendeesTextArea.value })
        }).then((response) => {

            return response.json();
        }).then((data) => {

            console.log(`...back from server.`);
            if (!data.success) {

                alert(new Error(data.payload));
            } else {

                const imageFred = document.getElementById("FredImage");
                if (imageFred) {

                    imageFred.classList.add("AnmiateFadeIn");
                }
            }
        });
    });

    theConfirmButton?.addEventListener("click", () => {

        const show = theConfirmElement?.classList.contains("hidden");
        console.log(show);
        if (show) {

            theMapElement?.classList.add("hidden");
            theConfirmElement?.classList.remove("hidden");
            theCoverElement?.classList.add("totallytransparent");

            // Set button text.
            if (theMapButton) {

                theMapButton.innerText = "map";
            }
            if (theConfirmButton) {

                theConfirmButton.innerText = "invite";
            }
        } else {

            theConfirmElement?.classList.add("hidden");
            theCoverElement?.classList.remove("totallytransparent");

            // Set button text.
            if (theMapButton) {

                theMapButton.innerText = "map";
            }
            if (theConfirmButton) {

                theConfirmButton.innerText = "confirm";
            }
        }
    });

    theMapButton?.addEventListener("click", () => {

        const show = theMapElement?.classList.contains("hidden");
        console.log(show);
        if (show) {

            theConfirmElement?.classList.add("hidden");
            theMapElement?.classList.remove("hidden");
            theCoverElement?.classList.remove("totallytransparent");

            // Set button text.
            if (theMapButton) {

                theMapButton.innerText = "invite";
            }
            if (theConfirmButton) {

                theConfirmButton.innerText = "confirm";
            }

            // Try HTML5 geolocation.
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {

                    // Position the map to center on current position to devils den.
                    const pos = {

                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend({ 

                        "lat": 41.237507629670944,
                        "lng": -73.3964314082411
                    });
                    bounds.extend(pos);
                    map.fitBounds(bounds);

                    // Generate the route from the current position to the parking lot at Devils Den.
                    try {

                        var request = {

                            origin: pos,
                            destination: {

                                "lat": 41.23715,
                                "lng": -73.39581727981567,
                            },
                            travelMode: google.maps.TravelMode.DRIVING
                        };
                        directionsService.route(request, (response, status) => {

                            if (status == "OK") {

                                directionsDisplay.setDirections(response);
                            }
                        });
                    } catch(e) {

                        alert("Geocode was not successful for the following reason: " + e);
                    }
                }, () => {

                    // handleLocationError(true, infoWindow, map.getCenter()!);
                });
            } else {

                // Browser doesn't support Geolocation
                // handleLocationError(false, infoWindow, map.getCenter()!);
            }
        } else {

            theMapElement?.classList.add("hidden");
            theCoverElement?.classList.remove("totallytransparent");
            
            // Set button text.
            if (theMapButton) {

                theMapButton.innerText = "map";
            }
            if (theConfirmButton) {

                theConfirmButton.innerText = "confirm";
            }
        }
    });

    // Destination location.
    const myLatLng = {

        "lat": 41.239560541203865,
        "lng": -73.39134439917926
    };

    // Define a collection of markers.  These are saved so they can be updated in edit mode.
    let markers:google.maps.Marker[] = [];

    // Define a collection of coordinates that comprise the path from the parking lot to the marriage location.
    // If an element has a non-falsy marker, it must also have a label and message, and these become markers.
    let coordinates: { lat: number, lng: number, marker?: boolean, label?: string, message?: string}[] = [
        {
          "lat": 41.239560541203865, "lng": -73.39134439917926
        },
        {
          "lat": 41.239384788295496, "lng": -73.3912635849484
        },
        {
          "lat": 41.23916696066689, "lng": -73.39119384751402
        },
        {
          "lat": 41.238977369362196, "lng": -73.39124749169432
        },
        {
          "lat": 41.23881198075364, "lng": -73.3912635849484
        },
        {
          "lat": 41.238735337110214,
          "lng": -73.39125285611235,
          "marker": true,
          "label": "25",
          "message": "Turn left.  Head north along the pond to the clearing."
        },
        {
          "lat": 41.23880391300593,
          "lng": -73.39166055188261,
          "marker": true,
          "label": "24",
          "message": "Turn right."
        },
        {
          "lat": 41.238525575100134, "lng": -73.3920736120709
        },
        {
          "lat": 41.23853767677287,
          "lng": -73.39239547715269,
          "marker": true,
          "label": "23",
          "message": "Turn left off the main path."
        },
        {
          "lat": 41.238578015665766, "lng": -73.39262078270994
        },
        {
          "lat": 41.23855381233301, "lng": -73.39292655453764
        },
        {
          "lat": 41.238473134492445, "lng": -73.3932269619473
        },
        {
          "lat": 41.23833194803182, "lng": -73.39335570798002
        },
        {
          "lat": 41.23799058050354, "lng": -73.39337716565214
        },
        {
          "lat": 41.23778081610329, "lng": -73.39351664052091
        },
        {
          "lat": 41.237619458414265, "lng": -73.39376340375028
        },
        {
          "lat": 41.237409692822986, "lng": -73.39408526883207
        },
        {
          "lat": 41.23725640215749, "lng": -73.39443932042204
        },
        {
          "lat": 41.23711924704677, "lng": -73.39478264317594
        },
        {
          "lat": 41.2371, "lng": -73.39525471196256
        },
        {
          "lat": 41.23715,
          "lng": -73.39581727981567,
          "marker": true,
          "label": "Entrance",
          "message": "Enter the trail east of the parking lot.  Continue until marker 23."
        }
      ];

    // Instantiate an info window to hold step text.  It is reused across all markers.
    const stepDisplay = new google.maps.InfoWindow();

    // Define a helper function to associate a marker with its info text.
    const attachInstructionText = (marker: google.maps.Marker,
        text: string) => {

        google.maps.event.addListener(marker, "click", () => {

            // Open an info window when the marker is clicked on, containing the text of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    };

    // Calculate the median point of the custom path.
    const extremaValues = { 
        
        max: { 
            
            lat: Number.MIN_SAFE_INTEGER, 
            lng: Number.MIN_SAFE_INTEGER 
        }, 
        min: { 
            
            lat: Number.MAX_SAFE_INTEGER, 
            lng: Number.MAX_SAFE_INTEGER 
        }
    };
    const extremaWithInitial = coordinates.reduce((previousValue, currentValue) => { 
        
            return { 
        
                max: { 
                    
                    lat: Math.max(previousValue.max.lat, currentValue.lat), 
                    lng: Math.max(previousValue.max.lng, currentValue.lng) 
                }, 
                min: { 
                    
                    lat: Math.min(previousValue.min.lat, currentValue.lat), 
                    lng: Math.min(previousValue.min.lng, currentValue.lng) 
                }
            }; 
        },
            extremaValues
    );
    const centerPoint = { lat: (extremaWithInitial.max.lat + extremaWithInitial.min.lat) / 2, lng: (extremaWithInitial.max.lng + extremaWithInitial.min.lng) / 2 };

    // Allocate a map, set to the destination and zoom in pretty far.
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {

        zoom: 14,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        center: centerPoint,
    });

    ////////////
    // Add the little address window in the lower left.
    const controlDiv = document.createElement("div");

    // Set CSS for the control border.
    const controlUI = document.createElement("div");
  
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginTop = "8px";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to center map";
    controlDiv.appendChild(controlUI);
  
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
  
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "min(6vh, 4vw)";
    controlText.style.lineHeight = "min(9vh, 6vw)";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Devil's Den Nature Preserve</br>33 Pent Rd, Weston, CT 06883";
    controlUI.appendChild(controlText);
  
    // Setup the click event listeners: simply set the map to Devil's Den.
    controlUI.addEventListener("click", () => {

        map.setCenter({

            "lat": 41.23715,
            "lng": -73.39581727981567,
        });
    });
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(controlDiv);

    // This is a special marker that cannot be removed.  The "ring".
    const ringMarker = new google.maps.Marker({

        position: myLatLng,
        icon: `./55.png`,
        map,
        animation: google.maps.Animation.DROP,
        zIndex: 2
    });
    attachInstructionText(ringMarker, "The ceremony will be held here.");

    // Define the poly line representing the trail to the knotting spot.
    let flightPath = new google.maps.Polyline({

        path: coordinates,
        geodesic: true,
        strokeColor: "#EEFF99",
        strokeOpacity: 1,
        strokeWeight: 3,
        icons: [
            {
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              },
              offset: "100%",
            },
          ],
    });
    flightPath.setMap(map);

    // Update the flight path arrow.
    var progress = 0;
    setInterval(() => {

        let time = (new Date().getTime() % 20000) / 20000;
        let percent = 100 - 100 * time;
        const icons = flightPath.get("icons");
        icons[0].offset = `${percent}%`;
        flightPath.set("icons", icons);
    }, 50);

    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    //let geocoder = new google.maps.Geocoder();              

    // Reset the exiting markers and process the coordinates into markers.
    const updateMarkers = () => {

        // First, remove all old markers.
        markers.forEach((marker) => {

            marker.setMap(null);
        });

        // Reset collection of markers.
        markers = [];

        // Process coordinates into a new collection of markers.
        coordinates.forEach((coordinate) => {

            // If this coordinate has a marker.
            if (coordinate.marker) {

                const marker = new google.maps.Marker({

                    position: coordinate,
                    map,
                    label:  {

                        text: coordinate.label || "",
                        color: 'yellow',
                        fontSize: "4vh"
                      },
                    animation: google.maps.Animation.DROP,
                });
                if (coordinate.message) {

                    attachInstructionText(marker, coordinate.message);
                }
                markers.push(marker);
            }
        });

        // Add our home in as a marker.
        const home = new google.maps.Marker({

            position: { 

                "lat": 41.24126582513925,
                "lng": -73.38364621526185 
            },
            map,
            label:  {

                text: "home",
                color: 'yellow',
                fontSize: "4vh"
            },
            animation: google.maps.Animation.DROP,
        });
        attachInstructionText(home, "Our old home in Weston.");
        markers.push(home);

        // Also add the pent road disclaimer.
        const pent = new google.maps.Marker({

            position: { 
                "lat": 41.237507629670944,
                "lng": -73.3964314082411
            },
            map,
            label:  {

                text: "X",
                color: 'yellow',
                fontSize: "4vh"
            },
            animation: google.maps.Animation.DROP,
        });
        attachInstructionText(pent, "Oddly, this part of Pent Road does not exist!  Please disregard.  Avoid driving into the woods!");
        markers.push(pent);

    };
    updateMarkers();

    const ta:HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("points");
    if (editValue && ta) {

        ta.classList.remove("hidden");
        ta.value = JSON.stringify(coordinates, null, 2);
        ta.addEventListener("input", (e) => {

            try {
    
                coordinates = JSON.parse(ta.value);
                flightPath.setPath(coordinates);
                updateMarkers();
            } catch {}
        });    

        map.addListener("click", (e) => {

            coordinates.push(JSON.parse(JSON.stringify(e.latLng)));
            flightPath.setPath(coordinates);
            updateMarkers();
            ta.value = JSON.stringify(coordinates, null, 2);
        });
    }

    // Change markers on zoom.  Make them visible when zoom is > 18.
    const onZoom = () => {

        let zoom = <number>map.getZoom();

        // iterate over markers and call setVisible
        for (let i = 0; i < markers.length; i++) {
        
            markers[i].setVisible(zoom > 18);
        }
    };
    google.maps.event.addListener(map, 'zoom_changed', onZoom);
    
    // Initialize the zoom....
    setTimeout(onZoom, 
        250);
}
export { initMap };
