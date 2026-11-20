// js/data/scenarios.js — the situations in Level 3 "Teach Bhai".
// Bhai is about to do something. The child decides: STOP him, or let him go.
//   unsafe: true  -> the right answer is STOP
//   unsafe: false -> the right answer is GO AHEAD
//   props         -> what is drawn on the street (see Level3TeachBhai.js -> drawProps)
// To add a new situation, copy one block and change the words. Member B owns this file.

export const SCENARIOS = [
    {
        id: "busGap",
        props: "busGap",
        unsafe: true,
        intent: {
            en: "I'll cross quickly between these parked microbuses!",
            ne: "म यी रोकिएका माइक्रोबसको बीचबाट छिटो बाटो काट्छु!",
        },
        explain: {
            en: "Drivers cannot see you between parked vehicles. Use a zebra crossing or an open place.",
            ne: "रोकिएका गाडीबीच चालकले देख्दैनन्। जेब्रा क्रसिङ वा खुला ठाउँमा जानुहोस्।",
        },
    },
    {
        id: "zebraGreen",
        props: "zebraGreen",
        unsafe: false,
        intent: {
            en: "The man is GREEN. I looked right, left, right. I'll cross on the zebra.",
            ne: "मान्छे हरियो छ। मैले दायाँ, बायाँ, दायाँ हेरें। म जेब्रा क्रसिङबाट काट्छु।",
        },
        explain: {
            en: "Correct! Green man + zebra + right-left-right look = safe.",
            ne: "ठीक! हरियो मान्छे + जेब्रा क्रसिङ + दायाँ-बायाँ-दायाँ = सुरक्षित।",
        },
    },
    {
        id: "ball",
        props: "ball",
        unsafe: true,
        intent: {
            en: "My ball! I'll run and get it!",
            ne: "मेरो बल! म दौडेर ल्याउँछु!",
        },
        explain: {
            en: "Never run onto the road after a ball. Stop, and ask an adult to help.",
            ne: "बलको पछि सडकमा कहिल्यै नदौडनुहोस्। रोकिनुहोस् र ठूला मान्छेको मद्दत लिनुहोस्।",
        },
    },
    {
        id: "noFootpath",
        props: "noFootpath",
        unsafe: false,
        intent: {
            en: "There is no footpath here. I'll walk on the right side, facing the traffic.",
            ne: "यहाँ फुटपाथ छैन। म दायाँ छेउमा, गाडीतिर फर्केर हिँड्छु।",
        },
        explain: {
            en: "Yes! Facing the traffic lets you see vehicles coming and step aside safely.",
            ne: "हो! गाडीतिर फर्केर आउँदै गरेको गाडी देखिन्छ र छेउ लाग्न सकिन्छ।",
        },
    },
    {
        id: "phone",
        props: "phone",
        unsafe: true,
        intent: {
            en: "I'll watch a cartoon on my phone while I cross the road.",
            ne: "म फोनमा कार्टुन हेर्दै बाटो काट्छु।",
        },
        explain: {
            en: "Put the phone away while crossing. Your eyes and ears must be on the road.",
            ne: "बाटो काट्दा फोन राख्नुहोस्। आँखा र कान सडकमा हुनुपर्छ।",
        },
    },
    {
        id: "police",
        props: "police",
        unsafe: true,
        intent: {
            en: "The traffic police is showing his palm to me... but the road looks empty. I'll cross!",
            ne: "ट्राफिक प्रहरीले हत्केला देखाउँदैछन्... तर सडक खाली छ। म काट्छु!",
        },
        explain: {
            en: "Always obey traffic police. A raised palm means STOP, even if the road looks empty.",
            ne: "ट्राफिक प्रहरीको इशारा मान्नुहोस्। हत्केला उठ्यो भने सडक खाली भए पनि रोक्नुहोस्।",
        },
    },
    {
        id: "bridge",
        props: "bridge",
        unsafe: false,
        intent: {
            en: "The ring road is very busy. I'll use the overhead bridge.",
            ne: "रिङरोडमा धेरै गाडी छन्। म आकाशे पुल प्रयोग गर्छु।",
        },
        explain: {
            en: "Smart choice! The bridge keeps you away from fast traffic.",
            ne: "राम्रो निर्णय! आकाशे पुलले छिटो गाडीबाट टाढा राख्छ।",
        },
    },
    {
        id: "jumpOff",
        props: "jumpOff",
        unsafe: true,
        intent: {
            en: "My stop! I'll jump off the microbus before it stops. I'm in a hurry!",
            ne: "मेरो स्टप! माइक्रोबस नरोकिँदै म हामफाल्छु। मलाई हतार छ!",
        },
        explain: {
            en: "Always wait until the vehicle stops fully, then get off on the footpath side.",
            ne: "गाडी पूरा नरोकिञ्जेल पर्खनुहोस्, अनि फुटपाथतिरबाट ओर्लनुहोस्।",
        },
    },
];
