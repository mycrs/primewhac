import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTestModal } from '@/contexts/TestModalContext';
import TestModalContent from './TestModalContent';

const TestFormModal = ({ contactData, appsData }) => {
  const { isOpen, closeTestModal } = useTestModal();

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && closeTestModal()}>
      <DialogContent className="w-[95%] max-w-lg sm:max-w-[550px] bg-slate-950 border-slate-800 text-white p-0 gap-0 overflow-hidden shadow-2xl z-[9999] max-h-[90vh] flex flex-col rounded-xl">
        <TestModalContent onClose={closeTestModal} />
      </DialogContent>
    </Dialog>
  );
};

export default TestFormModal;