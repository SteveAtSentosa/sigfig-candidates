import React from 'react';
import { withTranslation } from 'utilities/decorators';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SvgImage, Button } from 'Components/Common';

import { KeyResultTypes } from './KeyResult.Types';

const KeyResultTypesContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 25px;
  
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const KeyResultTypesItemContainer = styled(Button)`
  flex-basis: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 13px 0;
  border: 1px solid transparent;
  border-radius: 9px;
  background-color: transparent;
  cursor: pointer;
  
  &:focus {
    border: 1px solid #66d587;
  }
  
  @media screen and (max-width: 768px) {
    flex-basis: 50%;
  }
  
  ${props => props.isSelected && `
    background: #ffffff;
    box-shadow: 0px 4px 22px rgba(36, 73, 134, 0.1);    
  `}
`;

const KeyResultTypesIcon = styled(SvgImage)`
  height: 32px;
`;

const KeyResultTypesTitle = styled.div`
  margin-top: 10px;
  color: #707e93;
  font-weight: 600;
  font-size: 11px;
  text-align: center;
`;

@withTranslation('KeyResultItem')
class KeyResultTypesToggler extends React.PureComponent {
  static propTypes = {
    selectedType: PropTypes.number,
    onSelectType: PropTypes.func,
  }

  get types() {
    const { i18n } = this.props;

    return KeyResultTypes.map(({ name, icon, type }) => ({
      name: i18n(`KeyResultTypes.${name}`),
      type,
      icon,
      dataCy: `key-type-${name.toLowerCase()}`,
    }));
  }

  render() {
    const { selectedType, onSelectType } = this.props;

    return (
      <KeyResultTypesContainer>
        {
          this.types.map((keyResultType, index) => {
            const { name, type, icon, dataCy } = keyResultType;
            const isSelected = selectedType === type;

            return (
              <KeyResultTypesItemContainer
                key={index}
                isSelected={isSelected}
                onClick={() => onSelectType(type)}
                data-cy={dataCy}
              >
                <KeyResultTypesIcon source={icon} />
                <KeyResultTypesTitle>{name}</KeyResultTypesTitle>
              </KeyResultTypesItemContainer>
            );
          })
        }
      </KeyResultTypesContainer>
    );
  }
}

export { KeyResultTypesToggler };
