// Recognize earlier stored department names without changing route IDs.
const legacyNames = {
  "§_Mn9X7_qz": "Management",
  "¥_Pb!8Q_wk": "Publicity",
  "∆_Ot₹3W_vx": "Outreach",
  "ø_UxK2_mj": "UI/UX",
  "π_Ds9J8_tr": "Design",
  "µ_Wb₹5D_lp": "Web Development",
  "∑_ApZ3V_gh": "App Development",
  "Ω_GmF6X_ny": "Game Development",
  "≈_DtB1S_zk": "Data Science",
  "∂_CdH4D_bv": "Cloud & DevOps",
  "∫_BkY2C_xu": "Blockchain",
  "≤_CpM8P_rw": "Competitive Programming"
};

export const normalizeDepartmentName = name => legacyNames[name] || name;
