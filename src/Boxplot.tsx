import React, { FC, CSSProperties } from 'react';
import { BoxplotStats, BoxplotStatsOptions, boxplotStats } from './data/math';
import { NumberFormat, defaultNumberFormat, percent } from './formatter';
import styled, { themed } from './styled';

export declare type BoxplotSortHint = 'min' | 'max' | 'median' | 'q1' | 'q3' | 'mean';

export declare type BoxplotProps = {
  data: ReadonlyArray<number> | BoxplotStats;
  sortHint?: BoxplotSortHint;
  formatter?: NumberFormat;
  /**
   * disable rendering of the mean indicator
   */
  noMean?: boolean;
  domain?: [number, number];

  className?: string;
  style?: CSSProperties;
} & Partial<BoxplotStatsOptions>;

function computeLabel(v: BoxplotStats, f: NumberFormat) {
  return `min = ${f(v.min)}\nq1 = ${f(v.q1)}\nmedian = ${f(v.median)}\nmean = ${f(v.mean)} (dashed line)\nq3 = ${f(
    v.q3
  )}\nmax = ${f(v.max)}`;
}

const BoxplotContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BoxplotWhiskers = styled('div')`
  position: relative;
  border-left: 1px solid ${themed(theme => theme.boxplot.stroke)};
  border-right: 1px solid ${themed(theme => theme.boxplot.stroke)};
  height: 90%;
  max-height: 30px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 50%;
    width: 100%;
    border-bottom: 1px solid ${themed(theme => theme.boxplot.stroke)};
  }

  &[data-sort='min'] {
    border-left-color: ${themed(theme => theme.boxplot.sortIndicator)};
  }

  &[data-sort='max'] {
    border-right-color: ${themed(theme => theme.boxplot.sortIndicator)};
  }
`;

const BoxplotBox = styled('div')`
  position: absolute;
  top: 10%;
  height: 80%;
  background: ${themed(theme => theme.boxplot.box)};
  outline: 1px solid ${themed(theme => theme.boxplot.stroke)};

  &[data-sort='q1']::after,
  &[data-sort='q3']::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
  }

  &[data-sort='q1']::after {
    left: -1px;
    border-left: 1px solid ${themed(theme => theme.boxplot.sortIndicator)};
  }

  &[data-sort='q3']::after {
    right: -1px;
    border-right: 1px solid ${themed(theme => theme.boxplot.sortIndicator)};
  }
`;

const BoxplotMedian = styled('div')`
  position: absolute;
  top: 10%;
  height: 80%;
  width: 1px;
  background: ${themed(theme => theme.boxplot.stroke)};

  &[data-sort='median'] {
    background-color: ${themed(theme => theme.boxplot.sortIndicator)};
  }
`;
const BoxplotMean = styled('div')`
  position: absolute;
  top: 10%;
  height: 80%;
  width: 1px;
  background: ${themed(
    theme =>
      `repeating-linear-gradient(to bottom, transparent 0%, transparent 5%, ${theme.boxplot.stroke} 5%, ${theme.boxplot.stroke} 15%, transparent 15%, transparent 20%)`
  )};

  &[data-sort='mean'] {
    background: ${themed(
      theme =>
        `repeating-linear-gradient(to bottom, transparent 0%, transparent 5%, ${theme.boxplot.sortIndicator} 5%, ${theme.boxplot.sortIndicator} 15%, transparent 15%, transparent 20%)`
    )};
  }
`;

const BoxplotOutlier = styled('div')`
  position: absolute;
  top: 50%;
  background: ${themed(theme => theme.boxplot.outlier)};
  width: ${themed(theme => theme.boxplot.dotSize)};
  height: ${themed(theme => theme.boxplot.dotSize)};
  margin: ${themed(theme => -theme.boxplot.dotSize / 2)};
  border-radius: 50%;

  &[data-sort] {
    background: ${themed(theme => theme.boxplot.sortIndicator)};
  }
`;

const Boxplot: FC<BoxplotProps> = ({
  className,
  style,
  domain,
  noMean,
  data,
  sortHint,
  formatter = defaultNumberFormat,
  ...options
}) => {
  const boxplot = Array.isArray(data) ? boxplotStats(data, options) : (data as BoxplotStats);
  const domainMin = domain ? domain[0] : boxplot.min;
  const domainMax = domain ? domain[1] : boxplot.max;
  const domainRange = domainMax - domainMin;

  const scale = (v: number) => (v - domainMin) / domainRange;
  const q1 = scale(boxplot.q1);
  const q3 = scale(boxplot.q3);
  const median = scale(boxplot.median);
  const mean = scale(boxplot.mean);
  const whiskerMin = scale(boxplot.whiskerMin);
  const whiskerRange = scale(boxplot.whiskerMax) - whiskerMin;

  // compute proper sort hint location
  let cleanSortHint = sortHint;
  const outliers = boxplot.outliers.slice();
  let minOutlier: number | null = null;
  let maxOutlier: number | null = null;
  if (sortHint === 'min' && outliers.length > 0 && outliers[0]! <= boxplot.whiskerMin) {
    cleanSortHint = undefined;
    minOutlier = outliers.shift()!;
  } else if (sortHint === 'max' && outliers.length > 0 && outliers[outliers.length - 1]! >= boxplot.whiskerMax) {
    cleanSortHint = undefined;
    maxOutlier = outliers.pop()!;
  }

  return (
    <BoxplotContainer title={computeLabel(boxplot, formatter)} className={className} style={style}>
      <BoxplotWhiskers data-sort={cleanSortHint} style={{ left: percent(whiskerMin), width: percent(whiskerRange) }}>
        <BoxplotBox
          data-sort={cleanSortHint}
          style={{
            left: percent((q1 - whiskerMin) / whiskerRange),
            width: percent((q3 - q1) / whiskerRange),
          }}
        />
        <BoxplotMedian data-sort={cleanSortHint} style={{ left: percent((median - whiskerMin) / whiskerRange) }} />
        {!noMean && (
          <BoxplotMean data-sort={cleanSortHint} style={{ left: percent((mean - whiskerMin) / whiskerRange) }} />
        )}
      </BoxplotWhiskers>
      {outliers.map(outlier => (
        <BoxplotOutlier key={outlier} style={{ left: percent(scale(outlier)) }} />
      ))}
      {maxOutlier && <BoxplotOutlier style={{ left: percent(scale(maxOutlier)) }} />}
      {minOutlier && <BoxplotOutlier style={{ left: percent(scale(minOutlier)) }} />}
    </BoxplotContainer>
  );
};

export default Boxplot;
