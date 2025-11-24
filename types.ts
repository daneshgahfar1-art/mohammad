export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: Operator;
  waitingForNewValue: boolean;
  history: string[];
}

export interface KhwarizmiResponse {
  wisdom: string;
}
