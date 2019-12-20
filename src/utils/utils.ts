const MILLISECONDS_IN_SECONDS: number = 1000;

export default function getTimeInSeconds(date: Date) {
    return getSecondsFromMilliseconds(date.getTime());
}

function getSecondsFromMilliseconds(milliseconds: number) {
    return milliseconds / MILLISECONDS_IN_SECONDS;
}
