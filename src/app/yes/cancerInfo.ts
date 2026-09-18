/* Single source of truth for the demo results.

   - CANCER_INFO defines every description exactly once, keyed by cancer type.
     Editing a description is therefore a one-place change, no matter how many
     sample images point at that type.
   - SAMPLES only says which type a file name stands for and at what risk
     percentage. See doc/cancerType.md for the intended mapping. */

export type CancerTypeId = "melanoma" | "bcc" | "scc" | "merkel" | "dfsp";

export type CancerInfo = {
    nameZh: string;
    nameEn: string;
    points: { zh: string; en: string }[];
};

export const CANCER_INFO: Record<CancerTypeId, CancerInfo> = {
    melanoma: {
        nameZh: "黑色素瘤",
        nameEn: "Melanoma",
        points: [
            { zh: "通常表現為新出現或正在變化的痣", en: "Often looks like a new or changing mole" },
            { zh: "形狀可能左右不對稱", en: "May be asymmetric" },
            { zh: "邊緣不平整、呈鋸齒狀", en: "Uneven or jagged border" },
            { zh: "顏色多樣（棕、黑、紅、藍等）", en: "Multiple colors (brown, black, red, blue, etc.)" },
            { zh: "大小、形狀或顏色的變化尤其重要", en: "Changes in size, shape or color are particularly important" },
            { zh: "可記住 ABCDE：不對稱、邊緣、顏色、直徑、變化", en: "Remember ABCDE: Asymmetry, Border, Color, Diameter, Evolving" },
        ],
    },
    bcc: {
        nameZh: "色素性基底細胞癌",
        nameEn: "Pigmented Basal Cell Carcinoma (BCC)",
        points: [
            { zh: "外觀可與棕色或黑色痣非常相似", en: "Can look surprisingly similar to a brown or black mole" },
            { zh: "可能呈光亮、隆起或珍珠般的外觀", en: "May be shiny, raised or pearly" },
            { zh: "可以有多種顏色", en: "Can have several colors" },
            { zh: "可能出血、結痂或反覆形成傷口", en: "May bleed, crust or repeatedly form a sore" },
            { zh: "基底細胞癌是最常見的皮膚癌類型", en: "BCC is the most common type of skin cancer" },
        ],
    },
    scc: {
        nameZh: "色素性鱗狀細胞癌",
        nameEn: "Pigmented Squamous Cell Carcinoma (SCC)",
        points: [
            { zh: "可表現為棕色或深色的隆起斑塊", en: "Can appear as a brown or dark raised spot" },
            { zh: "觸感常粗糙、有鱗屑、厚實或結痂", en: "Often feels rough, scaly, thick or crusty" },
            { zh: "可能變大或出血", en: "May grow or bleed" },
            { zh: "有時與老人斑或痣相似", en: "Can sometimes resemble an age spot or mole" },
        ],
    },
    merkel: {
        nameZh: "梅克爾細胞癌",
        nameEn: "Merkel Cell Carcinoma",
        points: [
            { zh: "通常不是典型的棕色痣", en: "Usually not a typical brown mole" },
            { zh: "常表現為快速生長的紅色、粉紅或紫色硬塊", en: "Often appears as a rapidly growing firm red, pink or purple bump" },
            { zh: "可能光亮並呈圓頂狀", en: "Can be shiny and dome-shaped" },
            { zh: "比基底細胞癌、鱗狀細胞癌及黑色素瘤罕見得多", en: "Much less common than BCC, SCC and melanoma" },
        ],
    },
    dfsp: {
        nameZh: "隆起性皮膚纖維肉瘤",
        nameEn: "Dermatofibrosarcoma Protuberans (DFSP)",
        points: [
            { zh: "一種罕見的皮膚癌", en: "A rare skin cancer" },
            { zh: "常由硬實、相對平坦或輕微隆起的斑塊開始", en: "Often starts as a firm, relatively flat or slightly raised patch" },
            { zh: "可逐漸發展成結節或腫塊", en: "Can gradually develop into nodules or lumps" },
            { zh: "容易被誤認為其他良性皮膚增生", en: "It can be mistaken for other benign skin growths" },
        ],
    },
};

/* Risk percentages. The result bands in yes/page.tsx are >=70 red, 50-70 orange and
   below 50 blue, so each chance stays inside its band even with the display jitter. */
const HIGH_CHANCE = 90;
const MODERATE_CHANCE = 60;

export type SampleCase = { type: CancerTypeId; percentage: number };

export const SAMPLES: Record<string, SampleCase> = {
    /* High chance - red band */
    "sampleA.jpeg": { type: "melanoma", percentage: HIGH_CHANCE },
    "sampleB.jpeg": { type: "bcc", percentage: HIGH_CHANCE },
    "sampleC.jpeg": { type: "scc", percentage: HIGH_CHANCE },
    "sampleD.jpeg": { type: "merkel", percentage: HIGH_CHANCE },
    "sampleE.jpeg": { type: "dfsp", percentage: HIGH_CHANCE },
    /* Moderate chance - orange band */
    "sampleF.jpeg": { type: "melanoma", percentage: MODERATE_CHANCE },
    "sampleG.jpeg": { type: "bcc", percentage: MODERATE_CHANCE },
    "sampleH.jpeg": { type: "scc", percentage: MODERATE_CHANCE },
    "sampleI.jpeg": { type: "merkel", percentage: MODERATE_CHANCE },
    "sampleJ.jpeg": { type: "dfsp", percentage: MODERATE_CHANCE },
};
