// separate file so imports with different semvers still import same jumper instance
// so long as the imports use ~ or ^
export { default } from "https://tfl.dev/@truffle/shared-contexts@1.0.0/contexts/jumper/jumper-instance.ts";
