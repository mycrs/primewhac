import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  computePackageRecommendation,
  getRecommendationLabels,
} from '@/utils/packageRecommendationQuiz';

const PackageRecommendationQuiz = ({ quizConfig, isDe = false, onApply, tierOptions }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!quizConfig?.enabled || !quizConfig.steps?.length) return null;

  const steps = quizConfig.steps;
  const current = steps[step];
  const isLast = step >= steps.length - 1;
  const selectedId = answers[current?.id]?.optionId;

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) reset();
  };

  const selectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [current.id]: { optionId: option.id, scores: option.scores },
    }));
  };

  const goNext = () => {
    if (!selectedId) return;
    if (isLast) {
      const rec = computePackageRecommendation(answers, quizConfig, isDe);
      const enabledTiers = tierOptions?.map((t) => t.id) || ['standard', 'premium'];
      if (!enabledTiers.includes(rec.tier)) {
        rec.tier = enabledTiers.includes('premium') ? 'premium' : enabledTiers[0] || 'premium';
      }
      setResult(rec);
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (result) {
      setResult(null);
      setStep(steps.length - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const applyRecommendation = () => {
    if (!result || !onApply) return;
    onApply(result);
    handleOpenChange(false);
  };

  const labels = result ? getRecommendationLabels(result.tier, result.regionTab, isDe) : null;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-5 h-11 rounded-full px-6 text-sm font-semibold gap-2 bg-[#e50914] hover:bg-[#c40812] text-white shadow-lg shadow-[#e50914]/30 border border-[#ff4d5a]/40 transition-all hover:scale-[1.02]"
      >
        <HelpCircle className="w-4 h-4 shrink-0" />
        {quizConfig.buttonLabel}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md bg-[#141414] border border-[#262626] text-white sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e50914]" />
              {quizConfig.dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {result
                ? quizConfig.resultIntro
                : isDe
                  ? `Schritt ${step + 1} von ${steps.length}`
                  : `Adım ${step + 1} / ${steps.length}`}
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-white mb-1">{current.question}</p>
                {current.hint && <p className="text-xs text-slate-500">{current.hint}</p>}
              </div>

              <div className="space-y-2" role="radiogroup" aria-label={current.question}>
                {current.options.map((opt) => {
                  const active = selectedId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => selectOption(opt)}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ${
                        active
                          ? 'border-[#e50914] bg-[#e50914]/10 text-white'
                          : 'border-[#262626] bg-[#0a0a0a]/50 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  disabled={step === 0}
                  className="text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {isDe ? 'Zurück' : 'Geri'}
                </Button>
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!selectedId}
                  className="bg-[#e50914] hover:bg-[#c40812] text-white"
                >
                  {isLast ? (isDe ? 'Ergebnis' : 'Sonuç') : isDe ? 'Weiter' : 'İleri'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e50914]/40 bg-[#e50914]/10 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  {isDe ? 'Unsere Empfehlung' : 'Önerimiz'}
                </p>
                <p className="text-xl font-bold text-white">{labels.tierLabel}</p>
                <p className="text-sm text-slate-300 mt-1">{labels.regionLabel}</p>
              </div>

              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
                {result.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  className="border-[#262626] text-slate-300 hover:text-white flex-1"
                >
                  {isDe ? 'Neu starten' : 'Baştan başla'}
                </Button>
                <Button
                  type="button"
                  onClick={applyRecommendation}
                  className="bg-[#e50914] hover:bg-[#c40812] text-white flex-1"
                >
                  {quizConfig.applyButtonLabel}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PackageRecommendationQuiz;
