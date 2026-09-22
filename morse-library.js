/* @morsecodeapp/morse 0.2.0; Copyright (c) 2025 MorseCodeApp; MIT. See licenses/morsecodeapp-main-LICENSE. Types stripped and modules bundled locally; upstream logic unchanged. */
(function(){const modules={
"core/index.js":function(require,exports){
/**
 * @morsecodeapp/morse/core — Tree-shakeable core module
 * Encode, decode, charsets, prosigns, timing, stats, validation.
 * No DOM / Web Audio dependencies.
 *
 * @see https://morsecodeapp.com
 * @license MIT
 */

// Types
             
            
          
                
                
               
               
               
          
             
                    

// Encode / Decode
exports.encode=require("core/encode.js").encode;
exports.encodeDetailed=require("core/encode.js").encodeDetailed;
exports.decode=require("core/decode.js").decode;
exports.decodeDetailed=require("core/decode.js").decodeDetailed;

// Charsets
exports.getCharset=require("core/charsets/index.js").getCharset;
exports.listCharsets=require("core/charsets/index.js").listCharsets;
exports.listCharsetsDetailed=require("core/charsets/index.js").listCharsetsDetailed;
exports.detectCharset=require("core/charsets/index.js").detectCharset;
exports.itu=require("core/charsets/index.js").itu;
exports.american=require("core/charsets/index.js").american;
exports.latinExt=require("core/charsets/index.js").latinExt;
exports.cyrillic=require("core/charsets/index.js").cyrillic;
exports.greek=require("core/charsets/index.js").greek;
exports.hebrew=require("core/charsets/index.js").hebrew;
exports.arabic=require("core/charsets/index.js").arabic;
exports.persian=require("core/charsets/index.js").persian;
exports.japanese=require("core/charsets/index.js").japanese;
exports.korean=require("core/charsets/index.js").korean;
exports.thai=require("core/charsets/index.js").thai;

// Prosigns
exports.PROSIGNS=require("core/prosigns.js").PROSIGNS;
exports.encodeProsign=require("core/prosigns.js").encodeProsign;
exports.decodeProsign=require("core/prosigns.js").decodeProsign;
exports.getProsign=require("core/prosigns.js").getProsign;
exports.listProsigns=require("core/prosigns.js").listProsigns;

// Timing
exports.timing=require("core/timing.js").timing;
exports.farnsworthTiming=require("core/timing.js").farnsworthTiming;
exports.duration=require("core/timing.js").duration;
exports.formatDuration=require("core/timing.js").formatDuration;
exports.DEFAULT_WPM=require("core/timing.js").DEFAULT_WPM;
exports.MIN_WPM=require("core/timing.js").MIN_WPM;
exports.MAX_WPM=require("core/timing.js").MAX_WPM;

// Stats
exports.stats=require("core/stats.js").stats;

// Validation
exports.isValidMorse=require("core/validate.js").isValidMorse;
exports.isEncodable=require("core/validate.js").isEncodable;
exports.isDecodable=require("core/validate.js").isDecodable;
exports.findInvalidChars=require("core/validate.js").findInvalidChars;
exports.findInvalidPatterns=require("core/validate.js").findInvalidPatterns;


},
"core/encode.js":function(require,exports){
/**
 * Morse code encoder — converts text to morse code.
 * @see https://morsecodeapp.com
 */

                                                                         
const { getCharset }=require("core/charsets/index.js");

/** Default encode options */
const DEFAULTS                          = {
  charset: 'itu',
  fallbackCharsets: [],
  dot: '.',
  dash: '-',
  separator: ' ',
  wordSeparator: ' / ',
  invalid: '?',
};

/**
 * Encode text to morse code.
 *
 * @example
 * ```ts
 * encode('SOS')        // '... --- ...'
 * encode('Hello')      // '.... . .-.. .-.. ---'
 * encode('Привет', { charset: 'cyrillic' })
 * ```
 */
function encode(text        , options                )         {
  return encodeDetailed(text, options).morse;
}

/**
 * Encode text to morse code with detailed results.
 * Returns the morse string plus validity info and any errors.
 */
function encodeDetailed(
  text        ,
  options                ,
)               {
  const opts = { ...DEFAULTS, ...options };
  const charset = getCharset(opts.charset);
  const fallbacks = opts.fallbackCharsets.map((id           ) => getCharset(id));

  const errors           = [];
  const words = text.split(/\s+/).filter(Boolean);
  const morseWords           = [];

  for (const word of words) {
    const morseChars           = [];
    for (const ch of word) {
      const upper = ch.toUpperCase();
      let pattern = charset.charToMorse[upper];

      // Try fallback charsets
      if (pattern === undefined) {
        for (const fb of fallbacks) {
          pattern = fb.charToMorse[upper];
          if (pattern !== undefined) break;
        }
      }

      if (pattern !== undefined) {
        // Replace dots/dashes if custom symbols requested
        let output = pattern;
        if (opts.dot !== '.' || opts.dash !== '-') {
          output = pattern
            .replace(/\./g, '\x00')
            .replace(/-/g, opts.dash)
            .replace(/\x00/g, opts.dot);
        }
        morseChars.push(output);
      } else {
        errors.push(ch);
        morseChars.push(opts.invalid);
      }
    }
    morseWords.push(morseChars.join(opts.separator));
  }

  return {
    morse: morseWords.join(opts.wordSeparator),
    valid: errors.length === 0,
    errors: [...new Set(errors)],
  };
}

exports.encode=encode;
exports.encodeDetailed=encodeDetailed;
},
"core/charsets/index.js":function(require,exports){
/**
 * Charset registry — lazy-loaded map of all supported character sets.
 * @see https://morsecodeapp.com
 */

                                                      
const { itu }=require("core/charsets/itu.js");
const { american }=require("core/charsets/american.js");
const { latinExt }=require("core/charsets/latin-ext.js");
const { cyrillic }=require("core/charsets/cyrillic.js");
const { greek }=require("core/charsets/greek.js");
const { hebrew }=require("core/charsets/hebrew.js");
const { arabic }=require("core/charsets/arabic.js");
const { persian }=require("core/charsets/persian.js");
const { japanese }=require("core/charsets/japanese.js");
const { korean }=require("core/charsets/korean.js");
const { thai }=require("core/charsets/thai.js");

/** All registered charsets keyed by id */
const registry                                  = new Map                    ([
  ['itu', itu],
  ['american', american],
  ['latin-ext', latinExt],
  ['cyrillic', cyrillic],
  ['greek', greek],
  ['hebrew', hebrew],
  ['arabic', arabic],
  ['persian', persian],
  ['japanese', japanese],
  ['korean', korean],
  ['thai', thai],
]);

/**
 * Get a charset by id.
 * @throws {Error} If charset id is unknown
 */
function getCharset(id            = 'itu')          {
  const cs = registry.get(id);
  if (!cs) {
    throw new Error(
      `Unknown charset "${id}". Available: ${listCharsets().join(', ')}`,
    );
  }
  return cs;
}

/** List all available charset ids */
function listCharsets()              {
  return [...registry.keys()];
}

/** List all available charsets with metadata */
function listCharsetsDetailed()                                                       {
  return [...registry.values()].map((cs) => ({
    id: cs.id,
    name: cs.name,
    size: Object.keys(cs.charToMorse).length,
  }));
}

/**
 * Auto-detect the best charset for given text.
 * Returns the charset whose character map covers the most input characters.
 */
function detectCharset(text        )            {
  const upper = text.toUpperCase();
  let bestId            = 'itu';
  let bestScore = 0;

  for (const [id, cs] of registry) {
    let score = 0;
    for (const ch of upper) {
      if (ch === ' ') continue;
      if (cs.charToMorse[ch] !== undefined) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId;
}

// Re-export individual charsets for direct import
exports.itu=require("core/charsets/itu.js").itu;
exports.american=require("core/charsets/american.js").american;
exports.latinExt=require("core/charsets/latin-ext.js").latinExt;
exports.cyrillic=require("core/charsets/cyrillic.js").cyrillic;
exports.greek=require("core/charsets/greek.js").greek;
exports.hebrew=require("core/charsets/hebrew.js").hebrew;
exports.arabic=require("core/charsets/arabic.js").arabic;
exports.persian=require("core/charsets/persian.js").persian;
exports.japanese=require("core/charsets/japanese.js").japanese;
exports.korean=require("core/charsets/korean.js").korean;
exports.thai=require("core/charsets/thai.js").thai;

exports.getCharset=getCharset;
exports.listCharsets=listCharsets;
exports.listCharsetsDetailed=listCharsetsDetailed;
exports.detectCharset=detectCharset;
},
"core/charsets/itu.js":function(require,exports){
/**
 * ITU International Morse Code (ITU-R M.1677-1)
 * Latin letters A–Z, Numbers 0–9, Punctuation
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  // Letters
  'A': '.-',     'B': '-...',   'C': '-.-.',   'D': '-..',
  'E': '.',      'F': '..-.',   'G': '--.',    'H': '....',
  'I': '..',     'J': '.---',   'K': '-.-',    'L': '.-..',
  'M': '--',     'N': '-.',     'O': '---',    'P': '.--.',
  'Q': '--.-',   'R': '.-.',    'S': '...',    'T': '-',
  'U': '..-',    'V': '...-',   'W': '.--',    'X': '-..-',
  'Y': '-.--',   'Z': '--..',

  // Numbers
  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',

  // Punctuation
  '.': '.-.-.-',  ',': '--..--',  '?': '..--..',  "'": '.----.',
  '!': '-.-.--',  '/': '-..-.',   '(': '-.--.',   ')': '-.--.-',
  '&': '.-...',   ':': '---...',  ';': '-.-.-.',  '=': '-...-',
  '+': '.-.-.',   '-': '-....-',  '_': '..--.-',  '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const itu          = {
  id: 'itu',
  name: 'International (ITU)',
  charToMorse,
  morseToChar,
};

exports.itu=itu;
},
"core/charsets/american.js":function(require,exports){
/**
 * American Morse Code (1844 telegraph variant)
 * Different patterns from International/ITU for several characters
 * @see https://morsecodeapp.com
 */

                                           

// American Morse uses longer internal spaces (marked as 0 in historical docs)
// Here we represent the patterns using standard dot/dash notation
const charToMorse                         = {
  'A': '.-',     'B': '-...',   'C': '.. .',   'D': '-..',
  'E': '.',      'F': '.-.',    'G': '--.',    'H': '....',
  'I': '..',     'J': '-.-.',   'K': '-.-',    'L': '---',
  'M': '--',     'N': '-.',     'O': '. .',    'P': '.....',
  'Q': '..-.',   'R': '. ..',   'S': '...',    'T': '-',
  'U': '..-',    'V': '...-',   'W': '.--',    'X': '.-..', 
  'Y': '.. ..',  'Z': '... .',

  '0': '-----',  '1': '.--.',   '2': '..-..', '3': '...-.',
  '4': '....-',  '5': '---',    '6': '......', '7': '--..',
  '8': '-....',  '9': '-..-',

  '.': '..--..',  ',': '.-.-',   '?': '-..-.',
  '!': '---.',    '/': '-..-.',  '&': '. ...',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const american          = {
  id: 'american',
  name: 'American Morse Code',
  charToMorse,
  morseToChar,
};

exports.american=american;
},
"core/charsets/latin-ext.js":function(require,exports){
/**
 * Latin Extended — accented characters for European languages
 * Extension of ITU; import ITU as base and overlay accented chars
 * @see https://morsecodeapp.com
 */

                                           
const { itu }=require("core/charsets/itu.js");

const accented                         = {
  'À': '.--.-',   'Á': '.--.-',   'Â': '.--.-',
  'Ä': '.-.-',    'Å': '.--.-',   'Ç': '-.-..',
  'È': '.-..-',   'É': '..-.',    'Ê': '-..-.',
  'Ñ': '--.--',   'Ö': '---.',    'Ü': '..--',
  'Ð': '..--..',  'Þ': '.--..',
  'Ś': '...-...',  'Ź': '--..-.',  'Ż': '--..-',
  'Ą': '.-.-',    'Ć': '-.-..',   'Ę': '..-..',
  'Ł': '.-..-',   'Ó': '---.',    'Ń': '--.--',
  'Š': '----',    'Ž': '--..-',   'Č': '-..-.',
};

const charToMorse                         = {
  ...itu.charToMorse,
  ...accented,
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const latinExt          = {
  id: 'latin-ext',
  name: 'Latin Extended',
  charToMorse,
  morseToChar,
};

exports.latinExt=latinExt;
},
"core/charsets/cyrillic.js":function(require,exports){
/**
 * Russian/Cyrillic Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'А': '.-',     'Б': '-...',   'В': '.--',    'Г': '--.',
  'Д': '-..',    'Е': '.',      'Ж': '...-',   'З': '--..',
  'И': '..',     'Й': '.---',   'К': '-.-',    'Л': '.-..',
  'М': '--',     'Н': '-.',     'О': '---',    'П': '.--.',
  'Р': '.-.',    'С': '...',    'Т': '-',      'У': '..-',
  'Ф': '..-.',   'Х': '....',   'Ц': '-.-.',   'Ч': '---.',
  'Ш': '----',   'Щ': '--.-',   'Ъ': '--.--',  'Ы': '-.--',
  'Ь': '-..-',   'Э': '..-..',  'Ю': '..--',   'Я': '.-.-',
  'Ё': '.',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const cyrillic          = {
  id: 'cyrillic',
  name: 'Russian/Cyrillic',
  charToMorse,
  morseToChar,
};

exports.cyrillic=cyrillic;
},
"core/charsets/greek.js":function(require,exports){
/**
 * Greek Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'Α': '.-',     'Β': '-...',   'Γ': '--.',    'Δ': '-..',
  'Ε': '.',      'Ζ': '--..',   'Η': '....',   'Θ': '-.-.',
  'Ι': '..',     'Κ': '-.-',    'Λ': '.-..',   'Μ': '--',
  'Ν': '-.',     'Ξ': '-..-',   'Ο': '---',    'Π': '.--.',
  'Ρ': '.-.',    'Σ': '...',    'Τ': '-',      'Υ': '-.--',
  'Φ': '..-.',   'Χ': '----',   'Ψ': '--.-',   'Ω': '.--',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const greek          = {
  id: 'greek',
  name: 'Greek',
  charToMorse,
  morseToChar,
};

exports.greek=greek;
},
"core/charsets/hebrew.js":function(require,exports){
/**
 * Hebrew Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'א': '.-',     'ב': '-...',   'ג': '--.',    'ד': '-..',
  'ה': '---',    'ו': '.',      'ז': '--..',   'ח': '....',
  'ט': '..-',    'י': '..',     'כ': '-.-',    'ל': '.-..',
  'מ': '--',     'נ': '-.',     'ס': '-.-.',   'ע': '.---',
  'פ': '.--.',   'צ': '.--',    'ק': '--.-',   'ר': '.-.',
  'ש': '...',    'ת': '-',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const hebrew          = {
  id: 'hebrew',
  name: 'Hebrew',
  charToMorse,
  morseToChar,
};

exports.hebrew=hebrew;
},
"core/charsets/arabic.js":function(require,exports){
/**
 * Arabic Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'ا': '.-',     'ب': '-...',   'ت': '-',      'ث': '-.-.',
  'ج': '.---',   'ح': '....',   'خ': '---',    'د': '-..',
  'ذ': '--..',   'ر': '.-.',    'ز': '---.',   'س': '...',
  'ش': '----',   'ص': '-..-',   'ض': '...-',   'ط': '..-',
  'ظ': '-.--',   'ع': '.-.-',   'غ': '--.',    'ف': '..-.',
  'ق': '--.-',   'ك': '-.-',    'ل': '.-..',   'م': '--',
  'ن': '-.',     'ه': '..--..',  'و': '.--',    'ي': '..',
  'ء': '.',      'ئ': '-..-.',  'ؤ': '..--',   'لا': '.-...-',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const arabic          = {
  id: 'arabic',
  name: 'Arabic',
  charToMorse,
  morseToChar,
};

exports.arabic=arabic;
},
"core/charsets/persian.js":function(require,exports){
/**
 * Persian (Farsi) Morse Code — extends Arabic with additional characters
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'ا': '.-',     'ب': '-...',   'پ': '.--.',   'ت': '-',
  'ث': '-.-.',   'ج': '.---',   'چ': '---.',   'ح': '....',
  'خ': '-..-',   'د': '-..',    'ذ': '...-',   'ر': '.-.',
  'ز': '--..',   'ژ': '--.',    'س': '...',    'ش': '----',
  'ص': '.-.-',   'ض': '..--..',  'ط': '..-',    'ظ': '-.--',
  'ع': '---',    'غ': '..--',   'ف': '..-.',   'ق': '...---',
  'ک': '-.-',    'گ': '--.-',   'ل': '.-..',   'م': '--',
  'ن': '-.',     'و': '.--',    'ه': '.',      'ی': '..',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const persian          = {
  id: 'persian',
  name: 'Persian (Farsi)',
  charToMorse,
  morseToChar,
};

exports.persian=persian;
},
"core/charsets/japanese.js":function(require,exports){
/**
 * Japanese Wabun Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  // Vowels
  'ア': '--.--',  'イ': '.-',     'ウ': '..-',    'エ': '-.---',
  'オ': '.-...',

  // K-row
  'カ': '.-..',   'キ': '-.-..',  'ク': '...-',   'ケ': '-.--',
  'コ': '----',

  // S-row
  'サ': '-.-.-',  'シ': '--.-.',  'ス': '---.-',  'セ': '.---.',
  'ソ': '---.',

  // T-row
  'タ': '-.',     'チ': '..-.',   'ツ': '.--.',   'テ': '.-.--',
  'ト': '..-..',

  // N-row
  'ナ': '.-.',    'ニ': '-.-.',   'ヌ': '....',   'ネ': '--.-',
  'ノ': '..--',

  // H-row
  'ハ': '-...',   'ヒ': '--..-',  'フ': '--..',   'ヘ': '.',
  'ホ': '-..',

  // M-row
  'マ': '-..-',   'ミ': '..-.-',  'ム': '-',      'メ': '-...-',
  'モ': '-..-.',

  // Y-row
  'ヤ': '.--',    'ユ': '-..--',  'ヨ': '--',

  // R-row
  'ラ': '...',    'リ': '--.',    'ル': '-.--.',  'レ': '---',
  'ロ': '.-.-',

  // W-row + N
  'ワ': '-.-',    'ヰ': '.-..-',  'ヱ': '.--..',  'ヲ': '.---',
  'ン': '.-.-.',

  // Dakuten / Handakuten marks
  '゛': '..',     '゜': '..--.',

  // Long vowel mark
  'ー': '.--.-',

  // Punctuation
  '、': '.-.-.-', '。': '.-.-..',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const japanese          = {
  id: 'japanese',
  name: 'Japanese (Wabun)',
  charToMorse,
  morseToChar,
};

exports.japanese=japanese;
},
"core/charsets/korean.js":function(require,exports){
/**
 * Korean (SKATS) Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  // Consonants (자음)
  'ㄱ': '.-..',   'ㄴ': '..-.',   'ㄷ': '-...',   'ㄹ': '...-',
  'ㅁ': '--',     'ㅂ': '.--',    'ㅅ': '-.-',    'ㅇ': '-.-.',
  'ㅈ': '.--.',   'ㅊ': '-.--.', 'ㅋ': '-..-',   'ㅌ': '--..',
  'ㅍ': '---',    'ㅎ': '.---',

  // Double consonants
  'ㄲ': '.-.. .-..', 'ㄸ': '-... -...', 'ㅃ': '.-- .--',
  'ㅆ': '-.- -.-',   'ㅉ': '.--. .--.',

  // Vowels (모음)
  'ㅏ': '.',      'ㅑ': '..',     'ㅓ': '-',      'ㅕ': '...',
  'ㅗ': '.-',     'ㅛ': '-.',     'ㅜ': '....',   'ㅠ': '.-.',
  'ㅡ': '-..',    'ㅣ': '..-',

  // Compound vowels
  'ㅐ': '--.',    'ㅒ': '--. ..',  'ㅔ': '-.--',   'ㅖ': '-.-- ..',
  'ㅘ': '.- .',   'ㅙ': '.- --.',  'ㅚ': '.- ..-',
  'ㅝ': '.... -', 'ㅞ': '.... -.--', 'ㅟ': '.... ..-',
  'ㅢ': '-.. ..-',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const korean          = {
  id: 'korean',
  name: 'Korean (SKATS)',
  charToMorse,
  morseToChar,
};

exports.korean=korean;
},
"core/charsets/thai.js":function(require,exports){
/**
 * Thai Morse Code
 * @see https://morsecodeapp.com
 */

                                           

const charToMorse                         = {
  'ก': '--.',    'ข': '-.-.', 'ค': '-.-',   'ง': '-.--.',
  'จ': '-..-.',  'ฉ': '----', 'ช': '-..-',  'ซ': '--..',
  'ญ': '.---',   'ด': '-..',  'ต': '-',     'ถ': '-.-..',
  'ท': '-..--',  'น': '-.',   'บ': '-...',  'ป': '.--.',
  'ผ': '--.-',   'ฝ': '-.-.-', 'พ': '.--.', 'ฟ': '..-.',
  'ม': '--',     'ย': '-.--', 'ร': '.-.',   'ล': '.-..',
  'ว': '.--',    'ศ': '...',  'ษ': '---..', 'ส': '...',
  'ห': '....',   'อ': '-...-', 'ฮ': '--.--',

  // Vowels & tone marks
  'ะ': '.-...',  'า': '.-',   'ิ': '..-.',  'ี': '..',
  'ึ': '..--.',  'ื': '..--', 'ุ': '..--.', 'ู': '---.',
  'เ': '.',      'แ': '.-.-', 'โ': '---',   'ไ': '.-..-',
  'ำ': '...-.',

  '่': '..-',    '้': '...-', '๊': '-...',  '๋': '.-.-.',

  '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
  '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
  '8': '---..',  '9': '----.',
};

const morseToChar                         = {};
for (const [char, morse] of Object.entries(charToMorse)) {
  morseToChar[morse] = char;
}

const thai          = {
  id: 'thai',
  name: 'Thai',
  charToMorse,
  morseToChar,
};

exports.thai=thai;
},
"core/decode.js":function(require,exports){
/**
 * Morse code decoder — converts morse code back to text.
 * @see https://morsecodeapp.com
 */

                                                                         
const { getCharset }=require("core/charsets/index.js");

/** Default decode options */
const DEFAULTS                          = {
  charset: 'itu',
  fallbackCharsets: [],
  dot: '.',
  dash: '-',
  separator: ' ',
  wordSeparator: ' / ',
  invalid: '?',
};

/**
 * Decode morse code to text.
 *
 * @example
 * ```ts
 * decode('... --- ...')          // 'SOS'
 * decode('.... . .-.. .-.. ---') // 'HELLO'
 * ```
 */
function decode(morse        , options                )         {
  return decodeDetailed(morse, options).text;
}

/**
 * Decode morse code to text with detailed results.
 * Returns the text plus validity info and any unrecognized patterns.
 */
function decodeDetailed(
  morse        ,
  options                ,
)               {
  const opts = { ...DEFAULTS, ...options };
  const charset = getCharset(opts.charset);
  const fallbacks = opts.fallbackCharsets.map((id           ) => getCharset(id));

  const errors           = [];

  // Normalize input: replace custom dot/dash with standard
  let normalized = morse;
  if (opts.dot !== '.' || opts.dash !== '-') {
    normalized = morse
      .replace(new RegExp(escapeRegex(opts.dot), 'g'), '\x00')
      .replace(new RegExp(escapeRegex(opts.dash), 'g'), '-')
      .replace(/\x00/g, '.');
  }

  // Split into words by word separator
  const wordSep = opts.wordSeparator.trim() || '/';
  const words = normalized.split(new RegExp(`\\s*${escapeRegex(wordSep)}\\s*`));
  const textWords           = [];

  for (const word of words) {
    const patterns = word.trim().split(/\s+/).filter(Boolean);
    let textChars = '';

    for (const pattern of patterns) {
      let ch = charset.morseToChar[pattern];

      // Try fallback charsets
      if (ch === undefined) {
        for (const fb of fallbacks) {
          ch = fb.morseToChar[pattern];
          if (ch !== undefined) break;
        }
      }

      if (ch !== undefined) {
        textChars += ch;
      } else {
        errors.push(pattern);
        textChars += opts.invalid;
      }
    }

    textWords.push(textChars);
  }

  return {
    text: textWords.join(' '),
    valid: errors.length === 0,
    errors: [...new Set(errors)],
  };
}

function escapeRegex(str        )         {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.decode=decode;
exports.decodeDetailed=decodeDetailed;
},
"core/prosigns.js":function(require,exports){
/**
 * Prosigns — procedural signals sent as single unbroken characters
 * @see https://morsecodeapp.com
 */

                                          

/** Standard ITU prosigns */
const PROSIGNS                     = [
  { label: 'SOS',  morse: '...---...',  meaning: 'International distress signal' },
  { label: 'AR',   morse: '.-.-.',      meaning: 'End of message' },
  { label: 'SK',   morse: '...-.-',     meaning: 'End of contact / Silent Key' },
  { label: 'BT',   morse: '-...-',      meaning: 'Break / New paragraph' },
  { label: 'KN',   morse: '-.--.',      meaning: 'Go ahead, named station only' },
  { label: 'AS',   morse: '.-...',      meaning: 'Wait / Stand by' },
  { label: 'CL',   morse: '-.-..-..',   meaning: 'Closing station' },
  { label: 'CT',   morse: '-.-.-',      meaning: 'Commence transmission' },
  { label: 'SN',   morse: '...-.',      meaning: 'Understood / Verified' },
  { label: 'HH',   morse: '........',   meaning: 'Error / Correction' },
]         ;

/** Prosign label → morse pattern */
const labelToMorse = new Map                (
  PROSIGNS.map((p) => [p.label, p.morse]),
);

/** Morse pattern → prosign label */
const morseToLabel = new Map                (
  PROSIGNS.map((p) => [p.morse, p.label]),
);

/**
 * Get the morse pattern for a prosign.
 * @param label - e.g., 'SOS', 'AR'
 */
function encodeProsign(label        )                     {
  return labelToMorse.get(label.toUpperCase());
}

/**
 * Check if a morse pattern is a known prosign.
 * @returns The prosign label or undefined
 */
function decodeProsign(morse        )                     {
  return morseToLabel.get(morse);
}

/**
 * Get full prosign info by label.
 */
function getProsign(label        )                      {
  return PROSIGNS.find((p) => p.label === label.toUpperCase());
}

/** List all prosign labels */
function listProsigns()           {
  return PROSIGNS.map((p) => p.label);
}

exports.PROSIGNS=PROSIGNS;
exports.encodeProsign=encodeProsign;
exports.decodeProsign=decodeProsign;
exports.getProsign=getProsign;
exports.listProsigns=listProsigns;
},
"core/timing.js":function(require,exports){
/**
 * PARIS timing calculator — millisecond durations for morse code elements.
 *
 * The word PARIS is the international standard for measuring morse code speed.
 * PARIS = 50 dot-units, so at W WPM: unit = 1200 / W ms.
 *
 * Farnsworth timing sends characters at a faster speed but adds extra space
 * between characters and words to slow overall speed.
 *
 * @see https://morsecodeapp.com
 */

                                               

/** Default words-per-minute */
const DEFAULT_WPM = 20;

/** Minimum WPM allowed */
const MIN_WPM = 1;

/** Maximum WPM allowed */
const MAX_WPM = 60;

/**
 * Calculate standard PARIS timing values.
 * @param wpm - Words per minute (1–60)
 */
function timing(wpm         = DEFAULT_WPM)               {
  const w = clampWpm(wpm);
  const unit = 1200 / w;

  return {
    unit,
    dot: unit,
    dash: unit * 3,
    intraChar: unit,
    interChar: unit * 3,
    interWord: unit * 7,
  };
}

/**
 * Calculate Farnsworth timing values.
 * Characters are sent at `charWpm`, overall speed is `overallWpm`.
 * Extra delay is added between characters and words.
 *
 * @param overallWpm - Desired effective WPM (slower)
 * @param charWpm - Character sending speed (faster)
 */
function farnsworthTiming(
  overallWpm         = 15,
  charWpm         = DEFAULT_WPM,
)               {
  const ow = clampWpm(overallWpm);
  const cw = clampWpm(Math.max(charWpm, ow));

  const charUnit = 1200 / cw;

  // Total time for PARIS at overall speed
  const totalTime = (60 / ow) * 1000; // ms for one "PARIS " at overall WPM
  // Time taken by characters at char speed (31 units of character content in PARIS)
  const charTime = 31 * charUnit;
  // Remaining time distributed among 19 inter-element spaces in PARIS
  const extraTime = Math.max(0, totalTime - charTime);
  const delayUnit = extraTime / 19;

  return {
    unit: charUnit,
    dot: charUnit,
    dash: charUnit * 3,
    intraChar: charUnit,
    interChar: delayUnit * 3,
    interWord: delayUnit * 7,
  };
}

/**
 * Calculate the duration of a morse string in milliseconds.
 * @param morse - Morse string (dots, dashes, spaces)
 * @param wpm - Speed in WPM
 */
function duration(morse        , wpm         = DEFAULT_WPM)         {
  const t = timing(wpm);
  let ms = 0;

  const words = morse.split(/\s*\/\s*/);
  for (let wi = 0; wi < words.length; wi++) {
    if (wi > 0) ms += t.interWord;
    const word = words[wi];
    if (!word) continue;
    const letters = word.trim().split(/\s+/);
    for (let li = 0; li < letters.length; li++) {
      if (li > 0) ms += t.interChar;
      const signals = letters[li];
      if (!signals) continue;
      for (let si = 0; si < signals.length; si++) {
        if (si > 0) ms += t.intraChar;
        ms += signals.charAt(si) === '-' ? t.dash : t.dot;
      }
    }
  }

  return Math.round(ms);
}

/**
 * Format milliseconds to a human-readable string.
 * @example formatDuration(3500) → "3.5s"
 * @example formatDuration(65000) → "1m 5.0s"
 */
function formatDuration(ms        )         {
  if (ms < 1000) return `${ms}ms`;
  const totalSec = ms / 1000;
  if (totalSec < 60) return `${totalSec.toFixed(1)}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}m ${sec.toFixed(1)}s`;
}

function clampWpm(wpm        )         {
  return Math.max(MIN_WPM, Math.min(MAX_WPM, Math.round(wpm)));
}

exports.DEFAULT_WPM=DEFAULT_WPM;
exports.MIN_WPM=MIN_WPM;
exports.MAX_WPM=MAX_WPM;
exports.timing=timing;
exports.farnsworthTiming=farnsworthTiming;
exports.duration=duration;
exports.formatDuration=formatDuration;
},
"core/stats.js":function(require,exports){
/**
 * Morse code statistics calculator
 * @see https://morsecodeapp.com
 */

                                             
const { duration, formatDuration, DEFAULT_WPM }=require("core/timing.js");

/**
 * Compute statistics for a morse code string.
 *
 * @example
 * ```ts
 * stats('... --- ...')
 * // { dots: 6, dashes: 3, signals: 9, characters: 3, words: 1, ... }
 * ```
 */
function stats(morse        , wpm         = DEFAULT_WPM)             {
  const dots = (morse.match(/\./g) || []).length;
  const dashes = (morse.match(/-/g) || []).length;

  // Characters = groups of consecutive dots/dashes
  const words = morse.split(/\s*\/\s*/).filter(Boolean);
  let characters = 0;
  for (const word of words) {
    const letters = word.trim().split(/\s+/).filter(Boolean);
    characters += letters.length;
  }

  const durationMs = duration(morse, wpm);
  const durationSec = (durationMs / 1000).toFixed(1);

  return {
    dots,
    dashes,
    signals: dots + dashes,
    characters,
    words: words.length,
    durationMs,
    durationSec,
    durationFormatted: formatDuration(durationMs),
  };
}

exports.stats=stats;
},
"core/validate.js":function(require,exports){
/**
 * Morse code validation utilities
 * @see https://morsecodeapp.com
 */

                                            
const { getCharset }=require("core/charsets/index.js");

/**
 * Check if a string is valid morse code (only contains dots, dashes, spaces, slashes).
 */
function isValidMorse(morse        )          {
  return /^[.\-\s/]+$/.test(morse.trim());
}

/**
 * Check if all characters in text can be encoded with the given charset.
 * Returns true if every non-space character has a mapping.
 */
function isEncodable(text        , charset            = 'itu')          {
  const cs = getCharset(charset);
  for (const ch of text) {
    if (ch === ' ' || ch === '\t' || ch === '\n') continue;
    if (cs.charToMorse[ch.toUpperCase()] === undefined) return false;
  }
  return true;
}

/**
 * Check if all morse patterns can be decoded with the given charset.
 * Returns true if every morse group has a mapping.
 */
function isDecodable(morse        , charset            = 'itu')          {
  if (!isValidMorse(morse)) return false;
  const cs = getCharset(charset);
  const words = morse.split(/\s*\/\s*/).filter(Boolean);
  for (const word of words) {
    const patterns = word.trim().split(/\s+/).filter(Boolean);
    for (const pattern of patterns) {
      if (cs.morseToChar[pattern] === undefined) return false;
    }
  }
  return true;
}

/**
 * Find characters in text that cannot be encoded.
 * Useful for showing users which characters are unsupported.
 */
function findInvalidChars(text        , charset            = 'itu')           {
  const cs = getCharset(charset);
  const invalid = new Set        ();
  for (const ch of text) {
    if (ch === ' ' || ch === '\t' || ch === '\n') continue;
    if (cs.charToMorse[ch.toUpperCase()] === undefined) {
      invalid.add(ch);
    }
  }
  return [...invalid];
}

/**
 * Find morse patterns that cannot be decoded.
 */
function findInvalidPatterns(morse        , charset            = 'itu')           {
  const cs = getCharset(charset);
  const invalid = new Set        ();
  const words = morse.split(/\s*\/\s*/).filter(Boolean);
  for (const word of words) {
    const patterns = word.trim().split(/\s+/).filter(Boolean);
    for (const pattern of patterns) {
      if (cs.morseToChar[pattern] === undefined) {
        invalid.add(pattern);
      }
    }
  }
  return [...invalid];
}

exports.isValidMorse=isValidMorse;
exports.isEncodable=isEncodable;
exports.isDecodable=isDecodable;
exports.findInvalidChars=findInvalidChars;
exports.findInvalidPatterns=findInvalidPatterns;
},
"audio/scheduler.js":function(require,exports){
/**
 * Morse → timed event scheduler.
 * Converts a morse string and timing values into a timeline of tone/silence events.
 * Used by both MorsePlayer and WAV export for consistent audio generation.
 *
 * @see https://morsecodeapp.com
 */

                                                     

/** A single event in the playback schedule */
                                
                   
                           
                                                  
                
                                 
                   
                                       
                          
                                                              
                     
                                                  
                     
 

/**
 * Build a schedule of tones and silences from a morse string.
 *
 * @param morse - Standard morse string (dots, dashes, spaces, slashes)
 * @param timings - Timing values from timing() or farnsworthTiming()
 * @returns Array of timed events
 */
function buildSchedule(
  morse        ,
  timings              ,
)                  {
  const trimmed = morse.trim();
  if (!trimmed) return [];

  const events                  = [];
  let cursor = 0;
  let charIndex = 0;

  const words = trimmed.split(/\s*\/\s*/);

  for (let wi = 0; wi < words.length; wi++) {
    if (wi > 0) {
      events.push({ type: 'silence', start: cursor, duration: timings.interWord });
      cursor += timings.interWord;
    }

    const word = words[wi];
    if (!word) continue;
    const letters = word.trim().split(/\s+/);

    for (let li = 0; li < letters.length; li++) {
      if (li > 0) {
        events.push({ type: 'silence', start: cursor, duration: timings.interChar });
        cursor += timings.interChar;
      }

      const morseChar = letters[li];
      if (!morseChar) continue;

      for (let si = 0; si < morseChar.length; si++) {
        if (si > 0) {
          events.push({ type: 'silence', start: cursor, duration: timings.intraChar });
          cursor += timings.intraChar;
        }

        const isDash = morseChar.charAt(si) === '-';
        const duration = isDash ? timings.dash : timings.dot;
        events.push({
          type: 'tone',
          start: cursor,
          duration,
          signal: isDash ? 'dash' : 'dot',
          morseChar,
          charIndex,
        });
        cursor += duration;
      }

      charIndex++;
    }
  }

  return events;
}

/**
 * Get total duration of a schedule in milliseconds.
 */
function scheduleDuration(events                 )         {
  if (events.length === 0) return 0;
  const last = events[events.length - 1] ;
  return Math.round(last.start + last.duration);
}

exports.buildSchedule=buildSchedule;
exports.scheduleDuration=scheduleDuration;
},
"audio/player.js":function(require,exports){
/**
 * MorsePlayer — Web Audio API morse code playback.
 * Plays morse code as audio with configurable frequency, waveform, and timing.
 * Supports play/pause/stop, gain envelope, and event callbacks.
 *
 * @see https://morsecodeapp.com
 */

const { encode }=require("core/encode.js");
const { timing, farnsworthTiming, DEFAULT_WPM }=require("core/timing.js");
const { buildSchedule, scheduleDuration,                    }=require("audio/scheduler.js");
             
                     
              
              
               
                      
                    

const DEFAULT_FREQUENCY = 600;
const DEFAULT_VOLUME = 80;
const DEFAULT_WAVEFORM               = 'sine';
const DEFAULT_ENVELOPE                      = { attack: 0.01, release: 0.01 };
const MIN_FREQUENCY = 200;
const MAX_FREQUENCY = 2000;
const PROGRESS_INTERVAL = 50; // ms

/**
 * Web Audio API morse code player.
 *
 * @example
 * ```ts
 * const player = new MorsePlayer({ wpm: 20, frequency: 600 });
 * await player.play('Hello World');
 * ```
 */
class MorsePlayer {
  // --- Configurable properties ---
          _wpm        ;
          _frequency        ;
          _waveform              ;
          _volume        ;
          _farnsworth         ;
          _farnsworthWpm        ;
          _envelope                     ;

  // --- State ---
          _state              = 'idle';
          _totalTime         = 0;

  // --- Audio context ---
          ctx                     ;
          ownCtx         ;
          masterGain                  = null;
          oscillators                   = [];
          gainNodes             = [];

  // --- Playback tracking ---
          toneEvents                  = [];
          playStartCtxTime         = 0;
          pauseElapsed         = 0;
          progressTimer                                        = null;
          endTimer                                       = null;
          playResolve                      = null;
          nextSignalIdx         = 0;
          lastFiredCharIdx         = -1;
          charTextMap           = [];

  // --- Callbacks ---
          _onPlay             ;
          _onPause             ;
          _onResume             ;
          _onStop             ;
          _onEnd             ;
          _onSignal                                                      ;
          _onCharacter                                                           ;
          _onProgress                                               ;

  constructor(options                     ) {
    this._wpm = clamp(options?.wpm ?? DEFAULT_WPM, 1, 60);
    this._frequency = clamp(options?.frequency ?? DEFAULT_FREQUENCY, MIN_FREQUENCY, MAX_FREQUENCY);
    this._waveform = options?.waveform ?? DEFAULT_WAVEFORM;
    this._volume = clamp(options?.volume ?? DEFAULT_VOLUME, 0, 100);
    this._farnsworth = options?.farnsworth ?? false;
    this._farnsworthWpm = options?.farnsworthWpm ?? 15;
    this._envelope = { ...DEFAULT_ENVELOPE, ...options?.gainEnvelope };

    if (options?.audioContext) {
      this.ctx = options.audioContext;
      this.ownCtx = false;
    } else {
      this.ctx = null;
      this.ownCtx = false;
    }

    this._onPlay = options?.onPlay;
    this._onPause = options?.onPause;
    this._onResume = options?.onResume;
    this._onStop = options?.onStop;
    this._onEnd = options?.onEnd;
    this._onSignal = options?.onSignal;
    this._onCharacter = options?.onCharacter;
    this._onProgress = options?.onProgress;
  }

  // --- Public getters / setters ---

  get state()              {
    return this._state;
  }

  get totalTime()         {
    return this._totalTime;
  }

  get currentTime()         {
    if (this._state === 'idle') return 0;
    if (this._state === 'paused') return this.pauseElapsed;
    if (!this.ctx) return 0;
    return Math.min(
      (this.ctx.currentTime - this.playStartCtxTime) * 1000,
      this._totalTime,
    );
  }

  get progress()         {
    if (this._totalTime === 0) return 0;
    return Math.min(this.currentTime / this._totalTime, 1);
  }

  get wpm()         {
    return this._wpm;
  }
  set wpm(value        ) {
    this._wpm = clamp(value, 1, 60);
  }

  get frequency()         {
    return this._frequency;
  }
  set frequency(value        ) {
    this._frequency = clamp(value, MIN_FREQUENCY, MAX_FREQUENCY);
  }

  get volume()         {
    return this._volume;
  }
  set volume(value        ) {
    this._volume = clamp(value, 0, 100);
    if (this.masterGain) {
      this.masterGain.gain.value = this._volume / 100;
    }
  }

  // --- Public methods ---

  /**
   * Play morse code audio.
   * Accepts text (auto-encodes) or raw morse (with `{ morse: true }`).
   *
   * @returns Promise that resolves when playback ends or is stopped
   */
  async play(input        , options              )                {
    if (this._state !== 'idle') {
      this.stopInternal(false);
    }

    // Determine morse string
    const isMorse = options?.morse ?? false;
    const morse = isMorse ? input : encode(input, { charset: options?.charset });

    // Build character map for callbacks
    if (!isMorse) {
      this.charTextMap = input.replace(/\s+/g, '').split('');
    } else {
      const morseLetters           = [];
      for (const word of morse.split(/\s*\/\s*/)) {
        if (!word) continue;
        for (const l of word.trim().split(/\s+/)) {
          if (l) morseLetters.push(l);
        }
      }
      this.charTextMap = morseLetters;
    }

    // Build timing
    const t = this._farnsworth
      ? farnsworthTiming(this._farnsworthWpm, this._wpm)
      : timing(this._wpm);

    // Build schedule
    const schedule = buildSchedule(morse, t);
    this.toneEvents = schedule.filter(e => e.type === 'tone');
    this._totalTime = scheduleDuration(schedule);
    this.nextSignalIdx = 0;
    this.lastFiredCharIdx = -1;

    if (this.toneEvents.length === 0) return;

    // Ensure AudioContext
    await this.ensureContext();

    // Master gain (volume control)
    this.masterGain = this.ctx .createGain();
    this.masterGain.gain.value = this._volume / 100;
    this.masterGain.connect(this.ctx .destination);

    // Schedule all tones with gain envelopes
    const now = this.ctx .currentTime;
    this.playStartCtxTime = now;
    this.pauseElapsed = 0;

    for (const event of this.toneEvents) {
      const startSec = now + event.start / 1000;
      const durationSec = event.duration / 1000;
      const endSec = startSec + durationSec;

      const osc = this.ctx .createOscillator();
      osc.type = this._waveform;
      osc.frequency.value = this._frequency;

      const gain = this.ctx .createGain();
      const attack = Math.min(this._envelope.attack, durationSec / 2);
      const release = Math.min(this._envelope.release, durationSec / 2);

      // Gain envelope: silence → attack → sustain → release → silence
      gain.gain.setValueAtTime(0, startSec);
      gain.gain.linearRampToValueAtTime(1, startSec + attack);
      if (durationSec > attack + release) {
        gain.gain.setValueAtTime(1, endSec - release);
      }
      gain.gain.linearRampToValueAtTime(0, endSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startSec);
      osc.stop(endSec + 0.05); // small buffer for clean release

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    }

    this._state = 'playing';
    this._onPlay?.();

    // Start progress polling
    this.startProgressPolling();

    // Return promise that resolves on natural end or stop
    return new Promise      ((resolve) => {
      this.playResolve = resolve;
      this.endTimer = setTimeout(() => {
        this.handlePlaybackEnd();
      }, this._totalTime + 100);
    });
  }

  /** Pause playback. Suspends the AudioContext. */
  pause()       {
    if (this._state !== 'playing' || !this.ctx) return;

    this.pauseElapsed = (this.ctx.currentTime - this.playStartCtxTime) * 1000;
    this.ctx.suspend();
    this.stopProgressPolling();

    this._state = 'paused';
    this._onPause?.();
  }

  /** Resume playback from paused state. */
  async resume()                {
    if (this._state !== 'paused' || !this.ctx) return;

    await this.ctx.resume();
    this._state = 'playing';
    this.startProgressPolling();
    this._onResume?.();
  }

  /** Stop playback and reset to idle. */
  stop()       {
    this.stopInternal(true);
  }

  /** Dispose of all resources. Call when done with the player. */
  dispose()       {
    this.stopInternal(false);
    if (this.ctx && this.ownCtx) {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
  }

  // --- Internal ---

          async ensureContext()                {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.ownCtx = true;
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

          stopInternal(fireCallback         )       {
    this.stopProgressPolling();

    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }

    // Disconnect all audio nodes
    for (const osc of this.oscillators) {
      try { osc.stop(); } catch { /* already stopped */ }
      try { osc.disconnect(); } catch { /* already disconnected */ }
    }
    for (const gain of this.gainNodes) {
      try { gain.disconnect(); } catch { /* already disconnected */ }
    }
    this.oscillators = [];
    this.gainNodes = [];

    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch { /* */ }
      this.masterGain = null;
    }

    // Resume suspended context so it's usable for next play()
    if (this._state === 'paused' && this.ctx) {
      this.ctx.resume().catch(() => {});
    }

    this._state = 'idle';
    this.pauseElapsed = 0;

    if (fireCallback) {
      this._onStop?.();
    }

    if (this.playResolve) {
      const resolve = this.playResolve;
      this.playResolve = null;
      resolve();
    }
  }

          handlePlaybackEnd()       {
    this.stopProgressPolling();
    this.fireRemainingEvents();

    // Cleanup audio nodes
    for (const osc of this.oscillators) {
      try { osc.disconnect(); } catch { /* */ }
    }
    for (const gain of this.gainNodes) {
      try { gain.disconnect(); } catch { /* */ }
    }
    this.oscillators = [];
    this.gainNodes = [];

    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch { /* */ }
      this.masterGain = null;
    }

    this._state = 'idle';
    this.endTimer = null;
    this._onEnd?.();

    if (this.playResolve) {
      const resolve = this.playResolve;
      this.playResolve = null;
      resolve();
    }
  }

          startProgressPolling()       {
    this.progressTimer = setInterval(() => {
      this.pollProgress();
    }, PROGRESS_INTERVAL);
  }

          stopProgressPolling()       {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

          pollProgress()       {
    const elapsed = this.currentTime;

    this._onProgress?.(elapsed, this._totalTime);

    // Fire onSignal / onCharacter for newly-passed tones
    while (this.nextSignalIdx < this.toneEvents.length) {
      const event = this.toneEvents[this.nextSignalIdx] ;
      if (event.start <= elapsed) {
        if (event.signal) {
          this._onSignal?.(event.signal, event.charIndex ?? 0);
        }

        // Fire onCharacter when the last signal of a character is reached
        const nextEvent = this.toneEvents[this.nextSignalIdx + 1];
        const charFinished = !nextEvent || nextEvent.charIndex !== event.charIndex;
        if (
          charFinished &&
          event.charIndex !== undefined &&
          event.charIndex !== this.lastFiredCharIdx
        ) {
          this.lastFiredCharIdx = event.charIndex;
          const charText = this.charTextMap[event.charIndex] ?? '';
          this._onCharacter?.(charText, event.morseChar ?? '', event.charIndex);
        }

        this.nextSignalIdx++;
      } else {
        break;
      }
    }
  }

          fireRemainingEvents()       {
    while (this.nextSignalIdx < this.toneEvents.length) {
      const event = this.toneEvents[this.nextSignalIdx] ;
      if (event.signal) {
        this._onSignal?.(event.signal, event.charIndex ?? 0);
      }

      const nextEvent = this.toneEvents[this.nextSignalIdx + 1];
      const charFinished = !nextEvent || nextEvent.charIndex !== event.charIndex;
      if (
        charFinished &&
        event.charIndex !== undefined &&
        event.charIndex !== this.lastFiredCharIdx
      ) {
        this.lastFiredCharIdx = event.charIndex;
        const charText = this.charTextMap[event.charIndex] ?? '';
        this._onCharacter?.(charText, event.morseChar ?? '', event.charIndex);
      }

      this.nextSignalIdx++;
    }

    this._onProgress?.(this._totalTime, this._totalTime);
  }
}

function clamp(value        , min        , max        )         {
  return Math.max(min, Math.min(max, value));
}

exports.MorsePlayer=MorsePlayer;
},
"audio/wav.js":function(require,exports){
/**
 * WAV file generation — converts morse code to WAV audio data.
 * Pure computation — works in Node.js, Bun, Deno, and browsers.
 *
 * @see https://morsecodeapp.com
 */

const { encode }=require("core/encode.js");
const { timing, farnsworthTiming }=require("core/timing.js");
const { buildSchedule, scheduleDuration }=require("audio/scheduler.js");
                                                           

const DEFAULT_SAMPLE_RATE = 44100;
const DEFAULT_FREQUENCY = 600;
const DEFAULT_VOLUME = 80;
const DEFAULT_WPM = 20;
const DEFAULT_ATTACK = 0.01;
const DEFAULT_RELEASE = 0.01;

/**
 * Generate WAV audio data from text or morse code.
 * Returns raw WAV file bytes as a Uint8Array.
 *
 * @example
 * ```ts
 * const wav = toWav('SOS');
 * const wav = toWav('... --- ...', { morse: true, frequency: 800 });
 * ```
 */
function toWav(input        , options             )             {
  const opts = resolveOptions(options);
  const morse = opts.morse ? input : encode(input, { charset: opts.charset });

  const t = opts.farnsworth && opts.farnsworthWpm !== undefined
    ? farnsworthTiming(opts.farnsworthWpm, opts.wpm)
    : timing(opts.wpm);

  const schedule = buildSchedule(morse, t);
  const totalMs = scheduleDuration(schedule);

  if (totalMs === 0) return createWavFile(new Float32Array(0), opts.sampleRate);

  const totalSamples = Math.ceil((totalMs / 1000) * opts.sampleRate);
  const samples = new Float32Array(totalSamples);
  const volume = opts.volume / 100;
  const tones = schedule.filter(e => e.type === 'tone');

  for (const tone of tones) {
    const startSample = Math.floor((tone.start / 1000) * opts.sampleRate);
    const endSample = Math.min(
      Math.floor(((tone.start + tone.duration) / 1000) * opts.sampleRate),
      totalSamples,
    );
    const durationSec = tone.duration / 1000;
    const effectiveAttack = Math.min(opts.gainEnvelope.attack, durationSec / 2);
    const effectiveRelease = Math.min(opts.gainEnvelope.release, durationSec / 2);

    for (let i = startSample; i < endSample; i++) {
      const globalT = i / opts.sampleRate;
      const localT = (i - startSample) / opts.sampleRate;

      // Gain envelope
      let envelope = 1;
      if (localT < effectiveAttack) {
        envelope = effectiveAttack > 0 ? localT / effectiveAttack : 1;
      } else if (localT > durationSec - effectiveRelease) {
        envelope = effectiveRelease > 0
          ? (durationSec - localT) / effectiveRelease
          : 1;
      }

      const signal = generateWaveform(opts.waveform, opts.frequency, globalT);
      samples[i] = signal * volume * envelope;
    }
  }

  return createWavFile(samples, opts.sampleRate);
}

/**
 * Generate a WAV Blob from text or morse code.
 *
 * @example
 * ```ts
 * const blob = toWavBlob('SOS');
 * ```
 */
function toWavBlob(input        , options             )       {
  const data = toWav(input, options);
  return new Blob([data.buffer               ], { type: 'audio/wav' });
}

/**
 * Generate a data URL of a WAV file.
 *
 * @example
 * ```ts
 * const url = toWavUrl('SOS');
 * // 'data:audio/wav;base64,...'
 * ```
 */
function toWavUrl(input        , options             )         {
  const data = toWav(input, options);
  // Build base64 data URL (chunked to avoid stack overflow on large arrays)
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

/**
 * Download a WAV file in the browser.
 * No-op in non-browser environments.
 *
 * @example
 * ```ts
 * downloadWav('SOS', { filename: 'sos.wav' });
 * ```
 */
function downloadWav(input        , options             )       {
  if (typeof document === 'undefined') return;

  const blob = toWavBlob(input, options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = options?.filename ?? 'morse.wav';
  a.click();
  URL.revokeObjectURL(url);
}

// --- Internal helpers ---

function resolveOptions(options             ) {
  return {
    wpm: clamp(options?.wpm ?? DEFAULT_WPM, 1, 60),
    frequency: clamp(options?.frequency ?? DEFAULT_FREQUENCY, 200, 2000),
    waveform: (options?.waveform ?? 'sine')                ,
    volume: clamp(options?.volume ?? DEFAULT_VOLUME, 0, 100),
    sampleRate: options?.sampleRate ?? DEFAULT_SAMPLE_RATE,
    gainEnvelope: {
      attack: options?.gainEnvelope?.attack ?? DEFAULT_ATTACK,
      release: options?.gainEnvelope?.release ?? DEFAULT_RELEASE,
    },
    farnsworth: options?.farnsworth ?? false,
    farnsworthWpm: options?.farnsworthWpm,
    charset: options?.charset,
    morse: options?.morse ?? false,
  };
}

/** Generate a single waveform sample at time t */
function generateWaveform(type              , frequency        , t        )         {
  const phase = ((frequency * t) % 1 + 1) % 1; // ensure positive phase
  switch (type) {
    case 'sine':
      return Math.sin(2 * Math.PI * frequency * t);
    case 'square':
      return phase < 0.5 ? 1 : -1;
    case 'sawtooth':
      return 2 * phase - 1;
    case 'triangle':
      return 4 * Math.abs(phase - 0.5) - 1;
    default:
      return Math.sin(2 * Math.PI * frequency * t);
  }
}

/** Write a WAV file from float samples (-1 to 1) */
function createWavFile(samples              , sampleRate        )             {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const dataSize = samples.length * bytesPerSample;
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);                                      // PCM chunk size
  view.setUint16(20, 1, true);                                       // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // byte rate
  view.setUint16(32, numChannels * bytesPerSample, true);             // block align
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(offset, Math.round(s * 32767), true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

function writeString(view          , offset        , str        )       {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function clamp(value        , min        , max        )         {
  return Math.max(min, Math.min(max, value));
}

exports.toWav=toWav;
exports.toWavBlob=toWavBlob;
exports.toWavUrl=toWavUrl;
exports.downloadWav=downloadWav;
}};const cache={};function require(id){if(!cache[id]){cache[id]={};modules[id](require,cache[id]);}return cache[id];}globalThis.ScoutMorse={...require("core/index.js"),...require("audio/scheduler.js"),...require("audio/player.js"),...require("audio/wav.js")};})();