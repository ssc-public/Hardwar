
function readFileAsText(link) { //Gets file link string and returns file text
    let fileText = "";
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", link, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status === 0){
                fileText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return fileText;
}

function saveObject(object, name) {
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(object)));
    pom.setAttribute('download', name);

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}