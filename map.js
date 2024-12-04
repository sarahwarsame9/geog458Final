// map.js

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWh3NDkiLCJhIjoiY20xamw5eW95MG9iZDJrcHh4c282NThpdCJ9.O3UEeHndej0KDHQeva894w';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // Map style
  center: [-122.3321, 47.6062], // Centered on King County
  zoom: 10
});

map.on('load', () => {
  // Add GeoJSON data for census tracts
  fetch('./data/ACS__Total_Population___acs_b01003_totalpop.geojson')
    .then(response => response.json())
    .then(data => {
      // Filter out census tracts with no population data
      const filteredData = {
        type: 'FeatureCollection',
        features: data.features.filter(feature => {
          const population = feature.properties.E01003097;
          return population && population > 0; // Only include features with population data
        })
      };

      // Add filtered data as a source
      map.addSource('censusData', {
        type: 'geojson',
        data: filteredData
      });

      // Add the population choropleth layer
      map.addLayer({
        id: 'population-choropleth',
        type: 'fill',
        source: 'censusData',
        paint: {
          'fill-color': [
            'step',
            ['get', 'E01003097'], // Total population property
            '#e5f5e0', 1000,      // < 1,000
            '#a1d99b', 5000,      // 1,000 - 5,000
            '#41ab5d', 10000,     // 5,000 - 10,000
            '#238b45', 20000,     // 10,000 - 20,000
            '#005a32'             // > 20,000
          ],
          'fill-opacity': 0.8,
          'fill-outline-color': '#ffffff'
        }
      });

      // Add Metro Stops data as circles
      map.addSource('metroStops', {
        type: 'geojson',
        data: './data/Metro_Neighborhoods_in_King_County___neighborhood_area.geojson' // Replace with your Metro stops file path
      });

      map.addLayer({
        id: 'metroStops-layer',
        type: 'circle',
        source: 'metroStops',
        paint: {
          'circle-radius': 6,
          'circle-color': '#007cbf', // Blue for metro stops
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add interactivity: census tracts popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
      });

      map.on('click', 'population-choropleth', (e) => {
        const coordinates = e.lngLat;
        const population = e.features[0].properties.E01003097 || 'Data unavailable';
        const tract = e.features[0].properties.TRACT_LBL || 'Unknown Tract';

        popup
          .setLngLat(coordinates)
          .setHTML(`<strong>Census:</strong> ${tract}<br><strong>Population:</strong> ${population}`)
          .addTo(map);
      });

      // Cursor changes for interactivity
      map.on('mouseenter', 'population-choropleth', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'population-choropleth', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'metroStops-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'metroStops-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    })
    .catch(error => console.error('Error loading GeoJSON data:', error));
});