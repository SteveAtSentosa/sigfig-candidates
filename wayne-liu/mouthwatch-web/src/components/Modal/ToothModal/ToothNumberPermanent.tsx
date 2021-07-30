import * as React from 'react'

const styles = require('./styles.scss')

interface Props {
  selected: string[]
  handleToothClick: (tooth: string) => void
}

export class ToothNumber extends React.Component<Props> {
  isToothSelected = (toothNum: string) => {
    return this.props.selected.includes(toothNum) ? '#ddd' : '#fefefe'
  }

  handleClick = e => {
    const toothSVG = e.target
    const { tooth } = toothSVG.dataset
    const { handleToothClick } = this.props
    handleToothClick(tooth)
  }
  render () {
    return (
      <div className={styles.tooth_chart}>
        <svg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 714 1213'>
					<path fill='#eff0f1' d='M1 439H0v-6a5 5 0 0 1 1 0c2 2 2 4 0 6z'/>
					<path className={styles.numbers} fill='#60727b' d='M1 439v-6-6l1-5c3-16 13-26 28-32 1-1 3-1 1-3-16-17-18-36-14-58 2-12 6-23 12-34 8-15 20-25 38-30l-5-7c-5-9-10-18-8-29 1-8 5-14 10-20 6-6 14-12 22-16 3-2 4-3 3-7-2-9-3-18-1-27 3-16 12-27 26-33a65 65 0 0 1 20-6c4 0 5-1 5-5-1-13 2-24 7-36 9-17 23-25 42-22 8 2 11 0 15-7 12-22 38-32 63-27a6 6 0 0 0 5-2c15-13 32-20 51-21 11-1 22 2 32 9 3 2 5 2 7 0 27-16 62-10 83 12 2 2 3 2 6 2 26-7 60 12 67 32 0 3 2 3 4 3a67 67 0 0 1 22 0c10 1 18 6 23 15 5 8 8 18 10 27l5 14c0 3 2 5 5 5 21 2 39 17 43 36 3 10 1 21-2 31-1 3 0 5 3 7 8 5 17 12 23 20 11 13 13 26 4 40l-8 12 5 2c12 4 22 11 29 22 13 20 19 42 18 66a43 43 0 0 1-12 27c-3 3-2 5 1 8l9 8c10 8 14 19 15 33a367 367 0 0 1-1 52c-2 11-8 20-18 26-2 2-3 3-1 5 13 17 13 35 2 53l-12 20c-7 14-19 22-35 24a55 55 0 0 1-19-1c-12-3-22-10-27-22-11-26-11-51 6-76 1-1 2-2 0-4a73 73 0 0 1-17-42c-2-18-1-35 6-51 1-4 5-7 5-10s-6-4-9-7c-9-7-12-17-13-28a47 47 0 0 0-5-17c-5-11-8-22-4-35 2-8 7-14 13-20l12-11-18-4c-14-3-23-12-26-26-1-11 3-21 10-28 4-4 3-6-1-8l-13-8c-10-6-16-15-19-26l-4-19c-1-3-2-4-5-4-20-3-27-10-29-30l-1-16c-11 8-22 14-36 8s-18-18-20-33l-9 11c-11 13-25 16-40 11-11-4-18-12-21-23-3-8-4-17-6-25-1 0 0-2-1-1l-1 2-5 22c-4 14-13 24-28 26-14 3-26-2-35-13l-8-10-2 11c-5 23-30 32-49 17-3-3-4-2-4 2l-5 21c-4 14-12 20-26 20-6 0-7 1-7 7a72 72 0 0 1-4 21c-4 15-15 23-29 27l-8 2-1 1c11 12 22 24 15 42-7 17-23 19-39 22l8 11 13 19c6 12 6 23-1 34a48 48 0 0 0-7 21c-1 14-8 24-19 31-3 2-3 3-1 6 8 9 9 20 9 31l-1 32a69 69 0 0 1-1 15c-1 9-6 16-14 21-3 1-3 2-1 5 15 21 17 44 9 67-5 17-16 29-34 31-20 3-38-3-49-21l-15-25c-10-16-8-33 3-48 2-3 3-5-1-7-11-6-15-16-17-28l-1-10-1-20v-6z'/>
					<path className={styles.numbers} fill='#60727b' d='M110 977l-13-3c-10-3-17-8-21-17a257 257 0 0 1-17-52c-3-16 1-30 13-42l-3-2-3-1c-33-15-44-37-35-71a148 148 0 0 1 8-24c1-3 1-5-2-7-10-7-18-16-24-27-16-30-5-71 25-88 18-10 37-10 56-1 7 3 11 8 14 15 6 12 8 26 9 40a159 159 0 0 1-3 40c0 5 0 8 5 10 14 7 21 19 21 34 0 7 0 14 4 21 6 12 5 24-2 36l-3 5 1 1c20 1 29 13 33 31a78 78 0 0 0 9 24l10 19a20 20 0 0 1-3 18 105 105 0 0 1-10 14c-2 1-2 2 1 3 25 9 27 24 21 45l-9 26c-1 4-1 5 3 5a34 34 0 0 1 11 2c13 4 19 12 20 25 0 12-3 24-6 36l-2 7 12-5c14-6 23-1 28 13 3 10 3 20 5 30v3l4-4c4-5 7-10 12-13 6-5 12-5 19-2s9 8 9 15-1 15 1 22c0 2 0 3 2 5l5-9a54 54 0 0 1 10-11c7-7 11-7 18 0a43 43 0 0 1 10 18l5 15 9-25a31 31 0 0 1 4-7c5-8 13-9 20-4s11 11 15 18l2 3c2-1 1-2 1-3v-23c1-7 4-12 10-15 7-2 13-1 18 3s9 10 13 15c1 1 2 3 4 2s2-2 2-4v-25c3-15 14-22 29-17 6 1 11 5 16 8 1-3-1-4-1-6-5-9-9-19-11-30-3-19 7-33 27-36 10-1 10-1 6-11l-10-32c-3-11 1-19 11-26a67 67 0 0 1 13-7c3-2 3-3 1-5l-7-7c-7-8-9-17-5-26l23-54c4-10 13-16 24-17l6-1-2-4c-9-14-11-29-2-44a13 13 0 0 0 2-7 57 57 0 0 1 1-16c3-14 12-23 25-28 3-1 3-2 2-5-7-13-8-27-4-40 3-10 2-20 3-29 1-18 8-26 26-32 47-14 85 23 81 69-2 15-6 30-18 41a47 47 0 0 1-13 9c-3 1-4 3-2 7 9 17 12 35 10 55-3 16-12 27-26 35a69 69 0 0 1-13 6c-3 1-4 1-2 4 8 9 12 20 12 32a54 54 0 0 1-3 14c-3 13-7 27-12 40-7 17-17 24-35 25h-3l9 12c10 18 7 39-10 51-6 5-14 8-21 10-4 0-5 2-3 5a57 57 0 0 1 6 18c2 15-3 27-16 36a53 53 0 0 1-20 9c-6 1-7 4-7 10-1 24-15 42-38 48a44 44 0 0 1-22 0c-8-2-7-2-11 5a53 53 0 0 1-8 12c-13 13-29 15-44 5-3-2-5-2-7 0-6 8-14 14-25 15-8 1-16-1-23-5-5-3-8-4-13-1a39 39 0 0 1-17 6c-14 1-24-5-32-15-2-2-3-4-5-1-20 17-48 2-54-18-1-5-3-5-8-4-24 8-62-6-63-47 0-5-1-8-6-10a91 91 0 0 1-24-12c-12-10-16-20-12-36a70 70 0 0 1 6-15c1-3 0-4-3-5a68 68 0 0 1-18-7 37 37 0 0 1-16-49l10-16z'/>
					<path fill='#eff0f1' d='M1 445c2 9 1 17 1 26-2-5-1-10-1-15v-11z'/>
					<path fill='#ccd2d5' d='M357 68l1-4 1 3z'/>
					<path fill='#eff0f1' d='M2 422l-1 5c0-2-1-4 1-5z'/>
					<path data-tooth='3' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('3')} d='M139 330a39 39 0 0 1-4 16c-4 8-6 18-8 27-4 20-16 29-36 25l-37-8c-18-4-29-17-31-36-2-24 4-45 18-64a45 45 0 0 1 22-16c11-4 21-1 31 5a142 142 0 0 1 34 27c7 6 11 14 11 24z'/>
					<path data-tooth='14' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('14')} d='M693 345c-1 26-11 40-33 46l-39 8c-16 3-31-10-33-27 0-9-3-17-8-25s-6-17-1-25c12-23 28-41 54-47 20-5 36 2 45 20 8 17 13 35 15 50z'/>
					<path data-tooth='2' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('2')} d='M63 505H36c-14 0-23-8-24-22-2-18-4-36-3-54 2-24 16-36 40-33a436 436 0 0 1 46 10c15 4 21 11 21 27s1 32-1 48c-2 15-9 22-25 22l-13 1H63z'/>
					<path data-tooth='15' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('15')} d='M600 454l1-28c1-10 6-16 16-19 15-5 30-7 45-10a49 49 0 0 1 19 0c16 3 26 15 26 32a340 340 0 0 1-2 55c-2 13-12 21-25 21l-57-2c-15-1-22-10-23-26v-23z'/>
					<path data-tooth='1' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('1')} d='M69 510c7 0 14 0 21 3 14 5 19 17 22 30s1 27-5 40c-6 14-17 20-32 21s-27-6-35-18a5 5 0 0 1-2-3c0-7-4-11-9-17-8-8-11-20-9-32 2-11 11-20 23-22a190 190 0 0 1 26-2z'/>
					<path data-tooth='16' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('16')} d='M649 511l22 1c18 3 27 15 25 32a64 64 0 0 1-4 16c-2 4-3 7-6 9-6 3-7 8-9 14-3 10-11 15-19 18-12 4-23 4-34-2-13-6-17-17-19-30a126 126 0 0 1 2-36c2-13 10-20 22-22h20z'/>
					<path data-tooth='9' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('9')} d='M362 32c0-15 5-21 18-23a94 94 0 0 1 42 4c14 4 19 14 18 28a129 129 0 0 1-17 55c-6 10-15 15-27 14-13-2-21-9-24-21a426 426 0 0 1-10-57z'/>
					<path data-tooth='8' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('8')} d='M276 41c-1-17 10-25 22-28a117 117 0 0 1 36-4c13 0 18 5 19 18 2 11 0 21-2 31a280 280 0 0 1-7 31c-3 10-10 18-21 21s-20-3-28-12a85 85 0 0 1-19-57z'/>
					<path data-tooth='12' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('12')} d='M622 170c1 11-4 17-13 22a94 94 0 0 0-16 10l-6 4c-12 8-25 9-35 2-12-8-19-24-16-38a28 28 0 0 1 9-15l22-20c17-13 40-8 50 11 3 6 4 13 5 24z'/>
					<path data-tooth='4' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('4')} d='M62 235c0-16 16-34 31-36a27 27 0 0 1 20 6c12 9 24 18 34 29 8 8 11 17 6 28-2 5-5 9-10 11-10 4-21 7-32 2l-32-13c-12-5-17-14-17-27z'/>
					<path data-tooth='5' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('5')} d='M148 212a28 28 0 0 1-13-3l-20-9c-15-7-19-21-20-35s8-24 20-30 23-5 33 3l24 20c14 13 11 35-5 48-5 4-12 7-19 6z'/>
					<path data-tooth='13' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('13')} d='M655 231c-1 16-6 26-18 31-13 5-25 11-38 15-12 4-33-5-37-16-4-8-2-15 4-21 10-13 23-23 36-33 13-11 22-9 34-1l6 4c9 6 13 14 13 21z'/>
					<path data-tooth='6' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('6')} d='M217 129c0 22-14 32-33 24a102 102 0 0 1-20-11c-25-19-23-60 3-75 13-6 24-5 32 4a14 14 0 0 1 3 4c7 18 13 37 15 54z'/>
					<path data-tooth='11' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('11')} d='M569 103c0 25-19 48-42 52-14 3-22-2-26-15-2-9-3-18 0-28l10-33c4-8 11-13 20-13 23-2 37 11 38 34v3z'/>
					<path data-tooth='7' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('7')} d='M273 90l-1 14c-5 16-23 22-36 12a78 78 0 0 1-24-39l-4-14c-2-5 0-10 4-14 11-13 25-20 43-20a13 13 0 0 1 13 12c3 16 3 33 5 49z'/>
					<path data-tooth='10' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('10')} d='M467 121c-14 0-25-11-24-25 1-18 2-36 5-53 1-8 6-14 14-14 17 0 30 6 41 18a20 20 0 0 1 4 21 205 205 0 0 1-20 41 24 24 0 0 1-20 12z'/>
					<path data-tooth='19' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('19')} d='M602 968c-23-2-46-11-65-29-7-7-8-15-4-24l17-37 5-15c4-8 11-11 19-10a260 260 0 0 1 61 15c10 4 14 13 15 23a45 45 0 0 1-2 18l-11 35c-5 18-14 24-35 24z'/>
					<path data-tooth='30' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('30')} d='M111 968l-10-1c-9-1-16-6-19-15-7-16-12-33-16-50-3-19 5-32 23-38a380 380 0 0 1 47-11c14-2 22 2 27 16a486 486 0 0 0 19 46c5 10 4 17-5 25-18 17-41 27-66 28z'/>
					<path data-tooth='18' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('18')} d='M680 808a62 62 0 0 1-1 13c-4 20-18 29-35 33-21 6-41 0-58-14-13-11-14-29-3-42 2-3 2-5 2-8a36 36 0 0 1 0-20 28 28 0 0 1 29-18l34 2c10 1 17 5 22 14 7 12 10 25 10 40z'/>
					<path data-tooth='31' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('31')} d='M37 815a175 175 0 0 1 7-42c4-12 12-19 24-19a147 147 0 0 0 30-2c26-5 39 22 33 38-1 4 0 6 2 8 11 14 9 32-5 44a64 64 0 0 1-80-1c-8-7-12-16-11-26z'/>
					<path data-tooth='17' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('17')} d='M610 678v-6c1-15 8-24 23-27 17-3 35-2 50 10 13 11 18 27 19 44a68 68 0 0 1-3 26c-5 15-16 23-30 26-4 1-7 0-10-1a120 120 0 0 0-22-2c-24 1-32-13-31-34a110 110 0 0 1 2-19 64 64 0 0 0 2-17z'/>
					<path data-tooth='32' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('32')} d='M111 716l-1 8c-3 16-11 23-27 24a231 231 0 0 0-25 3c-17 3-33-5-39-21-9-22-8-45 6-65 12-19 38-26 62-18 8 3 13 8 16 16 4 12 5 25 6 38l2 15z'/>
					<path data-tooth='20' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('20')} d='M519 987c0-14 6-22 19-25a35 35 0 0 1 19 0c14 5 28 10 40 19 12 10 18 21 14 36-5 17-27 29-44 23-15-5-28-11-38-24a52 52 0 0 1-10-29z'/>
					<path data-tooth='29' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('29')} d='M167 961a44 44 0 0 1 11 1q20 5 18 25c-1 27-26 53-54 54-24 2-43-20-37-42 2-8 7-14 14-18 13-8 27-13 41-20h7z'/>
					<path data-tooth='28' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('28')} d='M219 1063c-1 12-4 25-14 35a40 40 0 0 1-64-6c-9-14-4-33 10-42 12-8 26-12 39-16s30 12 29 29z'/>
					<path data-tooth='21' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('21')} d='M535 1111c-7 0-15-4-22-12a52 52 0 0 1-16-42 18 18 0 0 1 9-15c9-5 18-7 28-4 8 2 17 3 24 7 15 8 23 23 21 38-1 7-5 12-10 16-9 8-19 12-34 12z'/>
					<path data-tooth='27' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('27')} d='M254 1122c0 9-2 18-4 27-5 14-12 21-31 19-20-2-34-15-38-34-2-10 0-14 10-17l46-17c10-4 13-2 16 8a52 52 0 0 1 1 14z'/>
					<path data-tooth='22' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('22')} d='M464 1127a94 94 0 0 1 1-19c0-7 4-10 11-8 9 1 16 5 24 7l28 11c4 2 7 4 6 10 0 33-30 44-51 39-11-3-16-10-18-21l-1-19z'/>
					<path data-tooth='26' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('26')} d='M300 1154a156 156 0 0 1 0 23c0 13-8 20-21 20a26 26 0 0 1-26-32 13 13 0 0 1 2-5c8-12 17-23 27-33 4-3 9-4 13-1 3 1 5 3 5 7v21z'/>
					<path data-tooth='23' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('23')} d='M414 1154l2-19c2-9 9-12 16-6 15 10 25 24 32 41 3 7 1 13-4 18-6 8-15 11-25 9-7-1-11-6-14-11-5-9-7-20-7-32z'/>
					<path data-tooth='24' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('24')} d='M383 1207c-7 0-14-2-18-8-2-3-3-6-2-10 2-12 5-25 10-36a45 45 0 0 1 4-6c4-6 9-7 15-1 4 4 6 9 8 14l9 27a6 6 0 0 1-1 6c-6 9-14 14-25 14z'/>
					<path data-tooth='25' onClick={this.handleClick} className={styles.tooth} fill={this.isToothSelected('25')} d='M331 1207c-15 0-23-10-20-24 3-11 6-21 12-30a40 40 0 0 1 4-6c4-5 8-5 12 0a84 84 0 0 1 14 39c1 11 0 13-9 18a26 26 0 0 1-13 3z'/>
					<path className={styles.numbers} fill='#60727b' d='M42 710l2-2a7 7 0 0 0 5 2c2 0 3-1 3-3s-1-4-6-4v-2c4 0 6-2 6-4l-3-2a6 6 0 0 0-5 2l-1-3a9 9 0 0 1 6-2c4 0 6 2 6 5 0 2-1 4-3 5a5 5 0 0 1 4 5c0 4-3 6-7 6a9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M59 710c5-5 9-9 9-12 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-2c2-2 3-3 6-3 4 0 7 2 7 6s-4 7-8 12l4-1h5v3H59z'/>
					<path className={styles.numbers} fill='#60727b' d='M67 812l2-2a7 7 0 0 0 5 2c2 0 3-1 3-3s-1-3-6-3v-3c4 0 6-1 6-3s-2-3-3-3a6 6 0 0 0-4 2l-2-2a9 9 0 0 1 6-3c4 0 6 2 6 5s-1 4-3 5a5 5 0 0 1 4 5c0 4-3 6-7 6a9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M85 812h5v-14h-4v-2a13 13 0 0 0 4-2h3v18h4v3H85z'/>
					<path className={styles.numbers} fill='#60727b' d='M106 917l1-3a7 7 0 0 0 5 2c3 0 4-1 4-3s-1-3-6-3v-3c4 0 5-1 5-3s-1-3-3-3a6 6 0 0 0-4 2l-2-2a9 9 0 0 1 7-3c3 0 6 2 6 6 0 2-1 3-3 4a5 5 0 0 1 4 6c0 3-3 5-7 5a9 9 0 0 1-7-2z'/>
					<path className={styles.numbers} fill='#60727b' d='M123 909c0-7 2-11 7-11s6 4 6 11-2 10-6 10-7-3-7-10zm10 0c0-6-1-8-3-8s-4 2-4 8 2 8 4 8 3-2 3-8z'/>
					<path className={styles.numbers} fill='#60727b' d='M135 1011c6-6 9-9 9-12s-1-4-3-4a6 6 0 0 0-4 2l-2-2 6-3c4 0 7 3 7 6s-4 8-8 12h9v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M152 1011l2-2a4 4 0 0 0 3 1c3 0 5-2 5-8 0-5-2-7-4-7s-3 1-3 4 1 3 3 3c1 0 3 0 4-2v3a6 6 0 0 1-5 2c-3 0-6-2-6-6a6 6 0 0 1 7-7c4 0 7 3 7 10 0 8-4 11-8 11a7 7 0 0 1-5-2z'/>
					<path className={styles.numbers} fill='#60727b' d='M164 1080c6-5 9-9 9-12 0-2-1-4-3-4a6 6 0 0 0-4 3l-2-2 6-3c4 0 7 2 7 6s-3 7-7 11h8v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M181 1077c0-2 1-4 3-5a6 6 0 0 1-2-5c0-3 2-5 6-5s6 2 6 5a6 6 0 0 1-3 5c2 1 3 2 3 5s-2 6-6 6-7-3-7-6zm10 0c0-2-2-3-5-4a5 5 0 0 0-2 4 3 3 0 0 0 4 3c2 0 3-1 3-3zm0-10a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 2 2 3 4 4a5 5 0 0 0 2-4z'/>
					<path className={styles.numbers} fill='#60727b' d='M207 1144c5-5 9-9 9-12 0-2-1-3-4-3a6 6 0 0 0-4 2l-2-2c2-2 4-3 7-3 4 0 6 2 6 6s-3 7-7 12h8v3h-13z'/>
					<path className={styles.numbers} fill='#60727b' d='M233 1129h-10v-3h14v3c-5 5-6 10-6 18h-4c1-8 2-12 6-18z'/>
					<path className={styles.numbers} fill='#60727b' d='M260 1174c6-5 9-9 9-12 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-2 6-3c4 0 7 2 7 6s-4 7-8 12l4-1h5v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M277 1167c0-8 4-11 8-11a7 7 0 0 1 5 2l-2 2a5 5 0 0 0-3-1c-3 0-5 2-5 8 0 5 2 7 4 7s3-1 3-4-1-4-3-4l-4 3v-3a6 6 0 0 1 4-2c4 0 6 2 6 6a6 6 0 0 1-6 7c-4 0-7-3-7-10z'/>
					<path className={styles.numbers} fill='#60727b' d='M314 1189c6-6 10-9 10-12s-2-4-4-4a6 6 0 0 0-4 2l-2-2c2-2 4-3 7-3 4 0 6 3 6 6 0 4-3 8-7 12h8v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M330 1188l2-2a7 7 0 0 0 5 2 4 4 0 0 0 4-4 4 4 0 0 0-4-3 5 5 0 0 0-3 1l-2-1 1-10h10v3h-7l-1 5a6 6 0 0 1 3-1c3 0 6 2 6 6a7 7 0 0 1-7 7 9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M370 1189c6-6 9-9 9-12s-1-4-3-4a6 6 0 0 0-4 2l-2-2c2-2 3-3 6-3 4 0 7 3 7 6 0 4-4 8-8 12h9v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M395 1178v-4l-2 3-4 6h12v3h-15v-3l8-12h4v20h-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M421 1174c6-5 9-9 9-12 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-2c2-2 4-3 7-3s6 2 6 6-3 7-7 12l3-1h5v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M437 1174l2-2a7 7 0 0 0 5 2c2 0 4-1 4-3s-2-4-6-4v-2c4 0 5-2 5-4 0-1-1-2-3-2a6 6 0 0 0-4 1l-2-2a9 9 0 0 1 6-2c4 0 7 2 7 5 0 2-2 4-4 5a5 5 0 0 1 4 5c0 4-3 6-7 6a9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M520 1080c6-5 10-9 10-12 0-2-1-4-4-4a6 6 0 0 0-4 3l-2-2c2-2 4-3 7-3 4 0 6 2 6 6s-3 7-7 11h8v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M538 1079h5v-13h-4v-2a13 13 0 0 0 5-2h2v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M477 1144c5-5 9-9 9-12 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-2c1-2 3-3 6-3 4 0 7 2 7 6s-4 7-8 12h9v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M493 1144c6-5 9-9 9-12 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-2 6-3c4 0 7 2 7 6s-3 7-8 12h9v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M548 1011c6-6 9-9 9-12s-1-4-3-4a6 6 0 0 0-4 2l-2-2 6-3c4 0 7 3 7 6s-4 8-8 12h9v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M565 1003c0-7 2-11 6-11s7 4 7 11-2 10-7 10-6-3-6-10zm10 0c0-6-2-8-4-8s-3 2-3 8 1 7 3 7 4-2 4-7z'/>
					<path className={styles.numbers} fill='#60727b' d='M578 921h4v-13h-3v-3a13 13 0 0 0 4-1h3v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M593 922l2-2a5 5 0 0 0 4 1c2 0 4-2 4-8 0-5-1-7-3-7s-3 1-3 4 1 3 3 3c1 0 2 0 3-2l1 3a6 6 0 0 1-5 2c-3 0-6-2-6-6a6 6 0 0 1 6-7c4 0 8 3 8 10 0 8-4 11-8 11a7 7 0 0 1-6-2z'/>
					<path className={styles.numbers} fill='#60727b' d='M614 812h5v-14h-4v-2a13 13 0 0 0 5-2h3v18h4v3h-13z'/>
					<path className={styles.numbers} fill='#60727b' d='M630 810c0-3 2-5 3-6a6 6 0 0 1-2-5c0-3 2-5 6-5s6 2 6 6a6 6 0 0 1-3 4c2 1 4 3 4 6s-3 5-7 5-7-2-7-5zm10-1c0-2-2-3-5-4a5 5 0 0 0-2 4 3 3 0 0 0 4 4c2 0 3-2 3-4zm0-9a3 3 0 0 0-3-3 3 3 0 0 0-3 2c0 2 2 3 4 4a5 5 0 0 0 2-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M637 709h4v-13h-3v-2a13 13 0 0 0 4-2h3v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M662 695h-10v-3h14v2c-5 6-6 10-6 18h-4c1-7 2-11 6-17z'/>
					<path className={styles.numbers} fill='#60727b' d='M630 563h5v-13h-4v-2a13 13 0 0 0 5-2h2v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M646 557c0-8 3-12 8-12a7 7 0 0 1 5 3l-2 2a5 5 0 0 0-3-2c-3 0-5 3-5 9 0 5 2 7 4 7s3-2 3-4-1-4-3-4-3 1-4 3v-3a6 6 0 0 1 4-2c4 0 6 2 6 6a6 6 0 0 1-6 7c-4 0-7-4-7-10z'/>
					<path className={styles.numbers} fill='#60727b' d='M637 462h4v-14h-3v-2a13 13 0 0 0 4-2h3v18h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M652 462l1-2a7 7 0 0 0 5 2 4 4 0 0 0 4-4 4 4 0 0 0-4-4 5 5 0 0 0-3 2l-2-2 1-10h11v4h-8v4a6 6 0 0 1 2 0c4 0 7 2 7 6a7 7 0 0 1-7 7 9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M620 347h5v-14h-4v-2a13 13 0 0 0 5-2h3v18h4v3h-13z'/>
					<path className={styles.numbers} fill='#60727b' d='M644 337v-4l-2 3-3 6h11v3h-15v-3l8-13h5v21h-4z'/>
					<path className={styles.numbers} fill='#60727b' d='M590 250h4v-14h-4v-2a13 13 0 0 0 5-2h3v18h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M604 250l2-2a7 7 0 0 0 5 2c2 0 4-1 4-3s-2-4-6-4v-2c4 0 5-2 5-3 0-2-1-3-3-3a6 6 0 0 0-4 2l-2-3a9 9 0 0 1 6-2c4 0 7 2 7 5s-2 4-4 5a5 5 0 0 1 4 5c0 4-3 6-7 6a9 9 0 0 1-7-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M562 176h5v-13h-4v-2a13 13 0 0 0 5-2h2v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M577 177c6-5 10-9 10-12 0-2-2-4-4-4a6 6 0 0 0-4 3l-2-2c2-2 4-3 7-3 4 0 6 2 6 6s-3 7-7 11h8v3h-14z'/>
					<path className={styles.numbers} fill='#60727b' d='M516 118h5v-14h-4v-2a13 13 0 0 0 5-2h3v18h4v3h-13z'/>
					<path className={styles.numbers} fill='#60727b' d='M533 118h4v-14h-3v-2a13 13 0 0 0 4-2h3v18h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M455 84h4V71h-3v-2a13 13 0 0 0 4-2h3v17h4v3h-12z'/>
					<path className={styles.numbers} fill='#60727b' d='M470 77c0-7 3-10 7-10s7 3 7 10-3 11-7 11-7-4-7-11zm10 0c0-6-1-7-3-7s-3 1-3 7 1 8 3 8 3-2 3-8z'/>
					<path className={styles.numbers} fill='#60727b' d='M391 63l2-2a4 4 0 0 0 3 1c3 0 5-2 5-8 0-5-2-7-4-7s-3 1-3 4 1 3 3 3c1 0 3 0 4-2v2a6 6 0 0 1-5 3c-3 0-6-2-6-6a6 6 0 0 1 7-7c4 0 7 3 7 10 0 8-4 11-8 11a7 7 0 0 1-5-2z'/>
					<path className={styles.numbers} fill='#60727b' d='M302 59c0-2 2-4 4-5a6 6 0 0 1-3-5c0-3 2-5 6-5s6 2 6 5a6 6 0 0 1-3 5c2 1 4 3 4 5 0 3-3 6-7 6s-7-2-7-6zm10 0c0-2-2-3-5-4a5 5 0 0 0-2 4 3 3 0 0 0 4 3c2 0 3-1 3-3zm0-10a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 2 2 3 4 4a5 5 0 0 0 2-4z'/>
					<path className={styles.numbers} fill='#60727b' d='M245 70h-10v-3h14v2c-5 6-6 10-6 18h-4c1-7 2-11 6-17z'/>
					<path className={styles.numbers} fill='#60727b' d='M175 112c0-8 3-11 7-11a6 6 0 0 1 5 2l-2 3a4 4 0 0 0-3-2c-2 0-4 2-4 8 0 5 1 7 3 7s3-1 3-3-1-4-3-4l-3 2v-2a5 5 0 0 1 4-3c3 0 5 2 5 7 0 4-2 6-5 6-4 0-7-3-7-10z'/>
					<path className={styles.numbers} fill='#60727b' d='M128 182l2-3a6 6 0 0 0 4 2c2 0 3-1 3-3s-1-4-3-4a4 4 0 0 0-3 1l-1-1v-10h10v3h-7v5a5 5 0 0 1 2-1c3 0 6 2 6 6s-3 7-7 7a8 8 0 0 1-6-2z'/>
					<path className={styles.numbers} fill='#60727b' d='M106 239v-4l-2 3-3 6h10v2H97v-2l8-13h4v21h-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M67 345l1-2a6 6 0 0 0 5 2c2 0 3-1 3-3s-1-3-5-3v-3c3 0 4-1 4-3a3 3 0 0 0-2-3 5 5 0 0 0-4 2l-2-2a8 8 0 0 1 6-3c3 0 6 2 6 6a5 5 0 0 1-4 4 5 5 0 0 1 4 6c0 3-3 5-6 5a8 8 0 0 1-6-3z'/>
					<path className={styles.numbers} fill='#60727b' d='M51 458c5-5 8-9 8-12 0-2-1-4-3-4l-4 3-1-2c1-2 3-4 5-4 4 0 6 3 6 7 0 3-3 7-6 11h7v3H51z'/>
					<path className={styles.numbers} fill='#60727b' d='M58 563h4v-13h-3v-2a11 11 0 0 0 4-2h2v17h4v3H58z'/>
        </svg>
      </div>
    )
  }
}
