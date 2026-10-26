const priceFormatter = new Intl.NumberFormat('fr-DZ', { maximumFractionDigits: 0 })

/** 1200 → "1 200 DA" */
export const formatPrice = (amount) => `${priceFormatter.format(amount)} DA`

/** Percentage saved between the old and the new price. */
export const discountPercent = (price, oldPrice) =>
  oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
