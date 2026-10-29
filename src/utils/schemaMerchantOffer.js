/**
 * Google Merchant listings — Offer alanları (dijital IPTV aboneliği).
 *
 * Dijital ürün kuralları:
 *  - returnMethod KULLANILMAZ (fiziksel iade yöntemi; dijital ürünlerde geçersiz)
 *  - returnPolicyCategory: MerchantReturnFiniteReturnWindow (24 saat) VEYA MerchantReturnNotPermitted
 *  - shippingDetails: anlık dijital teslimat (0 gün, 0 ücret)
 */
import { SITE_URL } from '@/constants/siteUrl';

export const SCHEMA_PRICE_VALID_UNTIL = '2027-12-31';

/**
 * @param {'TR'|'DE'|'EU'|'AT'|'CH'|'NL'} country
 */
export function merchantOfferExtras(country = 'TR') {
  const isEu = country === 'DE' || country === 'EU' || country === 'AT' || country === 'CH' || country === 'NL';
  const currency = isEu ? 'EUR' : 'TRY';

  // Avrupa'da birden fazla hedef ülke için DefinedRegion listesi
  const shippingDestination = isEu
    ? [
        { '@type': 'DefinedRegion', addressCountry: 'DE' },
        { '@type': 'DefinedRegion', addressCountry: 'AT' },
        { '@type': 'DefinedRegion', addressCountry: 'CH' },
        { '@type': 'DefinedRegion', addressCountry: 'NL' },
      ]
    : { '@type': 'DefinedRegion', addressCountry: 'TR' };

  // Avrupa'da çok ülkeli return policy
  const applicableCountry = isEu ? ['DE', 'AT', 'CH', 'NL'] : 'TR';

  return {
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'QruzeTV',
      url: SITE_URL,
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      name: isEu ? 'QruzeTV Digital Subscription Return Policy' : 'QruzeTV Dijital Abonelik İade Politikası',
      applicableCountry,
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 1,
      returnFees: 'https://schema.org/FreeReturn',
      // returnMethod KASITLI OLARAK KALDIRILDI — dijital ürünlerde geçersiz, GSC uyarısı üretir
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency,
      },
      shippingDestination,
      doesNotShip: false,
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitCode: 'DAY',
        },
        businessDays: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday',
          ],
        },
      },
    },
  };
}

export function enrichOfferForMerchant(offer, country = 'TR') {
  return { ...offer, ...merchantOfferExtras(country) };
}
