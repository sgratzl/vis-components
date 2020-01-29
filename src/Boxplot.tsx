import React, { FC } from 'react';
import { BoxplotStats, BoxplotStatsOptions, boxplotStats } from './data/math';
import { NumberFormat, defaultNumberFormat, percent } from 'formatter';
import styled, { Theme } from './styled';

export declare type BoxplotProps = {
  data: ReadonlyArray<number> | BoxplotStats;
  sortHint?: 'min' | 'max' | 'median' | 'q1' | 'q3';
  formatter?: NumberFormat;
} & Partial<BoxplotStatsOptions>;

function computeLabel(v: BoxplotStats, f: NumberFormat) {
  return `min = ${f(v.min)}\nq1 = ${f(v.q1)}\nmedian = ${f(
    v.median
  )}\nmean = ${f(v.mean)} (dashed line)\nq3 = ${f(v.q3)}\nmax = ${f(v.max)}`;
}

declare type BoxWrapper = {
  range: number;
  data: BoxplotStats;
};

const BoxplotContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BoxplotWhiskers = styled('div')<BoxWrapper>(
  `
  // whiskers + contains everything
  position: relative;
  border-left: 1px solid ${({ theme }: { theme: Theme }) =>
    theme.boxplot.stroke};
  border-right: 1px solid ${({ theme }: { theme: Theme }) =>
    theme.boxplot.stroke};
  height: 90%;
  max-height: 30px;

  &::before {

    // whiskers line
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 50%;
    width: 100%;
    border-bottom: 1px solid ${({ theme }: { theme: Theme }) =>
      theme.boxplot.stroke};
  }

  &[data-sort=min] {
    border-left-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.sortIndicator};
  }

  &[data-sort=max] {
    border-right-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.sortIndicator};
  }
`,
  ({ data, range }) => ({
    left: percent(data.whiskerMin),
    width: percent(range),
  })
);

const BoxplotBox = styled('div')<BoxWrapper>(
  `
  position: absolute;
  top: 10%;
  height: 80%;
  background: ${({ theme }: { theme: Theme }) => theme.boxplot.box};
  outline: 1px solid ${({ theme }: { theme: Theme }) => theme.boxplot.stroke};

  
  &[data-sort=q1]::after,
  &[data-sort=q3]::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
  }

  &[data-sort=q1]::after {
    left: -1px;
    border-left: 1px solid ${({ theme }: { theme: Theme }) =>
      theme.colors.sortIndicator};
  }

  &[data-sort=q3]::after {
    right: -1px;
    border-right: 1px solid ${({ theme }: { theme: Theme }) =>
      theme.colors.sortIndicator};
  }

`,
  ({ data, range }) => ({
    left: percent((data.q1 - data.whiskerMin) / range),
    width: percent((data.q3 - data.q1) / range),
  })
);

const BoxplotMedian = styled('div')<BoxWrapper>(
  `
  position: absolute;
  top: 10%;
  height: 80%;
  width: 1px;
  background: ${({ theme }: { theme: Theme }) => theme.boxplot.stroke};

  &[data-sort=median] {
    background-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.sortIndicator};
  }
`,
  ({ data, range }) => ({
    left: percent((data.median - data.q1) / range),
  })
);
const BoxplotMean = styled('div')<BoxWrapper>(
  `
  position: absolute;
  top: 10%;
  height: 80%;
  width: 1px;
  background: ${({ theme }: { theme: Theme }) =>
    `repeating-linear-gradient(to bottom, transparent 0%, transparent 5%, ${theme.boxplot.stroke} 5%, ${theme.boxplot.stroke} 15%, transparent 15%, transparent 20%)`};

  &[data-sort=mean] {
    background: 
    ${({ theme }: { theme: Theme }) =>
      `repeating-linear-gradient(to bottom, transparent 0%, transparent 5%, ${theme.colors.sortIndicator} 5%, ${theme.colors.sortIndicator} 15%, transparent 15%, transparent 20%)`};
  }
`,
  ({ data, range }) => ({
    left: percent((data.mean - data.q1) / range),
  })
);

const BoxplotOutlier = styled('div')<{ value: number }>(
  `
  position: absolute;
  top: 50%;
  background: ${({ theme }: { theme: Theme }) => theme.boxplot.outlier};
  border-radius: 50%;

  &[data-sort] {
    background: ${({ theme }: { theme: Theme }) => theme.colors.sortIndicator};
  }
`,
  ({ value, theme }) => ({
    left: percent(value),
    margin: -theme.boxplot.outlier / 2,
    width: theme.boxplot.dotSize,
    height: theme.boxplot.dotSize,
  })
);

const Boxplot: FC<BoxplotProps> = ({
  data,
  sortHint,
  formatter = defaultNumberFormat,
  ...options
}) => {
  const boxplot = Array.isArray(data)
    ? boxplotStats(data, options)
    : (data as BoxplotStats);
  const range = boxplot.whiskerMax - boxplot.whiskerMin;

  // compute proper sort hint location
  let cleanSortHint = sortHint;
  const outliers = boxplot.outliers.slice();
  let minOutlier: number | null = null;
  let maxOutlier: number | null = null;
  if (
    sortHint === 'min' &&
    outliers.length > 0 &&
    outliers[0]! <= boxplot.whiskerMin
  ) {
    cleanSortHint = undefined;
    minOutlier = outliers.shift()!;
  } else if (
    sortHint === 'max' &&
    outliers.length > 0 &&
    outliers[outliers.length - 1]! >= boxplot.whiskerMax
  ) {
    cleanSortHint = undefined;
    maxOutlier = outliers.pop()!;
  }

  return (
    <BoxplotContainer title={computeLabel(boxplot, formatter)}>
      <BoxplotWhiskers data={boxplot} range={range} data-sort={cleanSortHint}>
        <BoxplotBox data={boxplot} range={range} data-sort={cleanSortHint} />
        <BoxplotMedian data={boxplot} range={range} data-sort={cleanSortHint} />
        <BoxplotMean data={boxplot} range={range} data-sort={cleanSortHint} />
      </BoxplotWhiskers>
      {outliers.map(outlier => (
        <BoxplotOutlier key={outlier} value={outlier} />
      ))}
      {maxOutlier && <BoxplotOutlier value={maxOutlier} />}
      {minOutlier && <BoxplotOutlier value={minOutlier} />}
    </BoxplotContainer>
  );
};

export default Boxplot;
