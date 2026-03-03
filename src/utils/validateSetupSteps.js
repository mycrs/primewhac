/**
 * Validates the setup steps configuration data.
 * @param {Object} data - The form data object containing title, app_links, and steps.
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateSetupSteps = (data) => {
  const errors = {};
  
  // 1. Basic Object Validation
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { global: "Geçersiz veri yapısı." } };
  }

  // 2. Title Validation
  if (!data.title?.trim()) {
    errors.title = "Cihaz başlığı zorunludur.";
  }

  // 3. App Links Validation
  // It's okay to have no links, but if they exist, they must be valid.
  if (Array.isArray(data.app_links)) {
    let hasLinkErrors = false;
    data.app_links.forEach((link, index) => {
      // Skip empty ghost objects if any, but ideally they shouldn't exist
      if (!link) return;

      if (!link.app_name?.trim()) {
        errors[`app_links_${index}_name`] = "Uygulama adı gerekli.";
        hasLinkErrors = true;
      }
      if (!link.app_url?.trim()) {
        errors[`app_links_${index}_url`] = "URL gerekli.";
        hasLinkErrors = true;
      }
    });

    if (hasLinkErrors) {
      errors.app_links = "Lütfen hatalı linkleri düzeltin.";
    }
  }

  // 4. Steps Validation
  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    errors.steps = "En az 1 kurulum adımı eklemelisiniz.";
  } else {
    const stepErrors = {};
    let hasStepErrors = false;

    data.steps.forEach((step, index) => {
      const currentStepErrors = {};
      if (!step.title?.trim()) {
        currentStepErrors.title = "Başlık gerekli.";
        hasStepErrors = true;
      }
      if (!step.description?.trim()) {
        currentStepErrors.description = "Açıklama gerekli.";
        hasStepErrors = true;
      }
      
      if (Object.keys(currentStepErrors).length > 0) {
        stepErrors[index] = currentStepErrors;
      }
    });

    if (hasStepErrors) {
      errors.stepErrors = stepErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};