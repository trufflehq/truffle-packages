import { scss } from "../../deps.ts";

export default scss`
.c-collectible {
  --positive-feedback: rgba(96, 204, 140, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 50%;

  &.is-owned {
    opacity: 100%;
  }

  >.info {
    margin-bottom: 10px;

    >.name {
      font-size: 10px;
      margin-top: 10px;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      overflow: hidden;
    }

    >.count {
      font-size: 10px;
      color: var(--mm-color-primary);
    }
  }

}
`;
