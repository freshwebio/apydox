import styled from 'styled-components'

const StyledTooltip = styled.div`
  visibility: hidden;
  width: 120px;
  background-color: #ddd;
  color: #111;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 4000;
  top: 100%;
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */

  &::after {
    content: ' ';
    position: absolute;
    bottom: 100%; /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #ddd transparent;
  }
`

export { StyledTooltip }
