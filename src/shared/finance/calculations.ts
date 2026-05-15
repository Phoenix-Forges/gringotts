export interface CashFlow {
  amount: number;
  date: Date;
}

export function cagr(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || years <= 0) return 0;
  return Math.pow(endingValue / beginningValue, 1 / years) - 1;
}

export function xirr(cashFlows: CashFlow[]): number {
  if (cashFlows.length < 2) return 0;
  const first = cashFlows[0];
  if (!first) return 0;
  let rate = 0.1;
  for (let i = 0; i < 50; i += 1) {
    let f = 0;
    let df = 0;
    for (const flow of cashFlows) {
      const years = (flow.date.getTime() - first.date.getTime()) / (365 * 24 * 60 * 60 * 1000);
      const base = Math.pow(1 + rate, years);
      f += flow.amount / base;
      df += (-years * flow.amount) / (base * (1 + rate));
    }
    if (Math.abs(df) < 1e-8) break;
    const next = rate - f / df;
    if (Math.abs(next - rate) < 1e-7) return next;
    rate = next;
  }
  return rate;
}

