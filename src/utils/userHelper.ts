import type { User } from "@interfaces/user";
import type { UserRate } from "@interfaces/userRate";
import type { Notification } from "@interfaces/notification";

function getDisplayName(user?: User | Partial<User>): string {
	if (user && user.email) {
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
	let rateSum = 0;
	if (rates) {
		rates.to.forEach((rate) => {
			if (instanceOfRate(rate)) {
				rateSum += (rate as UserRate).rate ? 1 : -1;
			}
		});
	}
	return rateSum;
}

function getNotSeenNotificationsCount(notifications?: Notification[]) {
	let notificationSum = 0;
	if (notifications) {
		notifications.forEach((n) => {
			if (n.seen == false) {
				notificationSum++;
			}
		});
	}
	return notificationSum;
}

function instanceOfRate(data: any): data is UserRate {
	return "rate" in data;
}

export { getDisplayName, getAvatar, getLocalDate, getRateSum, getNotSeenNotificationsCount };
