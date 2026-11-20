// js/i18n.js — all on-screen words in English (en) and Nepali (ne).
// To change a word, change it here. Never type words directly inside scenes.
// NOTE FOR MEMBER B: the Nepali lines are a first draft. Ask a Nepali teacher
// to check every line before the pilot.

import { Store } from "./storage.js";

const STRINGS = {
    en: {
        title: "Road Safety Adventure",
        subtitle: "Learn to use the road safely!",
        newPlayer: "New Player",
        continue: "Continue",
        teacher: "Teacher",
        language: "नेपाली",
        level1: "1. Cross to School",
        level2: "2. Be the Driver",
        level3: "3. Teach Bhai",
        locked: "Locked",
        badges: "Badges",
        finalQuiz: "Final Quiz",
        player: "Player",
        startHint: "Tap NEW PLAYER to begin",
        // quiz
        preQuizTitle: "Before we play: 5 quick questions",
        postQuizTitle: "Well done! 5 questions again",
        quizDone: "Thank you!",
        next: "Next",
        // level 1
        l1Goal: "Help Sita reach school. Use the ZEBRA CROSSING.",
        l1Press: "Press the button on the pole (or SPACE) and wait for the GREEN man.",
        l1Look: "Stop at the edge. Look RIGHT, then LEFT, then RIGHT again.",
        lookLeft: "Look Left",
        lookRight: "Look Right",
        pushButton: "Push Button",
        l1WaitGreen: "Wait! The man is RED. Wait for GREEN.",
        l1NotZebra: "Cross only on the ZEBRA CROSSING.",
        l1NoLook: "Stop! First look RIGHT, LEFT, RIGHT.",
        l1Hit: "Beep beep! A vehicle stopped for you. Always wait and look.",
        l1LookOk: "Good looking! Now cross when the man is GREEN.",
        l1WrongOrder: "In Nepal, vehicles come from the RIGHT first. Look RIGHT first!",
        // level 2
        l2Goal: "You are the microbus driver. Take children to school safely.",
        l2Controls: "Hold GO to drive. Press BRAKE to stop.",
        go: "GO",
        brake: "BRAKE",
        speed: "Speed",
        points: "points",
        l2SchoolZone: "SCHOOL ZONE - SLOW",
        l2Zebra: "Children are crossing! Drivers must STOP at the zebra crossing.",
        l2Bus: "A child came out from behind a bus. The driver could not see her. Never cross there.",
        l2Ball: "A ball rolled out, and a child ran after it. Never chase a ball onto the road.",
        l2Good: "Well driven! You stopped in time.",
        l2Slow: "Drive slowly near schools. Children can appear suddenly.",
        // level 3
        l3Goal: "Bhai is walking to school. Tap STOP if he is about to do something dangerous.",
        stopBhai: "STOP, Bhai!",
        l3FaceTraffic: "No footpath here",
        goAhead: "Go ahead",
        // complete
        levelDone: "Level complete!",
        mistakes: "Mistakes",
        replay: "Play again",
        menu: "Menu",
        badgeNew: "New badge:",
        badge_l1: "Zebra Star",
        badge_l2: "Safe Driver",
        badge_l3: "Big Sibling",
        allDone: "You finished all levels!",
        // teacher
        teacherTitle: "Teacher Dashboard",
        players: "Players",
        avgPre: "Average score BEFORE playing",
        avgPost: "Average score AFTER playing",
        improvement: "Improvement",
        hardest: "Most missed questions (before playing)",
        download: "Download CSV",
        clear: "Clear all data",
        clearConfirm: "Tap again to confirm",
        back: "Back",
        mission: "Home mission: on your way home, find 3 road signs with your parents!",
    },
    ne: {
        title: "सडक सुरक्षा साहसिक यात्रा",
        subtitle: "सडक सुरक्षित तरिकाले प्रयोग गर्न सिकौं!",
        newPlayer: "नयाँ खेलाडी",
        continue: "जारी राख्नुहोस्",
        teacher: "शिक्षक",
        language: "English",
        level1: "१. विद्यालय जाऔं",
        level2: "२. चालक बन्नुहोस्",
        level3: "३. भाइलाई सिकाऔं",
        locked: "बन्द",
        badges: "ब्याज",
        finalQuiz: "अन्तिम प्रश्नोत्तरी",
        player: "खेलाडी",
        startHint: "सुरु गर्न 'नयाँ खेलाडी' थिच्नुहोस्",
        preQuizTitle: "खेल्नु अघि: ५ वटा छोटा प्रश्न",
        postQuizTitle: "शाबास! फेरि ५ वटा प्रश्न",
        quizDone: "धन्यवाद!",
        next: "अर्को",
        l1Goal: "सीतालाई विद्यालय पुग्न मद्दत गर्नुहोस्। जेब्रा क्रसिङ प्रयोग गर्नुहोस्।",
        l1Press: "खम्बाको बटन थिच्नुहोस् (वा SPACE) र हरियो मान्छे नआउञ्जेल पर्खनुहोस्।",
        l1Look: "छेउमा रोकिनुहोस्। दायाँ, बायाँ, फेरि दायाँ हेर्नुहोस्।",
        lookLeft: "बायाँ हेर",
        lookRight: "दायाँ हेर",
        pushButton: "बटन थिच",
        l1WaitGreen: "पर्खनुहोस्! मान्छे रातो छ। हरियो हुन पर्खनुहोस्।",
        l1NotZebra: "जेब्रा क्रसिङबाट मात्र बाटो काट्नुहोस्।",
        l1NoLook: "रोकिनुहोस्! पहिले दायाँ, बायाँ, दायाँ हेर्नुहोस्।",
        l1Hit: "पीप पीप! गाडी तपाईंका लागि रोकियो। सधैं पर्खनुहोस् र हेर्नुहोस्।",
        l1LookOk: "राम्रो! अब मान्छे हरियो भएपछि बाटो काट्नुहोस्।",
        l1WrongOrder: "नेपालमा गाडी पहिले दायाँबाट आउँछ। पहिले दायाँ हेर्नुहोस्!",
        l2Goal: "तपाईं माइक्रोबसको चालक हो। बच्चाहरूलाई सुरक्षित विद्यालय पुर्‍याउनुहोस्।",
        l2Controls: "चलाउन GO थिचिराख्नुहोस्। रोक्न BRAKE थिच्नुहोस्।",
        go: "GO",
        brake: "BRAKE",
        speed: "गति",
        points: "अंक",
        l2SchoolZone: "विद्यालय क्षेत्र - बिस्तारै",
        l2Zebra: "बच्चाहरू बाटो काट्दैछन्! चालकले जेब्रा क्रसिङमा रोक्नुपर्छ।",
        l2Bus: "बसको पछाडिबाट बच्ची निस्किइन्। चालकले देख्न सकेनन्। त्यहाँबाट कहिल्यै नकाट्नुहोस्।",
        l2Ball: "बल सडकमा आयो, बच्चा पछि दौडियो। बलको पछि सडकमा नदौडनुहोस्।",
        l2Good: "राम्रो चलाउनुभयो! समयमै रोक्नुभयो।",
        l2Slow: "विद्यालय नजिक बिस्तारै चलाउनुहोस्।",
        l3Goal: "भाइ विद्यालय जाँदैछ। खतरा देखे STOP थिच्नुहोस्।",
        stopBhai: "रोकिऊ, भाइ!",
        l3FaceTraffic: "यहाँ फुटपाथ छैन",
        goAhead: "जाऊ",
        levelDone: "तह पूरा भयो!",
        mistakes: "गल्ती",
        replay: "फेरि खेल",
        menu: "मेनु",
        badgeNew: "नयाँ ब्याज:",
        badge_l1: "जेब्रा तारा",
        badge_l2: "सुरक्षित चालक",
        badge_l3: "ठूलो दाजु/दिदी",
        allDone: "तपाईंले सबै तह पूरा गर्नुभयो!",
        teacherTitle: "शिक्षक ड्यासबोर्ड",
        players: "खेलाडी",
        avgPre: "खेल्नु अघिको औसत अंक",
        avgPost: "खेलेपछिको औसत अंक",
        improvement: "सुधार",
        hardest: "धेरै गल्ती भएका प्रश्न (खेल्नु अघि)",
        download: "CSV डाउनलोड",
        clear: "सबै डाटा मेटाउनुहोस्",
        clearConfirm: "पक्का गर्न फेरि थिच्नुहोस्",
        back: "पछाडि",
        mission: "घरको मिसन: घर जाँदा आमाबुबासँग ३ वटा ट्राफिक चिन्ह खोज्नुहोस्!",
    },
};

export function lang() {
    return Store.getLang();
}

// t("title") -> the word in the current language
export function t(key) {
    const l = lang();
    return (STRINGS[l] && STRINGS[l][key]) || STRINGS.en[key] || key;
}

// For data objects that carry both languages: { en: "...", ne: "..." }
export function tx(obj) {
    if (!obj) return "";
    return obj[lang()] || obj.en;
}
