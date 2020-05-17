import styled, { ThemedStyledProps } from 'styled-components'
import { ApydoxTheme } from 'styles/themes/apydoxv1'

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 50px;
`

const Heading = styled('h3')<{ theme: any }>`
  position: relative;
  font-size: 1.5rem;
  font-weight: 300;
  background-color: #414141;
  color: #c5c5c5;
  padding: 10px;
  margin-bottom: 32px;
`

const ApiDefGroupWrapper = styled.div`
  :first-child {
    margin-top: 0;

    ${Heading} {
      margin-top: 0;
    }
  }
`

const GroupActionsWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-left: 10px;
  font-size: 1rem;
  color: white;
  z-index: 300;
`

type GroupTextProps = ThemedStyledProps<{ editGroupMode: boolean }, ApydoxTheme>

const GroupText = styled.div<GroupTextProps>`
  display: inline-block;
  vertical-align: middle;
  outline: none;
  border-bottom: ${({ editGroupMode }) =>
    editGroupMode ? '1px solid #c5c5c5' : '1px solid transparent'};
  transition: border 500ms ease-in-out;
`

const AddServiceWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: white;
  right: 30px;
  z-index: 300;
`

const TextWrapper = styled.div`
  font-size: 1rem;
  max-width: 900px;
  padding-bottom: 10px;
  margin: 0 auto;
`

export {
  CardsWrapper,
  ApiDefGroupWrapper,
  Heading,
  AddServiceWrapper,
  TextWrapper,
  GroupActionsWrapper,
  GroupText,
}
