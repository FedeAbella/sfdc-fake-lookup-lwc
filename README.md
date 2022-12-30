# Salesforce Fake Lookup LWC

When building some Lightning Web Components, there may be a situation when a user needs to search through records and be able to select one. Of course, actual lookup fields are ideal for this, but it may be that the user is not searching through an actual field in an object. In these cases, you might want to present users with an option to search through records that resembles the lookup fields they might be accustomed to. This is what this fake lookup component is meant to do.

## How it works

This version is entirely client-side. Getting the set of records to search through is left to the parent component, as is handling what to do when a record is selected, or when a previous selection is cleared. The set of records is passed to this component with `Id`, and `Name` attributes, and an optional `Secondary` attribute. Both `Name` and `Secondary` represent the text fields the user is able to search through. More information on parameters and events can be found [here](https://github.com/FedeAbella/sfdc-fake-lookup-lwc/blob/master/force-app/main/default/lwc/fakeLookupField/parameters.md).

# What's next

This is a first draft, but good enough to be used. Future work on the component can include:
- Navigating options using keyboard, including highlighting and selecting

# Other options

While this particular component is fully client-side, an alternative would be to have a component that also handles searching by calling an Apex controller. There are pros and cons to both:
- A fully client-side component works best with smaller sets of records the parent component can easily query once, and makes searching quicker.
- A combined client-server side component could handle searching through very large sets of records by passing the responsability of filtering to the database, when retrieving the entire set of records would be too costly for the parent component. However, this would make searching slower by having to call the server-side controller on each search. I might be working on one of these and uploading it here in the future, so both options are present.