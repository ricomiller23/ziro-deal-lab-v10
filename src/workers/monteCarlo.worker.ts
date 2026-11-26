import { runMonteCarloSim } from '../engine/monteCarlo';
import { Assumptions } from '../engine/types';

self.onmessage = (e: MessageEvent<{ assumptions: Assumptions; iterations?: number }>) => {
  const { assumptions, iterations = 10000 } = e.data;
  try {
    const results = runMonteCarloSim(assumptions, iterations);
    self.postMessage({ success: true, results });
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message });
  }
};
