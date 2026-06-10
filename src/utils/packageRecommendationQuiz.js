import {
  DEFAULT_PACKAGE_QUIZ,
  PACKAGE_QUIZ_OPTION_SCORES,
} from '@/data/defaultPackageQuizContent';

export function mergePackageQuizContent(saved = {}) {
  return {
    ...DEFAULT_PACKAGE_QUIZ,
    ...saved,
    steps: mergeQuizSteps(saved.steps),
    reasons: { ...DEFAULT_PACKAGE_QUIZ.reasons, ...saved.reasons },
  };
}

function mergeQuizSteps(savedSteps) {
  const savedList = Array.isArray(savedSteps) ? savedSteps : [];
  return DEFAULT_PACKAGE_QUIZ.steps.map((defStep) => {
    const saved =
      savedList.find((s) => s?.id === defStep.id) || savedList[DEFAULT_PACKAGE_QUIZ.steps.indexOf(defStep)];
    const merged = { ...defStep, ...saved };
    merged.options = defStep.options.map((defOpt) => {
      const savedOpt = (saved?.options || []).find((o) => o?.id === defOpt.id);
      return { ...defOpt, ...savedOpt };
    });
    return merged;
  });
}

/** CMS + varsayılanlar → canlı quiz config */
export function resolvePackageQuiz(pageContent, isDe = false) {
  const merged = mergePackageQuizContent(pageContent?.packageQuiz);

  if (merged.enabled === false) return { enabled: false };

  const steps = merged.steps.map((step) => ({
    id: step.id,
    question: isDe ? step.questionDe || step.question : step.question,
    hint: isDe ? step.hintDe || step.hint : step.hint,
    options: (step.options || []).map((opt) => ({
      id: opt.id,
      label: isDe ? opt.labelDe || opt.label : opt.label,
      scores: PACKAGE_QUIZ_OPTION_SCORES[step.id]?.[opt.id] || {},
    })),
  }));

  return {
    enabled: true,
    buttonLabel: isDe ? merged.buttonLabelDe || merged.buttonLabel : merged.buttonLabel,
    dialogTitle: isDe ? merged.dialogTitleDe || merged.dialogTitle : merged.dialogTitle,
    resultIntro: isDe ? merged.resultIntroDe || merged.resultIntro : merged.resultIntro,
    applyButtonLabel: isDe ? merged.applyButtonLabelDe || merged.applyButtonLabel : merged.applyButtonLabel,
    steps,
    reasons: merged.reasons,
  };
}

function pickWinner(scores, a, b, fallback) {
  const sa = scores[a] || 0;
  const sb = scores[b] || 0;
  if (sa === sb) return fallback;
  return sa > sb ? a : b;
}

export function computePackageRecommendation(answers, quizConfig, isDe = false) {
  const totals = { standard: 0, premium: 0, tr: 0, eu: 0 };
  for (const entry of Object.values(answers || {})) {
    const scores = entry?.scores;
    if (!scores) continue;
    for (const [key, val] of Object.entries(scores)) {
      totals[key] = (totals[key] || 0) + val;
    }
  }

  const tier = pickWinner(totals, 'standard', 'premium', 'premium');
  const region = pickWinner(totals, 'tr', 'eu', 'tr');
  const reasons = buildReasons(tier, region, quizConfig?.reasons, isDe);

  return { tier, region, regionTab: region === 'eu' ? 'EU' : 'TR', reasons };
}

function buildReasons(tier, region, reasons = {}, isDe = false) {
  const r = { ...DEFAULT_PACKAGE_QUIZ.reasons, ...reasons };
  const list = [];
  if (tier === 'standard') {
    list.push(...(isDe ? r.standardDe : r.standardTr));
  } else {
    list.push(...(isDe ? r.premiumDe : r.premiumTr));
  }
  if (region === 'eu') list.push(isDe ? r.regionEuDe : r.regionEuTr);
  else list.push(isDe ? r.regionTrDe : r.regionTrTr);
  return list.filter(Boolean);
}

export function getRecommendationLabels(tier, regionTab, isDe = false) {
  const tierLabel =
    tier === 'standard'
      ? isDe
        ? 'Standard Pakete'
        : 'Standart Paketler'
      : isDe
        ? 'Premium Pakete'
        : 'Premium Paketler';
  const regionLabel =
    regionTab === 'EU'
      ? isDe
        ? 'Europa Pakete'
        : 'Avrupa Paketleri'
      : isDe
        ? 'Türkei Pakete'
        : 'Türkiye Paketleri';
  return { tierLabel, regionLabel };
}
