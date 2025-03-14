const { parseISO } = require("date-fns");

exports.parseDate = (date) => {
    return parseISO(date);
};
