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