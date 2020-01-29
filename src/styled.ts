import styled, { CreateStyled } from '@emotion/styled';

const defaultTheme = {
  boxplot: {
    sortIndicator: 'red',
    stroke: 'black',
    dotSize: 5,
    box: 'grey',
    outlier: 'black',
  },
};

export type Theme = typeof defaultTheme;

export default styled as CreateStyled<Theme>;

export function themed(f: (theme: Theme) => any) {
  return (props: any) => {
    return f((props.theme ?? {}).boxplot ? props.theme : defaultTheme);
  };
}
