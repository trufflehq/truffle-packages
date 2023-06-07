import { scss } from "../../../deps.ts";

export default scss`

@mixin font-body-bold {
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
  color: var(--bg-base-text);
}

@mixin font-body-caption {
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  color: var(--bg-base-text-60);
}

.c-economy-action-dialog {
  padding: 24px 16px;

  >.economy-action {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-bottom: 20px;
  
    > .name {
      @include font-body-bold;
    }
  
    > .reward {
      display: flex;
      align-items: center;
      margin-top: 2px;
  
      > .icon {
        margin-right: 4px; 
      }
  
      > .amount {
        @include font-body-bold;
      }
    } 
  
    > .description {
      margin-top: 4px;
      @include font-body-caption;
    }
  }
}
`;
