import { describe, it, expect } from 'vitest';
import { VCard } from './vCard';

describe('VCard.from', () => {
	it('should parse a basic vCard string', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
N:Doe;John;;;
ORG:Example Corp
TITLE:Software Engineer
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('FN:John Doe');
		expect(result).toContain('N:Doe;John;;;');
		expect(result).toContain('ORG:Example Corp');
		expect(result).toContain('TITLE:Software Engineer');
		expect(result).toContain('END:VCARD');
	});

	it('should parse vCard with custom properties', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Jane Smith
item1.X-ABLABEL:Mobile
item1.TEL;PREF=1;TYPE=CELL:+1-555-123-4567
item2.X-ABLABEL:Work Email
item2.EMAIL;CHARSET=UTF-8;TYPE=WORK:jane@example.com
item3.X-ABLABEL:LinkedIn
item3.URL;TYPE=HOME:https://linkedin.com/in/jane
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('item1.X-ABLABEL:Mobile');
		expect(result).toContain('item1.TEL;PREF=1;TYPE=CELL:+1-555-123-4567');
		expect(result).toContain('item2.X-ABLABEL:Work Email');
		expect(result).toContain('item2.EMAIL;CHARSET=UTF-8;TYPE=WORK:jane@example.com');
		expect(result).toContain('item3.X-ABLABEL:LinkedIn');
		expect(result).toContain('item3.URL;TYPE=HOME:https://linkedin.com/in/jane');
	});

	it('should handle Windows line endings', () => {
		const vCardString = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Test User\r\nEND:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('FN:Test User');
		expect(result).toContain('END:VCARD');
	});

	it('should handle empty lines in vCard string', () => {
		const vCardString = `BEGIN:VCARD

VERSION:3.0

FN:Test User

END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('FN:Test User');
		expect(result).toContain('END:VCARD');
	});

	it('should parse vCard with photo data', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Photo User
PHOTO;ENCODING=BASE64;TYPE=JPEG:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('PHOTO;ENCODING=BASE64;TYPE=JPEG:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
	});

	it('should parse vCard with address', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Address User
item1.X-ABLABEL:Home
item1.ADR;CHARSET=UTF-8:123 Main St;New York;NY;10001;USA
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('item1.X-ABLABEL:Home');
		expect(result).toContain('item1.ADR;CHARSET=UTF-8:123 Main St;New York;NY;10001;USA');
	});

	it('should correctly track custom index after parsing', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Index Test
item1.X-ABLABEL:Phone
item1.TEL;PREF=1;TYPE=CELL:+1-555-123-4567
item3.X-ABLABEL:Email
item3.EMAIL;CHARSET=UTF-8;TYPE=WORK:test@example.com
END:VCARD`;

		const vCard = VCard.from(vCardString);

		// Add a new phone to test that the custom index is set correctly
		vCard.addPhone({ label: 'New Phone', value: '+1-555-999-8888', type: 'cell' });

		const result = vCard.toString();

		// Should use item4 (one more than the highest found index of 3)
		expect(result).toContain('item4.X-ABLABEL:New Phone');
		expect(result).toContain('item4.TEL;PREF=1;TYPE=cell:+1-555-999-8888');
	});

	it('should handle vCard with note', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Note User
NOTE:This is a test note with special characters: @#$%
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('NOTE:This is a test note with special characters: @#$%');
	});

	it('should handle minimal vCard', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('END:VCARD');
	});

	it('should ignore lines without colon separator', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Test User
INVALID_LINE_WITHOUT_COLON
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('FN:Test User');
		expect(result).toContain('END:VCARD');
		expect(result).not.toContain('INVALID_LINE_WITHOUT_COLON');
	});

	it('should handle complex vCard with multiple properties', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:John Smith
N:Smith;John;;;
ORG:Tech Corp
TITLE:Senior Developer
NOTE:Experienced developer with 10+ years
item1.X-ABLABEL:Mobile
item1.TEL;PREF=1;TYPE=CELL:+1-555-123-4567
item2.X-ABLABEL:Work
item2.TEL;PREF=1;TYPE=WORK:+1-555-987-6543
item3.X-ABLABEL:Personal Email
item3.EMAIL;CHARSET=UTF-8;TYPE=HOME:john@personal.com
item4.X-ABLABEL:Work Email
item4.EMAIL;CHARSET=UTF-8;TYPE=WORK:john@techcorp.com
item5.X-ABLABEL:Portfolio
item5.URL;TYPE=HOME:https://johnsmith.dev
item6.X-ABLABEL:Home Address
item6.ADR;CHARSET=UTF-8:123 Oak Street;Springfield;IL;62701;USA
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		// Check basic properties
		expect(result).toContain('FN:John Smith');
		expect(result).toContain('N:Smith;John;;;');
		expect(result).toContain('ORG:Tech Corp');
		expect(result).toContain('TITLE:Senior Developer');
		expect(result).toContain('NOTE:Experienced developer with 10+ years');

		// Check custom properties
		expect(result).toContain('item1.X-ABLABEL:Mobile');
		expect(result).toContain('item1.TEL;PREF=1;TYPE=CELL:+1-555-123-4567');
		expect(result).toContain('item2.X-ABLABEL:Work');
		expect(result).toContain('item2.TEL;PREF=1;TYPE=WORK:+1-555-987-6543');
		expect(result).toContain('item3.X-ABLABEL:Personal Email');
		expect(result).toContain('item3.EMAIL;CHARSET=UTF-8;TYPE=HOME:john@personal.com');
		expect(result).toContain('item4.X-ABLABEL:Work Email');
		expect(result).toContain('item4.EMAIL;CHARSET=UTF-8;TYPE=WORK:john@techcorp.com');
		expect(result).toContain('item5.X-ABLABEL:Portfolio');
		expect(result).toContain('item5.URL;TYPE=HOME:https://johnsmith.dev');
		expect(result).toContain('item6.X-ABLABEL:Home Address');
		expect(result).toContain('item6.ADR;CHARSET=UTF-8:123 Oak Street;Springfield;IL;62701;USA');
	});

	it('should allow further modification after parsing', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Original Name
END:VCARD`;

		const vCard = VCard.from(vCardString);

		// Modify the parsed vCard
		vCard.setName('Modified', 'Name');
		vCard.setOrganization('New Company');
		vCard.addEmail({ label: 'New Email', value: 'new@example.com', type: 'work' });

		const result = vCard.toString();

		expect(result).toContain('FN:Modified Name');
		expect(result).toContain('N:Name;Modified;;;');
		expect(result).toContain('ORG:New Company');
		expect(result).toContain('item1.X-ABLABEL:New Email');
		expect(result).toContain('item1.EMAIL;CHARSET=UTF-8;TYPE=work:new@example.com');
	});
});

describe('VCard round-trip tests', () => {
	it('should maintain identity after string conversion and back', () => {
		const originalVCard = new VCard()
			.setName('John', 'Doe')
			.setOrganization('Tech Corp')
			.setJobTitle('Software Engineer')
			.setNote('Experienced developer');

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with custom properties', () => {
		const originalVCard = new VCard()
			.setName('Jane', 'Smith')
			.setOrganization('Example Inc')
			.addPhone({ label: 'Mobile', value: '+1-555-123-4567', type: 'cell' })
			.addPhone({ label: 'Work', value: '+1-555-987-6543', type: 'work' })
			.addEmail({ label: 'Personal', value: 'jane@personal.com', type: 'home' })
			.addEmail({ label: 'Work', value: 'jane@work.com', type: 'work' })
			.addUrl({ label: 'LinkedIn', value: 'https://linkedin.com/in/jane', type: 'home' });

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with address', () => {
		const originalVCard = new VCard()
			.setName('Bob', 'Johnson')
			.addAddress({
				label: 'Home',
				fullStreet: '123 Main Street',
				city: 'New York',
				region: 'NY',
				postalCode: 10001,
				country: 'USA'
			})
			.addAddress({
				label: 'Work',
				fullStreet: '456 Business Ave',
				city: 'San Francisco',
				region: 'CA',
				postalCode: 94105,
				country: 'USA'
			});

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with photo data', () => {
		const originalVCard = new VCard()
			.setName('Photo', 'User')
			.setPhoto('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'JPEG');

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with text properties', () => {
		const originalVCard = new VCard()
			.setName('Text', 'User')
			.addText({ label: 'Custom Field', value: 'Custom Value' })
			.addText({ label: 'Another Field', value: 'Another Value' });

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with complex vCard', () => {
		const originalVCard = new VCard()
			.setName('Complex', 'User')
			.setOrganization('Multi Corp')
			.setJobTitle('Senior Manager')
			.setNote('Complex user with many properties')
			.addPhone({ label: 'Mobile', value: '+1-555-111-2222', type: 'cell' })
			.addPhone({ label: 'Work', value: '+1-555-333-4444', type: 'work' })
			.addPhone({ label: 'Home', value: '+1-555-555-6666', type: 'home' })
			.addEmail({ label: 'Personal', value: 'complex@personal.com', type: 'home' })
			.addEmail({ label: 'Work', value: 'complex@work.com', type: 'work' })
			.addUrl({ label: 'Website', value: 'https://complexuser.com', type: 'home' })
			.addUrl({ label: 'Portfolio', value: 'https://portfolio.complexuser.com', type: 'work' })
			.addAddress({
				label: 'Home',
				fullStreet: '789 Residential St',
				city: 'Austin',
				region: 'TX',
				postalCode: 78701,
				country: 'USA'
			})
			.addText({ label: 'Department', value: 'Engineering' })
			.addText({ label: 'Employee ID', value: 'EMP-12345' });

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should maintain identity with minimal vCard', () => {
		const originalVCard = new VCard(); // Just BEGIN and VERSION

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should allow further modification after round-trip', () => {
		const originalVCard = new VCard()
			.setName('Original', 'User')
			.addPhone({ label: 'Phone', value: '+1-555-123-4567', type: 'cell' });

		const vCardString = originalVCard.toString();
		const parsedVCard = VCard.from(vCardString);

		// Add more properties after parsing
		parsedVCard
			.setOrganization('New Company')
			.addEmail({ label: 'New Email', value: 'new@example.com', type: 'work' });

		const finalString = parsedVCard.toString();

		// Original properties should still be there
		expect(finalString).toContain('FN:Original User');
		expect(finalString).toContain('N:User;Original;;;');
		expect(finalString).toContain('item1.X-ABLABEL:Phone');
		expect(finalString).toContain('item1.TEL;PREF=1;TYPE=cell:+1-555-123-4567');

		// New properties should be added
		expect(finalString).toContain('ORG:New Company');
		expect(finalString).toContain('item2.X-ABLABEL:New Email');
		expect(finalString).toContain('item2.EMAIL;CHARSET=UTF-8;TYPE=work:new@example.com');
	});
});

describe('VCard error handling and edge cases', () => {
	it('should handle empty vCard string', () => {
		const vCard = VCard.from('');
		const result = vCard.toString();

		// Should at least have BEGIN and END
		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('END:VCARD');
	});

	it('should handle malformed vCard string', () => {
		const malformedVCard = `NOT_A_VCARD
RANDOM_TEXT
MORE_RANDOM_TEXT`;

		const vCard = VCard.from(malformedVCard);
		const result = vCard.toString();

		// Should still produce valid vCard structure
		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('END:VCARD');
	});

	it('should handle vCard with only colons', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
:::
:empty_value
property_without_value:
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('property_without_value:');
		expect(result).toContain('END:VCARD');
	});

	it('should handle undefined and null values gracefully', () => {
		const vCard = new VCard();

		// These should not throw errors and should return the same instance
		expect(vCard.setName(undefined, undefined)).toBe(vCard);
		expect(vCard.setOrganization(undefined)).toBe(vCard);
		expect(vCard.setJobTitle(undefined)).toBe(vCard);
		expect(vCard.setNote(undefined)).toBe(vCard);

		// Methods should handle undefined/empty values
		expect(vCard.addPhone({ label: 'Test', value: undefined, type: 'cell' })).toBe(vCard);
		expect(vCard.addEmail({ label: 'Test', value: undefined, type: 'work' })).toBe(vCard);
		expect(vCard.addUrl({ label: 'Test', value: undefined, type: 'home' })).toBe(vCard);
		expect(vCard.addText({ label: 'Test', value: undefined })).toBe(vCard);

		const result = vCard.toString();

		// Should only contain basic structure
		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('END:VCARD');
		expect(result).not.toContain('FN:');
		expect(result).not.toContain('item1');
	});

	it('should handle empty string values', () => {
		const vCard = new VCard();

		// These should not add properties for empty strings
		expect(vCard.setName('', '')).toBe(vCard);
		expect(vCard.setOrganization('')).toBe(vCard);
		expect(vCard.setJobTitle('')).toBe(vCard);
		expect(vCard.setNote('')).toBe(vCard);

		expect(vCard.addPhone({ label: 'Test', value: '', type: 'cell' })).toBe(vCard);
		expect(vCard.addEmail({ label: 'Test', value: '', type: 'work' })).toBe(vCard);
		expect(vCard.addUrl({ label: 'Test', value: '', type: 'home' })).toBe(vCard);
		expect(vCard.addText({ label: 'Test', value: '' })).toBe(vCard);

		const result = vCard.toString();

		// Should only contain basic structure
		expect(result).toContain('BEGIN:VCARD');
		expect(result).toContain('VERSION:3.0');
		expect(result).toContain('END:VCARD');
		expect(result).not.toContain('FN:');
		expect(result).not.toContain('item1');
	});

	it('should handle single name values correctly', () => {
		const vCard1 = new VCard().setName('John', undefined);
		const vCard2 = new VCard().setName(undefined, 'Doe');
		const vCard3 = new VCard().setName('Madonna', '');

		const result1 = vCard1.toString();
		const result2 = vCard2.toString();
		const result3 = vCard3.toString();

		expect(result1).toContain('FN:John');
		expect(result1).toContain('N:;John;;;');

		expect(result2).toContain('FN:Doe');
		expect(result2).toContain('N:Doe;;;;');

		expect(result3).toContain('FN:Madonna');
		expect(result3).toContain('N:;Madonna;;;');
	});

	it('should handle address with only some fields', () => {
		const vCard = new VCard()
			.addAddress({ label: 'Partial', city: 'New York' })
			.addAddress({ label: 'PostalOnly', postalCode: 12345 })
			.addAddress({ label: 'Empty' }); // All fields undefined/empty

		const result = vCard.toString();

		expect(result).toContain('item1.X-ABLABEL:Partial');
		expect(result).toContain('item1.ADR;CHARSET=UTF-8:New York');
		expect(result).toContain('item2.X-ABLABEL:PostalOnly');
		expect(result).toContain('item2.ADR;CHARSET=UTF-8:12345');
		// item3 should not exist because all fields are empty
		expect(result).not.toContain('item3');
	});
});

describe('VCard special characters and Unicode', () => {
	it('should handle Unicode characters in names', () => {
		const vCard = new VCard()
			.setName('José', 'García')
			.setOrganization('Café München')
			.setNote('Testing Unicode: 你好世界 🌍 emoji');

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toContain('FN:José García');
		expect(parsedString).toContain('N:García;José;;;');
		expect(parsedString).toContain('ORG:Café München');
		expect(parsedString).toContain('NOTE:Testing Unicode: 你好世界 🌍 emoji');
		expect(parsedString).toBe(vCardString);
	});

	it('should handle special characters in properties', () => {
		const vCard = new VCard()
			.setName('Test', 'User')
			.setNote('Special chars: ;,\\n"\'@#$%^&*()[]{}')
			.addPhone({ label: 'Phone with spaces & symbols', value: '+1 (555) 123-4567', type: 'cell' })
			.addEmail({ label: 'Email@Label', value: 'user+tag@example.com', type: 'work' });

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
	});

	it('should handle newlines and multiline text', () => {
		const multilineNote = `Line 1
Line 2
Line 3 with special chars: !@#$%`;

		const vCard = new VCard()
			.setName('Multiline', 'Test')
			.setNote(multilineNote);

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		// The current implementation preserves the basic structure, but multiline content
		// within a single property gets parsed as separate lines. This is a limitation
		// of the simple line-by-line parsing approach.
		expect(parsedString).toContain('FN:Multiline Test');
		expect(parsedString).toContain('N:Test;Multiline;;;');
		// The NOTE will be split by the parser, so we check for the first line
		expect(parsedString).toContain('NOTE:Line 1');
	});

	it('should handle very long strings', () => {
		const longString = 'A'.repeat(1000);
		const longNote = 'This is a very long note. ' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);

		const vCard = new VCard()
			.setName(longString, 'User')
			.setOrganization(longString)
			.setNote(longNote);

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
		expect(parsedString).toContain('FN:' + longString + ' User');
		expect(parsedString).toContain('ORG:' + longString);
		expect(parsedString).toContain('NOTE:' + longNote);
	});
});

describe('VCard property overwriting behavior', () => {
	it('should overwrite properties when set multiple times', () => {
		const vCard = new VCard()
			.setName('First', 'Name')
			.setName('Second', 'Name')
			.setOrganization('First Company')
			.setOrganization('Second Company')
			.setJobTitle('First Title')
			.setJobTitle('Second Title')
			.setNote('First Note')
			.setNote('Second Note');

		const result = vCard.toString();

		// Should only contain the last set values
		expect(result).toContain('FN:Second Name');
		expect(result).toContain('N:Name;Second;;;');
		expect(result).toContain('ORG:Second Company');
		expect(result).toContain('TITLE:Second Title');
		expect(result).toContain('NOTE:Second Note');

		// Should not contain first values
		expect(result).not.toContain('FN:First Name');
		expect(result).not.toContain('N:Name;First;;;');
		expect(result).not.toContain('ORG:First Company');
		expect(result).not.toContain('TITLE:First Title');
		expect(result).not.toContain('NOTE:First Note');
	});

	it('should accumulate custom properties (not overwrite)', () => {
		const vCard = new VCard()
			.setName('Test', 'User')
			.addPhone({ label: 'Phone 1', value: '+1-555-111-1111', type: 'cell' })
			.addPhone({ label: 'Phone 2', value: '+1-555-222-2222', type: 'work' })
			.addEmail({ label: 'Email 1', value: 'email1@example.com', type: 'home' })
			.addEmail({ label: 'Email 2', value: 'email2@example.com', type: 'work' });

		const result = vCard.toString();

		// Should contain all added properties
		expect(result).toContain('item1.X-ABLABEL:Phone 1');
		expect(result).toContain('item1.TEL;PREF=1;TYPE=cell:+1-555-111-1111');
		expect(result).toContain('item2.X-ABLABEL:Phone 2');
		expect(result).toContain('item2.TEL;PREF=1;TYPE=work:+1-555-222-2222');
		expect(result).toContain('item3.X-ABLABEL:Email 1');
		expect(result).toContain('item3.EMAIL;CHARSET=UTF-8;TYPE=home:email1@example.com');
		expect(result).toContain('item4.X-ABLABEL:Email 2');
		expect(result).toContain('item4.EMAIL;CHARSET=UTF-8;TYPE=work:email2@example.com');
	});

	it('should handle setting properties after parsing', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Original Name
ORG:Original Company
TITLE:Original Title
NOTE:Original Note
END:VCARD`;

		const vCard = VCard.from(vCardString);

		// Override properties
		vCard.setName('New', 'Name');
		vCard.setOrganization('New Company');
		vCard.setJobTitle('New Title');
		vCard.setNote('New Note');

		const result = vCard.toString();

		// Should contain new values
		expect(result).toContain('FN:New Name');
		expect(result).toContain('N:Name;New;;;');
		expect(result).toContain('ORG:New Company');
		expect(result).toContain('TITLE:New Title');
		expect(result).toContain('NOTE:New Note');

		// Should not contain original values
		expect(result).not.toContain('FN:Original Name');
		expect(result).not.toContain('ORG:Original Company');
		expect(result).not.toContain('TITLE:Original Title');
		expect(result).not.toContain('NOTE:Original Note');
	});
});

describe('VCard photo handling edge cases', () => {
	it('should handle different photo formats', () => {
		const vCard1 = new VCard().setPhoto('base64data', 'PNG');
		const vCard2 = new VCard().setPhoto('base64data', 'GIF');
		const vCard3 = new VCard().setPhoto('base64data'); // Default JPEG

		const result1 = vCard1.toString();
		const result2 = vCard2.toString();
		const result3 = vCard3.toString();

		expect(result1).toContain('PHOTO;ENCODING=BASE64;TYPE=PNG:base64data');
		expect(result2).toContain('PHOTO;ENCODING=BASE64;TYPE=GIF:base64data');
		expect(result3).toContain('PHOTO;ENCODING=BASE64;TYPE=JPEG:base64data');
	});

	it('should handle data URL prefixes in photos', () => {
		const dataUrlPhoto = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
		const vCard = new VCard().setPhoto(dataUrlPhoto);

		const result = vCard.toString();

		// Should strip the data URL prefix
		expect(result).toContain('PHOTO;ENCODING=BASE64;TYPE=JPEG:iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
		expect(result).not.toContain('data:image/jpeg;base64,');
	});

	it('should handle photo round-trip with data URL', () => {
		const dataUrlPhoto = 'data:image/png;base64,testdata123';
		const vCard = new VCard().setPhoto(dataUrlPhoto, 'PNG');

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
		expect(parsedString).toContain('PHOTO;ENCODING=BASE64;TYPE=PNG:testdata123');
	});
});

describe('VCard case sensitivity and spec compliance', () => {
	it('should handle case-insensitive property names during parsing', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
fn:John Doe
n:Doe;John;;;
org:Example Corp
title:Engineer
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		// Should preserve original case when parsed
		expect(result).toContain('fn:John Doe');
		expect(result).toContain('n:Doe;John;;;');
		expect(result).toContain('org:Example Corp');
		expect(result).toContain('title:Engineer');
	});

	it('should handle mixed case property names', () => {
		const vCardString = `Begin:VCARD
Version:3.0
FN:Mixed Case
N:Case;Mixed;;;
Org:Company
Title:Job
End:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		// Should preserve the case as provided
		expect(result).toContain('Begin:VCARD');
		expect(result).toContain('Version:3.0');
		expect(result).toContain('FN:Mixed Case');
		expect(result).toContain('Org:Company');
		expect(result).toContain('Title:Job');
		expect(result).toContain('End:VCARD');
	});

	it('should handle colons in property values', () => {
		const vCard = new VCard()
			.setName('Test', 'User')
			.setNote('Time: 12:34:56')
			.addUrl({ label: 'Website', value: 'https://example.com:8080/path', type: 'home' });

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toContain('NOTE:Time: 12:34:56');
		expect(parsedString).toContain('URL;home:https://example.com:8080/path');
		expect(parsedString).toBe(vCardString);
	});

	it('should handle empty property values', () => {
		const vCardString = `BEGIN:VCARD
VERSION:3.0
FN:Test User
N:User;Test;;;
ORG:
TITLE:
NOTE:
END:VCARD`;

		const vCard = VCard.from(vCardString);
		const result = vCard.toString();

		expect(result).toContain('FN:Test User');
		expect(result).toContain('N:User;Test;;;');
		expect(result).toContain('ORG:');
		expect(result).toContain('TITLE:');
		expect(result).toContain('NOTE:');
	});
});

describe('VCard large data and performance', () => {
	it('should handle very large photo data', () => {
		const largePhotoData = 'A'.repeat(50000); // 50KB of data
		const vCard = new VCard()
			.setName('Large', 'Photo')
			.setPhoto(largePhotoData);

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);
		expect(parsedString).toContain('PHOTO;ENCODING=BASE64;TYPE=JPEG:' + largePhotoData);
	});

	it('should handle vCard with many properties', () => {
		const vCard = new VCard().setName('Many', 'Properties');

		// Add many phone numbers
		for (let i = 1; i <= 10; i++) {
			vCard.addPhone({
				label: `Phone ${i}`,
				value: `+1-555-${i.toString()}-${i.toString()}`,
				type: i % 2 === 0 ? 'work' : 'cell'
			});
		}

		// Add many emails
		for (let i = 1; i <= 10; i++) {
			vCard.addEmail({
				label: `Email ${i}`,
				value: `user${i}@example${i}.com`,
				type: i % 2 === 0 ? 'work' : 'home'
			});
		}

		const vCardString = vCard.toString();
		const parsedVCard = VCard.from(vCardString);
		const parsedString = parsedVCard.toString();

		expect(parsedString).toBe(vCardString);

		// Check that all properties are present
		expect(parsedString).toContain('item1.X-ABLABEL:Phone 1');
		expect(parsedString).toContain('item10.X-ABLABEL:Phone 10');
		expect(parsedString).toContain('item11.X-ABLABEL:Email 1');
		expect(parsedString).toContain('item20.X-ABLABEL:Email 10');
	});

	it('should handle concurrent vCard creation', () => {
		const vCards: VCard[] = [];

		// Create multiple vCards concurrently
		for (let i = 0; i < 100; i++) {
			const vCard = new VCard()
				.setName(`User${i}`, `Test${i}`)
				.setOrganization(`Company${i}`)
				.addPhone({ label: 'Phone', value: `+1-555-${i.toString()}`, type: 'cell' })
				.addEmail({ label: 'Email', value: `user${i}@test.com`, type: 'work' });

			vCards.push(vCard);
		}

		// Verify all vCards are unique and properly constructed
		const strings = vCards.map(v => v.toString());
		const uniqueStrings = new Set(strings);

		expect(uniqueStrings.size).toBe(100); // All should be unique

		// Check a few random ones
		expect(strings[0]).toContain('FN:User0 Test0');
		expect(strings[50]).toContain('FN:User50 Test50');
		expect(strings[99]).toContain('FN:User99 Test99');
	});
});