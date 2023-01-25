import { useUserStore } from "@stores/user";
import type { BookRate } from "@interfaces/bookRate";
import type { User } from "@interfaces/user";
import type { Borrow } from "@interfaces/borrow";
import type { Book } from "@interfaces/book";
import { useI18n } from "vue-i18n";

const genres = () => {
	const { t } = useI18n({ useScope: "global" });
	return [
		{ value: "fantasy", label: t("book.genres.fantasy") },
		{ value: "scifi", label: t("book.genres.scifi") },
		{ value: "dystopian", label: t("book.genres.dystopian") },
		{ value: "adventure", label: t("book.genres.adventure") },
		{ value: "romance", label: t("book.genres.romance") },
		{ value: "detectiveAndMystery", label: t("book.genres.detectiveAndMystery") },
		{ value: "horror", label: t("book.genres.horror") },
		{ value: "thriller", label: t("book.genres.thriller") },
		{ value: "lgbtq", label: t("book.genres.lgbtq") },
		{ value: "historyFiction", label: t("book.genres.historyFiction") },
		{ value: "youngAdult", label: t("book.genres.youngAdult") },
		{ value: "childrenFiction", label: t("book.genres.childrenFiction") },
		{ value: "memoirAndAutobiography", label: t("book.genres.memoirAndAutobiography") },
		{ value: "biography", label: t("book.genres.biography") },
		{ value: "cooking", label: t("book.genres.cooking") },
		{ value: "artAndPhotography", label: t("book.genres.artAndPhotography") },
		{ value: "selfHelpPersonalDevelopment", label: t("book.genres.selfHelpPersonalDevelopment") },
		{ value: "motivationalInspirational", label: t("book.genres.motivationalInspirational") },
		{ value: "healthAndFitness", label: t("book.genres.healthAndFitness") },
		{ value: "history", label: t("book.genres.history") },
		{ value: "craftsHobbiesHome", label: t("book.genres.craftsHobbiesHome") },
		{ value: "familiesAndRelationships", label: t("book.genres.familiesAndRelationships") },
		{ value: "humorAndEntertainment", label: t("book.genres.humorAndEntertainment") },
		{ value: "businessAndMoney", label: t("book.genres.businessAndMoney") },
		{ value: "lawAndCriminology", label: t("book.genres.lawAndCriminology") },
		{ value: "politicsAndSocialSciences", label: t("book.genres.politicsAndSocialSciences") },
		{ value: "religionAndSpirituality", label: t("book.genres.religionAndSpirituality") },
		{ value: "educationAndTeaching", label: t("book.genres.educationAndTeaching") },
		{ value: "travel", label: t("book.genres.travel") },
		{ value: "trueCrime", label: t("book.genres.trueCrime") },
	];
};

function getOverallRate(rates?: (string | BookRate)[]) {
	if (rates && rates.length > 0) {
		if (isImplementsBookRate(rates)) {
			let all = 0;
			let count = 0;
			rates.every((rate) => {
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

function isBookAlreadyInLoggedInBorrows(bookId?: string, borrows?: Borrow[]) {
	let isInLoggedInBorrows = false;
	if (bookId && borrows) {
		borrows.some((borrow) => {
			if (
				(borrow.books as Book[]).some((book) => {
					if (book._id == bookId) {
						isInLoggedInBorrows = true;
						return true;
					}
				})
			) {
				return true;
			}
			return false;
		});
	}
	return isInLoggedInBorrows;
}

function isImplementsBookRate(rates?: any[]): rates is BookRate[] {
	if (rates && rates.length > 0) {
		return "from" in rates[0];
	}
	return false;
}

export { getOverallRate, isLoggedInUserAlreadyRated, isRateFromLoggedIn, isBookAlreadyInLoggedInBorrows, genres };
