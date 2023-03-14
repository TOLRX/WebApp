// Importation de la bibliothèque "fetch" pour effectuer des requêtes HTTP
const fetch = require('node-fetch-commonjs')

// Clé d'API de la SNCF
const sncfApiKey = '565bd981-93e3-4ffb-b9a3-539b2afd0fd6';


// Function charged of finding each train station in the specified French municipality :
async function getInseeCode(name, type) {
  const url = `https://geo.api.gouv.fr/communes?nom=${name}&fields=departement,region&format=json&geometry=centre`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    if (data && data.length > 0) {
      if (type === "commune") {
        return data[0].code;
      } else if (type === "departement") {
        return data[0].departement.code;
      } else if (type === "region") {
        return data[0].region.code;
      }
    }
  }
  return null;
}

// Function charged of finding each train station in the specified French Department :
async function getStationsInDepartment(departmentName) {
  const inseeCode = await getInseeCodeDepartment(departmentName);
  if (!inseeCode) {
    return null;
  }
  const url = `https://api.sncf.com/v1/coverage/sncf/stop_areas?administrative_regions=insee:${inseeCode}&types=stop_area`;
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer "+sncfApiKey,
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data && data.stop_areas && data.stop_areas.length > 0) {
        document.getElementById('result_dep').innerHTML = data.stop_areas;
    }
  }
  return null;
}

// Function charged of finding each train station in the specified French Region :
async function getStationsInRegion(regionName) {
  const inseeCode = await getInseeCodeRegion(regionName);
  if (!inseeCode) {
    return null;
  }
  const url = `https://api.sncf.com/v1/coverage/sncf/stop_areas?administrative_regions=insee:${inseeCode}&types=stop_area`;
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer "+sncfApiKey,
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data && data.stop_areas && data.stop_areas.length > 0) {
      document.getElementById('result_reg').innerHTML = data.stop_areas;
    }
  }
  return null;
}



//Fonction qui donne directement les stations de train grâce à un nom de commune
async function getStationsInCommune(cityName) {
  const inseeCode = await getInseeCode(cityName);
  if (!inseeCode) {
    return null;
  }
  const url = `https://api.sncf.com/v1/coverage/sncf/stop_areas?administrative_regions=insee:${inseeCode}&types=stop_area`;
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer "+sncfApiKey,
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data && data.stop_areas && data.stop_areas.length > 0) {
        document.getElementById('result_com').innerHTML = data.stop_areas;
    }
  }
  return null;
}

// Utilisation des fonctions pour récupérer les horaires de train pour les gares dans un département ou une région donné
getStationsInDepartment('75')
  .then(stations => {
    console.log(`Liste des gares dans le département 75 :`);
    stations.forEach(station => {
      console.log(`- ${station.name}`);
      getTrainSchedulesForStation(station.id, '2023-03-12T14:00:00')
        .then(data => console.log(data))
        .catch(error => console.error(error));
    });
  })
  .catch(error => console.error(error));

getStationsInRegion('FR-J')
  .then(stations => {
    console.log(`Liste des gares dans la région Île-de-France :`);
    stations.forEach(station => {
      console.log(`- ${station.name}`);
      getTrainSchedulesForStation(station.id, '2023-03-12T14:00:00')
        .then(data => console.log(data))
        .catch(error => console.error(error));
    });
  })
  .catch(error => console.error(error));



