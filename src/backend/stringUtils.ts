export class StringUtils {
  public static trim(stringToTrim: string, characterMask: string) {
    const charlist = this.parseCharlist(characterMask)
    const re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g')
    return stringToTrim.replace(re, '')
  }
  public static ltrim(stringToTrim: string, characterMask: string) {
    return stringToTrim.replace(/^\s+/, '')
  }
  public static rtrim(stringToTrim: string, characterMask: string) {
    const charlist = this.parseCharlist(characterMask)
    const re = new RegExp('[' + charlist + ']+$', 'g')
    return stringToTrim.replace(re, '')
  }

  private static parseCharlist(charlist: string) {
    return !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '\\$1')
  }
}
