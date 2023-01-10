import type { User } from "@interfaces/user";
import type { UserRate } from "@interfaces/userRate";

function getDisplayName(user?: User): string {
	if (user) {
		return user.fullname || user.username || user.email;
	}
	return "user";
}

function getAvatar(picture?: string) {
	if (picture) return picture;
	return "https://pic.onlinewebfonts.com/svg/img_329115.png";
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
				rateSum += (rate as UserRate).rate ? 1 : -1;
			}
		});
		return rateSum;
	}
}

function instanceOfRate(data: any): data is UserRate {
	return "rate" in data;
}

export { getDisplayName, getAvatar, getLocalDate, getRateSum };
