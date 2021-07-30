import styled from 'styled-components';
import { Button, Intent, Classes } from '@blueprintjs/core';

import { Dialog } from 'Components/Common';

const DialogStyled = styled(Dialog).attrs({
  icon: 'info-sign',
  mobile: { size: '30%' },
})`
  padding-bottom: 0;
`;

const DialogBody = styled.div.attrs({
  className: Classes.DIALOG_BODY,
})``;

const SubmitButton = styled(Button).attrs({
  intent: Intent.SUCCESS,
})`
  margin-top: 20px;
  min-width: 100px;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

export {
  DialogStyled as Dialog,
  DialogBody,
  SubmitButton,
  ButtonContainer,
};
