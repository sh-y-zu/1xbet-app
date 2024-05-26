const getPeriod = (rounds = 1500, days = 30, hours = 24) => {
    return ( 60 / ((rounds / days) / hours) )* 60 * 1000
}

const Timer = setInterval(() => {
    
}, getPeriod())


