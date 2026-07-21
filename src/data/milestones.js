// Key milestones per addiction with neurological context
export const MILESTONES = {
  alcohol: [
    { day: 1,  label: 'Threshold Crossed',  detail: 'Alcohol clearing from blood. Sleep disrupted. The hardest day is often the first — you are already past it.' },
    { day: 7,  label: 'One Week',            detail: 'Sleep recovering. Liver inflammation reducing. Brain fog beginning to lift. One week of new data. Don\'t track the scale yet — the brain is seeking dopamine substitutes and water retention masks real progress.' },
    { day: 14, label: 'Settling',            detail: 'Dopamine recalibrating. Sleep architecture improving. Ghrelin and leptin (hunger/fullness) beginning to normalise. The shift from resistant to driven — if it\'s happening — is not a fluke. It\'s the old behaviour losing its functional purpose.' },
    { day: 21, label: 'The Stall',           detail: 'Cortisol stays elevated at this stage, favouring fat retention. The scale looks static despite real progress underneath. This is the point most people quit — and the most common window for a prior-run blip. Expected, not failure. Track how the first 30 minutes after waking feels vs. Week 1, not the scale.' },
    { day: 30, label: 'Evidence',            detail: 'Accumulated deficit and settling cortisol show up — visible change, often abrupt-looking. Re-weigh and compare to Day 1 baseline. Liver enzymes normalised. GABA/glutamate balance restored. REM sleep improved. The identity work of weeks 1–3 is now producing visible evidence.' },
    { day: 35, label: 'Reserves Building',   detail: 'REM rebound typically completes 4–6 weeks in. Insulin sensitivity improving. Waist measurement now more meaningful than scale weight — visceral fat (stored preferentially from alcohol) starts dropping disproportionately.' },
    { day: 42, label: 'Consolidation',       detail: 'Habit consolidation — identity shift moving from effortful to automatic. Does "I am someone who doesn\'t drink" feel true rather than aspirational? Energy turning outward (family, work) rather than purely inward-defensive.' },
    { day: 60, label: 'Two Months',          detail: 'Grey matter recovery begins. Anxiety markers measurably down. Fatty liver resolving. Testosterone measurably rebounding.' },
    { day: 75, label: '75 Days',             detail: 'Reward pathways less reactive. Cognitive sharpness at new peak. Physical changes visible and consolidating.' },
    { day: 90, label: '90 Days',             detail: 'Research-backed neurological change threshold. Habit pathways rewired. This is the new baseline.' },
  ],
  porn: [
    { day: 7,  label: 'One Week',         detail: 'Acute withdrawal past. Dopamine receptors beginning to upregulate. The circuit is weakening.' },
    { day: 14, label: 'Two Weeks',        detail: 'Second urge wave possible — expected and documented. You know this wave. It passes.' },
    { day: 21, label: 'Three Weeks',      detail: 'Dopamine sensitivity to natural reward measurably increasing. Real-life connection returning.' },
    { day: 30, label: 'One Month',        detail: 'Habit circuit significantly weakened. Natural reward pathways strengthening. This is the threshold.' },
    { day: 60, label: 'Two Months',       detail: 'Circuits normalised. Attraction to real life, real connection, fully restored.' },
    { day: 90, label: '90 Days',          detail: 'The old pattern has no structural advantage. This is the biological new normal.' },
  ],
  smoking: [
    { day: 1,  label: 'Day One',          detail: 'Heart rate and blood pressure drop within 20 minutes of last cigarette.' },
    { day: 3,  label: 'Nicotine Cleared', detail: 'Nicotine fully cleared from bloodstream. Physical dependency is done. What remains is habit.' },
    { day: 14, label: 'Two Weeks',        detail: 'Circulation improving. Lung function increasing. Breathing capacity measurably up.' },
    { day: 30, label: 'One Month',        detail: 'Cilia in lungs regenerated. Risk of infection dropping. Energy noticeably higher.' },
    { day: 90, label: '90 Days',          detail: 'Lung capacity significantly improved. Risk of heart disease already falling. Identity consolidated.' },
    { day: 365, label: 'One Year',        detail: 'Heart attack risk halved. Lung cancer risk falling. A year of compound interest on one decision.' },
  ],
  cannabis: [
    { day: 7,  label: 'One Week',         detail: 'THC largely cleared. Sleep beginning to return to normal. The fog is thinning.' },
    { day: 30, label: 'One Month',        detail: 'Endocannabinoid system recalibrated. Motivation, memory, and mood self-generated.' },
    { day: 90, label: '90 Days',          detail: 'Full cognitive clarity. The baseline that was suppressed is now the baseline you live from.' },
  ],
  socialMedia: [
    { day: 7,  label: 'One Week',         detail: 'Attention span beginning to recover. Boredom tolerance increasing. Genuine interests resurfacing.' },
    { day: 30, label: 'One Month',        detail: 'Dopamine system recalibrated. Real-world connection more satisfying. Focus measurably longer.' },
  ],
  gambling: [
    { day: 14, label: 'Two Weeks',        detail: 'Highest relapse risk period past. The anticipation circuit beginning to quiet.' },
    { day: 30, label: 'One Month',        detail: 'Dopamine system recalibrating. Real outcomes providing genuine satisfaction.' },
    { day: 90, label: '90 Days',          detail: "The gambling circuit has no structural advantage. You're past the biological phase." },
  ],
  sugar: [
    { day: 5,  label: 'Five Days',        detail: 'Blood sugar stabilised. Headaches and fatigue resolving. Energy becoming more consistent.' },
    { day: 21, label: 'Three Weeks',      detail: 'Insulin sensitivity improved. Cortisol reducing. Stable energy through the day.' },
    { day: 30, label: 'One Month',        detail: 'Taste receptors upregulated. Natural foods tasting richer. Reset complete.' },
  ],
};
