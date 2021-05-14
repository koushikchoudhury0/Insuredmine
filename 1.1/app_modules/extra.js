module.exports = {
    
    GroupBy: (xs, key) => {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
    },

    CSV2JSON: (headers, dataCSVArr) => {
        return dataCSVArr.map(CSD => {
            let fields = CSD.split(",")
            let o = {}
            headers.map((h, i) => o[h] = fields[i])
            return o
        })
    },

    sleep: (delay) => {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }
}