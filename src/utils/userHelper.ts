import type { User } from "@interfaces/user";
import type { UserRate } from "@interfaces/UserRate";

function getDisplayName(user?: User): string {
	if (user) {
		return user.fullname || user.username || user.email;
	}
	return "";
}

function getLocalDate(date?: string) {
	if (date) {
		const dateAsDate = new Date(date);
		return dateAsDate.toLocaleString();
	}
}

function getRateSum(rates?: User["user_rates"]) {
	if (rates) {
		let rateSum = 0;
		rates.to.forEach((rate) => {
			if (instanceOfRate(rate)) {
				rateSum += rate.rate ? 1 : -1;
			}
		});
		return rateSum;
	}
}

function instanceOfRate(data: any): data is UserRate {
	return "rate" in data;
}

export { getDisplayName, getLocalDate, getRateSum };
