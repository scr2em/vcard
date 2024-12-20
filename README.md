# vCard Generator

A TypeScript library for generating vCard (VCF) files with custom properties support. This package allows you to create digital business cards in the vCard format (version 3.0) with support for custom labels and multiple contact properties.

## Features

- Generate vCard 3.0 format compatible files
- Support for basic contact information (name, organization, job title)
- Custom property support for:
	- Phone numbers (work, home, cell, voice, fax, pager)
	- Email addresses (work, home)
	- URLs (work, home)
	- Physical addresses
	- Custom text fields
- Base64 photo/avatar support
- Chain-able methods for easy card creation
- TypeScript support with full type definitions

## Installation

```bash
npm install @scr2em/vcard
# or
yarn add @scr2em/vcard
```

## Usage

### Basic Example

```typescript
import { VCard } from '@scr2em/vcard';

const card = new VCard()
  .setName('John', 'Doe')
  .setOrganization('Acme Corp')
  .setJobTitle('Software Engineer')
  .setNote('Professional contact')
  .toString();
```

### Complex Example with Custom Properties

```typescript
import { VCard } from '@scr2em/vcard';

const card = new VCard()
  .setName('John', 'Doe')
  .setOrganization('Acme Corp')
  .setJobTitle('Software Engineer')
  .addPhone({
    label: 'Work Phone',
    type: 'work',
    value: '+1-555-555-0123'
  })
  .addEmail({
    label: 'Work Email',
    type: 'work',
    value: 'john.doe@acme.com'
  })
  .addAddress({
    label: 'Office',
    fullStreet: '123 Business Ave',
    city: 'San Francisco',
    region: 'CA',
    postalCode: 94107,
    country: 'United States'
  })
  .addUrl({
    label: 'Website',
    type: 'work',
    value: 'https://johndoe.com'
  })
  .toString();
```

## API Reference

### VCard Class

#### Basic Methods

- `setName(firstName?: string, lastName?: string): VCard`
	- Sets the contact's name
	- Both parameters are optional

- `setOrganization(organization: string): VCard`
	- Sets the organization/company name

- `setJobTitle(jobTitle: string): VCard`
	- Sets the contact's job title

- `setNote(note: string): VCard`
	- Sets a general note for the contact

- `setPhoto(base64Data: string, imageType?: string): VCard`
	- Adds a photo to the contact
	- `base64Data`: Base64-encoded image data
	- `imageType`: Image format (default: "JPEG")

#### Custom Property Methods

- `addPhone(props: CustomPhoneProperty): VCard`
  ```typescript
  interface CustomPhoneProperty {
    label: string;
    value: string | undefined;
    type: "work" | "home" | "cell" | "voice" | "fax" | "pager";
  }
  ```

- `addEmail(props: CustomEmailProperty): VCard`
  ```typescript
  interface CustomEmailProperty {
    label: string;
    value: string | undefined;
    type: "work" | "home";
  }
  ```

- `addUrl(props: CustomUrlProperty): VCard`
  ```typescript
  interface CustomUrlProperty {
    label: string;
    value: string | undefined;
    type: "work" | "home";
  }
  ```

- `addAddress(props: CustomAddressProperty): VCard`
  ```typescript
  interface CustomAddressProperty {
    label: string;
    fullStreet?: string;
    city?: string;
    country?: string;
    postalCode?: number;
    region?: string;
  }
  ```

- `addText(props: CustomTextProperty): VCard`
  ```typescript
  interface CustomTextProperty {
    label: string;
    value: string | undefined;
  }
  ```

#### Output Method

- `toString(): string`
	- Generates the final vCard string in VCF format
	- Returns a string that can be saved as a .vcf file

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.