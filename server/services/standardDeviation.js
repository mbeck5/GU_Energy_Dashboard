/**
 * Created by Tyler on 12/10/2014.
 */

var dev_bounds = 3;

function average(data, property){
    var sum = data.reduce(function(sum, value){
        return sum + value[property];
    }, 0);

    return sum / data.length;
}

function standardDeviation(values, property){
    var avg = average(values);

    var squareDiffs = values.map(function(value){
        var diff = value[property] - avg;
        return diff * diff;
    });

    var avgSquareDiff = average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
}

function standardDeviationFilter(data, property) {
    var avg = average(data, property);
    var stdDev = standardDeviation(data, property);
    var low = avg - (dev_bounds * stdDev);
    var hi = avg + (dev_bounds * stdDev);

    return data.filter(function (element) {
        return (element > low) && (element < hi);
    });
}