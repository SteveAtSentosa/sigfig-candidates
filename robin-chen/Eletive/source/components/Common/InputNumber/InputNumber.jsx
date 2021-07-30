import React from 'react';
import PropTypes from 'prop-types';

import { downChevronIcon, upArrow } from 'images/icons/common';

import * as Own from './InputNumber.Components';

export class InputNumber extends React.PureComponent {
   static propTypes = {
     showLeadingZero: PropTypes.bool,
     value: PropTypes.number,
     max: PropTypes.number,
     min: PropTypes.number,
     mini: PropTypes.bool,
     onChange: PropTypes.func.isRequired,
   };

   static defaultProps = {
     mini: false,
   };

   get value() {
     const { showLeadingZero, max, value } = this.props;
     if (!showLeadingZero) {
       return String(value);
     }
     if (!max) {
       return value < 10 ? `0${value}` : `${value}`;
     }
     return `${[...Array(`${max}`.length - `${value}`.length)].map(() => '0').join('')}${value}`;
   }

   change = (value) => {
     const { min, max, onChange } = this.props;
     const number = Number(value);
     // eslint-disable-next-line no-self-compare
     if (number === number && (!max || number <= max) && ((!min && min !== 0) || number >= min)) {
       setTimeout(() => onChange(number));
     }
   };

   handleChange = (event) => {
     const { max } = this.props;
     let { target: { value } } = event;
     if (max && `${value}`.length > `${max}`.length) {
       const array = `${value}`.split('');
       if (array[0] === '0') {
         array.splice(0, 1);
       } else {
         const prevValue = this.value;
         const index = array.findIndex((l, i) => l !== prevValue[i]);
         if (index < prevValue.length) {
           array.splice(index + 1, 1);
         } else {
           array.splice(prevValue.length - 1, 1);
         }
       }
       value = array.join('');
     }
     this.change(value);
   };

   handleClickUp = () => {
     const { value } = this.props;
     this.change(value + 1);
   };

   handleClickDown = () => {
     const { value } = this.props;
     this.change(value - 1);
   };

   render() {
     const { showLeadingZero, mini, onChange, min, max, value, ...restProps } = this.props;
     return (
       <Own.Container mini={mini}>
         <Own.Input {...restProps} mini={mini} value={this.value} onChange={this.handleChange} />
         <Own.ButtonsContainer mini={mini}>
           <Own.ChevronButton onClick={this.handleClickUp}>
             <Own.Icon source={upArrow} />
           </Own.ChevronButton>
           <Own.ChevronButton onClick={this.handleClickDown}>
             <Own.Icon source={downChevronIcon} />
           </Own.ChevronButton>
         </Own.ButtonsContainer>
       </Own.Container>
     );
   }
}
