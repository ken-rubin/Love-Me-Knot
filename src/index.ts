import { faRing as icon } from "@fortawesome/free-solid-svg-icons";
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

        theInviteeDiv.innerText = `${params.she} and ${params.he}`;
    }

    theSendConfirmButton?.addEventListener("click", () => {

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
        } else {

            theConfirmElement?.classList.add("hidden");
            theCoverElement?.classList.remove("totallytransparent");
        }
    });

    theMapButton?.addEventListener("click", () => {

        const show = theMapElement?.classList.contains("hidden");
        console.log(show);
        if (show) {

            theConfirmElement?.classList.add("hidden");
            theMapElement?.classList.remove("hidden");
            theCoverElement?.classList.remove("totallytransparent");

            // Try HTML5 geolocation.
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {

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

                    geocoder.geocode({

                            location: {

                                "lat": 41.23715,
                                "lng": -73.39581727981567,
                            } //address:"33 Pent Rd, Weston, CT 06883"
                        })
                        .then((result) => {

                            const { results } = result;

                            var request = {

                                origin: pos,
                                destination: results[0].geometry.location,
                                travelMode: google.maps.TravelMode.DRIVING
                            };
                            directionsService.route(request, (response, status) => {

                                if (status == "OK") {

                                    directionsDisplay.setDirections(response);
                                }
                            });
                        })
                        .catch((e) => {

                            alert("Geocode was not successful for the following reason: " + e);
                        });
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
          "lat": 41.239560541203865,
          "lng": -73.39134439917926
        },
        {
          "lat": 41.239384788295496,
          "lng": -73.3912635849484
        },
        {
          "lat": 41.23916696066689,
          "lng": -73.39119384751402
        },
        {
          "lat": 41.238977369362196,
          "lng": -73.39124749169432
        },
        {
          "lat": 41.23881198075364,
          "lng": -73.3912635849484
        },
        {
          "lat": 41.238735337110214,
          "lng": -73.39125285611235,
          "marker": true,
          "label": "25",
          "message": "turn left, head north along the pond to the clearing"
        },
        {
          "lat": 41.23880391300593,
          "lng": -73.39166055188261,
          "marker": true,
          "label": "24",
          "message": "turn right"
        },
        {
          "lat": 41.238525575100134,
          "lng": -73.3920736120709
        },
        {
          "lat": 41.23853767677287,
          "lng": -73.39239547715269,
          "marker": true,
          "label": "23",
          "message": "turn left off the main path"
        },
        {
          "lat": 41.238578015665766,
          "lng": -73.39262078270994
        },
        {
          "lat": 41.23855381233301,
          "lng": -73.39292655453764
        },
        {
          "lat": 41.238473134492445,
          "lng": -73.3932269619473
        },
        {
          "lat": 41.23833194803182,
          "lng": -73.39335570798002
        },
        {
          "lat": 41.23799058050354,
          "lng": -73.39337716565214
        },
        {
          "lat": 41.23778081610329,
          "lng": -73.39351664052091
        },
        {
          "lat": 41.237619458414265,
          "lng": -73.39376340375028
        },
        {
          "lat": 41.237409692822986,
          "lng": -73.39408526883207
        },
        {
          "lat": 41.23725640215749,
          "lng": -73.39443932042204
        },
        {
          "lat": 41.23711924704677,
          "lng": -73.39478264317594
        },
        {
          "lat": 41.2371,
          "lng": -73.39525471196256
        },
        {
          "lat": 41.23715,
          "lng": -73.39581727981567,
          "marker": true,
          "label": "Entrance",
          "message": "enter path from parking lot to the east, continue until marker 23"
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

    // This is a special marker that cannot be removed.  The "ring".
    const ringMarker = new google.maps.Marker({

        position: myLatLng,
        icon: `./55.png`,
        map,
        animation: google.maps.Animation.DROP,
        zIndex: 2
    });
    attachInstructionText(ringMarker, "Rings mark the spot!");

    // Define the poly line representing the trail to the knot spot.
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
    let geocoder = new google.maps.Geocoder();              

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
        attachInstructionText(home, "our home in Weston");
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

    // Change markers on zoom.
    const onZoom = () => {

        let zoom = <number>map.getZoom();

        // iterate over markers and call setVisible
        for (let i = 0; i < markers.length; i++) {
        
            markers[i].setVisible(zoom > 15);
        }
    };
    setTimeout(onZoom, 
        1000);
    google.maps.event.addListener(map, 'zoom_changed', onZoom);
}
export { initMap };
