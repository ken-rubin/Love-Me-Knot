import { faRing as icon } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

// initMap is specified in the HTML as the "callback" parameter to the Google API.
function initMap(): void {

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

        zoom: 1,
        center: centerPoint,
    });

    // This is a special marker that cannot be removed.  The "ring".
    const ringMarker = new google.maps.Marker({

        position: myLatLng,
        icon: {
            path: icon.icon[4] as string,
            fillColor: "#ffff88",
            fillOpacity: 1,
            anchor: new google.maps.Point(
                icon.icon[0] / 2, // width
                icon.icon[1] // height
            ),
            strokeWeight: 1,
            strokeColor: "#000000",
            scale: 0.075,
          },
        map,
        animation: google.maps.Animation.DROP,
        zIndex: 2
    });
    attachInstructionText(ringMarker, "Ring Marks the spot!");

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
                    label: coordinate.label,
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
            label: "home",
            animation: google.maps.Animation.DROP,
        });
        attachInstructionText(home, "our home in Weston");
        markers.push(home);
    };
    updateMarkers();

    // Get the edit query string parameter to determine if the editor window and clickable map should be enabled.
    interface MyParams {
        edit: boolean;
    }
    const params:MyParams = <MyParams><unknown>new Proxy(new URLSearchParams(window.location.search), {

        get: (searchParams, prop) => searchParams.get(<string>prop),
    });
    // Get the value of "edit" key.
    let editValue = params.edit;

    const ta:HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("points");
    if (editValue && ta) {

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
    } else if (ta) {

        ta.classList.add("hidden");
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
