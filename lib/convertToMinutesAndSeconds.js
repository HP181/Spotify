const  convertToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes} min ${seconds} sec`;
}

export default convertToMinutesAndSeconds;

