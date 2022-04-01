import moment from "moment";

export function groupByMonth(data) {
    const months = {};

    if (data instanceof Array) {
        data?.forEach(item => {
            const date = moment(item.createdAt).month();

            if (months[date]) {
                months[date].push(item);
            } else {
                months[date] = [item];
            }
        });
    }

    return months;
}

export function getTodayData(data) {
    return data.filter(item => moment(item.date).isSame(moment(), 'day'));
}