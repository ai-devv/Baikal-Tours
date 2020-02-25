import { parseDate } from "./parsers.js";

export {
    parseFilterDataForAdmin,
    parseFilterData,
    setFilterData,
    setFilterFromUrl,
    showActiveFilters
}

function setFilterData(res) {
    let data = [];

    for (let i = 0; i < res.length; i++) {
        data.push({
            id: res[i].id,
            value: res[i].name,
            active: false
        });
    }

    return data;
}

function parseFilterData(filter) {
    let params = {
        filter: "",
    }, arrData, dateStart, dateEnd;

    if (filter[0][0].active) {
        dateStart = new Date(filter[0][0].value).toISOString();
        params.dateStart = parseDate(new Date(dateStart));
    }

    if (filter[0][1].active) {
        dateEnd = new Date(filter[0][1].value).toISOString();
        params.dateEnd = parseDate(new Date(dateEnd));
    }

    arrData = getActiveOption(filter[1]);
    if (arrData.length !== 0) params.locations = arrData;

    arrData = getActiveOption(filter[2]);
    if (arrData.length !== 0) params.companions = arrData;

    arrData = getActiveOption(filter[3]);
    if (arrData.length !== 0) params.subjects = arrData;

    if (filter[4][0].active) params.priceMin = parseInt(filter[4][0].value);

    if (filter[4][1].active) params.priceMax = parseInt(filter[4][1].value);

    return params;
}

function parseFilterDataForAdmin(filter) {

    let params = {
        filter: "",
        allStatuses: ""
    }, arrData;

    if(filter[0][0].active) params.search = encodeURIComponent(filter[0][0].value)

    arrData = getActiveOption(filter[1])
    if (arrData.length !== 0) params.subjects = arrData;

    arrData = getActiveOption(filter[2]);
    if (arrData.length !== 0) params.locations = arrData;

    return params;
}

function getActiveOption(filter) {
    var data = [];
    for (var i = 0; i < filter.length; i++) {
        if (filter[i].active) data.push(filter[i].id);
    }
    return data;
}

function setFilterFromUrl(params, filter) {
    for (let i = 0; i < params.length; i++) {
        for (let j = 0; j < filter.length; j++) {
            if (parseInt(params[i]) === filter[j].id) {
                filter[j].active = true;
                break;
            }
        }
    }

    return filter;
}

function showActiveFilters(filter){
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].length; j++) {
        if (filter[i][j].active) {
          return true;
        }
      }
    }

    return false;
}