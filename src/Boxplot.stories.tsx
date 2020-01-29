import React from 'react';
import Boxplot from './Boxplot';

export default {
  component: Boxplot,
  title: 'Boxplot',
};

const data = Array(100)
  .fill(0)
  .map(() => Math.random());

export const Default = () => {
  return <Boxplot data={data} style={{ height: 20 }} />;
};
