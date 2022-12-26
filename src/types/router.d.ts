export {};

import { Book } from "@interfaces/book";
import { User } from "@interfaces/user";
import "vue-router";

declare module "vue-router" {
	interface RouteMeta {
		user?: User;
		book?: Book;
	}
}
