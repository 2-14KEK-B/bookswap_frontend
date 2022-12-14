import { useUserStore } from "@stores/user";
import type { BookRate } from "@interfaces/bookRate";
import type { User } from "@interfaces/user";

function getOverallRate(rates?: (string | BookRate)[]) {
	if (rates && rates.length > 0) {
		if (isImplementsBookRate(rates)) {
			let all = 0;
			let count = 0;
			rates.forEach((rate) => {
				all += rate.rate;
				count++;
			});
			return all / count;
		}
		return 0;
	}
	return 0;
}

function isLoggedInUserAlreadyRated(rates?: (string | BookRate)[]) {
	const userStore = useUserStore();
	if (userStore.loggedInUser && rates) {
		if (isImplementsBookRate(rates)) {
			const loggedInId = userStore.loggedInUser._id;
			return rates.some((rate) => (rate.from as User)._id == loggedInId);
		}
		return false;
	}
	return false;
}

function isRateFromLoggedIn(rate?: BookRate) {
	if (rate) {
		const userStore = useUserStore();
		if (userStore.loggedInUser) {
			const loggedInId = userStore.loggedInUser._id;

			return (rate.from as User)._id == loggedInId;
		}
	}
	return false;
}

function isImplementsBookRate(rates?: any[]): rates is BookRate[] {
	if (rates && rates.length > 0) {
		return "from" in rates[0];
	}
	return false;
}

export { getOverallRate, isLoggedInUserAlreadyRated, isRateFromLoggedIn };
