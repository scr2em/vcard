interface CustomPropertyBase {
	label: string;
	value: string | undefined;
}

export interface CustomPhoneProperty extends CustomPropertyBase {
	type: "work" | "home" | "cell" | "voice" | "fax" | "pager";
}

export interface CustomEmailProperty extends CustomPropertyBase {
	type: "work" | "home";
}

export interface CustomUrlProperty extends CustomPropertyBase {
	type: "work" | "home";
}

export interface CustomTextProperty extends CustomPropertyBase {}

export interface CustomAddressProperty extends Omit<CustomPropertyBase, "value"> {
	fullStreet?: string;
	city?: string;
	country?: string;
	postalCode?: number;
	region?: string;
}
