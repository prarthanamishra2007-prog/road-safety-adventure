VOICE RECORDINGS CHECKLIST (Task B4)

WHERE TO PUT FILES
  English: audio/en/<key>.mp3
  Nepali:  audio/ne/<key>.mp3
  Use the exact lowercase key as the file name. Record every key in both languages.

EXACT KEYS TO RECORD (same list for audio/en and audio/ne)
  menu
  quiz_q1
  quiz_q2
  quiz_q3
  quiz_q4
  quiz_q5
  l1Goal
  l1Press
  l1Look
  l1LookOk
  l1WrongOrder
  l1NotZebra
  l1NoLook
  l1WaitGreen
  l1Hit
  l2Goal
  l2Controls
  l2Zebra
  l2Bus
  l2Ball
  l2Slow
  l3Goal
  l3_busGap
  l3_zebraGreen
  l3_ball
  l3_noFootpath
  l3_phone
  l3_police
  l3_bridge
  l3_jumpOff
  l3_busGap_explain
  l3_zebraGreen_explain
  l3_ball_explain
  l3_noFootpath_explain
  l3_phone_explain
  l3_police_explain
  l3_bridge_explain
  l3_jumpOff_explain
  levelDone
  mission

AFTER ADDING A FILE — DO ALL THREE STEPS
  1. Add the key to RECORDED in js/sound.js (en or ne array).
     Do not add a key before its MP3 exists, or the browser fallback voice is used.
  2. Add the file path (for example ./audio/ne/l1Goal.mp3) to the FILES list in sw.js.
  3. Bump CACHE_NAME in sw.js so the new file is cached for offline use.

RECORDING QUALITY TIPS
  - Use one friendly, clear voice for all lines.
  - Record in a quiet room, close to the microphone.
  - Save as MP3 at 64-96 kbps.
  - Keep each recording under 10 seconds.
  - Say each line slowly and warmly, like you are helping a child.
