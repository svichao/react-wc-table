function getPathSegments(path) {
  const pathArray = path.split('.');
  const parts = [];

  for (let i = 0; i < pathArray.length; i++) {
    let p = pathArray[i];

    while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = `${p.slice(0, -1) }.`;
      p += pathArray[++i];
    }

    parts.push(p);
  }

  return parts;
}

// changed from https://github.com/sindresorhus/dot-prop/blob/master/index.js
export function getValue(object, path, defaultValue) {
  if (
    object === null ||
    typeof object !== 'object' ||
    typeof path !== 'string'
  ) {
    return defaultValue;
  }

  const pathArray = getPathSegments(path);

  for (let i = 0; i < pathArray.length; i++) {
    if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
      return defaultValue;
    }

    object = object[pathArray[i]];

    if (object === undefined || object === null) {
      if (i !== pathArray.length - 1) {
        return defaultValue;
      }

      break;
    }
  }

  return object;
}