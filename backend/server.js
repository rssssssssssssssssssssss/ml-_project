const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const TRANSLATE_SERVICE_URL = process.env.TRANSLATE_SERVICE_URL || 'http://localhost:8000';
const DEFAULT_MODEL = 'qwen2.5:7b';

app.use(cors());
app.use(express.json());

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200 Megabytes upload limit
});

// Load Dataset database
let dataset = [];
try {
  const dataPath = path.join(__dirname, 'data', 'dataset.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  dataset = JSON.parse(rawData);
  console.log(`[Database] Loaded ${dataset.length} pre-existing document chunks.`);
} catch (error) {
  console.error('[Database] Warning loading dataset.json:', error.message);
}

// ---------------------------------------------------------------------
// 1. TEXT PROCESSING & RAG CORE ENGINE
// ---------------------------------------------------------------------

// Sliding window text chunker
function chunkText(text, size = 600, overlap = 120) {
  const chunks = [];
  let start = 0;
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  while (start < cleanText.length) {
    let end = start + size;
    if (end < cleanText.length) {
      const lastSpace = cleanText.lastIndexOf(' ', end);
      if (lastSpace > start + size - 150) {
        end = lastSpace;
      }
    }
    const chunkContent = cleanText.substring(start, end).trim();
    if (chunkContent.length > 40) {
      chunks.push(chunkContent);
    }
    start = end - overlap;
  }
  return chunks;
}

// Keyword tag generator
function generateTags(text, filename) {
  const stopwords = ['about', 'their', 'there', 'would', 'could', 'should', 'these', 'those', 'under', 'after', 'before', 'where', 'which', 'other', 'safety', 'standard', 'manual', 'policy', 'guide'];
  const cleanWords = text.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopwords.includes(w));
    
  const counts = {};
  cleanWords.forEach(w => {
    counts[w] = (counts[w] || 0) + 1;
  });
  
  const sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);
  const docBase = filename.toLowerCase().replace('.pdf', '').split(/[_\s-]/);
  
  return [...new Set([...docBase, ...sorted.slice(0, 5)])].slice(0, 8);
}

// Local semantic scoring matcher
function retrieveChunks(dataset, query, limit = 3) {
  if (!query) return [];
  const queryTerms = query.toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1);
  
  if (queryTerms.length === 0) return [];
  
  const scoredChunks = dataset.map(chunk => {
    let score = 0;
    chunk.tags.forEach(tag => {
      queryTerms.forEach(term => {
        if (tag.toLowerCase().includes(term) || term.includes(tag.toLowerCase())) {
          score += 6;
        }
      });
    });
    queryTerms.forEach(term => {
      if (chunk.title.toLowerCase().includes(term)) {
        score += 4;
      }
    });
    queryTerms.forEach(term => {
      if (chunk.content.toLowerCase().includes(term)) {
        score += 2;
      }
      const regex = new RegExp(term, 'gi');
      const matches = chunk.content.match(regex);
      if (matches) {
        score += matches.length * 0.5;
      }
    });
    return { ...chunk, score };
  });
  
  return scoredChunks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => {
      const maxPossibleScore = 40;
      const confidence = Math.min(Math.round((item.score / maxPossibleScore) * 100), 100);
      return {
        id: item.id,
        document: item.document,
        title: item.title,
        content: item.content,
        tags: item.tags,
        confidence: confidence > 0 ? confidence : 10
      };
    });
}

// ---------------------------------------------------------------------
// 2. LANGUAGE TRANSLATION SERVICES
// ---------------------------------------------------------------------

const VERNACULAR_TRANSLATIONS = {
  hindi: {
    no_context: "मुझे संगठन के ज्ञान आधार में आपकी खोज से संबंधित कोई जानकारी नहीं मिली। कृपया अपने प्रश्न को फिर से लिखें।",
    welcome: "नमस्ते! मैं औद्योगिक आरएजी (RAG) सहायक हूँ। आप मुझसे रासायनिक सुरक्षा, मशीन अंशांकन या एचआर नीतियों के बारे में पूछ सकते हैं।",
    chemical_handling: "रासायनिक भंडारण दिशानिर्देशों के अनुसार, सभी खतरनाक रसायनों को सुरक्षा कैबिनेट में संग्रहीत किया जाना चाहिए (ज्वलनशील पदार्थों के लिए पीला, संक्षारक के लिए नीला, विषैले पदार्थों के लिए लाल)। रसायनों को संभालते समय लेवल C पीपीई (नाइट्राइल दस्ताने, सुरक्षा चश्मा, श्वासयंत्र और एप्रन) पहनना अनिवार्य है। किसी भी रासायनिक रिसाव के मामले में, तुरंत क्षेत्र को खाली करें और आपातकालीन शावर का उपयोग करें।",
    machine_maintenance: "सीएनसी मशीनों (CNC-X9/X12) के दैनिक अंशांकन के लिए, प्रत्येक सुबह की पाली की शुरुआत में गाइड रेल पर स्पिंडल ऑयल लगाएं और ऑटो-होमिंग रूटीन चलाएं। यदि स्पिंडल तापमान 85°C से अधिक हो जाता है (त्रुटि कोड E-204), तो तुरंत मशीन बंद करें। कम शीतलक प्रवाह (त्रुटि कोड E-101) के लिए, पाइपों की जांच करें।",
    hr_leave: "कंपनी की नीतियों के अनुसार, कर्मचारियों को प्रति वर्ष 12 दिन आकस्मिक अवकाश (Casual Leave), 10 दिन चिकित्सा अवकाश (Medical Leave), और 15 दिन अर्जित अवकाश (Earned Leave) मिलता है। 3 दिन से अधिक के चिकित्सा अवकाश के लिए डॉक्टर के नोट की आवश्यकता होती है। कार्य पाली तीन चक्रों में चलती है: पाली ए (06:00-14:00), पाली बी (14:00-22:00), और पाली सी (22:00-06:00)।"
  },
  tamil: {
    no_context: "அமைப்பின் அறிவுத் தளத்தில் நீங்கள் தேடியது தொடர்பான எந்த தகவலும் எனக்கு கிடைக்கவில்லை. தயவுசெய்து உங்கள் கேள்வியை மாற்றவும்.",
    welcome: "வணக்கம்! நான் தொழில்துறை ஆர்.ஏ.ஜி (RAG) உதவியாளர். இரசாயன பாதுகாப்பு, இயந்திர அளவுத்திருத்தம் அல்லது மனிதவளக் கொள்கைகள் பற்றி நீங்கள் என்னிடம் கேட்கலாம்.",
    chemical_handling: "இரசாயன சேமிப்பு வழிகாட்டுதல்களின்படி, அனைத்து அபாயகரமான இரசாயனங்களும் பாதுகாப்பு அலமாரிகளில் சேமிக்கப்பட வேண்டும் (எரியக்கூடிய பொருட்களுக்கு மஞ்சள், அரிக்கும் பொருட்களுக்கு நீலம், நச்சு பொருட்களுக்கு சிவப்பு). இரசாயனங்களை கையாளும் போது லெவல் C பிபிஇ (நைட்ரைல் கையுறைகள், பாதுகாப்பு கண்ணாடிகள், சுவாசக் கருவி மற்றும் ஏப்ரான்) அணிவது கட்டாயமாகும். இரசாயன கசிவு ஏற்பட்டால், உடனடியாக பகுதியை காலி செய்து அவசர கால ஷவரை பயன்படுத்தவும்.",
    machine_maintenance: "சிஎன்சி இயந்திரங்களின் (CNC-X9/X12) தினசரி அளவுத்திருத்தத்திற்கு, ஒவ்வொரு காலshift தொடக்கத்திலும் வழிகாட்டி தண்டுகளில் ஸ்பிண்டில் ஆயிலை தடவி, தானியங்கி ஹோம்மிங் வழக்கத்தை இயக்கவும். ஸ்பிண்டில் வெப்பநிலை 85°C ஐத் தாண்டினால் (பிழை குறியீடு E-204), உடனடியாக இயந்திரத்தை நிறுத்தவும். குறைந்த குளிரூட்டி ஓட்டத்திற்கு (பிழை குறியீடு E-101), குழாய்களைச் சரிபார்க்கவும்.",
    hr_leave: "நிறுவனத்தின் கொள்கைகளின்படி, ஊழியர்களுக்கு ஒரு காலண்டர் ஆண்டிற்கு 12 நாட்கள் தற்செயல் விடுப்பு (Casual Leave), 10 நாட்கள் மருத்துவ விடுப்பு (Medical Leave) மற்றும் 15 நாட்கள் ஈட்டிய விடுப்பு (Earned Leave) வழங்கப்படுகிறது. 3 நாட்களுக்கு மேல் மருத்துவ விடுப்பு எடுக்க மருத்துவ சான்றிதழ் சமர்ப்பிக்க வேண்டும். உற்பத்தி மூன்று சுழற்சி ஷிப்ட்களில் இயங்குகிறது: ஷிப்ட் ஏ (06:00-14:00), ஷிப்ட் பி (14:00-22:00), மற்றும் ஷிப்ட் சி (22:00-06:00)."
  },
  telugu: {
    no_context: "సంస్థ యొక్క నాలెడ్జ్ బేస్ లో మీ శోధనకు సంబంధించిన సమాచారం ఏదీ నాకు లభించలేదు. దయచేసి మీ ప్రశ్నను మార్చండి.",
    welcome: "నమస్తే! నేను పారిశ్రామిక ఆర్.ఏ.గీ (RAG) సహాయకుడిని. రసాయన భద్రత, యంత్ర అమరిక లేదా హెచ్.ఆర్ పాలసీల గురించి నన్ను అడగవచ్చు.",
    chemical_handling: "రసాయన నిల్వ మార్గదర్శకాల ప్రకారం, అన్ని ప్రమాదకర రసాయనాలను భద్రతా క్యాబినెట్లలో నిల్వ చేయాలి (మండే వాటికి పసుపు, తినివేసే వాటికి నీలం, విషపూరితమైన వాటికి ఎరుపు). రసాయనాలను హ్యాండిల్ చేసేటప్పుడు లెవెల్ C పిపిఇ (నైట్రైల్ చేతి తొడుగులు, భద్రతా గాగుల్స్, శ్వాసక్రియ సాధనం మరియు ఆప్రాన్) ధరించడం తప్పనిసరి. రసాయన చిందులు జరిగితే, వెంటనే ఆ ప్రాంతాన్ని ఖాళీ చేసి అత్యవసర షవర్ ఉపయోగించండి.",
    machine_maintenance: "సిఎన్‌సి యంత్రాల (CNC-X9/X12) రోజువారీ క్రమాంకనం కోసం, ప్రతి ఉదయం షిఫ్ట్ ప్రారంభంలో గైడ్ పట్టాలపై స్పిండిల్ ఆయిల్ వేసి, ఆటో-హోమింగ్ రొటీన్ నడపండి. ఒకవేళ స్పిండిల్ ఉష్ణోగ్రత 85°C దాటితే (ఎర్రర్ కోడ్ E-204), వెంటనే యంత్రాన్ని ఆపివేయండి. తక్కువ శీతలీకరణ ప్రవాహం (ఎர்రర్ కోడ్ E-101) కోసం, పైపులను తనిఖీ చేయండి.",
    hr_leave: "కంపెనీ నిబంధనల ప్రకారం, ఉద్యోగులకు సంవత్సరానికి 12 రోజులు క్యాజువల్ లీవ్ (Casual Leave), 10 రోజులు మెడికల్ లీవ్ (Medical Leave), మరియు 15 రోజులు ఎర్న్డ్ లీవ్ (Earned Leave) లభిస్తాయి. 3 రోజుల కంటే ఎక్కువ మెడికల్ లీవ్ తీసుకుంటే డాక్టర్ నోట్ సమర్పించాలి. మూడు షిఫ్టులు నడుస్తాయి: షిఫ్ట్ ఏ (06:00-14:00), షిఫ్ట్ బి (14:00-22:00), మరియు షిఫ్ట్ సి (22:00-06:00)."
  },
  kannada: {
    no_context: "ಸಂಸ್ಥೆಯ ಜ್ಞಾನ ಭಂಡಾರದಲ್ಲಿ ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮರುಹೊಂದಿಸಿ.",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ಕೈಗಾರಿಕಾ ಆರ್.ಎ.ಜಿ (RAG) ಸಹಾಯಕ. ನೀವು ರಾಸಾಯನಿಕ ಸುರಕ್ಷತೆ, ಯಂತ್ರ ಮಾಪನಾಂಕ ನಿರ್ಣಯ ಅಥವಾ ಎಚ್.ಆರ್ ನೀತಿಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
    chemical_handling: "ರಾಸಾಯನಿಕ ಸಂಗ್ರಹಣೆ ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ, ಎಲ್ಲಾ ಅಪಾಯಕಾರಿ ರಾಸಾಯನಿಕಗಳನ್ನು ಸುರಕ್ಷತಾ ಕ್ಯಾಬಿನೆಟ್‌ಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸಬೇಕು (ದಹನಕಾರಿಗಳಿಗೆ ಹಳದಿ, ತುಕ್ಕು ನಿರೋಧಕಗಳಿಗೆ ನೀಲಿ, ವಿಷಕಾರಿಗಳಿಗೆ ಕೆಂಪು). ರಾಸಾಯನಿಕಗಳನ್ನು ನಿರ್ವಹಿಸುವಾಗ ಲೆವೆಲ್ C ಪಿಪಿಇ (ನೈಟ್ರೈಲ್ ಕೈಗವಸುಗಳು, ಸುರಕ್ಷತಾ ಕನ್ನಡಕಗಳು, ಉಸಿರಾಟದ ಸಾಧನ ಮತ್ತು ಏಪ್ರನ್) ಧರಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ. ರಾಸಾಯನಿಕ ಸೋರಿಕೆಯಾದಲ್ಲಿ, ತಕ್ಷಣ ಆ ಪ್ರದೇಶವನ್ನು ಖಾಲಿ ಮಾಡಿ ತುರ್ತು ಶವರ್ ಬಳಸಿ.",
    machine_maintenance: "ಸಿಎನ್‌ಸಿ ಯಂತ್ರಗಳ (CNC-X9/X12) ದೈನಂದಿನ ಮಾಪನಾಂಕ ನಿರ್ಣಯಕ್ಕಾಗಿ, ಪ್ರತಿ ಬೆಳಗಿನ ಶಿಫ್ಟ್ ಪ್ರಾರಂಭದಲ್ಲಿ ಗೈಡ್ ರೈಲ್‌ಗಳಿಗೆ ಸ್ಪಿಂಡಲ್ ಆಯಿಲ್ ಹಚ್ಚಿ ಆಟೋ-ಹೋಮಿಂಗ್ ದಿನಚರಿಯನ್ನು ಚಲಾಯಿಸಿ. ಒಂದು ವೇಳೆ ಸ್ಪಿಂಡಲ್ ತಾಪಮಾನ 85°C ಮೀರಿದರೆ (ದೋಷ ಕೋಡ್ E-204), ತಕ್ಷಣ ಯಂತ್ರವನ್ನು ಆಫ್ ಮಾಡಿ. ಕಡಿಮೆ ಶೇತಲ ಪ್ರವಾಹಕ್ಕಾಗಿ (ದೋಷ ಕೋಡ್ E-101) ಪೈಪ್ ಪರಿಶೀಲಿಸಿ.",
    hr_leave: "ಕಂಪನಿಯ ನೀತಿಗಳ ಪ್ರಕಾರ, ಉದ್ಯೋಗಿಗಳಿಗೆ ವರ್ಷಕ್ಕೆ 12 ದಿನಗಳ ಕ್ಯಾಶುಯಲ್ ರಜೆ (Casual Leave), 10 ದಿನಗಳ ವೈದ್ಯಕೀಯ ರಜೆ (Medical Leave), ಮತ್ತು 15 ದಿನಗಳ ಗಳಿಸಿದ ರಜೆ (Earned Leave) ಇರುತ್ತದೆ. 3 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚಿನ ವೈದ್ಯಕೀಯ ರಜೆಗೆ ವೈದ್ಯರ ಪ್ರಮಾಣಪತ್ರದ ಅಗತ್ಯವಿದೆ. ಉತ್ಪಾದನೆಯು ಮೂರು ಶಿಫ್ಟ್‌ಗಳಲ್ಲಿ ನಡೆಯುತ್ತದೆ: ಶಿಫ್ಟ್ ಎ (06:00-14:00), ಶಿಫ್ಟ್ ಬಿ (14:00-22:00), ಮತ್ತು ಶಿಫ್ಟ್ ಸಿ (22:00-06:00)."
  },
  english: {
    no_context: "I could not find any information related to your search in the organization's knowledge base. Please try rephrasing your question.",
    welcome: "Hello! I am the Industrial RAG Assistant. You can ask me about chemical safety, CNC machine maintenance calibration, or HR leave policies.",
    chemical_handling: "According to chemical storage guidelines, hazardous materials must be stored in specialized safety cabinets (yellow for flammables, blue for corrosives, red for toxicants). Never store acids directly adjacent to bases. Operators must wear Level C PPE (nitrile gloves, safety goggles, full-face respirator, chemical apron) in the handling zone. In case of spills, immediately evacuate, cutoff power to nearby machinery, surround the spill with absorbent vermiculite, and neutralize (citric acid for bases, sodium bicarbonate for acids).",
    machine_maintenance: "For CNC multi-axis milling machines (CNC-X9/X12), perform daily calibration at 06:00. Check guide rails, apply Grade-68 spindle oil, and run the automatic homing routine. Maintain coolant flow above 12L/min. If the spindle overheats above 85°C (Error E-204), shut down immediately and inspect the coolant pump. If coolant flow is low (Error E-101), inspect pipes for blockages.",
    hr_leave: "Full-time employees are entitled to 12 days Casual Leave (CL), 10 days Medical Leave (ML), and 15 days Earned Leave (EL) annually. CL requires 48-hour advance notice, ML over 3 days requires a doctor's note, and EL requires 30-day planning. The facility operates on three shifts: Shift A (06:00-14:00), Shift B (14:00-22:00), and Shift C (22:00-06:00). RFID cards must be swiped within 15 minutes of shift start."
  }
};

async function defTranslate(text, sourceLang, targetLang) {
  try {
    console.log(`Requesting translation via IndicTrans2: ${sourceLang} -> ${targetLang}`);
    const response = await axios.post(`${TRANSLATE_SERVICE_URL}/translate`, {
      text: text,
      source_lang: sourceLang,
      target_lang: targetLang
    }, { timeout: 2000 });
    
    if (response.data && response.data.translated_text) {
      return response.data.translated_text;
    }
  } catch (error) {
    console.warn(`Local IndicTrans2 server is offline. Bypassing to Google Translate API fallback...`);
  }

  // Fallback to Google Translate free web API
  try {
    const langCodes = {
      hindi: 'hi',
      tamil: 'ta',
      telugu: 'te',
      kannada: 'kn',
      english: 'en'
    };
    const sl = langCodes[sourceLang.toLowerCase()] || 'en';
    const tl = langCodes[targetLang.toLowerCase()] || 'en';
    
    if (sl === tl) return text;
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { timeout: 4000 });
    if (response.data && response.data[0]) {
      const translatedText = response.data[0].map(item => item[0]).join('');
      return translatedText;
    }
  } catch (err) {
    console.error('Google Translate API fallback failed:', err.message);
  }
  return null;
}

function getSimulatedVernacularAnswer(query, chunks, language) {
  const langKey = language.toLowerCase();
  const translations = VERNACULAR_TRANSLATIONS[langKey] || VERNACULAR_TRANSLATIONS.english;
  
  if (chunks.length === 0) {
    return translations.no_context;
  }
  
  const text = query.toLowerCase();
  const isUploadedChunk = chunks.some(c => c.id.startsWith('upload-'));
  
  if (isUploadedChunk) {
    const matchedChunk = chunks[0];
    const prefix = {
      hindi: `[अपलोड की गई फ़ाइल "${matchedChunk.document}" से उद्धृत उत्तर]:\n\n`,
      tamil: `[பதிவேற்றப்பட்ட கோப்பு "${matchedChunk.document}" இலிருந்து பெறப்பட்ட பதில்]:\n\n`,
      telugu: `[అప్‌లోడ్ చేసిన ఫైల్ "${matchedChunk.document}" నుండి సమాధానం]:\n\n`,
      kannada: `[ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೈಲ್ "${matchedChunk.document}" ನಿಂದ ಉತ್ತರ]:\n\n`,
      english: `[Retrieved answer from uploaded document "${matchedChunk.document}"]:\n\n`
    };
    const translatedText = prefix[langKey] || prefix.english;
    return `${translatedText}${matchedChunk.content}`;
  }

  const isChemical = text.includes('chem') || text.includes('acid') || text.includes('hazard') || text.includes('ppe') || text.includes('spill') || text.includes('glove') || text.includes('safety');
  const isMachine = text.includes('cnc') || text.includes('calibrat') || text.includes('maintenance') || text.includes('spindle') || text.includes('coolant') || text.includes('error');
  const isHR = text.includes('leave') || text.includes('holiday') || text.includes('vacation') || text.includes('shift') || text.includes('attendance');

  if (isChemical) return translations.chemical_handling;
  if (isMachine) return translations.machine_maintenance;
  if (isHR) return translations.hr_leave;
  
  const bulletSymbol = "•";
  return `[Simulated response in ${language.toUpperCase()}]:\n` + 
         chunks.map(c => `${bulletSymbol} [${c.document}] ${c.title}: ${c.content.substring(0, 150)}...`).join('\n');
}

// ---------------------------------------------------------------------
// 3. EXPRESS API ROUTES
// ---------------------------------------------------------------------

// Route: Index PDF Chunks
app.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the 200MB limit. Please upload a smaller PDF manual.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Internal upload error: ${err.message}` });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const filename = req.file.originalname;
    const dataBuffer = req.file.buffer;
    
    // Adaptive parsing to support function vs class structure in pdf-parse packages
    let pdfData;
    if (typeof pdfParse === 'function') {
      pdfData = await pdfParse(dataBuffer);
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
      const parser = new pdfParse.PDFParse({ data: dataBuffer });
      const textResult = await parser.getText();
      const infoResult = await parser.getInfo();
      pdfData = {
        text: textResult.text,
        numpages: infoResult.total || 1
      };
    } else {
      throw new Error('pdf-parse is not in a supported format');
    }
    
    const pageCount = pdfData.numpages;
    const rawText = pdfData.text;
    const charCount = rawText.length;
    
    if (charCount < 10) {
      return res.status(400).json({ error: 'Failed to extract text from PDF.' });
    }
    
    const textChunks = chunkText(rawText);
    const newChunks = textChunks.map((content, idx) => {
      const id = `upload-${Date.now()}-${idx}`;
      const title = `Page Content Summary (Part ${idx + 1})`;
      const tags = generateTags(content, filename);
      
      const chunk = { id, document: filename, title, content, tags };
      dataset.push(chunk);
      return chunk;
    });

    // Write updated dataset back to disk
    try {
      const dataPath = path.join(__dirname, 'data', 'dataset.json');
      fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2), 'utf8');
      console.log(`[Database] Persisted database to disk. Total chunks: ${dataset.length}`);
    } catch (writeErr) {
      console.error('[Database] Failed to write database to dataset.json:', writeErr.message);
    }
    
    res.json({
      success: true,
      filename: filename,
      pages: pageCount,
      characters: charCount,
      chunksCount: newChunks.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse PDF: ' + error.message });
  }
});

// Route: Health state pinger
app.get('/api/health', async (req, res) => {
  let ollamaConnected = false;
  let modelInstalled = false;
  let indictransConnected = false;
  
  try {
    const ollamaResponse = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 1500 });
    const models = ollamaResponse.data.models || [];
    ollamaConnected = true;
    modelInstalled = models.some(m => m.name.toLowerCase().includes(DEFAULT_MODEL) || m.name.toLowerCase().includes('qwen2.5'));
  } catch (e) {
    ollamaConnected = false;
  }
  
  try {
    const transHealth = await axios.get(`${TRANSLATE_SERVICE_URL}/health`, { timeout: 1500 });
    if (transHealth.data.status === 'healthy') {
      indictransConnected = true;
    }
  } catch (e) {
    indictransConnected = false;
  }
  
  res.json({
    status: ollamaConnected ? 'healthy' : 'degraded',
    ollamaConnected,
    modelInstalled,
    indictransConnected,
    targetModel: DEFAULT_MODEL,
    translationEngine: indictransConnected ? 'IndicTrans2 (AI4Bharat)' : 'Fallback Local Sandbox'
  });
});

// Route: Query processor
app.post('/api/chat', async (req, res) => {
  const { message, language = 'english', mode = 'live', model = DEFAULT_MODEL } = req.body;
  const langKey = language.toLowerCase();
  
  let translatedQuery = null;
  let activeSearchQuery = message;
  
  // 1. Cross-Lingual Translation (before searching context)
  if (langKey !== 'english' && mode === 'live') {
    const translationResult = await defTranslate(message, langKey, 'english');
    if (translationResult) {
      translatedQuery = translationResult;
      activeSearchQuery = translationResult;
      console.log(`Cross-Lingual RAG: Translated "${message}" -> "${translatedQuery}"`);
    }
  }

  // 2. Retrieval Search
  const retrievedChunks = retrieveChunks(dataset, activeSearchQuery, 3);
  const contextString = retrievedChunks.length > 0
    ? retrievedChunks.map((c, idx) => `[Source Chunk #${idx+1}] - File: ${c.document} - Section: ${c.title}\nContent: ${c.content}`).join('\n\n')
    : "No relevant documents found in the database.";

  // 3. Compile prompt
  const systemPrompt = `You are a professional industrial safety and organizational guidelines chatbot assistant.
Answer the user's question using ONLY the provided document context below.
If the answer cannot be found or deduced in the provided context, state clearly that you cannot find this information in the organization's knowledge base.
Do not make up facts or URL links. Keep technical codes (like error codes, shift letters, room numbers) exactly as they are.

Answer in clear, concise English.`;

  const userPrompt = `Context Document Chunks:
${contextString}

User Query: ${activeSearchQuery}

Answer:`;

  let englishAnswer = '';
  let finalAnswer = '';
  let connectionUsed = 'simulated';
  
  if (mode === 'live') {
    try {
      console.log(`Querying Qwen2.5:7B RAG generator...`);
      const ollamaResponse = await axios.post(`${OLLAMA_HOST}/api/generate`, {
        model: model,
        prompt: userPrompt,
        system: systemPrompt,
        stream: false,
        options: { temperature: 0.1 }
      }, { timeout: 12000 });
      
      englishAnswer = ollamaResponse.data.response;
      connectionUsed = 'live';
    } catch (error) {
      console.warn('Ollama request failed, falling back to local simulation:', error.message);
      englishAnswer = getSimulatedVernacularAnswer(message, retrievedChunks, 'english');
      connectionUsed = 'fallback';
    }
  } else {
    englishAnswer = getSimulatedVernacularAnswer(message, retrievedChunks, 'english');
  }

  // Translate final response into regional target language
  if (langKey !== 'english') {
    console.log(`Translating final response back to ${language}...`);
    const responseTranslation = await defTranslate(englishAnswer, 'english', langKey);
    if (responseTranslation) {
      finalAnswer = responseTranslation;
    } else {
      finalAnswer = getSimulatedVernacularAnswer(message, retrievedChunks, language) + 
        `\n\n*(Translation failed. Direct English answer)*\n\n${englishAnswer}`;
      connectionUsed = 'fallback';
    }
  } else {
    finalAnswer = englishAnswer;
  }

  res.json({
    status: connectionUsed === 'live' ? 'success' : 'simulated',
    answer: finalAnswer,
    chunks: retrievedChunks,
    prompt: `${systemPrompt}\n\n${userPrompt}`,
    translatedQuery: translatedQuery,
    modelUsed: connectionUsed === 'live' ? `${model} + IndicTrans2` : `${model} (Simulated)`,
    connection: connectionUsed
  });
});

app.get('/api/documents', (req, res) => {
  try {
    const docsMap = {};
    dataset.forEach(chunk => {
      const docName = chunk.document;
      if (!docsMap[docName]) {
        docsMap[docName] = { name: docName, category: 'User Uploaded', chunks: 0 };
      }
      docsMap[docName].chunks += 1;
    });
    res.json({ success: true, documents: Object.values(docsMap) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/documents/:filename', (req, res) => {
  try {
    const filenameToDelete = req.params.filename;
    const originalCount = dataset.length;
    
    // Filter out chunks belonging to this document
    dataset = dataset.filter(chunk => chunk.document !== filenameToDelete);
    
    const deletedCount = originalCount - dataset.length;
    
    // Persist updated database to disk
    const dataPath = path.join(__dirname, 'data', 'dataset.json');
    fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2), 'utf8');
    
    console.log(`[Database] Deleted document "${filenameToDelete}". Removed ${deletedCount} chunks. Remaining: ${dataset.length}`);
    
    res.json({ success: true, message: `Successfully deleted document "${filenameToDelete}"`, deletedChunks: deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Vernacular RAG API Server is running.');
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Consolidated Backend server listening on port ${PORT}`);
  console.log(` Local Ollama expected at: ${OLLAMA_HOST}`);
  console.log(` IndicTrans2 server expected at: ${TRANSLATE_SERVICE_URL}`);
  console.log(`==================================================`);
});
