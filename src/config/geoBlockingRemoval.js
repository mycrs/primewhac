/**
 * Geo-Blocking Removal Configuration
 * Ensures global access is defined in system parameters.
 */

export const geoConfig = {
  globalAccess: true,
  countryRestrictions: {
    enabled: false,
    blockedCountries: [],
    allowedCountries: ['*'] // All allowed
  },
  regionalRules: {
    enabled: false
  },
  turkeyAccess: {
    fullyOpen: true,
    priorityRouting: true
  },
  ipWhitelist: {
    expandedGlobally: true
  }
};