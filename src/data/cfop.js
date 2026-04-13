// CFOP Algorithm Data
// Color codes: W=white Y=yellow R=red O=orange B=blue G=green X=grey(unknown)
// Sticker positions per face (looking head-on): 0 1 2 / 3 4 5 / 6 7 8
// States come from configs.js via OLL_variations, PLL_variations, F2L_variations.

import { OLL_variations, PLL_variations, F2L_variations } from './configs.js';

export const SECTIONS = ['F2L', 'OLL', 'PLL'];

export const F2L_SUBSECTIONS = [
  'Basic cases',
  'Corner and edge in top',
  'Corner pointing up, edge in top',
  'Corner in top, edge in middle',
  'Corner in bottom, edge in top',
  'Corner in bottom, edge in middle',
];

export const OLL_SUBSECTIONS = [
  'Crosses',
  'Dots',
  'All Corners',
  'Lines',
  'Ts',
  'Zs',
  'Big Ls',
  'Cs',
  'Ws',
  'Ps',
  'Squares',
  'Little Ls',
  'Other shapes',
];

export const PLL_SUBSECTIONS = [
  'Edges only',
  'Corners only',
  'Edges and corners',
];

// ---------------------------------------------------------------------------
// State helpers - pull from configs.js variations maps
// ---------------------------------------------------------------------------
const BLANK = { U:'XXXXXXXXX', D:'XXXXXXXXX', F:'XXXXXXXXX', B:'XXXXXXXXX', L:'XXXXXXXXX', R:'XXXXXXXXX' };
const f2l = (name) => F2L_variations[name] || BLANK;
const oll = (name) => OLL_variations[name] || BLANK;
const pll = (name) => PLL_variations[name] || BLANK;

export const ALGORITHMS = [

  // ======================================================================
  // F2L
  // ======================================================================

  // -- Basic cases --
  { id:'f2l-1',  section:'F2L', subsection:'Basic cases', name:'Basic #1', moves:"R U R'",        description:'Corner and edge matched, insert right.',        state:f2l('f2l-1') },
  { id:'f2l-2',  section:'F2L', subsection:'Basic cases', name:'Basic #2', moves:"F' U' F",        description:'Corner and edge matched, insert left.',         state:f2l('f2l-2') },
  { id:'f2l-3',  section:'F2L', subsection:'Basic cases', name:'Basic #3', moves:"U R U' R'",      description:'Edge in top, U setup right.',                   state:f2l('f2l-3') },
  { id:'f2l-4',  section:'F2L', subsection:'Basic cases', name:'Basic #4', moves:"U' F' U F",      description:'Edge in top, U setup left.',                    state:f2l('f2l-4') },

  // -- Corner and edge in top --
  { id:'f2l-b1',  section:'F2L', subsection:'Corner and edge in top', name:'Top #1',  moves:"U' R U' R' U R U R'",          description:'Corner and edge in top.',                       state:f2l('f2l-b1') },
  { id:'f2l-b2',  section:'F2L', subsection:'Corner and edge in top', name:'Top #2',  moves:"U F' U F U' F' U' F",           description:'Corner and edge in top - mirror.',              state:f2l('f2l-b2') },
  { id:'f2l-b3',  section:'F2L', subsection:'Corner and edge in top', name:'Top #3',  moves:"U' R U R' U R U R'",            description:'Corner and edge in top - variant.',             state:f2l('f2l-b3') },
  { id:'f2l-b4',  section:'F2L', subsection:'Corner and edge in top', name:'Top #4',  moves:"U F' U' F U' F' U' F",          description:'Corner and edge in top - F variant.',           state:f2l('f2l-b4') },
  { id:'f2l-b5',  section:'F2L', subsection:'Corner and edge in top', name:'Top #5',  moves:"d R' U2 R d' R U R'",           description:'Corner and edge in top - d move.',              state:f2l('f2l-b5') },
  { id:'f2l-b6',  section:'F2L', subsection:'Corner and edge in top', name:'Top #6',  moves:"U' R U2 R' d R' U' R",          description:'Corner and edge in top - d right.',             state:f2l('f2l-b6') },
  { id:'f2l-b7',  section:'F2L', subsection:'Corner and edge in top', name:'Top #7',  moves:"R U' R' U d R' U' R",           description:'Corner and edge in top - d extract.',           state:f2l('f2l-b7') },
  { id:'f2l-b8',  section:'F2L', subsection:'Corner and edge in top', name:'Top #8',  moves:"F' U F U' d' F U F'",           description:'Corner and edge in top - d prime.',             state:f2l('f2l-b8') },
  { id:'f2l-b9',  section:'F2L', subsection:'Corner and edge in top', name:'Top #9',  moves:"U F' U2 F U F' U2 F",           description:'Corner and edge in top - double U2.',           state:f2l('f2l-b9') },
  { id:'f2l-b10', section:'F2L', subsection:'Corner and edge in top', name:'Top #10', moves:"U' R U2 R' U' R U2 R'",         description:'Corner and edge in top - double U2 right.',     state:f2l('f2l-b10') },
  { id:'f2l-b11', section:'F2L', subsection:'Corner and edge in top', name:'Top #11', moves:"U F' U' F U F' U2 F",           description:'Corner and edge in top - U prime F.',           state:f2l('f2l-b11') },
  { id:'f2l-b12', section:'F2L', subsection:'Corner and edge in top', name:'Top #12', moves:"U' R U R' U' R U2 R'",          description:'Corner and edge in top - U R.',                 state:f2l('f2l-b12') },

  // -- Corner pointing up, edge in top --
  { id:'f2l-u1', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #1', moves:"R U2 R' U' R U R'",          description:'Corner pointing up - no U setup right.',        state:f2l('f2l-u1') },
  { id:'f2l-u2', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #2', moves:"F' U2 F U F' U' F",           description:'Corner pointing up - no U setup left.',         state:f2l('f2l-u2') },
  { id:'f2l-u3', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #3', moves:"U R U2 R' U R U' R'",         description:'Corner pointing up - U setup right.',           state:f2l('f2l-u3') },
  { id:'f2l-u4', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #4', moves:"U' F' U2 F U' F' U F",        description:'Corner pointing up - U setup left.',            state:f2l('f2l-u4') },
  { id:'f2l-u5', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #5', moves:"U2 R U R' U R U' R'",         description:'Corner pointing up - U2 setup right.',          state:f2l('f2l-u5') },
  { id:'f2l-u6', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #6', moves:"U2 F' U' F U' F' U F",        description:'Corner pointing up - U2 setup left.',           state:f2l('f2l-u6') },
  { id:'f2l-u7', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #7', moves:"R U R' U' U' R U R' U' R U R'",  description:'Corner pointing up - triple trigger.',       state:f2l('f2l-u7') },
  { id:'f2l-u8', section:'F2L', subsection:'Corner pointing up, edge in top', name:'Up #8', moves:"y' R' U' R U U R' U' R U R' U' R", description:'Corner pointing up - y variant.',           state:f2l('f2l-u8') },

  // -- Corner in top, edge in middle --
  { id:'f2l-m1', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #1', moves:"U F' U F U F' U2 F",           description:'Corner in top, edge in middle.',                state:f2l('f2l-m1') },
  { id:'f2l-m2', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #2', moves:"U' R U' R' U' R U2 R'",        description:'Corner in top, edge in middle - R.',            state:f2l('f2l-m2') },
  { id:'f2l-m3', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #3', moves:"U F' U' F d' F U F'",          description:'Corner in top, edge in middle - d prime.',      state:f2l('f2l-m3') },
  { id:'f2l-m4', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #4', moves:"U' R U R' d R' U' R",          description:'Corner in top, edge in middle - d right.',      state:f2l('f2l-m4') },
  { id:'f2l-m5', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #5', moves:"R U' R' d R' U R",             description:'Corner in top, edge in middle - d extract.',    state:f2l('f2l-m5') },
  { id:'f2l-m6', section:'F2L', subsection:'Corner in top, edge in middle', name:'Mid #6', moves:"R U R' U' R U R' U' R U R'",   description:'Corner in top, edge in middle - triple.',       state:f2l('f2l-m6') },

  // -- Corner in bottom, edge in top --
  { id:'f2l-c1', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #1', moves:"U R U' R' U' F' U F",          description:'Corner in bottom, edge in top.',                state:f2l('f2l-c1') },
  { id:'f2l-c2', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #2', moves:"U' F' U F U R U' R'",          description:'Corner in bottom, edge in top - mirror.',       state:f2l('f2l-c2') },
  { id:'f2l-c3', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #3', moves:"F' U F U' F' U F",             description:'Corner in bottom, edge in top - F.',            state:f2l('f2l-c3') },
  { id:'f2l-c4', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #4', moves:"R U' R' U R U' R'",            description:'Corner in bottom, edge in top - R.',            state:f2l('f2l-c4') },
  { id:'f2l-c5', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #5', moves:"R U R' U' R U R'",             description:'Corner in bottom, edge in top - R variant.',    state:f2l('f2l-c5') },
  { id:'f2l-c6', section:'F2L', subsection:'Corner in bottom, edge in top', name:'Bot #6', moves:"F' U' F U F' U' F",            description:'Corner in bottom, edge in top - F variant.',    state:f2l('f2l-c6') },

  // -- Corner in bottom, edge in middle --
  { id:'f2l-s1', section:'F2L', subsection:'Corner in bottom, edge in middle', name:'Slot #1', moves:"R U' R' U R U2 R' U R U' R'",    description:'Both in slot - long extraction.',           state:f2l('f2l-s1') },
  { id:'f2l-s2', section:'F2L', subsection:'Corner in bottom, edge in middle', name:'Slot #2', moves:"R U' R' U' R U R' U' R U2 R'",   description:'Both in slot - triple.',                    state:f2l('f2l-s2') },
  { id:'f2l-s3', section:'F2L', subsection:'Corner in bottom, edge in middle', name:'Slot #3', moves:"R U R' U' R U' R' U d R' U' R",   description:'Both in slot - d move.',                    state:f2l('f2l-s3') },
  { id:'f2l-s4', section:'F2L', subsection:'Corner in bottom, edge in middle', name:'Slot #4', moves:"R U' R' d R' U' R U' R' U' R",    description:'Both in slot - d prime.',                   state:f2l('f2l-s4') },
  { id:'f2l-s5', section:'F2L', subsection:'Corner in bottom, edge in middle', name:'Slot #5', moves:"R U' R' d R' U2 R U R' U2 R",     description:'Both in slot - long d.',                    state:f2l('f2l-s5') },


  // ======================================================================
  // OLL
  // ======================================================================

  // -- Crosses --
  { id:'oll-27', section:'OLL', subsection:'Crosses', name:'OLL #27', moves:"R' U2 R U R' U R",                          description:'Sune.',                        state:oll('OLL #27') },
  { id:'oll-26', section:'OLL', subsection:'Crosses', name:'OLL #26', moves:"R U2 R' U' R U' R'",                        description:'Anti-Sune.',                   state:oll('OLL #26') },
  { id:'oll-25', section:'OLL', subsection:'Crosses', name:'OLL #25', moves:"F' r U R' U' r' F R",                       description:'Cross - T mirrored.',          state:oll('OLL #25') },
  { id:'oll-24', section:'OLL', subsection:'Crosses', name:'OLL #24', moves:"r U R' U' r' F R F'",                       description:'Cross - T shape.',             state:oll('OLL #24') },
  { id:'oll-22', section:'OLL', subsection:'Crosses', name:'OLL #22', moves:"R U2 R2' U' R2 U' R2' U2 R",               description:'Cross - anti-Sune full.',      state:oll('OLL #22') },
  { id:'oll-21', section:'OLL', subsection:'Crosses', name:'OLL #21', moves:"R U R' U R U' R' U R U2 R'",               description:'Cross - Sune full.',           state:oll('OLL #21') },
  { id:'oll-23', section:'OLL', subsection:'Crosses', name:'OLL #23', moves:"R2 D R' U2 R D' R' U2 R'",                 description:'Cross - headlights.',          state:oll('OLL #23') },

  // -- Dots --
  { id:'oll-1',  section:'OLL', subsection:'Dots', name:'OLL #1',  moves:"R U2 R' R' F R F' U2 R' F R F'",              description:'Dot - all unoriented.',        state:oll('OLL #1')  },
  { id:'oll-2',  section:'OLL', subsection:'Dots', name:'OLL #2',  moves:"F R U R' U' F' f R U R' U' f'",               description:'Dot - two edges opposite.',    state:oll('OLL #2')  },
  { id:'oll-4',  section:'OLL', subsection:'Dots', name:'OLL #4',  moves:"f R U R' U' f' U F R U R' U' F'",             description:'Dot - L mirrored.',            state:oll('OLL #4')  },
  { id:'oll-3',  section:'OLL', subsection:'Dots', name:'OLL #3',  moves:"f R U R' U' f' U' F R U R' U' F'",            description:'Dot - L shape.',               state:oll('OLL #3')  },
  { id:'oll-19', section:'OLL', subsection:'Dots', name:'OLL #19', moves:"M U R U R' U' M' R' F R F'",                  description:'Dot - diagonal corners.',      state:oll('OLL #19') },
  { id:'oll-18', section:'OLL', subsection:'Dots', name:'OLL #18', moves:"F R U R' U y' R' U2 R' F R F'",               description:'Dot - adjacent corners.',      state:oll('OLL #18') },
  { id:'oll-17', section:'OLL', subsection:'Dots', name:'OLL #17', moves:"R U R' U R' F R F' U2 R' F R F'",             description:'Dot - two corners.',           state:oll('OLL #17') },
  { id:'oll-20', section:'OLL', subsection:'Dots', name:'OLL #20', moves:"M U R U R' U' M2 U R U' r'",                  description:'Dot - all four edges.',        state:oll('OLL #20') },

  // -- All Corners --
  { id:'oll-57', section:'OLL', subsection:'All Corners', name:'OLL #57', moves:"R U R' U' M' U R U' r'",               description:'H shape.',                     state:oll('OLL #57') },
  { id:'oll-28', section:'OLL', subsection:'All Corners', name:'OLL #28', moves:"M' U' M U2' M' U' M",                  description:'Arrow.',                       state:oll('OLL #28') },

  // -- Lines --
  { id:'oll-55', section:'OLL', subsection:'Lines', name:'OLL #55', moves:"R U2 R2 U' R U' R' U2 F R F'",               description:'Line - corners.',              state:oll('OLL #55') },
  { id:'oll-52', section:'OLL', subsection:'Lines', name:'OLL #52', moves:"R U R' U R d' R U' R' F'",                   description:'Line - diamond.',              state:oll('OLL #52') },
  { id:'oll-51', section:'OLL', subsection:'Lines', name:'OLL #51', moves:"f R U R' U' R U R' U' f'",                   description:'Line - wide.',                 state:oll('OLL #51') },
  { id:'oll-56', section:'OLL', subsection:'Lines', name:'OLL #56', moves:"F R U R' U' R F' r U R' U' r'",              description:'Line - wide variant.',         state:oll('OLL #56') },

  // -- Ts --
  { id:'oll-45', section:'OLL', subsection:'Ts', name:'OLL #45', moves:"F R U R' U' F'",                                description:'T shape - simple.',            state:oll('OLL #45') },
  { id:'oll-33', section:'OLL', subsection:'Ts', name:'OLL #33', moves:"R U R' U' R' F R F'",                           description:'T shape.',                     state:oll('OLL #33') },

  // -- Zs --
  { id:'oll-40', section:'OLL', subsection:'Zs', name:'OLL #40', moves:"R' F R U R' U' F' U R",                         description:'Z shape - right.',             state:oll('OLL #40') },
  { id:'oll-39', section:'OLL', subsection:'Zs', name:'OLL #39', moves:"L F' L' U' L U F U' L'",                        description:'Z shape - left.',              state:oll('OLL #39') },

  // -- Big Ls --
  { id:'oll-14', section:'OLL', subsection:'Big Ls', name:'OLL #14', moves:"R' F R U R' F' R y' R U' R'",               description:'Big L - right.',               state:oll('OLL #14') },
  { id:'oll-13', section:'OLL', subsection:'Big Ls', name:'OLL #13', moves:"F U R U' R2 F' R U R U' R'",                description:'Big L - left.',                state:oll('OLL #13') },
  { id:'oll-16', section:'OLL', subsection:'Big Ls', name:'OLL #16', moves:"r U r' R U R' U' r U' r'",                  description:'Big L - wide right.',          state:oll('OLL #16') },
  { id:'oll-15', section:'OLL', subsection:'Big Ls', name:'OLL #15', moves:"l' U' l L' U' L U l' U l",                  description:'Big L - wide left.',           state:oll('OLL #15') },

  // -- Cs --
  { id:'oll-46', section:'OLL', subsection:'Cs', name:'OLL #46', moves:"R' U' R' F R F' U R",                           description:'C shape - left.',              state:oll('OLL #46') },
  { id:'oll-34', section:'OLL', subsection:'Cs', name:'OLL #34', moves:"R U R' U' x D' R' U R U' D x'",                 description:'C shape - right.',             state:oll('OLL #34') },

  // -- Ws --
  { id:'oll-38', section:'OLL', subsection:'Ws', name:'OLL #38', moves:"R U R' U R U' R' U' R' F R F'",                 description:'W shape - right.',             state:oll('OLL #38') },
  { id:'oll-36', section:'OLL', subsection:'Ws', name:'OLL #36', moves:"L' U' L U' L' U L U L F' L' F",                 description:'W shape - left.',              state:oll('OLL #36') },

  // -- Ps --
  { id:'oll-44', section:'OLL', subsection:'Ps', name:'OLL #44', moves:"f R U R' U' f'",                                description:'P shape - front.',             state:oll('OLL #44') },
  { id:'oll-43', section:'OLL', subsection:'Ps', name:'OLL #43', moves:"f' L' U' L U f",                                description:'P shape - back.',              state:oll('OLL #43') },
  { id:'oll-31', section:'OLL', subsection:'Ps', name:'OLL #31', moves:"R' U' F U R U' R' F' R",                        description:'P shape - right.',             state:oll('OLL #31') },
  { id:'oll-32', section:'OLL', subsection:'Ps', name:'OLL #32', moves:"F U R U' F' r U R' U' r'",                      description:'P shape - left.',              state:oll('OLL #32') },

  // -- Squares --
  { id:'oll-35', section:'OLL', subsection:'Squares', name:'OLL #35', moves:"R U2 R' R' F R F' R U2 R'",               description:'Square - right.',              state:oll('OLL #35') },
  { id:'oll-37', section:'OLL', subsection:'Squares', name:'OLL #37', moves:"F R' F' R U R U' R'",                      description:'Square - left.',               state:oll('OLL #37') },
  { id:'oll-5',  section:'OLL', subsection:'Squares', name:'OLL #5',  moves:"r' U2 R U R' U r",                         description:'Square - wide right.',         state:oll('OLL #5')  },
  { id:'oll-6',  section:'OLL', subsection:'Squares', name:'OLL #6',  moves:"r U2 R' U' R U' r'",                       description:'Square - wide left.',          state:oll('OLL #6')  },

  // -- Little Ls --
  { id:'oll-48', section:'OLL', subsection:'Little Ls', name:'OLL #48', moves:"F R U R' U' R U R' U' F'",               description:'Little L - right.',            state:oll('OLL #48') },
  { id:'oll-47', section:'OLL', subsection:'Little Ls', name:'OLL #47', moves:"F' L' U' L U L' U' L U F",               description:'Little L - left.',             state:oll('OLL #47') },
  { id:'oll-50', section:'OLL', subsection:'Little Ls', name:'OLL #50', moves:"R' F R2 B' R2' F' R2 B R'",              description:'Little L - back right.',       state:oll('OLL #50') },
  { id:'oll-49', section:'OLL', subsection:'Little Ls', name:'OLL #49', moves:"R' F R' F' R2 U2 y R' F R F'",           description:'Little L - back left.',        state:oll('OLL #49') },
  { id:'oll-53', section:'OLL', subsection:'Little Ls', name:'OLL #53', moves:"l' U' L U' L' U L U' L' U2 l",           description:'Little L - wide left.',        state:oll('OLL #53') },
  { id:'oll-54', section:'OLL', subsection:'Little Ls', name:'OLL #54', moves:"r U R' U R U' R' U R U2' r'",            description:'Little L - wide right.',       state:oll('OLL #54') },

  // -- Other shapes --
  { id:'oll-11', section:'OLL', subsection:'Other shapes', name:'OLL #11', moves:"F' L' U' L U F y F R U R' U' F'",     description:'Other - 11.',                  state:oll('OLL #11') },
  { id:'oll-12', section:'OLL', subsection:'Other shapes', name:'OLL #12', moves:"F R U R' U' F' U F R U R' U' F'",     description:'Other - 12.',                  state:oll('OLL #12') },
  { id:'oll-7',  section:'OLL', subsection:'Other shapes', name:'OLL #7',  moves:"r U R' U R U2 r'",                    description:'Other - 7.',                   state:oll('OLL #7')  },
  { id:'oll-8',  section:'OLL', subsection:'Other shapes', name:'OLL #8',  moves:"r' U' R U' R' U2 r",                  description:'Other - 8.',                   state:oll('OLL #8')  },
  { id:'oll-10', section:'OLL', subsection:'Other shapes', name:'OLL #10', moves:"R U R' U R' F R F' R U2 R'",          description:'Other - 10.',                  state:oll('OLL #10') },
  { id:'oll-9',  section:'OLL', subsection:'Other shapes', name:'OLL #9',  moves:"R U R' U' R' F R2 U R' U' F'",        description:'Other - 9.',                   state:oll('OLL #9')  },
  { id:'oll-29', section:'OLL', subsection:'Other shapes', name:'OLL #29', moves:"R U R' U' R U' R' F' U' F R U R'",    description:'Other - 29.',                  state:oll('OLL #29') },
  { id:'oll-42', section:'OLL', subsection:'Other shapes', name:'OLL #42', moves:"R' F R F' R' F R F' R U R' U' R U R'",description:'Other - 42.',                  state:oll('OLL #42') },
  { id:'oll-41', section:'OLL', subsection:'Other shapes', name:'OLL #41', moves:"R U R' U R U2 R' F R U R' U' F'",     description:'Other - 41.',                  state:oll('OLL #41') },
  { id:'oll-30', section:'OLL', subsection:'Other shapes', name:'OLL #30', moves:"L F' L' F L' U2 L d R U R'",          description:'Other - 30.',                  state:oll('OLL #30') },


  // ======================================================================
  // PLL
  // ======================================================================

  // -- Edges only --
  { id:'pll-H',  section:'PLL', subsection:'Edges only', name:'H Perm',  moves:"M2 U M2 U2 M2 U M2",                                                    description:'Swap opposite edge pairs.',         state:pll('H Perm')  },
  { id:'pll-Z',  section:'PLL', subsection:'Edges only', name:'Z Perm',  moves:"R' U' R2 U R U R' U' R U R U' R U' R' U2",                             description:'Swap adjacent edge pairs.',         state:pll('Z Perm')  },
  { id:'pll-Ua', section:'PLL', subsection:'Edges only', name:'Ua Perm', moves:"R2 U' R' U' R U R U R U' R",                                            description:'3-cycle edges counterclockwise.',   state:pll('Ua Perm') },
  { id:'pll-Ub', section:'PLL', subsection:'Edges only', name:'Ub Perm', moves:"R' U R' U' R' U' R' U R U R2",                                          description:'3-cycle edges clockwise.',          state:pll('Ub Perm') },

  // -- Corners only --
  { id:'pll-Aa', section:'PLL', subsection:'Corners only', name:'Aa Perm', moves:"x z' R2 U2 R' D' R U2 R' D R' z x'",                                 description:'3-cycle corners clockwise.',        state:pll('Aa Perm') },
  { id:'pll-Ab', section:'PLL', subsection:'Corners only', name:'Ab Perm', moves:"x R2 D2 R U R' D2 R U' R x'",                                         description:'3-cycle corners counterclockwise.', state:pll('Ab Perm') },
  { id:'pll-E',  section:'PLL', subsection:'Corners only', name:'E Perm',  moves:"R2 U R' U' y R U R' U' R U R' U' R U R' y' R U' R2'",                description:'Swap diagonal corners.',            state:pll('E Perm')  },

  // -- Edges and corners --
  { id:'pll-T',  section:'PLL', subsection:'Edges and corners', name:'T Perm',  moves:"R U R' U' R' F R2 U' R' U' R U R' F'",                           description:'T perm.',                           state:pll('T Perm')  },
  { id:'pll-Y',  section:'PLL', subsection:'Edges and corners', name:'Y Perm',  moves:"F R U' R' U' R U R' F' R U R' U' R' F R F'",                     description:'Y perm.',                           state:pll('Y Perm')  },
  { id:'pll-F',  section:'PLL', subsection:'Edges and corners', name:'F Perm',  moves:"U' R' U R U' R2 F' U' F U x R U R' U' R2 x'",                    description:'F perm.',                           state:pll('F Perm')  },
  { id:'pll-V',  section:'PLL', subsection:'Edges and corners', name:'V Perm',  moves:"R' U R' U' y R' D R' D' R2 y' R' B' R B R",                      description:'V perm.',                           state:pll('V Perm')  },
  { id:'pll-Ja', section:'PLL', subsection:'Edges and corners', name:'Ja Perm', moves:"L' U' L F L' U' L U L F' L2 U L U",                              description:'J perm right.',                     state:pll('Ja Perm') },
  { id:'pll-Jb', section:'PLL', subsection:'Edges and corners', name:'Jb Perm', moves:"R U R' F' R U R' U' R' F R2 U' R' U'",                           description:'J perm left.',                      state:pll('Jb Perm') },
  { id:'pll-Ra', section:'PLL', subsection:'Edges and corners', name:'Ra Perm', moves:"L U2 L' U2 L F' L' U' L U L F L2 U",                             description:'R perm right.',                     state:pll('Ra Perm') },
  { id:'pll-Rb', section:'PLL', subsection:'Edges and corners', name:'Rb Perm', moves:"R' U2 R U2 R' F R U R' U' R' F' R2 U'",                          description:'R perm left.',                      state:pll('Rb Perm') },
  { id:'pll-Na', section:'PLL', subsection:'Edges and corners', name:'Na Perm', moves:"R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",          description:'N perm right.',                     state:pll('Na Perm') },
  { id:'pll-Nb', section:'PLL', subsection:'Edges and corners', name:'Nb Perm', moves:"R' U R U' R' F' U' F R U R' F R' F' R U' R",                     description:'N perm left.',                      state:pll('Nb Perm') },
  { id:'pll-Ga', section:'PLL', subsection:'Edges and corners', name:'Ga Perm', moves:"y R2' u R' U R' U' R u' R2 y' R' U R",                           description:'G perm a.',                         state:pll('Ga Perm') },
  { id:'pll-Gb', section:'PLL', subsection:'Edges and corners', name:'Gb Perm', moves:"R' U' R y R2 u R' U R U' R u' R2",                               description:'G perm b.',                         state:pll('Gb Perm') },
  { id:'pll-Gc', section:'PLL', subsection:'Edges and corners', name:'Gc Perm', moves:"y R2' u' R U' R U R' u R2 y R U' R'",                            description:'G perm c.',                         state:pll('Gc Perm') },
  { id:'pll-Gd', section:'PLL', subsection:'Edges and corners', name:'Gd Perm', moves:"y2 R U R' y' R2 u' R U' R' U R' u R2",                          description:'G perm d.',                         state:pll('Gd Perm') },

];
