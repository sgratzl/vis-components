import React from 'react';
import Boxplot from './Boxplot';

export default {
  component: Boxplot,
  title: 'Boxplot',
};

const style = {
  height: 20,
};
const data = Array(100)
  .fill(0)
  .map(() => Math.random());

const common = { data, style };

const types = {
  data: [18882.492, 7712.077, 5830.748, 7206.05],
  style,
};

export const Default = () => {
  return <Boxplot {...common} />;
};

export const SortHighlights = () => {
  return (
    <div>
      <Boxplot {...common} sortHint="min" />
      <Boxplot {...common} sortHint="q1" />
      <Boxplot {...common} sortHint="median" />
      <Boxplot {...common} sortHint="mean" />
      <Boxplot {...common} sortHint="q3" />
      <Boxplot {...common} sortHint="max" />
    </div>
  );
};

export const QuantileMethods = () => {
  return (
    <div>
      <Boxplot {...types} quantiles="type7" />
      <Boxplot {...types} quantiles="fivenum" />
    </div>
  );
};
