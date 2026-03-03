
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

  if (!formData.duration || formData.duration.trim() === '') {
    errors.duration = 'Süre zorunludur.';
  }

  if (!formData.region || formData.region.trim() === '') {
    errors.region = 'Bölge seçimi zorunludur.';
  }

  if (!formData.features || formData.features.length === 0) {
    errors.features = 'En az bir özellik eklemelisiniz.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
