/**
 * Piano Studio — Adaptive Learning & Spaced-Repetition Engine
 * Exposes `window.AdaptiveEngine` for browser + GitHub Pages compatibility.
 *
 * Persistent Storage Key: `pianoStudio_adaptive_v2`
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'pianoStudio_adaptive_v2';

  // Full diatonic note range from C3 (Bass) to G5 (Treble)
  var ALL_NOTE_IDS = [
    'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
    'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
    'C5', 'D5', 'E5', 'F5', 'G5'
  ];

  var INTERVAL_NUMS = [2, 3, 4, 5];

  // Default pedagogical counterparts so taste-swapping works even if a piece object
  // does not explicitly pass `modernCounterpartId`
  var DEFAULT_COUNTERPARTS = {
    'petzold_minuet_g': {
      counterpartId: 'yung_lean_agony',
      counterpartTitle: 'Yung Lean — Agony',
      sharedSkill: '3/4 waltz pulse, G-clef/F-clef hand balance, and expressive phrase shaping without rushing'
    },
    'yung_lean_agony': {
      counterpartId: 'petzold_minuet_g',
      counterpartTitle: 'Petzold — Minuet in G Major (BWV Anh. 114)',
      sharedSkill: '3/4 waltz meter, steady left-hand accompaniment, and cantabile right-hand melody'
    },
    'schumann_melody': {
      counterpartId: 'minecraft_wet_hands',
      counterpartTitle: 'C418 — Wet Hands (Minecraft)',
      sharedSkill: 'Legato right-hand phrasing over a flowing broken-chord left-hand accompaniment (Lesson 5 balance)'
    },
    'minecraft_wet_hands': {
      counterpartId: 'schumann_melody',
      counterpartTitle: 'Robert Schumann — Melody (Op. 68, No. 1)',
      sharedSkill: 'Even broken-chord accompaniment and singing top-voice control'
    },
    'clementi_sonatina': {
      counterpartId: 'radiohead_no_surprises',
      counterpartTitle: 'Radiohead — No Surprises (Intro Ostinato)',
      sharedSkill: 'Crystal-clear repeated arpeggio patterns, rotational wrist release, and metronomic precision'
    },
    'radiohead_no_surprises': {
      counterpartId: 'clementi_sonatina',
      counterpartTitle: 'Muzio Clementi — Sonatina in C Major (Op. 36, No. 1)',
      sharedSkill: 'Clean finger independence, steady eighth-note subdivision, and classical articulation'
    },
    'burgnmuller_arabesque': {
      counterpartId: 'cod_zombies_damned',
      counterpartTitle: 'Kevin Sherwood — Damned (CoD Zombies Theme)',
      sharedSkill: 'Minor-key rhythmic drive, crisp left-hand chord attacks, and high-energy right-hand ostinato'
    },
    'burgmuller_arabesque': {
      counterpartId: 'cod_zombies_damned',
      counterpartTitle: 'Kevin Sherwood — Damned (CoD Zombies Theme)',
      sharedSkill: 'Minor-key rhythmic drive, crisp left-hand chord attacks, and high-energy right-hand ostinato'
    },
    'cod_zombies_damned': {
      counterpartId: 'burgmuller_arabesque',
      counterpartTitle: 'Friedrich Burgmüller — Arabesque (Op. 100, No. 2)',
      sharedSkill: 'A-minor agility, crisp staccato/legato contrast, and tightly synchronized hands'
    },
    'zelda_lullaby': {
      counterpartId: 'petzold_minuet_g',
      counterpartTitle: 'Petzold — Minuet in G Major (BWV Anh. 114)',
      sharedSkill: 'Graceful 3/4 meter, wide interval leaps, and warm melodic voicing'
    }
  };

  function createDefaultNoteStats() {
    var map = {};
    // Slightly elevated initial weights on the classic ledger/crossover trouble spots
    var initialFocus = { B3: 1.25, C4: 1.25, D4: 1.25, F3: 1.2, G4: 1.15 };
    for (var i = 0; i < ALL_NOTE_IDS.length; i++) {
      var id = ALL_NOTE_IDS[i];
      map[id] = {
        attempts: 0,
        correct: 0,
        streak: 0,
        avgMs: 0,
        weight: initialFocus[id] || 1.0
      };
    }
    return map;
  }

  function createDefaultIntervalStats() {
    var map = {};
    for (var i = 0; i < INTERVAL_NUMS.length; i++) {
      var num = String(INTERVAL_NUMS[i]);
      map[num] = {
        attempts: 0,
        correct: 0,
        streak: 0,
        weight: 1.0
      };
    }
    return map;
  }

  function createDefaultState() {
    return {
      version: 2,
      updatedAt: new Date().toISOString(),
      noteStats: createDefaultNoteStats(),
      intervalStats: createDefaultIntervalStats(),
      pieceProgress: {},
      sessionHistory: []
    };
  }

  var state = loadState();

  function loadState() {
    var fresh = createDefaultState();
    try {
      var raw = global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) return fresh;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return fresh;

      // Merge noteStats safely
      if (parsed.noteStats && typeof parsed.noteStats === 'object') {
        for (var noteId in parsed.noteStats) {
          if (Object.prototype.hasOwnProperty.call(parsed.noteStats, noteId)) {
            var ns = parsed.noteStats[noteId];
            fresh.noteStats[noteId] = {
              attempts: Number(ns.attempts) || 0,
              correct: Number(ns.correct) || 0,
              streak: Number(ns.streak) || 0,
              avgMs: Number(ns.avgMs) || 0,
              weight: typeof ns.weight === 'number' && !isNaN(ns.weight) ? ns.weight : 1.0
            };
          }
        }
      }

      // Merge intervalStats safely
      if (parsed.intervalStats && typeof parsed.intervalStats === 'object') {
        for (var intKey in parsed.intervalStats) {
          if (Object.prototype.hasOwnProperty.call(parsed.intervalStats, intKey)) {
            var is = parsed.intervalStats[intKey];
            fresh.intervalStats[String(intKey)] = {
              attempts: Number(is.attempts) || 0,
              correct: Number(is.correct) || 0,
              streak: Number(is.streak) || 0,
              weight: typeof is.weight === 'number' && !isNaN(is.weight) ? is.weight : 1.0
            };
          }
        }
      }

      if (parsed.pieceProgress && typeof parsed.pieceProgress === 'object') {
        fresh.pieceProgress = parsed.pieceProgress;
      }

      if (Array.isArray(parsed.sessionHistory)) {
        fresh.sessionHistory = parsed.sessionHistory.slice(0, 50);
      }

      return fresh;
    } catch (err) {
      return fresh;
    }
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      if (global.localStorage) {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (err) {
      // Ignore quota/storage errors in private browsing
    }
    return state;
  }

  function resetState() {
    state = createDefaultState();
    saveState();
    return state;
  }

  function ensureNoteStat(noteId) {
    var key = String(noteId || 'C4').trim();
    if (!state.noteStats[key]) {
      state.noteStats[key] = {
        attempts: 0,
        correct: 0,
        streak: 0,
        avgMs: 0,
        weight: 1.0
      };
    }
    return state.noteStats[key];
  }

  function ensureIntervalStat(intervalNum) {
    var key = String(intervalNum || 2).replace(/[^0-9]/g, '') || '2';
    if (!state.intervalStats[key]) {
      state.intervalStats[key] = {
        attempts: 0,
        correct: 0,
        streak: 0,
        weight: 1.0
      };
    }
    return state.intervalStats[key];
  }

  /**
   * 2. Spaced-Repetition Weighted Selector Methods
   */
  function recordNoteAttempt(noteId, isCorrect, responseMs) {
    var entry = ensureNoteStat(noteId);
    var ms = typeof responseMs === 'number' && responseMs > 0 ? Math.round(responseMs) : 1800;
    var slowResponse = ms > 4000;

    entry.attempts += 1;
    if (entry.attempts === 1) {
      entry.avgMs = ms;
    } else {
      entry.avgMs = Math.round(entry.avgMs * 0.72 + ms * 0.28);
    }

    if (isCorrect) {
      entry.correct += 1;
      entry.streak += 1;
    } else {
      entry.streak = 0;
    }

    if (!isCorrect || slowResponse) {
      // Missed or hesitant (> 4000ms) -> boost spaced-repetition priority
      var boost = !isCorrect ? 1.2 : 0.65;
      entry.weight = Math.min(5.0, Number((entry.weight + boost).toFixed(2)));
    } else {
      // Fast and accurate -> decay weight toward 0.6 (floor 0.5)
      entry.weight = Math.max(0.5, Number((entry.weight * 0.82).toFixed(2)));
    }

    saveState();
    return entry;
  }

  function recordIntervalAttempt(intervalNum, isCorrect) {
    var entry = ensureIntervalStat(intervalNum);
    entry.attempts += 1;
    if (isCorrect) {
      entry.correct += 1;
      entry.streak += 1;
      entry.weight = Math.max(0.5, Number((entry.weight * 0.82).toFixed(2)));
    } else {
      entry.streak = 0;
      entry.weight = Math.min(5.0, Number((entry.weight + 1.2).toFixed(2)));
    }
    saveState();
    return entry;
  }

  function pickWeightedNote(notePool, lastNoteId) {
    if (!Array.isArray(notePool) || notePool.length === 0) {
      return null;
    }
    if (notePool.length === 1) {
      return notePool[0];
    }

    var candidates = notePool.filter(function (n) {
      var id = typeof n === 'string' ? n : n && n.id;
      return id !== lastNoteId;
    });
    if (candidates.length === 0) {
      candidates = notePool.slice();
    }

    var totalWeight = 0;
    var weights = [];
    for (var i = 0; i < candidates.length; i++) {
      var item = candidates[i];
      var id = typeof item === 'string' ? item : item.id;
      var st = ensureNoteStat(id);
      var w = typeof st.weight === 'number' && st.weight > 0 ? st.weight : 1.0;
      weights.push(w);
      totalWeight += w;
    }

    var r = Math.random() * totalWeight;
    var accum = 0;
    for (var j = 0; j < candidates.length; j++) {
      accum += weights[j];
      if (r <= accum) {
        return candidates[j];
      }
    }
    return candidates[candidates.length - 1];
  }

  function pickWeightedInterval(lastIntervalNum) {
    var pool = INTERVAL_NUMS.slice();
    if (lastIntervalNum && pool.length > 1) {
      pool = pool.filter(function (n) {
        return Number(n) !== Number(lastIntervalNum);
      });
    }

    var totalWeight = 0;
    var weights = [];
    for (var i = 0; i < pool.length; i++) {
      var st = ensureIntervalStat(pool[i]);
      var w = typeof st.weight === 'number' && st.weight > 0 ? st.weight : 1.0;
      weights.push(w);
      totalWeight += w;
    }

    var r = Math.random() * totalWeight;
    var accum = 0;
    for (var j = 0; j < pool.length; j++) {
      accum += weights[j];
      if (r <= accum) {
        return pool[j];
      }
    }
    return pool[pool.length - 1];
  }

  function getWeakSpotsSummary() {
    var totalAttempts = 0;
    var totalCorrect = 0;
    var attemptedNotes = [];

    for (var noteId in state.noteStats) {
      if (Object.prototype.hasOwnProperty.call(state.noteStats, noteId)) {
        var st = state.noteStats[noteId];
        totalAttempts += st.attempts || 0;
        totalCorrect += st.correct || 0;
        if ((st.attempts || 0) > 0) {
          var acc = Math.round((st.correct / st.attempts) * 100);
          attemptedNotes.push({
            id: noteId,
            weight: st.weight,
            attempts: st.attempts,
            correct: st.correct,
            accuracyPct: acc,
            avgMs: st.avgMs || 0
          });
        }
      }
    }

    // Sort by highest weight first, then lowest accuracy, then slowest response
    attemptedNotes.sort(function (a, b) {
      if (b.weight !== a.weight) return b.weight - a.weight;
      if (a.accuracyPct !== b.accuracyPct) return a.accuracyPct - b.accuracyPct;
      return b.avgMs - a.avgMs;
    });

    var weakNotes;
    if (attemptedNotes.length > 0) {
      weakNotes = attemptedNotes.slice(0, 3).map(function (n) {
        return n.id;
      });
    } else {
      weakNotes = ['B3', 'C4', 'D4', 'F3'];
    }

    var intervalList = [];
    for (var k = 0; k < INTERVAL_NUMS.length; k++) {
      var num = String(INTERVAL_NUMS[k]);
      var ist = ensureIntervalStat(num);
      totalAttempts += ist.attempts || 0;
      totalCorrect += ist.correct || 0;
      if ((ist.attempts || 0) > 0 || ist.weight > 1.05) {
        intervalList.push({
          interval: Number(num),
          label: num === '2' ? '2nd (Step)' : num === '3' ? '3rd (Skip)' : num + 'th',
          weight: ist.weight,
          attempts: ist.attempts,
          accuracyPct: ist.attempts > 0 ? Math.round((ist.correct / ist.attempts) * 100) : 100
        });
      }
    }

    intervalList.sort(function (a, b) {
      return b.weight - a.weight;
    });

    var weakIntervals = intervalList.length > 0
      ? intervalList.slice(0, 2).map(function (item) { return item.label; })
      : ['4th', '5th'];

    var accuracyPct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

    return {
      weakNotes: weakNotes,
      weakNoteDetails: attemptedNotes.slice(0, 3),
      weakIntervals: weakIntervals,
      accuracyPct: accuracyPct,
      totalAttempts: totalAttempts
    };
  }

  /**
   * 1c. Piece Progress & Rating Engine
   */
  function getPieceProgress(pieceId, defaults) {
    var def = defaults || {};
    var defaultTarget = Number(def.targetBpm) || 76;
    var defaultCurrent = Number(def.currentBpm || def.startBpm) || Math.max(48, Math.round(defaultTarget * 0.78));

    if (!state.pieceProgress[pieceId]) {
      state.pieceProgress[pieceId] = {
        currentBpm: defaultCurrent,
        targetBpm: defaultTarget,
        status: 'Ready to Start',
        lastRating: null,
        flaggedBars: [],
        playCount: 0,
        lastPlayed: null,
        swappedToId: null
      };
    } else {
      if (!state.pieceProgress[pieceId].targetBpm && defaultTarget) {
        state.pieceProgress[pieceId].targetBpm = defaultTarget;
      }
      if (!state.pieceProgress[pieceId].currentBpm && defaultCurrent) {
        state.pieceProgress[pieceId].currentBpm = defaultCurrent;
      }
      if (!Array.isArray(state.pieceProgress[pieceId].flaggedBars)) {
        state.pieceProgress[pieceId].flaggedBars = [];
      }
    }
    return state.pieceProgress[pieceId];
  }

  function resolveCounterpart(pieceId, pieceMeta, repertoireList) {
    var meta = pieceMeta || {};
    var counterpartId = meta.modernCounterpartId || meta.counterpartId ||
      (DEFAULT_COUNTERPARTS[pieceId] && DEFAULT_COUNTERPARTS[pieceId].counterpartId) || null;
    var counterpartTitle = meta.counterpartTitle ||
      (DEFAULT_COUNTERPARTS[pieceId] && DEFAULT_COUNTERPARTS[pieceId].counterpartTitle) || null;
    var sharedSkill = meta.sharedSkill || meta.technicalFocus ||
      (DEFAULT_COUNTERPARTS[pieceId] && DEFAULT_COUNTERPARTS[pieceId].sharedSkill) ||
      'independent two-hand coordination, steady pulse, and phrase voicing';

    if (Array.isArray(repertoireList) && counterpartId) {
      for (var i = 0; i < repertoireList.length; i++) {
        var candidate = repertoireList[i];
        if (candidate && candidate.id === counterpartId) {
          counterpartTitle = candidate.title || counterpartTitle;
          if (candidate.technicalFocus || candidate.skill) {
            sharedSkill = candidate.technicalFocus || candidate.skill;
          }
          break;
        }
      }
    }

    return {
      counterpartId: counterpartId,
      counterpartTitle: counterpartTitle || counterpartId || 'Modern/Game Taste Counterpart',
      sharedSkill: sharedSkill
    };
  }

  /**
   * Applies one of the 4 bench feedback ratings:
   * - 'nailed'        (🔥 Nailed It)
   * - 'getting_there' (⏳ Getting There)
   * - 'tricky'        (🧩 Tricky Transition)
   * - 'boring'        (😴 Boring Track — Swap)
   */
  function ratePiece(pieceId, rating, options) {
    var opts = options || {};
    var prog = getPieceProgress(pieceId, {
      currentBpm: opts.currentBpm,
      targetBpm: opts.targetBpm
    });

    if (typeof opts.targetBpm === 'number' && opts.targetBpm > 0) {
      prog.targetBpm = opts.targetBpm;
    }
    if (typeof opts.currentBpm === 'number' && opts.currentBpm > 0) {
      prog.currentBpm = opts.currentBpm;
    }

    prog.playCount = (prog.playCount || 0) + 1;
    prog.lastPlayed = new Date().toISOString();
    prog.lastRating = rating;

    var barRange = opts.barRange || opts.flaggedBarRange || 'Bars 3–4';
    var counterpartInfo = resolveCounterpart(pieceId, opts.pieceMeta || opts, opts.repertoireList);
    var coachingMessage = '';

    if (rating === 'nailed') {
      var capBpm = (prog.targetBpm || 76) + 8;
      prog.currentBpm = Math.min(capBpm, (prog.currentBpm || 60) + 4);
      prog.status = 'Mastered / Leveling Up';
      prog.flaggedBars = [];
      prog.swappedToId = null;
      coachingMessage = '🔥 Nailed it! Recommended tempo stepped up +4 BPM to ' + prog.currentBpm + ' BPM. Flagged bars cleared.';
    } else if (rating === 'getting_there') {
      prog.status = 'Building Fluency';
      prog.swappedToId = null;
      coachingMessage = '⏳ Solid reps! Keeping tempo steady at ' + prog.currentBpm + ' BPM for 3 relaxed passes before nudging speed.';
    } else if (rating === 'tricky') {
      prog.currentBpm = Math.max(44, (prog.currentBpm || 60) - 6);
      prog.status = 'Lesson 11 Micro-Drill Scheduled';
      prog.swappedToId = null;
      if (barRange && prog.flaggedBars.indexOf(barRange) === -1) {
        prog.flaggedBars.unshift(barRange);
        prog.flaggedBars = prog.flaggedBars.slice(0, 4);
      }
      coachingMessage = '🧩 Lesson 11 Micro-Drill activated: isolated ' + barRange + ' at ' + prog.currentBpm + ' BPM (-6 BPM). Loop just those 2 bars + beat 1 of the next bar 4x.';
    } else if (rating === 'boring') {
      prog.status = 'Swapped for Taste Match';
      prog.swappedToId = counterpartInfo.counterpartId;
      coachingMessage = '😴 Swapped for Taste Match → ' + counterpartInfo.counterpartTitle + ' (trains the exact same skill: ' + counterpartInfo.sharedSkill + ').';
    }

    saveState();

    return {
      pieceId: pieceId,
      rating: rating,
      progress: prog,
      recommendedBpm: prog.currentBpm,
      status: prog.status,
      flaggedBars: prog.flaggedBars.slice(),
      swapRecommendation: rating === 'boring' ? counterpartInfo : null,
      coachingMessage: coachingMessage
    };
  }

  function recordSessionCheckin(entry) {
    var payload = entry || {};
    var record = {
      timestamp: payload.timestamp || new Date().toISOString(),
      bpm: Number(payload.bpm) || 60,
      completed: Array.isArray(payload.completed) ? payload.completed : [],
      notes: String(payload.notes || '').trim(),
      ratingsSummary: payload.ratingsSummary || summarizePieceRatings()
    };
    state.sessionHistory.unshift(record);
    state.sessionHistory = state.sessionHistory.slice(0, 40);
    saveState();
    return record;
  }

  function summarizePieceRatings() {
    var out = {};
    for (var id in state.pieceProgress) {
      if (Object.prototype.hasOwnProperty.call(state.pieceProgress, id)) {
        var p = state.pieceProgress[id];
        if (p.lastRating) {
          out[id] = {
            rating: p.lastRating,
            currentBpm: p.currentBpm,
            status: p.status,
            flaggedBars: p.flaggedBars || []
          };
        }
      }
    }
    return out;
  }

  /**
   * 3. Adaptive Lesson 13 Practice Plan Generator (30-Min Split: 25% / 60% / 15%)
   */
  function normalizeRepertoireList(repertoireList) {
    if (Array.isArray(repertoireList) && repertoireList.length > 0) {
      return repertoireList;
    }
    return [
      {
        id: 'petzold_minuet_g',
        title: 'Petzold — Minuet in G Major (BWV Anh. 114)',
        category: 'Classical Anchor',
        keySignature: 'G Major (F#)',
        targetBpm: 80,
        startBpm: 60,
        modernCounterpartId: 'yung_lean_agony',
        counterpartTitle: 'Yung Lean — Agony',
        technicalFocus: '3/4 waltz meter, F# awareness, and independent LH bass line'
      },
      {
        id: 'yung_lean_agony',
        title: 'Yung Lean — Agony (Main Piano Motif)',
        category: 'Modern / Indie Taste',
        keySignature: 'G Major / E Minor',
        targetBpm: 72,
        startBpm: 56,
        modernCounterpartId: 'petzold_minuet_g',
        counterpartTitle: 'Petzold — Minuet in G Major',
        technicalFocus: '3/4 waltz pulse, gentle LH chord voicing, and singing RH intervals'
      },
      {
        id: 'schumann_melody',
        title: 'Schumann — Melody (Op. 68, No. 1)',
        category: 'Classical Anchor',
        keySignature: 'C Major',
        targetBpm: 76,
        startBpm: 58,
        modernCounterpartId: 'minecraft_wet_hands',
        counterpartTitle: 'C418 — Wet Hands (Minecraft)',
        technicalFocus: 'Legato cantabile melody over broken-chord accompaniment (Lesson 5)'
      },
      {
        id: 'minecraft_wet_hands',
        title: 'C418 — Wet Hands (Minecraft)',
        category: 'Modern / Game Theme',
        keySignature: 'C / A Major flavor',
        targetBpm: 74,
        startBpm: 56,
        modernCounterpartId: 'schumann_melody',
        counterpartTitle: 'Schumann — Melody (Op. 68, No. 1)',
        technicalFocus: 'Flowing LH broken-chord accompaniment and relaxed RH lyrical phrasing'
      },
      {
        id: 'radiohead_no_surprises',
        title: 'Radiohead — No Surprises (Arpeggio Intro)',
        category: 'Modern / Indie Taste',
        keySignature: 'F Major / D Minor flavor',
        targetBpm: 76,
        startBpm: 58,
        modernCounterpartId: 'clementi_sonatina',
        counterpartTitle: 'Clementi — Sonatina in C (Op. 36, No. 1)',
        technicalFocus: 'Even eighth-note arpeggio rotation and steady bass anchor notes'
      },
      {
        id: 'cod_zombies_damned',
        title: 'Kevin Sherwood — Damned (CoD Zombies Theme)',
        category: 'Modern / Game Theme',
        keySignature: 'A Minor',
        targetBpm: 84,
        startBpm: 64,
        modernCounterpartId: 'burgmuller_arabesque',
        counterpartTitle: 'Burgmüller — Arabesque (Op. 100, No. 2)',
        technicalFocus: 'High-contrast minor-key ostinato, crisp LH chord stabs, and rhythmic lock'
      }
    ];
  }

  function generateNextSessionPlan(repertoireList) {
    var list = normalizeRepertoireList(repertoireList);
    var byId = {};
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id) {
        byId[list[i].id] = list[i];
      }
    }

    var weakSummary = getWeakSpotsSummary();
    var totalSessions = state.sessionHistory.length;

    // 1. Warmup (25% / 7.5 min)
    var gMajorPieceActive = false;
    for (var pid in state.pieceProgress) {
      if (Object.prototype.hasOwnProperty.call(state.pieceProgress, pid)) {
        var meta = byId[pid];
        if (pid.indexOf('minuet') !== -1 || pid.indexOf('agony') !== -1 ||
            (meta && String(meta.keySignature || '').indexOf('G') !== -1)) {
          gMajorPieceActive = true;
        }
      }
    }
    var useGMajorWarmup = gMajorPieceActive || (totalSessions % 2 === 1);
    var warmupBpm = 60;
    if (state.sessionHistory[0] && state.sessionHistory[0].bpm) {
      warmupBpm = Math.max(52, Math.min(84, Number(state.sessionHistory[0].bpm)));
    }

    var warmupBlock = {
      phase: '1. Technique Warmup',
      sharePct: 25,
      minutes: 7.5,
      scaleFocus: useGMajorWarmup ? 'G Major 1-Octave Scale + Thumb-Tuck Drill (watch F#)' : 'C Major 1-Octave Scale + Smooth 3→1 / 1→3 Thumb Tuck',
      recommendedBpm: warmupBpm,
      steps: useGMajorWarmup
        ? [
            'Hands Separate (3 min): G Major 1-octave ascending/descending at ' + warmupBpm + ' BPM — pre-place RH finger 4 / LH finger 2 on F#.',
            'Thumb-Tuck Pivot (2.5 min): Isolate G–A–B–C (1–2–3–1) loop with zero elbow flare.',
            'Contrary Motion / Five-Finger Check (2 min): G–A–B–C–D hands together with heavy arm weight and soft wrists.'
          ]
        : [
            'Hands Separate (3 min): C Major 1-octave scale at ' + warmupBpm + ' BPM — prepare thumb under finger 3 right as finger 2 plays D.',
            'Lesson 5 Voicing Drill (2.5 min): Play C–E–G in both hands; make RH ring 2x louder than LH.',
            'Chord Cadence Check (2 min): C Major → G7 → C Major block chords with relaxed shoulders.'
          ]
    };

    // 2. Repertoire (60% / 18 min)
    var trickyItems = [];
    var swappedItems = [];
    var buildingItems = [];
    var masteredItems = [];

    for (var rIdx = 0; rIdx < list.length; rIdx++) {
      var piece = list[rIdx];
      var prog = state.pieceProgress[piece.id];
      if (!prog || !prog.lastRating) continue;

      if (prog.lastRating === 'tricky') {
        var bars = (prog.flaggedBars && prog.flaggedBars.length > 0) ? prog.flaggedBars.join(', ') : 'Bars 3–4';
        trickyItems.push({
          pieceId: piece.id,
          title: piece.title,
          actionType: 'lesson11_micro_drill',
          recommendedBpm: prog.currentBpm,
          targetBpm: prog.targetBpm || piece.targetBpm || 76,
          flaggedBars: prog.flaggedBars || ['Bars 3–4'],
          directive: 'Lesson 11 Micro-Section Drill on ' + piece.title + ' (' + bars + ') at ' + prog.currentBpm + ' BPM (-6 BPM adjustment). Play LH alone 3x, RH alone 3x, then loop JUST those bars + beat 1 of the next measure 4x clean.'
        });
      } else if (prog.lastRating === 'boring') {
        var cp = resolveCounterpart(piece.id, piece, list);
        var cpPiece = cp.counterpartId && byId[cp.counterpartId] ? byId[cp.counterpartId] : null;
        var cpBpm = (cpPiece && cpPiece.startBpm) || prog.currentBpm || 60;
        swappedItems.push({
          fromPieceId: piece.id,
          fromTitle: piece.title,
          pieceId: cp.counterpartId || piece.id,
          title: cp.counterpartTitle,
          actionType: 'taste_swap',
          recommendedBpm: cpBpm,
          sharedSkill: cp.sharedSkill,
          directive: 'Taste-Matched Swap: Replaced "' + piece.title + '" with "' + cp.counterpartTitle + '" at ' + cpBpm + ' BPM. Why it works: trains the exact same core skill (' + cp.sharedSkill + ') in a track you actually want to play.'
        });
      } else if (prog.lastRating === 'getting_there') {
        buildingItems.push({
          pieceId: piece.id,
          title: piece.title,
          actionType: 'fluency_consolidation',
          recommendedBpm: prog.currentBpm,
          targetBpm: prog.targetBpm || piece.targetBpm || 76,
          directive: 'Fluency Consolidation on ' + piece.title + ' at steady ' + prog.currentBpm + ' BPM — aim for 3 unhurried, musical passes with zero tension.'
        });
      } else if (prog.lastRating === 'nailed') {
        masteredItems.push({
          pieceId: piece.id,
          title: piece.title,
          actionType: 'tempo_level_up',
          recommendedBpm: prog.currentBpm,
          targetBpm: prog.targetBpm || piece.targetBpm || 76,
          directive: 'Level-Up Run on ' + piece.title + ' at ' + prog.currentBpm + ' BPM (+4 BPM boost) — focus on dynamic shaping and phrasing.'
        });
      }
    }

    var prescriptions = trickyItems.concat(swappedItems, buildingItems, masteredItems);
    if (prescriptions.length === 0) {
      // Default starter pair: 1 Classical Anchor + 1 Modern/Game Piece
      var firstClassical = list[0];
      var firstModern = list[1] || list[0];
      prescriptions.push({
        pieceId: firstClassical.id,
        title: firstClassical.title,
        actionType: 'initial_anchor',
        recommendedBpm: firstClassical.startBpm || 60,
        directive: 'Classical Anchor (9 min): ' + firstClassical.title + ' at ' + (firstClassical.startBpm || 60) + ' BPM — map bars 1–4 hands separate, then join hands slowly.'
      });
      if (firstModern && firstModern.id !== firstClassical.id) {
        prescriptions.push({
          pieceId: firstModern.id,
          title: firstModern.title,
          actionType: 'initial_modern',
          recommendedBpm: firstModern.startBpm || 58,
          directive: 'Taste-Matched Pair (9 min): ' + firstModern.title + ' at ' + (firstModern.startBpm || 58) + ' BPM — applies the exact same hand-balance and pulse skill.'
        });
      }
    }

    var repertoireBlock = {
      phase: '2. Repertoire & Micro-Drills',
      sharePct: 60,
      minutes: 18,
      prescriptions: prescriptions.slice(0, 3),
      trickyCount: trickyItems.length,
      swappedCount: swappedItems.length
    };

    // 3. Sight-Reading & Intervallic Spot-Drill (15% / 4.5 min)
    var topNotesStr = weakSummary.weakNotes.join(', ');
    var topIntervalsStr = weakSummary.weakIntervals.join(' & ');
    var sightReadingBlock = {
      phase: '3. Adaptive Sight-Reading & Interval Spot-Drill',
      sharePct: 15,
      minutes: 4.5,
      weakNotes: weakSummary.weakNotes,
      weakIntervals: weakSummary.weakIntervals,
      accuracyPct: weakSummary.accuracyPct,
      totalAttempts: weakSummary.totalAttempts,
      directive: 'Target weak notes (' + topNotesStr + ') in "Weak Spots Only" mode for 15 reps, then run 10 interval recognition cards focusing on ' + topIntervalsStr + ' while saying the direction + interval out loud before pressing the key.'
    };

    return {
      generatedAt: new Date().toISOString(),
      totalMinutes: 30,
      lessonFramework: 'Lesson 13 Practice Split (25% Warmup / 60% Repertoire / 15% Sight-Reading)',
      warmup: warmupBlock,
      repertoire: repertoireBlock,
      sightReading: sightReadingBlock,
      weakSpots: weakSummary
    };
  }

  function buildSessionSnapshotMarkdown(repertoireList, extraNotes) {
    var plan = generateNextSessionPlan(repertoireList);
    var weak = plan.weakSpots;
    var dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    var lines = [];
    lines.push('## 🎹 Piano Studio — Adaptive Session Snapshot (' + dateStr + ')');
    lines.push('');
    lines.push('### 📊 Sight-Reading & Note Drill Telemetry');
    lines.push('- **Total Drill Attempts:** ' + weak.totalAttempts + ' (' + weak.accuracyPct + '% accuracy)');
    lines.push('- **Priority Weak Notes (Spaced Repetition):** `' + weak.weakNotes.join('`, `') + '`');
    lines.push('- **Priority Weak Intervals:** `' + weak.weakIntervals.join('`, `') + '`');
    lines.push('');
    lines.push('### 🎼 Repertoire Bench Ratings & Tempo Status');

    var list = normalizeRepertoireList(repertoireList);
    var ratedAny = false;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var prog = state.pieceProgress[p.id];
      if (prog && (prog.lastRating || prog.playCount > 0)) {
        ratedAny = true;
        var flagText = prog.flaggedBars && prog.flaggedBars.length > 0
          ? ' | Flagged: `' + prog.flaggedBars.join(', ') + '`'
          : '';
        lines.push('- **' + p.title + '**: `' + prog.status + '` — Recommended Tempo: **' + prog.currentBpm + ' BPM** (Target ' + (prog.targetBpm || p.targetBpm || 76) + ' BPM)' + flagText);
      }
    }
    if (!ratedAny) {
      lines.push('- No repertoire pieces rated yet in this browser session.');
    }

    lines.push('');
    lines.push('### ⏱️ Next 30-Minute Lesson 13 Practice Plan');
    lines.push('1. **Warmup (7.5 min / 25%):** ' + plan.warmup.scaleFocus + ' @ **' + plan.warmup.recommendedBpm + ' BPM**');
    for (var j = 0; j < plan.repertoire.prescriptions.length; j++) {
      var rx = plan.repertoire.prescriptions[j];
      lines.push('2.' + (j + 1) + ' **Repertoire (60% Split):** ' + rx.directive);
    }
    lines.push('3. **Sight-Reading (4.5 min / 15%):** ' + plan.sightReading.directive);

    var noteText = extraNotes || (state.sessionHistory[0] && state.sessionHistory[0].notes) || '';
    if (noteText) {
      lines.push('');
      lines.push('### 📝 Bench Notes');
      lines.push('> ' + String(noteText).replace(/\n/g, '\n> '));
    }

    return lines.join('\n');
  }

  global.AdaptiveEngine = {
    STORAGE_KEY: STORAGE_KEY,
    ALL_NOTE_IDS: ALL_NOTE_IDS,
    DEFAULT_COUNTERPARTS: DEFAULT_COUNTERPARTS,
    getState: function () { return state; },
    saveState: saveState,
    resetState: resetState,
    recordNoteAttempt: recordNoteAttempt,
    recordIntervalAttempt: recordIntervalAttempt,
    pickWeightedNote: pickWeightedNote,
    pickWeightedInterval: pickWeightedInterval,
    getWeakSpotsSummary: getWeakSpotsSummary,
    getPieceProgress: getPieceProgress,
    ratePiece: ratePiece,
    resolveCounterpart: resolveCounterpart,
    recordSessionCheckin: recordSessionCheckin,
    generateNextSessionPlan: generateNextSessionPlan,
    buildSessionSnapshotMarkdown: buildSessionSnapshotMarkdown
  };
})(typeof window !== 'undefined' ? window : this);
