var e = $(".logistics-fleet-sidebar-body");
if (e.length) {
    try {
        new PerfectScrollbar(e[0], { wheelPropagation: false, suppressScrollX: true });
    } catch (error) {
        console.error("Error initializing PerfectScrollbar:", error);
    }
}

// !function () {
//     var e = $(".logistics-fleet-sidebar-body");
//     e.length && new PerfectScrollbar(e[0], { wheelPropagation: !1, suppressScrollX: !0 }),
//     mapboxgl.accessToken = "pk.eyJ1IjoibG9yZC1zaGl2YW0iLCJhIjoiY2xpeTlpNHFwMDVzbDNmczl2MXdob29udyJ9.JOLDU6VQG_ra1CoVG4jbUA";
// const t = {
//     type: "FeatureCollection",
//     features: [{
//         type: "Feature", properties: { iconSize: [20, 42], message: "1" },
//         geometry: { type: "Point", coordinates: [-73.999024, 40.75249842] }
//     }, {
//         type: "Feature", properties: { iconSize: [20, 42], message: "2" },
//         geometry: { type: "Point", coordinates: [-74.03, 40.75699842] }
//     }, {
//         type: "Feature", properties: { iconSize: [20, 42], message: "3" },
//         geometry: { type: "Point", coordinates: [-73.967524, 40.7599842] }
//     }, {
//         type: "Feature", properties: { iconSize: [20, 42], message: "4" },
//         geometry: { type: "Point", coordinates: [-74.0325, 40.742992] }
//     }]
// },
//     r = new mapboxgl.Map({ container: "map", style: "mapbox://styles/mapbox/light-v9", center: [-73.999024, 40.75249842], zoom: 12.25 });
// for (const i of t.features) {
//     var o = document.createElement("div"),
//         s = i.properties.iconSize[0],
//         a = i.properties.iconSize[1];
//     o.className = "marker",
//         o.insertAdjacentHTML("afterbegin", '<img src="' + assetsPath + 'img/illustrations/fleet-car.png" alt="Fleet Car" width="20" class="rounded-3" id="carFleet-' + i.properties.message + '">'),
//         o.style.width = s + "px", o.style.height = a + "px", o.style.cursor = "pointer",
//         new mapboxgl.Marker(o).setLngLat(i.geometry.coordinates).addTo(r); const n = document.getElementById("fl-" + i.properties.message),
//             c = document.getElementById("carFleet-" + i.properties.message); n.addEventListener("click", function () {
//                 var e = document.querySelector(".marker-focus");
//                 Helpers._hasClass("active", n) ? (r.flyTo({ center: t.features[i.properties.message - 1].geometry.coordinates, zoom: 16 }),
//                     e && Helpers._removeClass("marker-focus", e), Helpers._addClass("marker-focus", c)) : Helpers._removeClass("marker-focus", c)
//             })
// } e = document.getElementById("carFleet-1"); Helpers._addClass("marker-focus", e),
//     document.querySelector(".mapboxgl-control-container").classList.add("d-none")
// }();