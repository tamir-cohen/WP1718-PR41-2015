﻿let jsonobj;

let foo = function () {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([19.8424, 45.2541]),
            zoom: 15
        })
    });
    map.on('click', function (evt) {
        var coord = ol.proj.toLonLat(evt.coordinate);
        alert(coord);
        reverseGeocode(coord);
    });
}

let foof1 = function () {
    $("#divwriteuserdata").append(`<table class="table table - bordered" style="float:right;width:40%;height:50%">
        <thead>
        <tr class="success">
            <th colspan="2">
                Location details preview
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Your current address:</td>
            <td>
                <input type="text" id="txtAddress"/>
            </td>
        </tr>
        <tr>
            <td>Coordinates:</td>
            <td>
                <input type="text" id="txtX"/>
                <input type="text" id="txtY"/>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnSaveLoc" class="btn btn-primary" type="button" value="Save location"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnSaveLoc").click(function () {
        $.post("/api/Driver/SetLocation/", { json: jsonobj }, function () { location.href = `Driver.html`; })
            .fail(function () {
                alert(`error while sending address`);
            });
    });

    $("#btnSubmitLoc").click(function () {
        alert(jsonobj);
        $.post("/api/Driver/GetLocation/", { json: jsonobj }, function (location) {
            $("#txtAddress").val(location.Address.Street + location.Address.HomeNumber);
            $("#txtX").val(location.X);
            $("#txtY").val(location.Y);
        })
            .fail(function () {
                alert(`error while sending location`);
            });
    });
}

let ShowMap = function (placeForMap) {
    $(placeForMap).html(`<h2>Location</h2>
    <button class="btn btn-primary" id="btnSubmitLoc">Submit location</button>
    <div id="map" class="map" style="float:left;width:60%;height:50%;"></div>
    `);
    foo();
};
function addMarker(lon, lat, icon) {


    var iconFeatures = [];

    var iconGeometry = new ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    var iconFeature = new ol.Feature({
        geometry: iconGeometry
    });

    iconFeatures.push(iconFeature);

    var vectorSource = new ol.source.Vector({
        features: iconFeatures //add an array of features
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.95,
            src: icon
        }))
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle
    });

    map.addLayer(vectorLayer);
    return iconFeature;
}

function reverseGeocode(coords) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1])
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);
            jsonobj = json;
        });
};