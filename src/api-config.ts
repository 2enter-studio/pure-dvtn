const api_config = {
    "/tn/traffic/1": {
        type: 'fetch',
        keyword: 'traffic_1',
        url: 'https://tntcc.tainan.gov.tw/traffic-platform-itms/api/google/travel-times/GX00005',
        parser: (data: { speed: number }) => { return data.speed.toString(); }
    },
    "/tn/traffic/2": {
        type: 'fetch',
        keyword: 'traffic_2',
        url: 'https://tntcc.tainan.gov.tw/traffic-platform-itms/api/google/travel-times/GX00006',
        parser: (data: { speed: number }) => { return data.speed.toString(); }
    },
    "/tn/traffic/3": {
        type: 'fetch',
        keyword: 'traffic_3',
        url: 'https://tntcc.tainan.gov.tw/traffic-platform-itms/api/google/travel-times/GX00007',
        parser: (data: { speed: number }) => { return data.speed.toString(); }
    },
    "/tn/weather/temp": {
        type: 'fetch',
        keyword: 'temp',
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=22.9925&lon=120.1951&appid=${process.env.OPENWEATHER_API_KEY}&exclude=minutely,hourly,daily,alerts`,
        parser: (data: { current: { temp: string } }) => { return parseInt(data.current.temp || '280').toString(); }
    },
    "/tn/weather/is_rain": {
        type: 'fetch',
        keyword: 'is_rain',
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=22.9925&lon=120.1951&appid=${process.env.OPENWEATHER_API_KEY}&exclude=minutely,hourly,daily,alerts`,
        parser: (data: { current: { humidity: string } }) => { return parseInt(data.current.humidity || '50') > 70; }
    },
}

export default api_config;