// Authored by Christian C. Salvadó
// https://stackoverflow.com/a/2970667/20073186
export default function getCamelizedString(string: string) {
  return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    if(index === 0) {
      return word.toLowerCase();
    }

    return word.toUpperCase();
  }).replace(/\s+/g, '');
};
