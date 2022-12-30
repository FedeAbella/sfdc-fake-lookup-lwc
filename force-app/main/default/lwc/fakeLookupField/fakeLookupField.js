/*
* ─────────────────────────────────────────────────────────────────────────────────────────────────┐
* fakeLookupField: Javascript controller for fakeLookupField LWC. Handles filtering the dropdown
*   options via search, selecting a record and clearing it, and passing the current selection to 
*   the parent component. Also dynamically setting styling classes according to needed.
*
* ──────────────────────────────────────────────────────────────────────────────────────────────────
* @author         Federico Abella   <federico.abella@cloudgaia.com>
* @modifiedBy     Federico Abella   <federico.abella@cloudgaia.com>
* @maintainedBy   Federico Abella   <federico.abella@cloudgaia.com>
* @version        1.0
* @created        2022-12-30
* @modified       2022-12-30
* @systemLayer    UI/Client-side
* ──────────────────────────────────────────────────────────────────────────────────────────────────
* @changes
* ─────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
import { LightningElement, api } from 'lwc';

//  css classes to be grabbed dynamically depending on context
const BASE_DROPDOWN_CLASS = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
const OPEN_DROPDOWN_CLASS = 'slds-is-open';
const COMBOBOX_CONTAINER_CLASS = 'slds-combobox_container';
const COMBOBOX_HAS_SELECTION_CLASS = 'slds-has-selection';

export default class FakeLookupField extends LightningElement {
    
    @api objectName = 'Account'; //  The name of the object to be shown on meta line in options
    @api selectedRecordId = null; //  The currently selected record Id
    @api selectedRecordName = null; // The currently selected record name
    @api iconName = 'action:new_account'; //  The entity icon to be shown
    @api clearLabel = 'Clear'; //  The label for the clear button
    @api inputPlaceholder = 'Search for an Account...' //  The input placeholder text
    @api noResultLabel = 'No results found.' //  The message when filtering returns no results
    @api isDisabled = false; //  Whether the input is disabled (e.g.: no records have been set)
    @api isNameLocked = false; //  If a record name should be shown but not available to clear
    @api showSecondaryField = false; //  If a secondary field should be shown and filtered with

    _records; //  Internal variable to keep the record information
    searchIconFlag =  true; //  Whether the search icon is visible (or clear button if false)
    dropdownOpen = false; //  Whether the dropdown list is open
    filteredRecords; //  Internal variable to keep the records that've been filtered
    searchValue; //  The current search string

    //  Whether the clear icon is shown
    get clearIconFlag() {
        return !this.searchIconFlag;
    }

    //  The css classes of the dropdown combobox
    get dropdownClassName() {
        return this.dropdownOpen ? BASE_DROPDOWN_CLASS + ' ' + OPEN_DROPDOWN_CLASS :
            BASE_DROPDOWN_CLASS;
    }

    //  The css classes of the container
    get containerClassName() {
        return this.selectedRecordName == null ? COMBOBOX_CONTAINER_CLASS :
            COMBOBOX_CONTAINER_CLASS + ' ' + COMBOBOX_HAS_SELECTION_CLASS;
    }

    /*
    * Method called when records are set on the component. Ensures appropriate fields for Secondary 
    * field, and pre- and post-mark fields are created on each record, so a <mark> tag can be 
    * applied to highlight the search string. Also enables or disables the input depending on 
    * whether records were actually set or not.
    */
    @api set records(records) {
        this._records = [];
        records.forEach((x) => {
            let record = {
                Id: x.Id,
                Name: x.Name,
                Secondary: x.Secondary,
                NamePreMark: x.Name,
                NameMark: '',
                NamePostMark: '',
                SecondaryPreMark: x.Secondary,
                SecondaryMark: '',
                SecondaryPostMark: ''
            };
            if (x.Secondary === undefined || x.Secondary === null) {
                record.Secondary = '',
                record.SecondaryPreMark = '',
                record.SecondaryMark = '',
                record.SecondaryPostMark = ''
            }
            this._records.push(record);
        })
        this.filteredRecords = this._records;
        if (this._records.length) {
            this.isDisabled = false;
        }
        if (!this._records.length) {
            this.isDisabled = true;
        }
    }

    //  Gets the records as the private variable
    get records() {
        return this._records;
    }

    /*
    * Method to handle the user searching on the input. Clears the filteredRecords variable if there
    * is no search string, or filters the _records variable using the search string on the name 
    * property (and on secondary property if that option has been set). Applies the <mark> tags to 
    * highlight the search string in options
    */
    searchField(event) {
        var currentText = event.target.value;

        if(currentText.length == 0) {
            this.filteredRecords = this._records;
            this.filteredRecords.forEach((x) => {
                x.NamePreMark = x.Name;
                x.NameMark = '';
                x.NamePostMark = '';
                x.SecondaryPreMark = x.Secondary;
                x.SecondaryMark = '';
                x.SecondaryPostMark = '';
            })
            return;
        }

        this.filteredRecords = this._records.filter((x) => {
            return x.Name.toLowerCase().includes(currentText.toLowerCase()) ||
                (this.showSecondaryField && 
                    x.Secondary.toLowerCase().includes(currentText.toLowerCase())
                );
        })

        this.filteredRecords.forEach((x) => {
            if (x.Name.toLowerCase().includes(currentText.toLowerCase())) {
                let startIndex = x.Name.toLowerCase().search(currentText.toLowerCase());
                x.NamePreMark = x.Name.substring(0, startIndex);
                x.NameMark = x.Name.substring(startIndex, startIndex + currentText.length);
                x.NamePostMark = x.Name.substring(startIndex + currentText.length);
            }
            if (this.showSecondaryField &&
                x.Secondary.toLowerCase().includes(currentText.toLowerCase())
            ) {
                let startIndex = x.Secondary.toLowerCase().search(currentText.toLowerCase());
                x.SecondaryPreMark = x.Secondary.substring(0, startIndex);
                x.SecondaryMark = x.Secondary.substring(
                    startIndex, startIndex + currentText.length
                );
                x.SecondaryPostMark = x.Secondary.substring(startIndex + currentText.length);
            }
        })
    }

    openDropdown() {
        this.dropdownOpen = true;
    }

    /*
    * Only close the dropdown after a small timeout to allow users to click on a selected record 
    * before dropdown is closed for losing focus
    */
    closeDropdown(){
        setTimeout(() => {this.dropdownOpen = false}, 100);
    }
    
    //  On record selection, dispatch an event to parent component, and change looks to show that
    setSelectedRecord(event) {
        const id = event.currentTarget.dataset.id;
        const name = event.currentTarget.dataset.name;
        this.dropdownOpen = false;
        this.searchIconFlag = false;
        this.selectedRecordName = name;
        this.selectedRecordId = id;
        const selectedEvent = new CustomEvent('selected', { 
            detail: {
                Id: id,
                Name: name
            },
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
    
    //  On clear, reset selection and looks, and dispatch event to parent component
    resetData() {
        this.selectedRecordName = null;
        this.selectedRecordId = null;
        this.searchIconFlag = true;
        this.filteredRecords = this._records;
        this.filteredRecords.forEach((x) => {
            x.NamePreMark = x.Name;
            x.NameMark = '';
            x.NamePostMark = '';
            x.SecondaryPreMark = x.Secondary;
            x.SecondaryMark = '';
            x.SecondaryPostMark = '';
        })
        const resetEvent = new CustomEvent('reset', {});
        this.dispatchEvent(resetEvent);
    }
}