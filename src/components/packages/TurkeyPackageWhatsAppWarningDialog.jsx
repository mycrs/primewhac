import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AlertTriangle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * TR: WhatsApp öncesi bilgilendirme. Dış tıklama / Esc ile kapanmaz.
 * @param {'package' | 'test'} variant — package: Avrupa CTA + Devam Et; test: sadece uyarı + Devam Et
 */
export default function TurkeyPackageWhatsAppWarningDialog({
  open,
  onContinue,
  onGoEurope,
  variant = 'package',
}) {
  const isTest = variant === 'test';
  const descId = isTest ? 'turkey-test-wa-desc' : 'turkey-package-wa-desc';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={() => {}} modal>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200'
          )}
          onPointerDown={(e) => e.preventDefault()}
        />
        <DialogPrimitive.Content
          aria-describedby={descId}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            'fixed left-[50%] top-[50%] z-[10001] w-[min(100%-1.5rem,28rem)] translate-x-[-50%] translate-y-[-50%]',
            'rounded-2xl border border-primary/30 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 shadow-2xl shadow-primary/40',
            'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
          )}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                isTest
                  ? 'bg-green-500/15 border-green-500/35'
                  : 'bg-amber-500/15 border-amber-500/35'
              )}
            >
              <AlertTriangle
                className={cn('h-6 w-6', isTest ? 'text-green-400' : 'text-amber-400')}
                aria-hidden
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <DialogPrimitive.Title className="text-lg font-bold text-white leading-snug">
                Türkiye Paketi Hakkında Bilgi
              </DialogPrimitive.Title>
            </div>
          </div>
          <p id={descId} className="text-slate-300 text-sm leading-relaxed mb-6">
            Türkiye paketleri yalnızca Türkiye&apos;de çalışır. Türkiye dışında yaşıyorsanız Avrupa paketlerimize göz atın.
          </p>
          {isTest ? (
            <Button
              type="button"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-[#b20710] hover:from-green-500 hover:to-[#b20710] text-white font-bold shadow-lg shadow-green-900/30"
              onClick={onContinue}
            >
              Devam Et
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-white h-11"
                onClick={onGoEurope}
              >
                <Globe className="w-4 h-4 mr-2 shrink-0" />
                Avrupa Paketlerine Bak
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#b20710] hover:to-[#b20710] text-white font-semibold h-11 shadow-lg shadow-primary/25"
                onClick={onContinue}
              >
                Devam Et
              </Button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
