// based on https://github.com/datavisyn/chartjs-chart-box-and-violin-plot

declare type BoxplotBaseStats = {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
};

/**
 * computes the boxplot stats using the given interpolation function if needed
 * @param {number[]} arr sorted array of number
 * @param {(i: number, j: number, fraction: number)} interpolate interpolation function
 */
function quantilesInterpolate(
  arr: ReadonlyArray<number>,
  interpolate: (i: number, j: number, fraction: number) => number
): BoxplotBaseStats {
  const n1 = arr.length - 1;
  const compute = (q: number) => {
    const index = q * n1;
    const lo = Math.floor(index);
    const h = index - lo;
    const a = arr[lo];

    return h === 0 ? a : interpolate(a, arr[Math.min(lo + 1, n1)], h);
  };

  return {
    min: arr[0],
    q1: compute(0.25),
    median: compute(0.5),
    q3: compute(0.75),
    max: arr[n1],
  };
}

/**
 * Uses R's quantile algorithm type=7.
 * https://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population
 */
export function quantilesType7(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, (a, b, alpha) => a + alpha * (b - a));
}

/**
 * ‘linear’: i + (j - i) * fraction, where fraction is the fractional part of the index surrounded by i and j.
 * (same as type 7)
 */
export function quantilesLinear(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, (i, j, fraction) => i + (j - i) * fraction);
}

/**
 * ‘lower’: i.
 */
export function quantilesLower(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, i => i);
}

/**
 * 'higher': j.
 */
export function quantilesHigher(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, (_, j) => j);
}

/**
 * ‘nearest’: i or j, whichever is nearest
 */
export function quantilesNearest(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, (i, j, fraction) =>
    fraction < 0.5 ? i : j
  );
}

/**
 * ‘midpoint’: (i + j) / 2
 */
export function quantilesMidpoint(arr: ReadonlyArray<number>) {
  return quantilesInterpolate(arr, (i, j) => (i + j) * 0.5);
}

/**
 * The hinges equal the quartiles for odd n (where n <- length(x))
 * and differ for even n. Whereas the quartiles only equal observations
 * for n %% 4 == 1 (n = 1 mod 4), the hinges do so additionally
 * for n %% 4 == 2 (n = 2 mod 4), and are in the middle of
 * two observations otherwise.
 * @param {number[]} arr sorted array
 */
export function fivenum(arr: ReadonlyArray<number>): BoxplotBaseStats {
  // based on R fivenum
  const n = arr.length;

  // assuming R 1 index system, so arr[1] is the first element
  const n4 = Math.floor((n + 3) / 2) / 2;
  const compute = (d: number) =>
    0.5 * (arr[Math.floor(d) - 1] + arr[Math.ceil(d) - 1]);

  return {
    min: arr[0],
    q1: compute(n4),
    median: compute((n + 1) / 2),
    q3: compute(n + 1 - n4),
    max: arr[n - 1],
  };
}

/**
 * compute the whiskers
 * @param boxplot
 * @param {number[]} arr sorted array
 * @param {number} coef
 */
export function whiskers(
  boxplot: BoxplotBaseStats,
  arr: ReadonlyArray<number>,
  coef = 1.5
) {
  const iqr = boxplot.q3 - boxplot.q1;
  // since top left is max
  const coefValid = typeof coef === 'number' && coef > 0;
  let whiskerMin = coefValid
    ? Math.max(boxplot.min, boxplot.q1 - coef * iqr)
    : boxplot.min;
  let whiskerMax = coefValid
    ? Math.min(boxplot.max, boxplot.q3 + coef * iqr)
    : boxplot.max;

  if (Array.isArray(arr)) {
    // compute the closest real element
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (v >= whiskerMin) {
        whiskerMin = v;
        break;
      }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      const v = arr[i];
      if (v <= whiskerMax) {
        whiskerMax = v;
        break;
      }
    }
  }

  return {
    whiskerMin,
    whiskerMax,
  };
}

export declare type QuantilesMethod =
  | 'hinges'
  | 'fivenum'
  | 'type7'
  | 'quantiles'
  | 'linear'
  | 'lower'
  | 'higher'
  | 'nearest'
  | 'midpoint';

const methodLookup = {
  hinges: fivenum,
  fivenum: fivenum,
  type7: quantilesType7,
  quantiles: quantilesType7,
  linear: quantilesLinear,
  lower: quantilesLower,
  higher: quantilesHigher,
  nearest: quantilesNearest,
  midpoint: quantilesMidpoint,
};

function determineQuantiles(
  q: QuantilesMethod | ((arr: ReadonlyArray<number>) => BoxplotBaseStats)
) {
  if (typeof q === 'function') {
    return q;
  }
  return methodLookup[q] || quantilesType7;
}

export declare type BoxplotStatsOptions = {
  /**
   * @default 1.5
   */
  coef: number;

  /**
   * @default 7
   */
  quantiles:
    | QuantilesMethod
    | ((arr: ReadonlyArray<number>) => BoxplotBaseStats);
};

const defaultStatsOptions: BoxplotStatsOptions = {
  coef: 1.5,
  quantiles: 'type7',
};

function determineStatsOptions(options: Partial<BoxplotStatsOptions> = {}) {
  const coef = options.coef ?? defaultStatsOptions.coef;
  const q = options.quantiles ?? defaultStatsOptions.quantiles;
  const quantiles = determineQuantiles(q);
  return {
    coef,
    quantiles,
  };
}

export declare type BoxplotStats = BoxplotBaseStats & {
  outliers: number[];
  mean: number;
  whiskerMin: number;
  whiskerMax: number;
};

export function boxplotStats(
  arr: ReadonlyArray<number>,
  options: Partial<BoxplotStatsOptions> = {}
): BoxplotStats {
  // console.assert(Array.isArray(arr));
  if (arr.length === 0) {
    return {
      min: NaN,
      max: NaN,
      median: NaN,
      mean: NaN,
      q1: NaN,
      q3: NaN,
      whiskerMin: NaN,
      whiskerMax: NaN,
      outliers: [],
    };
  }

  const filtered = arr.filter(v => typeof v === 'number' && !Number.isNaN(v));
  filtered.sort((a, b) => a - b);

  const { quantiles, coef } = determineStatsOptions(options);

  const stats = quantiles(filtered);
  const { whiskerMin, whiskerMax } = whiskers(stats, filtered, coef);
  return {
    ...stats,
    mean: filtered.reduce((acc, a) => acc + a, 0) / filtered.length,
    outliers: filtered.filter(v => v < whiskerMin || v > whiskerMax),
    whiskerMax,
    whiskerMin,
  };
}
