export function choiceLanguage(isEnglish, en, ch, defaultDescription) {
  
  //Only Chinese
  if (!en && ch) return ch;
  
  //Only English
  if (en && !ch) return en;

  //Both Empty
  if (!en && !ch && defaultDescription) return defaultDescription; //Both Empty
  if (!en && !ch) return null;

  //Both Not Empty
  if (isEnglish) return en;
  if (!isEnglish) return ch;
}
