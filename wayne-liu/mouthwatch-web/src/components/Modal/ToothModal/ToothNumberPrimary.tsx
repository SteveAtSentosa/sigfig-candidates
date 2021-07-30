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
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 635 899'>
          <path fill='#60727c' className={styles.letters} d='M453 160c-10 5-21 12-33 14a67 67 0 0 1-10 1c-9 1-14-3-15-13-3-19-1-37 1-56l4-35c-4 1-5 4-6 7a333 333 0 0 1-26 36c-13 15-28 15-39-1-4-5-6-12-9-18-2-2-1-5-3-7 0-1-1 0 0 0l1 1-1 4c-2 7-4 14-8 21-11 16-29 18-42 2l-31-41c-4 0-2 2-2 4 5 24 7 49 9 73a69 69 0 0 1 0 10c-1 13-9 19-22 16a126 126 0 0 1-36-12c-1-1-3-3-5-2 5 8 10 17 13 26 3 16 1 29-12 41a83 83 0 0 1-53 21c0 3 3 4 4 6 13 12 21 27 24 44 3 21-5 36-24 44a139 139 0 0 1-43 11l-9 1c1 3 3 3 5 4a177 177 0 0 1 25 16c27 22 30 54 6 81a32 32 0 0 1-35 11c-6-2-12-3-17-6a99 99 0 0 0-39-12c-11-1-19-8-22-19-5-21-4-40 6-59 8-15 21-22 37-24 0-2-1-2-2-3a84 84 0 0 1-19-76c7-31 29-43 60-36 4 1 7 3 12 2-16-21-16-45-12-69 4-28 25-42 53-36l5 1c2 1 4 2 3-2l-4-7c-8-11-8-22-1-34 11-18 26-32 44-42 12-7 19-6 37 2-2-16 9-25 20-33s23-15 38-15c16 0 26 7 31 22 3 8 3 16 5 23v2c1 1 1 0 1-1 2-2 0-5 2-8 2-10 5-19 10-27 6-10 14-14 26-13 22 2 39 12 51 30l2 3c1 12 9 12 18 12 16-1 28 7 41 15a85 85 0 0 1 19 18c14 18 14 34 1 52-2 1-2 3-3 5a6 6 0 0 1-1 0h1c1-2 3-1 4-2 28-11 50-1 59 28 8 23 7 47-4 70a25 25 0 0 0-1 4c9-1 17-3 26-2 18 2 31 12 36 30a105 105 0 0 1 4 35c0 17-6 31-18 43-3 3-6 4-7 8 3 2 6 1 9 1 16 1 29 9 36 24 7 17 9 35 2 52-5 13-14 22-28 24a53 53 0 0 0-23 9c-24 16-51 11-67-13a42 42 0 0 1-2-49 108 108 0 0 1 31-34l5-4a135 135 0 0 1-33-8l-5-3c-33-12-37-35-26-67 4-11 13-19 21-26 2-2 5-3 6-6l-23-1c-36-5-51-47-38-73l7-13a11 11 0 0 1 2-4 9 9 0 0 1-4 2z'/>
          <path fill='#60727c' className={styles.letters} d='M443 781l-4-13c-4-24 12-44 36-46 12-1 22 3 35 7l-12-15c-6-8-10-16-11-26-1-13 4-24 16-30 10-5 21-7 32-8h16c-3-4-7-4-10-5a97 97 0 0 1-40-31c-15-19-13-39 3-57 27-31 68-37 102-21 22 11 31 29 25 52-3 13-6 25-7 38 0 9-5 16-13 21l-14 8c0 2 2 2 3 3 15 8 20 19 17 35-5 22-16 40-36 53-8 6-16 9-26 8 0 4 3 5 4 7 10 12 10 27 0 38-15 16-32 30-53 40-6 3-13 6-20 4-4 0-4 2-4 4 1 11-4 18-13 23a117 117 0 0 1-45 15h-3c-15-5-26 0-40 6s-31 6-47 2c-7-1-12-5-14-12-10 16-20 20-39 16a93 93 0 0 1-35-15c-4-3-7-4-10 0a15 15 0 0 1-11 6c-23 0-44-4-62-20-6-5-10-12-10-20 0-4-2-4-5-4a25 25 0 0 1-17-3c-18-11-37-23-51-39-13-15-14-26-5-43-24-6-39-24-51-45-11-21-8-35 9-51l7-5c-2-2-3-3-5-3-14-4-22-13-25-27s-7-29-9-44c-2-17 4-32 19-40 37-18 65-19 101 5 22 15 34 48 7 74-7 7-14 13-22 18l-6 4c3 3 7 3 11 4 30 6 42 33 27 61l-13 17a8 8 0 0 1-1 2v1c1-1 3 0 4-2l11-4c25-8 44 2 52 27 3 9 3 19 2 28v8l23-13c14-7 28 0 31 15 2 10 2 20 3 31 8-8 14-16 22-22 17-14 33-10 41 11 2 6 4 11 4 17 0 2-1 5 3 4 2-2 0-6 1-9l6-17c7-13 19-17 32-11a58 58 0 0 1 20 16c2 2 3 4 7 6v-20a52 52 0 0 1 6-15c6-11 15-14 26-11 7 2 12 6 18 10l5 5 3 1-1-4z'/>
          <path data-tooth='B' onClick={this.handleClick} fill={this.isToothSelected('B')} className={styles.tooth} d='M78 349c-5 0-11 0-17-2-7-2-13-5-17-12-13-21-19-44-10-68 4-14 12-25 28-25 33-2 60 8 78 38 6 9 10 20 9 32 0 11-5 19-15 24a120 120 0 0 1-56 13z'/>
          <path data-tooth='I' onClick={this.handleClick} fill={this.isToothSelected('I')} className={styles.tooth} d='M484 304a53 53 0 0 1 6-22c11-21 44-47 80-41 13 2 22 9 26 22a180 180 0 0 1 6 27c3 26-19 57-45 61-6 1-13 0-19-1a137 137 0 0 1-35-12c-14-7-19-16-19-34z'/>
          <path data-tooth='A' onClick={this.handleClick} fill={this.isToothSelected('A')} className={styles.tooth} d='M8 411a85 85 0 0 1 3-25c7-20 31-37 55-25 16 8 32 16 45 28 12 10 16 22 13 37l-2 5c-8 31-27 40-55 26-13-6-26-12-40-12-9-1-15-7-17-16a65 65 0 0 1-2-18z'/>
          <path data-tooth='J' onClick={this.handleClick} fill={this.isToothSelected('J')} className={styles.tooth} d='M584 356c23 0 36 11 41 34 3 15 4 29-7 42-4 6-10 10-18 10a46 46 0 0 0-26 11c-17 15-37 8-52-5a38 38 0 0 1-6-48c14-22 31-38 57-43l11-1z'/>
          <path data-tooth='C' onClick={this.handleClick} fill={this.isToothSelected('C')} className={styles.tooth} d='M91 187v-13c1-30 24-45 52-32 24 11 40 31 44 58 2 9-2 17-8 23a71 71 0 0 1-45 21c-19 1-36-11-41-29-3-9-3-19-2-28z'/>
          <path data-tooth='H' onClick={this.handleClick} fill={this.isToothSelected('H')} className={styles.tooth} d='M500 241c-10 0-20 0-29-6a46 46 0 0 1-16-59 77 77 0 0 1 30-33c26-15 50-5 57 24 4 15 5 30 1 44-5 21-14 29-35 30h-8z'/>
          <path data-tooth='D' onClick={this.handleClick} fill={this.isToothSelected('D')} className={styles.tooth} d='M236 155a63 63 0 0 1 0 7c-1 7-6 11-13 9-35-6-60-26-78-56-3-6-3-12 0-17a110 110 0 0 1 43-44c15-9 32-1 36 15 7 22 8 46 10 69l2 17z'/>
          <path data-tooth='G' onClick={this.handleClick} fill={this.isToothSelected('G')} className={styles.tooth} d='M401 139c0-25 2-50 8-75 2-9 7-14 17-12 26 4 47 16 60 40 5 9 6 20-1 29-18 23-40 40-69 46-12 2-15 0-15-12v-16z'/>
          <path data-tooth='E' onClick={this.handleClick} fill={this.isToothSelected('E')} className={styles.tooth} d='M311 74c-1 10-1 21-6 31-8 18-23 19-34 5l-37-51c-7-10-6-19 2-27 11-12 25-20 41-22 14-2 23 4 27 17 4 15 6 31 7 47z'/>
          <path data-tooth='F' onClick={this.handleClick} fill={this.isToothSelected('F')} className={styles.tooth} d='M323 64c2-17 4-32 11-46 4-8 10-12 18-11 22 1 38 12 50 30a13 13 0 0 1 0 14c-13 20-26 41-41 60-8 10-18 9-26-1-6-9-9-19-10-29l-2-17z'/>
          <path data-tooth='T' onClick={this.handleClick} fill={this.isToothSelected('T')} className={styles.tooth} d='M52 649c-23 0-31-6-36-28-3-12-6-24-7-37-2-17 2-26 16-34 29-17 66-15 92 5 23 18 25 42 5 64a94 94 0 0 1-70 30z'/>
          <path data-tooth='K' onClick={this.handleClick} fill={this.isToothSelected('K')} className={styles.tooth} d='M566 535c17 0 31 3 44 12s17 20 14 35l-8 40c-3 20-21 30-43 26-10-1-18-6-27-10-11-6-22-12-31-21-9-8-14-18-15-30a29 29 0 0 1 7-23c18-20 35-28 59-29z'/>
          <path data-tooth='R' onClick={this.handleClick} fill={this.isToothSelected('R')} className={styles.tooth} d='M144 837a29 29 0 0 1-14-5c-15-9-30-19-42-32l-1-1c-16-17-15-30 4-43 17-12 36-20 56-26 12-4 23 0 31 11 13 19 11 45-2 64-6 9-13 17-18 26-3 5-8 6-14 6z'/>
          <path data-tooth='M' onClick={this.handleClick} fill={this.isToothSelected('M')} className={styles.tooth} d='M481 730l12 1c21 7 40 16 57 31 11 10 13 20 3 32a137 137 0 0 1-58 42c-6 2-12 1-15-4-13-21-26-42-34-65-6-19 11-35 27-37h8z'/>
          <path data-tooth='S' onClick={this.handleClick} fill={this.isToothSelected('S')} className={styles.tooth} d='M90 653c10 0 17 1 24 4 20 7 29 25 19 45-10 21-27 37-48 47-7 3-13 2-19-1a88 88 0 0 1-40-48c-3-8-2-16 3-23a54 54 0 0 1 30-20c11-3 22-3 31-4z'/>
          <path data-tooth='L' onClick={this.handleClick} fill={this.isToothSelected('L')} className={styles.tooth} d='M546 656c15 2 28 2 41 5 18 3 26 16 22 33a79 79 0 0 1-31 46c-11 8-22 9-33 4-21-9-37-24-48-45-9-19-1-34 19-38l30-5z'/>
          <path data-tooth='Q' onClick={this.handleClick} fill={this.isToothSelected('Q')} className={styles.tooth} d='M241 812a73 73 0 0 1-3 33c-2 6-2 13-2 20 0 10-6 16-16 16-18 0-36-5-51-17-9-7-12-16-6-26 12-23 28-42 50-55 15-9 26-4 28 13v16z'/>
          <path data-tooth='N' onClick={this.handleClick} fill={this.isToothSelected('N')} className={styles.tooth} d='M420 878l-8-1c-6-1-8-3-6-10 3-11-2-21-7-31-6-14-9-29-4-45 4-16 14-20 28-11 10 6 18 14 25 22a208 208 0 0 1 24 38c6 11 4 18-7 23-14 8-28 14-45 15z'/>
          <path data-tooth='0' onClick={this.handleClick} fill={this.isToothSelected('0')} className={styles.tooth} d='M355 889c-28 0-31-6-30-29a317 317 0 0 1 5-44c4-20 19-25 34-12 15 12 26 28 33 46 6 16 0 29-17 34a141 141 0 0 1-16 5 79 79 0 0 1-9 0z'/>
          <path data-tooth='P' onClick={this.handleClick} fill={this.isToothSelected('P')} className={styles.tooth} d='M314 861v3c-1 25-10 32-34 26-11-2-20-7-29-13a15 15 0 0 1-8-11c-1-13 1-26 9-36a219 219 0 0 1 25-27c12-11 24-8 29 8 5 17 7 34 8 50z'/>
          <path fill='#60727c' className={styles.letters} d='M59 390h7l9 30h-5l-5-16-3-10-2 10-5 16h-5zm-4 18h14v4H55z'/>
          <path fill='#60727c' className={styles.letters} d='M76 284h10c6 0 10 1 10 7a7 7 0 0 1-4 6v1a7 7 0 0 1 6 7c0 6-5 9-12 9H76zm9 12c4 0 6-2 6-4 0-3-2-4-6-4h-4v8zm1 13c4 0 7-1 7-5 0-3-3-4-7-4h-5v9z'/>
          <path fill='#60727c' className={styles.letters} d='M126 191c0-9 6-15 14-15a12 12 0 0 1 8 3l-3 4a8 8 0 0 0-5-3c-5 0-9 4-9 11s3 11 9 11a8 8 0 0 0 6-3l3 3a12 12 0 0 1-10 5c-7 0-13-6-13-16z'/>
          <path fill='#60727c' className={styles.letters} d='M183 97h8c9 0 15 5 15 15s-6 15-15 15h-8zm8 26c6 0 9-4 9-11s-3-11-9-11h-3v22z'/>
          <path fill='#60727c' className={styles.letters} d='M267 49h18v5h-13v7h11v5h-11v9h13v4h-18z'/>
          <path fill='#60727c' className={styles.letters} d='M348 47h18v5h-13v8h11v5h-11v12h-5z'/>
          <path fill='#60727c' className={styles.letters} d='M427 107c0-9 7-15 15-15a12 12 0 0 1 9 4l-3 3a8 8 0 0 0-6-3c-5 0-9 5-9 11s3 11 9 11a7 7 0 0 0 4-1v-7h-5v-4h10v13a14 14 0 0 1-9 4c-8 0-15-6-15-16z'/>
          <path fill='#60727c' className={styles.letters} d='M486 176h5v12h12v-12h5v30h-5v-13h-12v13h-5z'/>
          <path fill='#60727c' className={styles.letters} d='M535 284h5v30h-5z'/>
          <path fill='#60727c' className={styles.letters} d='M560 416l4-3c1 2 3 3 5 3 3 0 4-1 4-6v-20h5v21c0 5-2 10-9 10a9 9 0 0 1-9-5z'/>
          <path fill='#60727c' className={styles.letters} d='M65 584h-8v-4h22v4h-8v26h-6z'/>
          <path fill='#60727c' className={styles.letters} d='M69 708l3-4a12 12 0 0 0 8 4c3 0 5-2 5-4s-2-3-4-5l-5-1c-2-2-6-4-6-8 0-5 5-9 11-9a13 13 0 0 1 9 4l-3 3a10 10 0 0 0-7-2c-2 0-4 1-4 3 0 3 2 4 5 5l4 1c3 2 6 4 6 8 0 5-4 9-11 9a15 15 0 0 1-11-4z'/>
          <path fill='#60727c' className={styles.letters} d='M124 765h10c7 0 11 2 11 8 0 7-4 10-11 10h-4v12h-6zm10 14c4 0 6-2 6-6s-2-4-6-4h-4v10zm-1 2l4-3 10 17h-6z'/>
          <path fill='#60727c' className={styles.letters} d='M193 834c0-10 5-16 13-16s13 6 13 16-5 15-13 15-13-6-13-15zm21 0c0-7-3-11-8-11s-8 4-8 11 3 11 8 11 8-4 8-11zm-11 15l6-1c1 3 4 4 7 4a11 11 0 0 0 3 0l1 4a12 12 0 0 1-5 1 13 13 0 0 1-12-8z'/>
          <path fill='#60727c' className={styles.letters} d='M270 835h9c7 0 12 3 12 10 0 6-5 9-12 9h-4v11h-5zm9 15c4 0 6-2 6-5s-2-5-6-5h-4v10z'/>
          <path fill='#60727c' className={styles.letters} d='M346 851c0-9 6-15 13-15s14 6 14 15-6 16-14 16-13-6-13-16zm21 0c0-6-3-11-8-11s-7 5-7 11 3 11 7 11 8-4 8-11z'/>
          <path fill='#60727c' className={styles.letters} d='M420 813h6l9 17 3 6v-23h5v30h-6l-9-17-3-6v23h-5z'/>
          <path fill='#60727c' className={styles.letters} d='M485 767h6l5 14 2 6 2-6 5-14h6v30h-5v-14l1-10-2 7-5 14h-4l-5-14-2-7 1 10v14h-5z'/>
          <path fill='#60727c' className={styles.letters} d='M547 683h5v26h13v4h-18z'/>
          <path fill='#60727c' className={styles.letters} d='M556 572h5v14l11-14h6l-9 12 10 18h-5l-9-14-4 5v9h-5z'/>
        </svg>
      </div>
    )
  }
}
