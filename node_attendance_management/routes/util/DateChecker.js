
exports.isYear = function(value){
    var pattern = /^[0-9]{4}/;
    var result = false;

    if(value == undefined){
        return result;
    }

    result = isFinite(value)
    if(!result){
        return result;
    }

    result = pattern.test(value);
    if(result){
        if(value < 2000){
            result = false;
        }
    }
    return result;
}

exports.isMonth = function(value){
    var pattern = /^[0-9]{2}/;
    var result = false;

    if(value == undefined){
        return result;
    }

    result = isFinite(value)
    if(!result){
        return result;
    }

    result = pattern.test(value);
    if(result){
        if(value < 0 || value > 12){
            result = false;
        }
    }
    return result;

}