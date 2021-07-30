import { Font, StyleSheet } from '@react-pdf/renderer'

// Downloaded from https://gist.github.com/sadikay/d5457c52e7fb2347077f5b0fe5ba9300
// e.g. Source Sans https://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlNzbP97U9sKh0jjxbPbfOKg.ttf
Font.register({
  src: '/static/fonts/regular.ttf',
  family: 'SourceSans'
})

export const styles = StyleSheet.create({
  invoice: {
    fontSize: '16pt',
    color: 'black',
    padding: '15pt 25pt 30pt',
    fontFamily: 'SourceSans'
  },
  fixed_header: {
    height: '25pt'
  },
  section: {
    padding: '25pt 0 0'
  },
  section_title: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    height: 'auto',
    width: '100pt',
    marginBottom: '12pt'
  },
  section_details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '24pt'
  },
  invoice_details: {
    border: '1pt solid #fff'
  },
  text: {
    fontSize: '12pt',
    marginBottom: '4pt'
  },
  title: {
    color: '#265C7F',
    fontSize: '14pt',
    marginTop: '8pt',
    marginBottom: '8pt'
  },
  line_items_header: {
    backgroundColor: '#EAF4FF',
    flexDirection: 'row',
    fontSize: '12pt',
    paddingVertical: '10pt'
  },
  date: {
    width: '25%',
    paddingHorizontal: '5pt'
  },
  description: {
    width: '50%',
    paddingHorizontal: '5pt'
  },
  usage: {
    width: '25%',
    paddingHorizontal: '5pt'
  },
  line_item: {
    flexDirection: 'row',
    fontSize: '12pt',
    paddingTop: '10pt'
  },
  total: {
    borderTop: '1pt solid #f3f3f3',
    marginTop: '12pt',
    paddingTop: '12pt'
  }
})
