/**
 * Google ürün snippet'leri — Offer merchant alanları (dijital IPTV aboneliği).
 */
export const SCHEMA_PRICE_VALID_UNTIL = '2027-12-31';

/** @param {'TR'|'DE'|'EU'} country */
export function merchantOfferExtras(country = 'TR') {
  const isEu = country === 'DE' || country === 'EU';
  const currency = isEu ? 'EUR' : 'TRY';
  const addressCountry = isEu ? 'DE' : 'TR';

  return {
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: 'QruzeTV' },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: addressCountry,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 1,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
      },
    },
  };
}

export function enrichOfferForMerchant(offer, country = 'TR') {
  return { ...offer, ...merchantOfferExtras(country) };
}
