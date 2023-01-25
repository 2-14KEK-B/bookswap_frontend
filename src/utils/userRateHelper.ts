import { useBorrowStore } from "@stores/borrow";
import { useUserRateStore } from "@stores/userRate";
import type { Borrow } from "@interfaces/borrow";
import type { UserRate } from "@interfaces/userRate";

function addToBorrowAndUserRates(rate: UserRate) {
	const userRateStore = useUserRateStore();
	const borrowStore = useBorrowStore();
	const borrowId = (rate.borrow as Borrow)._id;

	userRateStore.loggedInRates.to.push(rate);
	borrowStore.loggedInBorrows.some((b) => {
		if (b._id == borrowId) {
			b.user_rates?.push(rate);
			return true;
		}
		return false;
	});
}

function updateInBorrowAndUserRates(rate: UserRate) {
	const userRateStore = useUserRateStore();
	const borrowStore = useBorrowStore();
	const borrowId = (rate.borrow as Borrow)._id;

	userRateStore.loggedInRates.to.some((r) => {
		if (r._id == rate._id) {
			r = rate;
			return true;
		}
		return false;
	});
	borrowStore.loggedInBorrows.some((b) => {
		if (b._id == borrowId) {
			(b.user_rates as UserRate[])?.some((r) => {
				if (r._id == rate._id) {
					r = rate;
					return true;
				}
				return false;
			});
		}
	});
}

function deleteFromBorrowAndUserRates(id: string) {
	const userRateStore = useUserRateStore();
	const borrowStore = useBorrowStore();

	let borrowId: string;

	userRateStore.loggedInRates.to.some((r) => {
		if (r._id == id) {
			borrowId = (r.borrow as Borrow)._id;
			return true;
		}
		return false;
	});
	userRateStore.loggedInRates.to = userRateStore.loggedInRates.to.filter((r) => r._id != id);
	borrowStore.loggedInBorrows.some((b) => {
		if (b._id == borrowId) {
			b.user_rates = (b.user_rates as UserRate[])?.filter((r) => r._id != id);
		}
		return false;
	});
}

export { addToBorrowAndUserRates, updateInBorrowAndUserRates, deleteFromBorrowAndUserRates };
