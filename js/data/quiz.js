// js/data/quiz.js — the 5 questions asked BEFORE and AFTER playing.
// Comparing the two scores is how we measure learning (our KPI: +20%).
// Every question matches something the levels teach.
// "correct" = position of the right answer (0 = first option).
// Keep the SAME questions for pre and post, otherwise the comparison is not fair.

export const QUIZ = [
    {
        id: "q1",
        topic: "Look right first",
        q: {
            en: "In Nepal, which way should you look FIRST before crossing the road?",
            ne: "नेपालमा बाटो काट्नु अघि पहिले कता हेर्नुपर्छ?",
        },
        options: [
            { en: "Left", ne: "बायाँ" },
            { en: "Right", ne: "दायाँ" },
            { en: "Up at the sky", ne: "माथि आकाशतिर" },
        ],
        correct: 1,
    },
    {
        id: "q2",
        topic: "Red pedestrian light",
        q: {
            en: "The pedestrian light shows a RED man. What should you do?",
            ne: "पैदल यात्रीको बत्तीमा रातो मान्छे देखिन्छ। के गर्ने?",
        },
        options: [
            { en: "Run across quickly", ne: "छिटो दौडेर काट्ने" },
            { en: "Cross slowly", ne: "बिस्तारै काट्ने" },
            { en: "Wait for the green man", ne: "हरियो मान्छे नआउञ्जेल पर्खने" },
        ],
        correct: 2,
    },
    {
        id: "q3",
        topic: "Safe place to cross",
        q: {
            en: "Where is the SAFEST place to cross the road?",
            ne: "बाटो काट्ने सबैभन्दा सुरक्षित ठाउँ कुन हो?",
        },
        options: [
            { en: "At the zebra crossing", ne: "जेब्रा क्रसिङमा" },
            { en: "From behind a parked bus", ne: "रोकिएको बसको पछाडिबाट" },
            { en: "Between parked cars", ne: "रोकिएका गाडीहरूको बीचबाट" },
        ],
        correct: 0,
    },
    {
        id: "q4",
        topic: "Ball on the road",
        q: {
            en: "Your ball rolls onto the road. What should you do?",
            ne: "तपाईंको बल सडकमा गयो। के गर्ने?",
        },
        options: [
            { en: "Run and get it fast", ne: "छिटो दौडेर ल्याउने" },
            { en: "Ask an adult to help", ne: "ठूला मान्छेलाई मद्दत माग्ने" },
            { en: "Shout at the cars", ne: "गाडीलाई कराउने" },
        ],
        correct: 1,
    },
    {
        id: "q5",
        topic: "No footpath",
        q: {
            en: "There is NO footpath. Where should you walk?",
            ne: "फुटपाथ छैन। कहाँ हिँड्ने?",
        },
        options: [
            { en: "In the middle of the road", ne: "सडकको बीचमा" },
            { en: "On the left, with my back to the traffic", ne: "बायाँ, गाडीतिर पिठ्युँ फर्काएर" },
            { en: "On the right, facing the traffic", ne: "दायाँ, आउँदै गरेको गाडीतिर फर्केर" },
        ],
        correct: 2,
    },
];
