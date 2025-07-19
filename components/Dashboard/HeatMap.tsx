"use client";

import { MapContainer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import L from "leaflet";

// type MunicipalityFeature = {
//   type: string;
//   properties: {
//     kommunenr: string;
//     navn: string;
//   };
//   geometry: any;
// };

type DemandMap = {
  [kommunenr: string]: number;
};

export default function MedicationDemandMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const mapRef = useRef<L.Map>(null);
  const [open, setOpen] = useState(true);

  // Demand values per municipality (randomized between 100 and 1000)
  const demand: DemandMap = {
    "0301": Math.floor(Math.random() * 901) + 100,
    "1101": Math.floor(Math.random() * 901) + 100,
    "1103": Math.floor(Math.random() * 901) + 100,
    "1106": Math.floor(Math.random() * 901) + 100,
    "1108": Math.floor(Math.random() * 901) + 100,
    "1111": Math.floor(Math.random() * 901) + 100,
    "1112": Math.floor(Math.random() * 901) + 100,
    "1114": Math.floor(Math.random() * 901) + 100,
    "1119": Math.floor(Math.random() * 901) + 100,
    "1120": Math.floor(Math.random() * 901) + 100,
    "1121": Math.floor(Math.random() * 901) + 100,
    "1122": Math.floor(Math.random() * 901) + 100,
    "1124": Math.floor(Math.random() * 901) + 100,
    "1127": Math.floor(Math.random() * 901) + 100,
    "1130": Math.floor(Math.random() * 901) + 100,
    "1133": Math.floor(Math.random() * 901) + 100,
    "1134": Math.floor(Math.random() * 901) + 100,
    "1135": Math.floor(Math.random() * 901) + 100,
    "1144": Math.floor(Math.random() * 901) + 100,
    "1145": Math.floor(Math.random() * 901) + 100,
    "1146": Math.floor(Math.random() * 901) + 100,
    "1149": Math.floor(Math.random() * 901) + 100,
    "1151": Math.floor(Math.random() * 901) + 100,
    "1160": Math.floor(Math.random() * 901) + 100,
    "1505": Math.floor(Math.random() * 901) + 100,
    "1506": Math.floor(Math.random() * 901) + 100,
    "1508": Math.floor(Math.random() * 901) + 100,
    "1511": Math.floor(Math.random() * 901) + 100,
    "1514": Math.floor(Math.random() * 901) + 100,
    "1515": Math.floor(Math.random() * 901) + 100,
    "1516": Math.floor(Math.random() * 901) + 100,
    "1517": Math.floor(Math.random() * 901) + 100,
    "1520": Math.floor(Math.random() * 901) + 100,
    "1525": Math.floor(Math.random() * 901) + 100,
    "1528": Math.floor(Math.random() * 901) + 100,
    "1531": Math.floor(Math.random() * 901) + 100,
    "1532": Math.floor(Math.random() * 901) + 100,
    "1535": Math.floor(Math.random() * 901) + 100,
    "1539": Math.floor(Math.random() * 901) + 100,
    "1547": Math.floor(Math.random() * 901) + 100,
    "1554": Math.floor(Math.random() * 901) + 100,
    "1557": Math.floor(Math.random() * 901) + 100,
    "1560": Math.floor(Math.random() * 901) + 100,
    "1563": Math.floor(Math.random() * 901) + 100,
    "1566": Math.floor(Math.random() * 901) + 100,
    "1573": Math.floor(Math.random() * 901) + 100,
    "1576": Math.floor(Math.random() * 901) + 100,
    "1577": Math.floor(Math.random() * 901) + 100,
    "1578": Math.floor(Math.random() * 901) + 100,
    "1579": Math.floor(Math.random() * 901) + 100,
    "1580": Math.floor(Math.random() * 901) + 100,
    "1804": Math.floor(Math.random() * 901) + 100,
    "1806": Math.floor(Math.random() * 901) + 100,
    "1811": Math.floor(Math.random() * 901) + 100,
    "1812": Math.floor(Math.random() * 901) + 100,
    "1813": Math.floor(Math.random() * 901) + 100,
    "1815": Math.floor(Math.random() * 901) + 100,
    "1816": Math.floor(Math.random() * 901) + 100,
    "1818": Math.floor(Math.random() * 901) + 100,
    "1820": Math.floor(Math.random() * 901) + 100,
    "1822": Math.floor(Math.random() * 901) + 100,
    "1824": Math.floor(Math.random() * 901) + 100,
    "1825": Math.floor(Math.random() * 901) + 100,
    "1826": Math.floor(Math.random() * 901) + 100,
    "1827": Math.floor(Math.random() * 901) + 100,
    "1828": Math.floor(Math.random() * 901) + 100,
    "1832": Math.floor(Math.random() * 901) + 100,
    "1833": Math.floor(Math.random() * 901) + 100,
    "1834": Math.floor(Math.random() * 901) + 100,
    "1835": Math.floor(Math.random() * 901) + 100,
    "1836": Math.floor(Math.random() * 901) + 100,
    "1837": Math.floor(Math.random() * 901) + 100,
    "1838": Math.floor(Math.random() * 901) + 100,
    "1839": Math.floor(Math.random() * 901) + 100,
    "1840": Math.floor(Math.random() * 901) + 100,
    "1841": Math.floor(Math.random() * 901) + 100,
    "1845": Math.floor(Math.random() * 901) + 100,
    "1848": Math.floor(Math.random() * 901) + 100,
    "1851": Math.floor(Math.random() * 901) + 100,
    "1853": Math.floor(Math.random() * 901) + 100,
    "1856": Math.floor(Math.random() * 901) + 100,
    "1857": Math.floor(Math.random() * 901) + 100,
    "1859": Math.floor(Math.random() * 901) + 100,
    "1860": Math.floor(Math.random() * 901) + 100,
    "1865": Math.floor(Math.random() * 901) + 100,
    "1866": Math.floor(Math.random() * 901) + 100,
    "1867": Math.floor(Math.random() * 901) + 100,
    "1868": Math.floor(Math.random() * 901) + 100,
    "1870": Math.floor(Math.random() * 901) + 100,
    "1871": Math.floor(Math.random() * 901) + 100,
    "1874": Math.floor(Math.random() * 901) + 100,
    "1875": Math.floor(Math.random() * 901) + 100,
    "3101": Math.floor(Math.random() * 901) + 100,
    "3103": Math.floor(Math.random() * 901) + 100,
    "3105": Math.floor(Math.random() * 901) + 100,
    "3107": Math.floor(Math.random() * 901) + 100,
    "3110": Math.floor(Math.random() * 901) + 100,
    "3112": Math.floor(Math.random() * 901) + 100,
    "3114": Math.floor(Math.random() * 901) + 100,
    "3116": Math.floor(Math.random() * 901) + 100,
    "3118": Math.floor(Math.random() * 901) + 100,
    "3120": Math.floor(Math.random() * 901) + 100,
    "3122": Math.floor(Math.random() * 901) + 100,
    "3124": Math.floor(Math.random() * 901) + 100,
    "3201": Math.floor(Math.random() * 901) + 100,
    "3203": Math.floor(Math.random() * 901) + 100,
    "3205": Math.floor(Math.random() * 901) + 100,
    "3207": Math.floor(Math.random() * 901) + 100,
    "3209": Math.floor(Math.random() * 901) + 100,
    "3212": Math.floor(Math.random() * 901) + 100,
    "3214": Math.floor(Math.random() * 901) + 100,
    "3216": Math.floor(Math.random() * 901) + 100,
    "3218": Math.floor(Math.random() * 901) + 100,
    "3220": Math.floor(Math.random() * 901) + 100,
    "3222": Math.floor(Math.random() * 901) + 100,
    "3224": Math.floor(Math.random() * 901) + 100,
    "3226": Math.floor(Math.random() * 901) + 100,
    "3228": Math.floor(Math.random() * 901) + 100,
    "3230": Math.floor(Math.random() * 901) + 100,
    "3232": Math.floor(Math.random() * 901) + 100,
    "3234": Math.floor(Math.random() * 901) + 100,
    "3236": Math.floor(Math.random() * 901) + 100,
    "3238": Math.floor(Math.random() * 901) + 100,
    "3240": Math.floor(Math.random() * 901) + 100,
    "3242": Math.floor(Math.random() * 901) + 100,
    "3301": Math.floor(Math.random() * 901) + 100,
    "3303": Math.floor(Math.random() * 901) + 100,
    "3305": Math.floor(Math.random() * 901) + 100,
    "3310": Math.floor(Math.random() * 901) + 100,
    "3312": Math.floor(Math.random() * 901) + 100,
    "3314": Math.floor(Math.random() * 901) + 100,
    "3316": Math.floor(Math.random() * 901) + 100,
    "3318": Math.floor(Math.random() * 901) + 100,
    "3320": Math.floor(Math.random() * 901) + 100,
    "3322": Math.floor(Math.random() * 901) + 100,
    "3324": Math.floor(Math.random() * 901) + 100,
    "3326": Math.floor(Math.random() * 901) + 100,
    "3328": Math.floor(Math.random() * 901) + 100,
    "3330": Math.floor(Math.random() * 901) + 100,
    "3332": Math.floor(Math.random() * 901) + 100,
    "3334": Math.floor(Math.random() * 901) + 100,
    "3336": Math.floor(Math.random() * 901) + 100,
    "3338": Math.floor(Math.random() * 901) + 100,
    "3401": Math.floor(Math.random() * 901) + 100,
    "3403": Math.floor(Math.random() * 901) + 100,
    "3405": Math.floor(Math.random() * 901) + 100,
    "3407": Math.floor(Math.random() * 901) + 100,
    "3411": Math.floor(Math.random() * 901) + 100,
    "3412": Math.floor(Math.random() * 901) + 100,
    "3413": Math.floor(Math.random() * 901) + 100,
    "3414": Math.floor(Math.random() * 901) + 100,
    "3415": Math.floor(Math.random() * 901) + 100,
    "3416": Math.floor(Math.random() * 901) + 100,
    "3417": Math.floor(Math.random() * 901) + 100,
    "3418": Math.floor(Math.random() * 901) + 100,
    "3419": Math.floor(Math.random() * 901) + 100,
    "3420": Math.floor(Math.random() * 901) + 100,
    "3421": Math.floor(Math.random() * 901) + 100,
    "3422": Math.floor(Math.random() * 901) + 100,
    "3423": Math.floor(Math.random() * 901) + 100,
    "3424": Math.floor(Math.random() * 901) + 100,
    "3425": Math.floor(Math.random() * 901) + 100,
    "3426": Math.floor(Math.random() * 901) + 100,
    "3427": Math.floor(Math.random() * 901) + 100,
    "3428": Math.floor(Math.random() * 901) + 100,
    "3429": Math.floor(Math.random() * 901) + 100,
    "3430": Math.floor(Math.random() * 901) + 100,
    "3431": Math.floor(Math.random() * 901) + 100,
    "3432": Math.floor(Math.random() * 901) + 100,
    "3433": Math.floor(Math.random() * 901) + 100,
    "3434": Math.floor(Math.random() * 901) + 100,
    "3435": Math.floor(Math.random() * 901) + 100,
    "3436": Math.floor(Math.random() * 901) + 100,
    "3437": Math.floor(Math.random() * 901) + 100,
    "3438": Math.floor(Math.random() * 901) + 100,
    "3439": Math.floor(Math.random() * 901) + 100,
    "3440": Math.floor(Math.random() * 901) + 100,
    "3441": Math.floor(Math.random() * 901) + 100,
    "3442": Math.floor(Math.random() * 901) + 100,
    "3443": Math.floor(Math.random() * 901) + 100,
    "3446": Math.floor(Math.random() * 901) + 100,
    "3447": Math.floor(Math.random() * 901) + 100,
    "3448": Math.floor(Math.random() * 901) + 100,
    "3449": Math.floor(Math.random() * 901) + 100,
    "3450": Math.floor(Math.random() * 901) + 100,
    "3451": Math.floor(Math.random() * 901) + 100,
    "3452": Math.floor(Math.random() * 901) + 100,
    "3453": Math.floor(Math.random() * 901) + 100,
    "3454": Math.floor(Math.random() * 901) + 100,
    "3901": Math.floor(Math.random() * 901) + 100,
    "3903": Math.floor(Math.random() * 901) + 100,
    "3905": Math.floor(Math.random() * 901) + 100,
    "3907": Math.floor(Math.random() * 901) + 100,
    "3909": Math.floor(Math.random() * 901) + 100,
    "3911": Math.floor(Math.random() * 901) + 100,
    "4001": Math.floor(Math.random() * 901) + 100,
    "4003": Math.floor(Math.random() * 901) + 100,
    "4005": Math.floor(Math.random() * 901) + 100,
    "4010": Math.floor(Math.random() * 901) + 100,
    "4012": Math.floor(Math.random() * 901) + 100,
    "4014": Math.floor(Math.random() * 901) + 100,
    "4016": Math.floor(Math.random() * 901) + 100,
    "4018": Math.floor(Math.random() * 901) + 100,
    "4020": Math.floor(Math.random() * 901) + 100,
    "4022": Math.floor(Math.random() * 901) + 100,
    "4024": Math.floor(Math.random() * 901) + 100,
    "4026": Math.floor(Math.random() * 901) + 100,
    "4028": Math.floor(Math.random() * 901) + 100,
    "4030": Math.floor(Math.random() * 901) + 100,
    "4032": Math.floor(Math.random() * 901) + 100,
    "4034": Math.floor(Math.random() * 901) + 100,
    "4036": Math.floor(Math.random() * 901) + 100,
    "4201": Math.floor(Math.random() * 901) + 100,
    "4202": Math.floor(Math.random() * 901) + 100,
    "4203": Math.floor(Math.random() * 901) + 100,
    "4204": Math.floor(Math.random() * 901) + 100,
    "4205": Math.floor(Math.random() * 901) + 100,
    "4206": Math.floor(Math.random() * 901) + 100,
    "4207": Math.floor(Math.random() * 901) + 100,
    "4211": Math.floor(Math.random() * 901) + 100,
    "4212": Math.floor(Math.random() * 901) + 100,
    "4213": Math.floor(Math.random() * 901) + 100,
    "4214": Math.floor(Math.random() * 901) + 100,
    "4215": Math.floor(Math.random() * 901) + 100,
    "4216": Math.floor(Math.random() * 901) + 100,
    "4217": Math.floor(Math.random() * 901) + 100,
    "4218": Math.floor(Math.random() * 901) + 100,
    "4219": Math.floor(Math.random() * 901) + 100,
    "4220": Math.floor(Math.random() * 901) + 100,
    "4221": Math.floor(Math.random() * 901) + 100,
    "4222": Math.floor(Math.random() * 901) + 100,
    "4223": Math.floor(Math.random() * 901) + 100,
    "4224": Math.floor(Math.random() * 901) + 100,
    "4225": Math.floor(Math.random() * 901) + 100,
    "4226": Math.floor(Math.random() * 901) + 100,
    "4227": Math.floor(Math.random() * 901) + 100,
    "4228": Math.floor(Math.random() * 901) + 100,
    "4601": Math.floor(Math.random() * 901) + 100,
    "4602": Math.floor(Math.random() * 901) + 100,
    "4611": Math.floor(Math.random() * 901) + 100,
    "4612": Math.floor(Math.random() * 901) + 100,
    "4613": Math.floor(Math.random() * 901) + 100,
    "4614": Math.floor(Math.random() * 901) + 100,
    "4615": Math.floor(Math.random() * 901) + 100,
    "4616": Math.floor(Math.random() * 901) + 100,
    "4617": Math.floor(Math.random() * 901) + 100,
    "4618": Math.floor(Math.random() * 901) + 100,
    "4619": Math.floor(Math.random() * 901) + 100,
    "4620": Math.floor(Math.random() * 901) + 100,
    "4621": Math.floor(Math.random() * 901) + 100,
    "4622": Math.floor(Math.random() * 901) + 100,
    "4623": Math.floor(Math.random() * 901) + 100,
    "4624": Math.floor(Math.random() * 901) + 100,
    "4625": Math.floor(Math.random() * 901) + 100,
    "4626": Math.floor(Math.random() * 901) + 100,
    "4627": Math.floor(Math.random() * 901) + 100,
    "4628": Math.floor(Math.random() * 901) + 100,
    "4629": Math.floor(Math.random() * 901) + 100,
    "4630": Math.floor(Math.random() * 901) + 100,
    "4631": Math.floor(Math.random() * 901) + 100,
    "4632": Math.floor(Math.random() * 901) + 100,
    "4633": Math.floor(Math.random() * 901) + 100,
    "4634": Math.floor(Math.random() * 901) + 100,
    "4635": Math.floor(Math.random() * 901) + 100,
    "4636": Math.floor(Math.random() * 901) + 100,
    "4637": Math.floor(Math.random() * 901) + 100,
    "4638": Math.floor(Math.random() * 901) + 100,
    "4639": Math.floor(Math.random() * 901) + 100,
    "4640": Math.floor(Math.random() * 901) + 100,
    "4641": Math.floor(Math.random() * 901) + 100,
    "4642": Math.floor(Math.random() * 901) + 100,
    "4643": Math.floor(Math.random() * 901) + 100,
    "4644": Math.floor(Math.random() * 901) + 100,
    "4645": Math.floor(Math.random() * 901) + 100,
    "4646": Math.floor(Math.random() * 901) + 100,
    "4647": Math.floor(Math.random() * 901) + 100,
    "4648": Math.floor(Math.random() * 901) + 100,
    "4649": Math.floor(Math.random() * 901) + 100,
    "4650": Math.floor(Math.random() * 901) + 100,
    "4651": Math.floor(Math.random() * 901) + 100,
    "5001": Math.floor(Math.random() * 901) + 100,
    "5006": Math.floor(Math.random() * 901) + 100,
    "5007": Math.floor(Math.random() * 901) + 100,
    "5014": Math.floor(Math.random() * 901) + 100,
    "5020": Math.floor(Math.random() * 901) + 100,
    "5021": Math.floor(Math.random() * 901) + 100,
    "5022": Math.floor(Math.random() * 901) + 100,
    "5025": Math.floor(Math.random() * 901) + 100,
    "5026": Math.floor(Math.random() * 901) + 100,
    "5027": Math.floor(Math.random() * 901) + 100,
    "5028": Math.floor(Math.random() * 901) + 100,
    "5029": Math.floor(Math.random() * 901) + 100,
    "5031": Math.floor(Math.random() * 901) + 100,
    "5032": Math.floor(Math.random() * 901) + 100,
    "5033": Math.floor(Math.random() * 901) + 100,
    "5034": Math.floor(Math.random() * 901) + 100,
    "5035": Math.floor(Math.random() * 901) + 100,
    "5036": Math.floor(Math.random() * 901) + 100,
    "5037": Math.floor(Math.random() * 901) + 100,
    "5038": Math.floor(Math.random() * 901) + 100,
    "5041": Math.floor(Math.random() * 901) + 100,
    "5042": Math.floor(Math.random() * 901) + 100,
    "5043": Math.floor(Math.random() * 901) + 100,
    "5044": Math.floor(Math.random() * 901) + 100,
    "5045": Math.floor(Math.random() * 901) + 100,
    "5046": Math.floor(Math.random() * 901) + 100,
    "5047": Math.floor(Math.random() * 901) + 100,
    "5049": Math.floor(Math.random() * 901) + 100,
    "5052": Math.floor(Math.random() * 901) + 100,
    "5053": Math.floor(Math.random() * 901) + 100,
    "5054": Math.floor(Math.random() * 901) + 100,
    "5055": Math.floor(Math.random() * 901) + 100,
    "5056": Math.floor(Math.random() * 901) + 100,
    "5057": Math.floor(Math.random() * 901) + 100,
    "5058": Math.floor(Math.random() * 901) + 100,
    "5059": Math.floor(Math.random() * 901) + 100,
    "5060": Math.floor(Math.random() * 901) + 100,
    "5061": Math.floor(Math.random() * 901) + 100,
    "5501": Math.floor(Math.random() * 901) + 100,
    "5503": Math.floor(Math.random() * 901) + 100,
    "5510": Math.floor(Math.random() * 901) + 100,
    "5512": Math.floor(Math.random() * 901) + 100,
    "5514": Math.floor(Math.random() * 901) + 100,
    "5516": Math.floor(Math.random() * 901) + 100,
    "5518": Math.floor(Math.random() * 901) + 100,
    "5520": Math.floor(Math.random() * 901) + 100,
    "5522": Math.floor(Math.random() * 901) + 100,
    "5524": Math.floor(Math.random() * 901) + 100,
    "5526": Math.floor(Math.random() * 901) + 100,
    "5528": Math.floor(Math.random() * 901) + 100,
    "5530": Math.floor(Math.random() * 901) + 100,
    "5532": Math.floor(Math.random() * 901) + 100,
    "5534": Math.floor(Math.random() * 901) + 100,
    "5536": Math.floor(Math.random() * 901) + 100,
    "5538": Math.floor(Math.random() * 901) + 100,
    "5540": Math.floor(Math.random() * 901) + 100,
    "5542": Math.floor(Math.random() * 901) + 100,
    "5544": Math.floor(Math.random() * 901) + 100,
    "5546": Math.floor(Math.random() * 901) + 100,
    "5601": Math.floor(Math.random() * 901) + 100,
    "5603": Math.floor(Math.random() * 901) + 100,
    "5605": Math.floor(Math.random() * 901) + 100,
    "5607": Math.floor(Math.random() * 901) + 100,
    "5610": Math.floor(Math.random() * 901) + 100,
    "5612": Math.floor(Math.random() * 901) + 100,
    "5614": Math.floor(Math.random() * 901) + 100,
    "5616": Math.floor(Math.random() * 901) + 100,
    "5618": Math.floor(Math.random() * 901) + 100,
    "5620": Math.floor(Math.random() * 901) + 100,
    "5622": Math.floor(Math.random() * 901) + 100,
    "5624": Math.floor(Math.random() * 901) + 100,
    "5626": Math.floor(Math.random() * 901) + 100,
    "5628": Math.floor(Math.random() * 901) + 100,
    "5630": Math.floor(Math.random() * 901) + 100,
    "5632": Math.floor(Math.random() * 901) + 100,
    "5634": Math.floor(Math.random() * 901) + 100,
    "5636": Math.floor(Math.random() * 901) + 100,
    "9999": Math.floor(Math.random() * 901) + 100,
  };
  const top10Increases = [
    { kommunenavn: "Oslo", increase: 320 },
    { kommunenavn: "Stavanger", increase: 280 },
    { kommunenavn: "Sandnes", increase: 250 },
    { kommunenavn: "Bergen", increase: 230 },
    { kommunenavn: "Trondheim", increase: 220 },
    { kommunenavn: "Tromsø", increase: 200 },
    { kommunenavn: "Kristiansand", increase: 180 },
    { kommunenavn: "Drammen", increase: 170 },
    { kommunenavn: "Fredrikstad", increase: 150 },
    { kommunenavn: "Porsgrunn", increase: 140 },
  ];

  // Fetch filtered municipalities GeoJSON
  useEffect(() => {
    fetch("/Kommuner-M.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });
  }, []);

  // Zoom to bounds after geoData is loaded
  useEffect(() => {
    if (geoData && mapRef.current) {
      const bounds = L.geoJSON(geoData).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoData]);

  // Log geoData changes
  useEffect(() => {
    if (geoData) {
      console.log("GeoData fetched:", geoData);
    }
  }, [geoData]);

  // Color scale for demand
  const getColor = (value: number) => {
    return value > 800
      ? "#800026"
      : value > 600
      ? "#BD0026"
      : value > 400
      ? "#E31A1C"
      : value > 200
      ? "#FC4E2A"
      : value > 0
      ? "#FD8D3C"
      : "#FFEDA0";
  };

  const style = (feature: any) => {
    const kommunenr = feature?.properties?.kommunenummer ?? "";
    const val = demand[kommunenr] || 0;
    return {
      fillColor: getColor(val),
      weight: 1,
      opacity: 1,
      color: "#999",
      fillOpacity: 0.85,
    };
  };

  return (
    <div className="relative">
      <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          ref={mapRef}
          center={[63.43, 10.39]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          attributionControl={false}
        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={style}
              onEachFeature={(feature: any, layer: L.Layer) => {
                const kommunenr = feature?.properties?.kommunenummer ?? "";
                const navn = feature?.properties?.kommunenavn ?? "";
                const val = demand[kommunenr] || "N/A";
                layer.bindTooltip(
                  `<div class="p-2">
                    <div class="font-semibold text-gray-900">${navn}</div>
                    <div class="text-sm text-gray-600">Demand: <span class="font-medium">${val}</span></div>
                  </div>`,
                  {
                    sticky: true,
                    className: "custom-tooltip",
                  }
                );
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-max">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Demand Level
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#FFEDA0" }}
            ></div>
            <span>0</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#FD8D3C" }}
            ></div>
            <span>1 - 200</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#FC4E2A" }}
            ></div>
            <span>201 - 400</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#E31A1C" }}
            ></div>
            <span>401 - 600</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#BD0026" }}
            ></div>
            <span>601 - 800</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ background: "#800026" }}
            ></div>
            <span>801+</span>
          </div>
        </div>
      </div>

      {/* Top 10 Increases Panel */}
      <div className="absolute top-4 right-4 max-w-xs w-64">
        <button
          onClick={() => setOpen(!open)}
          className="mb-2 w-full bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          aria-expanded={open}
          aria-controls="top10-panel"
        >
          <span>🔺 Top 10 Demand Increases</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <div
            id="top10-panel"
            className="bg-white p-4 rounded-lg shadow-md border text-sm text-gray-700"
          >
            <ul className="space-y-1">
              {top10Increases.map((item, idx) => (
                <li key={item.kommunenavn} className="flex justify-between">
                  <span>
                    {idx + 1}. {item.kommunenavn}
                  </span>
                  <span className="text-green-600 font-medium">
                    +{item.increase}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
