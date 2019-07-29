
class Helper {
    findDuplicatesInArray(inputArray) {
        return inputArray.reduce(function (acc, el, i, arr) {
            if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
            return acc;
        }, []);
    }
}

module.exports = Helper;