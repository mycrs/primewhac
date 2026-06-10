
export const validatePackageForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Paket adı zorunludur.';
  }

  if (formData.price === undefined || formData.price === null || formData.price === '') {
    errors.price = 'Fiyat zorunludur.';
  } else if (isNaN(formData.price) || Number(formData.price) < 0) {
    errors.price = 'Geçerli bir fiyat giriniz.';
  }

  const duration = formData.duration || formData.duration_custom || formData.duration_preset || '';
  if (!duration || String(duration).trim() === '') {
    errors.duration = 'Süre zorunludur.';
  }

  if (!formData.region || formData.region.trim() === '') {
    errors.region = 'Bölge seçimi zorunludur.';
  }

  if (!formData.features || formData.features.length === 0) {
    errors.features = 'En az bir özellik eklemelisiniz.';
  }

  if (formData.countdown_active) {
    const raw = formData.campaign_end_datetime ?? formData.campaign_end_date_input ?? '';
    if (!String(raw).trim()) {
      errors.campaign_end_datetime = 'Geri sayım açıkken kampanya bitiş tarihi zorunludur.';
    } else {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) {
        errors.campaign_end_datetime = 'Geçerli bir tarih ve saat seçin.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
