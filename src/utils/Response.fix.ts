/**
 * Takes a Customer object and returns a new object
 * with the `history` property renamed to `product`.
 */
export function renameHistoryToProduct<T extends { history?: any }>(customer: T): Omit<T, 'history'> & { product: any } {
  const { history, ...rest } = customer;
  return {
    ...rest,
    product: history ?? null,
  };
}

/**
 * If you want to apply it to an array of customers:
 */
export function transformCustomerArray<T extends { history?: any }>(arr: T[]): Array<Omit<T, 'history'> & { product: any }> {
  return arr.map(renameHistoryToProduct);
}
