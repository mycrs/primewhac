import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTestModal } from '@/contexts/TestModalContext';
import TestModalContent from './TestModalContent';

const TestFormModal = ({ contactData, appsData }) => {
  const { isOpen, closeTestModal } = useTestModal();

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && closeTestModal()}>
      <DialogContent className="left-[50%] top-[max(0.5rem,env(safe-area-inset-top))] z-[9999] flex max-h-[calc(100dvh-1rem)] min-h-0 w-[94%] max-w-lg translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-xl border-slate-800 bg-[#0a0a0a] p-0 text-white shadow-2xl sm:top-[50%] sm:max-h-[min(90vh,720px)] sm:translate-y-[-50%] sm:max-w-[550px] [&>*]:min-h-0">
        <TestModalContent onClose={closeTestModal} />
      </DialogContent>
    </Dialog>
  );
};

export default TestFormModal;