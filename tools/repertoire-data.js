/**
 * Piano Studio — Repertoire Library, Scale Drills & Groove Lab Data
 * Self-contained browser globals (no ES module imports/exports).
 * Loaded via <script src="tools/repertoire-data.js"></script>
 *
 * Supported Note Range:
 * Natural notes: C3 to G5
 * Accidentals / Key Signature Sharps: F#3, C#4, F#4, G#4, C#5, F#5
 */
(function () {
  "use strict";

  const BEATS_4_4 = ["1", "1 &", "2", "2 &", "3", "3 &", "4", "4 &"];

  /**
   * Builds a single 8-step bar (4/4 eighth-note resolution).
   * @param {number} barNum - 1-based bar number
   * @param {Array} rhEvents - Array of { start: 0..7, dur: 1..8, id: "C4", f: "1", lyric: "...", hint: "..." }
   * @param {Array} lhEvents - Array of { start: 0..7, dur: 1..8, id: "C3", f: "5", hint: "..." }
   * @returns {Array} 8 step objects for the bar
   */
  function makeBar(barNum, rhEvents, lhEvents) {
    const steps = [];
    for (let i = 0; i < 8; i++) {
      // Find active RH event covering eighth-note index i
      let rhEv = rhEvents.find((e) => i >= e.start && i < e.start + e.dur);
      if (!rhEv) {
        rhEv = rhEvents[rhEvents.length - 1] || { start: 0, dur: 8, id: "C4", f: "1", lyric: "" };
      }
      const rhStrike = i === rhEv.start;

      // Find active LH event covering eighth-note index i
      let lhEv = lhEvents.find((e) => i >= e.start && i < e.start + e.dur);
      if (!lhEv) {
        lhEv = lhEvents[lhEvents.length - 1] || { start: 0, dur: 8, id: "C3", f: "5", hint: "" };
      }
      const lhStrike = i === lhEv.start;

      steps.push({
        bar: barNum,
        beat: BEATS_4_4[i],
        lyric: rhStrike ? (rhEv.lyric || "") : "(hold)",
        rh: {
          id: rhEv.id,
          f: String(rhEv.f),
          strike: rhStrike,
          dur: rhEv.dur,
          hint: rhEv.hint || ""
        },
        lh: {
          id: lhEv.id,
          f: String(lhEv.f),
          strike: lhStrike,
          dur: lhEv.dur,
          hint: lhEv.hint || ""
        }
      });
    }
    return steps;
  }

  /**
   * Helper to expand an 8-eighth-note LH pattern:
   * @param {Array} notes4 - 4 pairs of [id, finger, hint] repeated twice or 8 entries of [id, finger, hint]
   */
  function lhEighths(entries) {
    const list = entries.length === 4 ? entries.concat(entries) : entries;
    return list.map((item, idx) => ({
      start: idx,
      dur: 1,
      id: item[0],
      f: String(item[1]),
      hint: item[2] || ""
    }));
  }

  /**
   * Helper to expand 4 quarter-note RH events in a bar:
   * @param {Array} quarters - 4 items of [id, finger, lyric, hint]
   */
  function rhQuarters(quarters) {
    return quarters.map((q, idx) => ({
      start: idx * 2,
      dur: 2,
      id: q[0],
      f: String(q[1]),
      lyric: q[2] || q[0],
      hint: q[3] || ""
    }));
  }

  /**
   * Helper for 2 quarters + 1 half note in RH (standard phrase-ending bar):
   * @param {Array} q1 - [id, finger, lyric, hint]
   * @param {Array} q2 - [id, finger, lyric, hint]
   * @param {Array} h3 - [id, finger, lyric, hint]
   */
  function rhQuarterQuarterHalf(q1, q2, h3) {
    return [
      { start: 0, dur: 2, id: q1[0], f: String(q1[1]), lyric: q1[2] || q1[0], hint: q1[3] || "" },
      { start: 2, dur: 2, id: q2[0], f: String(q2[1]), lyric: q2[2] || q2[0], hint: q2[3] || "" },
      { start: 4, dur: 4, id: h3[0], f: String(h3[1]), lyric: h3[2] || h3[0], hint: h3[3] || "" }
    ];
  }

  // Common Left-Hand Broken Chord Patterns
  const LH_C_ALBERTI = [
    ["C3", "5", "Space 2 (All Cows) — Anchor LH pinky 5 on C3"],
    ["G3", "1", "Up a 5th to Space 4 (Grass) — LH thumb 1 on G3"],
    ["E3", "3", "Skip down a 3rd to Space 3 (Eat) — LH finger 3 on E3"],
    ["G3", "1", "Back up a 3rd to Space 4 — LH thumb 1 on G3"]
  ];

  const LH_F_INV_ALBERTI = [
    ["C3", "5", "Keep LH pinky 5 anchored on C3 (pedal bass)"],
    ["A3", "1", "Stretch LH thumb 1 up 1 step to Top Line 5 (A3)"],
    ["F3", "2", "LH index finger 2 on Line 4 (F-Clef line F3)"],
    ["A3", "1", "Back to Top Line 5 (A3) with LH thumb 1"]
  ];

  const LH_G7_ALBERTI = [
    ["C3", "5", "Anchor C3 (Space 2) with LH pinky 5"],
    ["G3", "1", "Space 4 (G3) with LH thumb 1"],
    ["F3", "2", "Line 4 (F3) — V7 tension with LH finger 2"],
    ["G3", "1", "Space 4 (G3) with LH thumb 1"]
  ];

  // ============================================================================
  // PIECE 1: TWINKLE, TWINKLE, LITTLE STAR (FULL 12-BAR SCORE)
  // ============================================================================
  const twinkleBars = [
    // Bar 1
    ...makeBar(
      1,
      rhQuarters([
        ["C4", "1", "Twin-", "Middle C (Ledger Line) — RH thumb 1"],
        ["C4", "1", "-kle,", "Repeat Middle C cleanly"],
        ["G4", "5", "twin-", "Leap up a Perfect 5th (C4 → G4, Line 2) — RH pinky 5"],
        ["G4", "5", "-kle,", "Steady G4 on Line 2"]
      ]),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 2
    ...makeBar(
      2,
      rhQuarterQuarterHalf(
        ["A4", "5", "lit-", "Shift RH pinky 5 up 1 step to Space 2 (A4 in FACE)"],
        ["A4", "5", "-tle", "Repeat A4 while LH plays F3 (Line 4)"],
        ["G4", "4", "star,", "Step down to G4 with RH ring finger 4 (hold 2 beats)"]
      ),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 3
    ...makeBar(
      3,
      rhQuarters([
        ["F4", "4", "How", "Space 1 (F4 in FACE) — RH finger 4"],
        ["F4", "4", "I", "Keep hand relaxed on F4"],
        ["E4", "3", "won-", "Line 1 (Every = E4) — RH middle finger 3"],
        ["E4", "3", "-der", "LH returns to C3-G3-E3-G3 (5-1-3-1)"]
      ]),
      lhEighths(LH_F_INV_ALBERTI.concat(LH_C_ALBERTI))
    ),
    // Bar 4
    ...makeBar(
      4,
      rhQuarterQuarterHalf(
        ["D4", "2", "what", "Doggie D (D4 under Line 1) — RH index finger 2"],
        ["D4", "2", "you", "Feel the V7 pull toward home"],
        ["C4", "1", "are!", "Resolve home to Middle C (C4) — hold for 2 beats"]
      ),
      lhEighths(LH_G7_ALBERTI.concat(LH_C_ALBERTI))
    ),
    // Bar 5 (B-Section: "Up above the world so high")
    ...makeBar(
      5,
      rhQuarters([
        ["G4", "5", "Up", "B-Section starts on G4 (Line 2) — RH finger 5"],
        ["G4", "5", "a-", "Steady pulse on G4"],
        ["F4", "4", "-bove", "Step down 2nd to Space 1 (F4) — RH finger 4"],
        ["F4", "4", "the", "Listen to LH F3 harmonize in 10ths"]
      ]),
      lhEighths(LH_C_ALBERTI.concat(LH_F_INV_ALBERTI))
    ),
    // Bar 6
    ...makeBar(
      6,
      rhQuarterQuarterHalf(
        ["E4", "3", "world", "Step down to Line 1 (E4) — RH finger 3"],
        ["E4", "3", "so", "Even eighth-note accompaniment underneath"],
        ["D4", "2", "high,", "Half-cadence pause on Doggie D (D4, finger 2)"]
      ),
      lhEighths(LH_C_ALBERTI.concat(LH_G7_ALBERTI))
    ),
    // Bar 7 ("Like a diamond in the sky")
    ...makeBar(
      7,
      rhQuarters([
        ["G4", "5", "Like", "Echo phrase: back up to G4 (Line 2, finger 5)"],
        ["G4", "5", "a", "Play slightly softer (mp echo) if you like!"],
        ["F4", "4", "dia-", "Step down to F4 (Space 1, finger 4)"],
        ["F4", "4", "-mond", "LH thumb reaches up to A3 (Top Line 5)"]
      ]),
      lhEighths(LH_C_ALBERTI.concat(LH_F_INV_ALBERTI))
    ),
    // Bar 8
    ...makeBar(
      8,
      rhQuarterQuarterHalf(
        ["E4", "3", "in", "Line 1 (E4) — RH finger 3"],
        ["E4", "3", "the", "Steady C-G-E-G broken chord"],
        ["D4", "2", "sky,", "Hold D4 (2 beats) to set up the grand return"]
      ),
      lhEighths(LH_C_ALBERTI.concat(LH_G7_ALBERTI))
    ),
    // Bar 9 (A-Section Return)
    ...makeBar(
      9,
      rhQuarters([
        ["C4", "1", "Twin-", "A-Section Return: Middle C (C4, thumb 1)"],
        ["C4", "1", "-kle,", "Solid C3-G3-E3-G3 foundation in LH"],
        ["G4", "5", "twin-", "Open 5th leap to G4 (Line 2, pinky 5)"],
        ["G4", "5", "-kle,", "Keep wrists loose and floating"]
      ]),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 10
    ...makeBar(
      10,
      rhQuarterQuarterHalf(
        ["A4", "5", "lit-", "Reach up 1 step to A4 (Space 2, finger 5)"],
        ["A4", "5", "-tle", "LH plays 5-1-2-1 (C3-A3-F3-A3)"],
        ["G4", "4", "star,", "Step down to G4 with finger 4 (so finger 4/3/2/1 are ready!)"]
      ),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 11
    ...makeBar(
      11,
      rhQuarters([
        ["F4", "4", "How", "Stepwise 5-finger descent begins: F4 (Space 1)"],
        ["F4", "4", "I", "Smooth legato connection"],
        ["E4", "3", "won-", "E4 (Line 1, finger 3)"],
        ["E4", "3", "-der", "LH switches back to C Major triad"]
      ]),
      lhEighths(LH_F_INV_ALBERTI.concat(LH_C_ALBERTI))
    ),
    // Bar 12
    ...makeBar(
      12,
      rhQuarterQuarterHalf(
        ["D4", "2", "what", "D4 (Doggie D, finger 2)"],
        ["D4", "2", "you", "Gentle ritardando (slowing down) optional"],
        ["C4", "1", "are!", "Final Tonic resolution on Middle C (C4)!"]
      ),
      lhEighths(LH_G7_ALBERTI.concat(LH_C_ALBERTI))
    )
  ];

  // ============================================================================
  // PIECE 2: ODE TO JOY — BEETHOVEN (FULL 16-BAR SCORE)
  // ============================================================================
  const LH_ODE_C_FIFTH = [
    { start: 0, dur: 4, id: "C3", f: "5", hint: "C3 Bass Anchor (Space 2: All Cows) — hold 2 beats" },
    { start: 4, dur: 4, id: "G3", f: "1", hint: "G3 Fifth (Space 4: Grass) — hold 2 beats" }
  ];
  const LH_ODE_G_SUPPORT = [
    { start: 0, dur: 4, id: "G3", f: "1", hint: "G3 Dominant Fifth (Space 4) — thumb 1" },
    { start: 4, dur: 4, id: "D3", f: "4", hint: "D3 Middle Bass Line (Compass Pivot) — finger 4" }
  ];
  const LH_ODE_F_C = [
    { start: 0, dur: 4, id: "F3", f: "2", hint: "F3 (F-Clef Line 4) — subdominant warmth" },
    { start: 4, dur: 4, id: "C3", f: "5", hint: "C3 Home Bass (Space 2) — pinky 5" }
  ];
  const LH_ODE_CADENCE = [
    { start: 0, dur: 4, id: "G3", f: "1", hint: "G3 Dominant (Space 4) — prepares home cadence" },
    { start: 4, dur: 4, id: "C3", f: "5", hint: "C3 Tonic Resolution (Space 2) — solid pinky 5" }
  ];

  const odeToJoyBars = [
    // Phrase A (Bars 1-4)
    ...makeBar(
      1,
      rhQuarters([
        ["E4", "3", "Joy-", "Line 1 (E4) — RH middle finger 3 in C 5-finger position"],
        ["E4", "3", "-ful,", "Repeat E4 with steady quarter-note weight"],
        ["F4", "4", "joy-", "Step up 2nd to Space 1 (F4) — finger 4"],
        ["G4", "5", "-ful,", "Step up 2nd to Line 2 (G4) — pinky 5"]
      ]),
      LH_ODE_C_FIFTH
    ),
    ...makeBar(
      2,
      rhQuarters([
        ["G4", "5", "we", "Start at top of 5-finger hill: G4 (pinky 5)"],
        ["F4", "4", "a-", "Step down to F4 (Space 1, finger 4)"],
        ["E4", "3", "-dore", "Step down to E4 (Line 1, finger 3)"],
        ["D4", "2", "Thee,", "Step down to Doggie D (D4, finger 2)"]
      ]),
      LH_ODE_G_SUPPORT
    ),
    ...makeBar(
      3,
      rhQuarters([
        ["C4", "1", "God", "Land on Middle C (C4, thumb 1)"],
        ["C4", "1", "of", "Repeat C4"],
        ["D4", "2", "glo-", "Step up to D4 (finger 2)"],
        ["E4", "3", "-ry,", "Step up to E4 (Line 1, finger 3)"]
      ]),
      LH_ODE_F_C
    ),
    ...makeBar(
      4,
      [
        { start: 0, dur: 3, id: "E4", f: "3", lyric: "Lord", hint: "Dotted quarter feel (or long quarter) on E4" },
        { start: 3, dur: 1, id: "D4", f: "2", lyric: "of", hint: "Quick eighth-note step down to D4 on '3 &'" },
        { start: 4, dur: 4, id: "D4", f: "2", lyric: "love!", hint: "Half-cadence rest on D4 (open ending)" }
      ],
      LH_ODE_G_SUPPORT
    ),

    // Phrase A' (Bars 5-8: ends on C4)
    ...makeBar(
      5,
      rhQuarters([
        ["E4", "3", "Hearts", "Phrase 2 begins identically on E4 (Line 1, finger 3)"],
        ["E4", "3", "un-", "Steady pulse"],
        ["F4", "4", "-fold", "Step up to F4 (Space 1)"],
        ["G4", "5", "like", "Step up to G4 (Line 2)"]
      ]),
      LH_ODE_C_FIFTH
    ),
    ...makeBar(
      6,
      rhQuarters([
        ["G4", "5", "flow'rs", "Top of C pentascale (G4)"],
        ["F4", "4", "be-", "Stepwise descent: F4"],
        ["E4", "3", "-fore", "Stepwise descent: E4"],
        ["D4", "2", "Thee,", "Stepwise descent: D4"]
      ]),
      LH_ODE_G_SUPPORT
    ),
    ...makeBar(
      7,
      rhQuarters([
        ["C4", "1", "Hail", "Middle C (C4, thumb 1)"],
        ["C4", "1", "Thee", "Repeat C4"],
        ["D4", "2", "as", "Step up to D4"],
        ["E4", "3", "the", "Step up to E4"]
      ]),
      LH_ODE_F_C
    ),
    ...makeBar(
      8,
      [
        { start: 0, dur: 3, id: "D4", f: "2", lyric: "sun", hint: "Phrase A' starts bar 8 on D4 (finger 2)" },
        { start: 3, dur: 1, id: "C4", f: "1", lyric: "a-", hint: "Eighth-note resolution to Middle C on '2 &'" },
        { start: 4, dur: 4, id: "C4", f: "1", lyric: "-bove!", hint: "Closed cadence on Middle C (C4)" }
      ],
      LH_ODE_CADENCE
    ),

    // Phrase B (Bars 9-12: "Melt the clouds of sin and sadness")
    ...makeBar(
      9,
      rhQuarters([
        ["D4", "2", "Melt", "B-Section centers on D4 (finger 2) over G pedal"],
        ["D4", "2", "the", "Repeat D4"],
        ["E4", "3", "clouds", "Step up to E4 (Line 1, finger 3)"],
        ["C4", "1", "of", "Skip down a 3rd (E4 → C4) to Middle C!"]
      ]),
      [
        { start: 0, dur: 2, id: "G3", f: "1", hint: "B-Section G3 pedal point (Space 4, thumb 1)" },
        { start: 2, dur: 2, id: "D3", f: "4", hint: "Broken 5th down to D3 (Line 3, finger 4)" },
        { start: 4, dur: 2, id: "G3", f: "1", hint: "Back to G3 (thumb 1)" },
        { start: 6, dur: 2, id: "E3", f: "3", hint: "E3 (Space 3) supports C4 in RH" }
      ]
    ),
    ...makeBar(
      10,
      [
        { start: 0, dur: 2, id: "D4", f: "2", lyric: "sin", hint: "Step up to D4 (finger 2)" },
        { start: 2, dur: 1, id: "E4", f: "3", lyric: "and", hint: "Flowing eighth-note turn: E4 (finger 3)" },
        { start: 3, dur: 1, id: "F4", f: "4", lyric: "sad-", hint: "Eighth-note peak on F4 (finger 4)" },
        { start: 4, dur: 2, id: "E4", f: "3", lyric: "-ness,", hint: "Step back to E4 (Beat 3)" },
        { start: 6, dur: 2, id: "C4", f: "1", lyric: "drive", hint: "Skip a 3rd down to Middle C (Beat 4)" }
      ],
      [
        { start: 0, dur: 4, id: "G3", f: "1", hint: "Hold G3 (Space 4) under the eighth-note turn" },
        { start: 4, dur: 4, id: "C3", f: "5", hint: "Drop to C3 (Space 2) on Beat 3" }
      ]
    ),
    ...makeBar(
      11,
      [
        { start: 0, dur: 2, id: "D4", f: "2", lyric: "the", hint: "Repeat the B-section motif: D4 (finger 2)" },
        { start: 2, dur: 1, id: "E4", f: "3", lyric: "dark", hint: "Eighth-note E4 (finger 3)" },
        { start: 3, dur: 1, id: "F4", f: "4", lyric: "of", hint: "Eighth-note F4 (finger 4)" },
        { start: 4, dur: 2, id: "E4", f: "3", lyric: "doubt", hint: "Land on E4 (Beat 3)" },
        { start: 6, dur: 2, id: "D4", f: "2", lyric: "a-", hint: "Step to D4 (instead of C4) to prepare bridge!" }
      ],
      [
        { start: 0, dur: 4, id: "G3", f: "1", hint: "G3 Dominant harmony (Space 4)" },
        { start: 4, dur: 4, id: "F3", f: "2", hint: "F3 (Line 4) builds tension into Bar 12" }
      ]
    ),
    ...makeBar(
      12,
      rhQuarterQuarterHalf(
        ["C4", "1", "-way;", "Middle C (C4, thumb 1)"],
        ["D4", "2", "Giv-", "Step up to D4 (finger 2)"],
        ["G3", "1", "-er", "LH/RH handoff on G3 (or RH thumb drops to G4/D4) — dominant suspense!"]
      ).map((ev, i) => (i === 2 ? { ...ev, id: "D4", f: "2", lyric: "(wait)", hint: "Hold D4 while LH rings low G3!" } : ev)),
      [
        { start: 0, dur: 2, id: "E3", f: "3", hint: "E3 (Space 3) in first-inversion C" },
        { start: 2, dur: 2, id: "F3", f: "2", hint: "Step up to F3 (Line 4)" },
        { start: 4, dur: 4, id: "G3", f: "1", hint: "Big G3 Dominant bell (Space 4) heralding final return!" }
      ]
    ),

    // Final Phrase A' Return (Bars 13-16)
    ...makeBar(
      13,
      rhQuarters([
        ["E4", "3", "Giv-", "Triumphant return to E4 (Line 1, finger 3)!"],
        ["E4", "3", "-er", "Full, confident tone"],
        ["F4", "4", "of", "Step up to F4 (Space 1)"],
        ["G4", "5", "im-", "Step up to G4 (Line 2)"]
      ]),
      LH_ODE_C_FIFTH
    ),
    ...makeBar(
      14,
      rhQuarters([
        ["G4", "5", "-mor-", "G4 (Line 2, pinky 5)"],
        ["F4", "4", "-tal", "F4 (Space 1, finger 4)"],
        ["E4", "3", "glad-", "E4 (Line 1, finger 3)"],
        ["D4", "2", "-ness,", "D4 (Doggie D, finger 2)"]
      ]),
      LH_ODE_G_SUPPORT
    ),
    ...makeBar(
      15,
      rhQuarters([
        ["C4", "1", "Fill", "Middle C (C4, thumb 1)"],
        ["C4", "1", "us", "Repeat C4"],
        ["D4", "2", "with", "Step up to D4"],
        ["E4", "3", "the", "Step up to E4"]
      ]),
      LH_ODE_F_C
    ),
    ...makeBar(
      16,
      [
        { start: 0, dur: 3, id: "D4", f: "2", lyric: "light", hint: "Penultimate D4 (finger 2)" },
        { start: 3, dur: 1, id: "C4", f: "1", lyric: "of", hint: "Anticipation eighth on Middle C" },
        { start: 4, dur: 4, id: "C4", f: "1", lyric: "day!", hint: "Grand Finale on Middle C (C4) + C3 in LH!" }
      ],
      LH_ODE_CADENCE
    )
  ];

  // ============================================================================
  // PIECE 3: YUNG LEAN — "AGONY" (PIANO BALLAD ARRANGEMENT, 8 BARS)
  // ============================================================================
  // Teaches the exact broken-chord LH mechanics of Twinkle over Yung Lean's
  // iconic melancholic C - Em - Am - F ballad progression.
  const LH_AGONY_C = [
    ["C3", "5", "Agony Bar 1 (C Maj): Pinky 5 on C3 (Space 2)"],
    ["G3", "1", "Thumb 1 on G3 (Space 4) — exact Twinkle LH shape!"],
    ["E3", "3", "Middle finger 3 on E3 (Space 3)"],
    ["G3", "1", "Thumb 1 gently rocks back to G3"]
  ];
  const LH_AGONY_EM = [
    ["E3", "5", "Bar 2 (E Min): Shift LH pinky to E3 (Space 3)"],
    ["B3", "1", "Thumb 1 on Boat B (B3, top of Bass Stave)"],
    ["G3", "3", "Middle finger 3 on G3 (Space 4)"],
    ["B3", "1", "Thumb 1 on Boat B (B3)"]
  ];
  const LH_AGONY_AM = [
    ["A3", "1", "Bar 3 (A Min): Thumb 1 on Top Bass Line 5 (A3)"],
    ["E3", "3", "Middle finger 3 on E3 (Space 3)"],
    ["C3", "5", "Pinky 5 on C3 (Space 2)"],
    ["E3", "3", "Middle finger 3 on E3 (Space 3)"]
  ];
  const LH_AGONY_F = [
    ["F3", "2", "Bar 4 (F Maj): Finger 2 on F-Clef Line 4 (F3)"],
    ["A3", "1", "Thumb 1 on Top Line 5 (A3)"],
    ["C3", "5", "Pinky 5 anchors low C3 (Space 2)"],
    ["A3", "1", "Thumb 1 on Top Line 5 (A3)"]
  ];

  const yungLeanAgonyBars = [
    // Bar 1: C Major — Iconic opening motif E4 - G4 - D4
    ...makeBar(
      1,
      [
        { start: 0, dur: 3, id: "E4", f: "3", lyric: "Take", hint: "Line 1 (E4) — warm, unhurried ballad touch" },
        { start: 3, dur: 1, id: "G4", f: "5", lyric: "a", hint: "Skip up a 3rd to Line 2 (G4) on the '&' of Beat 2" },
        { start: 4, dur: 4, id: "D4", f: "2", lyric: "pill", hint: "Drop a 4th to Doggie D (D4, finger 2) — wistful Cadd9 color" }
      ],
      lhEighths(LH_AGONY_C)
    ),
    // Bar 2: E Minor — E4 - G4 - B4 - G4
    ...makeBar(
      2,
      rhQuarterQuarterHalf(
        ["E4", "1", "and", "Cross/reset thumb 1 on E4 (or stay in C position)"],
        ["G4", "2", "go", "Skip up a 3rd to G4 (Line 2)"],
        ["B4", "4", "sleep...", "Reach up a 3rd to Middle Treble Line 3 (B4) — lush Em harmony"]
      ),
      lhEighths(LH_AGONY_EM)
    ),
    // Bar 3: A Minor — A4 - G4 - E4 - C4
    ...makeBar(
      3,
      rhQuarters([
        ["A4", "5", "I'm", "Space 2 (A4) — sad A Minor root in RH"],
        ["G4", "4", "chas-", "Step down to G4 (Line 2) — Am7 color"],
        ["E4", "2", "-ing", "Skip down a 3rd to E4 (Line 1)"],
        ["C4", "1", "witch-", "Skip down a 3rd to Middle C (C4) — broken Am triad in RH!"]
      ]),
      lhEighths(LH_AGONY_AM)
    ),
    // Bar 4: F Major — D4 - E4 - C4
    ...makeBar(
      4,
      rhQuarterQuarterHalf(
        ["D4", "2", "-es", "Doggie D (D4) over F Major creates a dreamy F6 chord"],
        ["E4", "3", "in", "Step up to E4 (Line 1) — Fmaj7 shimmer!"],
        ["C4", "1", "street...", "Settle onto Middle C (C4, thumb 1)"]
      ),
      lhEighths(LH_AGONY_F)
    ),
    // Bar 5: Second half ("Isolation caving in...")
    ...makeBar(
      5,
      [
        { start: 0, dur: 2, id: "E4", f: "3", lyric: "I-", hint: "Return to E4 (Line 1, finger 3)" },
        { start: 2, dur: 2, id: "G4", f: "5", lyric: "-so-", hint: "Skip up 3rd to G4 (Line 2, pinky 5)" },
        { start: 4, dur: 2, id: "E4", f: "3", lyric: "-la-", hint: "Back to E4 (Line 1)" },
        { start: 6, dur: 2, id: "D4", f: "2", lyric: "-tion", hint: "Step down to D4 (finger 2)" }
      ],
      lhEighths(LH_AGONY_C)
    ),
    // Bar 6: E Minor
    ...makeBar(
      6,
      rhQuarterQuarterHalf(
        ["E4", "3", "cav-", "E4 (Line 1) against E3 in bass"],
        ["G4", "5", "-ing", "G4 (Line 2)"],
        ["D4", "2", "in,", "Long, aching D4 (Em7 seventh interval!)"]
      ),
      lhEighths(LH_AGONY_EM)
    ),
    // Bar 7: A Minor
    ...makeBar(
      7,
      rhQuarters([
        ["C4", "1", "I", "Middle C (thumb 1)"],
        ["D4", "2", "ad-", "Step up to D4 (finger 2)"],
        ["E4", "3", "-ore", "Step up to E4 (finger 3)"],
        ["G4", "5", "you,", "Skip up 3rd to G4 (pinky 5)"]
      ]),
      lhEighths(LH_AGONY_AM)
    ),
    // Bar 8: F Majormaj7 resolution
    ...makeBar(
      8,
      rhQuarterQuarterHalf(
        ["E4", "3", "sound", "E4 over F3-A3-C3 creates the signature Agony Fmaj7 chord"],
        ["D4", "2", "of", "Step down to D4 (finger 2)"],
        ["C4", "1", "skin.", "Resolve softly to Middle C (C4)"]
      ),
      lhEighths(LH_AGONY_F)
    )
  ];

  // ============================================================================
  // PIECE 4: C418 — "SWEDEN / WET HANDS" (MINECRAFT THEME, 8 BARS)
  // ============================================================================
  // Ambient, nostalgic broken chords + floating interval skips (paired with Ode to Joy)
  const minecraftWetHandsBars = [
    // Bar 1: Gentle C Major fifth & 6th cradle
    ...makeBar(
      1,
      rhQuarterQuarterHalf(
        ["E4", "2", "E4", "Soft felt-piano touch on Line 1 (E4, finger 2)"],
        ["G4", "4", "G4", "Skip up a 3rd to Line 2 (G4, finger 4)"],
        ["A4", "5", "A4 (6th)", "Step up to Space 2 (A4, pinky 5) — C418's nostalgic 6th interval!"]
      ),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 2: Floating down to E4 - D4
    ...makeBar(
      2,
      rhQuarterQuarterHalf(
        ["G4", "4", "G4", "Step back down to G4 (Line 2)"],
        ["E4", "2", "E4", "Skip down a 3rd to E4 (Line 1)"],
        ["D4", "1", "D4", "Rest on Doggie D (D4, thumb 1) — open Cadd9 air"]
      ),
      lhEighths([
        ["G3", "1", "G3 (Space 4) — warm bass fifth"],
        ["D3", "4", "D3 (Middle Bass Line 3 — Compass Pivot)"],
        ["B3", "1", "Boat B (B3, top of Bass Stave)"],
        ["G3", "2", "G3 (Space 4)"]
      ])
    ),
    // Bar 3: Fmaj7 / A Minor lift
    ...makeBar(
      3,
      rhQuarters([
        ["C4", "1", "C4", "Middle C (C4, thumb 1)"],
        ["E4", "2", "E4", "Skip a 3rd to E4 (Line 1, finger 2)"],
        ["G4", "4", "G4", "Skip a 3rd to G4 (Line 2, finger 4) — broken Cmaj7 arpeggio"],
        ["B4", "5", "B4", "Reach up a 3rd to Middle Line 3 (B4, pinky 5)"]
      ]),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 4: Settle on A4 -> G4
    ...makeBar(
      4,
      rhQuarterQuarterHalf(
        ["A4", "4", "A4", "Space 2 (A4) — lush 3rd of F Major"],
        ["G4", "3", "G4", "Step down to Line 2 (G4)"],
        ["E4", "2", "E4", "Hold E4 (Line 1) for 2 peaceful beats"]
      ),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 5: Second phrase ("Sweden" chime motif)
    ...makeBar(
      5,
      rhQuarterQuarterHalf(
        ["G4", "3", "G4", "Start higher on Line 2 (G4, finger 3)"],
        ["A4", "4", "A4", "Step up to Space 2 (A4, finger 4)"],
        ["C5", "5", "C5", "Skip a 3rd to Space 3 (C5 in FACE, pinky 5) — sparkling high C!"]
      ),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 6: Descent B4 - G4 - E4
    ...makeBar(
      6,
      rhQuarterQuarterHalf(
        ["B4", "4", "B4", "Middle Treble Line 3 (B4, finger 4)"],
        ["G4", "2", "G4", "Skip a 3rd down to Line 2 (G4, finger 2)"],
        ["E4", "1", "E4", "Skip a 3rd down to Line 1 (E4, thumb 1)"]
      ),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 7: Penultimate cradle
    ...makeBar(
      7,
      rhQuarters([
        ["F4", "4", "F4", "Space 1 (F4 in FACE)"],
        ["E4", "3", "E4", "Line 1 (E4)"],
        ["D4", "2", "D4", "Doggie D (D4)"],
        ["E4", "3", "E4", "Gentle turn back to E4"]
      ]),
      lhEighths(LH_G7_ALBERTI)
    ),
    // Bar 8: Final peaceful C Major rest
    ...makeBar(
      8,
      [
        { start: 0, dur: 8, id: "C4", f: "1", lyric: "C4 (Hold)", hint: "Whole-note Middle C (C4) while LH finishes the broken chord" }
      ],
      lhEighths(LH_C_ALBERTI)
    )
  ];

  // ============================================================================
  // PIECE 5: RADIOHEAD — "NO SURPRISES" (ARPEGGIO OSTINATO, 8 BARS)
  // ============================================================================
  // Transposed to C Major so Bars 1-2 use the exact C -> F (I -> IV) mechanics
  // as Twinkle Bars 1-2!
  const radioheadNoSurprisesBars = [
    // Bar 1: Iconic music-box chime over C3
    ...makeBar(
      1,
      rhQuarters([
        ["C4", "1", "C4", "Music-box chime starts on Middle C (C4, thumb 1)"],
        ["A4", "5", "A4", "Leap a 6th up to Space 2 (A4, pinky 5)"],
        ["F4", "3", "F4", "Skip down a 3rd to Space 1 (F4, middle finger 3)"],
        ["A4", "5", "A4", "Back up a 3rd to Space 2 (A4, pinky 5)"]
      ]),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 2: Repeat chime over F inversion
    ...makeBar(
      2,
      rhQuarters([
        ["C4", "1", "C4", "Keep RH hand shape locked: thumb 1 on C4"],
        ["A4", "5", "A4", "Pinky 5 on A4 (Space 2)"],
        ["F4", "3", "F4", "Finger 3 on F4 (Space 1)"],
        ["A4", "5", "A4", "Notice how LH plays Twinkle's exact Bar 2 C3-A3-F3-A3!"]
      ]),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 3: Resolve arpeggio to C Major triad (C4 - G4 - E4 - G4)
    ...makeBar(
      3,
      rhQuarters([
        ["C4", "1", "C4", "Thumb 1 stays anchored on Middle C (C4)"],
        ["G4", "5", "G4", "Contract pinky 1 step inward to G4 (Line 2) — just like Twinkle!"],
        ["E4", "3", "E4", "Finger 3 on E4 (Line 1)"],
        ["G4", "5", "G4", "Pinky 5 on G4 (Line 2)"]
      ]),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 4: Minor-tinged turnaround twist (D4 - G4 - F4 - E4)
    ...makeBar(
      4,
      rhQuarters([
        ["D4", "2", "D4", "Doggie D (D4, finger 2) — poignant Dm/G turn"],
        ["G4", "5", "G4", "Skip up a 4th to G4 (Line 2, pinky 5)"],
        ["F4", "4", "F4", "Step down to F4 (Space 1, finger 4)"],
        ["E4", "3", "E4", "Step down to E4 (Line 1, finger 3)"]
      ]),
      lhEighths(LH_G7_ALBERTI)
    ),
    // Bar 5: Vocal Melody Entrance ("A heart that's full up like a landfill...")
    ...makeBar(
      5,
      rhQuarterQuarterHalf(
        ["E4", "3", "Heart", "Vocal melody enters on E4 (Line 1, finger 3)"],
        ["F4", "4", "that's", "Step up to F4 (Space 1, finger 4)"],
        ["G4", "5", "full...", "Hold G4 (Line 2, pinky 5) over the C-G-E-G bass"]
      ),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 6
    ...makeBar(
      6,
      rhQuarters([
        ["A4", "5", "up", "Space 2 (A4, pinky 5)"],
        ["G4", "4", "like", "Step down to G4 (Line 2, finger 4)"],
        ["F4", "3", "land-", "Step down to F4 (Space 1, finger 3)"],
        ["E4", "2", "-fill,", "Step down to E4 (Line 1, finger 2)"]
      ]),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 7 ("No alarms and no surprises...")
    ...makeBar(
      7,
      rhQuarters([
        ["F4", "4", "No", "Space 1 (F4, finger 4)"],
        ["E4", "3", "a-", "Line 1 (E4, finger 3)"],
        ["D4", "2", "-larms", "Doggie D (D4, finger 2)"],
        ["C4", "1", "and", "Middle C (C4, thumb 1)"]
      ]),
      lhEighths(LH_G7_ALBERTI)
    ),
    // Bar 8: Return to the music-box chime
    ...makeBar(
      8,
      rhQuarterQuarterHalf(
        ["D4", "2", "no", "D4 (finger 2)"],
        ["E4", "3", "sur-", "E4 (finger 3)"],
        ["C4", "1", "-prise.", "Resolve to Middle C (C4) as the music box fades"]
      ),
      lhEighths(LH_C_ALBERTI)
    )
  ];

  // ============================================================================
  // PIECE 6: OLD MACDONALD HAD A FARM (G MAJOR — 1 SHARP F#, 8 BARS)
  // ============================================================================
  // Module 2 RCM Foundation: Teaches Key Signature of G Major (1 sharp: F# "Father")
  // and the downward Perfect 4th interval (G4 -> D4).
  const LH_G_MAJ_BROKEN = [
    ["G3", "1", "G Major Tonic: LH thumb 1 on G3 (Space 4: Grass)"],
    ["D3", "4", "Down a Perfect 4th to D3 (Middle Bass Line 3 — Compass Pivot)"],
    ["G3", "1", "Back to G3 (Space 4)"],
    ["D3", "4", "D3 (Middle Line 3)"]
  ];
  const LH_C_SUBDOM = [
    ["C3", "5", "Subdominant IV (C3, Space 2) — pinky 5"],
    ["G3", "1", "G3 (Space 4) — thumb 1"],
    ["E3", "3", "E3 (Space 3) — finger 3"],
    ["G3", "1", "G3 (Space 4) — thumb 1"]
  ];
  const LH_D7_DOM = [
    ["D3", "4", "Dominant D3 (Middle Line 3) — finger 4"],
    ["F#3", "2", "F#3 BLACK KEY ('Father' Sharp!) — LH index finger 2"],
    ["A3", "1", "Top Bass Line 5 (A3) — thumb 1"],
    ["F#3", "2", "F#3 Sharp — feel the raised black key under finger 2"]
  ];

  const oldMacdonaldGBars = [
    // Bar 1: G4 - G4 - G4 - D4
    ...makeBar(
      1,
      rhQuarters([
        ["G4", "3", "Old", "G-Clef Line 2 (G4) — RH middle finger 3"],
        ["G4", "3", "Mac-", "Repeat G4"],
        ["G4", "3", "-Don-", "Repeat G4"],
        ["D4", "1", "-ald", "Down a Perfect 4th to Doggie D (D4) — RH thumb 1"]
      ]),
      lhEighths(LH_G_MAJ_BROKEN)
    ),
    // Bar 2: E4 - E4 - D4 (half)
    ...makeBar(
      2,
      rhQuarterQuarterHalf(
        ["E4", "2", "had", "Step up to Line 1 (E4) — RH index finger 2"],
        ["E4", "2", "a", "Repeat E4 (subdominant C harmony in LH)"],
        ["D4", "1", "farm,", "Step down to D4 (thumb 1, hold 2 beats)"]
      ),
      lhEighths(LH_C_SUBDOM.concat(LH_G_MAJ_BROKEN))
    ),
    // Bar 3: B4 - B4 - A4 - A4
    ...makeBar(
      3,
      rhQuarters([
        ["B4", "5", "E-", "Middle Treble Line 3 (B4, Compass Pivot) — RH pinky 5"],
        ["B4", "5", "-I-", " Crisp staccato or bounce on B4"],
        ["A4", "4", "E-", "Step down to Space 2 (A4) — RH ring finger 4"],
        ["A4", "4", "-I-", "LH plays D3-F#3-A3 dominant chord underneath!"]
      ]),
      lhEighths(LH_G_MAJ_BROKEN.concat(LH_D7_DOM))
    ),
    // Bar 4: G4 (whole/dotted half + pickup D4)
    ...makeBar(
      4,
      [
        { start: 0, dur: 6, id: "G4", f: "3", lyric: "-O!", hint: "Resolve to G4 (Line 2, finger 3) — hold 3 beats!" },
        { start: 6, dur: 2, id: "D4", f: "1", lyric: "And", hint: "Pickup beat 4 on D4 (thumb 1) — Perfect 4th below G4" }
      ],
      lhEighths(LH_G_MAJ_BROKEN)
    ),
    // Bar 5: G Major Scale & F#4 Spotlight Bar!
    ...makeBar(
      5,
      rhQuarters([
        ["G4", "3", "on", "Back up a 4th to G4 (Line 2, finger 3)"],
        ["F#4", "2", "his", "♯ F#4 BLACK KEY! ('Father' Sharp — Space 1 raised to black key with finger 2)"],
        ["G4", "3", "farm", "Step back up a half-step from F#4 → G4!"],
        ["D4", "1", "he", "Drop a 4th to D4 (thumb 1)"]
      ]),
      lhEighths(LH_G_MAJ_BROKEN)
    ),
    // Bar 6: E4 - E4 - D4
    ...makeBar(
      6,
      rhQuarterQuarterHalf(
        ["E4", "2", "had", "Line 1 (E4, finger 2)"],
        ["E4", "2", "some", "Repeat E4"],
        ["D4", "1", "chicks,", "D4 (thumb 1, hold 2 beats)"]
      ),
      lhEighths(LH_C_SUBDOM.concat(LH_G_MAJ_BROKEN))
    ),
    // Bar 7: B4 - B4 - A4 - A4
    ...makeBar(
      7,
      rhQuarters([
        ["B4", "5", "E-", "Middle Treble Line 3 (B4, pinky 5)"],
        ["B4", "5", "-I-", "Repeat B4"],
        ["A4", "4", "E-", "Space 2 (A4, finger 4)"],
        ["A4", "4", "-I-", "LH F#3 black key harmonizes with A4!"]
      ]),
      lhEighths(LH_G_MAJ_BROKEN.concat(LH_D7_DOM))
    ),
    // Bar 8: Final G4 tonic + F#4-G4 neighbor cadence
    ...makeBar(
      8,
      rhQuarterQuarterHalf(
        ["F#4", "2", "-O", "Leading-tone grace: F#4 Black Key (finger 2)"],
        ["D4", "1", "(quack!)", "D4 (thumb 1)"],
        ["G4", "3", "Home!", "Final G Major Tonic on G4 (Line 2, finger 3)!"]
      ),
      lhEighths(LH_D7_DOM.concat(LH_G_MAJ_BROKEN))
    )
  ];

  // ============================================================================
  // PIECE 7: LEGEND OF ZELDA — "ZELDA'S LULLABY" (G MAJOR / C MAJOR, 8 BARS)
  // ============================================================================
  // Pairs with Old MacDonald in G Major: teaches 3rd & 4th leaps, F#4/F#5 key sig,
  // and lush Cmaj7 / G Major broken-chord accompaniment.
  const LH_ZELDA_G = [
    ["G3", "5", "G Major Root (Space 4, pinky 5 in high bass position)"],
    ["B3", "3", "Boat B (B3, finger 3) — Major 3rd"],
    ["D3", "5", "Drop to D3 (Middle Bass Line 3)"],
    ["B3", "1", "Boat B (B3, thumb 1)"]
  ];
  const LH_ZELDA_C = [
    ["C3", "5", "C Major / Cmaj7 Bass (Space 2, pinky 5)"],
    ["G3", "1", "Space 4 (G3, thumb 1)"],
    ["E3", "3", "Space 3 (E3, finger 3)"],
    ["G3", "1", "Space 4 (G3, thumb 1)"]
  ];

  const zeldaLullabyBars = [
    // Bar 1: Iconic B4 -> D5 -> A4 opening
    ...makeBar(
      1,
      [
        { start: 0, dur: 4, id: "B4", f: "3", lyric: "B4", hint: "Middle Treble Line 3 (B4, Compass Pivot) — hold 2 beats" },
        { start: 4, dur: 2, id: "D5", f: "5", lyric: "D5", hint: "Skip up a 3rd (Line 3 → Line 4: Deserves = D5, pinky 5)" },
        { start: 6, dur: 2, id: "A4", f: "2", lyric: "A4", hint: "Leap down a Perfect 4th to Space 2 (A4, finger 2)" }
      ],
      lhEighths(LH_ZELDA_G)
    ),
    // Bar 2: G4 - A4 - B4 - D5 - A4
    ...makeBar(
      2,
      [
        { start: 0, dur: 1, id: "G4", f: "1", lyric: "G4", hint: "Graceful pickup on G4 (Line 2, thumb 1)" },
        { start: 1, dur: 1, id: "A4", f: "2", lyric: "A4", hint: "Eighth-note step to A4 (Space 2, finger 2)" },
        { start: 2, dur: 2, id: "B4", f: "3", lyric: "B4", hint: "Line 3 (B4, finger 3)" },
        { start: 4, dur: 2, id: "D5", f: "5", lyric: "D5", hint: "Line 4 (D5, pinky 5)" },
        { start: 6, dur: 2, id: "A4", f: "2", lyric: "A4", hint: "Settle on Space 2 (A4, finger 2)" }
      ],
      lhEighths(LH_ZELDA_C)
    ),
    // Bar 3: B4 -> D5 -> A5/G5 simplified to G5 - F#5 - D5 for 1-sharp mastery!
    ...makeBar(
      3,
      [
        { start: 0, dur: 4, id: "B4", f: "2", lyric: "B4", hint: "Shift RH slightly up: finger 2 on B4 (Line 3)" },
        { start: 4, dur: 2, id: "D5", f: "3", lyric: "D5", hint: "Finger 3 on D5 (Line 4)" },
        { start: 6, dur: 2, id: "G5", f: "5", lyric: "G5!", hint: "Soar to Top of Treble Stave (G5, pinky 5)!" }
      ],
      lhEighths(LH_ZELDA_G)
    ),
    // Bar 4: F#5 ("Father" sharp on Top Line 5!) -> D5 -> A4
    ...makeBar(
      4,
      rhQuarterQuarterHalf(
        ["F#5", "4", "F#5♯", "♯ F#5 BLACK KEY! (Top Line 5 Fudge raised to F#5 — ring finger 4)"],
        ["D5", "2", "D5", "Skip down a 3rd to Line 4 (D5, finger 2)"],
        ["A4", "1", "A4", "Down a Perfect 4th to Space 2 (A4, thumb 1)"]
      ),
      lhEighths(LH_D7_DOM)
    ),
    // Bar 5: Second Half Answer (G4 - F#4 - G4 - A4)
    ...makeBar(
      5,
      rhQuarters([
        ["G4", "2", "G4", "G-Clef Line 2 (G4, finger 2)"],
        ["F#4", "1", "F#4♯", "♯ Lower F#4 Black Key (thumb/index neighbor note)"],
        ["G4", "2", "G4", "Return to G4 (Line 2)"],
        ["B4", "4", "B4", "Skip a 3rd to Line 3 (B4, finger 4)"]
      ]),
      lhEighths(LH_ZELDA_C)
    ),
    // Bar 6: A4 - G4 - E4
    ...makeBar(
      6,
      rhQuarterQuarterHalf(
        ["A4", "4", "A4", "Space 2 (A4, finger 4)"],
        ["G4", "3", "G4", "Step down to Line 2 (G4, finger 3)"],
        ["E4", "1", "E4", "Skip down a 3rd to Line 1 (E4, thumb 1)"]
      ),
      lhEighths(LH_ZELDA_C)
    ),
    // Bar 7: Climb back via F#4 -> G4 -> A4 -> B4
    ...makeBar(
      7,
      rhQuarters([
        ["D4", "1", "D4", "Doggie D (D4, thumb 1)"],
        ["E4", "2", "E4", "Line 1 (E4, finger 2)"],
        ["F#4", "3", "F#4♯", "♯ F#4 Black Key ('Father' sharp, finger 3) — G Major scale step!"],
        ["A4", "5", "A4", "Skip to Space 2 (A4, pinky 5)"]
      ]),
      lhEighths(LH_D7_DOM)
    ),
    // Bar 8: Final G Major resolution
    ...makeBar(
      8,
      [
        { start: 0, dur: 4, id: "B4", f: "4", lyric: "B4", hint: "Major 3rd glow on Line 3 (B4)" },
        { start: 4, dur: 4, id: "G4", f: "2", lyric: "G4 (Home)", hint: "Resolve home to G4 (Line 2) over G3 in bass" }
      ],
      lhEighths(LH_ZELDA_G)
    )
  ];

  // ============================================================================
  // PIECE 8: CALL OF DUTY ZOMBIES — "DAMNED" (OSTINATO THEME, 8 BARS)
  // ============================================================================
  // Kevin Sherwood's iconic tense A Minor eighth-note pivot ostinato!
  // Teaches thumb-pivot intervals (4ths, 5ths, 6ths) against deep LH bass anchors.
  function makeDamnedRHBar(topNotes) {
    // topNotes is array of 4 upper notes; each alternates with E4 (thumb 1)
    const events = [];
    for (let i = 0; i < 4; i++) {
      const top = topNotes[i];
      events.push({
        start: i * 2,
        dur: 1,
        id: top[0],
        f: String(top[1]),
        lyric: top[0],
        hint: top[2] || `Upper melody note ${top[0]} with finger ${top[1]}`
      });
      events.push({
        start: i * 2 + 1,
        dur: 1,
        id: "E4",
        f: "1",
        lyric: "E4",
        hint: "Pivot back to Line 1 (E4) with RH thumb 1 on every '&' beat!"
      });
    }
    return events;
  }

  const codZombiesDamnedBars = [
    // Bar 1: A Minor bass (A3) — RH: A4-E4-A4-E4-B4-E4-C5-E4
    ...makeBar(
      1,
      makeDamnedRHBar([
        ["A4", "3", "A4 (Space 2) — 4th above E4 pivot"],
        ["A4", "3", "Repeat A4 (Space 2)"],
        ["B4", "4", "Step top voice up to B4 (Middle Line 3, finger 4)"],
        ["C5", "5", "Step top voice up to C5 (Space 3, pinky 5) — eerie minor 6th!"]
      ]),
      [
        { start: 0, dur: 4, id: "A3", f: "1", hint: "Deep A Minor Bass Anchor on Top Line 5 (A3, thumb 1)" },
        { start: 4, dur: 4, id: "E3", f: "3", hint: "Drop a 4th to E3 (Space 3, finger 3)" }
      ]
    ),
    // Bar 2: F Major bass (F3) — RH: A4-E4-A4-E4-B4-E4-C5-E4
    ...makeBar(
      2,
      makeDamnedRHBar([
        ["A4", "3", "Keep the exact RH ostinato locked while LH drops to F3!"],
        ["A4", "3", "A4 (Space 2) over F3 creates a tense Fmaj7 sound"],
        ["B4", "4", "B4 (Line 3) — Lydian #4 tension against F3!"],
        ["C5", "5", "C5 (Space 3, pinky 5)"]
      ]),
      [
        { start: 0, dur: 4, id: "F3", f: "2", hint: "F-Clef Line 4 (F3, finger 2) — dark VI chord shift" },
        { start: 4, dur: 4, id: "C3", f: "5", hint: "Low C3 (Space 2, pinky 5)" }
      ]
    ),
    // Bar 3: D Minor bass (D3) — RH: A4-E4-A4-E4-B4-E4-C5-E4
    ...makeBar(
      3,
      makeDamnedRHBar([
        ["A4", "3", "A4 (Space 2) — 5th above D3 bass"],
        ["A4", "3", "Keep eighth notes laser-steady like a metronome"],
        ["B4", "4", "B4 (Line 3, finger 4)"],
        ["C5", "5", "C5 (Space 3, pinky 5)"]
      ]),
      [
        { start: 0, dur: 4, id: "D3", f: "4", hint: "Middle Bass Line 3 (D3, Compass Pivot, finger 4)" },
        { start: 4, dur: 4, id: "A3", f: "1", hint: "Up a 5th to A3 (Top Line 5, thumb 1)" }
      ]
    ),
    // Bar 4: E Dominant / Phrygian turnaround (E3) — RH: B4-E4-C5-E4-B4-E4-G#4-E4!
    ...makeBar(
      4,
      makeDamnedRHBar([
        ["B4", "4", "Turnaround bar: start top voice on B4 (Line 3, finger 4)"],
        ["C5", "5", "Peak on C5 (Space 3, pinky 5)"],
        ["B4", "4", "Back down to B4 (Line 3, finger 4)"],
        ["G#4", "2", "♯ G#4 BLACK KEY! (Harmonic Minor leading tone — finger 2)"]
      ]),
      [
        { start: 0, dur: 4, id: "E3", f: "3", hint: "Dominant E3 (Space 3, finger 3)" },
        { start: 4, dur: 4, id: "B3", f: "1", hint: "Boat B (B3, thumb 1) — pulls back to A Minor" }
      ]
    ),
    // Bar 5: Second cycle with reinforced octaves/fifths in LH (A Minor)
    ...makeBar(
      5,
      makeDamnedRHBar([
        ["A4", "3", "Cycle 2: A4 (Space 2) — play slightly louder (crescendo)!"],
        ["A4", "3", "A4 (Space 2)"],
        ["B4", "4", "B4 (Line 3)"],
        ["C5", "5", "C5 (Space 3)"]
      ]),
      lhEighths([
        ["A3", "1", "Driving eighth-note LH pulse: A3 (Line 5)"],
        ["E3", "3", "E3 (Space 3)"],
        ["A3", "1", "A3 (Line 5)"],
        ["E3", "3", "E3 (Space 3)"]
      ])
    ),
    // Bar 6: F Major driving LH
    ...makeBar(
      6,
      makeDamnedRHBar([
        ["A4", "3", "A4 over pulsing F3-C3 bass"],
        ["A4", "3", "A4 (Space 2)"],
        ["B4", "4", "B4 (Line 3)"],
        ["C5", "5", "C5 (Space 3)"]
      ]),
      lhEighths([
        ["F3", "2", "F3 (Line 4)"],
        ["C3", "5", "C3 (Space 2)"],
        ["F3", "2", "F3 (Line 4)"],
        ["C3", "5", "C3 (Space 2)"]
      ])
    ),
    // Bar 7: D Minor driving LH (with D5 peak variation!)
    ...makeBar(
      7,
      makeDamnedRHBar([
        ["D5", "5", "High-tension variation: reach pinky 5 up to Line 4 (D5)!"],
        ["C5", "4", "Step top note down to C5 (Space 3, finger 4)"],
        ["B4", "3", "Step down to B4 (Line 3, finger 3)"],
        ["A4", "2", "Step down to A4 (Space 2, finger 2)"]
      ]),
      lhEighths([
        ["D3", "4", "D3 (Middle Line 3)"],
        ["A3", "1", "A3 (Top Line 5)"],
        ["D3", "4", "D3 (Middle Line 3)"],
        ["A3", "1", "A3 (Top Line 5)"]
      ])
    ),
    // Bar 8: Final E7 -> Am resolution
    ...makeBar(
      8,
      [
        { start: 0, dur: 1, id: "G#4", f: "2", lyric: "G#4♯", hint: "♯ G#4 Leading Tone (black key between G4 & A4)" },
        { start: 1, dur: 1, id: "E4", f: "1", lyric: "E4", hint: "Thumb pivot E4" },
        { start: 2, dur: 1, id: "B4", f: "4", lyric: "B4", hint: "Line 3 (B4)" },
        { start: 3, dur: 1, id: "E4", f: "1", lyric: "E4", hint: "Thumb pivot E4" },
        { start: 4, dur: 4, id: "A4", f: "3", lyric: "A4 (Resolve)", hint: "Final dark A Minor resolution on A4 + A3!" }
      ],
      [
        { start: 0, dur: 4, id: "E3", f: "3", hint: "E3 Dominant (Space 3)" },
        { start: 4, dur: 4, id: "A3", f: "1", hint: "A3 Tonic (Top Bass Line 5)" }
      ]
    )
  ];

  // ============================================================================
  // PIECE 9: TITLE FIGHT / DEFTONES / ELLIOTT SMITH / BLADEE —
  //          "DREAMY MAJ7 PROGRESSION" (8 BARS)
  // ============================================================================
  // Teaches Furmanczyk Episode 6-7 chord inversions & lush Fmaj7 - Cmaj7 - Am7 - G6
  // voicings used in Title Fight (Head in the Ceiling Fan), Deftones (Sextape),
  // Elliott Smith, Dean Blunt, and Drain Gang melodies.
  const indieCloudGrooveBars = [
    // Bar 1: Fmaj7 (LH: F3-C3-A3-C3, RH: E4 - C4 - A4 - G4)
    ...makeBar(
      1,
      rhQuarters([
        ["E4", "2", "E4 (Maj7)", "E4 over F3 bass = dreamy Fmaj7! (Title Fight / Sextape opening color)"],
        ["C4", "1", "C4 (5th)", "Middle C (thumb 1) — 1st inversion chord tone"],
        ["A4", "5", "A4 (3rd)", "Float up to Space 2 (A4, pinky 5)"],
        ["G4", "4", "G4 (9th)", "Step down to G4 (Line 2, finger 4) — lush Fmaj9 shimmer!"]
      ]),
      lhEighths([
        ["F3", "2", "Fmaj7 Root: F3 (F-Clef Line 4, finger 2)"],
        ["C3", "5", "Low 5th: C3 (Space 2, pinky 5)"],
        ["A3", "1", "Major 3rd: A3 (Top Line 5, thumb 1)"],
        ["C3", "5", "C3 (Space 2, pinky 5)"]
      ])
    ),
    // Bar 2: Cmaj7 (LH: C3-G3-E3-G3, RH: B4 - G4 - E4)
    ...makeBar(
      2,
      rhQuarterQuarterHalf(
        ["B4", "5", "B4 (Maj7)", "Middle Line 3 (B4) over C3 bass = Cmaj7!"],
        ["G4", "3", "G4 (5th)", "Skip a 3rd down to Line 2 (G4, finger 3)"],
        ["E4", "1", "E4 (3rd)", "Skip a 3rd down to Line 1 (E4, thumb 1) — pure broken triad!"]
      ),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 3: Am9 / Am7 (LH: A3-E3-C3-E3, RH: G4 - E4 - C5 - B4)
    ...makeBar(
      3,
      rhQuarters([
        ["G4", "3", "G4 (m7)", "G4 over A3 bass = Minor 7th (Am7)"],
        ["E4", "1", "E4 (5th)", "Thumb 1 on E4 (Line 1)"],
        ["C5", "5", "C5 (m3)", "Reach pinky 5 to Space 3 (C5) — Drain Gang / Bladee top-line chime"],
        ["B4", "4", "B4 (9th)", "Step down to B4 (Line 3, finger 4) — emotional Am9 tension"]
      ]),
      lhEighths(LH_AGONY_AM)
    ),
    // Bar 4: G6 / Cadd9 turnaround (LH: G3-D3-B3-D3, RH: A4 - G4 - E4)
    ...makeBar(
      4,
      rhQuarterQuarterHalf(
        ["A4", "4", "A4", "Space 2 (A4, finger 4)"],
        ["G4", "3", "G4", "Line 2 (G4, finger 3)"],
        ["E4", "2", "E4 (G6)", "E4 over G3 bass creates a warm, bittersweet G6 chord"]
      ),
      lhEighths([
        ["G3", "2", "G3 (Space 4)"],
        ["D3", "5", "D3 (Middle Line 3)"],
        ["B3", "1", "Boat B (B3, thumb 1)"],
        ["D3", "5", "D3 (Middle Line 3)"]
      ])
    ),
    // Bar 5: Second Half — Furmanczyk Triad Inversion Arpeggio Study (Fmaj7 1st Inversion)
    ...makeBar(
      5,
      rhQuarters([
        ["A4", "3", "A4", "Inversion shift: start on the 3rd (A4, Space 2)"],
        ["C5", "5", "C5", "Skip a 3rd up to Space 3 (C5, pinky 5)"],
        ["E4", "1", "E4", "Drop to thumb 1 on E4 (Line 1) — wide open voicings"],
        ["G4", "2", "G4", "Skip a 3rd to G4 (Line 2, finger 2)"]
      ]),
      lhEighths(LH_F_INV_ALBERTI)
    ),
    // Bar 6: Cmaj7 (2nd Inversion feel in RH)
    ...makeBar(
      6,
      rhQuarters([
        ["G4", "2", "G4", "5th of C (G4, Line 2)"],
        ["B4", "4", "B4", "Maj7 of C (B4, Line 3)"],
        ["C5", "5", "C5", "Half-step chime B4 → C5 (iconic indie-rock piano rub!)"],
        ["G4", "2", "G4", "Back to G4 (Line 2)"]
      ]),
      lhEighths(LH_C_ALBERTI)
    ),
    // Bar 7: Elliott Smith style descending chromatic/stepwise inner line
    ...makeBar(
      7,
      rhQuarters([
        ["A4", "5", "A4", "Space 2 (A4, pinky 5)"],
        ["G4", "4", "G4", "Line 2 (G4, finger 4)"],
        ["F4", "3", "F4", "Space 1 (F4, finger 3)"],
        ["E4", "2", "E4", "Line 1 (E4, finger 2)"]
      ]),
      lhEighths(LH_AGONY_AM)
    ),
    // Bar 8: Final Fmaj7 -> Cmaj7 unresolved dream cadence
    ...makeBar(
      8,
      rhQuarterQuarterHalf(
        ["D4", "2", "D4 (9th)", "Doggie D (D4, finger 2) — Cadd9 suspension"],
        ["E4", "3", "E4 (3rd)", "Resolve suspension up to E4 (Line 1, finger 3)"],
        ["C4", "1", "C4 (Home)", "Rest on Middle C (C4) while LH rings C-G-E-G"]
      ),
      lhEighths(LH_C_ALBERTI)
    )
  ];

  // ============================================================================
  // EXPORT 1: window.REPERTOIRE_LIBRARY
  // ============================================================================
  window.REPERTOIRE_LIBRARY = [
    {
      id: "twinkle_full",
      title: "Twinkle, Twinkle, Little Star (Full 12-Bar Score)",
      artistOrSource: "RCM Pre-Grade 1 Foundation (Mozart Ah! vous dirai-je, maman)",
      category: "rcm",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 66,
      slowBpm: 48,
      skillTaught: "LH Broken Chords (5-1-3-1 & 5-1-2-1) + RH 5th Leap & Stepwise Descent",
      pairedPieceId: "radiohead_no_surprises",
      sections: [
        { id: "all", label: "🌟 Full Song Playthrough (All 12 Bars)", startBar: 1, endBar: 12 },
        { id: "bars1_2", label: "Loop Bars 1–2 (LH Assignment: 5-1-3-1 & 5-1-2-1)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (Phrase 1 Stepwise Descent)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (B-Section 'Up Above the World')", startBar: 5, endBar: 8 },
        { id: "bars9_12", label: "Loop Bars 9–12 (Final Return & Cadence)", startBar: 9, endBar: 12 }
      ],
      steps: twinkleBars
    },
    {
      id: "ode_to_joy_full",
      title: "Ode to Joy — Beethoven (Full 16-Bar Score)",
      artistOrSource: "RCM Pre-Grade 1 / Symphony No. 9 Theme",
      category: "rcm",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 72,
      slowBpm: 52,
      skillTaught: "5-Finger Stepwise Flow, Dotted Rhythm & B-Section 3rd Skips with 2-Hand Bass",
      pairedPieceId: "minecraft_wet_hands",
      sections: [
        { id: "all", label: "🌟 Full 16-Bar Symphony Score", startBar: 1, endBar: 16 },
        { id: "bars1_4", label: "Loop Bars 1–4 (Phrase A — Open Ending on D4)", startBar: 1, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (Phrase A' — Closed Ending on C4)", startBar: 5, endBar: 8 },
        { id: "bars9_12", label: "Loop Bars 9–12 (B-Section Contrasting Middle)", startBar: 9, endBar: 12 },
        { id: "bars13_16", label: "Loop Bars 13–16 (Grand Finale Return)", startBar: 13, endBar: 16 }
      ],
      steps: odeToJoyBars
    },
    {
      id: "yung_lean_agony",
      title: "Yung Lean — 'Agony' (Piano Ballad Arrangement, 8 Bars)",
      artistOrSource: "Stranger (2017) — Grade-Matched C Major / A Minor Arrangement",
      category: "modern",
      module: 1,
      keySignature: "C Major / A Minor (0 sharps)",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 60,
      slowBpm: 46,
      skillTaught: "Slow Expressive Broken Triads (C – Em – Am – Fmaj7) + Melancholic 3rd & 4th Melody",
      pairedPieceId: "twinkle_full",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Ballad Playthrough", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (C Major → E Minor Opening)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (A Minor → Fmaj7 Resolution)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 ('Isolation Caving In' Verse)", startBar: 5, endBar: 8 }
      ],
      steps: yungLeanAgonyBars
    },
    {
      id: "minecraft_wet_hands",
      title: "C418 — 'Sweden / Wet Hands' (Minecraft Theme, 8 Bars)",
      artistOrSource: "Minecraft Volume Alpha — Ambient Felt-Piano Study",
      category: "modern",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 62,
      slowBpm: 48,
      skillTaught: "Gentle Broken-Chord Accompaniment + Nostalgic 3rd, 5th & 6th Interval Voicings",
      pairedPieceId: "ode_to_joy_full",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Ambient Theme", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Opening 6th Interval Cradle)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (Cmaj7 / Fmaj7 Arpeggio Lift)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (High C5 Chime & Peaceful Fade)", startBar: 5, endBar: 8 }
      ],
      steps: minecraftWetHandsBars
    },
    {
      id: "radiohead_no_surprises",
      title: "Radiohead — 'No Surprises' (Arpeggio Ostinato, 8 Bars)",
      artistOrSource: "OK Computer (1997) — Transposed to C Major for Module 1 I–IV Mastery",
      category: "modern",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 68,
      slowBpm: 50,
      skillTaught: "Music-Box I–IV Broken-Chord Ostinato (Identical Mechanics to Twinkle Bars 1–2!)",
      pairedPieceId: "twinkle_full",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Intro + Vocal Melody", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Signature Chime Arpeggio C4-A4-F4-A4)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (C Triad + Minor-Tinged Turnaround)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 ('A Heart That's Full Up' Melody)", startBar: 5, endBar: 8 }
      ],
      steps: radioheadNoSurprisesBars
    },
    {
      id: "old_macdonald_g",
      title: "Old MacDonald Had a Farm (G Major — 1 Sharp F#, 8 Bars)",
      artistOrSource: "RCM Module 2 Key Signature & Interval Study (Furmanczyk Ep. 3–4)",
      category: "rcm",
      module: 2,
      keySignature: "G Major (1 sharp: F#)",
      sharpsCount: 1,
      timeSignature: "4/4",
      targetBpm: 72,
      slowBpm: 54,
      skillTaught: "G Major Key Signature (F# 'Father' Black Key) + Downward Perfect 4th (G4 → D4)",
      pairedPieceId: "zelda_lullaby",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar G Major Score", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Perfect 4th Drop G4 → D4)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 ('E-I-E-I-O' with LH F#3 Sharp!)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (RH F#4 Black-Key Neighbor & Finale)", startBar: 5, endBar: 8 }
      ],
      steps: oldMacdonaldGBars
    },
    {
      id: "zelda_lullaby",
      title: "Legend of Zelda — 'Zelda's Lullaby' (G Major / C Major, 8 Bars)",
      artistOrSource: "Koji Kondo (Ocarina of Time) — G Major Key Signature Pairing",
      category: "modern",
      module: 2,
      keySignature: "G Major (1 sharp: F#)",
      sharpsCount: 1,
      timeSignature: "4/4",
      targetBpm: 68,
      slowBpm: 50,
      skillTaught: "Expressive 3rd & 4th Interval Leaps (B4–D5–A4) + High F#5 & Low F#4 Key Signature Mastery",
      pairedPieceId: "old_macdonald_g",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Royal Lullaby", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Iconic B4–D5–A4 Motif)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (High G5 Peak & F#5 Sharp!)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (F#4 Neighbor Climb & Resolution)", startBar: 5, endBar: 8 }
      ],
      steps: zeldaLullabyBars
    },
    {
      id: "cod_zombies_damned",
      title: "Call of Duty Zombies — 'Damned' (Ostinato Theme, 8 Bars)",
      artistOrSource: "Kevin Sherwood (Black Ops Zombies Menu Theme) — A Minor Ostinato",
      category: "modern",
      module: 2,
      keySignature: "A Minor / C Major",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 76,
      slowBpm: 56,
      skillTaught: "Eighth-Note Thumb-Pivot Ostinato (A4–E4–B4–E4–C5–E4) + Harmonic Minor G#4 & Bass Progression",
      pairedPieceId: "old_macdonald_g",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Zombies Theme", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Am → F Bass Under Ostinato)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (Dm → E7 Turnaround with G#4!)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (Driving Bass & High D5 Variation)", startBar: 5, endBar: 8 }
      ],
      steps: codZombiesDamnedBars
    },
    {
      id: "indie_cloud_groove",
      title: "Title Fight / Deftones / Elliott Smith / Bladee — 'Dreamy Maj7 Progression' (8 Bars)",
      artistOrSource: "Furmanczyk Ep. 6–7 Chord Inversions & Dream-Pop / Drain Gang Voicings",
      category: "modern",
      module: 2,
      keySignature: "C Major / A Minor",
      sharpsCount: 0,
      timeSignature: "4/4",
      targetBpm: 64,
      slowBpm: 48,
      skillTaught: "Triad Inversions (Root, 1st & 2nd Inv.) + Lush Fmaj7 – Cmaj7 – Am9 – G6 Voicings",
      pairedPieceId: "ode_to_joy_full",
      sections: [
        { id: "all", label: "🌟 Full 8-Bar Dreamy Progression", startBar: 1, endBar: 8 },
        { id: "bars1_2", label: "Loop Bars 1–2 (Fmaj7 → Cmaj7 Voicings)", startBar: 1, endBar: 2 },
        { id: "bars3_4", label: "Loop Bars 3–4 (Am9 Top-Line Chime → G6)", startBar: 3, endBar: 4 },
        { id: "bars5_8", label: "Loop Bars 5–8 (Inversion Arpeggios & Elliott Smith Descent)", startBar: 5, endBar: 8 }
      ],
      steps: indieCloudGrooveBars
    }
  ];

  // ============================================================================
  // EXPORT 2: window.SCALE_DRILLS
  // ============================================================================
  window.SCALE_DRILLS = [
    {
      id: "c_major_rh",
      title: "C Major 1-Octave Scale (Right Hand — The Thumb Tuck)",
      subtitle: "Furmanczyk Lesson 1 & 3 · 1-2-3-[TUCK 1]-2-3-4-5 Ascending & 5-4-3-2-1-[CROSS 3]-2-1 Descending",
      hand: "rh",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      targetBpm: 60,
      coachingRule: "Play C4(1)–D4(2)–E4(3), then smoothly sneak your thumb (1) UNDER middle finger 3 to land on F4(1) without twisting your elbow!",
      notes: [
        { stepIndex: 0, id: "C4", f: "1", label: "C4 (1)", direction: "up", badge: "Start", hint: "Middle C (Ledger Line) — RH Thumb 1" },
        { stepIndex: 1, id: "D4", f: "2", label: "D4 (2)", direction: "up", badge: "", hint: "Doggie D — Index Finger 2" },
        { stepIndex: 2, id: "E4", f: "3", label: "E4 (3)", direction: "up", badge: "Prep Tuck", hint: "Line 1 (Every) — Middle Finger 3 (prepare thumb underneath!)" },
        { stepIndex: 3, id: "F4", f: "1", label: "F4 (1 TUCK!)", direction: "up", badge: "TUCK 1", isTuck: true, hint: "THUMB TUCK! Sneak Thumb 1 under Finger 3 onto Space 1 (F4) — keep wrist level!" },
        { stepIndex: 4, id: "G4", f: "2", label: "G4 (2)", direction: "up", badge: "", hint: "Line 2 (Good) — Index Finger 2 falls naturally on G4" },
        { stepIndex: 5, id: "A4", f: "3", label: "A4 (3)", direction: "up", badge: "", hint: "Space 2 (A in FACE) — Middle Finger 3" },
        { stepIndex: 6, id: "B4", f: "4", label: "B4 (4)", direction: "up", badge: "", hint: "Middle Line 3 (Compass Pivot) — Ring Finger 4" },
        { stepIndex: 7, id: "C5", f: "5", label: "C5 (5 Top)", direction: "peak", badge: "Peak", hint: "Space 3 (C in FACE) — Pinky 5 at top of the octave!" },
        { stepIndex: 8, id: "B4", f: "4", label: "B4 (4)", direction: "down", badge: "", hint: "Come back down: Ring Finger 4 on B4" },
        { stepIndex: 9, id: "A4", f: "3", label: "A4 (3)", direction: "down", badge: "", hint: "Middle Finger 3 on A4 (Space 2)" },
        { stepIndex: 10, id: "G4", f: "2", label: "G4 (2)", direction: "down", badge: "", hint: "Index Finger 2 on G4 (Line 2)" },
        { stepIndex: 11, id: "F4", f: "1", label: "F4 (1)", direction: "down", badge: "Prep Cross", hint: "Thumb 1 on F4 (Space 1) — prepare Finger 3 to cross over!" },
        { stepIndex: 12, id: "E4", f: "3", label: "E4 (3 CROSS!)", direction: "down", badge: "CROSS 3", isTuck: true, hint: "FINGER 3 CROSSOVER! Arc Middle Finger 3 over Thumb 1 onto Line 1 (E4)" },
        { stepIndex: 13, id: "D4", f: "2", label: "D4 (2)", direction: "down", badge: "", hint: "Doggie D — Index Finger 2" },
        { stepIndex: 14, id: "C4", f: "1", label: "C4 (1 Home)", direction: "down", badge: "Home", hint: "Home on Middle C (C4) with Thumb 1!" }
      ]
    },
    {
      id: "c_major_lh_mirror",
      title: "C Major Left-Hand & Contrasting Mirror Drill (C3 → C4)",
      subtitle: "Furmanczyk Lesson 1 & 2 · LH 5-4-3-2-1-[CROSS 3]-2-1 + Symmetric Mirror Fingering",
      hand: "lh",
      module: 1,
      keySignature: "C Major (0 sharps)",
      sharpsCount: 0,
      targetBpm: 60,
      coachingRule: "Going UP in the Left Hand uses all 5 fingers first (5-4-3-2-1 from C3 to G3), then crosses Middle Finger 3 over Thumb 1 onto A3!",
      notes: [
        { stepIndex: 0, id: "C3", f: "5", label: "C3 (5)", direction: "up", badge: "Start LH", hint: "Space 2 (All Cows) — LH Pinky 5 anchored on C3" },
        { stepIndex: 1, id: "D3", f: "4", label: "D3 (4)", direction: "up", badge: "", hint: "Middle Bass Line 3 (Compass Pivot) — LH Ring Finger 4" },
        { stepIndex: 2, id: "E3", f: "3", label: "E3 (3)", direction: "up", badge: "", hint: "Space 3 (All Cows Eat) — LH Middle Finger 3" },
        { stepIndex: 3, id: "F3", f: "2", label: "F3 (2)", direction: "up", badge: "", hint: "Line 4 (F-Clef Line) — LH Index Finger 2" },
        { stepIndex: 4, id: "G3", f: "1", label: "G3 (1)", direction: "up", badge: "Prep Cross", hint: "Space 4 (Grass) — LH Thumb 1 (prepare Finger 3 crossover!)" },
        { stepIndex: 5, id: "A3", f: "3", label: "A3 (3 CROSS!)", direction: "up", badge: "CROSS 3", isTuck: true, hint: "CROSSOVER! Arc LH Middle Finger 3 over Thumb 1 onto Top Bass Line 5 (A3)" },
        { stepIndex: 6, id: "B3", f: "2", label: "B3 (2)", direction: "up", badge: "", hint: "Boat B (Top of Bass Stave) — LH Index Finger 2" },
        { stepIndex: 7, id: "C4", f: "1", label: "C4 (1 Top)", direction: "peak", badge: "Mid C", hint: "Middle C (Ledger Line) — LH Thumb 1!" },
        { stepIndex: 8, id: "B3", f: "2", label: "B3 (2)", direction: "down", badge: "", hint: "Descend: LH Index Finger 2 on Boat B (B3)" },
        { stepIndex: 9, id: "A3", f: "3", label: "A3 (3)", direction: "down", badge: "Prep Tuck", hint: "Top Line 5 (A3) — LH Finger 3 (prepare Thumb 1 tuck under!)" },
        { stepIndex: 10, id: "G3", f: "1", label: "G3 (1 TUCK!)", direction: "down", badge: "TUCK 1", isTuck: true, hint: "THUMB TUCK! Sneak LH Thumb 1 under Finger 3 onto Space 4 (G3)" },
        { stepIndex: 11, id: "F3", f: "2", label: "F3 (2)", direction: "down", badge: "", hint: "Line 4 (F3) — LH Index Finger 2" },
        { stepIndex: 12, id: "E3", f: "3", label: "E3 (3)", direction: "down", badge: "", hint: "Space 3 (E3) — LH Middle Finger 3" },
        { stepIndex: 13, id: "D3", f: "4", label: "D3 (4)", direction: "down", badge: "", hint: "Middle Line 3 (D3) — LH Ring Finger 4" },
        { stepIndex: 14, id: "C3", f: "5", label: "C3 (5 Home)", direction: "down", badge: "Home", hint: "Back home on C3 (Space 2) with LH Pinky 5!" }
      ]
    },
    {
      id: "g_major_rh_fsharp",
      title: "G Major 1-Octave Scale (Right Hand — F#5 'Father' Sharp on Finger 4)",
      subtitle: "Furmanczyk Lesson 3 · Key Signature of G Major (1 Sharp: F#) · G4 to G5",
      hand: "rh",
      module: 2,
      keySignature: "G Major (1 sharp: F#)",
      sharpsCount: 1,
      targetBpm: 60,
      coachingRule: "Same 1-2-3-[TUCK 1]-2-3-4-5 fingering as C Major, except Ring Finger 4 MUST play the raised BLACK KEY F#5 (never white F5)!",
      notes: [
        { stepIndex: 0, id: "G4", f: "1", label: "G4 (1)", direction: "up", badge: "Start G", hint: "G-Clef Line 2 (G4) — RH Thumb 1" },
        { stepIndex: 1, id: "A4", f: "2", label: "A4 (2)", direction: "up", badge: "", hint: "Space 2 (A in FACE) — Index Finger 2" },
        { stepIndex: 2, id: "B4", f: "3", label: "B4 (3)", direction: "up", badge: "Prep Tuck", hint: "Middle Line 3 (B4) — Middle Finger 3" },
        { stepIndex: 3, id: "C5", f: "1", label: "C5 (1 TUCK!)", direction: "up", badge: "TUCK 1", isTuck: true, hint: "THUMB TUCK! Sneak Thumb 1 under Finger 3 onto Space 3 (C5)" },
        { stepIndex: 4, id: "D5", f: "2", label: "D5 (2)", direction: "up", badge: "", hint: "Line 4 (Deserves = D5) — Index Finger 2" },
        { stepIndex: 5, id: "E5", f: "3", label: "E5 (3)", direction: "up", badge: "Prep ♯", hint: "Space 4 (E in FACE) — Middle Finger 3 (aim Finger 4 at the black key F#5!)" },
        { stepIndex: 6, id: "F#5", f: "4", label: "F#5 (4 SHARP!)", direction: "up", badge: "♯ BLACK KEY", isSharp: true, hint: "♯ F#5 ('Father' Sharp)! Play the BLACK KEY with Ring Finger 4 — half-step below G5!" },
        { stepIndex: 7, id: "G5", f: "5", label: "G5 (5 Top)", direction: "peak", badge: "Peak G5", hint: "Top of Treble Stave (G5) — Pinky 5!" },
        { stepIndex: 8, id: "F#5", f: "4", label: "F#5 (4 SHARP!)", direction: "down", badge: "♯ BLACK KEY", isSharp: true, hint: "Descend onto the F#5 BLACK KEY with Ring Finger 4!" },
        { stepIndex: 9, id: "E5", f: "3", label: "E5 (3)", direction: "down", badge: "", hint: "Space 4 (E5) — Middle Finger 3" },
        { stepIndex: 10, id: "D5", f: "2", label: "D5 (2)", direction: "down", badge: "", hint: "Line 4 (D5) — Index Finger 2" },
        { stepIndex: 11, id: "C5", f: "1", label: "C5 (1)", direction: "down", badge: "Prep Cross", hint: "Space 3 (C5) — Thumb 1 (prepare Finger 3 crossover)" },
        { stepIndex: 12, id: "B4", f: "3", label: "B4 (3 CROSS!)", direction: "down", badge: "CROSS 3", isTuck: true, hint: "CROSSOVER! Arc Middle Finger 3 over Thumb 1 onto Line 3 (B4)" },
        { stepIndex: 13, id: "A4", f: "2", label: "A4 (2)", direction: "down", badge: "", hint: "Space 2 (A4) — Index Finger 2" },
        { stepIndex: 14, id: "G4", f: "1", label: "G4 (1 Home)", direction: "down", badge: "Home G4", hint: "Home on G4 (Line 2) with Thumb 1!" }
      ]
    }
  ];

  // ============================================================================
  // EXPORT 3: window.GROOVE_LAB
  // ============================================================================
  // Interactive Chord Inversion & Artist Progression Explorer (Furmanczyk Ep. 6-7)
  window.GROOVE_LAB = {
    inversions: [
      {
        id: "c_root",
        name: "C Major — Root Position (Snowman Stack)",
        symbol: "C",
        inversion: "Root Position (1 - 3 - 5)",
        lh: { notes: ["C3", "E3", "G3"], fingers: ["5", "3", "1"] },
        rh: { notes: ["C4", "E4", "G4"], fingers: ["1", "3", "5"] },
        theoryTip: "Line-Line-Line (C4-E4-G4) stacked in 3rds like a snowman. Root C is on the bottom."
      },
      {
        id: "c_first_inv",
        name: "C Major — 1st Inversion (C/E)",
        symbol: "C/E",
        inversion: "1st Inversion (3 - 5 - 1)",
        lh: { notes: ["E3", "G3", "C4"], fingers: ["5", "3", "1"] },
        rh: { notes: ["E4", "G4", "C5"], fingers: ["1", "2", "5"] },
        theoryTip: "Move bottom C up an octave to C5! Note the 4th gap at the top (G4 → C5)."
      },
      {
        id: "c_second_inv",
        name: "C Major — 2nd Inversion (C/G — Twinkle Bar 1 Shape!)",
        symbol: "C/G",
        inversion: "2nd Inversion (5 - 1 - 3)",
        lh: { notes: ["C3", "G3", "E3"], fingers: ["5", "1", "3"] },
        rh: { notes: ["G4", "C5", "E5"], fingers: ["1", "3", "5"] },
        theoryTip: "5th (G) is on the bottom. Allows smooth voice-leading to F Root Position without jumping your hand!"
      },
      {
        id: "f_second_inv_twinkle",
        name: "F Major — 2nd Inversion (F/C — Twinkle Bar 2 & Radiohead Shape!)",
        symbol: "F/C",
        inversion: "2nd Inversion (5 - 1 - 3 of F)",
        lh: { notes: ["C3", "F3", "A3"], fingers: ["5", "2", "1"] },
        rh: { notes: ["C4", "F4", "A4"], fingers: ["1", "3", "5"] },
        theoryTip: "Instead of leaping your whole hand up to F-A-C, keep C on the bottom and move E→F and G→A!"
      },
      {
        id: "fmaj7_dream",
        name: "Fmaj7 — Title Fight / Deftones / Yung Lean Voicing",
        symbol: "Fmaj7",
        inversion: "Root F3 + C4-E4-A4 Upper Structure",
        lh: { notes: ["F3", "C3", "A3"], fingers: ["2", "5", "1"] },
        rh: { notes: ["C4", "E4", "A4"], fingers: ["1", "2", "5"] },
        theoryTip: "Adding E4 (the Major 7th) to an F chord creates the signature nostalgic ache of 'Agony', 'Sextape', and 'Head in the Ceiling Fan'."
      }
    ],
    progressions: [
      {
        id: "yung_lean_agony_prog",
        title: "Yung Lean — 'Agony' Ballad Loop (C – Em – Am – Fmaj7)",
        artists: "Yung Lean, Elliott Smith, Dean Blunt",
        pieceId: "yung_lean_agony",
        chords: ["C (C3-G3-E3)", "Em (E3-B3-G3)", "Am (A3-E3-C3)", "Fmaj7 (F3-A3-C4 + E4)"],
        description: "Uses the exact broken-chord mechanics of Twinkle in the Left Hand while walking down the diatonic thirds."
      },
      {
        id: "title_fight_deftones_prog",
        title: "Dreamy Maj7 / Shoegaze Loop (Fmaj7 – Cmaj7 – Am9 – G6)",
        artists: "Title Fight, Deftones (Sextape), Bladee / Drain Gang",
        pieceId: "indie_cloud_groove",
        chords: ["Fmaj7 (F3 + E4-A4)", "Cmaj7 (C3 + B4-G4-E4)", "Am9 (A3 + G4-C5-B4)", "G6 (G3 + E4)"],
        description: "Keeps common tones (E4 and G4) ringing across chord changes for a weightless, atmospheric keyboard pad."
      },
      {
        id: "radiohead_chime_prog",
        title: "Radiohead — 'No Surprises' I–IV Ostinato (C – F/C)",
        artists: "Radiohead",
        pieceId: "radiohead_no_surprises",
        chords: ["C6/9 Arpeggio", "F/C (2nd Inversion)", "C Major Triad", "Dm7 / G7 Turnaround"],
        description: "Proves why Furmanczyk's chord inversions matter: C to F/C requires moving only two fingers by 1 step!"
      },
      {
        id: "cod_zombies_prog",
        title: "Call of Duty Zombies — 'Damned' Minor Ostinato (Am – F – Dm – E7)",
        artists: "Kevin Sherwood (Treyarch Sound)",
        pieceId: "cod_zombies_damned",
        chords: ["Am (A3 + A4-E4)", "Fmaj7#11 (F3 + B4-E4)", "Dm9 (D3 + C5-E4)", "E7 (E3 + G#4-E4)"],
        description: "Locks the Right Hand into a tense thumb-pivot pattern on E4 while the Left Hand descends the Andalusian/minor cadence."
      }
    ]
  };
})();
