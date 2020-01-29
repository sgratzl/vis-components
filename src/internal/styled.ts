import styled, { CreateStyled } from '@emotion/styled';
import { Theme, defaultTheme } from '../theme';

export default styled as CreateStyled<Theme>;

export function themed(f: (theme: Theme) => any) {
  return (props: any) => {
    return f((props.theme ?? {}).boxplot ? props.theme : defaultTheme);
  };
}
