const   fetch = require('node-fetch');
const   KEY = 'b6cddc5f8b78ee40f784713d290ddbfa';
const   URL = `https://api.openweathermap.org/data/2.5/onecall?lat=55.761665&lon=37.606667&appid=${KEY}`;
const options = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	timezone: 'UTC'
};

fetch(URL)
.then(data => data.json())
.then(data => processData(data.daily))
.catch(err => console.log(err))

const formatDate = unixDate => {
    const date = new Date(unixDate * 1000);

    return date.toLocaleString("ru", options)
}

const fromKtoC = tempK => tempK - 273.15

const maxPressure = data => {
    const arr = data.slice(0, 5).map(item => ({
        date: formatDate(item.dt),
        pressure: item.pressure
    }))

    return arr
}

const tempDifference = data => {
    const obj = data.reduce((a, b) => (
        Math.abs(a.temp.morn - a.temp.night) < Math.abs(b.temp.morn - b.temp.night) ?
            a : b
    ));

    return {date: formatDate(obj.dt), morn: obj.temp.morn, night: obj.temp.night}
}

const logPressure = pressure => pressure.map(item => {
    console.log(item.date + '\n' + item.pressure);
})

const processData = data => {
    const pressure = maxPressure(data);
    const temp = tempDifference(data);

    console.log('Максимальное давление за предстоящие 5 дней (включая текущий):');
    logPressure(pressure)
    console.log(
        'День с минимальной разницей между ночной (night) и утренней (morn) температурой:\n' +
        temp.date + '\n'+
        'Morn: ' + fromKtoC(temp.morn).toFixed(2) + 'C' + '\n' +
        'Night: ' + fromKtoC(temp.night).toFixed(2) + 'C'
    )
}