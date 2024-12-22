import {
	CustomAddressProperty,
	CustomEmailProperty,
	CustomPhoneProperty,
	CustomTextProperty,
	CustomUrlProperty,
} from "./types";

/**
 * A class for creating and managing vCard (Virtual Contact File) data.
 * Implements version 3.0 of the vCard specification.
 */
export class VCard {
	private singleProps: Map<string, string> = new Map();
	private customIndex: number = 1;

	/**
	 * Creates a new VCard instance initialized with BEGIN and VERSION properties.
	 */
	constructor() {
		this.singleProps.set("BEGIN", "VCARD");
		this.singleProps.set("VERSION", "3.0");
	}

	public setName(firstName: string | undefined, lastName: string | undefined): VCard {
		if(!firstName && !lastName) {
			return this
		}
		// Set FN (Full Name) property
		this.singleProps.set("FN", firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || "");

		// Set N (Name) property with components
		this.singleProps.set("N", `${lastName || ""};${firstName || ""};;;`);
		return this;
	}

	public setOrganization(organization: string | undefined): VCard {
		if(!organization) {
			return this
		}
		this.singleProps.set("ORG", organization);
		return this;
	}

	public setNote(note: string | undefined): VCard {
		if(!note) {
			return this
		}
		this.singleProps.set("NOTE", note);
		return this;
	}

	public setJobTitle(jobTitle: string | undefined): VCard {
		if(!jobTitle) {
			return this
		}
		this.singleProps.set("TITLE", jobTitle);
		return this;
	}

	public setPhoto(base64Data: string, imageType = "JPEG"): VCard {
		// Remove data URL prefix if present
		const cleanData = base64Data.replace(/^data:image\/(jpeg|png|gif);base64,/, "");

		// PHOTO property with ENCODING and TYPE parameters
		this.singleProps.set(`PHOTO;ENCODING=BASE64;TYPE=${imageType}`, cleanData);

		return this;
	}

	public addPhone({ label, value, type }: CustomPhoneProperty): VCard {
		if (!value) {
			return this;
		}
		const itemPrefix = `item${this.customIndex}`;
		this.singleProps.set(`${itemPrefix}.X-ABLABEL`, label);
		this.singleProps.set(`${itemPrefix}.TEL;PREF=1;TYPE=${type}`, value);
		this.customIndex++;
		return this;
	}

	public addEmail({ label, value, type }: CustomEmailProperty): VCard {
		if (!value) {
			return this;
		}
		const itemPrefix = `item${this.customIndex}`;
		this.singleProps.set(`${itemPrefix}.X-ABLABEL`, label);
		this.singleProps.set(`${itemPrefix}.EMAIL;CHARSET=UTF-8;TYPE=${type}`, value);
		this.customIndex++;
		return this;
	}

	public addUrl({ label, value, type }: CustomUrlProperty): VCard {
		if (!value) {
			return this;
		}
		const itemPrefix = `item${this.customIndex}`;
		this.singleProps.set(`${itemPrefix}.X-ABLABEL`, label);
		this.singleProps.set(`${itemPrefix}.URL;${type}`, value);
		this.customIndex++;
		return this;
	}

	public addText({ label, value }: CustomTextProperty): VCard {
		if (!value) {
			return this;
		}
		const itemPrefix = `item${this.customIndex}`;
		this.singleProps.set(`${itemPrefix}.X-ABLABEL`, label);
		this.singleProps.set(`${itemPrefix}.URL`, value);
		this.customIndex++;
		return this;
	}

	public addAddress({ label, fullStreet, city, region, postalCode, country }: CustomAddressProperty): VCard {
		if (!fullStreet && !city && !region && !postalCode && !country) {
			return this;
		}

		const itemPrefix = `item${this.customIndex}`;
		const address = [fullStreet, city, region, postalCode, country].filter(Boolean).join(";");

		this.singleProps.set(`${itemPrefix}.X-ABLABEL`, label);
		this.singleProps.set(`${itemPrefix}.ADR;CHARSET=UTF-8`, address);
		this.customIndex++;
		return this;
	}
	/**
	 * Converts the vCard data to a string format.
	 * Adds the END:VCARD property and joins all properties with newlines.
	 * @returns The complete vCard data as a string
	 */
	public toString(): string {
		this.singleProps.set("END", "VCARD");
		return [...this.singleProps.entries()].map(([key, value]) => `${key}:${value}`).join("\n");
	}
}
