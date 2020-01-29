import styled, { CreateStyled } from '@emotion/styled';

export type Theme = {
  colors: {
    sortIndicator: 'red';
  };
  boxplot: {
    stroke: 'black';
    dotSize: 5;
    box: 'grey';
    outlier: 'black';
  };
  // ...
};

export default styled as CreateStyled<Theme>;
