// Approximate borough/area centre points, [lat, lon].
// Used for "approximate area" map display only, never an exact address -
// matches the honesty policy already applied on the vehicle detail page map.
export const AREA_COORDS = {
  // London
  "City of London": [51.5155, -0.0922],
  "Camden": [51.549, -0.142],
  "Westminster": [51.497, -0.137],
  "Hackney": [51.545, -0.0553],
  "Islington": [51.5416, -0.1022],
  "Lambeth": [51.4607, -0.1163],
  "Southwark": [51.5035, -0.0804],
  "Tower Hamlets": [51.5203, -0.0293],
  "Wandsworth": [51.4571, -0.191],
  "Hammersmith & Fulham": [51.4927, -0.2339],
  "Greenwich": [51.4826, -0.0077],
  "Lewisham": [51.462, -0.011],
  "Newham": [51.528, 0.035],
  "Croydon": [51.372, -0.101],
  "Redbridge": [51.559, 0.076],
  "Harrow": [51.58, -0.336],
  "Barking & Dagenham": [51.554, 0.129],
  "Hounslow": [51.468, -0.361],
  "Ealing": [51.513, -0.305],
  "Bromley": [51.406, 0.015],

  // Manchester
  "City Centre": [53.4794, -2.2453], // shared label, used across cities - see AREA_COORDS_BY_CITY below
  "Ancoats": [53.4841, -2.2226],
  "Chorlton": [53.4432, -2.2743],
  "Didsbury": [53.4204, -2.2339],
  "Rusholme": [53.456, -2.221],
  "Salford": [53.4875, -2.2901],
  "Stockport": [53.4083, -2.1494],
  "Trafford": [53.44, -2.35],
  "Wythenshawe": [53.3899, -2.2685],
  "Cheetham Hill": [53.506, -2.24],

  // Birmingham
  "Aston": [52.506, -1.885],
  "Edgbaston": [52.47, -1.928],
  "Erdington": [52.528, -1.839],
  "Handsworth": [52.517, -1.928],
  "Moseley": [52.446, -1.889],
  "Selly Oak": [52.439, -1.936],
  "Solihull": [52.4118, -1.7776],
  "Sparkhill": [52.453, -1.87],
  "Sutton Coldfield": [52.57, -1.824],

  // Leeds
  "Armley": [53.799, -1.606],
  "Beeston": [53.769, -1.558],
  "Bramley": [53.806, -1.618],
  "Chapel Allerton": [53.825, -1.532],
  "Headingley": [53.819, -1.578],
  "Horsforth": [53.838, -1.639],
  "Morley": [53.748, -1.6],
  "Pudsey": [53.795, -1.665],
  "Roundhay": [53.833, -1.509],
};

// "City Centre" is used by more than one city, so it can't be a flat lookup
// key on its own - resolve it (and any other future clashes) through the city too.
const CITY_CENTRE_OVERRIDES = {
  Manchester: [53.4794, -2.2453],
  Birmingham: [52.48, -1.899],
  Leeds: [53.7965, -1.5478],
  London: [51.5074, -0.1278],
};

export function areaCoords(borough, city) {
  if (borough === "City Centre" && CITY_CENTRE_OVERRIDES[city]) return CITY_CENTRE_OVERRIDES[city];
  return AREA_COORDS[borough] || CITY_CENTRE_OVERRIDES[city] || [51.509, -0.118];
}
