import { useUserStore } from "@stores/user";
import type { Borrow } from "@interfaces/borrow";
import type { User } from "@interfaces/user";

function getSeparatedBorrows(borrows: Borrow[], type: "borrow" | "lend") {
	const borrowArray: Borrow[] = [];
	const userStore = useUserStore();
	const loggedInId = userStore.loggedInUser?._id;
	if (type == "borrow") {
		borrows.forEach((b) => {
			if ((b.to as User)._id == loggedInId) {
				borrowArray.push(b);
			}
		});
	} else {
		borrows.forEach((b) => {
			if ((b.from as User)._id == loggedInId) {
				borrowArray.push(b);
			}
		});
	}
	return borrowArray;
}

export { getSeparatedBorrows };
