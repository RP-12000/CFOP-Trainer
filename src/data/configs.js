// CFOP Configurations
// Color scheme: U=Yellow, D=White, F=Blue, B=Green, L=Orange, R=Red
// OLL top face: Y=oriented (yellow showing), X=not oriented
// OLL side config: 12 chars = F[0-2] + R[3-5] + B[6-8] + L[9-11]


export function F2LConfig(corner, edge){
    const basis = {
        U: 'XXXXYXXXX'.split(''),
        D: 'XWXWWWXWX'.split(''),
        F: 'XXXXBXXBX'.split(''),
        B: 'XXXXGXXGX'.split(''),
        L: 'XXXXOXXOX'.split(''),
        R: 'XXXXRXXRX'.split(''),
    };
    switch(corner){
        case 1:
            basis.U[8]='W'; basis.F[2]='R'; basis.R[0]='B'; break;
        case 2:
            basis.U[8]='B'; basis.F[2]='W'; basis.R[0]='R'; break;
        case 3:
            basis.U[8]='R'; basis.F[2]='B'; basis.R[0]='W'; break;
        case 4:
            basis.F[8]='W'; basis.D[2]='R'; basis.R[6]='B'; break;
        case 5:
            basis.F[8]='R'; basis.D[2]='B'; basis.R[6]='W'; break;
        case 6:
            basis.F[8]='B'; basis.D[2]='W'; basis.R[6]='R'; break;
        default:
            basis.F[8]='X'; basis.D[2]='X'; basis.R[6]='X'; break;
    }
    switch(edge){
        case 1:
            basis.U[7]='B'; basis.F[1]='R'; break;
        case 2:
            basis.U[7]='R'; basis.F[1]='B'; break;
        case 3:
            basis.U[5]='B'; basis.R[1]='R'; break;
        case 4:
            basis.U[5]='R'; basis.R[1]='B'; break;
        case 5:
            basis.U[1]='B'; basis.B[1]='R'; break;
        case 6:
            basis.U[1]='R'; basis.B[1]='B'; break;
        case 7:
            basis.U[3]='B'; basis.L[1]='R'; break;
        case 8:
            basis.U[3]='R'; basis.L[1]='B'; break;
        case 9:
            basis.F[5]='B'; basis.R[3]='R'; break;
        case 10:
            basis.F[5]='R'; basis.R[3]='B'; break;
        default:
            basis.F[5]='X'; basis.R[3]='X'; break;
    }
    return {
        U: basis.U.join(''),
        D: basis.D.join(''),
        F: basis.F.join(''),
        B: basis.B.join(''),
        L: basis.L.join(''),
        R: basis.R.join(''),
    };
}

export function OLLAdd(topConfig, sideConfig) {
  return {
    U: topConfig,
    D: 'WWWWWWWWW',
    F: sideConfig.substr(0, 3) + 'BBBBBB',
    B: sideConfig.substr(6, 3) + 'GGGGGG',
    L: sideConfig.substr(9, 3) + 'OOOOOO',
    R: sideConfig.substr(3, 3) + 'RRRRRR',
  };
}

export function PLLAdd(sideConfig) {
  return {
    U: 'YYYYYYYYY',
    D: 'WWWWWWWWW',
    F: sideConfig.substr(0, 3) + 'BBBBBB',
    B: sideConfig.substr(6, 3) + 'GGGGGG',
    L: sideConfig.substr(9, 3) + 'OOOOOO',
    R: sideConfig.substr(3, 3) + 'RRRRRR',
  };
}

// F2L_variations: keyed by the algorithm moves string
// State = full cube state from F2LConfig(corner, edge)
// All placeholders for now
export const F2L_variations = {
  "f2l-1":   F2LConfig(3,5),
  "f2l-2":   F2LConfig(2,8),
  "f2l-3":   F2LConfig(2,3),
  "f2l-4":   F2LConfig(3,2),
  "f2l-b1":  F2LConfig(3,3),
  "f2l-b2":  F2LConfig(2,2),
  "f2l-b3":  F2LConfig(3,7),
  "f2l-b4":  F2LConfig(2,6),
  "f2l-b5":  F2LConfig(3,1),
  "f2l-b6":  F2LConfig(2,4),
  "f2l-b7":  F2LConfig(3,4),
  "f2l-b8":  F2LConfig(2,1),
  "f2l-b9":  F2LConfig(3,6),
  "f2l-b10": F2LConfig(2,7),
  "f2l-b11": F2LConfig(3,8),
  "f2l-b12": F2LConfig(2,5),
  "f2l-u1":  F2LConfig(1,3),
  "f2l-u2":  F2LConfig(1,2),
  "f2l-u3":  F2LConfig(1,5),
  "f2l-u4":  F2LConfig(1,8),
  "f2l-u5":  F2LConfig(1,7),
  "f2l-u6":  F2LConfig(1,6),
  "f2l-u7":  F2LConfig(1,1),
  "f2l-u8":  F2LConfig(1,4),
  "f2l-m1":  F2LConfig(3,9),
  "f2l-m2":  F2LConfig(2,9),
  "f2l-m3":  F2LConfig(3,10),
  "f2l-m4":  F2LConfig(2,10),
  "f2l-m5":  F2LConfig(1,10),
  "f2l-m6":  F2LConfig(1,9),
  "f2l-c1":  F2LConfig(6,2),
  "f2l-c2":  F2LConfig(6,3),
  "f2l-c3":  F2LConfig(5,2),
  "f2l-c4":  F2LConfig(4,3),
  "f2l-c5":  F2LConfig(5,3),
  "f2l-c6":  F2LConfig(4,2),
  "f2l-s1":  F2LConfig(5,9),
  "f2l-s2":  F2LConfig(4,9),
  "f2l-s3":  F2LConfig(5,10),
  "f2l-s4":  F2LConfig(4,10),
  "f2l-s5":  F2LConfig(6,10),
};

// OLL_variations: keyed by OLL name e.g. 'OLL #27'
// OLLAdd(topConfig, sideConfig)
//   topConfig: 9-char U face (Y=oriented, X=not)
//   sideConfig: 12-char string F(3)+B(3)+L(3)+R(3) top row of each side
const X9 = 'XXXXXXXXX';
const X12 = 'XXXXXXXXXXXX';
export const OLL_variations = {
  'OLL #27': OLLAdd('XYXYYYXYY', 'XXXXXYXXYXXY'),
  'OLL #26': OLLAdd('XYYYYYXYX', 'YXXYXXXXXYXX'),
  'OLL #25': OLLAdd('XYYYYYYYX', 'XXYXXXXXXYXX'),
  'OLL #24': OLLAdd('XYYYYYXYY', 'YXXXXXXXYXXX'),
  'OLL #22': OLLAdd('XYXYYYXYX', 'XXYXXXYXXYXY'),
  'OLL #21': OLLAdd('XYXYYYXYX', 'XXXYXYXXXYXY'),
  'OLL #23': OLLAdd('YYYYYYXYX', 'YXYXXXXXXXXX'),
  'OLL #1':  OLLAdd('XXXXYXXXX', 'XYXYYYXYXYYY'),
  'OLL #2':  OLLAdd('XXXXYXXXX', 'XYYXYXYYXYYY'),
  'OLL #4':  OLLAdd('XXYXYXXXX', 'YYXYYXXYXYYX'),
  'OLL #3':  OLLAdd('XXXXYXXXY', 'XYXXYYXYYXYY'),
  'OLL #19': OLLAdd('YXYXYXXXX', 'XYXYYXXYXXYY'),
  'OLL #18': OLLAdd('XXXXYXYXY', 'XYXXYXYYYXYX'),
  'OLL #17': OLLAdd('YXXXYXXXY', 'XYXXYXYYXXYY'),
  'OLL #20': OLLAdd('YXYXYXYXY', 'XYXXYXXYXXYX'),
  'OLL #57': OLLAdd('YXYYYYYXY', 'XYXXXXXYXXXX'),
  'OLL #28': OLLAdd('YXYYYXYYY', 'XXXXYXXYXXXX'),
  'OLL #55': OLLAdd('XYXXYXXYX', 'XXXYYYXXXYYY'),
  'OLL #52': OLLAdd('XYXXYXXYX', 'YXXYYYXXYXYX'),
  'OLL #51': OLLAdd('XXXYYYXXX', 'XYYXXXYYXYXY'),
  'OLL #56': OLLAdd('XXXYYYXXX', 'XYXYXYXYXYXY'),
  'OLL #45': OLLAdd('XXYYYYXXY', 'XYXXXXXYXYXY'),
  'OLL #33': OLLAdd('XXYYYYXXY', 'YYXXXXXYYXXX'),
  'OLL #40': OLLAdd('YXXYYYXXY', 'XYXXXXYYXXXY'),
  'OLL #39': OLLAdd('XXYYYYYXX', 'XYXYXXXYYXXX'),
  'OLL #14': OLLAdd('XXXYYYXXY', 'YYXXXXYYXYXX'),
  'OLL #13': OLLAdd('XXXYYYYXX', 'XYYXXYXYYXXX'),
  'OLL #16': OLLAdd('XXYYYYXXX', 'YYXYXXXYXYXX'),
  'OLL #15': OLLAdd('YXXYYYXXX', 'XYYXXYXYXXXY'),
  'OLL #46': OLLAdd('YYXXYXYYX', 'XXXYYYXXXXYX'),
  'OLL #34': OLLAdd('XXXYYYYXY', 'XYXXXYXYXYXX'),
  'OLL #38': OLLAdd('XYYYYXYXX', 'XYXYYXXXYXXX'),
  'OLL #36': OLLAdd('YYXXYYXXY', 'XYXXXXYXXXYY'),
  'OLL #44': OLLAdd('XXYXYYXYY', 'XXXXXXXYXYYY'),
  'OLL #43': OLLAdd('YXXYYXYYX', 'XXXYYYXYXXXX'),
  'OLL #31': OLLAdd('XYYXYYXXY', 'YYXXXXXXYXYX'),
  'OLL #32': OLLAdd('YYXYYXYXX', 'XYYXYXYXXXXX'),
  'OLL #35': OLLAdd('YXXXYYXYY', 'YXXXXYXYXXYX'),
  'OLL #37': OLLAdd('YYXYYXXXY', 'YYXXYYXXXXXX'),
  'OLL #5':  OLLAdd('XXXXYYXYY', 'XXXXXYXYYXYY'),
  'OLL #6':  OLLAdd('XYYXYYXXX', 'YYXYXXXXXYYX'),
  'OLL #48': OLLAdd('XYXYYXXXX', 'XYYXYXYXXYXY'),
  'OLL #47': OLLAdd('XYXXYYXXX', 'YYXYXYXXYXYX'),
  'OLL #50': OLLAdd('XYXYYXXXX', 'YYXYYYXXYXXX'),
  'OLL #49': OLLAdd('XYXXYYXXX', 'XYYXXXYXXYYY'),
  'OLL #53': OLLAdd('XYXYYXXXX', 'XYXYYYXXXYXY'),
  'OLL #54': OLLAdd('XYXXYYXXX', 'XYXYXYXXXYYY'),
  'OLL #11': OLLAdd('YXXYYXXYX', 'XXYXYYXYXXXY'),
  'OLL #12': OLLAdd('XXYXYYXYX', 'YXXYXXXYXYYX'),
  'OLL #7':  OLLAdd('XYXYYXYXX', 'XYYXYYXXYXXX'),
  'OLL #8':  OLLAdd('YXXYYXXYX', 'YXXYYXYYXXXX'),
  'OLL #10': OLLAdd('XXYYYXXYX', 'XXYXYXXYYXXY'),
  'OLL #9':  OLLAdd('XYXYYXXXY', 'YYXXYXYXXYXX'),
  'OLL #29': OLLAdd('XYYYYXXXY', 'YYXXYXXXYXXX'),
  'OLL #42': OLLAdd('XYYYYXXXY', 'XYXXYXXXXYXY'),
  'OLL #41': OLLAdd('XYXYYXYXY', 'XYXXYXYXYXXX'),
  'OLL #30': OLLAdd('XYXYYXYXY', 'XYXXYYXXXYXX'),
};

// PLL_variations: keyed by perm name e.g. 'Ua Perm'
// PLLAdd(sideConfig) where sideConfig = 12-char F(3)+B(3)+L(3)+R(3) top row
export const PLL_variations = {
  'Ua Perm': PLLAdd('BBBRGRGOGORO'),
  'Ub Perm': PLLAdd('BBBRORGRGOGO'),
  'H Perm':  PLLAdd('BGBRORGBGORO'),
  'Z Perm':  PLLAdd('BRBRBRGOGOGO'),
  'Aa Perm': PLLAdd('BBGORBRGRGOO'),
  'Ab Perm': PLLAdd('BBRGRGOGBROO'),
  'E Perm':  PLLAdd('RBOBRGOGRGOB'),
  'T Perm':  PLLAdd('BBRGOBRGGORO'),
  'F Perm':  PLLAdd('BGRGRBRBGOOO'),
  'Ja Perm': PLLAdd('OOBRRRGGOBBG'),
  'Jb Perm': PLLAdd('BRRGBBRGGOOO'),
  'Ra Perm': PLLAdd('BOBRRGOGRGBO'),
  'Rb Perm': PLLAdd('BRBRBGOGRGOO'),
  'V Perm':  PLLAdd('BBGOGRGRBROO'),
  'Y Perm':  PLLAdd('BBGORRGOBRGO'),
  'Na Perm': PLLAdd('GBBROOBGGORR'),
  'Nb Perm': PLLAdd('BBGOORGGBRRO'),
  'Ga Perm': PLLAdd('OGOBRRGOBRBG'),
  'Gb Perm': PLLAdd('BGRGBBROGORO'),
  'Gc Perm': PLLAdd('OBOBGRGOBRRG'),
  'Gd Perm': PLLAdd('RBGOROBORGGB'),
};

// ---------------------------------------------------------------------------
// PLL_arrows — cyclic arrow data for PLL diagrams
// Each entry is an array of cycles. Each cycle is an array of U-face sticker
// indices (0–8, row-major: 0=top-left … 8=bot-right).
//
// A cycle [a,b,c] draws: a→b, b→c, c→a  (single-headed)
// A cycle [a,b]   draws: a→b, b→a        (double swap = two single arrows)
//
// U face index layout (top-down view):
//   0 1 2
//   3 4 5
//   6 7 8
// ---------------------------------------------------------------------------
export const PLL_arrows = {
  'Ua Perm': [[1,3,5]],              // 3-cycle CCW: bottom-left → bottom-center → bottom-right → back
  'Ub Perm': [[5,3,1]],              // 3-cycle CW
  'H Perm':  [[1,7],[3,5]],          // two 2-swaps: top-center↔bottom-center, left↔right
  'Z Perm':  [[1,3],[5,7]],          // two 2-swaps: top-center↔left, right↔bottom-center
  'Aa Perm': [[0,2,8]],              // 3-cycle corners CW
  'Ab Perm': [[8,2,0]],              // 3-cycle corners CCW
  'E Perm':  [[0,2],[6,8]],          // two 2-swaps: diagonal corners
  'T Perm':  [[2,8],[3,5]],          // 2-swap corners + 2-swap edges
  'F Perm':  [[1,7],[2,8]],
  'Ja Perm': [[0,6],[3,7]],
  'Jb Perm': [[2,8],[5,7]],
  'Ra Perm': [[0,2],[3,7]],              // 3-cycle
  'Rb Perm': [[0,2],[5,7]],              // 3-cycle reverse
  'V Perm':  [[1,5],[0,8]],
  'Y Perm':  [[0,8],[1,3]],
  'Na Perm': [[2,6],[3,5]],
  'Nb Perm': [[0,8],[3,5]],
  'Ga Perm': [[8,6,0],[7,1,3]],      // two 3-cycles
  'Gb Perm': [[0,6,8],[3,1,7]],
  'Gc Perm': [[6,8,2],[7,1,5]],
  'Gd Perm': [[2,8,6],[5,1,7]],
};
