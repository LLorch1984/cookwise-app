
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday','Wednesday', 'Thursday','Friday','Saturday'];

module.exports = () => {
    const numericDay = new Date().getDay();

    return WEEKDAYS[numericDay].toLowerCase();

}

