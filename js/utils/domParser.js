export function parseXML(xmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
}

export function parseXMLToArray(xmlDoc, tagName) {
    const items = xmlDoc.getElementsByTagName(tagName);
    return Array.from(items).map(item => ({
        value: item.getElementsByTagName('value')[0].textContent,
        text: item.getElementsByTagName('text')[0].textContent
    }));
}


