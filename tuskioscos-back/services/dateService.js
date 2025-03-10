const { parse } = require("date-fns");

exports.parseDate = (date) => {
    return parse(date, "dd/MM/yyyy", new Date());
};
