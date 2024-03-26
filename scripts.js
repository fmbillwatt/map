var map;
var markers = [];

function clearMarkers() {
    for (let marker of markers) {
        marker.setMap(null);
    }
    markers = [];
}

function toggleDisplay(type) {
    clearMarkers(); // Clear previous markers before updating

    // Handling for "Employee Locations"
    if (type === 'employee' && document.getElementById('employeeCheckbox').checked) {
        document.getElementById('companyCheckbox').checked = false;
        document.getElementById('teamCheckbox').checked = false;
        document.getElementById('allOnsitesCheckbox').checked = false;
    }

    // Handling for "All Onsites"
    if (type === 'all' && document.getElementById('allOnsitesCheckbox').checked) {
        document.getElementById('employeeCheckbox').checked = false;
        document.getElementById('companyCheckbox').checked = false;
        document.getElementById('teamCheckbox').checked = false;
    }

    // Handling for "Company Onsites" or "Team Onsites"
    if (type === 'company' || type === 'team') {
        if (document.getElementById('companyCheckbox').checked || document.getElementById('teamCheckbox').checked) {
            document.getElementById('employeeCheckbox').checked = false;
            document.getElementById('allOnsitesCheckbox').checked = false;
        }
    }

    initMap();
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 4
    });

    var orderCounter = 1;

    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const isFutureEvent = new Date(place.date) > new Date();
        let color = 'blue';

        if (document.getElementById('companyCheckbox').checked && place.type === "Company Onsite") {
            color = isFutureEvent ? 'green' : 'blue';
            addMarker(place, color, orderCounter);
            orderCounter++;
        }

        if (document.getElementById('teamCheckbox').checked && place.type === "Team Onsite") {
            color = isFutureEvent ? 'green' : 'blue';
            addMarker(place, color, orderCounter);
            orderCounter++;
        }

        if (document.getElementById('allOnsitesCheckbox').checked) {
            if (place.type === "Company Onsite") {
                color = isFutureEvent ? 'green' : 'blue';
            } else if (place.type === "Team Onsite") {
                color = isFutureEvent ? 'green' : 'blue';
            }
            addMarker(place, color, orderCounter);
            orderCounter++;
        }
    }

    if (document.getElementById('employeeCheckbox').checked) {
        for (let location in employeeCountsByLocation) {
            if (employeeCountsByLocation.hasOwnProperty(location)) {
                const locationCenter = employeeCountsByLocation[location].center;
                const employeeCount = employeeCountsByLocation[location].people;
                const locationMarker = new google.maps.Marker({
                    position: locationCenter,
                    map: map,
                    title: location + ': ' + employeeCount + (employeeCount === 1 ? ' employee' : ' employees'),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: 'orange',
                        fillOpacity: 1,
                        scale: 10,
                        strokeColor: 'orange',
                        strokeWeight: 2
                    },
                    label: {
                        text: employeeCount.toString(),
                        color: 'black',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }
                });
                markers.push(locationMarker);
            }
        }
    }
}

function addMarker(place, color, order) {
    const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: map,
        title: place.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            scale: 10,
            strokeColor: color,
            strokeWeight: 2
        },
        label: {
            text: order.toString(),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
        <div style="color: black;">
            <strong>${place.name}</strong><br>
            Description: ${place.description}<br>
            Event: ${place.type}<br>
            # of Employees: ${place.employees}<br>
            <img src="${place.image_url}" alt="${place.name}" width="150">
        </div>`
    });

    marker.addListener('mouseover', function () {
        infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', function () {
        infoWindow.close();
    });

    markers.push(marker);
}

google.maps.event.addDomListener(window, 'load', initMap);
initMap();
