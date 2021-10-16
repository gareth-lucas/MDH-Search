const interpolate = (template, data) => {

    const fieldsRegexp = new RegExp("{(.*?)}", "gm");
    var p;
    do {
        p = fieldsRegexp.exec(template);
        if (p) {
            template = template.replace(p[0], data[p[1]]);
        }
    }
    while (p);

    return template;
}

module.exports = interpolate;