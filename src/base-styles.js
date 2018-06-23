import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset};

  html,
  body {}

  .root {}
`;

export default baseStyles;