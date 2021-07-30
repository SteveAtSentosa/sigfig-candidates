import * as React from 'react'
const styles = require('./surface.scss')

interface Props {
  selected: string[]
  handleSurfaceClick: (surface: string) => void
  onTopLevelSelectors: (surfaces: { surfaceRight: string, surfaceLeft: string }) => void
}

interface State {
  surfaceRight: string
  surfaceLeft: string
}

export default class Surface extends React.Component<Props, State> {
  state = {
    surfaceRight: '',
    surfaceLeft: ''
  }

  isSelected = (surface: string) => {
    return this.props.selected.filter(s => s === surface).length
  }

  handleSurfaceRight = (letter: string) => () => {
    // Only allow one side to be created at at time.
    const { surfaceRight, surfaceLeft } = this.state
    if (surfaceRight.includes(letter)) {
      // If the string already includes this letter deselect and remove.
      this.setState({ surfaceRight: surfaceRight.split(letter).join() })
      return
    }
    const surfaces = { surfaceLeft: surfaceLeft.length ? '' : surfaceLeft, surfaceRight: surfaceRight + letter }
    this.setState({ ...surfaces }, () => this.props.onTopLevelSelectors(surfaces))
  }

  handleSurfaceLeft = (letter: string) => () => {
    // Only allow one side to be created at at time.
    const { surfaceRight, surfaceLeft } = this.state
    if (surfaceLeft.includes(letter)) {
      // If the string already includes this letter deselect and remove.
      this.setState({ surfaceLeft: surfaceLeft.split(letter).join() })
      return
    }
    const surfaces = { surfaceRight: surfaceRight.length ? '' : surfaceRight, surfaceLeft: surfaceLeft + letter }
    this.setState({ ...surfaces }, () => this.props.onTopLevelSelectors(surfaces))
  }

  render () {
    const { surfaceRight, surfaceLeft } = this.state
    return (
      <div className={styles.tooth_chart}>
        <div className={styles.topRow}>
          <div className={styles.flexCol}>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceLeft('B')} className={surfaceLeft.includes('B') ? styles.selected : ''}>B</button>
            </div>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceLeft('M')} className={surfaceLeft.includes('M') ? styles.selected : ''}>M</button>
              <button onClick={this.handleSurfaceLeft('O')} className={surfaceLeft.includes('O') ? styles.selected : ''}>O</button>
              <button onClick={this.handleSurfaceLeft('D')} className={surfaceLeft.includes('D') ? styles.selected : ''}>D</button>
            </div>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceLeft('L')} className={surfaceLeft.includes('L') ? styles.selected : ''}>L</button>
            </div>
          </div>
          <div className={styles.flexCol}>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceRight('F')} className={surfaceRight.includes('F') ? styles.selected : ''}>F</button>
            </div>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceRight('M')} className={surfaceRight.includes('M') ? styles.selected : ''}>M</button>
              <button onClick={this.handleSurfaceRight('I')} className={surfaceRight.includes('I') ? styles.selected : ''}>I</button>
              <button onClick={this.handleSurfaceRight('D')} className={surfaceRight.includes('D') ? styles.selected : ''}>D</button>
            </div>
            <div className={styles.flexRow}>
              <button onClick={this.handleSurfaceRight('L')} className={surfaceRight.includes('L') ? styles.selected : ''}>L</button>
            </div>
          </div>
        </div>
        <div className={styles.button_combos}>
          <div className={styles.flexCol}>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MO') ? styles.selected : ''}>MO</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('ML') ? styles.selected : ''}>ML</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MB') ? styles.selected : ''}>MB</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MOL') ? styles.selected : ''}>MOL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MOB') ? styles.selected : ''}>MOB</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MOD') ? styles.selected : ''}>MOD</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MODL') ? styles.selected : ''}>MODL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MODB') ? styles.selected : ''}>MODB</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MODBL') ? styles.selected : ''}>MODBL</button>
          </div>
          <div className={styles.flexCol}>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DO') ? styles.selected : ''}>DO</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DL') ? styles.selected : ''}>DL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DB') ? styles.selected : ''}>DB</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DOL') ? styles.selected : ''}>DOL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DOB') ? styles.selected : ''}>DOB</button>
            <div></div>
            <div></div>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('OL') ? styles.selected : ''}>OL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('OB') ? styles.selected : ''}>OB</button>
          </div>
          <div className={styles.flexCol}>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MI') ? styles.selected : ''}>MI</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('ML') ? styles.selected : ''}>ML</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MF') ? styles.selected : ''}>MF</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MIL') ? styles.selected : ''}>MIL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MIF') ? styles.selected : ''}>MIF</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MID') ? styles.selected : ''}>MID</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MIDL') ? styles.selected : ''}>MIDL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MIDF') ? styles.selected : ''}>MIDF</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('MIDFL') ? styles.selected : ''}>MIDFL</button>
          </div>
          <div className={styles.flexCol}>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DI') ? styles.selected : ''}>DI</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DL') ? styles.selected : ''}>DL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DF') ? styles.selected : ''}>DF</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DIL') ? styles.selected : ''}>DIL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('DIF') ? styles.selected : ''}>DIF</button>
            <div></div>
            <div></div>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('IL') ? styles.selected : ''}>IL</button>
            <button onClick={(e) => this.props.handleSurfaceClick((e.target as any).innerText)} className={this.isSelected('IF') ? styles.selected : ''}>IF</button>
          </div>
        </div>
      </div>
    )
  }
}
