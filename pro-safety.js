/* Corrections to inherited instructions. Stable topic IDs are retained. */
function proPatch(id,he,en,steps,enSteps,safety,enSafety){
 const {it}=vTopic(id); it.lead={he,en};
 it.steps=steps.split('~').map((t,i)=>({text:{he:t,en:enSteps.split('~')[i]},svg:''}));
 it.tips=[];it.safety=[{he:safety,en:enSafety}];
}
proPatch('embers','גחלים נשארות חמות גם כשאין להבה. מסיימים פעילות בכיבוי מלא.','Coals stay hot without visible flames. Finish with complete extinguishing.',
'שמרו על אש קטנה בהשגחת מבוגר רציפה, במקום שמותר לכך.~לקראת הסיום הפסיקו להוסיף דלק.~כבו במים, ערבבו וחזרו על הפעולה עד שהכול קר לחלוטין.~אין להשאיר גחלים ללילה או לשאת גחלת בתוך התרמיל.',
'Keep a small fire under continuous adult supervision where permitted.~Stop adding fuel before finishing.~Douse, stir and repeat until everything is completely cold.~Do not leave embers overnight or carry them in a backpack.',
'אפר אינו כיבוי. אין לעזוב אש או גחלים ללא השגחה.','Ash is not extinguishing. Never leave fire or coals unattended.');
vTopic('embers').it.title={he:'טיפול בגחלים בסיום הפעילות',en:'Handling coals at the end'};
proPatch('smokesignals','איתות צריך למשוך עזרה בלי ליצור אירוע שרפה נוסף.','Signalling should attract help without creating a wildfire.',
'העדיפו טלפון, משרוקית, פנס, בגד בולט או מראת איתות.~הגיעו למקום נראה ובטוח והישארו יחד.~השתמשו באות המצוקה שלמדתם והקשיבו למענה.~אש אינה אמצעי תרגול לאיתות; פעלו לפי הנחיות כוחות החילוץ.',
'Prefer a phone, whistle, torch, bright cloth or signalling mirror.~Choose a safe visible location and stay together.~Use the distress signal you learned and listen for a response.~Do not light fires to practise signalling; follow rescue instructions.',
'אין לשרוף גומי, פלסטיק או צמחייה כדי לייצר עשן.','Never burn rubber, plastic or vegetation to produce smoke.');
proPatch('cooking','בישול שטח דורש כלי מתאים, יציבות והפרדה בין מזון נא למוכן.','Outdoor cooking needs suitable cookware, stability and separation of raw and ready-to-eat food.',
'בדקו שמותר להדליק והכינו מים לכיבוי; השתמשו במתקן בישול מתאים.~ייצבו את הכלי על מתקן ייעודי, הרחק ממעבר ומציוד דליק.~בדקו בשר ועוף במדחום מזון לפי הטמפרטורה הנדרשת למוצר. צבע ומיץ צלול אינם מדד מספיק.~השתמשו בהגנה יבשה לידיים, הפרידו כלים למזון נא וכבו לגמרי בסיום.',
'Check permission and prepare extinguishing water; use suitable cooking equipment.~Stabilize cookware on a purpose-made support away from paths and combustibles.~Check meat and poultry with a food thermometer to the temperature required for the food; colour and clear juices are insufficient.~Use dry hand protection, separate raw-food utensils and fully extinguish afterwards.',
'אין להפעיל מדורה, גזייה או פחמים באוהל, ברכב או בחלל סגור.','Never operate a fire, stove or charcoal in a tent, vehicle or enclosed space.');
proPatch('improvcooking','אפשר לפשט את הארוחה בלי לאלתר משטח חימום מסוכן.','Keep meals simple without improvising unsafe heated surfaces.',
'תכננו מראש מזון שאפשר להכין בכלים שברשותכם.~השתמשו בכלי ייעודי למזון ולחימום או בשיפוד מתאים.~אין לחמם אבנים לא מזוהות או להשתמש בענפים מצמח לא מזוהה.~אם חסר ציוד בטוח, בחרו מזון שאינו דורש בישול ושמרו על תנאי האחסון.',
'Plan meals compatible with your available cookware.~Use food-safe heat-rated cookware or suitable skewers.~Do not heat unidentified stones or use branches from unidentified plants.~If safe equipment is unavailable choose food needing no cooking and keep it stored appropriately.',
'אבנים עלולות להיסדק בחום וצמחים עלולים להיות רעילים.','Stones may fracture when heated and plants may be toxic.');
proPatch('starfire','תכנון גודל המדורה חשוב יותר ממבנה מרשים.','A controlled fire size matters more than an elaborate structure.',
'בחרו רק מתקן אש מאושר המתאים לתנאים.~השתמשו בכמות עץ קטנה והוסיפו בהדרגה.~אין לבנות קיר מבולים דליקים סמוך לאש או לחמם אבנים לא מתאימות.~ברוח מתחזקת הפסיקו והתחילו כיבוי מלא.',
'Use only a permitted fire facility suitable for the conditions.~Use little fuel and add it gradually.~Do not build a combustible log reflector beside the fire or heat unsuitable rocks.~If wind increases stop and extinguish completely.',
'תרגול באש רק בהשגחת מבוגר ובהתאם לכללי המקום.','Fire practice requires adult supervision and local permission.');
proPatch('water','טיפול במים מותאם למקור ולסוג הזיהום; צלילות אינה הוכחה לבטיחות.','Treatment depends on source and contamination; clear water is not proof of safety.',
'העדיפו מים ממקור שתייה מוכר והכינו כמות מספקת מראש.~בד להסרת לכלוך גס אינו מחטא מים.~לזיהום מיקרוביאלי השתמשו בשיטה בדוקה המתאימה לתנאים: הרתחה או מערכת סינון וחיטוי לפי הוראות היצרן.~חשד לדלק, חומרי הדברה, כימיקלים או מליחות: בחרו מקור אחר. הרתחה אינה מסלקת אותם.',
'Prefer a known drinking-water source and carry enough in advance.~Cloth removing coarse debris does not disinfect water.~For microbial hazards use a validated method appropriate to conditions: boiling or filtration and disinfection according to manufacturer instructions.~Suspected fuel, pesticides, chemicals or salinity require another source; boiling does not remove them.',
'מסנן אינו מסלק בהכרח נגיפים. יש לבדוק מה המוצר מסוגל לטפל בו.','A filter does not necessarily remove viruses. Check its treatment specifications.');
proPatch('findwater','תכנון נקודות מים אמינות קודם לחיפוש מאולתר בשטח.','Plan reliable water stops before relying on improvised searching.',
'בדקו לפני היציאה אילו מקורות שתייה פעילים ומה המרחק ביניהם.~אל תסתמכו על צמחייה, עקבות או ציפורים כהבטחה למים.~במחסור עצרו מאמץ בצל בטוח, העריכו את הכמות שנותרה וצרו קשר לעזרה.~אין לסטות לערוץ מסוכן או לשתות ממקור חשוד. טיפול במים תלוי בסוג הזיהום.',
'Verify operating drinking-water sources and distances before departure.~Vegetation, tracks or birds do not guarantee water.~If short, stop exertion in safe shade, assess remaining supply and contact help.~Do not enter hazardous gullies or drink suspect water; treatment depends on contamination.',
'חיפוש ממושך בשעות חמות יכול להחמיר את המצב.','Prolonged searching in heat can worsen the situation.');
proPatch('streamcrossing','הבחירה הבטוחה יכולה להיות חזרה או המתנה במקום בטוח.','Turning back or waiting in a safe place may be the right choice.',
'בדקו התרעות ותכננו מסלול עם מעבר מוסדר.~אל תיכנסו לשיטפון, לזרם חזק או למים שעומקם ותחתיתם אינם ידועים.~גם מים מתחת לברך יכולים להפיל אדם. אין סף עומק שמבטיח בטיחות.~אם המעבר אינו בטוח חזרו לנקודה בטוחה ובקשו הנחיות. חצייה טכנית דורשת הכשרה.',
'Check alerts and plan a route with an established crossing.~Do not enter floodwater, strong current or water of unknown depth and footing.~Even below-knee water can knock a person over; no depth guarantees safety.~If unsafe return to a safe point and seek advice. Technical crossings require training.',
'אין לקשור אדם לחבל בחצייה מאולתרת.','Do not tether a person during an improvised crossing.');
proPatch('raincaught','גשם ורוח מחייבים שמירת יובש ושינוי תוכנית בזמן.','Rain and wind require dry insulation and timely changes of plan.',
'לבשו שכבת גשם לפני הרטבה ושמרו שכבה יבשה בשקית פנימית.~התרחקו מערוצי זרימה ומאזורים מועדים לשיטפון.~בברקים חפשו מבנה סגור מתאים או רכב סגור; יריעה, אוהל וצוק בולט אינם מחסה בטוח מברקים.~החליפו בגד רטוב במחסה בטוח ועקבו אחר קור, רעד ובלבול.',
'Put on rain protection early and keep a dry layer in an inner waterproof bag.~Stay clear of drainage channels and flood-prone ground.~For lightning seek a suitable enclosed building or enclosed vehicle; a tarp, tent or overhang is not lightning-safe.~Change wet clothes in safe shelter and monitor cold, shivering and confusion.',
'אל תחכו לגשם מקומי כדי להתרחק מנחל בסכנת שיטפון.','Do not wait for local rain before leaving a flood-risk channel.');
proPatch('blanket','שמיכת חירום מסייעת לצמצם אובדן חום; היא אינה מחליפה בידוד עבה.','An emergency blanket helps reduce heat loss but does not replace thick insulation.',
'קראו את הוראות המוצר; אין כלל צבעים אחיד לכל השמיכות.~עטפו מעל בגדים יבשים או שכבת בידוד ושמרו את הפנים ונתיב האוויר חופשיים.~בודדו גם מהקרקע והגנו מרוח ורטיבות.~בחשד להיפותרמיה הזעיקו עזרה; אין להסתפק בשמיכה.',
'Read the product instructions; colour rules are not universal.~Wrap over dry clothing or insulation, keeping the face and airway clear.~Insulate from the ground and protect from wind and moisture.~Seek help for suspected hypothermia; the blanket alone is not treatment.',
'הרחיקו מאש וממקורות חום ישירים.','Keep away from flames and direct heat.');
proPatch('weather','תצפית בשמיים משלימה תחזית רשמית ואינה מחליפה אותה.','Sky observations complement an official forecast; they cannot replace it.',
'בדקו תחזית והתרעות לפני היציאה ובנקודות עם קליטה.~עננים מתפתחים, רעמים ורוח מתחזקת מצריכים הערכה מחדש.~אין להסיק בוודאות מענן יחיד מה יקרה ומתי.~קבעו מראש מתי חוזרים ולאן נסוגים, בהתאם לתנאים וליכולת הקבוצה.',
'Check forecasts and alerts before departure and when connected.~Developing clouds, thunder and strengthening wind require reassessment.~A single cloud cannot predict precisely what will happen or when.~Set turn-back criteria and safe retreat options for the group.',
'בספק לגבי שיטפון או ברקים שנו תוכנית מוקדם.','Change plans early when flood or lightning risk is uncertain.');
vTopic('stars').it.steps.forEach(st=>st.svg='');
vTopic('stars').it.steps[2].text={he:'המשיכו את הקו ממרק אל דובהה, החוצה משפת המרובע, בערך פי חמישה מהמרווח ביניהם. בדקו התאמה לפולאריס ולשאר הקבוצה.',en:'Extend the line from Merak through Dubhe out of the bowl, about five times their separation. Confirm Polaris using the surrounding pattern.'};
for(const it of CONTENT.knots.items){
 it.safety=[...(it.safety||[]),{he:'מדריך זה מיועד ללמידה ולקשירת ציוד. אין להשתמש בו לבדו לטיפוס, חילוץ, הרמה או אבטחה של אדם. תרגול קשירה נעשה על חבל וחפץ בלבד.',en:'This guide is for learning and equipment tasks. Do not rely on it for climbing, rescue, lifting or securing a person. Practise only with rope and objects.'}];
 it.tips=[];
}
for(const id of ['firemanchair','handcuff','munter','klemheist','prusik']){
 const it=vTopic(id).it;
 it.steps=[{text:{he:PRO_GUIDES[id].why,en:'This is a technical or historical knot. Its use depends on the rope, equipment and task.'},svg:''},{text:{he:'לומדים את המבנה והייעוד עם מדריך מוסמך. אין להעמיס אדם או לבצע מערכת בלימה מתוך מדריך זה.',en:'Learn its structure and use with a qualified instructor. Do not load a person or build a belay system from this guide.'},svg:''},{text:{he:'משווים את הקשר לדגם שנבדק בהדרכה ומתרגלים ללא עומס מסוכן.',en:'Compare with the example checked by your instructor and practise without hazardous loads.'},svg:''}];
}
vTopic('handcuff').it.lead={he:'היכרות עם מבנה של שתי לולאות מתכווננות, לתרגול על חפצים בלבד.',en:'An introduction to two adjustable loops, for practice on objects only.'};
vTopic('firemanchair').it.lead={he:'היכרות היסטורית עם קשר בעל שתי לולאות; אינו תחליף לרתמה תקנית.',en:'Historical introduction to a two-loop knot; not a replacement for a certified harness.'};
PRO_GUIDES.packing.sources=['packing'];
for(const key of Object.keys(CONTENT))for(const it of CONTENT[key].items){
 if(!PRO_GUIDES[it.id])throw new Error('Missing guide: '+it.id);
 if(key==='fire')PRO_GUIDES[it.id].sources=['fire'];
}
// Store a review date, not a claim of clinical certification.
const PRO_REVIEW_DATE='2026-09-21';

PRO_SOURCES.water={name:'CDC · Safe water',url:'https://www.cdc.gov/water-emergency/about/index.html'};
PRO_SOURCES.lightning={name:'National Weather Service · Lightning outdoors',url:'https://www.weather.gov/safety/lightning-outdoors'};
PRO_SOURCES.cooking={name:'USDA · Food thermometers',url:'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-thermometers'};
PRO_GUIDES.water.sources=['water'];PRO_GUIDES.findwater.sources=['water'];PRO_GUIDES.raincaught.sources=['lightning'];PRO_GUIDES.cooking.sources=['fire','cooking'];
for(const [key,c] of Object.entries(CONTENT))if(key!=='firstaid')for(const it of c.items){if(PRO_GUIDES[it.id].why)it.lead.he=PRO_GUIDES[it.id].why.split('. ')[0]+'.';}

// Keep the decorative practice description consistent with edition-4 artwork.
{const it=vTopic('monkeysfist').it;it.lead.en='A decorative knot with three perpendicular sets of wraps.';it.steps[3].text={he:'הדקו בהדרגה לכדור מסודר. לתרגול דקורטיבי השתמשו בחבל בלבד או בליבה רכה, בלי אבן או מתכת.',en:'Tighten gradually into a neat ball. For decorative practice use rope alone or a soft core, with no stone or metal.'};it.safety[0]={he:'דגם דקורטיבי לתרגול בלבד; אין להשליך אותו לעבר אנשים.',en:'Decorative practice model only; never throw it toward people.'};}
