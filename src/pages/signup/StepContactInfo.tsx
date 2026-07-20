import { TextField } from "../../components/ui/TextField";
import { SelectField } from "../../components/ui/SelectField";
import { COUNTRIES } from "../../lib/countries";
import { StepShell } from "./StepShell";

const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }));

export function StepContactInfo() {
  return (
    <StepShell badge="Stay in touch" title="Contact information" description="Where can we reach you?">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="contact.email" label="Email address" type="email" autoComplete="email" />
        <TextField name="contact.phone" label="Mobile phone number" type="tel" autoComplete="tel" />
        <div className="sm:col-span-2">
          <TextField name="contact.address.line1" label="Residential address" autoComplete="address-line1" />
        </div>
        <TextField name="contact.address.city" label="City" autoComplete="address-level2" />
        <TextField name="contact.address.state" label="State / Province" autoComplete="address-level1" />
        <TextField name="contact.address.postalCode" label="Postal / ZIP code" autoComplete="postal-code" />
        <SelectField name="contact.address.country" label="Country" options={countryOptions} />
      </div>
    </StepShell>
  );
}
