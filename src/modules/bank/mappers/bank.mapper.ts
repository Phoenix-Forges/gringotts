export const toMoney = (value: { toString(): string }): number => Number(value.toString());

