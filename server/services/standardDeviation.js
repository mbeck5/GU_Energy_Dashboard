/**
 * Created by Tyler on 12/10/2014.
 */

var property = "consumption";   //attribute of row that holds consumption data
var dev_bounds = 3;

function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value[property];
    }, 0);

    return sum / data.length;
}

function standardDeviation(values, avg){
    var squareDiffs = values.map(function(value){
        var diff = value[property] - avg;
        return diff * diff;
    });

    //take average of squareDiffs
    var avgSquareDiff = squareDiffs.reduce(function(sum, value){
        return sum + value;
    }, 0) / squareDiffs.length;

    return Math.sqrt(avgSquareDiff);
}

exports.standardDeviationFilter = function(data) {
    var avg = average(data);
    var stdDev = standardDeviation(data, avg);
    var low = avg - (dev_bounds * stdDev);
    var high = avg + (dev_bounds * stdDev);

    return data.filter(function (element) {
        return (element[property] > low) && (element[property] < high);
    });
};
