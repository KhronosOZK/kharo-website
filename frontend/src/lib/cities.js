export const POPULAR_CITIES = ["London", "Birmingham", "Manchester", "Leeds", "Sheffield"];
export const MORE_CITIES = [
  "Liverpool", "Glasgow", "Bristol", "Newcastle", "Nottingham", "Leicester",
  "Edinburgh", "Cardiff", "Coventry", "Bradford", "Southampton", "Reading",
  "Luton", "Wolverhampton", "Belfast", "Milton Keynes",
];
export const ALL_CITIES = [...POPULAR_CITIES, ...MORE_CITIES];
// Cities with live inventory in this validation build
export const LIVE_CITIES = ["London", "Birmingham", "Manchester", "Leeds", "Sheffield"];

const _CIMG = "https://static.prod-images.emergentagent.com/jobs/919a8071-6528-4edd-abac-afdfaa8c910c/images/";
export const CITY_IMAGES = {
  London: `${_CIMG}37742739032860cd721ad8465cffb1e6653fa6bea3832082f25a2cc7b4710318.jpeg`,
  Birmingham: `${_CIMG}8b24f1d7ed4c7c0ff855b78986ccc24577b3803cc61ef598c2eb327e0d1a8f76.jpeg`,
  Manchester: `${_CIMG}a7b8804e3ceb2a34e6c3d0d9393b5895265c2f604939548f3b251ea530c43080.jpeg`,
  Leeds: `${_CIMG}ce8943421cb265180a36291603f541cc664f280bfb422494f03bcd8962156ded.jpeg`,
  Sheffield: `${_CIMG}3733c0483e67e421cf5921ea115751d7a848511ac2c4283c3c370efacfea3ddd.jpeg`,
};
