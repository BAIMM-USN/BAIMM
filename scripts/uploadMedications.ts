import { db } from "../lib/firebase.js";
import { firebaseMedications } from "../Data/mockData.js";
import { collection, doc, setDoc } from "firebase/firestore";
import { medications } from "../Data/mockData.js";

// Municipality type
type Municipality = {
  id: string;
  name: string;
};

// Medication type (from your mockData)
type Medication = {
  id: string;
  name: string;
  category: string;
  description: string;
};

type Prediction = {
  medicationId: string;
  municipalityId: string;
  periodType: "weekly" | "monthly";
  date: string;
  y: number;
  label: string;
  weekNumber?: number;
  monthNumber?: number;
  confidence: number;
  weatherParams: { temperature: number; humidity: number };
  createdAt: string;
};
// interface Prediction {
//   medicationId: string;
//   municipalityId: string;
//   periodType: "weekly" | "monthly";
//   weekNumber?: number;
//   monthNumber?: number;
//   predictedValue: number;
//   date?: string; // Optional, used for weekly/monthly
// }

// Municipality list parsed from provided data
const municipalities: Municipality[] = [
  { id: "4216", name: "Birkenes" },
  { id: "5053", name: "Inderøy" },
  { id: "3440", name: "Øyer" },
  { id: "4014", name: "Kragerø" },
  { id: "4226", name: "Hægebostad" },
  { id: "5514", name: "Ibestad" },
  { id: "4020", name: "Midt-Telemark" },
  { id: "5614", name: "Loppa" },
  { id: "3416", name: "Eidskog" },
  { id: "5060", name: "Nærøysund" },
  { id: "4003", name: "Skien" },
  { id: "1134", name: "Suldal" },
  { id: "1121", name: "Time" },
  { id: "4639", name: "Vik" },
  { id: "4211", name: "Gjerstad" },
  { id: "3424", name: "Rendalen" },
  { id: "1812", name: "Sømna" },
  { id: "3434", name: "Lom" },
  { id: "3403", name: "Hamar" },
  { id: "3414", name: "Nord-Odal" },
  { id: "5045", name: "Grong" },
  { id: "3433", name: "Skjåk" },
  { id: "3453", name: "Øystre Slidre" },
  { id: "1813", name: "Brønnøy" },
  { id: "5036", name: "Frosta" },
  { id: "1515", name: "Herøy" },
  { id: "3401", name: "Kongsvinger" },
  { id: "5042", name: "Lierne" },
  { id: "4205", name: "Lindesnes" },
  { id: "4630", name: "Osterøy" },
  { id: "4646", name: "Fjaler" },
  { id: "4005", name: "Notodden" },
  { id: "5029", name: "Skaun" },
  { id: "3324", name: "Gol" },
  { id: "1815", name: "Vega" },
  { id: "4223", name: "Vennesla" },
  { id: "1840", name: "Saltdal" },
  { id: "3120", name: "Rakkestad" },
  { id: "3220", name: "Enebakk" },
  { id: "4212", name: "Vegårshei" },
  { id: "4012", name: "Bamble" },
  { id: "3207", name: "Nordre Follo" },
  { id: "5528", name: "Dyrøy" },
  { id: "1825", name: "Grane" },
  { id: "3443", name: "Vestre Toten" },
  { id: "5035", name: "Stjørdal" },
  { id: "3222", name: "Lørenskog" },
  { id: "1866", name: "Hadsel" },
  { id: "4627", name: "Askøy" },
  { id: "5544", name: "Nordreisa - Ráisa - Raisi" },
  { id: "3124", name: "Aremark" },
  { id: "3405", name: "Lillehammer" },
  { id: "0301", name: "Oslo" },
  { id: "5022", name: "Rennebu" },
  { id: "4222", name: "Bykle" },
  { id: "5510", name: "Kvæfjord" },
  { id: "5032", name: "Selbu" },
  { id: "3428", name: "Alvdal" },
  { id: "4024", name: "Hjartdal" },
  { id: "3310", name: "Hole" },
  { id: "3216", name: "Vestby" },
  { id: "1875", name: "Hábmer - Hamarøy" },
  { id: "5536", name: "Lyngen" },
  { id: "5047", name: "Overhalla" },
  { id: "3438", name: "Sør-Fron" },
  { id: "1133", name: "Hjelmeland" },
  { id: "1580", name: "Haram" },
  { id: "1573", name: "Smøla" },
  { id: "5043", name: "Raarvihke - Røyrvik" },
  { id: "1146", name: "Tysvær" },
  { id: "4641", name: "Aurland" },
  { id: "4619", name: "Eidfjord" },
  { id: "3420", name: "Elverum" },
  { id: "3911", name: "Færder" },
  { id: "1874", name: "Moskenes" },
  { id: "1535", name: "Vestnes" },
  { id: "3418", name: "Åsnes" },
  { id: "1833", name: "Rana" },
  { id: "1560", name: "Tingvoll" },
  { id: "4202", name: "Grimstad" },
  { id: "1517", name: "Hareid" },
  { id: "3454", name: "Vang" },
  { id: "5054", name: "Indre Fosen" },
  { id: "1539", name: "Rauma" },
  { id: "1108", name: "Sandnes" },
  { id: "4224", name: "Åseral" },
  { id: "4016", name: "Drangedal" },
  { id: "3417", name: "Grue" },
  { id: "4647", name: "Sunnfjord" },
  { id: "1506", name: "Molde" },
  { id: "3238", name: "Nannestad" },
  { id: "4034", name: "Tokke" },
  { id: "1837", name: "Meløy" },
  { id: "3431", name: "Dovre" },
  { id: "1853", name: "Evenes - Evenášši" },
  { id: "5021", name: "Oppdal" },
  { id: "1818", name: "Herøy" },
  { id: "5027", name: "Midtre Gauldal" },
  { id: "5046", name: "Høylandet" },
  { id: "1111", name: "Sokndal" },
  { id: "3332", name: "Sigdal" },
  { id: "5020", name: "Osen" },
  { id: "4618", name: "Ullensvang" },
  { id: "5636", name: "Unjárga - Nesseby" },
  { id: "3203", name: "Asker" },
  { id: "4624", name: "Bjørnafjorden" },
  { id: "5526", name: "Sørreisa" },
  { id: "4602", name: "Kinn" },
  { id: "4633", name: "Fedje" },
  { id: "3103", name: "Moss" },
  { id: "3426", name: "Tolga" },
  { id: "4644", name: "Luster" },
  { id: "4220", name: "Bygland" },
  { id: "1822", name: "Leirfjord" },
  { id: "5025", name: "Rosse - Røros" },
  { id: "3214", name: "Frogn" },
  { id: "5518", name: "Loabák - Lavangen" },
  { id: "4018", name: "Nome" },
  { id: "5503", name: "Harstad - Hárstták" },
  { id: "1856", name: "Røst" },
  { id: "5061", name: "Rindal" },
  { id: "3909", name: "Larvik" },
  { id: "1834", name: "Lurøy" },
  { id: "1124", name: "Sola" },
  { id: "4001", name: "Porsgrunn" },
  { id: "1122", name: "Gjesdal" },
  { id: "4218", name: "Iveland" },
  { id: "3114", name: "Våler" },
  { id: "5516", name: "Gratangen" },
  { id: "4651", name: "Stryn" },
  { id: "3110", name: "Hvaler" },
  { id: "4634", name: "Masfjorden" },
  { id: "3413", name: "Stange" },
  { id: "4650", name: "Gloppen" },
  { id: "3441", name: "Gausdal" },
  { id: "4601", name: "Bergen" },
  { id: "1857", name: "Værøy" },
  { id: "1514", name: "Sande" },
  { id: "3312", name: "Lier" },
  { id: "5603", name: "Hammerfest - Hámmerfeasta" },
  { id: "5057", name: "Ørland" },
  { id: "5055", name: "Heim" },
  { id: "1820", name: "Alstahaug" },
  { id: "5059", name: "Orkland" },
  { id: "4613", name: "Bømlo" },
  { id: "3422", name: "Åmot" },
  { id: "5006", name: "Steinkjer" },
  { id: "1827", name: "Dønna" },
  { id: "5501", name: "Tromsø" },
  { id: "3407", name: "Gjøvik" },
  { id: "4642", name: "Lærdal" },
  { id: "1806", name: "Narvik" },
  { id: "4623", name: "Samnanger" },
  { id: "3905", name: "Tønsberg" },
  { id: "3437", name: "Sel" },
  { id: "3446", name: "Gran" },
  { id: "3435", name: "Vågå" },
  { id: "5601", name: "Alta" },
  { id: "4637", name: "Hyllestad" },
  { id: "1151", name: "Utsira" },
  { id: "3450", name: "Etnedal" },
  { id: "5001", name: "Trondheim - Tråante" },
  { id: "1804", name: "Bodø" },
  { id: "3316", name: "Modum" },
  { id: "3427", name: "Tynset" },
  { id: "3318", name: "Krødsherad" },
  { id: "4632", name: "Austrheim" },
  { id: "1505", name: "Kristiansund" },
  { id: "1516", name: "Ulstein" },
  { id: "1547", name: "Aukra" },
  { id: "3448", name: "Nordre Land" },
  { id: "3328", name: "Ål" },
  { id: "1838", name: "Gildeskål" },
  { id: "4221", name: "Valle" },
  { id: "1120", name: "Klepp" },
  { id: "5028", name: "Melhus" },
  { id: "3447", name: "Søndre Land" },
  { id: "1577", name: "Volda" },
  { id: "5056", name: "Hitra" },
  { id: "1145", name: "Bokn" },
  { id: "3212", name: "Nesodden" },
  { id: "5524", name: "Målselv" },
  { id: "3205", name: "Lillestrøm" },
  { id: "1824", name: "Vefsn" },
  { id: "5538", name: "Storfjord - Omasvuotna - Omasvuono" },
  { id: "1845", name: "Sørfold" },
  { id: "3449", name: "Sør-Aurdal" },
  { id: "1826", name: "Aarborte - Hattfjelldal" },
  { id: "1103", name: "Stavanger" },
  { id: "5632", name: "Båtsfjord" },
  { id: "4621", name: "Voss" },
  { id: "4207", name: "Flekkefjord" },
  { id: "3234", name: "Lunner" },
  { id: "3240", name: "Eidsvoll" },
  { id: "1870", name: "Sortland - Suortá" },
  { id: "1528", name: "Sykkylven" },
  { id: "3334", name: "Flesberg" },
  { id: "4645", name: "Askvoll" },
  { id: "4638", name: "Høyanger" },
  { id: "4219", name: "Evje og Hornnes" },
  { id: "4213", name: "Tvedestrand" },
  { id: "5624", name: "Lebesby" },
  { id: "3336", name: "Rollag" },
  { id: "1531", name: "Sula" },
  { id: "3322", name: "Nesbyen" },
  { id: "4649", name: "Stad" },
  { id: "1566", name: "Surnadal" },
  { id: "1860", name: "Vestvågøy" },
  { id: "1106", name: "Haugesund" },
  { id: "3320", name: "Flå" },
  { id: "5626", name: "Gamvik" },
  { id: "3423", name: "Stor-Elvdal" },
  { id: "1576", name: "Aure" },
  { id: "3301", name: "Drammen" },
  { id: "1839", name: "Beiarn" },
  { id: "4614", name: "Stord" },
  { id: "5532", name: "Balsfjord" },
  { id: "5007", name: "Namsos - Nåavmesjenjaelmie" },
  { id: "3224", name: "Rælingen" },
  { id: "1130", name: "Strand" },
  { id: "5037", name: "Levanger" },
  { id: "5041", name: "Snåase - Snåsa" },
  { id: "1578", name: "Fjord" },
  { id: "1557", name: "Gjemnes" },
  { id: "3101", name: "Halden" },
  { id: "4640", name: "Sogndal" },
  { id: "1828", name: "Nesna" },
  { id: "3419", name: "Våler" },
  { id: "4204", name: "Kristiansand" },
  { id: "4036", name: "Vinje" },
  { id: "3326", name: "Hemsedal" },
  { id: "3242", name: "Hurdal" },
  { id: "3303", name: "Kongsberg" },
  { id: "5038", name: "Verdal" },
  { id: "3452", name: "Vestre Slidre" },
  { id: "5622", name: "Porsanger - Porsáŋgu - Porsanki" },
  { id: "5610", name: "Kárášjohka - Karasjok" },
  { id: "3907", name: "Sandefjord" },
  { id: "4636", name: "Solund" },
  { id: "1865", name: "Vågan" },
  { id: "5620", name: "Nordkapp" },
  { id: "4615", name: "Fitjar" },
  { id: "5616", name: "Hasvik" },
  { id: "1144", name: "Kvitsøy" },
  { id: "1848", name: "Steigen" },
  { id: "3429", name: "Folldal" },
  { id: "4635", name: "Gulen" },
  { id: "3107", name: "Fredrikstad" },
  { id: "1859", name: "Flakstad" },
  { id: "4217", name: "Åmli" },
  { id: "1149", name: "Karmøy" },
  { id: "3116", name: "Skiptvet" },
  { id: "5634", name: "Vardø" },
  { id: "4228", name: "Sirdal" },
  { id: "5033", name: "Tydal" },
  { id: "4620", name: "Ulvik" },
  { id: "1832", name: "Hemnes" },
  { id: "3122", name: "Marker" },
  { id: "4612", name: "Sveio" },
  { id: "4227", name: "Kvinesdal" },
  { id: "5630", name: "Berlevåg" },
  { id: "3430", name: "Os" },
  { id: "1835", name: "Træna" },
  { id: "1127", name: "Randaberg" },
  { id: "4625", name: "Austevoll" },
  { id: "3201", name: "Bærum" },
  { id: "4030", name: "Nissedal" },
  { id: "3439", name: "Ringebu" },
  { id: "1114", name: "Bjerkreim" },
  { id: "5058", name: "Åfjord" },
  { id: "1520", name: "Ørsta" },
  { id: "4206", name: "Farsund" },
  { id: "3236", name: "Jevnaker" },
  { id: "3228", name: "Nes" },
  { id: "5540", name: "Gáivuotna - Kåfjord - Kaivuono" },
  { id: "3209", name: "Ullensaker" },
  { id: "4203", name: "Arendal" },
  { id: "3112", name: "Råde" },
  { id: "1851", name: "Lødingen" },
  { id: "5034", name: "Meråker" },
  { id: "1112", name: "Lund" },
  { id: "3425", name: "Engerdal" },
  { id: "4214", name: "Froland" },
  { id: "1119", name: "Hå" },
  { id: "3105", name: "Sarpsborg" },
  { id: "1868", name: "Øksnes" },
  { id: "4026", name: "Tinn" },
  { id: "4626", name: "Øygarden" },
  { id: "5520", name: "Bardu" },
  { id: "4631", name: "Alver" },
  { id: "3118", name: "Indre Østfold" },
  { id: "5607", name: "Vadsø" },
  { id: "4629", name: "Modalen" },
  { id: "3436", name: "Nord-Fron" },
  { id: "5530", name: "Senja" },
  { id: "4225", name: "Lyngdal" },
  { id: "4028", name: "Kviteseid" },
  { id: "4201", name: "Risør" },
  { id: "5049", name: "Flatanger" },
  { id: "3451", name: "Nord-Aurdal" },
  { id: "5605", name: "Sør-Varanger" },
  { id: "3412", name: "Løten" },
  { id: "5044", name: "Namsskogan" },
  { id: "3442", name: "Østre Toten" },
  { id: "5618", name: "Måsøy" },
  { id: "1836", name: "Rødøy" },
  { id: "5628", name: "Deatnu - Tana" },
  { id: "3901", name: "Horten" },
  { id: "5014", name: "Frøya" },
  { id: "5522", name: "Salangen" },
  { id: "4010", name: "Siljan" },
  { id: "1841", name: "Fauske - Fuossko" },
  { id: "3314", name: "Øvre Eiker" },
  { id: "1511", name: "Vanylven" },
  { id: "5546", name: "Kvænangen" },
  { id: "4622", name: "Kvam" },
  { id: "3230", name: "Gjerdrum" },
  { id: "1867", name: "Bø" },
  { id: "5026", name: "Holtålen" },
  { id: "3415", name: "Sør-Odal" },
  { id: "3432", name: "Lesja" },
  { id: "3338", name: "Nore og Uvdal" },
  { id: "1563", name: "Sunndal" },
  { id: "1525", name: "Stranda" },
  { id: "1554", name: "Averøy" },
  { id: "4628", name: "Vaksdal" },
  { id: "1579", name: "Hustadvika" },
  { id: "4022", name: "Seljord" },
  { id: "3411", name: "Ringsaker" },
  { id: "5612", name: "Guovdageaidnu - Kautokeino" },
  { id: "5534", name: "Karlsøy" },
  { id: "3218", name: "Ås" },
  { id: "1508", name: "Ålesund" },
  { id: "3226", name: "Aurskog-Høland" },
  { id: "4617", name: "Kvinnherad" },
  { id: "1811", name: "Bindal" },
  { id: "1532", name: "Giske" },
  { id: "3903", name: "Holmestrand" },
  { id: "4648", name: "Bremanger" },
  { id: "3232", name: "Nittedal" },
  { id: "5542", name: "Skjervøy" },
  { id: "1101", name: "Eigersund" },
  { id: "4032", name: "Fyresdal" },
  { id: "4616", name: "Tysnes" },
  { id: "1816", name: "Vevelstad" },
  { id: "1160", name: "Vindafjord" },
  { id: "4611", name: "Etne" },
  { id: "5031", name: "Malvik" },
  { id: "1135", name: "Sauda" },
  { id: "3421", name: "Trysil" },
  { id: "5052", name: "Leka" },
  { id: "4215", name: "Lillesand" },
  { id: "3305", name: "Ringerike" },
  { id: "5512", name: "Dielddanuorri - Tjeldsund" },
  { id: "4643", name: "Årdal" },
  { id: "3330", name: "Hol" },
  { id: "1871", name: "Andøy" },
];

// Helper to get a random integer in a range
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get a random float in a range
function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate weekly prediction data (at least 4 weeks)
function generateWeeklyData(
  medicationId: string,
  municipalityId: string,
  startDate: Date
): Prediction[] {
  const data: Prediction[] = [];
  let date = new Date(startDate);
  for (let i = 0; i < 4; i++) {
    // 4 weeks
    const weekNumber = i + 1;
    const y = randInt(800, 1800);
    const confidence = randInt(80, 99);
    const temperature = randFloat(10, 25);
    const humidity = randInt(40, 80);
    data.push({
      medicationId,
      municipalityId,
      periodType: "weekly",
      date: date.toISOString().slice(0, 10),
      y,
      label: `Week ${weekNumber}`,
      weekNumber,
      confidence,
      weatherParams: { temperature, humidity },
      createdAt: new Date().toISOString(),
    });
    date.setDate(date.getDate() + 7);
  }
  return data;
}

// Generate monthly prediction data (at least 4 months)
function generateMonthlyData(
  medicationId: string,
  municipalityId: string,
  startDate: Date
): Prediction[] {
  const data: Prediction[] = [];
  let date = new Date(startDate);
  for (let i = 0; i < 4; i++) {
    // 4 months
    const monthNumber = i + 1;
    const y = randInt(4000, 9000);
    const confidence = randInt(80, 99);
    const temperature = randFloat(10, 25);
    const humidity = randInt(40, 80);
    data.push({
      medicationId,
      municipalityId,
      periodType: "monthly",
      date: date.toISOString().slice(0, 10),
      y,
      label: `Month ${monthNumber}`,
      monthNumber,
      confidence,
      weatherParams: { temperature, humidity },
      createdAt: new Date().toISOString(),
    });
    date.setMonth(date.getMonth() + 1);
  }
  return data;
}

async function uploadMunicipalities() {
  try {
    await Promise.all(
      municipalities.map((mun) =>
        setDoc(doc(collection(db, "municipalities"), mun.id), mun)
      )
    );
    console.log("Municipalities uploaded successfully.");
  } catch (error) {
    console.error("Error uploading municipalities:", error);
  }
}

async function uploadPredictions() {
  try {
    const allPredictions: Prediction[] = [];

    medications.forEach((med) => {
      municipalities.forEach((mun) => {
        const weeklyData: Prediction[] = Array.from({ length: 4 }, (_, i) => ({
          medicationId: med.id,
          municipalityId: mun.id,
          periodType: "weekly",
          weekNumber: i + 1,
          date: new Date().toISOString(),
          y: parseFloat((Math.random() * 100).toFixed(2)),
          label: `Week ${i + 1}`,
          confidence: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)), // e.g. 0.8–1.0
          weatherParams: {
            temperature: parseFloat((Math.random() * 15 + 10).toFixed(2)), // 10–25°C
            humidity: parseFloat((Math.random() * 50 + 30).toFixed(2)), // 30–80%
          },
          createdAt: new Date().toISOString(),
        }));

        const monthlyData: Prediction[] = Array.from({ length: 3 }, (_, i) => ({
          medicationId: med.id,
          municipalityId: mun.id,
          periodType: "monthly",
          monthNumber: i + 1,
          date: new Date().toISOString(),
          y: parseFloat((Math.random() * 500).toFixed(2)),
          label: `Month ${i + 1}`,
          confidence: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)), // 0.8–1.0
          weatherParams: {
            temperature: parseFloat((Math.random() * 15 + 10).toFixed(2)), // 10–25°C
            humidity: parseFloat((Math.random() * 50 + 30).toFixed(2)), // 30–80%
          },
          createdAt: new Date().toISOString(),
        }));

        allPredictions.push(...weeklyData, ...monthlyData);
      });
    });

    const batchUploads = allPredictions.map((pred) => {
      const docId = [
        pred.medicationId,
        pred.municipalityId,
        pred.periodType,
        pred.periodType === "weekly" ? pred.weekNumber : pred.monthNumber,
      ].join("_");

      return setDoc(doc(collection(db, "predictions"), docId), pred);
    });

    await Promise.all(batchUploads);
    console.log("Predictions uploaded successfully.");
  } catch (error) {
    console.error("Error uploading predictions:", error);
  }
}

uploadMunicipalities()
  .then(() => uploadPredictions())
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
