const requestFullscreen = () => {
    const element = document.documentElement;
    const requestMethod = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;
    if (requestMethod) {
        requestMethod.call(element);
    } else {
        console.log('Fullscreen API is not supported.');
    }
}