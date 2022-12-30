# Parameters

These are `@api` annotated parameters that can/should be set when the child component is defined on the parent's template:

## Mandatory parameters

- `records`: This is the set of records the component will allow searching through and selecting. Each object in the list should have an `Id` and `Name` properties, and an optional `Secondary` property. `Name` and `Secondary` properties will be shown on the dropdown as the record name and meta entity properties, as defined in the [SLDS page for Lookup Components](https://www.lightningdesignsystem.com/components/lookups/). The `records` property need not be set on component load, but can be set later (e.g.: depending on user choices) and the component will remain disabled until a non-empty `records` array has been set.

# Optional (defaulted) parameters

- `object-name`: String, defaults to 'Account'. The component is 100% object type agnostic, and this is only to be shown on each record as part of the meta line. Refer to the [SLDS page for Lookup Components](https://www.lightningdesignsystem.com/components/lookups/) for an example.
- `selected-record-id`: String, defaults to null. The value set externally for this property is not really used, but I'm leaving it open to be set in case you want to set it alongside `selected-record-name` or to reference from some other component.
- `selected-record-name`: String, defaults to null. When pre-setting the name, the component will automatically take on the look as if the user had already selected a record with that name. You can use this to pre-populate the component with a choice but still allow the user to clear that choice and search for another record.
- `is-name-locked`: Boolean. If set alongside a `selected-record-name`, the pre-populated name cannot be cleared, and the user is not allowed to search for a new record.
- `is-disabled`: Boolean. If set, the component is disabled and cannot be used to search. This property auto-sets to `true` if a non-empty array of `records` is set, in which case it can be re-set to `false` if needed.
- `show-secondary-field`: Boolean. If set, the `Secondary` property of `records` is shown on the meta section of the dropdown, and it is searchable by the user. If not set, the component just ignores this property.
- `icon-name`: String, defaults to 'action:new_account'. The name of an slds icon to be shown alongside records and when a record is selected.
- `clear-label`: String, defaults to 'Clear'. The label of the 'Clear' button.
- `input-placeholder`: String, defaults to 'Search for an Account...'. The placeholder text when the component has no records selected.
- `no-result-label`: String, defaults to 'No results found.'. The message given when searching returns no results.
