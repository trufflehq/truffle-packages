
export const PrimaryButtonStyles = `
.primary-button {
  display: flex;
  justify-content: center;
  height: 40px;
  font-weight: var(--tfl-font-weight-body-semibold);
  --tfl-color-surface-fill: var(--tfl-color-primary-fill);
  
  &:hover {
    --tfl-color-surface-fill-hovered: var(--tfl-color-primary-fill-hovered);
  }
  
  &:active {
    --tfl-color-surface-fill-pressed: var(--tfl-color-primary-fill-hovered);
  }
  
  &:disabled,
  &:disabled:hover,
  &:disabled:active {
    color: var(--tfl-color-surface-fill-disabled);
    background-color: var(--tfl-color-surface-fill-disabled);
    cursor: var(--tfl-cursor-disabled);
  }
}
`

export const SecondaryButtonStyles = `
.secondary-button {
  color: var(--tfl-color-on-surface-fill);
  background-color: var(--tfl-color-surface-fill);
  height: 40px;
}
`

export const ButtonStyles = `
  ${PrimaryButtonStyles}
  ${SecondaryButtonStyles}
`

const GlobalStyles = `
  ${ButtonStyles}
`

export default GlobalStyles