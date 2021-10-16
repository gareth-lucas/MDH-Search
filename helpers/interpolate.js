// substitutes placeholders in templates, like {variable} to the content of data.variable
// "Hi my name is {name}" becomes "Hi my name is ${data.name}".

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