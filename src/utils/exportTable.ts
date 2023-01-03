import { QTableProps, exportFile, Notify } from "quasar";

function wrapCsvValue(val?: any, formatFn?: (val: any, row: any) => any, row?: any): string {
	let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

	formatted = formatted === void 0 || formatted === null ? "" : String(formatted);
	formatted = formatted.split('"').join('""');

	return `"${formatted}"`;
}

export default function exportTable(columns: QTableProps["columns"], rows: QTableProps["rows"], title?: string) {
	const content = [(columns as any[]).map((col) => wrapCsvValue(col.label))]
		.concat(
			(rows as any[]).map((row) =>
				(columns as any[])
					.map((col) =>
						wrapCsvValue(
							typeof col.field === "function" ? col.field(row) : row[col.field === void 0 ? col.name : col.field],
							col.format,
							row,
						),
					)
					.join(","),
			),
		)
		.join("\r\n");

	const status = exportFile(title ? `${title}-table-export.csv` : "table-export.csv", content, "text/csv");

	if (status !== true) {
		Notify.create({
			message: "Browser denied file download...",
			color: "negative",
			icon: "warning",
		});
	}
}
