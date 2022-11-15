import { Collectible } from "./collectible.ts";
import { User } from "./user.ts";

export interface Action {
  user: User;
  collectible: Collectible;
  time: Date;
}
