$(document).ready(function() {
	
	/* ===== Affix Sidebar ===== */
	/* Ref: http://getbootstrap.com/javascript/#affix-examples */

    	
	$('#doc-menu').affix({
        offset: {
            top: ($('#header').outerHeight(true) + $('#doc-header').outerHeight(true)) + 45,
            bottom: ($('#footer').outerHeight(true) + $('#promo-block').outerHeight(true)) + 75
        }
    });
    
    /* Hack related to: https://github.com/twbs/bootstrap/issues/10236 */
    $(window).on('load resize', function() {
        $(window).trigger('scroll'); 
    });

    /* Activate scrollspy menu */
    $('body').scrollspy({target: '#doc-nav', offset: 100});
    
    /* Smooth scrolling */
	$('a.scrollto').on('click', function(e){
        //store hash
        var target = this.hash;    
        e.preventDefault();
		$('body').scrollTo(target, 800, {offset: 0, 'axis':'y'});
		
	});
	
    
    /* ======= jQuery Responsive equal heights plugin ======= */
    /* Ref: https://github.com/liabru/jquery-match-height */
    
    $('#cards-wrapper .item-inner').matchHeight();
    $('#showcase .card').matchHeight();
     
    /* Bootstrap lightbox */
    /* Ref: http://ashleydw.github.io/lightbox/ */

    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    });

    
    /* ======= Multi-Option Picker(s) Using Bootstrap Dropdowns with Checkboxes for Filtering ======= */
    /* Ref: http://www.benknowscode.com/2014/09/option-picker-bootstrap-dropdown-checkbox.html */
    
    $(".multi-option-dropdown.mod-filter-group").each(function() {
        var filters = []; // array to hold list of which filters are selected.
            
        $(this).find(".dropdown-menu-checkbox").on("click", function(e) {
            var $target = $(e.currentTarget), // which anchor was clicked?
                tdfid = $target.attr("data-filter-id"), // which data filter is being selected?
                $group = $target.parents(".mod-filter-group"), // get the parent element for the group.
                tdfgrp = $group.attr("data-filter-group"), // which data filter group does this filter belong to?
                $resetinput = $group.find("[data-filter-id='reset'] input"), // get the reset/all input (checkbox) for this dropdown.
                $inputs = $group.find(".dropdown-menu-checkbox input"), // get all of the inputs (checkboxes) for this dropdown.
                $input = $target.find("input"), // get the input (checkbox) from under this element.
                idx; // blank variable to hold index value of data filter in array.

            // check that target input is not the reset/all input.
            if (tdfid !== "reset") {
                // check or uncheck the boxes as necessary.
                if ( (idx = filters.indexOf(tdfid)) > -1 ) {
                    // if the data filter exists in the array, meaning it is checked, remove it and uncheck it.
                    filters.splice(idx, 1);
                    // uncheck the box
                    setTimeout(function() {
                        $input.prop("checked", false);
                    }, 0);
                } else {
                    // if the data filter does not exist in the array, meaning it is unchecked, add it and check it.
                    filters.push(tdfid);
                    // check the box, and uncheck the reset/all option since it would no longer apply.
                    setTimeout(function() {
                        $input.prop("checked", true);
                        $resetinput.prop("checked", false);
                    }, 0);
                }
            } else {
                // the data filter that was clicked is the reset/all input (checkbox).
                // reset the array, uncheck all the boxes, and check the reset/all option.
                filters = [];
                setTimeout(function() {
                    $inputs.prop("checked", false);
                    $resetinput.prop("checked", true);
                }, 0);
            }

            // check the filters array and if empty, meaning nothing is checked, check the reset/all item.
            if (filters.length < 1) {
                setTimeout(function() {
                    $resetinput.prop("checked", true);
                }, 0);
            }

            // because we clicked on a filter, we need to update the visible items.
            setTimeout(function() {
                updateFiltersByGroup(tdfgrp);
            }, 0);

            return false;
        });
    });

});

/**
 * Get Multidimensional Array of Filters By Group Function
 *
 * Builds an multidimensional array of selected filters for the filter
 * group. The top layer of the array holds an array for each dropdown
 * in the filter group. Those arrays then hold the selected filters
 * from each dropdown.
 *
 * @param {string} dfgrp
 *
 * @returns {array}
 */
function getFilterArray(dfgrp) {
    var filterarray = []; // multidimensional array to hold all arrays of filters.
    
    // loop over each dropdown
    $(".multi-option-dropdown.mod-filter-group[data-filter-group='" + dfgrp + "']").each(function() {
        var filters = [], // array to hold list of which filters are selected.
            $filters = $(this).find(".dropdown-menu-checkbox[data-filter-type='filter']"), // get all of the filters in this dropdown.
            useAll = true; // set boolean for whether we should use all data filters, such as if none are checked.

        // loop over the inputs (checkboxes) in the dropdown
        $filters.each(function() {
            var $input = $(this).find("input"), // get the input (checkbox) for this filter.
                dfid = $(this).attr("data-filter-id"); // get the data filter for this filter.

            // bypass the reset/all filters.
            if (dfid !== 'reset') {
                // check if the input (checkbox) is checked.
                if ($input.is(":checked")) {
                    // because something was checked, we won't be using all.
                    useAll = false;
                    // add the data filter to the array.
                    filters.push(dfid);
                }
            }
        });
            
        // if no items were checked, we need to use all.
        if (useAll) {
            $filters.each(function() {
                var dfid = $(this).attr("data-filter-id"); // get the data filter for this filter.
                // bypass the reset/all filters.
                if (dfid !== 'reset') {
                    // add the data filter to the array.
                    filters.push(dfid);
                }
            });
        }

        // add the array of filters to the multidimensional filter array.
        filterarray.push(filters);
    });
    
    return filterarray;
}

function updateFiltersByGroup(dfgrp) {
    var filterarray = getFilterArray(dfgrp), // multidimensional array to hold all arrays of filters.
        $allobjects = $("[data-filter-type='object'][data-filter-group='" + dfgrp + "']"); // get all of the data filter objects for this filter group.
    
    // the filter array should contain one array for each dropdown.
    if (filterarray.length > 0) {
        
        // default hide all objects so that we can show only the ones that the filters select.
        $allobjects.hide();
        
        // loop the objects
        $allobjects.each(function() {
            var datafilters = $(this).attr("data-filters").split(" "); // get the data filters from this object.
            var matches = []; // set a blank array to handle when matches are found.
            
            // loop over each array in the filter array, which should be each array generated from each dropdown.
            filterarray.forEach(function(array) {
                if ( arrayContainsAnyFromArray (datafilters, array) ) {
                    // if the data filters has a match in this filter array, add it to the matches array as a match.
                    matches.push("matched");
                } else {
                    // if the data filters does not have a match in this filter array, add it to the matches array as a nonmatch.
                    matches.push("unmatched");
                }
            });
            
            // if ALL filters were matched, display the object.
            if (matches.indexOf("unmatched") === -1) {
                $(this).show();
            }
        });
    } else {
        // the filter array is broken because it should have something, even if the internal arrays are empty.
        // show all objects.
        $allobjects.show();
    }
}

/**
 * Array Contains All Comparison Function
 *
 * Returns TRUE if the first specified array contains
 * ALL elements from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
function arrayContainsAllFromArray (superset, subset) {
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (element) {
        return (superset.indexOf(element) >= 0);
    });
}

/**
 * Array Contains Any Comparison Function
 *
 * Returns TRUE if the first specified array contains
 * ANY elements from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
function arrayContainsAnyFromArray (superset, subset) {
    return subset.some(function (element) {
        return superset.indexOf(element) >= 0;
    });
}

/**
 * All Possible Cases Function
 *
 * Get all possible combinations of an array of arrays or strings.
 * 
 * @param {array} array to make all possible combinations of
 *
 * @returns {array} array of all possible combinations
 * 
 * Ref: https://codereview.stackexchange.com/questions/52119/calculate-all-possible-combinations-of-an-array-of-arrays-or-strings
 */
function allPossibleCases(array, result, index) {
    if (!result) {
        // result doesn't exist, which means this is the first pass.
        result = []; // set the blank array to hold the result.
        index = 0; // set an index because this function can call itself, causing a loop.
        
        // The map() method creates a new array with the results of calling a function for every array element.
        // Every array element is checked to see if it can be pushed into, meaning it is also an array. If it
        // is an array, it gets moved into the new array as is. If it is not an array, it gets moved in as a
        // single-element array. e.g. ['x',['y','z']] becomes [['x'],['y','z']]
        array = array.map(function(element) {
            return element.push ? element : [element];
        });
    }
    
    // if the index is less than the length of the array (because this function is actually a loop)
    if (index < array.length) {
        
        // get the inner array at [index] of the array, then loop over each element inside that inner array.
        array[index].forEach(function(element) {
            
            // slice all items from the outter array beginning at the first item (index 0) into a new array
            var newarray = array.slice(0);
            
            // splice the this element as an array into the new array at index the index location,
            // replacing 1 item, which is whatever item is at that index, which should be an entire array.
            newarray.splice(index, 1, [element]);
            
            // now run again on the new array.
            allPossibleCases(newarray, result, index + 1);
        });
    } else {
        // now that we are done looping, join the array of combinations into a single string separated by spaces,
        // and push it into the result array.
        result.push(array.join(' '));
    }
    
    return result;
}
