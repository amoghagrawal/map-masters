let map;
let userCountry;
let worldTension = 0;
let relationships = {};
let warStatus = {};
let ideologies = {
  "United States": "democratic",
  "Russia": "authoritarian",
  "China": "communist",
  "Canada": "democratic",
  "Mexico": "democratic",
  "Germany": "democratic",
  "Turkey": "authoritarian",
  "France": "democratic",
  "United Kingdom": "democratic",
  "Japan": "democratic",
  "South Korea": "democratic",
  "North Korea": "authoritarian"
};
let drawingMode = false;
let userCountryPolygon = [];
let userCountryLayer = null;
let militaryActions = {
  buildArmy: 0,
  developNukes: false,
  allies: [],
  enemies: []
};
let countryTraits = {
    stability: 100 || 0,
    technology: 50 || 0,
}
let newsArticles = [];
const newsTemplates = {
  war: (country1, country2) => ({
    title: `WAR DECLARED: ${country1} launches military campaign against ${country2}`,
    content: `In a shocking development, ${country1} has officially declared war on ${country2}. Military analysts suggest this conflict could have far-reaching implications for regional stability. Intelligence reports indicate military mobilization along the borders, with both nations placing their armed forces on high alert. International diplomatic efforts are underway to prevent further escalation of the conflict.`,
    type: 'critical'
  }),
  nuclear: (country1, country2) => ({
    title: `NUCLEAR CRISIS: ${country1} initiates nuclear strike against ${country2}`,
    content: `EMERGENCY ALERT: In an unprecedented escalation, ${country1} has launched nuclear weapons targeting ${country2}. Global leaders are convening emergency sessions as the world stands on the brink of nuclear conflict. Civil defense protocols are being activated worldwide, and international organizations are calling for immediate de-escalation. This marks one of the most serious nuclear threats since the Cold War.`,
    type: 'critical'
  }),
  armsDeal: (country1, country2) => ({
    title: `ARMS DEAL: ${country1} signs major weapons contract with ${country2}`,
    content: `Defense analysts report that ${country1} has finalized a significant arms deal with ${country2}, raising concerns about military buildup in the region. The agreement includes advanced weapon systems and military technology transfers.`,
    type: 'normal'
  }),
  troopMovement: (country1, region) => ({
    title: `MILITARY MOVEMENT: ${country1} deploys forces near ${region}`,
    content: `Satellite imagery reveals substantial troop movements by ${country1} near ${region}. Neighboring countries have expressed concern over this military buildup and are monitoring the situation closely.`,
    type: 'normal'
  }),
  cyberAttack: (country1, country2) => ({
    title: `CYBER WARFARE: ${country1} accused of cyber attack on ${country2}`,
    content: `${country2} has formally accused ${country1} of orchestrating a major cyber attack against critical infrastructure. The incident has led to diplomatic tensions and calls for international sanctions.`,
    type: 'critical'
  }),
  rebellion: (country, region) => ({
    title: `INTERNAL CONFLICT: Rebellion breaks out in ${country}'s ${region} region`,
    content: `Civil unrest has escalated into armed rebellion in ${country}'s ${region} region. Government forces are mobilizing to contain the situation as neighboring countries watch with growing concern.`,
    type: 'critical'
  }),
  economicCrisis: country => ({
    title: `ECONOMIC TURMOIL: ${country} faces severe economic downturn`,
    content: `${country}'s economy shows signs of severe strain as currency value plummets and inflation soars. International markets react with volatility as fears of global economic contagion grow.`,
    type: 'critical'
  }),
  assassination: (country, position) => ({
    title: `POLITICAL CRISIS: ${country}'s ${position} assassinated`,
    content: `Breaking news from ${country} confirms the assassination of the nation's ${position}. Security forces are on high alert as investigations begin and power transition protocols are activated.`,
    type: 'critical'
  }),
  warEnd: (country1, country2, victor) => ({
    title: `WAR ENDS: ${victor} emerges victorious in conflict with ${victor === country1 ? country2 : country1}`,
    content: `The war between ${country1} and ${country2} has concluded with ${victor} achieving victory. Peace negotiations are beginning as both nations assess the conflict's impact.`,
    type: 'critical'
  }),
  allyDefeated: (ally, victor) => ({
    title: `ALLIANCE SHATTERED: ${ally} suffers defeat as ally falls to ${victor}`,
    content: `Following their ally's defeat, ${ally} faces a precarious diplomatic situation. Relations with ${victor} remain tense as new regional power dynamics emerge.`,
    type: 'critical'
  }),
  peaceOffer: (country1, country2) => ({
    title: `PEACE INITIATIVE: ${country1} extends peace offer to ${country2}`,
    content: `In a significant diplomatic development, ${country1} has proposed peace negotiations with ${country2}. International mediators are standing by to facilitate discussions.`,
    type: 'normal'
  }),
  territoryOccupied: (occupier, occupied, territory) => ({
    title: `TERRITORY SEIZED: ${occupier} occupies ${territory} of ${occupied}`,
    content: `Military forces from ${occupier} have successfully occupied ${territory} of ${occupied}, marking a significant shift in the ongoing conflict. International observers express concern over territorial sovereignty.`,
    type: 'critical'
  }),
  diplomatic: (country1, country2, action) => ({
    title: `DIPLOMATIC UPDATE: ${country1} ${action} with ${country2}`,
    content: `In a significant diplomatic move, ${country1} has ${action} with ${country2}, potentially reshaping regional relations and alliances.`,
    type: 'normal'
  }),
  nuclearDevelopment: country => ({
    title: `NUCLEAR DEVELOPMENT: ${country} expands nuclear arsenal`,
    content: `Intelligence reports confirm ${country} has expanded its nuclear capabilities with new warhead development and missile testing. Global security experts express grave concerns about regional stability.`,
    type: 'critical'
  }),
  warThreat: (country1, country2) => ({
    title: `WAR THREAT: ${country1} issues ultimatum to ${country2}`,
    content: `Diplomatic crisis escalates as ${country1} demands territorial concessions from ${country2} under threat of military action. Regional allies are mobilizing forces in response.`,
    type: 'critical'
  }),
  regimeChange: country => ({
    title: `REGIME CHANGE: Coup attempt reported in ${country}`,
    content: `Military forces have seized key government buildings in ${country} in an apparent coup attempt. The situation remains fluid as international observers call for calm.`,
    type: 'critical'
  }),
  militaryBuildup: country => ({
    title: `MILITARY BUILDUP: ${country} increases defense spending`,
    content: `${country} announces major increase in military budget and force modernization program, citing regional security concerns.`,
    type: 'normal'
  }),
  diplomaticClash: (country1, country2) => ({
    title: `DIPLOMATIC CLASH: ${country1} expels diplomats from ${country2}`,
    content: `Relations deteriorate as ${country1} orders expulsion of ${country2} diplomatic staff over alleged espionage activities.`,
    type: 'normal'
  }),
  civilUnrest: country => ({
    title: `CIVIL UNREST: Protests erupt in ${country}`,
    content: `Mass demonstrations reported across major cities in ${country} as political tensions rise.`,
    type: 'normal'
  })
};
let countryPower = {};
let tensionEffects = {
  peaceful: {
    range: [0, 25],
    description: "World at peace",
    eventChance: 0.05
  },
  uneasy: {
    range: [26, 50],
    description: "Growing tensions",
    eventChance: 0.15
  },
  dangerous: {
    range: [51, 75],
    description: "Dangerous situation",
    eventChance: 0.25
  },
  critical: {
    range: [76, 100],
    description: "On the brink of war",
    eventChance: 0.4
  }
};
const warEvents = {
  wars: {},
  peaceOffers: {},
  occupiedTerritories: {}
};
let currentInstructionStep = 1;
let instructionPopup = null;
let lastWarningTime = 0;
const criticalEvents = [country => ({
  title: `REGIME CHANGE: Military coup in ${country}`,
  type: 'critical',
  content: `A military coup has overthrown the government of ${country}, leading to widespread civil unrest and regional instability.`
}), (country1, country2) => ({
  title: `MILITARY CLASH: ${country1} and ${country2} exchange fire`,
  type: 'critical',
  content: `Military forces of ${country1} and ${country2} have engaged in direct combat, raising fears of full-scale war.`
}), country => ({
  title: `ECONOMIC COLLAPSE: ${country} defaults on debt`,
  type: 'critical',
  content: `${country} has defaulted on its sovereign debt, triggering a major financial crisis that threatens to spread globally.`
}), (country1, country2) => ({
  title: `PROXY WAR: ${country1} supplies weapons to rebels in ${country2}`,
  type: 'critical',
  content: `${country1} has begun supplying advanced weapons to rebel forces in ${country2}, dramatically escalating regional tensions.`
})];
const standardEvents = [country => ({
  title: `PROTESTS: Civil unrest grows in ${country}`,
  type: 'normal',
  content: `Large-scale protests have broken out across ${country} as citizens demand political reforms.`
}), (country1, country2) => ({
  title: `SANCTIONS: ${country1} imposes sanctions on ${country2}`,
  type: 'normal',
  content: `${country1} has announced new economic sanctions against ${country2}, citing political differences.`
}), country => ({
  title: `MILITARY DRILLS: ${country} launches exercises`,
  type: 'normal',
  content: `${country} has begun large-scale military exercises near its borders, drawing concern from neighbors.`
})];
function showInstructionPopup(step) {
  if (instructionPopup) {
    instructionPopup.remove();
  }
  currentInstructionStep = step;
  instructionPopup = document.createElement('div');
  instructionPopup.className = 'instruction-popup';
  const instructions = {
    1: {
      title: 'Choose Your Capital',
      text: 'Click anywhere on the map to place your country\'s capital city. Choose carefully - your location will affect your relationships with neighboring countries!'
    },
    2: {
      title: 'Draw Your Borders',
      text: 'Click at least 3 points on the map to define your country\'s territory. Start from your capital and create your nation\'s boundaries!'
    }
  };
  const currentInstruction = instructions[step];
  instructionPopup.innerHTML = `
    <h3>${currentInstruction.title}</h3>
    <p>${currentInstruction.text}</p>
  `;
  document.body.appendChild(instructionPopup);
}
function openShop() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.display = 'block';
  const popup = document.createElement('div');
  popup.className = 'menu-popup';
  popup.id = 'shop-popup';
  popup.style.display = 'block';
  popup.innerHTML = `
    <h2>Military & Economic Shop</h2>
    <span class="close-btn" onclick="closeShop()">&times;</span>
    <div class="menu-tabs">
      <button class="menu-tab active" onclick="switchShopTab('military')">Military</button>
      <button class="menu-tab" onclick="switchShopTab('economy')">Economy</button>
      <button class="menu-tab" onclick="switchShopTab('infrastructure')">Infrastructure</button>
    </div>
    <div id="shop-content" class="shop-content"></div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(popup);
  loadShopContent('military');
}
function openExpansion() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.display = 'block';
  const popup = document.createElement('div');
  popup.className = 'menu-popup';
  popup.id = 'expansion-popup';
  popup.style.display = 'block';
  popup.innerHTML = `
    <h2>Expand Your Territory</h2>
    <span class="close-btn" onclick="closeExpansion()">&times;</span>
    <div class="expansion-options">
      <div class="expansion-option">
        <span>Peaceful Annexation</span>
        <p>Diplomatically expand your borders with minimum resistance</p>
        <button onclick="expandTerritory('peaceful')">Negotiate</button>
      </div>
      <div class="expansion-option">
        <span>Military Conquest</span>
        <p>Use military force to expand your territory</p>
        <button onclick="expandTerritory('military')">Plan Operation</button>
      </div>
      <div class="expansion-option">
        <span>Purchase Territory</span>
        <p>Buy land from neighboring nations</p>
        <button onclick="expandTerritory('purchase')">Make Offer</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(popup);
}
function openLaws() {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.display = 'block';
  const popup = document.createElement('div');
  popup.className = 'menu-popup';
  popup.id = 'laws-popup';
  popup.style.display = 'block';
  popup.innerHTML = `
    <h2>National Laws & Policies</h2>
    <span class="close-btn" onclick="closeLaws()">&times;</span>
    <div class="menu-tabs">
      <button class="menu-tab active" onclick="switchLawTab('domestic')">Domestic</button>
      <button class="menu-tab" onclick="switchLawTab('foreign')">Foreign Policy</button>
      <button class="menu-tab" onclick="switchLawTab('economic')">Economic</button>
    </div>
    <div id="laws-content" class="laws-content"></div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(popup);
  loadLawsContent('domestic');
}
function closeShop() {
  const popup = document.getElementById('shop-popup');
  const backdrop = document.querySelector('.modal-backdrop');
  if (popup) popup.remove();
  if (backdrop) backdrop.remove();
}
function closeExpansion() {
  const popup = document.getElementById('expansion-popup');
  const backdrop = document.querySelector('.modal-backdrop');
  if (popup) popup.remove();
  if (backdrop) backdrop.remove();
}
function closeLaws() {
  const popup = document.getElementById('laws-popup');
  const backdrop = document.querySelector('.modal-backdrop');
  if (popup) popup.remove();
  if (backdrop) backdrop.remove();
}
function loadShopContent(tab) {
  const content = document.getElementById('shop-content');
  const items = {
    military: [{
      name: 'Infantry Division',
      cost: 100,
      effect: '+5 Military Power'
    }, {
      name: 'Tank Battalion',
      cost: 250,
      effect: '+10 Military Power'
    }, {
      name: 'Air Force Squadron',
      cost: 500,
      effect: '+15 Military Power'
    }],
    economy: [{
      name: 'Trade Center',
      cost: 150,
      effect: '+10 GDP/turn'
    }, {
      name: 'Industry Zone',
      cost: 300,
      effect: '+20 GDP/turn'
    }, {
      name: 'Research Lab',
      cost: 450,
      effect: '+5 Technology'
    }],
    infrastructure: [{
      name: 'Road Network',
      cost: 100,
      effect: '+5 Development'
    }, {
      name: 'Power Plant',
      cost: 200,
      effect: '+10 Development'
    }, {
      name: 'Airport',
      cost: 400,
      effect: '+15 Development'
    }]
  };
  content.innerHTML = items[tab].map(item => `
        <div class="shop-item">
          <div>
            <h4>${item.name}</h4>
            <p>${item.effect}</p>
          </div>
          <button onclick="purchaseItem('${item.name}', ${item.cost})">
            Buy (${item.cost})
          </button>
        </div>
      `).join('');
}
function loadLawsContent(tab) {
  const content = document.getElementById('laws-content');
  const laws = {
    domestic: [{
      name: 'Universal Healthcare',
      effect: '+10 Stability, -5 GDP'
    }, {
      name: 'Mandatory Military Service',
      effect: '+15 Military Power, -5 Stability'
    }, {
      name: 'Free Education',
      effect: '+5 Technology, -3 GDP'
    }],
    foreign: [{
      name: 'Open Borders',
      effect: '+10 Relations, +5 GDP'
    }, {
      name: 'Trade Restrictions',
      effect: '-5 Relations, +10 GDP'
    }, {
      name: 'Military Alliance',
      effect: '+20 Military Power, -10 GDP'
    }],
    economic: [{
      name: 'Free Market',
      effect: '+15 GDP, -5 Stability'
    }, {
      name: 'State Control',
      effect: '+10 Stability, -10 GDP'
    }, {
      name: 'Mixed Economy',
      effect: '+5 GDP, +5 Stability'
    }]
  };
  content.innerHTML = laws[tab].map(law => `
        <div class="law-item">
          <h4>${law.name}</h4>
          <p>Effects: ${law.effect}</p>
          <button onclick="enactLaw('${law.name}')">Enact Law</button>
        </div>
      `).join('');
}
function switchShopTab(tab) {
  document.querySelectorAll('#shop-popup .menu-tab').forEach(t => {
    t.classList.remove('active');
    t.style.background = '#ffffff';
    t.style.color = '#333333';
  });
  event.target.classList.add('active');
  event.target.style.background = '#0066ff';
  event.target.style.color = '#ffffff';
  loadShopContent(tab);
}
function switchLawTab(tab) {
  document.querySelectorAll('#laws-popup .menu-tab').forEach(t => {
    t.classList.remove('active');
    t.style.background = '#ffffff';
    t.style.color = '#333333';
  });
  event.target.classList.add('active');
  event.target.style.background = '#0066ff';
  event.target.style.color = '#ffffff';
  loadLawsContent(tab);
}
function enactLaw(lawName) {
  const effects = {
    'Universal Healthcare': {
      stability: 10,
      gdp: -5
    },
    'Mandatory Military Service': {
      military: 15,
      stability: -5
    },
    'Free Education': {
      technology: 5,
      gdp: -3
    },
    'Open Borders': {
      relations: 10,
      gdp: 5
    },
    'Trade Restrictions': {
      relations: -5,
      gdp: 10
    },
    'Military Alliance': {
      military: 20,
      gdp: -10
    },
    'Free Market': {
      gdp: 15,
      stability: -5
    },
    'State Control': {
      stability: 10,
      gdp: -10
    },
    'Mixed Economy': {
      gdp: 5,
      stability: 5
    }
  };
  const effect = effects[lawName];
  if (!effect) return;
  if (effect.stability) {
    countryTraits.stability = Math.min(100, Math.max(0, countryTraits.stability + effect.stability));
  }
  if (effect.military) {
    countryPower.military = Math.min(100, Math.max(0, countryPower.military + effect.military));
  }
  if (effect.gdp) {
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${(currentGdp + effect.gdp).toFixed(1)}B`;
  }
  if (effect.technology) {
    countryTraits.technology = Math.min(100, Math.max(0, countryTraits.technology + effect.technology));
  }
  if (effect.relations) {
    const countryName = document.getElementById('country-name').value;
    Object.keys(relationships[countryName]).forEach(otherCountry => {
      relationships[countryName][otherCountry] += effect.relations;
    });
  }
  if (effect.influence) {
    countryTraits.influence = Math.round(countryTraits.influence + effect.influence * 10) / 10;
  }
  addNewsItem(`${document.getElementById('country-name').value} enacted ${lawName}!`);
  showConfirmationPopup('Law Enacted', `Successfully enacted ${lawName}!`);
  updateTraits();
  updateRank();
  updateWorldTension();
  saveGameState();
}
function purchaseItem(itemName, cost) {
  const stats = {
    'Infantry Division': {
      military: 5
    },
    'Tank Battalion': {
      military: 10
    },
    'Air Force Squadron': {
      military: 15
    },
    'Trade Center': {
      gdp: 10
    },
    'Industry Zone': {
      gdp: 20
    },
    'Research Lab': {
      technology: 5
    },
    'Road Network': {
      development: 5
    },
    'Power Plant': {
      development: 10
    },
    'Airport': {
      development: 15
    }
  };
  const stat = stats[itemName];
  if (!stat) return;
  if (stat.military) {
    countryPower.military += stat.military;
  }
  if (stat.gdp) {
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${(currentGdp + stat.gdp).toFixed(1)}B`;
  }
  if (stat.technology) {
    countryTraits.technology += stat.technology;
  }
  if (stat.development) {
    countryTraits.influence = Math.round((countryTraits.influence + 5) * 10) / 10;
    countryTraits.stability += stat.development / 2;
  }
  updateTraits();
  updateRank();
  addNewsItem(`${userCountry || document.getElementById('country-name').value} purchased ${itemName}!`);
  showConfirmationPopup('Purchase Complete', `Successfully purchased ${itemName}!`);
  saveGameState();
}
function expandTerritory(method) {
  try {
    if (!userCountryLayer || !userCountryLayer.getLayers || userCountryLayer.getLayers().length === 0) {
      console.warn('User country layer not defined or empty');
      showAlert('You must first establish a country on the map!');
      return;
    }
    const countryFeature = userCountryLayer.getLayers()[0].toGeoJSON();
    if (!countryFeature || !countryFeature.geometry || !countryFeature.geometry.coordinates) {
      console.warn('Invalid country geometry');
      showAlert('Invalid country geometry. Please try recreating your country.');
      return;
    }
    const coordinates = countryFeature.geometry.coordinates[0];
    if (!coordinates || coordinates.length < 4) {
      console.warn('Invalid coordinates array');
      showAlert('Invalid country borders. Please try recreating your country.');
      return;
    }
    const expansionCosts = {
      peaceful: {
        influence: 20,
        money: 100
      },
      military: {
        military: 30,
        money: 200
      },
      purchase: {
        money: 500
      }
    };
    const cost = expansionCosts[method];
    const countryName = document.getElementById('country-name').value;
    if (method === 'military' && countryPower.military < cost.military) {
      showAlert('Insufficient military power for conquest');
      return;
    }
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    if (cost.money > currentGdp) {
      showAlert('Insufficient funds for expansion');
      return;
    }
    document.getElementById('gdp').textContent = `$${(currentGdp - cost.money).toFixed(1)}B`;
    if (method === 'military') {
      countryPower.military -= cost.military;
      worldTension += 10;
    }
    let centerLat = 0,
      centerLng = 0;
    coordinates.forEach(coord => {
      centerLng += coord[0];
      centerLat += coord[1];
    });
    centerLat /= coordinates.length;
    centerLng /= coordinates.length;
    const angle = Math.random() * 2 * Math.PI;
    const distance = 0.5;
    const newLng = centerLng + distance * Math.cos(angle);
    const newLat = centerLat + distance * Math.sin(angle);
    const newCoordinates = [...coordinates];
    newCoordinates.splice(-1, 0, [newLng, newLat]);
    map.removeLayer(userCountryLayer);
    userCountryLayer = L.geoJSON({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [newCoordinates]
      }
    }, {
      style: {
        color: '#ff4444',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3
      }
    }).addTo(map);
    countryPower.territory += Math.floor(Math.random() * 10) + 5;
    countryTraits.influence = Math.round((countryTraits.influence + 5) * 10) / 10;
    const methodText = {
      peaceful: 'peaceful annexation',
      military: 'military conquest',
      purchase: 'territory purchase'
    };
    addNewsItem(`${countryName} expands through ${methodText[method]}!`, method === 'military' ? 'critical' : 'normal');
    showConfirmationPopup('Territory Expanded', `Successfully expanded territory through ${methodText[method]}!`);
    updateTraits();
    updateRank();
    updateWorldTension();
    saveGameState();
  } catch (error) {
    console.error('Error in expandTerritory:', error);
    showAlert('Error expanding territory. Please try again.');
  }
}
function updateRank() {
  try {
    const rankElement = document.getElementById('current-rank');
    const rankBarElement = document.querySelector('.rank-bar');
    if (!rankElement || !rankBarElement) {
      console.warn('Rank elements not found, skipping rank update');
      return;
    }
    const powerScore = Math.min(100, Math.max(0, countryPower.influence * 0.3 + countryPower.military * 0.3 + countryPower.territory * 0.2 + countryPower.allies * 20));
    let currentRank = countryRanks.SETTLEMENT;
    for (const [rank, data] of Object.entries(countryRanks)) {
      if (powerScore >= data.threshold) {
        currentRank = data;
      } else {
        break;
      }
    }
    if (!currentRank) {
      currentRank = countryRanks.SETTLEMENT;
    }
    const nextRank = Object.keys(countryRanks).find(key => countryRanks[key].threshold > powerScore);
    rankElement.textContent = currentRank.name;
    rankBarElement.style.width = `${powerScore}%`;
  } catch (error) {
    console.error('Error updating rank:', error);
  }
}
function createCountry() {
  const name = document.getElementById('country-name').value;
  const government = document.getElementById('government-type').value;
  if (!name) {
    showAlert('Please enter a country name');
    return;
  }
  map.off('click');
  const existingInstructions = document.getElementById('location-instructions');
  if (existingInstructions) {
    existingInstructions.remove();
  }
  document.getElementById('create-country-btn').style.display = 'none';
  showInstructionPopup(1);
  const locationHandler = function (e) {
    try {
      const marker = L.marker(e.latlng, {
        icon: L.divIcon({
          className: 'location-point',
          iconSize: [15, 15]
        })
      }).addTo(map);
      showInstructionPopup(2);
      const locationInst = document.getElementById('location-instructions');
      if (locationInst) {
        locationInst.remove();
      }
      const statsDiv = document.querySelector('.stats');
      const traitsDiv = document.querySelector('.traits');
      if (statsDiv) statsDiv.style.display = 'block';
      if (traitsDiv) traitsDiv.style.display = 'block';
      const rankDisplay = document.createElement('div');
      rankDisplay.className = 'rank-display';
      rankDisplay.innerHTML = showRankProgress(rankDisplay);
      statsDiv.appendChild(rankDisplay);
      countryPower = {
        influence: countryTraits.influence,
        military: Math.floor(Math.random() * 100),
        territory: userCountryPolygon.length * 5,
        allies: 0
      };
      updateRank();
      drawingMode = true;
      userCountryPolygon = [[e.latlng.lng, e.latlng.lat]];
      map.off('click', locationHandler);
      map.on('click', onMapClick);
      map.on('mousemove', function (e) {
        if (drawingMode && userCountryPolygon.length > 0) {
          if (userCountryLayer) {
            map.removeLayer(userCountryLayer);
          }
          const tempPolygon = [...userCountryPolygon, [e.latlng.lng, e.latlng.lat]];
          userCountryLayer = L.polyline(tempPolygon.map(p => [p[1], p[0]]), {
            color: '#ff4444',
            dashArray: '5, 10'
          }).addTo(map);
        }
      });
    } catch (error) {
      console.error('Error in location handler:', error);
      showAlert('Error placing country location. Please try again.');
    }
  };
  map.on('click', locationHandler);
  const newsFeed = document.querySelector('.news-feed');
  const mainMenuButtons = document.getElementById('main-menu-buttons');
  if (newsFeed) newsFeed.style.display = 'block';
  if (mainMenuButtons) mainMenuButtons.style.display = 'grid';
  const countryHeader = document.createElement('div');
  countryHeader.className = 'country-header';
  countryHeader.style.top = '60px';
  countryHeader.style.height = '50px';
  countryHeader.innerHTML = `
    <div class="country-name">
      <h2>${document.getElementById('country-name').value}</h2>
    </div>
    <div class="country-header-actions">
      <button onclick="declareWar()">Declare War</button>
      <button onclick="formAlliance()">Form Alliance</button>
      <button onclick="developNukes()">Develop Nuclear Weapons</button>
      <button onclick="sendAid()">Send Foreign Aid</button>
    </div>
  `;
  document.body.appendChild(countryHeader);
  countryHeader.style.display = 'flex';
  const headerControls = document.querySelector('.header-controls');
  if (headerControls) {
    headerControls.style.display = 'flex';
  }
  const statsPanel = document.getElementById('stats-panel');
  statsPanel.style.display = 'block';
  document.getElementById('container').style.top = '110px';
  document.getElementById('container').style.height = 'calc(100vh - 110px)';
  document.getElementById('stats-panel').style.height = 'calc(100vh - 110px)';
  document.getElementById('control-panel').style.height = 'calc(100vh - 110px)';
  updateProgressBars();
  const headerButtons = document.querySelector('.header-buttons');
  if (headerButtons) {
    headerButtons.style.display = 'flex';
  }
  worldTension = 0;
  simulateAICountries();
  updateWorldTension();
  saveGameState();
  setTimeout(() => {
    showRandomTip();
  }, 60000);
}
function onMapClick(e) {
  if (!drawingMode) return;
  try {
    userCountryPolygon.push([e.latlng.lng, e.latlng.lat]);
    if (userCountryLayer) {
      map.removeLayer(userCountryLayer);
    }
    const tempPolygon = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: userCountryPolygon
      }
    };
    userCountryLayer = L.geoJSON(tempPolygon, {
      style: function () {
        return {
          color: '#ff4444',
          weight: 2,
          opacity: 0.8
        };
      }
    }).addTo(map);
    if (userCountryPolygon.length >= 3) {
      userCountryPolygon.push(userCountryPolygon[0]);
      const name = document.getElementById('country-name').value;
      const government = document.getElementById('government-type').value;
      const countryFeature = {
        type: "Feature",
        properties: {
          name: name,
          government: government,
          population: Math.random() * 100,
          gdp: Math.random() * 1000,
          military: Math.floor(Math.random() * 100),
          isUserCountry: true
        },
        geometry: {
          type: "Polygon",
          coordinates: [userCountryPolygon]
        }
      };
      if (userCountryLayer) {
        map.removeLayer(userCountryLayer);
      }
      userCountryLayer = L.geoJSON(countryFeature, {
        style: function () {
          return {
            color: '#ff4444',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3
          };
        }
      }).addTo(map);
      const stats = {
        ...countryFeature.properties,
        stability: 100,
        influence: 50,
        technology: 50
      };
      updateStats(stats);
      map.off('click', onMapClick);
      map.off('mousemove');
      drawingMode = false;
      map.getContainer().classList.remove('drawing-mode');
      const drawingInst = document.querySelector('.drawing-instructions');
      if (drawingInst) drawingInst.remove();
      relationships[name] = {};
      Object.keys(relationships).forEach(country => {
        if (country !== name) {
          relationships[name][country] = 0;
          relationships[country][name] = 0;
        }
      });
      addNewsItem(`${name} has been established as a new ${government}!`);
    }
    if (instructionPopup) {
      instructionPopup.remove();
      instructionPopup = null;
    }
  } catch (error) {
    console.error('Error in onMapClick:', error);
  }
}
function declareWar() {
  const countries = Object.keys(relationships).filter(c => c !== document.getElementById('country-name').value);
  const warDialog = document.createElement('div');
  warDialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        z-index: 2001;
        border: 2px solid #0066ff;
        min-width: 300px;
        max-height: 60vh;
        overflow-y: auto;
        box-shadow: 0 5px 20px rgba(0, 102, 255, 0.2);
      `;
  warDialog.innerHTML = `
        <h3>Declare War</h3>
        <p>Choose your target:</p>
        <select id="war-target" style="width: 100%; margin: 10px 0;">
          ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button onclick="confirmWar()" style="flex: 1">Declare War</button>
          <button onclick="this.parentElement.parentElement.remove()" style="flex: 1">Cancel</button>
        </div>
      `;
  document.body.appendChild(warDialog);
  saveGameState();
}
function confirmWar() {
  const target = document.getElementById('war-target').value;
  const userCountry = document.getElementById('country-name').value;
  declareWarBetween(userCountry, target);
  document.querySelector('div[style*="position: fixed"]').remove();
  militaryActions.buildArmy += 20;
  militaryActions.enemies.push(target);
  militaryActions.allies = militaryActions.allies.filter(ally => relationships[ally][userCountry] > 30);
  countryTraits.stability -= 20;
  updateTraits();
  saveGameState();
}
function formAlliance() {
  const countries = Object.keys(relationships).filter(c => c !== document.getElementById('country-name').value);
  const allianceDialog = document.createElement('div');
  allianceDialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        z-index: 2001;
        border: 2px solid #0066ff;
        min-width: 300px;
        max-height: 60vh;
        overflow-y: auto;
        box-shadow: 0 5px 20px rgba(0, 102, 255, 0.2);
      `;
  allianceDialog.innerHTML = `
        <h3>Form Alliance</h3>
        <p>Choose your ally:</p>
        <select id="alliance-target" style="width: 100%; margin: 10px 0;">
          ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button onclick="confirmAlliance()" style="flex: 1">Form Alliance</button>
          <button onclick="this.parentElement.parentElement.remove()" style="flex: 1">Cancel</button>
        </div>
      `;
  document.body.appendChild(allianceDialog);
  saveGameState();
}
function confirmAlliance() {
  const target = document.getElementById('alliance-target').value;
  const userCountry = document.getElementById('country-name').value;
  relationships[userCountry][target] += 50;
  relationships[target][userCountry] += 50;
  militaryActions.allies.push(target);
  countryPower.allies += 1;
  addNewsItem(`${userCountry} has formed an alliance with ${target}!`);
  document.querySelector('div[style*="position: fixed"]').remove();
  updateRank();
  saveGameState();
}
function developNukes() {
  const userCountry = document.getElementById('country-name').value;
  worldTension += 15;
  addNewsItem(`${userCountry} has started a nuclear weapons program!`, 'critical');
  saveGameState();
}
function sendAid() {
  countryTraits.influence = Math.round((countryTraits.influence + 5) * 10) / 10;
  const countries = Object.keys(relationships).filter(c => c !== document.getElementById('country-name').value);
  const aidDialog = document.createElement('div');
  aidDialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    z-index: 2001;
    border: 2px solid #0066ff;
    min-width: 300px;
    max-height: 60vh;
    overflow-y: auto;
    box-shadow: 0 5px 20px rgba(0, 102, 255, 0.2);
  `;
  aidDialog.innerHTML = `
    <h3 style="color: #0066ff; margin-bottom: 15px; font-family: 'Aeonik', Arial, sans-serif; font-weight: 700;">Send Foreign Aid</h3>
    <p style="color: #333; margin-bottom: 10px; font-family: 'Aeonik', Arial, sans-serif;">Choose recipient country:</p>
    <select id="aid-target" style="width: 100%; margin: 10px 0; padding: 8px; border: 2px solid rgba(0,102,255,0.2); border-radius: 6px; background: #f0f5ff; color: #333;">
      ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select>
    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button onclick="confirmAid()" style="flex: 1; background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%); color: white; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-family: 'Aeonik', Arial, sans-serif; font-weight: 700;">Send Aid</button>
      <button onclick="this.parentElement.parentElement.remove()" style="flex: 1; background: #f0f5ff; color: #333; padding: 10px; border: 2px solid #0066ff; border-radius: 8px; cursor: pointer; font-family: 'Aeonik', Arial, sans-serif; font-weight: 700;">Cancel</button>
    </div>
  `;
  document.body.appendChild(aidDialog);
}
function updateStats(stats) {
  try {
    if (!stats) {
      console.warn('No stats provided to updateStats');
      return;
    }
    const elements = {
      population: document.getElementById('population'),
      gdp: document.getElementById('gdp'),
      military: document.getElementById('military'),
      gdpPerCapita: document.getElementById('gdp-per-capita'),
      activeMilitary: document.getElementById('active-military'),
      reserveMilitary: document.getElementById('reserve-military'),
      diplomaticCount: document.getElementById('diplomatic-count'),
      researchPoints: document.getElementById('research-points')
    };
    if (elements.population) {
      elements.population.textContent = `${stats.population.toFixed(1)}M`;
    }
    if (elements.gdp) {
      elements.gdp.textContent = `$${stats.gdp.toFixed(1)}B`;
    }
    if (elements.military) {
      elements.military.textContent = stats.military;
    }
    if (elements.gdpPerCapita) {
      const gdpPerCapita = (stats.gdp * 1000 / stats.population).toFixed(1);
      elements.gdpPerCapita.textContent = `$${Number(gdpPerCapita).toLocaleString()}`;
    }
    if (elements.activeMilitary && elements.reserveMilitary) {
      const activeMilitary = Math.round(stats.military * 0.4);
      const reserveMilitary = Math.round(stats.military * 0.6);
      elements.activeMilitary.textContent = `${activeMilitary.toLocaleString()}K`;
      elements.reserveMilitary.textContent = `${reserveMilitary.toLocaleString()}K`;
    }
    if (elements.diplomaticCount) {
      const diplomaticCount = Object.values(relationships[stats.name] || {}).filter(value => value > 0).length;
      elements.diplomaticCount.textContent = diplomaticCount;
    }
    if (elements.researchPoints) {
      const researchPoints = Math.round(countryTraits.technology * 100);
      elements.researchPoints.textContent = researchPoints;
    }
    updateTraits();
    updateRank();
    updateProgressBars();
  } catch (error) {
    console.error('Error in updateStats:', error);
  }
}
function updateTraits() {
  try {
    const stability = document.getElementById('stability');
    const influence = document.getElementById('influence');
    const technology = document.getElementById('technology');
    const stabilityProgress = document.getElementById('stability-progress');
    const influenceProgress = document.getElementById('influence-progress');
    const technologyProgress = document.getElementById('technology-progress');
    if (stability && stability.nextElementSibling) {
      stability.textContent = `${countryTraits.stability}%`;
      const trendIndicator = stability.nextElementSibling.getElementsByClassName('trend-indicator')[0];
      if (trendIndicator) {
        trendIndicator.className = `trend-indicator ${countryTraits.stability >= 75 ? 'trend-up' : 'trend-down'}`;
      }
    }
    if (influence) {
      influence.textContent = `${countryTraits.influence.toFixed(1)}%`;
    }
    if (technology) {
      technology.textContent = `${countryTraits.technology}%`;
    }
    if (stabilityProgress) {
      stabilityProgress.style.width = `${countryTraits.stability}%`;
    }
    if (influenceProgress) {
      influenceProgress.style.width = `${countryTraits.influence}%`;
    }
    if (technologyProgress) {
      technologyProgress.style.width = `${countryTraits.technology}%`;
    }
    const diplomaticCount = document.getElementById('diplomatic-count');
    if (diplomaticCount) {
      const userCountry = document.getElementById('country-name').value;
      const count = Object.values(relationships[userCountry] || {}).filter(value => value > 0).length;
      diplomaticCount.textContent = count;
    }
  } catch (error) {
    console.error('Error in updateTraits:', error);
  }
}
function addNewsItem(text, type = 'normal', fullArticle = null) {
  const timestamp = new Date().toLocaleTimeString();
  const article = {
    id: `news-${Date.now()}`,
    timestamp,
    title: text,
    content: fullArticle || text,
    type
  };
  newsArticles.unshift(article);
  if (newsArticles.length > 50) newsArticles.pop();
  const newsItem = document.createElement('div');
  newsItem.className = `news-article ${type}`;
  newsItem.onclick = () => showFullArticle(article);
  const importance = type === 'critical' ? '<span class="breaking-news">BREAKING NEWS</span>' : '';
  newsItem.innerHTML = `
    <div class="news-header">
      ${importance}
      <div class="timestamp">${timestamp}</div>
    </div>
    <h4>${text}</h4>
    <div class="preview">${(fullArticle || text).substring(0, 100)}${(fullArticle || text).length > 100 ? '...' : ''}</div>
  `;
  const newsFeed = document.getElementById('news-feed');
  if (!newsFeed) return;
  let newsHeader = newsFeed.querySelector('.news-header');
  if (!newsHeader) {
    newsHeader = document.createElement('div');
    newsHeader.className = 'news-header';
    newsHeader.innerHTML = '<h3>World News</h3>';
    newsFeed.appendChild(newsHeader);
  }
  let newsContent = newsFeed.querySelector('.news-content');
  if (!newsContent) {
    newsContent = document.createElement('div');
    newsContent.className = 'news-content';
    newsFeed.appendChild(newsContent);
  }
  newsContent.insertBefore(newsItem, newsContent.firstChild);
  newsItem.style.opacity = '0';
  newsItem.style.transform = 'translateY(20px)';
  newsItem.style.transition = 'all 0.3s ease-out';
  requestAnimationFrame(() => {
    newsItem.style.opacity = '1';
    newsItem.style.transform = 'translateY(0)';
  });
}
function showFullArticle(article) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.onclick = closeArticleModal;
  const modal = document.createElement('div');
  modal.className = 'news-modal';
  modal.innerHTML = `
    <button class="close-btn" onclick="closeArticleModal()">&times;</button>
    <h2 class="${article.type}">${article.title}</h2>
    ${article.type === 'critical' ? '<span class="breaking-news">BREAKING NEWS</span>' : ''}
    <div class="timestamp">${article.timestamp}</div>
    <div class="article-content ${article.type}">
      ${article.content}
    </div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
  modal.onclick = e => e.stopPropagation();
}
function closeArticleModal() {
  const modal = document.querySelector('.news-modal');
  const backdrop = document.querySelector('.modal-backdrop');
  if (modal) {
    modal.remove();
  }
  if (backdrop) {
    backdrop.remove();
  }
}
function declareWarBetween(country1, country2) {
  if (!countryTraits[country1]) {
    countryTraits[country1] = {
      stability: 100,
      influence: 50,
      technology: 50
    };
  }
  if (!countryTraits[country2]) {
    countryTraits[country2] = {
      stability: 100,
      influence: 50,
      technology: 50
    };
  }
  warStatus[`${country1}-${country2}`] = true;
  relationships[country1][country2] = -100;
  relationships[country2][country1] = -100;
  worldTension += 25;
  warEvents.wars[`${country1}-${country2}`] = {
    startTime: Date.now(),
    participants: {
      [country1]: {
        allies: militaryActions.allies.filter(ally => relationships[ally][country1] > 30),
        occupiedTerritories: []
      },
      [country2]: {
        allies: Object.keys(relationships[country2]).filter(ally => relationships[ally][country2] > 30 && ally !== country1),
        occupiedTerritories: []
      }
    }
  };
  const tensionMultiplier = worldTension / 50;
  if (countryTraits[country1]) {
    countryTraits[country1].stability = Math.max(0, countryTraits[country1].stability - 15 * tensionMultiplier);
  }
  if (countryTraits[country2]) {
    countryTraits[country2].stability = Math.max(0, countryTraits[country2].stability - 15 * tensionMultiplier);
  }
  if (countryPower[country1]) {
    countryPower[country1].military = Math.max(0, countryPower[country1].military - 10 * tensionMultiplier);
  }
  if (countryPower[country2]) {
    countryPower[country2].military = Math.max(0, countryPower[country2].military - 10 * tensionMultiplier);
  }
  const gdp1Element = document.getElementById('gdp-' + country1);
  if (gdp1Element) {
    const currentGdp1 = parseFloat(gdp1Element.textContent.replace('$', '').replace('B', ''));
    gdp1Element.textContent = `$${Math.max(0, currentGdp1 - 5 * tensionMultiplier).toFixed(1)}B`;
  }
  const gdp2Element = document.getElementById('gdp-' + country2);
  if (gdp2Element) {
    const currentGdp2 = parseFloat(gdp2Element.textContent.replace('$', '').replace('B', ''));
    gdp2Element.textContent = `$${Math.max(0, currentGdp2 - 5 * tensionMultiplier).toFixed(1)}B`;
  }
  if (["United States", "Russia", "China", "North Korea"].includes(country1) && Math.random() < 0.1) {
    const article = newsTemplates.nuclear(country1, country2);
    addNewsItem(article.title, article.type, article.content);
    worldTension = 100;
  } else {
    const article = newsTemplates.war(country1, country2);
    addNewsItem(article.title, article.type, article.content);
  }
  updateWorldTension();
}
function generateConflict() {
  const countries = Object.keys(relationships);
  if (!countries || countries.length < 2) return;
  const country1 = countries[Math.floor(Math.random() * countries.length)];
  let country2 = countries[Math.floor(Math.random() * countries.length)];
  let attempts = 0;
  while (country1 === country2 || !relationships[country1] || !relationships[country1][country2] || relationships[country1][country2] > 0) {
    country2 = countries[Math.floor(Math.random() * countries.length)];
    attempts++;
    if (attempts > 10) return;
  }
  if (!countryTraits[country1]) {
    countryTraits[country1] = {
      stability: 100,
      influence: 50,
      technology: 50
    };
  }
  if (!countryTraits[country2]) {
    countryTraits[country2] = {
      stability: 100,
      influence: 50,
      technology: 50
    };
  }
  if (!countryPower[country1]) {
    countryPower[country1] = {
      influence: 50,
      military: Math.floor(Math.random() * 100),
      territory: Math.floor(Math.random() * 100),
      allies: 0
    };
  }
  if (!countryPower[country2]) {
    countryPower[country2] = {
      influence: 50,
      military: Math.floor(Math.random() * 100),
      territory: Math.floor(Math.random() * 100),
      allies: 0
    };
  }
  const tensionThreshold = worldTension / 100;
  const eventChance = Math.random();
  if (eventChance < tensionThreshold) {
    if (worldTension > 75) {
      const criticalEvents = [() => {
        const article = newsTemplates.cyberAttack(country1, country2);
        addNewsItem(article.title, article.type, article.content);
        worldTension += 15;
      }, () => {
        const article = newsTemplates.assassination(country1, "Prime Minister");
        addNewsItem(article.title, article.type, article.content);
        worldTension += 20;
      }, () => declareWarBetween(country1, country2), () => {
        const article = newsTemplates.rebellion(country1, "Northern");
        addNewsItem(article.title, article.type, article.content);
        worldTension += 10;
      }];
      const event = criticalEvents[Math.floor(Math.random() * criticalEvents.length)];
      event();
    } else if (worldTension > 50) {
      const mediumEvents = [() => {
        const article = newsTemplates.troopMovement(country1, "border regions");
        addNewsItem(article.title, article.type, article.content);
        worldTension += 8;
      }, () => {
        const article = newsTemplates.armsDeal(country1, country2);
        addNewsItem(article.title, article.type, article.content);
        worldTension += 5;
      }, () => {
        const article = newsTemplates.economicCrisis(country1);
        addNewsItem(article.title, article.type, article.content);
        worldTension += 7;
      }];
      const event = mediumEvents[Math.floor(Math.random() * mediumEvents.length)];
      event();
    } else {
      const conflictTypes = [() => addNewsItem(`${country1} accuses ${country2} of espionage!`), () => addNewsItem(`${country1} imposes economic sanctions on ${country2}`), () => addNewsItem(`${country1} expels diplomats from ${country2}`), () => addNewsItem(`Border skirmish reported between ${country1} and ${country2}`)];
      const conflict = conflictTypes[Math.floor(Math.random() * conflictTypes.length)];
      conflict();
      relationships[country1][country2] -= 15;
      relationships[country2][country1] -= 15;
      worldTension += 5;
    }
  }
  updateWorldTension();
}
function generateDiplomaticEvent() {
  const countries = Object.keys(relationships);
  const country1 = countries[Math.floor(Math.random() * countries.length)];
  let country2 = countries[Math.floor(Math.random() * countries.length)];
  while (country1 === country2) {
    country2 = countries[Math.floor(Math.random() * countries.length)];
  }
  const actions = ['suspends diplomatic relations', 'proposes new trade agreement', 'strengthens military cooperation', 'disputes border claims'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const article = newsTemplates.diplomatic(country1, country2, action);
  addNewsItem(article.title, article.type, article.content);
}
function initializeRelationships() {
  const countries = ["United States", "Canada", "Mexico", "Russia", "Germany", "Turkey", "France", "United Kingdom", "Japan", "China", "South Korea", "North Korea", "Brazil", "Greenland", "New Zealand", "Vietnam", "Ukraine", "England", "Sweden", "Argentina", "Nepal", "Malaysia", "Georgia"];
  countries.forEach(country1 => {
    relationships[country1] = {};
    countries.forEach(country2 => {
      if (country1 !== country2) {
        relationships[country1][country2] = getInitialRelationship(country1, country2);
      }
    });
  });
  countries.forEach(country => {
    countryTraits[country] = {
      stability: 100,
      influence: 50,
      technology: 50
    };
    countryPower[country] = {
      influence: 50,
      military: Math.floor(Math.random() * 100),
      territory: Math.floor(Math.random() * 100),
      allies: 0
    };
  });
}
function getInitialRelationship(country1, country2) {
  if (country1 === "United States" && ["United Kingdom", "Canada"].includes(country2) || country2 === "United States" && ["United Kingdom", "Canada"].includes(country1)) {
    return 75;
  }
  if (country1 === "North Korea" && ["United States", "South Korea"].includes(country2) || country2 === "North Korea" && ["United States", "South Korea"].includes(country1)) {
    return -75;
  }
  if (country1 === "Russia" && country2 === "Ukraine" || country1 === "Ukraine" && country2 === "Russia") {
    return -90;
  }
  if (country1 === "England" && country2 === "United Kingdom" || country1 === "United Kingdom" && country2 === "England") {
    return 90;
  }
  return 0;
}
function simulateAICountries() {
  if (!document.getElementById('country-name').value) {
    return;
  }
  setInterval(() => {
    const chance = Math.random();
    updateWorldTension();
    const aggressionMultiplier = worldTension / 50;
    if (Math.random() < 0.1 * aggressionMultiplier) {
      generateConflict();
    }
    for (const [level, data] of Object.entries(tensionEffects)) {
      if (worldTension >= data.range[0] && worldTension <= data.range[1]) {
        if (Math.random() < data.eventChance) {
          generateConflict();
        }
        break;
      }
    }
    if (chance < 0.1) {
      generateDiplomaticEvent();
    }
    if (chance < 0.05) {
      checkEmpireRestoration();
    }
  }, 10000);
  setInterval(() => {
    Object.keys(warEvents.wars).forEach(warKey => {
      const [country1, country2] = warKey.split('-');
      const war = warEvents.wars[warKey];
      const chance = Math.random();
      if (chance < 0.1 && !warEvents.peaceOffers[warKey]) {
        const offeringCountry = Math.random() < 0.5 ? country1 : country2;
        const receivingCountry = offeringCountry === country1 ? country2 : country1;
        warEvents.peaceOffers[warKey] = offeringCountry;
        const article = newsTemplates.peaceOffer(offeringCountry, receivingCountry);
        addNewsItem(article.title, article.type, article.content);
      }
      if (chance < 0.15) {
        const occupier = Math.random() < 0.5 ? country1 : country2;
        const occupied = occupier === country1 ? country2 : country1;
        const territory = `Region ${Math.floor(Math.random() * 5) + 1}`;
        war.participants[occupier].occupiedTerritories.push({
          territory,
          takenFrom: occupied
        });
        const article = newsTemplates.territoryOccupied(occupier, occupied, territory);
        addNewsItem(article.title, article.type, article.content);
      }
      if (chance < 0.05 || war.participants[country1].occupiedTerritories.length > 3 || war.participants[country2].occupiedTerritories.length > 3) {
        const victor = war.participants[country1].occupiedTerritories.length > war.participants[country2].occupiedTerritories.length ? country1 : country2;
        const article = newsTemplates.warEnd(country1, country2, victor);
        addNewsItem(article.title, article.type, article.content);
        war.participants[victor === country1 ? country2 : country1].allies.forEach(ally => {
          const allyArticle = newsTemplates.allyDefeated(ally, victor);
          addNewsItem(allyArticle.title, allyArticle.type, allyArticle.content);
        });
        delete warEvents.wars[warKey];
        delete warEvents.peaceOffers[warKey];
        warStatus[warKey] = false;
        relationships[country1][country2] = -50;
        relationships[country2][country1] = -50;
        worldTension -= 10;
      }
    });
  }, 15000);
  if (worldTension > 60 && Math.random() < 0.15) {
    const regions = ["Asia", "Europe", "Middle East", "Africa", "Americas"];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const article = newsTemplates.troopMovement(Object.keys(relationships)[Math.floor(Math.random() * Object.keys(relationships).length)], region);
    addNewsItem(article.title, article.type, article.content);
  }
  setInterval(() => {
    const countries = Object.keys(relationships);
    if (Math.random() < 0.1 * (worldTension / 100)) {
      const eventFunc = criticalEvents[Math.floor(Math.random() * criticalEvents.length)];
      const country1 = countries[Math.floor(Math.random() * countries.length)];
      const country2 = countries[Math.floor(Math.random() * countries.length)];
      if (eventFunc.length === 1) {
        const event = eventFunc(country1);
        addNewsItem(event.title, event.type, event.content);
        worldTension += 15;
      } else {
        const event = eventFunc(country1, country2);
        addNewsItem(event.title, event.type, event.content);
        worldTension += 10;
        if (!relationships[country1][country2]) {
          relationships[country1][country2] = 0;
        }
        relationships[country1][country2] -= 25;
      }
    }
    if (Math.random() < 0.2) {
      const eventFunc = standardEvents[Math.floor(Math.random() * standardEvents.length)];
      const country1 = countries[Math.floor(Math.random() * countries.length)];
      const country2 = countries[Math.floor(Math.random() * countries.length)];
      if (eventFunc.length === 1) {
        const event = eventFunc(country1);
        addNewsItem(event.title, event.type, event.content);
      } else {
        const event = eventFunc(country1, country2);
        addNewsItem(event.title, event.type, event.content);
        if (!relationships[country1][country2]) {
          relationships[country1][country2] = 0;
        }
        relationships[country1][country2] -= 10;
      }
      worldTension += 5;
    }
    if (worldTension > 75 && Math.random() < 0.05) {
      const nuclearPowers = ["United States", "Russia", "China", "North Korea"];
      const country = nuclearPowers[Math.floor(Math.random() * nuclearPowers.length)];
      const event = {
        title: `NUCLEAR ALERT: ${country} places nuclear forces on high alert`,
        content: `In an alarming development, ${country} has elevated its nuclear readiness status amid rising global tensions. Military analysts warn this represents a dangerous escalation in the current crisis.`,
        type: 'critical'
      };
      addNewsItem(event.title, event.type, event.content);
      worldTension += 20;
    }
    updateWorldTension();
    saveGameState();
  }, 15000);
}
function updateWorldTension() {
  if (Math.random() < 0.6) {
    worldTension += Math.random() * 3;
  } else {
    worldTension -= Math.random() * 2;
  }
  worldTension = Math.max(0, Math.min(100, worldTension));
  updateHeaderTension();
  if (worldTension >= 100) {
    addNewsItem("GLOBAL CRISIS: World tension has reached critical levels!", "critical", "The international community stands on the brink of total war as global tensions reach unprecedented levels. " + "Multiple nations are mobilizing their armed forces and civilian populations are being advised to prepare for potential conflict. " + "Emergency meetings of the UN Security Council have been called.");
  }
  if (worldTension >= 75) {
    countryTraits.stability = Math.max(0, countryTraits.stability - 2);
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${Math.max(0, currentGdp - 0.5).toFixed(1)}B`;
    countryTraits.influence = Math.round(Math.max(0, countryTraits.influence - 1) * 10) / 10;
  } else if (worldTension >= 50) {
    countryTraits.stability = Math.max(0, countryTraits.stability - 1);
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${Math.max(0, currentGdp - 0.2).toFixed(1)}B`;
  } else if (worldTension <= 25) {
    countryTraits.stability = Math.min(100, countryTraits.stability + 0.5);
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${(currentGdp + 0.3).toFixed(1)}B`;
    countryTraits.influence = Math.round(Math.min(100, countryTraits.influence + 0.2) * 10) / 10;
  }
  updateTraits();
  updateRank();
  const warning = document.getElementById('critical-tension-warning');
  const currentTime = Date.now();
  if (worldTension >= 95 && currentTime - lastWarningTime >= 120000) {
    warning.style.display = 'block';
    lastWarningTime = currentTime;
    setTimeout(() => {
      warning.style.display = 'none';
    }, 5000);
  } else if (worldTension < 95) {
    warning.style.display = 'none';
  }
}
function updateHeaderTension() {
  const headerTensionValue = document.querySelector('.header-tension-value');
  if (headerTensionValue) {
    headerTensionValue.textContent = `${Math.round(worldTension)}%`;
    if (worldTension >= 75) {
      headerTensionValue.style.color = '#ff4444';
    } else if (worldTension >= 50) {
      headerTensionValue.style.color = '#ff8800';
    } else if (worldTension >= 25) {
      headerTensionValue.style.color = '#ffcc00';
    } else {
      headerTensionValue.style.color = '#0066ff';
    }
  }
}
function showRankProgress(rankDisplay) {
  const powerScore = Math.min(100, Math.max(0, countryPower.influence * 0.3 + countryPower.military * 0.3 + countryPower.territory * 0.2 + countryPower.allies * 20));
  let currentRank = countryRanks.SETTLEMENT;
  for (const [rank, data] of Object.entries(countryRanks)) {
    if (powerScore >= data.threshold) {
      currentRank = data;
    } else {
      break;
    }
  }
  if (!currentRank) {
    currentRank = countryRanks.SETTLEMENT;
  }
  const nextRank = Object.keys(countryRanks).find(key => countryRanks[key].threshold > powerScore);
  const progressToNext = nextRank ? (powerScore - currentRank.threshold) / (countryRanks[nextRank].threshold - currentRank.threshold) * 100 : 100;
  return `
    <div class="rank-title">
      <span>${currentRank.name}</span>
      ${nextRank ? `<span class="next-rank">Next: ${countryRanks[nextRank].name}</span>` : ''}
    </div>
    <div class="progress-bar rank-progress">
      <div class="rank-bar" style="width: ${progressToNext}%"></div>
    </div>
    <div class="rank-benefits">
      <h4>Current Benefits</h4>
      <ul>
        ${currentRank.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
      </ul>
    </div>
  `;
}
function reactToNews(id, reaction) {
  const article = newsArticles.find(a => a.id === id);
  if (article) {
    if (reaction === 'like') {
      article.reactions.likes += 1;
    } else if (reaction === 'share') {
      article.reactions.shares += 1;
    }
    const newsItem = document.querySelector(`.news-article#${id}`);
    if (newsItem) {
      newsItem.querySelector('.reactions').innerHTML = `
            <button onclick="reactToNews('${id}', 'like')">👍 ${article.reactions.likes}</button>
            <button onclick="reactToNews('${id}', 'share')">🔄 ${article.reactions.shares}</button>
          `;
    }
  }
}
function confirmAid() {
  const targetCountry = document.getElementById('aid-target').value;
  const userCountry = document.getElementById('country-name').value;
  if (targetCountry && relationships[targetCountry]) {
    relationships[userCountry][targetCountry] += 20;
    relationships[targetCountry][userCountry] += 20;
    countryTraits.influence += 5;
    const currentGdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
    document.getElementById('gdp').textContent = `$${(currentGdp - 10).toFixed(1)}B`;
    addNewsItem(`${userCountry} has sent humanitarian aid to ${targetCountry}!`);
    updateTraits();
    updateRank();
    saveGameState();
  }
  const dialog = document.querySelector('div[style*="position: fixed"]');
  if (dialog) dialog.remove();
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();
}
setInterval(() => {
  updateRank();
}, 1000);
function saveGameState() {
  const gameState = {
    userCountry: userCountry,
    worldTension: worldTension,
    relationships: relationships,
    warStatus: warStatus,
    militaryActions: militaryActions,
    countryTraits: countryTraits,
    newsArticles: newsArticles,
    countryPower: countryPower,
    warEvents: warEvents,
    userCountryPolygon: userCountryPolygon
  };
  localStorage.setItem('countryBuilderState', JSON.stringify(gameState));
  localStorage.setItem('countryBuilderLastSave', new Date().toISOString());
}
function loadGameState() {
  const savedState = localStorage.getItem('countryBuilderState');
  if (!savedState) return false;
  try {
    const gameState = JSON.parse(savedState);
    userCountry = gameState.userCountry;
    worldTension = gameState.worldTension;
    relationships = gameState.relationships;
    warStatus = gameState.warStatus;
    militaryActions = gameState.militaryActions;
    countryTraits = gameState.countryTraits;
    newsArticles = gameState.newsArticles;
    countryPower = gameState.countryPower;
    warEvents = gameState.warEvents;
    userCountryPolygon = gameState.userCountryPolygon;
    if (gameState.userCountry) {
      const statsDiv = document.querySelector('.stats');
      const traitsDiv = document.querySelector('.traits');
      if (statsDiv) statsDiv.style.display = 'block';
      if (traitsDiv) traitsDiv.style.display = 'block';
      const newsFeed = document.querySelector('.news-feed');
      const mainMenuButtons = document.getElementById('main-menu-buttons');
      if (newsFeed) newsFeed.style.display = 'block';
      if (mainMenuButtons) mainMenuButtons.style.display = 'grid';
      const countryHeader = document.createElement('div');
      countryHeader.className = 'country-header';
      countryHeader.innerHTML = `
          <div class="country-name">
            <h2>${gameState.userCountry}</h2>
          </div>
          <div class="country-header-actions">
            <button onclick="declareWar()">Declare War</button>
            <button onclick="formAlliance()">Form Alliance</button>
            <button onclick="reformEmpire()">Reform Empire</button>
            <button onclick="developNukes()">Develop Nuclear Weapons</button>
            <button onclick="sendAid()">Send Foreign Aid</button>
          </div>
        `;
      document.body.appendChild(countryHeader);
      countryHeader.style.display = 'flex';
      simulateAICountries();
      updateWorldTension();
    }
    return true;
  } catch (error) {
    console.error('Error loading game state:', error);
    return false;
  }
}
setInterval(saveGameState, 60000);
window.addEventListener('beforeunload', saveGameState);
function initializeMap() {
  try {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);
    const realCountries = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          name: "Afghanistan",
          government: "republic",
          population: 38.9,
          gdp: 19.8,
          military: 45
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[61, 35], [62, 35], [63, 36], [64, 36], [65, 37], [66, 37], [67, 36], [68, 36], [69, 37], [70, 37], [71, 36], [72, 36], [73, 37], [74, 37], [75, 36], [74, 35], [73, 34], [72, 34], [71, 35], [70, 35], [69, 34], [68, 34], [67, 35], [66, 35], [65, 34], [64, 34], [63, 35], [62, 35], [61, 34], [60, 34], [61, 35]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Albania",
          government: "parliamentary republic",
          population: 3,
          gdp: 14.34,
          military: 25
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[19, 42], [20, 42], [21, 42], [20, 41], [19, 41], [19, 42]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "United Arab Emirates",
          government: "absolute monarchy",
          population: 9.541,
          gdp: 421.142,
          military: 59
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[51.45, 24.85], [52.74, 24.85], [52.74, 26.42], [51.45, 26.42], [51.45, 24.85]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "United States",
          government: "federal presidential republic",
          population: 331.9,
          gdp: 22940,
          military: 100
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-125, 48], [-123, 48], [-120, 48], [-117, 48], [-115, 48], [-110, 48], [-105, 48], [-100, 48], [-95, 48], [-90, 48], [-85, 48], [-80, 48], [-75, 48], [-70, 48], [-67, 45], [-70, 43], [-75, 42], [-80, 40], [-85, 35], [-90, 30], [-95, 30], [-100, 30], [-105, 32], [-110, 32], [-115, 35], [-120, 40], [-125, 45], [-125, 48]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Canada",
          government: "federal parliamentary democracy",
          population: 38.25,
          gdp: 1988,
          military: 72
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[140, 70], [130, 70], [120, 70], [110, 70], [100, 70], [90, 70], [80, 70], [70, 70], [60, 60], [70, 55], [80, 50], [90, 50], [100, 50], [110, 50], [120, 50], [130, 55], [140, 60], [140, 70]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Mexico",
          government: "federal presidential republic",
          population: 128.9,
          gdp: 1293,
          military: 58
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-120, 30], [-110, 30], [-100, 30], [-90, 30], [-85, 20], [-90, 15], [-95, 15], [-100, 20], [-105, 20], [-110, 25], [-115, 25], [-120, 30]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Russia",
          government: "federal semi-presidential republic",
          population: 144.1,
          gdp: 1778,
          military: 95
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[30, 70], [40, 70], [50, 70], [60, 70], [70, 70], [80, 70], [90, 70], [100, 70], [110, 70], [120, 70], [130, 70], [140, 70], [150, 70], [160, 70], [170, 70], [180, 70], [170, 60], [160, 50], [150, 50], [140, 50], [130, 50], [120, 50], [110, 50], [100, 50], [90, 50], [80, 50], [70, 50], [60, 50], [50, 50], [40, 50], [30, 50], [30, 70]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Germany",
          government: "federal parliamentary republic",
          population: 83.2,
          gdp: 4223,
          military: 80
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[6, 54], [7, 54], [8, 54], [9, 54], [10, 54], [11, 54], [12, 54], [13, 54], [14, 54], [15, 54], [14, 51], [13, 48], [12, 48], [11, 48], [10, 48], [9, 48], [8, 48], [7, 48], [6, 48], [6, 54]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Turkey",
          government: "presidential republic",
          population: 84.3,
          gdp: 720,
          military: 65
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[26, 42], [28, 42], [30, 42], [32, 42], [34, 42], [36, 42], [38, 42], [40, 42], [42, 42], [44, 38], [42, 36], [40, 36], [38, 36], [36, 36], [34, 36], [32, 36], [30, 36], [28, 36], [26, 36], [26, 42]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "France",
          government: "unitary semi-presidential republic",
          population: 67.39,
          gdp: 2940,
          military: 75
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-4, 51], [-2, 51], [0, 51], [2, 51], [4, 51], [6, 51], [8, 51], [6, 48], [4, 46], [2, 44], [0, 44], [-2, 46], [-4, 48], [-4, 51]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "United Kingdom",
          government: "unitary parliamentary democracy",
          population: 67.22,
          gdp: 3131,
          military: 78
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-5, 50], [-3, 50], [0, 50], [2, 52], [0, 54], [-2, 54], [-5, 52], [-5, 50]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Japan",
          government: "unitary parliamentary constitutional monarchy",
          population: 125.36,
          gdp: 5103,
          military: 70
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[130, 45], [132, 45], [134, 45], [136, 45], [138, 45], [140, 45], [142, 45], [140, 42], [138, 39], [136, 36], [134, 33], [132, 36], [130, 39], [130, 45]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "China",
          government: "unitary one-party socialist republic",
          population: 1402,
          gdp: 17734,
          military: 98
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[75, 45], [85, 45], [95, 45], [105, 45], [115, 45], [125, 45], [135, 45], [135, 35], [125, 30], [115, 25], [105, 25], [95, 25], [85, 30], [75, 35], [75, 45]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "South Korea",
          government: "unitary presidential constitutional republic",
          population: 51.74,
          gdp: 1798,
          military: 65
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[126, 38], [128, 38], [130, 38], [128, 36], [126, 36], [126, 38]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "North Korea",
          government: "unitary one-party socialist state",
          population: 25.55,
          gdp: 32,
          military: 50
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[124, 43], [126, 43], [128, 43], [130, 43], [128, 41], [126, 41], [124, 41], [124, 43]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Brazil",
          government: "federal presidential republic",
          population: 214.3,
          gdp: 1608,
          military: 55
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-73.9, 5.0], [-55.0, 5.0], [-35.0, -5.0], [-38.0, -20.0], [-53.0, -33.0], [-73.9, -18.0], [-73.9, 5.0]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Greenland",
          government: "parliamentary democracy",
          population: 0.056,
          gdp: 3.1,
          military: 10
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-73.0, 78.0], [-37.0, 83.0], [-18.0, 71.0], [-44.0, 60.0], [-73.0, 78.0]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "New Zealand",
          government: "unitary parliamentary democracy",
          population: 5.1,
          gdp: 247,
          military: 35
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[166.5, -46.0], [172.0, -40.5], [178.5, -37.0], [174.0, -41.0], [168.0, -46.5], [166.5, -46.0]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Vietnam",
          government: "socialist republic",
          population: 97.3,
          gdp: 366,
          military: 45
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[100, 6], [102, 6], [104, 6], [106, 4], [104, 2], [102, 2], [100, 2], [98, 4], [100, 6]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Ukraine",
          government: "semi-presidential representative democracy",
          population: 44.13,
          gdp: 155.5,
          military: 55
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[22, 48], [22, 51], [28, 51], [32, 51], [38, 51], [40, 48], [38, 45], [32, 45], [28, 45], [22, 48]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "England",
          government: "constitutional monarchy",
          population: 56.5,
          gdp: 2850,
          military: 70
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-5, 50], [-2, 50], [0, 50], [2, 52], [0, 54], [-2, 54], [-5, 52], [-5, 50]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Sweden",
          government: "parliamentary democracy",
          population: 10.4,
          gdp: 627,
          military: 45
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[12, 55], [14, 55], [18, 55], [20, 60], [18, 65], [14, 68], [12, 65], [10, 60], [12, 55]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Argentina",
          government: "federal presidential republic",
          population: 45.8,
          gdp: 487,
          military: 40
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[-73, -55], [-65, -55], [-60, -50], [-55, -35], [-65, -22], [-70, -30], [-73, -40], [-73, -55]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Nepal",
          government: "federal parliamentary republic",
          population: 29.1,
          gdp: 36,
          military: 25
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[80, 30], [82, 30], [84, 30], [86, 30], [88, 30], [88, 28], [86, 28], [84, 28], [82, 28], [80, 28], [80, 30]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Malaysia",
          government: "federal constitutional monarchy",
          population: 32.7,
          gdp: 372,
          military: 35
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[100, 6], [102, 6], [104, 6], [106, 4], [104, 2], [102, 2], [100, 2], [98, 4], [100, 6]]]
        }
      }, {
        type: "Feature",
        properties: {
          name: "Georgia",
          government: "unitary parliamentary republic",
          population: 3.7,
          gdp: 15.8,
          military: 20
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[40, 42], [42, 42], [44, 42], [46, 42], [46, 41], [44, 41], [42, 41], [40, 41], [40, 42]]]
        }
      }]
    };
    L.geoJSON(realCountries, {
      style: function () {
        return {
          color: '#3388ff',
          weight: 2,
          opacity: 0.65,
          fillOpacity: 0.2
        };
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(`
                <b>${feature.properties.name}</b><br>
                Government: ${feature.properties.government}<br>
                Population: ${feature.properties.population}M<br>
                GDP: $${feature.properties.gdp}B<br>
                Military Power: ${feature.properties.military}
              `);
        }
      }
    }).addTo(map);
  } catch (error) {
    console.error("Map initialization error:", error);
    showAlert("Error initializing map");
  }
}
function showAlert(message) {
  let alertBox = document.getElementById('alert-box');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'alert-box';
    alertBox.className = 'alert';
    document.body.appendChild(alertBox);
  }
  alertBox.textContent = message;
  alertBox.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: #ffffff;
    border-left: 4px solid #0066ff;
    color: #333333;
    box-shadow: 0 3px 10px rgba(0, 102, 255, 0.2);
    border-radius: 4px;
    z-index: 2002;
    display: block;
    animation: slideIn 0.3s ease-out;
    font-family: 'Aeonik', Arial, sans-serif;
    font-weight: 500;
  `;
  setTimeout(() => {
    alertBox.style.opacity = '0';
    setTimeout(() => {
      alertBox.style.display = 'none';
      alertBox.style.opacity = '1';
    }, 300);
  }, 3000);
}
document.addEventListener('DOMContentLoaded', function () {
  if (instructionPopup) {
    instructionPopup.remove();
    instructionPopup = null;
  }
  initializeMap();
  lastWarningTime = 0;
  worldTension = 0;
  const loaded = loadGameState();
  if (!loaded) {
    initializeRelationships();
  }
  const statsPanel = document.getElementById('stats-panel');
  statsPanel.style.display = 'none';
  window.addEventListener('resize', () => {
    const container = document.getElementById('container');
    const statsPanel = document.getElementById('stats-panel');
    const controlPanel = document.getElementById('control-panel');
    const countryHeader = document.querySelector('.country-header');
    if (container) {
      container.style.height = 'calc(100vh - 110px)';
      container.style.top = '110px';
    }
    if (statsPanel) {
      statsPanel.style.height = 'calc(100vh - 110px)';
    }
    if (controlPanel) {
      controlPanel.style.height = 'calc(100vh - 110px)';
    }
    if (countryHeader) {
      countryHeader.style.top = '60px';
      countryHeader.style.height = '50px';
    }
  });
});
function toggleStatsSidebar() {}
function toggleControlSidebar() {}
function updateProgressBars() {
  function setProgress(id, value) {
    document.getElementById(id).style.width = value + '%';
  }
  const gdp = parseFloat(document.getElementById('gdp').textContent.replace('$', '').replace('B', ''));
  const gdpMax = 5000;
  const gdpProgress = Math.min(100, Math.max(0, gdp / gdpMax * 100));
  setProgress('gdp-progress', gdpProgress);
  const military = parseInt(document.getElementById('military').textContent);
  setProgress('military-progress', military);
  setProgress('stability-progress', countryTraits.stability);
  setProgress('influence-progress', countryTraits.influence);
  setProgress('technology-progress', countryTraits.technology);
  document.querySelectorAll('.progress-bar div').forEach(bar => {
    bar.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  });
}
setInterval(updateProgressBars, 1000);
function showConfirmationPopup(title, message) {
  const popup = document.createElement('div');
  popup.className = 'confirmation-popup';
  popup.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      popup.remove();
    }, 300);
  }, 3000);
}
function handleCrisisEvents() {
  if (worldTension >= 85) {
    const crisisEvents = [{
      title: "Global Nuclear Standoff",
      effect: () => {
        worldTension += 25;
        const powers = ["United States", "Russia", "China"];
        powers.forEach(country => {
          if (relationships[country]) {
            Object.keys(relationships[country]).forEach(other => {
              relationships[country][other] = Math.min(relationships[country][other] - 30, -100);
            });
          }
        });
        addNewsItem("DEFCON ALERT: Multiple nuclear powers move to highest alert status!", "critical");
      }
    }, {
      title: "Worldwide Military Mobilization",
      effect: () => {
        worldTension += 20;
        Object.keys(relationships).forEach(country => {
          if (countryPower[country]) {
            countryPower[country].military = Math.max(0, countryPower[country].military - 30);
          }
        });
        addNewsItem("GLOBAL CRISIS: Nations worldwide begin full military mobilization!", "critical");
      }
    }];
    if (Math.random() < 0.15) {
      const crisis = crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
      crisis.effect();
      updateTraits();
      updateRank();
    }
  }
}
setInterval(handleCrisisEvents, 30000);
const gameTips = [{
  title: "Military Power",
  text: "Build up your military to protect your nation",
  action: "View Military",
  handler: () => openShop()
}, {
  title: "Form Alliances",
  text: "Creating alliances helps improve your global standing",
  action: "Find Allies",
  handler: () => formAlliance()
}, {
  title: "Economy",
  text: "Develop your economy to fund your nation's growth",
  action: "Open Shop",
  handler: () => openShop()
}, {
  title: "Expansion",
  text: "Expand your territory to increase your power",
  action: "Expand Now",
  handler: () => openExpansion()
}, {
  title: "Laws & Policies",
  text: "Enact laws to shape your nation's development",
  action: "View Laws",
  handler: () => openLaws()
}];
let activeTip = null;
let tipTimeout = null;
function showRandomTip() {
  if (activeTip) return;
  const tip = gameTips[Math.floor(Math.random() * gameTips.length)];
  const tipElement = document.createElement('div');
  tipElement.className = 'tip-container';
  tipElement.innerHTML = `
    <h3>${tip.title}</h3>
    <p>${tip.text}</p>
    <div class="tip-actions">
      <button onclick="handleTipAction(${gameTips.indexOf(tip)})">${tip.action}</button>
      <button class="dismiss" onclick="dismissTip()">Dismiss</button>
    </div>
  `;
  document.body.appendChild(tipElement);
  activeTip = tipElement;
  tipTimeout = setTimeout(() => {
    dismissTip();
  }, 8000);
}
function handleTipAction(tipIndex) {
  const tip = gameTips[tipIndex];
  dismissTip();
  tip.handler();
}
function dismissTip() {
  if (activeTip) {
    activeTip.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      activeTip.remove();
      activeTip = null;
    }, 300);
  }
  if (tipTimeout) {
    clearTimeout(tipTimeout);
    tipTimeout = null;
  }
}
setInterval(() => {
  if (Math.random() < 0.3) {
    showRandomTip();
  }
}, 300000);
const countryRanks = {
  SETTLEMENT: {
    threshold: 0,
    name: "Settlement",
    icon: "🏘️",
    benefits: ["Basic territory management", "Local governance"]
  },
  TRIBE: {
    threshold: 20,
    name: "Tribe",
    icon: "⛺",
    benefits: ["Cultural influence", "Resource gathering"]
  },
  KINGDOM: {
    threshold: 40,
    name: "Kingdom",
    icon: "👑",
    benefits: ["Royal authority", "Tax collection", "Military recruitment"]
  },
  EMPIRE: {
    threshold: 60,
    name: "Empire",
    icon: "🏛️",
    benefits: ["Multiple territories", "Advanced military", "Trade routes"]
  },
  EMPIRE_STATE: {
    threshold: 80,
    name: "Empire State",
    icon: "🌆",
    benefits: ["Global influence", "Advanced technology", "Economic dominance"]
  },
  SUPREME_COUNTRY: {
    threshold: 90,
    name: "Supreme Country",
    icon: "⚜️",
    benefits: ["Superpower status", "Nuclear capability", "Global leadership"]
  },
  WORLD_POWER: {
    threshold: 100,
    name: "World Power",
    icon: "🌍",
    benefits: ["Ultimate authority", "Unmatched military", "Economic supremacy"]
  }
};
function checkEmpireRestoration() {
  const possibleEmpires = {
    "Russia": {
      required: ["Ukraine", "Georgia"],
      name: "Russian Empire"
    },
    "United Kingdom": {
      required: ["England"],
      name: "British Empire"
    },
    "Turkey": {
      required: ["Georgia"],
      name: "Ottoman Empire"
    }
  };
  Object.keys(possibleEmpires).forEach(country => {
    if (!relationships[country]) {
      relationships[country] = {};
    }
    if (!countryPower[country]) {
      countryPower[country] = {
        influence: 50,
        military: Math.floor(Math.random() * 100),
        territory: Math.floor(Math.random() * 100),
        allies: 0
      };
    }
    if (!countryTraits[country]) {
      countryTraits[country] = {
        stability: 100,
        influence: 50,
        technology: 50
      };
    }
    if (possibleEmpires[country].required.every(req => relationships[country][req] && relationships[country][req] > 75)) {
      const empire = possibleEmpires[country];
      addNewsItem(`${empire.name} Restoration: ${country} has reunited historical territories!`, 'critical', `In a stunning geopolitical development, ${country} has successfully restored the ${empire.name} ` + `by reuniting with ${empire.required.join(' and ')}. This historic event marks a major shift in global power dynamics.`);
      worldTension += 25;
      countryPower[country].influence = 100;
      countryPower[country].territory += 50;
      countryTraits[country].stability += 20;
      countryTraits[country].influence += 30;
      empire.required.forEach(territory => {
        if (!relationships[territory]) {
          relationships[territory] = {};
        }
        Object.keys(relationships[territory]).forEach(other => {
          relationships[territory][other] = relationships[country][other];
        });
      });
    }
  });
}
